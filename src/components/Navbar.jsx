"use client";
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";


export function Navbar () {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  // Dont show Navbar on homepage for non authenticated users
  if (pathname === "/" && !user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center">
            <div className="text-xl font-bold text-blue-600">
              🏥 Hospital Management
            </div>
          </Link>

          {/* Navigation Links */}
          <div className='hidden md:flex items-center space-x-4'>
            {
              user ? (
                <>
                  <Link
                  href="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === '/dashboard' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Dashboard
                </Link>

                {
                  ( user.role === "admin" || user.role === "receptionist" ) && (
                    <Link 
                    href="/patients" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname.startsWith('/patients') 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Patients
                  </Link>
                  )
                }

                {(user.role === 'doctor' || user.role === 'admin') && (
                  <Link 
                    href="/appointments" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname.startsWith('/appointments') 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Appointments
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link 
                    href="/reports" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname.startsWith('/reports') 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Reports
                  </Link>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-3 border-l pl-4 ml-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900">
                      {user.profile?.personalInfo?.firstName || 'User'}
                    </span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="ml-2 border-gray-500 border-[1] text-blue-500 cursor-pointer"
                  >
                    Logout
                  </Button>
                </div>
                </>
              ) : (
                <div className='flex items-center space-x-2'>
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">
                      Register
                    </Button>
                  </Link>
                </div>
              )
            }
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            {
              user ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  // className={"ml-2 border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"}
                  // className="ml-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Logout
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </nav>
  );
}