import { NextResponse } from "next/server";
import { rateLimiter } from "@repo/db/redis";

export async function middleware(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // 1. Skip NextAuth
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  // 2. Skip static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 3. Do NOT rate limit the rate-limit UI page
  if (pathname.startsWith("/rate-limit")) return NextResponse.next();

  // 4. IP-based rate limit
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { success, reset } = await rateLimiter.limit(ip);

  if (!success) {
    const retrySeconds = Math.ceil((reset - Date.now()) / 1000);

    return new NextResponse(null, {
      status: 429, // TOO MANY REQUESTS
      headers: {
        "X-RateLimit-Retry-After": String(retrySeconds),
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next|favicon.ico|images).*)"],
};
