"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

export function QuestionForm() {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase
      .from("questions")
      .insert({ content: trimmed });

    setSubmitting(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setContent("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="想問什麼？匿名發問，全班都看得到..."
        maxLength={500}
        rows={3}
        disabled={submitting}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {content.length}/500
        </span>
        <Button
          type="submit"
          size="lg"
          disabled={submitting || content.trim().length === 0}
        >
          {submitting ? "送出中..." : "送出問題"}
        </Button>
      </div>
      {error ? (
        <p className="text-sm text-destructive">送出失敗：{error}</p>
      ) : null}
    </form>
  );
}
