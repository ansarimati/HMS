"use client";

import { usePathname, useRouter } from "next/navigation";

// const { createContext, useState, useEffect, useContext, useCallback } = require("react");
import { createContext, useState, useEffect, useContext, useCallback } from "react";

const AuthContext = createContext({});

export function AuthProvider ({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Router and pathname for navigation
  const router = useRouter();
  const pathname = usePathname();

  // check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle route protection
  useEffect(() => {
    if (!loading) {
        const publicRoutes = ["/", "/login", "/register", "/forget-password"];
        const isPublicRoute = publicRoutes.includes(pathname);

        if (user && (pathname === "/login" || pathname === "/register")) {
          // Redirect logged in users away from login and register path
          router.push("/dashboard");
        } else if (!user && !isPublicRoute) {
          // redirect all unauthenticated users to / home page
          router.push("/");
        }
    }
  }, [user, loading, pathname, router]);

  // const checkAuth = async () => {
  //   try {
  //     const response = await fetch("/api/auth/profile");
  //     if (response.ok) {
  //       const data = await response.json();
  //       setUser(data.user);
  //     } else {
  //       setUser(null);
  //     }
  //   } catch (error) {
  //     console.error('Auth check failed:', error);
  //     setUser(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const hasAuthCookie = document.cookie.includes("auth-status=authenticated");

      if (!hasAuthCookie) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-control": "no-cache",
          "Pragma": "no-cache"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setError(null);
      } else {
        setUser(null);

        if (response.status === 401) {
          await clearAuthCookies();
        }
      }
    } catch (error) {
      setUser(null);
      setError("Failed to check authentication status");
    } finally {
      setLoading(false);
    }
  }, []);


  // New route protection handler
  const handleRouteProtection = useCallback(() => {
    const publicRoutes = ["/", "login", "/register", "/forget-password", "reset-password"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (user && (pathname === "/login" || pathname === "/register")) {
      router.push("/dashboard");
    } else if (!user && !isPublicRoute && !pathname.startsWith("/api")) {
      router.push("/");
    }
  }, [user, pathname, router]);

  // const login = async () => {
  //   try {
  //     const response = await fetch("/api/auth/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       setUser(data.user);
  //       return { success: true, user: data.user };
  //     } else {
  //       return { success: false, error: data.error };
  //     }
  //   } catch (error) {
  //     console.log("Loin failed", error);
  //     return { success: false, error: "Loin failed, Please try again" }
  //   }
  // };

  const login = useCallback( async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setError(null);

        return {
          success: true,
          user: data.user,
          message: data.message
        };
      } else {
        setError(data.error);
        return {
          success: false,
          error: data.error,
          code: data.code
        };
      }
    } catch (error) {
      const errorMessage = 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        code: "NETWORK_ERROR"
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // const logout = async () => {
  //   try {
  //     const response = await fetch("/api/auth/logout", {
  //       method: "POST",
  //     });
  //   } catch (error) {
  //     console.log("Logout failed", error);
  //   } finally {
  //     setUser(null);
  //   }
  // }

  const logout = useCallback( async () => {
    setLoading(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.log('AuthContext: Logout API error:', error);
    }

    setUser(null);
    setError(null);

    await clearAuthCookies();
    setLoading(false);
  }, []);

  const updatePassword = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ currentPassword, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success:true, message: data.message }
      } else {
        return { success: false, message: data.error }
      }
    } catch (error) {
      console.log("Password update failed", error);
      return { success: false, error: "Password update failed, Please try again" }
    }
  }

  const clearAuthCookies = useCallback(async() => {
    document.cookie = "auth-status=; expires= Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
  }, []);

  const refreshUser = useCallback(async() => {
    await checkAuth();
  }, [checkAuth]);

  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  const hasAnyRole = useCallback((roles) => {
    return roles.includes(user?.role);
  }, [user]);


  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updatePassword,
    checkAuth: refreshUser,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!user,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth () {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("user auth must be used within an Auth provider");
  };
  return context;
}

export function useIsAdmin () {
  const { hasRole } = useAuth();
  return hasRole("admin");
}

export function useIsDoctor () {
  const { hasRole } = useAuth();
  return hasRole("doctor");
}

export function useIsPatient () {
  const { hasRole } = useAuth();
  return hasRole("patient");
}

export function useIsStaff () {
  const { hasAnyRole } = useAuth();
  return hasAnyRole(["admin", "doctor", "nurse", "receptionist", "pharmacist"]);
}
