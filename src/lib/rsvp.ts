export type RsvpReply = {
  name: string; phone: string; email: string;
  attending: "Yes" | "No"; guests: number; message: string;
};

export async function sendRsvp(endpoint: string, reply: RsvpReply, send: typeof fetch = fetch) {
  // A simple text POST avoids a preflight that Apps Script cannot handle.
  // Read the real JSON response; an opaque no-cors response is not proof of saving.
  const response = await send(endpoint, {
    method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(reply), credentials: "omit", redirect: "follow",
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error("The RSVP service could not confirm your reply.");
  const result: unknown = await response.json();
  if (!result || typeof result !== "object" || !("status" in result) || result.status !== "ok") {
    throw new Error("The RSVP service could not confirm your reply.");
  }
}
