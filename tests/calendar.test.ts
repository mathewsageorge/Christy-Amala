import assert from "node:assert/strict";
import test from "node:test";
import { createCalendar, remainingTime } from "../src/lib/calendar";
import { mapLink, wedding } from "../src/config/wedding";

test("calendar preserves India time, full locations, and only the supplied end time", () => {
  const source = createCalendar().replace(/\r\n /g, "");
  assert.equal((source.match(/BEGIN:VEVENT/g) ?? []).length, 2);
  assert.match(source, /DTSTART;TZID=Asia\/Kolkata:20270103T160000/);
  assert.match(source, /DTSTART;TZID=Asia\/Kolkata:20270103T180000/);
  assert.match(source, /DTEND;TZID=Asia\/Kolkata:20270103T213000/);
  assert.equal((source.match(/DTEND/g) ?? []).length, 1);
  assert.match(source, /St. Peter’s Malankara Syrian Catholic Cathedral/);
  assert.match(source, /TZOFFSETTO:\+0530/);
  assert.doesNotMatch(createCalendar("ceremony"), /DTEND|DURATION/);
  for (const line of createCalendar().split("\r\n")) assert.ok(Buffer.byteLength(line) <= 75);
});

test("countdown crosses the ceremony instant at 10:30 UTC without negative values", () => {
  assert.equal(new Date(wedding.ceremony.start).toISOString(), "2027-01-03T10:30:00.000Z");
  assert.deepEqual(remainingTime(Date.parse("2027-01-02T10:30:00Z")), {days:1,hours:0,minutes:0,seconds:0,started:false});
  assert.equal(remainingTime(Date.parse("2027-01-03T10:29:59Z")).seconds, 1);
  assert.equal(remainingTime(Date.parse("2027-01-03T10:30:00Z")).started, true);
  assert.deepEqual(remainingTime(Date.parse("2028-01-03T10:30:00Z")), {days:0,hours:0,minutes:0,seconds:0,started:true});
});

test("each map search includes that event’s full venue and address", () => {
  for (const event of [wedding.ceremony,wedding.reception]) {
    const url = new URL(mapLink(event));
    assert.equal(url.origin, "https://www.google.com");
    assert.equal(url.searchParams.get("query"), `${event.venue}, ${event.address}`);
  }
});
