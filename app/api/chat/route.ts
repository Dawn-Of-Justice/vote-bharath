/**
 * Streaming RAG chat endpoint.
 *
 * POST /api/chat
 *   { message: string, locale?: 'en' | 'hi' }
 *
 * Returns a Server-Sent Events stream:
 *   event: sources    data: [{title, topic, sourceUrl}, ...]
 *   event: chunk      data: "partial answer text"
 *   event: done       data: ""
 *   event: error      data: "error message"
 *
 * The sources event arrives first so the UI can show citations
 * while the answer is still being generated.
 */

import { NextRequest } from 'next/server';
import { embedText } from '@/lib/gcp/vertex';
import { findSimilarChunks, type KbChunk } from '@/lib/gcp/firestore';
import { getGeminiModel } from '@/lib/gcp/vertex';
import { buildPrompt } from '@/lib/rag/prompt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_MESSAGE_LENGTH = 500;

function sseEvent(event: string, data: unknown): string {
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  return `event: ${event}\ndata: ${payload}\n\n`;
}

export async function POST(req: NextRequest) {
  let message: string;
  try {
    const body = (await req.json()) as { message?: unknown };
    if (typeof body.message !== 'string' || !body.message.trim()) {
      return new Response('Missing message', { status: 400 });
    }
    message = body.message.trim().slice(0, MAX_MESSAGE_LENGTH);
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(sseEvent(event, data)));

      try {
        // 1. Embed the user's question
        const queryEmbedding = await embedText(message);

        // 2. Retrieve top-K relevant chunks from Firestore
        const chunks: KbChunk[] = await findSimilarChunks(queryEmbedding, 5);

        // 3. Send sources to client immediately so citations render early
        send(
          'sources',
          chunks.map((c) => ({
            title: c.title,
            topic: c.topic,
            sourceUrl: c.sourceUrl,
          })),
        );

        // 4. Build prompt and stream Gemini response
        const prompt = buildPrompt(message, chunks);
        const model = getGeminiModel();
        const result = await model.generateContentStream({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        for await (const item of result.stream) {
          const text = item.candidates?.[0]?.content?.parts
            ?.map((p) => p.text ?? '')
            .join('');
          if (text) send('chunk', text);
        }

        send('done', '');
        controller.close();
      } catch (err) {
        console.error('[chat] error:', err);
        send('error', 'Unable to process your question. Please try again.');
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
