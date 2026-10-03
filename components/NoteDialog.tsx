"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { updateNoteAction, deleteNoteAction, type UpdateNoteState } from "@/app/actions";
import ReadAloud from "./ReadAloud";
import RichEditor, { type RichEditorHandle } from "./RichEditor";
import { stripHtml } from "@/lib/text";
import type { Note } from "@/lib/notes";

const initial: UpdateNoteState = { error: "", saved: false };

export default function NoteDialog({ note, onClose }: { note: Note | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const editorRef = useRef<RichEditorHandle>(null);
  const [title, setTitle] = useState(note?.title ?? "");
  const [plainText, setPlainText] = useState(note ? stripHtml(note.text) : "");
  const [dirty, setDirty] = useState(false);
  const [state, action, pending] = useActionState(updateNoteAction, initial);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (note) {
      setTitle(note.title);
      setPlainText(stripHtml(note.text));
      setDirty(false);
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [note]);

  // Reset the "dirty" flag whenever a save actually completes, so a fresh error (if any)
  // can show again, rather than one left over from an earlier attempt.
  useEffect(() => { setDirty(false); }, [state]);

  return (
    <dialog ref={ref} className="note-page" aria-labelledby="note-page-title" onClose={onClose} onCancel={onClose}>
      {note && (
        <>
          <div className="note-page-spine" aria-hidden="true" />
          <div className="note-page-body">
            <div className="note-page-head">
              <h2 id="note-page-title" className="visually-hidden">Note: {title}</h2>
              <button type="button" className="secondary" onClick={() => ref.current?.close()}>Close</button>
            </div>
            <p className="note-page-date">Saved {new Date(note.createdAt).toLocaleString("en-GB")}</p>

            <form action={action} key={note.id}>
              <input type="hidden" name="id" value={note.id} />
              <label htmlFor="note-page-name">Name</label>
              <input
                id="note-page-name"
                name="title"
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setDirty(true); }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); editorRef.current?.focus(); } }}
                maxLength={120}
                placeholder="Untitled note"
              />
              <RichEditor ref={editorRef} name="text" initialHtml={note.text} label="Note text" onChangeText={(t) => { setPlainText(t); setDirty(true); }} />
              <div className="row">
                <button type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</button>
                <ReadAloud text={plainText} />
              </div>
              <p role="status" aria-live="polite" className="status">
                {!dirty && state.error && <span className="error">{state.error}</span>}
                {state.saved && !state.error && "Saved."}
              </p>
            </form>

            <form action={deleteNoteAction} onSubmit={() => ref.current?.close()}>
              <input type="hidden" name="id" value={note.id} />
              <button type="submit" className="danger">Delete this note</button>
            </form>
          </div>
        </>
      )}
    </dialog>
  );
}
