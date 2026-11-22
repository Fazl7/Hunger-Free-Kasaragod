/**
 * Tiny, safe Markdown parser for press releases (no dependency, no raw HTML).
 * Supported: paragraphs (blank line), line breaks, ## / ### headings,
 * **bold**, *italic* / _italic_, [links](https://…), - / * bullet lists,
 * 1. numbered lists and > quotes. Anything else is shown as plain text.
 * The output is a block tree rendered by <MarkdownBody/> as React elements,
 * so pasted text can never inject HTML or scripts.
 */

export type Inline =
  | { t: "text"; v: string }
  | { t: "strong"; c: Inline[] }
  | { t: "em"; c: Inline[] }
  | { t: "link"; href: string; c: Inline[] }
  | { t: "br" };

export type Block =
  | { t: "p"; c: Inline[] }
  | { t: "h"; level: 2 | 3; c: Inline[] }
  | { t: "ul" | "ol"; items: Inline[][] }
  | { t: "quote"; c: Inline[] };

const SAFE_HREF = /^(https?:\/\/|mailto:|\/)/i;

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let buf = "";
  const flush = () => {
    if (buf) out.push({ t: "text", v: buf });
    buf = "";
  };
  let i = 0;
  while (i < src.length) {
    const rest = src.slice(i);
    let m: RegExpMatchArray | null;
    if (src[i] === "\n") {
      flush();
      out.push({ t: "br" });
      i++;
    } else if ((m = rest.match(/^\*\*(.+?)\*\*/s))) {
      flush();
      out.push({ t: "strong", c: parseInline(m[1]) });
      i += m[0].length;
    } else if ((m = rest.match(/^(\*|_)(?!\s)(.+?)(?<!\s)\1(?![A-Za-z0-9])/s))) {
      flush();
      out.push({ t: "em", c: parseInline(m[2]) });
      i += m[0].length;
    } else if ((m = rest.match(/^\[([^\]]+)\]\(([^)\s]+)\)/))) {
      flush();
      if (SAFE_HREF.test(m[2])) out.push({ t: "link", href: m[2], c: parseInline(m[1]) });
      else out.push({ t: "text", v: m[1] });
      i += m[0].length;
    } else {
      buf += src[i];
      i++;
    }
  }
  flush();
  return out;
}

export function parseMarkdown(src: string): Block[] {
  const blocks: Block[] = [];
  const chunks = src.replace(/\r\n?/g, "\n").trim().split(/\n\s*\n/);
  for (const chunk of chunks) {
    const lines = chunk.split("\n").map((l) => l.trimEnd());
    if (!lines.join("").trim()) continue;
    const h = lines[0].match(/^(#{1,3})\s+(.*)$/);
    if (h && lines.length === 1) {
      // "#" is promoted to h2: the page title is the only h1.
      blocks.push({ t: "h", level: h[1].length >= 3 ? 3 : 2, c: parseInline(h[2]) });
    } else if (lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
      blocks.push({ t: "ul", items: lines.map((l) => parseInline(l.replace(/^\s*[-*•]\s+/, ""))) });
    } else if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
      blocks.push({ t: "ol", items: lines.map((l) => parseInline(l.replace(/^\s*\d+[.)]\s+/, ""))) });
    } else if (lines.every((l) => /^>\s?/.test(l))) {
      blocks.push({ t: "quote", c: parseInline(lines.map((l) => l.replace(/^>\s?/, "")).join("\n")) });
    } else {
      blocks.push({ t: "p", c: parseInline(lines.join("\n")) });
    }
  }
  return blocks;
}

/** Plain text (for excerpts and meta descriptions). */
export function markdownToText(src: string) {
  return src
    .replace(/\r\n?/g, "\n")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*([-*•]|\d+[.)])\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/(\*\*|__|\*|_)(.+?)\1/g, "$2")
    .replace(/\s+/g, " ")
    .trim();
}

/** First `max` characters, cut on a word boundary, with an ellipsis. */
export function excerpt(src: string, max = 155) {
  const text = markdownToText(src);
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const at = cut.lastIndexOf(" ");
  return `${(at > max * 0.6 ? cut.slice(0, at) : cut).replace(/[\s,.;:–-]+$/, "")}…`;
}
