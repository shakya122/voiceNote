"use client";

function getVoices(): SpeechSynthesisVoice[] {
  return typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis.getVoices() : [];
}

function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  let s = 0;
  if (name.includes("natural")) s += 5;
  if (name.includes("neural")) s += 5;
  if (name.includes("online")) s += 3;
  if (name.includes("google")) s += 2;
  if (!v.localService) s += 1;
  if (/\b(david|zira|mark)\b/.test(name)) s -= 2; // older, more robotic system voices
  return s;
}

/** Picks the saved voice if set, otherwise the best-sounding available English voice. */
export function pickVoice(): SpeechSynthesisVoice | null {
  const voices = getVoices();
  if (voices.length === 0) return null;
  const savedURI = typeof window !== "undefined" ? localStorage.getItem("voicenotes.voiceURI") : null;
  if (savedURI) {
    const match = voices.find((v) => v.voiceURI === savedURI);
    if (match) return match;
  }
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = english.length ? english : voices;
  return [...pool].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] ?? null;
}

export function listEnglishVoices(): SpeechSynthesisVoice[] {
  const voices = getVoices();
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  return english.length ? english : voices;
}

/** Speaks text with the chosen/best voice. Returns a function that cancels this exact utterance. */
export function speak(text: string): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !text.trim()) return () => {};
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = 0.97;
  utterance.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return () => window.speechSynthesis.cancel();
}
