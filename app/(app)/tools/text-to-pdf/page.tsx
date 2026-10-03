import Link from "next/link";
import TextToPdf from "@/components/TextToPdf";

export default function TextToPdfPage() {
  return (
    <div className="page">
      <Link href="/tools" className="back-link">← Back to tools</Link>
      <h1>Text to PDF</h1>
      <p className="lede">Turn any text — including a note you've copied — into a downloadable PDF.</p>
      <TextToPdf />
    </div>
  );
}
