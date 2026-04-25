"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import type { Question } from "@/types/database";

type Props = {
  question: Question;
};

export function QuestionCard({ question }: Props) {
  const [pending, setPending] = useState(false);
  const isHot = question.likes >= 5;

  async function handleLike() {
    if (pending) return;
    setPending(true);
    const { error } = await supabase
      .from("questions")
      .update({ likes: question.likes + 1 })
      .eq("id", question.id);
    setPending(false);
    if (error) console.error("按讚失敗", error);
  }

  return (
    <Card>
      <CardContent>
        <p className="whitespace-pre-wrap text-base leading-relaxed">
          {isHot ? <span className="mr-1">🔥</span> : null}
          {question.content}
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-xs text-muted-foreground">
          {new Date(question.created_at).toLocaleString("zh-TW", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLike}
          disabled={pending}
        >
          👍 我也想問 +{question.likes}
        </Button>
      </CardFooter>
    </Card>
  );
}
