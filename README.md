# Vote Bharath

A bilingual, voice-enabled assistant that helps Indian voters understand the election process — built end-to-end on Google Cloud for the Election Process Education prompt wars hackathon.

## What it does

- **Interactive Election Timeline** — explore the 8 phases of an Indian general election, from ECI announcement to result declaration
- **Voter Journey Stepper** — a guided walkthrough from "am I eligible" to "I voted", with localStorage progress
- **RAG-powered Q&A Chat** — ask anything about Indian elections, get answers grounded in a curated knowledge base of ECI sources, with inline citations
- **English + Hindi support** — UI strings, content, voice in/out all bilingual
- **Voice input + listen** — Cloud Speech-to-Text for asking questions by voice, Cloud Text-to-Speech for hearing answers

## The Google Cloud stack

| Service | Used for |
|---|---|
| Vertex AI — Gemini 1.5 Flash | Streaming chat answers |
| Vertex AI — `text-embedding-004` | Question and document embeddings (768-dim) |
| Firestore Vector Search | RAG retrieval, native cosine distance |
| Cloud Text-to-Speech | "Listen to answer" button (Indian English + Hindi Neural2 voices) |
| Cloud Speech-to-Text | Voice input (auto language detection, mixed code-switching for Hindi) |
| Firebase App Hosting | Production deployment (Cloud Run under the hood) |

## Tech

Next.js 14 (App Router) · TypeScript (strict) · TailwindCSS · Framer Motion · Lucide React

## Project layout

```
vote-bharath/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # Streaming RAG endpoint (SSE)
│   │   ├── tts/route.ts       # Text-to-Speech
│   │   └── stt/route.ts       # Speech-to-Text
│   ├── timeline/page.tsx      # Interactive election timeline
│   ├── journey/page.tsx       # Voter journey stepper
│   ├── ask/page.tsx           # Chat assistant
│   ├── layout.tsx
│   └── page.tsx               # Landing
├── components/
│   ├── Navbar.tsx, Footer.tsx, LanguageToggle.tsx
│   ├── timeline/PhaseCard.tsx
│   └── chat/{MessageBubble,VoiceInput,ListenButton}.tsx
├── lib/
│   ├── i18n/                  # Bilingual UI strings + LanguageProvider
│   ├── gcp/                   # Vertex AI, Firestore, TTS, STT clients
│   ├── rag/                   # Chunker + prompt builder + tests
│   └── chat/useChat.ts        # SSE streaming hook
├── data/
│   ├── timeline.ts            # 8 bilingual election phases
│   ├── journey.ts             # 5 bilingual voter journey steps
│   └── knowledge-base/        # 10 markdown docs for RAG
└── scripts/
    ├── verify-gcp.ts          # Sanity-check all GCP services
    └── ingest-kb.ts           # Embed + write KB to Firestore
```

## Quick start

### 1. Set up GCP (one-time)

Follow `GCP_SETUP.md` to create the `promptwars` project, enable APIs, set up Firestore, and download a service-account key.

### 2. Install and configure

```bash
cd vote-bharath
npm install
cp .env.example .env.local
# Edit .env.local with your project ID and key path
```

### 3. Verify GCP wiring

```bash
npm run verify-gcp
```

You should see green checkmarks for Vertex AI, Firestore, TTS, and STT. If anything fails, the error message points at the IAM role you're missing.

### 4. Create the Firestore vector index

```bash
gcloud firestore indexes composite create \
  --collection-group=knowledge_base \
  --query-scope=COLLECTION \
  --field-config=vector-config='{"dimension":768,"flat":{}}',field-path=embedding \
  --project=promptwars-XXXXX
```

This takes a few minutes to build. You can continue with ingestion while it provisions.

### 5. Ingest the knowledge base

```bash
npm run ingest
```

This embeds every chunk in `data/knowledge-base/` and writes them to Firestore. Run again anytime you edit the markdown — it overwrites in place.

### 6. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000.

## Tests

```bash
npm test          # vitest run — unit tests for chunker
npm run typecheck # strict TypeScript check
npm run lint      # eslint
```

## Deployment

See `DEPLOY.md` for the Firebase App Hosting walkthrough.

## License

Built for the prompt wars hackathon. Educational use; not affiliated with the Election Commission of India.
