// src/lib/analytics.ts
// Lightweight UX analytics & event tracking framework

export interface AnalyticsEvent {
  name: string;
  category?: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
}

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  const payload: AnalyticsEvent = {
    name,
    properties,
    timestamp: new Date().toISOString(),
  };

  // Push to GTM dataLayer if available
  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(payload);
  }

  console.log("[Analytics Event]:", name, properties || "");
}

export function isFeatureEnabled(flagName: string): boolean {
  if (flagName === "BODY_SELECTOR_BETA") {
    return process.env.NEXT_PUBLIC_BODY_SELECTOR_BETA === "true";
  }
  return false;
}
