import { NextResponse } from 'next/server';
import { verifyToken } from './src/lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  console.log(`🔍 Middleware: ${request.method} ${pathname}`);
  console.log(`🔑 Token present: ${!!token}`)

  // ✨ UPDATED: More comprehensive public routes
  const publicRoutes = [
    '/',
    '/login', 
    '/register',
    '/forgot-password',
    '/reset-password',
    '/about',
    '/contact'
  ];

  // ✨ UPDATED: Public API routes that don't need authentication
  const publicApiRoutes = [
    '/api/auth/login',
    '/api/auth/register', 
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/patients/register',
    '/api/doctors/register',
    '/api/nurses/register',
    '/api/departments' // Public endpoint for registration forms
  ];

  // ✨ UPDATED: Admin-only API routes
  const adminOnlyRoutes = [
    '/api/admin',
    '/api/users/manage',
    '/api/reports/admin',
    '/api/system'
  ];

  // ✨ UPDATED: Role-specific API routes
  const roleBasedRoutes = {
    '/api/patients': ['admin', 'doctor', 'nurse', 'receptionist'],
    '/api/doctors/manage': ['admin'],
    '/api/appointments/manage': ['admin', 'receptionist'],
    '/api/reports': ['admin', 'doctor'],
    '/api/inventory': ['admin', 'pharmacist', 'nurse']
  };

  const isPublicRoute = publicRoutes.includes(pathname);
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));
  const isApiRoute = pathname.startsWith('/api/');

  // ✨ NEW: Allow public routes
  if (isPublicRoute || isPublicApiRoute) {
    console.log(`✅ Public route allowed: ${pathname}`);
    return NextResponse.next();
  }

  // ✨ UPDATED: Enhanced token validation for protected routes
  if (!token) {
    console.log(`❌ No token found for protected route: ${pathname}`);
    
    if (isApiRoute) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'AUTH_REQUIRED',
          timestamp: new Date().toISOString()
        }, 
        { status: 401 }
      );
    }
    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✨ UPDATED: Verify JWT token
  const decoded = verifyToken(token);
  if (!decoded) {
    console.log(`❌ Invalid token for route: ${pathname}`);
    
    if (isApiRoute) {
      return NextResponse.json(
        { 
          error: 'Invalid or expired token',
          code: 'TOKEN_INVALID',
          timestamp: new Date().toISOString()
        }, 
        { status: 401 }
      );
    }
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set('auth-token', '', { maxAge: 0 });
    return response;
  }

  console.log(`👤 Authenticated user: ${decoded.email} (Role: ${decoded.role})`);

  // ✨ NEW: Role-based authorization for API routes
  if (isApiRoute) {
    // Check admin-only routes
    if (adminOnlyRoutes.some(route => pathname.startsWith(route))) {
      if (decoded.role !== 'admin') {
        console.log(`❌ Admin access required for: ${pathname}`);
        return NextResponse.json(
          { 
            error: 'Admin access required',
            code: 'INSUFFICIENT_PERMISSIONS',
            requiredRole: 'admin',
            userRole: decoded.role
          }, 
          { status: 403 }
        );
      }
    }

    // Check role-specific routes
    for (const [routePattern, allowedRoles] of Object.entries(roleBasedRoutes)) {
      if (pathname.startsWith(routePattern)) {
        if (!allowedRoles.includes(decoded.role)) {
          console.log(`❌ Role '${decoded.role}' not allowed for: ${pathname}`);
          return NextResponse.json(
            { 
              error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
              code: 'ROLE_NOT_AUTHORIZED',
              requiredRoles: allowedRoles,
              userRole: decoded.role
            }, 
            { status: 403 }
          );
        }
      }
    }
    // ✨ NEW: Add user context to API request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-email', decoded.email);
    requestHeaders.set('x-user-role', decoded.role);
    requestHeaders.set('x-auth-timestamp', new Date().toISOString());

    console.log(`✅ API access granted: ${pathname}`);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  // ✨ NEW: Handle page routes - redirect to dashboard if accessing login/register while authenticated
  if (decoded && (pathname === '/login' || pathname === '/register')) {
    console.log(`🔄 Redirecting authenticated user from ${pathname} to dashboard`);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  console.log(`✅ Page access granted: ${pathname}`);
  return NextResponse.next();
}

// ✨ UPDATED: More comprehensive matcher pattern
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth/login, api/auth/register (public auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - robots.txt, sitemap.xml
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|public/).*)',
  ],
};