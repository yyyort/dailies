import { NextRequest, NextResponse } from "next/server";
import { createClient } from "./util/supabase/server";
import { updateSession } from "./util/supabase/middleware";


const protectedPaths = [
  "/home"
];

const authPaths = [
  "/sign-in",
  "/sign-up",
]

export async function middleware(request: NextRequest) {
  // check if user is logged in and redirect to login page if not
  if (protectedPaths.includes(request.nextUrl.pathname)) {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

  }

  // check if user is logged in and redirect to home page if they are
  if (authPaths.includes(request.nextUrl.pathname)) {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
