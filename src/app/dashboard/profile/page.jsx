"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import PatientPersonalInfoEdit from '@/components/PatientPersonalInfoEdit';

const Profile = () => {
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/auth/profile", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = response.json();
        setProfileData(data);
      } catch (error) {
        console.log("Error fetching profile data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchProfile(); 
  }, [user]);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Profile Management</h1>
      { profileData && <PatientPersonalInfoEdit initialData={profileData} />}
    </div>
  )
}

export default Profile