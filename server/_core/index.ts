import "dotenv/config";
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
getDb().then(db => {
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
  let server: ReturnType<typeof app.listen>;

  if (process.env.NODE_ENV === "development") {
    // We need to pass the http server instance to vite for HMR
    // However, app.listen returns the server.
    // setupVite expects (app, server).
    // So we need to create the server first or structure it so we can pass it.
    // Looking at common patterns:

    // Actually, looking at vite.ts: setupVite(app, server)
    // We need a raw http server to attach WebSocket for HMR if using middleware mode.

    // Let's create the http server manually
    server = app.listen(port, () => {
      console.log(`[Server] Listening on http://localhost:${port}`);
    });

    await setupVite(app, server);
  } else {
    serveStatic(app);
    server = app.listen(port, () => {
      console.log(`[Server] Listening on http://localhost:${port}`);
    });
  }

  // Graceful shutdown
  const shutdown = () => {
    console.log("[Server] Shutting down...");
    if (server) {
      server.close(() => {
        console.log("[Server] Closed successfully");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  // Global Error Handlers (prevent silent crashes)
  process.on("uncaughtException", (err) => {
    console.error("[Server] Uncaught Exception:", err);
    // Optional: Restart gracefully or just log. keeping it alive might be risky but prevents immediate exit.
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("[Server] Unhandled Rejection at:", promise, "reason:", reason);
  });
})();
