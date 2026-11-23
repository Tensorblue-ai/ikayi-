import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    return NextResponse.json({ message: "Admin access is not configured." }, { status: 503 });
  }
  const supplied = Buffer.from(request.headers.get("authorization") || "");
  const expected = Buffer.from(`Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return NextResponse.json({ message: "Admin authentication required." }, {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Ikayi Admin", charset="UTF-8"', "Cache-Control": "no-store" },
    });
  }
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
    }
  }
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/assets/admin/:path*"],
};
