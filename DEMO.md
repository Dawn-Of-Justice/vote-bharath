# Demo Day Script — Vote Bharath

A 3-minute walkthrough that hits every key feature judges will care about. Practice it three times before going live.

## Opening (15s)

> Hi judges. I'm Salo, and this is Vote Bharath — a bilingual, voice-enabled civic assistant that helps Indian voters understand how their elections actually work. It's built entirely on Google Cloud — Vertex AI Gemini, Firestore vector search, and Cloud TTS plus STT.

## Demo flow (2.5 min)

### 1. Landing page (15s)

- Open `https://vote-bharath...`
- Point at the three feature cards: Timeline, Journey, Ask
- **Tap the EN/हिं toggle** — show the page re-rendering in Hindi
- > "Everything in this app is bilingual. UI, content, even voice."

### 2. Election Timeline (30s)

- Click into Timeline
- Scroll horizontally through the 8 phases
- Tap into "Polling day" — show the detail panel expand with full info, duration, key actors
- > "Each phase comes from official ECI procedure. The whole election cycle, in one scroll."

### 3. Voter Journey (30s)

- Click into Journey
- Click "Next" twice to advance
- > "Saved in localStorage — voters can come back later and pick up where they left off."
- Show the action button ("Register on NVSP") and the tip card

### 4. The killer feature: Ask Anything (60s)

- Click Ask
- Click the microphone icon
- Say out loud: **"How do I register to vote in India?"**
- Watch the transcript fill in, then submit
- Wait for the streaming answer + source citations
- Click the **speaker icon** on the answer — listen to a few seconds of TTS playback
- > "Two GCP services in one flow: Speech-to-Text for the question, Gemini for the RAG answer with Firestore vector search, and Text-to-Speech for the listen button."

- Tap to switch to Hindi
- Type or speak: **"NOTA क्या है?"**
- Show the answer come back in Hindi with the same source citations
- > "Same pipeline, no translation hop — Gemini handles the language switch natively."

### 5. Architecture slide (30s)

Optional if you have a slide ready:

> Behind the scenes:
> - 10 markdown docs become ~50 chunks
> - Each chunk embedded with text-embedding-004 — 768-dim vectors stored in Firestore
> - Every question embeds, Firestore findNearest pulls top 5 chunks
> - Gemini Flash composes the answer from ONLY those chunks, with citations
> - Streamed back via Server-Sent Events for low time-to-first-token

## Closing (15s)

> Vote Bharath is open source, deploys to Firebase App Hosting in one push, and runs on under a dollar a day. The end goal: any voter, in their own language, with their own voice — gets accurate answers grounded in official sources. Thank you.

## Backup plan if something fails

| Problem | Fallback |
|---|---|
| Wifi down | Use a 4G hotspot from your phone |
| GCP rate limit | Have screenshots ready in `/demo-assets/` |
| Mic doesn't work in browser | Type the questions instead — still shows the RAG flow |
| Live site is slow | Run `npm run dev` locally as backup; demo from localhost |

## Pre-demo checklist (30 mins before)

- [ ] Refresh the deployed URL twice; verify it loads in EN and HI
- [ ] Test the chat with one English question and one Hindi question
- [ ] Test the mic on the actual demo machine and browser
- [ ] Charge laptop, bring HDMI/USB-C adapter
- [ ] Close 50 browser tabs, mute notifications
