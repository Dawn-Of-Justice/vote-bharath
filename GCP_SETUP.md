# GCP Setup — Vote Bharath

You'll do these steps once. Takes ~10 minutes.

## 1. Create the project

1. Go to https://console.cloud.google.com/
2. Click the project dropdown (top left) → **New Project**
3. Project name: `promptwars`
4. Note the auto-generated **Project ID** (e.g., `promptwars-12345`) — you'll need it
5. Click **Create**

## 2. Enable billing

Vertex AI, Firestore vector search, TTS, and STT all need billing enabled (you'll stay well within free-tier credits for a hackathon — Gemini Flash is ~$0.0001 per request).

1. Project dropdown → **Billing** → link a billing account
2. New users get $300 free credits — more than enough

## 3. Enable the APIs we need

In the console search bar, find each of these and click **Enable**:

- **Vertex AI API** (`aiplatform.googleapis.com`)
- **Cloud Firestore API** (`firestore.googleapis.com`)
- **Cloud Text-to-Speech API** (`texttospeech.googleapis.com`)
- **Cloud Speech-to-Text API** (`speech.googleapis.com`)
- **Cloud Translation API** (`translate.googleapis.com`) — backup for edge cases

Or run these in Cloud Shell (faster):

```bash
gcloud services enable \
  aiplatform.googleapis.com \
  firestore.googleapis.com \
  texttospeech.googleapis.com \
  speech.googleapis.com \
  translate.googleapis.com \
  --project=promptwars
```

## 4. Set up Firestore (Native mode)

1. Console search → **Firestore**
2. Click **Create database**
3. Choose **Native mode** (not Datastore mode)
4. Region: `asia-south1` (Mumbai) — closest to Indian users, lowest latency
5. Start in **production mode** (we'll set proper security rules)
6. Click **Create**

## 5. Create a service account for local dev

1. Console search → **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Name: `vote-bharath-dev`
4. Grant these roles:
   - **Vertex AI User**
   - **Cloud Datastore User** (for Firestore)
   - **Cloud Speech Client**
   - **Cloud Translation API User**
5. Click **Done**
6. Click on the new service account → **Keys** tab → **Add Key** → **Create new key** → **JSON**
7. Save the downloaded `.json` file somewhere safe (e.g., `~/secrets/promptwars-sa.json`)

> 🔒 **Security note**: Never commit this JSON file to git. We've added it to `.gitignore` already.

## 6. Wire up your `.env.local`

Once the Next.js project is scaffolded, create `.env.local` in the project root:

```bash
GCP_PROJECT_ID=promptwars-XXXXX          # your actual project ID
GCP_LOCATION=asia-south1                  # match your Firestore region
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/promptwars-sa.json
GEMINI_MODEL=gemini-1.5-flash
EMBEDDING_MODEL=text-embedding-004
```

## 7. Verify the setup

After we scaffold the project, run:

```bash
npm install
npm run verify-gcp    # script we'll add — pings each service
```

If everything green-checks, you're ready to ingest the knowledge base and run the dev server.

## Cost expectations for the hackathon

| Service | Estimated cost for full demo day |
|---------|----------------------------------|
| Gemini 1.5 Flash | < $0.50 (a few thousand chat messages) |
| Embeddings (one-time ingest of 50 chunks) | ~$0.001 |
| Firestore reads/writes | Free tier covers it |
| Cloud TTS | < $0.10 (free tier: 1M chars/month) |
| Cloud STT | < $0.10 (free tier: 60 min/month) |
| **Total** | **< $1, easily within $300 free credits** |
