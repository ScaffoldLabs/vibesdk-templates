# Usage

## Expo Go Development
- `npm install` (or `bun install`) to install dependencies
- `npm start` to launch Expo Go (press `i` or `a` for simulators)
- Update `App.tsx`, `src/screens/HomeScreen.tsx`, and `src/screens/ChatScreen.tsx` for your flows

## Worker API
- `npm run worker:dev` to boot the Cloudflare Worker locally on port **8787**
- Environment variables (optional): set `AI_GATEWAY_URL` and `AI_GATEWAY_API_KEY` for live LLM calls
- The mobile app reads `extra.apiBaseUrl` from `app.config.ts` (`http://127.0.0.1:8787` by default)

## Architecture Notes
- Navigation: Native stack navigator (`@react-navigation/native-stack`)
- State: React Query for chat history + optimistic updates
- Theming: `src/styles/theme.ts` centralizes light/dark palettes
- Worker endpoint: `/api/threads/:threadId/messages` handles chat requests with graceful AI fallback

## Testing & Quality
- `npm test` runs Jest (`__tests__/createAssistantMessage.test.ts` sample included)
- `npm run lint` enforces strict ESLint rules (no `any`, React Hooks linting)
- `npm run typecheck` uses the Expo TypeScript config for additional safety

## Customization Checklist
- Replace placeholder PNGs in `assets/`
- Adjust metadata in `app.config.ts` (display name, icons, splash colors)
- Expand the Cloudflare Worker with your domain logic—keep CORS headers intact for Expo Go
- Update `src/services/assistantClient.ts` if you move endpoints or return shapes
