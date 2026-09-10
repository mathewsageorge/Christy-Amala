/** All invitation content lives here. Times are ISO 8601 with India's UTC offset. */
export const wedding = {
  couple: { groom: "Christy", bride: "Amala", names: "Christy & Amala", monogram: "C & A" },
  date: "Sunday, 03 January 2027",
  dateShort: "03 January 2027",
  dateNumeric: "03.01.2027",
  timezone: "Asia/Kolkata",
  place: "Pathanamthitta, Kerala",
  invitation: "With joyful hearts, we invite you to celebrate our wedding.",
  families: [
    { role: "The Groom", name: "Christy", relation: "Son of", parents: "Bikash Babu & Aswathy Bikash", address: "Kattukallil, Mekozhoor, Pathanamthitta" },
    { role: "The Bride", name: "Amala", relation: "Daughter of", parents: "Binu K. Thomas & Jisa Binu", address: "Kummannooparambil (Mekat), Edappally, Ernakulam" },
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
  photo: { src: "/images/couple.webp", original: "/images/couple.jpg", width: 720, height: 1280, alt: "Christy and Amala seated together, smiling, with a bouquet of flowers." },
  music: {
    // Add a licensed file to public/audio/ and set src to '/audio/your-file.mp3'.
    src: null as string | null,
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
