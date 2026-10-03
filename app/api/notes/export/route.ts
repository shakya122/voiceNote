import { auth } from "@/lib/auth";
import { getNotes } from "@/lib/notes";
import { stripHtml } from "@/lib/text";

export async function GET() {
  const session = await auth();
  if (!session?.user) return new Response("Not logged in", { status: 401 });

  const notes = await getNotes(session.user.id);
  const body = notes.length
    ? notes.map((n) => `${n.title}\n${new Date(n.createdAt).toLocaleString("en-GB")}\n${stripHtml(n.text)}\n`).join("\n---\n\n")
    : "You have no notes yet.";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="voicenotes-export.txt"',
    },
  });
}
