import Link from "next/link";

export default function ToolsPage() {
  return (
    <div className="page">
      <Link href="/notes" className="back-link">← Back to notes</Link>
      <h1>Tools</h1>
      <div className="tools-grid">
        <Link href="/tools/text-to-pdf" className="tool-tile">
          <h2>Text to PDF</h2>
          <p>Turn any text into a downloadable PDF, right in your browser.</p>
        </Link>
        <div className="tool-tile tool-tile-soon">
          <h2>AI Paraphraser</h2>
          <p>Coming soon.</p>
        </div>
        <Link href="/notes" className="tool-tile">
          <h2>Ask &amp; summarize notes</h2>
          <p>Already on your notes page — ask a question or summarize everything you've saved.</p>
        </Link>
      </div>
    </div>
  );
}
