import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log("MIDDLEWARE EXECUTING FOR:", request.nextUrl.pathname);
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('user_role')?.value;
  console.log("Token:", !!token, "Role:", role);

  const isGovRoute = request.nextUrl.pathname.startsWith('/gov');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');

  // Guard /admin routes
  if (isAdminRoute) {
    // Avoid intercepting the login page itself to prevent redirect loops
    if (request.nextUrl.pathname.startsWith('/admin/login')) {
      return NextResponse.next();
    }
    
    // Check if missing token or not an admin
    if (!token || role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Guard /gov routes
  if (isGovRoute) {
    // Avoid intercepting the login page itself to prevent redirect loops
    if (request.nextUrl.pathname.startsWith('/gov/login')) {
      return NextResponse.next();
    }
    
    // Check if missing token or not a gov user
    if (!token || role !== 'gov') {
      return NextResponse.redirect(new URL('/gov/login', request.url));
    }
  }

  // Guard /dashboard routes (User routes)
  if (isDashboardRoute) {
    // We assume default user role is 'user' as set in useAuth.ts
    if (!token || role !== 'user') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
