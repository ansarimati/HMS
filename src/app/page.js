'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

    // Do not render homepage if user is already logged in (will redirect)
  useEffect(() => {
    if (!loading && user) {
      setRedirecting(true);
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Animation Trigger
    setIsVisible(true);
  }, []);

  // Show loading spinner while checking authentication
  if (loading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return null; // let the effect handle redirect
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100'
            : 'translate-y-10 opacity-0'
          }`}>
            <div className="mb-8">
              <div className="text-6xl mb-4">
                🏥
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Hospital Management
                <span className="text-blue-600 block">System</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
                Streamline healthcare operations with our comprehensive digital platform. 
                Manage patients, appointments, medical records, and staff efficiently.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href={"/register"}>
                <Button className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform    hover:-translate-y-1 transition-all duration-200">
                  Get Started - Register Now
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>

              <Link href={"/login"}>
                <Button
                  variant="outline"
                  className="px-8 py-4 text-lg border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Already Have Account? Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-72 h-72 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-96 h-96 bg-indigo-100 rounded-full opacity-20 animate-pulse delay-1000">
        </div>
      </div>

        {/* Features Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Manage Healthcare
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our platform provides comprehensive tools for all healthcare stakeholders
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Patient Features */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-200">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">👤</div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">For Patients</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>✓ Book Online Appointments</li>
                    <li>✓ Access Medical Records</li>
                    <li>✓ View Lab Results</li>
                    <li>✓ Digital Prescriptions</li>
                    <li>✓ Health History Tracking</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Nurse Features */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-200">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">👩‍⚕️</div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">For Nurses</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>✓ Patient Care Management</li>
                    <li>✓ Medication Administration</li>
                    <li>✓ Shift Scheduling</li>
                    <li>✓ Ward Management</li>
                    <li>✓ Care Documentation</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Admin Features */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-orange-200">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">⚙️</div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">For Administrators</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>✓ Staff Management</li>
                    <li>✓ Financial Reporting</li>
                    <li>✓ System Administration</li>
                    <li>✓ Data Analytics</li>
                    <li>✓ Compliance Management</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Trusted by Healthcare Professionals
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands of healthcare providers using our platform
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-gray-600 text-lg">Patients Registered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">200+</div>
                <div className="text-gray-600 text-lg">Medical Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600 text-lg">Departments</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600 text-lg">System Availability</div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration CTA Section */}
        <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Choose your role and join our comprehensive hospital management platform today
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200">
                Register Now - It's Free!
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </Button>
              </Link>

              <Link href="/login">
                <Button 
                  variant="outline" 
                  className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-blue-600 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
                >
                    Sign In to Continue
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                  <div className="flex items-center mb-4">
                  <div className="text-2xl mr-2">🏥</div>
                  <div className="text-xl font-bold">Hospital Management</div>
                </div>
                <p className="text-gray-400">
                  Comprehensive healthcare management platform for modern hospitals.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
                  <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Patient Management</li>
                  <li>Appointment Scheduling</li>
                  <li>Medical Records</li>
                  <li>Staff Management</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>📧 support@hospital.com</li>
                  <li>📞 +91-XXX-XXX-XXXX</li>
                  <li>📍 Mumbai, Maharashtra</li>
                </ul>
              </div>

            </div>
            <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
              <p>&copy; 2024 Hospital Management System. All rights reserved.</p>
            </div>

          </div>
        </footer>
    </div>
  );
}
