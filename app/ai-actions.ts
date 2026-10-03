"use server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { answerQuestion, summarizeNotes, type AiState } from "@/lib/ai";

const QuestionSchema = z.string().trim().min(1).max(500);

export async function aiAction(_prev: AiState, formData: FormData): Promise<AiState> {
  const session = await auth();
  if (!session?.user) return { answer: "", error: "You need to be logged in." };
  try {
    if (formData.get("mode") === "summarize") return { answer: await summarizeNotes(session.user.id), error: "" };
    const q = QuestionSchema.safeParse(formData.get("question"));
    if (!q.success) return { answer: "", error: "Type a question first, for example: where is my key?" };
    return { answer: await answerQuestion(session.user.id, q.data), error: "" };
  } catch (e) {
    return { answer: "", error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
