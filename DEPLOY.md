# Deploying to Firebase App Hosting

Firebase App Hosting is Google's managed hosting for Next.js apps — it builds your app on Cloud Build and serves it from Cloud Run. This keeps the entire stack inside the `promptwars` project.

## One-time setup

### 1. Install the Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 2. Link the project

From inside the `vote-bharath/` directory:

```bash
firebase init apphosting
```

Choose:
- Use existing project → `promptwars-XXXXX`
- App name: `vote-bharath`
- Region: `asia-south1` (same as your Firestore — keeps latency low)

This creates a `firebase.json` and an `apphosting.yaml` in your repo.

### 3. Push to a Git repo

App Hosting deploys from a Git remote — GitHub or Cloud Source Repositories.

```bash
git init
git add .
git commit -m "Initial Vote Bharath build"
gh repo create vote-bharath --private --source=. --push
```

### 4. Connect the repo in Firebase Console

In the Firebase console → App Hosting → your backend → Settings → connect the Git repository and choose the `main` branch as the live branch.

## Set runtime environment variables

In the Firebase Console for your App Hosting backend, add these as secret values (NOT plain env vars):

| Key | Value |
|---|---|
| `GCP_PROJECT_ID` | `promptwars-XXXXX` |
| `GCP_LOCATION` | `asia-south1` |
| `GEMINI_MODEL` | `gemini-1.5-flash` |
| `EMBEDDING_MODEL` | `text-embedding-004` |
| `KB_COLLECTION` | `knowledge_base` |

App Hosting runs on Cloud Run, so the runtime service account is `<backend-id>@<project-id>.iam.gserviceaccount.com`. Grant it the same roles you gave your local dev service account:

- Vertex AI User
- Cloud Datastore User
- Cloud Speech Client
- Cloud Translation API User

`GOOGLE_APPLICATION_CREDENTIALS` is NOT needed in production — Cloud Run picks up the service-account identity automatically.

## Deploy

```bash
git push origin main
```

Firebase App Hosting builds and deploys on every push to main. The first build takes ~5 minutes; subsequent ones are faster (~2 min) thanks to layer caching.

You'll get a URL like `https://vote-bharath--promptwars-XXXXX.web.app`.

## Rollback

```bash
firebase apphosting:rollouts:list
firebase apphosting:rollouts:rollback ROLLOUT_ID
```

## Cost monitoring

Firebase App Hosting is metered separately on top of Cloud Run, Firestore, Vertex AI, TTS, and STT charges. Set a budget alert at $10 in the Cloud Console → Billing → Budgets to be safe.

For a hackathon demo (a few hundred users, demo day traffic burst), expected cost is well under $5.
