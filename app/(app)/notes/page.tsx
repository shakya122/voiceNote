import { auth } from "@/lib/auth";
import { getNotes } from "@/lib/notes";
import { getUserById } from "@/lib/users";
import NoteForm from "@/components/NoteForm";
import AskNotes from "@/components/AskNotes";
import NotesGrid from "@/components/NotesGrid";

export default async function NotesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await auth();
  const userId = session!.user.id;
  const [{ q }, user, notes] = await Promise.all([searchParams, getUserById(userId), getNotes(userId)]);
  const shown = q ? await getNotes(userId, q) : notes;
  const firstName = (user?.name ?? "there").split(" ")[0];

  return (
    <div className="notes-layout">
      <div className="notes-main">
        <h1>Hello, {firstName}</h1>
        <p className="lede">
          {notes.length === 0 ? "You have no notes yet." : `You have ${notes.length} note${notes.length === 1 ? "" : "s"} saved.`}
        </p>

        <NoteForm />
        <AskNotes />
      </div>

      <aside className="notes-aside" aria-label="Your notes and tools">
        <form method="get" role="search" className="search">
          <label htmlFor="q">Search by note name</label>
          <div className="row">
            <input id="q" name="q" type="search" defaultValue={q ?? ""} placeholder="for example: bank details" />
            <button type="submit">Search</button>
          </div>
        </form>

        <div className="aside-heading-row">
          <h2 className="aside-heading">{q ? `Results for “${q}”` : "Previous notes"}</h2>
          {q && <a href="/notes" className="back-link">Clear search</a>}
        </div>
        {q && <p className="lede">Showing notes whose name matches “{q}”. New notes won't appear here until you clear the search.</p>}
        {shown.length === 0 ? (
          <p className="lede">{q ? "No notes match that search." : "Nothing saved yet — write your first note."}</p>
        ) : (
          <NotesGrid notes={shown} compact />
        )}

        <h2 className="aside-heading">Tools</h2>
        <ul className="aside-tools">
          <li><a href="/api/notes/export">Download all notes (.txt)</a></li>
          <li><a href="/tools/text-to-pdf">Text to PDF converter</a></li>
        </ul>
      </aside>
    </div>
  );
}
