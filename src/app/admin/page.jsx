'use client';

import { useAdminGuard } from '@/hooks/useAuthGuard';
import { useAuth } from '@/context/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function AdminPage() {
  const { user } = useAuth();
  
  // ✨ NEW: Use auth guard to protect this page
  const { isAuthenticated, isAuthorized, isLoading, error } = useAdminGuard();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show error if not authorized (though redirect should happen)
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render admin content
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.profile?.personalInfo?.firstName || user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Admin-only content here */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">User Management</h3>
            <p className="text-gray-600">Manage system users and roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">System Reports</h3>
            <p className="text-gray-600">View comprehensive system reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Hospital Settings</h3>
            <p className="text-gray-600">Configure hospital-wide settings</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Audit Logs</h3>
            <p className="text-gray-600">Review system activity logs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
