"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { aiAction } from "@/app/ai-actions";
import type { AiState } from "@/lib/ai";
import { useSpeechToText } from "@/lib/useSpeechToText";
import { speak } from "@/lib/speech";
import { MicIcon } from "./NoteForm";
import ReadAloud from "./ReadAloud";

const initial: AiState = { answer: "", error: "" };

export default function AskNotes() {
  const [state, action, pending] = useActionState(aiAction, initial);
  const [question, setQuestion] = useState("");
  const { listening, message, toggle } = useSpeechToText((heard) => setQuestion((q) => (q ? q + " " : "") + heard));

  // Clear the question once a fresh answer (or error) comes back, not before —
  // that way it's still visible while "Thinking…" is shown.
  useEffect(() => {
    if (!pending) setQuestion("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Auto-read the answer aloud. The cleanup function cancels speech if this effect
  // re-runs before finishing (e.g. React's dev-mode double-invoke), which is what
  // was causing the overlapping/looping speech.
  useEffect(() => {
    if (!state.answer) return;
    const autoRead = localStorage.getItem("voicenotes.autoRead") !== "false"; // on by default
    if (!autoRead) return;
    const cancel = speak(state.answer);
    return cancel;
  }, [state.answer]);

  return (
    <form action={action} className="ask">
      <label htmlFor="question">Ask your notes</label>
      <div className="row">
        <input id="question" name="question" type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="for example: where is my key?" />
        <button type="button" className="secondary mic-btn" onClick={toggle} aria-pressed={listening} aria-label={listening ? "Stop recording your question" : "Record your question"}>
          <MicIcon />
        </button>
        <button type="submit" name="mode" value="ask" disabled={pending}>Ask</button>
        <button type="submit" name="mode" value="summarize" className="secondary" disabled={pending}>Summarize all notes</button>
      </div>
      <p role="status" aria-live="polite" className="status">{message}</p>
      <div role="status" aria-live="polite" className="answer">
        {pending && <p>Thinking…</p>}
        {!pending && state.error && <p className="error">{state.error}</p>}
        {!pending && state.answer && (
          <>
            <p>{state.answer}</p>
            <ReadAloud text={state.answer} />
          </>
        )}
      </div>
    </form>
  );
}
