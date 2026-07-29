// src/lib/monitoring.ts
// Lightweight runtime error monitoring & diagnostic logging bootstrap

export interface ErrorReportOptions {
  context?: Record<string, unknown>;
  tags?: Record<string, string>;
}

export function initMonitoring() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
  const env = process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NODE_ENV || "development";

  if (dsn) {
    console.log(`[Monitoring] Initialized Sentry DSN target (${env})`);
  } else {
    console.log("[Monitoring] Running in silent log mode (SENTRY_DSN not configured)");
  }
}

export function captureException(error: unknown, options?: ErrorReportOptions) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error("[Monitoring Exception Captured]:", {
    message,
    stack,
    context: options?.context,
    tags: options?.tags,
    timestamp: new Date().toISOString(),
  });

  // Simulated Sentry/Rollbar capture if DSN is set
  if (typeof window !== "undefined" && (window as any).Sentry) {
    (window as any).Sentry.captureException(error, options);
  }
}

export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  console.log(`[Monitoring ${level.toUpperCase()}]: ${message}`);
}
