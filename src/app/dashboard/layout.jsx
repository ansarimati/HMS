"use client";
import PatientMenu from '@/components/PatientMenu';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const DashboardLayout = ({children}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
    if (!loading && user?.role !== 'patient') {
      router.push('/unauthorized');
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user || user.role !== 'patient') {
    return <div>Access Denied</div>;
  }


  return (
    <div className='flex h-screen'>
      {/* Sidebar */}
      <aside className='W-85 flex-shrink-0'>
        <PatientMenu />
      </aside>

      {/* Main Content */}
      <main className='flex-1 overflow-y-auto bg-gray-50'>
        <div className='container mx-auto py-6 px-4'>
          { children }
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout;