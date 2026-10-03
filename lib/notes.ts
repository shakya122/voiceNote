import { z } from "zod";
import { db } from "@/lib/db";

const NoteRow = z.object({ id: z.string(), title: z.string(), text: z.string(), created_at: z.union([z.string(), z.date()]) });
export interface Note { id: string; title: string; text: string; createdAt: string }

function toNote(row: z.infer<typeof NoteRow>): Note {
  const createdAt = row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at;
  return { id: row.id, title: row.title, text: row.text, createdAt };
}

/** Search matches the note's name only, not its (hidden) body text. */
export async function getNotes(userId: string, titleQuery?: string): Promise<Note[]> {
  const q = titleQuery?.trim();
  const res = q
    ? await db().query("select id, title, text, created_at from notes where user_id = $1 and title ilike $2 order by created_at desc", [userId, `%${q}%`])
    : await db().query("select id, title, text, created_at from notes where user_id = $1 order by created_at desc", [userId]);
  return res.rows.map((r) => toNote(NoteRow.parse(r)));
}

export async function addNote(userId: string, title: string, text: string): Promise<void> {
  await db().query("insert into notes (user_id, title, text) values ($1, $2, $3)", [userId, title, text]);
}

export async function updateNote(userId: string, id: string, title: string, text: string): Promise<void> {
  await db().query("update notes set title = $1, text = $2 where id = $3 and user_id = $4", [title, text, id, userId]);
}

export async function removeNote(userId: string, id: string): Promise<void> {
  await db().query("delete from notes where id = $1 and user_id = $2", [id, userId]);
}
