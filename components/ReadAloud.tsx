"use client";
import { useEffect, useState } from "react";
import { speak } from "@/lib/speech";

export default function ReadAloud({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!speaking) return;
    const handle = window.setInterval(() => {
      if (!window.speechSynthesis.speaking) setSpeaking(false);
    }, 300);
    return () => window.clearInterval(handle);
  }, [speaking]);

  function toggle() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    speak(text);
    setSpeaking(true);
  }

  return (
    <button type="button" className="secondary" onClick={toggle} aria-pressed={speaking}>
      {speaking ? "Stop reading" : "Read aloud"}
    </button>
  );
}
