"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { addNote, removeNote, updateNote } from "@/lib/notes";
import { sanitizeNoteHtml } from "@/lib/sanitize";
import { stripHtml } from "@/lib/text";

const TextSchema = z.string().trim().max(3_000_000); // generous: a few resized images fit in one note
const TitleSchema = z.string().trim().max(120);

function titleOrDefault(raw: FormDataEntryValue | null): string {
  const parsed = TitleSchema.safeParse(raw);
  const value = parsed.success ? parsed.data : "";
  return value || "Untitled note";
}

export interface AddNoteState { error: string; saved: boolean }

export async function addNoteAction(_prev: AddNoteState, formData: FormData): Promise<AddNoteState> {
  const session = await auth();
  if (!session?.user) return { error: "You need to be logged in.", saved: false };
  const text = TextSchema.safeParse(formData.get("text"));
  if (!text.success || !stripHtml(text.data)) return { error: "A note can't be empty.", saved: false };
  await addNote(session.user.id, titleOrDefault(formData.get("title")), sanitizeNoteHtml(text.data));
  revalidatePath("/notes");
  return { error: "", saved: true };
}

export interface UpdateNoteState { error: string; saved: boolean }

export async function updateNoteAction(_prev: UpdateNoteState, formData: FormData): Promise<UpdateNoteState> {
  const session = await auth();
  if (!session?.user) return { error: "You need to be logged in.", saved: false };
  const id = z.string().uuid().safeParse(formData.get("id"));
  const text = TextSchema.safeParse(formData.get("text"));
  if (!id.success) return { error: "Something went wrong. Reopen the note and try again.", saved: false };
  if (!text.success || !stripHtml(text.data)) return { error: "A note can't be empty.", saved: false };
  await updateNote(session.user.id, id.data, titleOrDefault(formData.get("title")), sanitizeNoteHtml(text.data));
  revalidatePath("/notes");
  return { error: "", saved: true };
}

export async function deleteNoteAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) return;
  const parsed = z.string().uuid().safeParse(formData.get("id"));
  if (!parsed.success) return;
  await removeNote(session.user.id, parsed.data);
  revalidatePath("/notes");
}
