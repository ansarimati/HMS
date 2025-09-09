import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import dbConnect from './dbConnect';
import User from '@/app/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

// ✅ SERVER-SIDE: JWT functions
export function generateToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn,
    issuer: 'hospital-management',
    audience: 'hospital-users',
    // iat: Math.floor(Date.now() / 1000)
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'hospital-management',
      audience: 'hospital-users'
    });
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

// ✅ SERVER-SIDE: Get current user from cookies
export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) return null;
    
    const decoded = verifyToken(token);
    if (!decoded) return null;
    
    await dbConnect();
    const user = await User.findById(decoded.userId).select('-password');
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// ✅ SERVER-SIDE: Authenticate request for API middleware
export async function authenticateRequest(request) {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token required',
        status: 401
      };
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return {
        success: false,
        error: 'Invalid or expired token',
        status: 401
      };
    }
// Connect to database and get user
    await dbConnect();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        status: 404
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        error: 'Account is deactivated',
        status: 403
      };
    }

    return {
      success: true,
      user,
      decoded
      };

  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      status: 500
    };
  }
}

// ✅ SERVER-SIDE: Role-based authorization
export function authorizeRoles(userRole, allowedRoles) {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true; // No role restriction
  }
  
  return allowedRoles.includes(userRole);
}
// ✅ SERVER-SIDE: Authentication middleware wrapper
export function withAuth(handler, options = {}) {
  return async function(request, context) {
    try {
      // Authenticate request
      const authResult = await authenticateRequest(request);
      
      if (!authResult.success) {
        return NextResponse.json(
          { error: authResult.error },
          { status: authResult.status }
        );
      }

      // Check role authorization if specified
      if (options.roles && options.roles.length > 0) {
        const hasPermission = authorizeRoles(authResult.user.role, options.roles);
        
        if (!hasPermission) {
          return NextResponse.json(
            { error: `Access denied. Required roles: ${options.roles.join(', ')}` },
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

      // Call the original handler with enhanced request
      return await handler(enhancedRequest, context);

    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}