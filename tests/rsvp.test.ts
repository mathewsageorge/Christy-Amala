import test from "node:test";
import assert from "node:assert/strict";
import { sendRsvp, type RsvpReply } from "../src/lib/rsvp.js";

const reply: RsvpReply = { name: "Test guest", phone: "", email: "", attending: "No", guests: 0, message: "" };

test("RSVP sends the supplied script's fields and requires confirmed JSON", async () => {
  await sendRsvp("https://example.test/exec", reply, (async (_url, options) => {
    assert.equal(options?.method, "POST");
    assert.equal(options?.credentials, "omit");
    assert.deepEqual(JSON.parse(String(options?.body)), reply);
    assert.equal((options?.headers as Record<string, string>)["Content-Type"], "text/plain;charset=utf-8");
    return new Response('{"status":"ok"}');
  }) as typeof fetch);
});

test("RSVP never reports success for server errors, sign-in pages, or missing confirmation", async () => {
  for (const response of [new Response("failed", { status: 503 }), new Response("<html>Sign in</html>"), new Response('{"status":"error"}'), new Response('{}')]) {
    await assert.rejects(sendRsvp("https://example.test/exec", reply, (async () => response) as typeof fetch));
  }
});

test("An ambiguous network failure is not automatically retried", async () => {
  let attempts = 0;
  await assert.rejects(sendRsvp("https://example.test/exec", reply, (async () => { attempts++; throw new TypeError("Network error"); }) as typeof fetch));
  assert.equal(attempts, 1);
});
