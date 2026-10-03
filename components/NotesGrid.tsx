"use client";
import { useState } from "react";
import NotebookIcon from "./NotebookIcon";
import NoteDialog from "./NoteDialog";
import type { Note } from "@/lib/notes";

export default function NotesGrid({ notes, compact = false }: { notes: Note[]; compact?: boolean }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = notes.find((n) => n.id === openId) ?? null;

  return (
    <>
      <ul className={compact ? "note-list-compact" : "note-grid"}>
        {notes.map((n) => (
          <li key={n.id}>
            <button type="button" className={compact ? "note-row-btn" : "note-icon-btn"} onClick={() => setOpenId(n.id)}>
              <NotebookIcon small={compact} />
              <span className="note-title-label">{n.title}</span>
              <span className="visually-hidden">, saved {new Date(n.createdAt).toLocaleDateString("en-GB")}. Content hidden until opened — press to read it.</span>
            </button>
          </li>
        ))}
      </ul>
      <NoteDialog note={active} onClose={() => setOpenId(null)} />
    </>
  );
}
