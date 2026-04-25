"use client";

import { useEffect, useMemo, useState } from "react";

import { QuestionCard } from "@/components/question-card";
import { QuestionForm } from "@/components/question-form";
import { supabase } from "@/lib/supabase";
import type { Question } from "@/types/database";

function sortQuestions(list: Question[]) {
  return [...list].sort((a, b) => {
    if (b.likes !== a.likes) return b.likes - a.likes;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error: fetchError } = await supabase
        .from("questions")
        .select("*")
        .order("likes", { ascending: false })
        .order("created_at", { ascending: false });

      if (cancelled) return;
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setQuestions(data ?? []);
      }
      setLoading(false);
    }

    load();

    const channel = supabase
      .channel("questions-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "questions" },
        (payload) => {
          const next = payload.new as Question;
          setQuestions((prev) =>
            prev.some((q) => q.id === next.id)
              ? prev
              : sortQuestions([next, ...prev])
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "questions" },
        (payload) => {
          const next = payload.new as Question;
          setQuestions((prev) =>
            sortQuestions(prev.map((q) => (q.id === next.id ? next : q)))
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "questions" },
        (payload) => {
          const old = payload.old as Pick<Question, "id">;
          setQuestions((prev) => prev.filter((q) => q.id !== old.id));
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  const totalLikes = useMemo(
    () => questions.reduce((sum, q) => sum + q.likes, 0),
    [questions]
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-16">
        <header className="flex flex-col gap-2 text-center">
          <h1 className="bg-linear-to-r from-fuchsia-500 via-pink-500 to-amber-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            🎯 ClassWall 問答牆
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            匿名發問、即時更新、按讚衝榜。共 {questions.length} 題 ·{" "}
            {totalLikes} 個 +1
          </p>
        </header>

        <section aria-label="發問區">
          <QuestionForm />
        </section>

        <section aria-label="問題列表" className="flex flex-col gap-3">
          {loading ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              載入中...
            </p>
          ) : error ? (
            <p className="py-12 text-center text-sm text-destructive">
              讀取失敗：{error}
            </p>
          ) : questions.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              還沒有人發問，你來當第一個！
            </p>
          ) : (
            questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))
          )}
        </section>
      </main>
    </div>
  );
}
