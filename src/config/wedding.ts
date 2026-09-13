/** All invitation content lives here. Times are ISO 8601 with India's UTC offset. */
export const wedding = {
  couple: { groom: "Christy", bride: "Amala", names: "Christy & Amala", monogram: "C & A" },
  date: "Sunday, 03 January 2027",
  dateShort: "03 January 2027",
  dateNumeric: "03.01.2027",
  timezone: "Asia/Kolkata",
  place: "Pathanamthitta, Kerala",
  invitation: "With joyful hearts, we invite you to celebrate our wedding.",
  verse: {
    text: "But now faith, hope, and love remain—these three. The greatest of these is love.",
    reference: "1 Corinthians 13:13",
    translation: "World English Bible",
    source: "https://ebible.org/engwebu/1CO13.htm",
  },
  rsvp: {
    // Apps Script web app: execute as owner, access set to Anyone.
    endpoint: "https://script.google.com/macros/s/AKfycbwsIn-KPhir3gSDn4G6gtot8RmlUGXHqf5rJVNi1lAePVoLrVGAkPT33ssK1kt3W9mQ/exec",
  },
  families: [
    { role: "The Groom", name: "Dr. Christy", relation: "Son of", parents: "Mr. Bikash Babu & Mrs. Aswathy Bikash", address: "Kattukallil, Mekozhoor, Pathanamthitta" },
    { role: "The Bride", name: "Dr. Amala", relation: "Daughter of", parents: "Mr. Binu K. Thomas & Mrs. Jisa Binu", address: "Kummannooparambil (Mekat), Edappally, Ernakulam" },
  ],
  bestWishes: "Cripa Elsa Bikash",
  contacts: [
    { name: "Bikash Babu", phone: "+918281122200", displayPhone: "+91 82811 22200" },
    { name: "Dr. Christy Abraham Bikash", phone: "+917306997316", displayPhone: "+91 73069 97316" },
  ],
  ceremony: {
    id: "ceremony", title: "Wedding Ceremony", time: "4:00 PM",
    start: "2027-01-03T16:00:00+05:30",
    venue: "St. Peter’s Malankara Syrian Catholic Cathedral",
    address: "St. Peter’s Junction, Pathanamthitta, Kerala",
    // Leave null to construct a map search with the complete venue name and address.
    mapUrl: null as string | null,
  },
  reception: {
    id: "reception", title: "Reception", time: "6:00 PM–9:30 PM",
    start: "2027-01-03T18:00:00+05:30", end: "2027-01-03T21:30:00+05:30",
    venue: "St. Peter’s Auditorium",
    address: "Saint Peters Junction, Chittoor, Pathanamthitta, Kerala 689645",
    mapUrl: null as string | null,
  },
  photo: { src: "/images/couple-portrait.webp", original: "/images/couple.jpg", width: 1200, height: 2131, alt: "Christy and Amala seated together, smiling, with a bouquet of flowers." },
  music: {
    // Add a licensed file to public/audio/ and set src to '/audio/your-file.mp3'.
    src: "/audio/wedding-music.mp3" as string | null,
    volume: 0.35,
    credit: "",
  },
  closing: "Your presence will make our celebration even more special.",
  // Set to your verified public Vercel URL before sharing with guests.
  siteUrl: "https://christy-amala-january-2027.mathewsgeorge202.chatgpt.site",
} as const;

export function mapLink(event: { venue: string; address: string; mapUrl: string | null }) {
  return event.mapUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, ${event.address}`)}`;
}
