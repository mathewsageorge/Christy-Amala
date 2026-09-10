import { createCalendar } from "@/lib/calendar";

export const dynamic = "force-static";
export function generateStaticParams() { return ["all", "ceremony", "reception"].map(event => ({ event: `${event}.ics` })); }
export async function GET(_request: Request, { params }: { params: Promise<{ event: string }> }) {
  const { event } = await params;
  const kind = event.replace(".ics", "");
  if (kind !== "all" && kind !== "ceremony" && kind !== "reception") return new Response("Not found", { status: 404 });
  return new Response(createCalendar(kind), { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="christy-amala-${kind}.ics"` } });
}
