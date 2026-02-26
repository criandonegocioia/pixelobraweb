import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { setupVite, serveStatic } from "./vite";
import { getDb } from "../db";

const app = express();
const port = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connection check (optional but good for startup)
getDb().then((db) => {
  if (db) {
    console.log("[Database] Connected successfully");
  } else {
    console.warn("[Database] Connection failed or not configured");
  }
});

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Setup Vite or Static files depending on env
(async () => {
  if (process.env.NODE_ENV === "development") {
    // We need to pass the http server instance to vite for HMR
    // However, app.listen returns the server. 
    // setupVite expects (app, server).
    // So we need to create the server first or structure it so we can pass it.
    // Looking at common patterns:

    // Actually, looking at vite.ts: setupVite(app, server)
    // We need a raw http server to attach WebSocket for HMR if using middleware mode.

    // Let's create the http server manually
    const server = app.listen(port, () => {
      console.log(`[Server] Listening on http://localhost:${port}`);
    });

    await setupVite(app, server);
  } else {
    serveStatic(app);
    app.listen(port, () => {
      console.log(`[Server] Listening on http://localhost:${port}`);
    });
  }
})();