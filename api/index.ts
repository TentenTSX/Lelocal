import app from "../server/src/app";

// Vercel provides the HTTP server. Exporting the Express application keeps
// local development (server/src/main.ts) and production on the same routes.
export default app;
