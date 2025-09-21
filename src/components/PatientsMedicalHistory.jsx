"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";


export default function PatientsMedicalHistory () {
  const { user, isAuthenticated } = useAuth();
  const [medicalData, setMedicalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const response = await fetch("/api/patients/medical-history", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch medical history");
        };

        const data = await response.json();
        setMedicalData(data);
      } catch (error) {
        console.error("Error fetching medical history:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMedicalHistory();
    }
  }, [isAuthenticated]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!medicalData) return <div>No medical data available.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Medical History</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <p><span className="font-medium">Name:</span> {medicalData.personalInfo.firstName} {medicalData.personalInfo.lastName}</p>
            <p><span className="font-medium">Blood Group:</span> {medicalData.bloodGroup}</p>
          </div>
          
          <MedicalHistoryList medicalInfo={medicalData.medicalInfo} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Insurance Information</h2>
          <InsuranceInfoCard insuranceInfo={medicalData.medicalInfo.insuranceInfo} />
        </div>
      </div>
    </div>
  )
}