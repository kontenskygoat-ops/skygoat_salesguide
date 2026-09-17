import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const finish = (target = response) => {
    if (target !== response) response.cookies.getAll().forEach(cookie => target.cookies.set(cookie));
    target.headers.set("Cache-Control", "private, no-store, max-age=0");
    return target;
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured yet, only allow the login page.
  if (!supabaseUrl || !supabaseAnonKey) {
    if (request.nextUrl.pathname !== "/admin/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return finish(NextResponse.redirect(url));
    }
    return finish();
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data } = await supabase.rpc("is_admin");
    isAdmin = data === true;
  }

  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (!isLoginPage && (!user || !isAdmin)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return finish(NextResponse.redirect(url));
  }

  if (isLoginPage && user && isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return finish(NextResponse.redirect(url));
  }

  return finish();
}

export const config = {
  matcher: ["/admin/:path*"],
};
