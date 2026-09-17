import { cpSync } from "node:fs";

const source = new URL("../../server/public/assets/", import.meta.url);
const destination = new URL("../dist/assets/", import.meta.url);

// The API stores image paths under /assets. Copy the versioned, read-only
// assets into Vite's output so Vercel can serve them as static files.
cpSync(source, destination, { recursive: true });
