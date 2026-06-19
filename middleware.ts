import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_PATHS = ["/", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes through
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Allow public paths through (even if logged in)
  if (PUBLIC_PATHS.includes(pathname)) {
    return response;
  }

  // Not logged in → redirect to sign in
  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Look up role from profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  const role = profile?.role;

  // Block managers from the director dashboard
  if (pathname.startsWith("/director-dashboard") && role !== "director") {
    return NextResponse.redirect(new URL("/manager-dashboard", request.url));
  }

  // Block directors from the manager dashboard
  if (pathname.startsWith("/manager-dashboard") && role !== "manager") {
    return NextResponse.redirect(new URL("/director-dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)"],
};
