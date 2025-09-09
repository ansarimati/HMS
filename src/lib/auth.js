"use client";
import jwt from "jsonwebtoken";

import { NextResponse } from "next/server";

// const JWT_SECRET = process.env.JWT_SECRET;

// if (!JWT_SECRET) {
//   throw new Error("Please define the JWT_SECRET in env file");
// }

// Generate JWT Token;
export function generateToken (payload, expiresIn = "7d") {
  return jwt.sign(payload, JWT_SECRET,{
    expiresIn,
    issuer:"hospital-management",
    audience: "hospital-users",
    iat: Math.floor(Date.now() / 1000),
  });
}

// verify hJWT Token
export function verifyToken (token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: "hospital-management",
      audience: "hospital-users"
    });
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

// Get current User from cookies
// export async function getCurrentUser (request) {
//   if (!request) {
//     // For server components without request object
//     const { cookies } = await import("next/headers");
//     const cookieStore = cookies();
//     const token = cookieStore.get("auth-token")?.value;

//     if (!token) {
//       return null;
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return null;
//     }

//     try {
//       await dbConnect();
//       const user = await User.findById(decoded.userId).select("-password");
      
//       if (!user) {
//         return null
//       }
//       return user;

//     } catch (error) {
//       console.error('Get current user error:', error);
//       return null;
//     }
//   } else {
//     // For API routes with request object
//     const authResult = await authenticateRequest(request);
//     return authResult.success ? authResult.user : null;
//   }
// }

// set Auth cookie
export function setAuthCookie(token) {
  const cookieStore = cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7days
    path: "/"
  });
}

// clear cookie

export function clearAuthCookie () {
  const cookieStore = cookies();
  cookieStore.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "lax",
    maxAge: 0,
    path: "/"
  })
}


//  Authenticate user

// export async function authenticateRequest (request) {
//   try {
//     // Get token from cookie or Authorization header
//     const token = request.cookies.get("auth-token")?.value || request.headers.get("Authorization")?.replace("Bearer", "");

//     if (!token) {
//       return {
//         success: false,
//         error: "Authentication token is required",
//         status: 401
//       };
//     }

//     // Verify token
//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return {
//         success: false,
//         error: "Invalid or expired token",
//         status: 401
//       }
//     }

//     // Connect to database and get user
//     await dbConnect();
//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return {
//         success: false,
//         error: "User not found",
//         status: 404
//       }
//     }

//     return {
//       success: true,
//       user,
//       decoded
//     };
//   } catch (error) {
//     console.log("Authentication Error", error);
//     return {
//       success: false,
//       error: "Authentication failed",
//       status: 500
//     };
//   }
// }


// Role based authentication
export function authorizeRoles (userRole, allowedRoles) {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true
  }

  return allowedRoles.includes(userRole);
}

export function withAuth (handler, options={}) {
  return async function () {
    try {
      // Authenticate request
      const authResult = await authenticateRequest(request);

      if (!authResult.success) {
        return NextResponse.json(
          {error: authResult.error},
          { status: authResult.status }
        );
      }

      // Check role authorization if specified
      if (options.roles && options.roles.length > 0) {
        const hasPermission = authorizeRoles(authResult.user.role, options.roles);

        if (!hasPermission) {
          return NextResponse.json(
            { error: `Access denied, roles required ${options.roles.json(", ")}` },
            { status: 403 }
          );
        }
      }

      // Add user data to request context
      const enhancedRequest = {
        ...request,
        user: authResult.user,
        auth: authResult.decoded
      };

      // call the original handler with enhanced request
      return await handler(enhancedRequest, context);

    } catch (error) {
      console.log("Auth middleware error", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}

// FRONTEND token management
export const tokenManager = {
  // Get token from cookies (client-side)
  getToken () {
    if (typeof document === "undefined") {
      return null;
    }

    const cookies = document.cookie.split(";");
    const authCookie = cookies.find(cookie => cookie.trim().startsWith("auth-token"));

    return authCookie ? authCookie.split("=")[1] : null;
  },

  // Check if token exist and is valid format
  hasValidToken () {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const parts = token.split(".");
      return parts.length === 3 // JWT has 3 parts
    } catch {
      return false
    }
  },

  // Decode toke payload (Client side only for non sensitive data)
  decodeToken () {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      // check if token is expired
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  },

  isAuthenticated () {
    if (typeof document === 'undefined') return false;
    return document.cookie.includes('auth-status=authenticated');
  },

  clearAuthCookies() {
    if (typeof document === 'undefined') return;
    
    document.cookie = 'auth-status=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
    // Note: HTTP-only auth-token cookie can only be cleared by server
  }
}

export function hasRole(user, role) {
  return user?.role === role;
}

export function hasAnyRole(user, roles) {
  return roles.includes(user?.role);
}
