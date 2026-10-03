"use client";
import { useRef, useState } from "react";

interface RecognitionResult { readonly 0: { readonly transcript: string }; readonly isFinal: boolean }
interface RecognitionEvent { resultIndex: number; results: ArrayLike<RecognitionResult> }
interface Recognition {
  continuous: boolean; interimResults: boolean; lang: string;
  onresult: ((e: RecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start(): void; stop(): void;
}
type RecognitionCtor = new () => Recognition;

function explain(code: string): string {
  switch (code) {
    case "not-allowed": return "Microphone is blocked. Click the lock icon next to the web address, allow the microphone, then reload the page.";
    case "service-not-allowed": return "This browser blocks voice input. Use Google Chrome or Microsoft Edge.";
    case "no-speech": return "No speech heard. Press the microphone button and speak right after it says Recording started.";
    case "audio-capture": return "No microphone found. Plug one in and check your sound settings.";
    case "network": return "Voice input needs an internet connection and doesn't work in Brave or other Chromium forks with shields on. Use Chrome or Edge.";
    default: return `Voice input stopped (${code}). Try again.`;
  }
}

/** Press-to-talk hook: onResult fires with the final heard text once per phrase. */
export function useSpeechToText(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");
  const rec = useRef<Recognition | null>(null);

  function toggle() {
    if (listening) { rec.current?.stop(); return; }
    const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) { setMessage("Voice input is not supported in this browser. Try Chrome or Edge."); return; }
    const r = new Ctor();
    r.continuous = false; r.interimResults = false; r.lang = "en-US";
    r.onresult = (e) => {
      let heard = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res?.isFinal) heard += res[0].transcript;
      }
      if (heard.trim()) onResult(heard.trim());
    };
    r.onend = () => { setListening(false); setMessage((m) => (m.startsWith("Recording started") ? "Recording stopped." : m)); };
    r.onerror = (e) => setMessage(explain(e.error));
    rec.current = r;
    r.start();
    setListening(true);
    setMessage("Recording started. Speak now.");
  }

  return { listening, message, toggle };
}
