"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { addNoteAction, type AddNoteState } from "@/app/actions";
import { useSpeechToText } from "@/lib/useSpeechToText";
import RichEditor, { type RichEditorHandle } from "./RichEditor";

const initial: AddNoteState = { error: "", saved: false };

export default function NoteForm() {
  const editorRef = useRef<RichEditorHandle>(null);
  const [title, setTitle] = useState("");
  const [formKey, setFormKey] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [state, action, pending] = useActionState(addNoteAction, initial);
  const { listening, message, toggle } = useSpeechToText((heard) => editorRef.current?.insertText(heard));

  // Only clear the form once the save genuinely succeeded — never on error, and never
  // optimistically before we actually know the result. Also drop the "dirty" flag so a
  // fresh error can show again on the next failed attempt.
  useEffect(() => {
    setDirty(false);
    if (state.saved) {
      setTitle("");
      setFormKey((k) => k + 1); // forces a fresh RichEditor instance, clearing it
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={action} className="composer" key={formKey}>
      <h3 className="composer-label">New note</h3>
      <label htmlFor="note-title">Name</label>
      <input
        id="note-title"
        name="title"
        type="text"
        value={title}
        onChange={(e) => { setTitle(e.target.value); setDirty(true); }}
        onKeyDown={(e) => {
          // Enter inside a text field submits the form by default — easy to trigger by
          // accident while naming a note before you've written anything. Move focus to
          // the note body instead, rather than submitting early with an empty note.
          if (e.key === "Enter") { e.preventDefault(); editorRef.current?.focus(); }
        }}
        maxLength={120}
        placeholder="Untitled note"
      />
      <RichEditor ref={editorRef} name="text" initialHtml="" label="New note" onChangeText={() => setDirty(true)} />
      <div className="row">
        <button type="submit" disabled={pending}>{pending ? "Saving…" : "Save note"}</button>
        <button type="button" className="secondary mic-btn" onClick={toggle} aria-pressed={listening}>
          <MicIcon />
          {listening ? "Stop recording" : "Start recording"}
        </button>
      </div>
      <p role="status" aria-live="polite" className="status">
        {message}
        {!message && !dirty && state.error && <span className="error">{state.error}</span>}
        {!message && !state.error && state.saved && "Note saved."}
      </p>
    </form>
  );
}

export function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
