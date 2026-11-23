import { connectDatabase } from "@/server/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDatabase();
    return Response.json({ status: "ok", service: "ikayi-backend", database: "connected" });
  } catch {
    return Response.json({ status: "error", service: "ikayi-backend", database: "disconnected" }, { status: 503 });
  }
}
