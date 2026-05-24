import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages that don't require authentication
const PUBLIC_PATHS = ["/"];
const APPROVAL_REQUIRED_PATHS = ["/intake"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths through
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow API routes through
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // TODO: replace this with Supabase session check:
  // import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
  // const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() });
  // const { data: { session } } = await supabase.auth.getSession();
  // if (!session) return NextResponse.redirect(new URL("/login", request.url));

  // For now — check a simple cookie that gets set after login
  // Remove this once Supabase is wired up
  const isLoggedIn = request.cookies.get("aareon_session");
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const hasApproval = request.cookies.get("aareon_approval")?.value === "granted";
  if (APPROVAL_REQUIRED_PATHS.some((p) => pathname.startsWith(p)) && !hasApproval) {
    return NextResponse.redirect(new URL("/approval", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except static files and Next internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)"],
};
