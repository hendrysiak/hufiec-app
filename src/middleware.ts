import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const path = req.nextUrl.pathname;

    // List of public paths that don't require authentication
    const publicPaths = ["/signin", "/api/auth/signout"];

    // Don't middleware auth-related API routes
    if (path.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    // Handle public routes
    if (publicPaths.includes(path)) {
      if (isAuth) {
        const userRole = token?.role as string;
        if (userRole === "admin") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    // Protected routes - check authentication
    if (!isAuth) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // Get user data from token
    const userRole = token?.role as string;
    const userTeams = token?.teams as string[];

    // Admin can access everything
    if (userRole === "admin") {
      // Redirect admin to dashboard if they're at root
      if (path === "/") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // Leader role checks
    if (userRole === "leader") {
      // Dashboard is admin only
      if (path === "/dashboard") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Allow root path for team selection
      if (path === "/") {
        return NextResponse.next();
      }

      // Check if trying to access a team route
      const teamPath = path.slice(1); // Remove leading slash
      if (teamPath && !userTeams.includes(teamPath)) {
        // If trying to access unauthorized team, redirect to root
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // Let the middleware handle the auth check
    },
  }
);

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
