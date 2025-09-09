'user client';

import { useAuth } from "@/context/AuthContext";
import { tokenManager } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuthGuard (options = []) {
  const {
    requireAuth = true,
    allowedRoles = [],
    redirectTo = "/login",
    requireProfile = false
  } = options;

  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [ authStatus, setAuthStatus ] = useState({
    isAuthenticated: false,
    isAuthorized: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    if (loading) {
      setAuthStatus(prev => ({ ...prev, isLoading: true }));
      return;
    }

    // check authentication requirements
    if (requireAuth && !user) {
      setAuthStatus({
        isAuthenticated: false,
        isAuthorized: false,
        isLoading: false,
        error: "Authentication required"
      });
      // Redirect with return URL
      const loginUrl = `${redirectTo}?returnUrl=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }

    // check role authorization
    if (user&& allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      setAuthStatus({
        isAuthenticated: true,
        isAuthorized: false,
        isLoading: false,
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}`
      });

      // Redirect to dashboard or error page
      router.push('/dashboard');
      return;
    }

    // Check profile requirement
    if (requireProfile && user && !user.profile) {
      console.log(`🚫 Profile required for: ${pathname}`);
      setAuthStatus({
        isAuthenticated: true,
        isAuthorized: false,
        isLoading: false,
        error: 'Profile setup required'
      });
      
      router.push('/profile/setup');
      return;
    }

    // Check token validity
    const hasValidToken = tokenManager.hasValidToken();
    if (requireAuth && !hasValidToken) {
      console.log(`🚫 Invalid token for: ${pathname}`);
      setAuthStatus({
        isAuthenticated: false,
        isAuthorized: false,
        isLoading: false,
        error: 'Invalid or expired session'
      });
      
      router.push(redirectTo);
      return;
    }
    // All checks passed
    setAuthStatus({
      isAuthenticated: !!user,
      isAuthorized: true,
      isLoading: false,
      error: null
    });
  }, [user, loading, requireAuth, allowedRoles, redirectTo, requireProfile, pathname, router]);
  return authStatus;
}

// ✨ NEW: Specific hooks for different user types
export function useAdminGuard() {
  return useAuthGuard({
    requireAuth: true,
    allowedRoles: ['admin'],
    redirectTo: '/dashboard'
  });
}

export function useDoctorGuard() {
  return useAuthGuard({
    requireAuth: true,
    allowedRoles: ['doctor', 'admin'],
    redirectTo: '/dashboard'
  });
}

export function usePatientGuard() {
  return useAuthGuard({
    requireAuth: true,
    allowedRoles: ['patient'],
    requireProfile: true,
    redirectTo: '/login'
  });
}

export function useStaffGuard() {
  return useAuthGuard({
    requireAuth: true,
    allowedRoles: ['admin', 'doctor', 'nurse', 'receptionist', 'pharmacist'],
    redirectTo: '/login'
  });
}
