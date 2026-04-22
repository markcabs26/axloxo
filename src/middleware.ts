import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySession } from "@/lib/admin-auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/manage/login" || pathname.startsWith("/api/manage/login")) {
    return NextResponse.next();
  }
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const ok = await verifySession(token).catch(() => false);
  if (!ok) {
    if (pathname.startsWith("/api/manage/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/manage/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/api/manage/:path*"],
};
