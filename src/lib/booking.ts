// Minimal placeholder booking function.
// Replace with real API POST call / integration with auth and CSRF in production.
export async function bookAppointment(
  partId: string,
  payload: { name: string; phone: string; date: string; time: string }
) {
  // Example: await fetch("/api/book", { method: "POST", body: JSON.stringify({ partId, ...payload }) })
  // Here we simulate latency and success.
  await new Promise((res) => setTimeout(res, 600));
  // Throw on error to simulate failure: throw new Error("network");
  return { ok: true, bookingId: `bk_${Date.now()}` };
}
