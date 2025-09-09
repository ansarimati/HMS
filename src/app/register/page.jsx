"use client"
import { DoctorRegistrationForm } from "@/components/DoctorRegistrationForm";
import { NurseRegistrationForm } from "@/components/NurseRegistrationForm";
import { PatientRegistrationForm } from "@/components/PatientRegistrationForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function RegisterPage () {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const router = useRouter();
  const { user } = useAuth();
  // const user = "";

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router])

  const roleOptions = [
    {
      role: "patient",
      title: "Patient",
      description: "Register as a patient to book appointments and access medical records",
      icon: '👤',
      color: "blue",
      features: ["  Book Appointments", "View Medical Recors", "Access Lab Results", "Online Consultations"]
    },
    {
      role: 'doctor',
      title: 'Doctor',
      description: 'Register as a medical doctor to manage patients and appointments',
      icon: '👨‍⚕️',
      color: 'green',
      features: ['Manage Patients', 'Schedule Appointments', 'Write Prescriptions', 'View Medical Records']
    },
    {
      role: "nurse",
      title: "Nurse",
      description: "Register as a nurse to assist in patient care and ward management",
      icon: '👩‍⚕️',
      color: 'purple',
      features: ['Patient Care', 'Ward Management', 'Medication Administration', 'Shift Scheduling']
    }
  ];

  // Generic registration handler that route to specific end points

  const handleRegistration = async (formData, userType) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let endPoint;

      switch (userType) {
        case "patient":
          endPoint = "/api/patients/register";
          break;
        
        case "doctor":
          endPoint = "/api/doctors/register"
          break;
        
        case "nurse":
          endPoint = "/api/nurses/register"
          break;
        
        default:
          throw new Error("Invalid user type");
      }

      const response = await fetch(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json();

      if (response.ok) {
        setSuccess(`${userType.charAt(0).toUpperCase() + userType.slice(1)} account created successfully! Redirecting to dashboard...`);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError(data.error || "Registration Failed");
        console.log("Registration error", data);
      }

    } catch (error) {
      console.error('Registration exception:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Specific handlers for each user type
  const handlePatientRegistration = (formData) => handleRegistration(formData, "patient");
  const handleDoctorRegistration = (formData) => handleRegistration(formData, "doctor");
  const handleNurseRegistration = (formData) => handleRegistration(formData, "nurse");

  // Dont render if user is already logged in
  if (user) {
    return null;
  }

  // Role selection page
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Join Our Healthcare System
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your role to create an account and start accessing our comprehensive hospital management platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {
              roleOptions.map((option) => (
                <Card
                  key={option.role}
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-\${option.color}-300 hover:-translate-y-1`}
                onClick={() => setSelectedRole(option.role)}
                >
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-6">{option.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {option.description}
                    </p>

                    <div className="space-y-2 mb-6">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-center text-sm text-gray-500">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                    </div>

                    <Button className={`w-full bg-\${option.color}-600 hover:bg-\${option.color}-700`}>
                      Register as {option.title}
                    </Button>
                  </CardContent>
                </Card>
              ))
            }
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }


  // Registration form Page
return (
  <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      {/* Back button and header */}
      <div className="mb-8">
        <Button
          variant={"outline"}
          onClick={() => {
            setSelectedRole(null);
            setError("");
            setSuccess("");
          }}
          className={"mb-4"}
        >
          Back to Selection
        </Button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
              {selectedRole === 'patient' && '👤 Patient Registration'}
              {selectedRole === 'doctor' && '👨‍⚕️ Doctor Registration'}
              {selectedRole === 'nurse' && '👩‍⚕️ Nurse Registration'}
            </h1>
            <p className="text-gray-600 mt-2">
              Please fill in all required information to create your account
            </p>
        </div>
      </div>

      {/* Error/Success Messages */}
      {
        error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Registration Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )
      }

      {
        success && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div  className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success!</h3>
                <p className="text-sm text-green-700 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )
      }

      {/* Registration Forms */}
        {selectedRole === 'patient' && (
          <PatientRegistrationForm
            onSubmit={handlePatientRegistration}
            loading={loading}
          />
        )}

      {selectedRole === 'doctor' && (
          <DoctorRegistrationForm
            onSubmit={handleDoctorRegistration}
            loading={loading}
          />
        )}

        {selectedRole === 'nurse' && (
          <NurseRegistrationForm
            onSubmit={handleNurseRegistration}
            loading={loading}
          />
        )}

        {/* Login link */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>
    </div>
  </div>
)
}


