# Org Roast - Salesforce Org Roaster

A web app that logs into your Salesforce org, analyzes it across 5 dimensions, and delivers a savage rap-diss style roast of the worst things it finds.

**Live demo: https://sdong101010.github.io/org-roast/** — plays a canned roast against a fake org so anyone can see what it looks like. Run it yourself locally to point it at a real org.

## What Gets Roasted

| Category | What We Check |
|----------|--------------|
| **Metadata** | Custom field sprawl, object hoarding, zombie objects with no records |
| **Apex Code** | Test coverage %, triggers without handlers, SOQL-in-loops |
| **Security** | Profiles with Modify All Data, too many System Admins, View All Data exposure |
| **Config** | Lingering Workflow Rules, Process Builder + Flow mix, automation overload |
| **Limits** | Governor limits above 80%, storage usage, API call consumption |

## Prerequisites

1. **A Salesforce Connected App** with OAuth2 enabled
2. **A Google Gemini API key** (for roast generation)
3. **An ElevenLabs API key** (optional, for AI voice playback)

## Setup

### 1. Create a Salesforce Connected App

1. In your Salesforce org, go to **Setup > App Manager > New Connected App**
2. Enable **OAuth Settings**
3. Set the **Callback URL** to: `http://localhost:3000/api/auth/callback`
4. Select these **OAuth Scopes**:
   - `Access the identity URL service (id)`
   - `Manage user data via APIs (api)`
   - `Perform requests at any time (refresh_token)`
5. Save and wait a few minutes for it to activate
6. Copy the **Consumer Key** and **Consumer Secret**

### 2. Configure Environment Variables

Copy `.env.local` and fill in your values:

```bash
SALESFORCE_CLIENT_ID=your_connected_app_consumer_key
SALESFORCE_CLIENT_SECRET=your_connected_app_consumer_secret
SESSION_SECRET=any-random-string-at-least-32-characters-long
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Install and Run

```bash
cd org-roast
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **ROAST MY ORG**.

## How It Works

1. You authenticate via Salesforce OAuth2
2. The app queries your org using the REST API, Tooling API, and Limits API
3. It identifies up to 5 of the worst findings
4. Those findings are sent to Gemini with instructions to write a rap diss
5. The roast is displayed with a typewriter animation
6. Hit "Drop the Bars" to hear an AI voice perform the roast via ElevenLabs

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS** (dark hip-hop themed UI)
- **jsforce v3** (Salesforce API client)
- **Google Gemini 2.0 Flash** (roast generation)
- **ElevenLabs** (AI voice performance)
- **iron-session** (encrypted cookie sessions)

## Privacy

- Only org metadata is read (no customer data)
- Nothing is stored or logged
- Sessions are encrypted and HTTP-only
- Your access token never leaves the server
