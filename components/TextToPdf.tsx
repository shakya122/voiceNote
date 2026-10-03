"use client";
import { useState } from "react";

export default function TextToPdf() {
  const [title, setTitle] = useState("My note");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function convert() {
    if (!text.trim()) { setStatus("Type or paste some text first."); return; }
    setBusy(true);
    setStatus("Building your PDF…");
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 56;
      const width = doc.internal.pageSize.getWidth() - margin * 2;
      const pageHeight = doc.internal.pageSize.getHeight() - margin * 2;
      let y = margin;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      const titleLines = doc.splitTextToSize(title || "Untitled", width);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 22 + 12;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const bodyLines: string[] = doc.splitTextToSize(text, width);
      const lineHeight = 16;
      for (const line of bodyLines) {
        if (y > margin + pageHeight) { doc.addPage(); y = margin; }
        doc.text(line, margin, y);
        y += lineHeight;
      }

      doc.save(`${(title || "note").trim().replace(/[^\w\- ]+/g, "") || "note"}.pdf`);
      setStatus("Downloaded.");
    } catch {
      setStatus("Something went wrong building the PDF. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="tool-card">
      <label htmlFor="pdf-title">Title</label>
      <input id="pdf-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />

      <label htmlFor="pdf-text">Text</label>
      <textarea id="pdf-text" rows={12} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type the text you want as a PDF" />

      <div className="row">
        <button type="button" onClick={convert} disabled={busy}>{busy ? "Building…" : "Convert to PDF"}</button>
      </div>
      <p role="status" aria-live="polite" className="status">{status}</p>
      <p className="lede">This runs entirely in your browser — nothing is uploaded anywhere.</p>
    </div>
  );
}
