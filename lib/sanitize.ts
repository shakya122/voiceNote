const ALLOWED_TAGS = new Set(["B", "STRONG", "I", "EM", "U", "UL", "OL", "LI", "BR", "DIV", "P", "SPAN", "IMG"]);
const DATA_IMAGE = /^data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+/=]+$/;

/**
 * A small allowlist sanitizer for the rich-text editor's output: keeps bold/italic/
 * underline/lists, a validated inline text-colour style, and <img> tags whose src is a
 * genuine base64 image data URL (anything else, including remote URLs or event handler
 * attributes, is stripped). This is deliberately simple because notes are private to
 * their own owner. A real multi-user or shared-content product should use a proper
 * library (e.g. isomorphic-dompurify) instead.
 */
export function sanitizeNoteHtml(html: string): string {
  return html.replace(/<(\/?)([a-zA-Z0-9]+)([^>]*)>/g, (_whole, slash: string, rawTag: string, attrs: string) => {
    const tag = rawTag.toUpperCase();
    if (!ALLOWED_TAGS.has(tag)) return "";
    const closing = slash === "/";

    if (tag === "IMG") {
      if (closing) return "";
      const src = attrs.match(/\bsrc\s*=\s*"([^"]*)"/i)?.[1] ?? attrs.match(/\bsrc\s*=\s*'([^']*)'/i)?.[1];
      if (!src || !DATA_IMAGE.test(src)) return "";
      return `<img src="${src}" alt="" style="max-width:100%;border-radius:8px;" />`;
    }

    if (tag === "SPAN") {
      if (closing) return "</span>";
      const color = attrs.match(/color\s*:\s*(#[0-9a-fA-F]{3,8}|rgb\([0-9,\s]+\))/i)?.[1];
      return color ? `<span style="color:${color}">` : "<span>";
    }

    return closing ? `</${tag.toLowerCase()}>` : `<${tag.toLowerCase()}>`;
  });
}
