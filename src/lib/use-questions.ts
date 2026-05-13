"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabase";
import type { Question } from "@/types/database";

const DEFAULT_PAGE_SIZE = 10;

/**
 * 分頁載入 questions + Realtime 訂閱
 *
 * 策略：
 * - DB 端按 created_at DESC 分頁（穩定，按讚變動不影響）
 * - 顯示時由 page.tsx 在 client 端再依 likes 重排
 * - Realtime INSERT 的新題塞到最前面；UPDATE/DELETE 套用到記憶體 list
 * - 用 idSet 去重避免分頁與 realtime 同時拿到同一筆
 */
export function useQuestions(pageSize = DEFAULT_PAGE_SIZE) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const offsetRef = useRef(0);
  const idSetRef = useRef<Set<string>>(new Set());
  const inFlightRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    const isFirst = offsetRef.current === 0;
    if (isFirst) setLoading(true);
    else setLoadingMore(true);

    const from = offsetRef.current;
    const to = from + pageSize - 1;

    const { data, error: fetchError } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    inFlightRef.current = false;

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    const batch = (data ?? []).filter((q) => {
      if (idSetRef.current.has(q.id)) return false;
      idSetRef.current.add(q.id);
      return true;
    });

    setQuestions((prev) => [...prev, ...batch]);
    offsetRef.current = from + (data?.length ?? 0);
    setHasMore((data?.length ?? 0) === pageSize);
    setLoading(false);
    setLoadingMore(false);
  }, [pageSize]);

  useEffect(() => {
    // 初次載入第一頁
    loadMore();

    // Realtime 訂閱
    const channel = supabase
      .channel("questions-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "questions" },
        (payload) => {
          const next = payload.new as Question;
          if (idSetRef.current.has(next.id)) return;
          idSetRef.current.add(next.id);
          // 新題永遠塞到最前面（不影響 offset，因為它不在 DB range 內）
          setQuestions((prev) => [next, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "questions" },
        (payload) => {
          const next = payload.new as Question;
          setQuestions((prev) =>
            prev.map((q) => (q.id === next.id ? next : q))
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "questions" },
        (payload) => {
          const old = payload.old as Pick<Question, "id">;
          idSetRef.current.delete(old.id);
          setQuestions((prev) => prev.filter((q) => q.id !== old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // 只在 mount 時跑一次；loadMore 因為 useCallback 穩定
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { questions, loading, loadingMore, hasMore, error, loadMore };
}
