/**
 * Markdown chunker for RAG.
 *
 * Strategy: split by H2 sections first (each section is usually a self-
 * contained idea). If a section is still too long, fall back to paragraph
 * splits. Each chunk is kept under ~500 tokens (we approximate with
 * char count: 1 token ≈ 4 chars in English, ~2 chars in Devanagari).
 */

const MAX_CHARS_PER_CHUNK = 1800; // ~450 tokens for English

export interface RawChunk {
  content: string;
  chunkIndex: number;
}

export function chunkMarkdown(markdown: string): RawChunk[] {
  // Strip the H1 title — already captured in frontmatter
  const body = markdown.replace(/^#\s+.+\n/, '').trim();

  // Split by H2 sections, keeping the heading with its body
  const sections = body
    .split(/\n(?=## )/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];

  for (const section of sections) {
    if (section.length <= MAX_CHARS_PER_CHUNK) {
      chunks.push(section);
      continue;
    }

    // Section too long — split by paragraphs, accumulating until limit
    const paragraphs = section.split(/\n\n+/);
    let current = '';
    for (const para of paragraphs) {
      if (current.length + para.length + 2 > MAX_CHARS_PER_CHUNK && current) {
        chunks.push(current.trim());
        current = para;
      } else {
        current = current ? `${current}\n\n${para}` : para;
      }
    }
    if (current.trim()) chunks.push(current.trim());
  }

  return chunks.map((content, index) => ({ content, chunkIndex: index }));
}
