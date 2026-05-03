# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vote Bharath** is a bilingual (English + Hindi) voter education web app for Indian elections. It features an interactive election timeline, voter journey stepper, and a RAG-powered Q&A assistant grounded in official Election Commission of India (ECI) sources. Built for the "Election Process Education" prompt wars hackathon on Google Cloud.

## Commands

```bash
# Install dependencies
npm install

# Verify GCP service connectivity before running anything
npm run verify-gcp

# Ingest knowledge base markdown files into Firestore
npm run ingest

# Start dev server
npm run dev

# Run unit tests (vitest)
npm test

# Run a single test file
npx vitest run lib/rag/__tests__/chunker.test.ts

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

## Required Environment Variables

Copy `.env.example` to `.env.local`. All six variables are required:

| Variable | Purpose |
|---|---|
| `GCP_PROJECT_ID` | Google Cloud project ID |
| `GCP_LOCATION` | Vertex AI region (e.g., `asia-south1`) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Absolute path to service account JSON key |
| `GEMINI_MODEL` | Gemini model ID (default: `gemini-1.5-flash`) |
| `EMBEDDING_MODEL` | Embedding model (default: `text-embedding-004`) |
| `KB_COLLECTION` | Firestore collection name (default: `knowledge_base`) |

A **composite vector index** on the `embedding` field must exist in Firestore before running `npm run ingest` or the RAG endpoint. See `GCP_SETUP.md`.

## Architecture

### Tech Stack
- **Next.js 14** (App Router) + TypeScript (strict) + TailwindCSS + Framer Motion
- **Google Cloud**: Vertex AI (Gemini + embeddings), Firestore (vector search), Cloud TTS, Cloud STT

### Key Architectural Patterns

**RAG Pipeline** (`/app/api/chat/route.ts` → `lib/gcp/` → `lib/rag/`):
1. User message → embed with `text-embedding-004` via REST (not SDK)
2. Cosine distance search in Firestore native vector index → top-K `KbChunk` docs
3. Prompt built with `lib/rag/prompt.ts` — constrains model to source docs, enforces same-language reply, enforces `[Source N]` citation format
4. Stream Gemini response via SSE: sources event first, then chunks, then done/error

**SSE Streaming**: The `/api/chat` endpoint uses `TransformStream` to write newline-delimited JSON events. The client hook `lib/chat/useChat.ts` parses these with `ReadableStream` reader.

**Bilingual System** (`lib/i18n/`):
- All UI strings live in `lib/i18n/strings.ts` as a flat `en`/`hi` dictionary
- `LanguageProvider` (React Context) reads locale from `localStorage → navigator.language → 'en'`
- Locale is passed to API routes to control language of RAG responses and TTS voice selection

**GCP Client Pattern** (`lib/gcp/`):
- All GCP clients use lazy singletons to avoid repeated auth handshakes
- `lib/gcp/config.ts` centralizes env validation
- `serverExternalPackages` in `next.config.mjs` prevents GCP SDKs from being bundled into client JS

**Knowledge Base** (`data/knowledge-base/`):
- 10 markdown files with YAML frontmatter (`title`, `topic`, `sourceUrl`)
- `scripts/ingest-kb.ts` chunks them with `lib/rag/chunker.ts` (H2-section-first, ~500 token target), embeds, and upserts to Firestore with deterministic IDs (`filename__chunkIndex`) — safe to re-run

### Voice Pipeline
- **STT**: Browser `MediaRecorder` (webm/opus) → base64 → `/api/stt` → Cloud STT with Hindi+English code-mixing
- **TTS**: Answer text → `/api/tts` → Cloud TTS (en-IN-Neural2-A / hi-IN-Neural2-A) → base64 MP3 → `<audio>` element

### Data Layer
- `data/timeline.ts`: 8-phase election cycle data with bilingual titles and ECI-sourced details
- `data/journey.ts`: 5-step voter journey with action links to official ECI portals
- All data is static (no DB reads); only Q&A uses Firestore

## Path Alias

`@/*` maps to the repo root. Use `@/lib/...`, `@/components/...`, `@/data/...` throughout.
