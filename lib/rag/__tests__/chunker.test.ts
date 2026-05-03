import { describe, expect, it } from 'vitest';
import { chunkMarkdown } from '../chunker';

describe('chunkMarkdown', () => {
  it('returns one chunk per H2 section for short documents', () => {
    const md = `# Title\n\n## First\nFirst body.\n\n## Second\nSecond body.`;
    const chunks = chunkMarkdown(md);
    expect(chunks).toHaveLength(2);
    expect(chunks[0]?.content).toContain('## First');
    expect(chunks[1]?.content).toContain('## Second');
  });

  it('splits oversized sections by paragraph boundaries', () => {
    const para = 'word '.repeat(400); // ~2000 chars, exceeds limit
    const md = `# Title\n\n## Big\n${para}\n\n${para}`;
    const chunks = chunkMarkdown(md);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((c) => c.content.length <= 1800 + 100)).toBe(true);
  });

  it('strips the H1 title from output', () => {
    const md = `# Title To Strip\n\n## Body\nContent.`;
    const chunks = chunkMarkdown(md);
    expect(chunks[0]?.content).not.toContain('# Title To Strip');
  });

  it('returns empty array for empty input', () => {
    expect(chunkMarkdown('')).toHaveLength(0);
  });

  it('assigns sequential chunk indices', () => {
    const md = `# T\n\n## A\na\n\n## B\nb\n\n## C\nc`;
    const chunks = chunkMarkdown(md);
    expect(chunks.map((c) => c.chunkIndex)).toEqual([0, 1, 2]);
  });
});
