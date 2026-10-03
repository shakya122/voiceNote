"use client";
import { useEffect } from "react";

export default function PreferencesApplier() {
  useEffect(() => {
    const textSize = localStorage.getItem("voicenotes.textSize");
    const theme = localStorage.getItem("voicenotes.theme");
    if (textSize) document.documentElement.dataset.textSize = textSize;
    if (theme && theme !== "system") document.documentElement.dataset.theme = theme;
  }, []);
  return null;
}
