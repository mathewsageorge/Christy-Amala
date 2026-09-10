import { wedding } from "../config/wedding";

const escapeText = (text: string) => text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
const localStamp = (iso: string) => iso.slice(0, 19).replace(/[-:]/g, "");

/** Fold at 75 UTF-8 octets, as required by RFC 5545, without splitting characters. */
function foldLine(line: string) {
  const lines: string[] = [];
  let current = "";
  for (const char of line) {
    if (new TextEncoder().encode(current + char).length > 75) {
      lines.push(current);
      current = " " + char;
    } else current += char;
  }
  return [...lines, current].join("\r\n");
}

export function createCalendar(kind: "ceremony" | "reception" | "all" = "all") {
  const events = kind === "all" ? [wedding.ceremony, wedding.reception] : [wedding[kind]];
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Christy and Amala//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH", `X-WR-TIMEZONE:${wedding.timezone}`,
    "BEGIN:VTIMEZONE", `TZID:${wedding.timezone}`, "BEGIN:STANDARD",
    "DTSTART:19700101T000000", "TZOFFSETFROM:+0530", "TZOFFSETTO:+0530", "TZNAME:IST",
    "END:STANDARD", "END:VTIMEZONE",
  ];
  for (const event of events) {
    lines.push("BEGIN:VEVENT", `UID:christy-amala-${event.id}-20270103@wedding.local`,
      "DTSTAMP:20260910T000000Z", `DTSTART;TZID=${wedding.timezone}:${localStamp(event.start)}`,
      // A date-time VEVENT without DTEND has no asserted end time. Never invent one.
      ...("end" in event ? [`DTEND;TZID=${wedding.timezone}:${localStamp(event.end)}`] : []),
      `SUMMARY:${escapeText(`${wedding.couple.names} — ${event.title}`)}`,
      `LOCATION:${escapeText(`${event.venue}, ${event.address}`)}`,
      `DESCRIPTION:${escapeText(wedding.invitation)}`, "STATUS:CONFIRMED", "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.map(foldLine).join("\r\n") + "\r\n";
}

export function remainingTime(now: number, start = wedding.ceremony.start) {
  const seconds = Math.max(0, Math.floor((Date.parse(start) - now) / 1000));
  return { days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24, minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60, started: now >= Date.parse(start) };
}
