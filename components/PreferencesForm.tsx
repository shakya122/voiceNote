"use client";
import { useEffect, useState } from "react";
import { listEnglishVoices, speak } from "@/lib/speech";

type TextSize = "normal" | "large" | "xlarge";
type Theme = "system" | "light" | "beige" | "dark";

const THEMES: { value: Theme; label: string; swatch: string }[] = [
  { value: "system", label: "Match device", swatch: "linear-gradient(135deg, #F4FBFA 50%, #12161B 50%)" },
  { value: "light", label: "Light", swatch: "#F4FBFA" },
  { value: "beige", label: "Beige", swatch: "#FBF3E7" },
  { value: "dark", label: "Dark", swatch: "#12161B" },
];

export default function PreferencesForm() {
  const [autoRead, setAutoRead] = useState(true);
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [theme, setTheme] = useState<Theme>("system");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setAutoRead(localStorage.getItem("voicenotes.autoRead") !== "false");
    setTextSize((localStorage.getItem("voicenotes.textSize") as TextSize) || "normal");
    setTheme((localStorage.getItem("voicenotes.theme") as Theme) || "system");
    setVoiceURI(localStorage.getItem("voicenotes.voiceURI") || "");

    const loadVoices = () => setVoices(listEnglishVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  function apply(next: { autoRead?: boolean; textSize?: TextSize; theme?: Theme }) {
    const nextAutoRead = next.autoRead ?? autoRead;
    const nextTextSize = next.textSize ?? textSize;
    const nextTheme = next.theme ?? theme;
    setAutoRead(nextAutoRead);
    setTextSize(nextTextSize);
    setTheme(nextTheme);
    localStorage.setItem("voicenotes.autoRead", String(nextAutoRead));
    localStorage.setItem("voicenotes.textSize", nextTextSize);
    localStorage.setItem("voicenotes.theme", nextTheme);
    document.documentElement.dataset.textSize = nextTextSize;
    if (nextTheme === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = nextTheme;
    setStatus("Saved on this device.");
  }

  function chooseVoice(uri: string) {
    setVoiceURI(uri);
    localStorage.setItem("voicenotes.voiceURI", uri);
    setStatus("Saved on this device.");
  }

  function previewVoice() {
    speak("This is how notes will sound when read aloud.");
  }

  return (
    <div className="profile-form">
      <span>Colour theme</span>
      <div className="theme-swatches" role="radiogroup" aria-label="Colour theme">
        {THEMES.map((t) => (
          <button key={t.value} type="button" role="radio" aria-checked={theme === t.value} className="theme-swatch" style={{ background: t.swatch }} onClick={() => apply({ theme: t.value })}>
            {theme === t.value && <CheckIcon />}
            <span className="visually-hidden">{t.label}</span>
          </button>
        ))}
      </div>

      <label htmlFor="textSize">Text size</label>
      <select id="textSize" value={textSize} onChange={(e) => apply({ textSize: e.target.value as TextSize })}>
        <option value="normal">Normal</option>
        <option value="large">Large</option>
        <option value="xlarge">Extra large</option>
      </select>

      <label htmlFor="voice">Read-aloud voice</label>
      {voices.length === 0 ? (
        <p className="lede">Your browser hasn't reported any voices yet — try reopening this page.</p>
      ) : (
        <div className="row">
          <select id="voice" value={voiceURI} onChange={(e) => chooseVoice(e.target.value)}>
            <option value="">Pick automatically (recommended)</option>
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>{v.name}{v.localService ? "" : " — online"}</option>
            ))}
          </select>
          <button type="button" className="secondary" onClick={previewVoice}>Preview</button>
        </div>
      )}
      <p className="lede">Voices marked "online" are usually smoother than the built-in system ones, if your browser offers any.</p>

      <label className="checkbox-row">
        <input type="checkbox" checked={autoRead} onChange={(e) => apply({ autoRead: e.target.checked })} />
        Read AI answers aloud automatically
      </label>

      <p role="status" aria-live="polite" className="status">{status}</p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12.5 9 18 20 6" stroke="#0E9594" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
