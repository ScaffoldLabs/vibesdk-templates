# Template Selection

Choose this template when you need a **React Native** mobile experience that boots instantly in **Expo Go** while still pairing with Cloudflare Workers for AI-enabled APIs.

Use it for:
- Mobile-first assistants, dashboards, or productivity apps that need to run on phones immediately
- Iterating on conversation flows before committing to a full native build
- Projects that expect to reuse the bundled Cloudflare Worker for AI or data fetching

Avoid it when:
- You only need a web UI (use a Vite/Next.js template)
- You require native modules not supported by Expo Go out of the box
- The app must ship without the included Cloudflare Worker backend

What you get:
- TypeScript Expo project with navigation, theming, and React Query caching
- Cloudflare Worker endpoint for AI gateway access with CORS preconfigured
- Tested utilities, strong linting, and zero `any` leakage
