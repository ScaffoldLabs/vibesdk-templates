# Expo React Native Runner

Production-minded Expo template for spinning up agentic mobile experiences that run in Expo Go and pair with Cloudflare Workers.

## Getting Started

```bash
npm install
npm run worker:dev   # start Cloudflare Worker on :8787
npm start            # run the Expo development server
```

Open the Expo Go app on your iOS/Android device and scan the QR code printed in the terminal. The worker provides the `/api/threads/:threadId/messages` endpoint consumed by the chat screen.

## Key Files

- `App.tsx`: Navigation + providers
- `src/screens/HomeScreen.tsx`: Landing screen with CTA
- `src/screens/ChatScreen.tsx`: Chat UI wired to the worker endpoint
- `src/services/assistantClient.ts`: Fetch helpers + optimistic updates
- `worker/index.ts`: AI-backed assistant endpoint with optional Cloudflare AI Gateway support

## Environment Variables

Configure these (optionally) before deploying the worker:

- `AI_GATEWAY_URL`
- `AI_GATEWAY_API_KEY`

When unset, the worker falls back to a deterministic templated response so the mobile experience still works offline.

## Quality Gates

- `npm run lint`
- `npm run typecheck`
- `npm test`

Run all three before shipping.
