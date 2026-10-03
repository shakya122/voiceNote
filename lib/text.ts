/** Strips HTML tags from rich-text note content, for the AI, downloads, and read-aloud. */
export function stripHtml(html: string): string {
  return html
    .replace(/<(br|\/p|\/div|\/li)\s*\/?>(?!$)/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
