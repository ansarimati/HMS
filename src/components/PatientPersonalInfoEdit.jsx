// "user client";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";

// export default function ProfileForm ({ initialData }) {
//   const { user, refreshUser } = useAuth();
//   const [ formData, setFormData ] = useState({
//     firstName: initialData?.firstName || "",
//     lastName: initialData?.lastName || "",
//     email: initialData?.email || "", 
//     phone: initialData?.phone || "",
//     address: initialData?.address || "",
//     dateOfBirth: initialData?.dateOfBirth || "",
//     gender: initialData?.gender || "",
//     emergencyContact: {
//       name: initialData?.emergencyContact?.name || "",
//       relationship: initialData?.emergencyContact?.relationship || "",
//       phone: initialData?.emergencyContact?.phone || ""
//     },
//     insurance: {
//       provider: initialData?.insurance?.provider || "",
//       policyNumber: initialData?.insurance?.policyNumber || "",
//       expiryDate: initialData?.insurance?.expiryDate || ""
//     },
//     medicalHistory: {
//       conditions: initialData?.medicalHistory?.conditions || "",
//       allergies: initialData?.medicalHistory?.allergies || "",
//       medications: initialData?.medicalHistory?.medications || ""
//     }
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [message, setMessage] = useState({ type: "", content: "" });

//   useEffect(() => {
//     if (user) {
//       setFormData(prevData => ({
//         ...prevData,
//         firstName: user.profile.personalInfo.firstName || prevData.firstName,
//         lastName: user.profile.personalInfo.lastName || prevData.lastName,
//         email: user.email || prevData.email,
//         phone: user.phone || prevData.phone,
//         address: user.profile.contactInfo.address || prevData.address,
//         dateOfBirth: user.profile.personalInfo.dateOfBirth 
//           ? new Date(user.profile.personalInfo.dateOfBirth).toISOString().split('T')[0] 
//           : prevData.dateOfBirth,
//         gender: user.profile.personalInfo.gender || prevData.gender,
//         emergencyContact: {
//           ...prevData.emergencyContact,
//           name: user.emergencyContact?.name || prevData.emergencyContact.name,
//           relationship: user.emergencyContact?.relationship || prevData.emergencyContact.relationship,
//           phone: user.emergencyContact?.phone || prevData.emergencyContact.phone,
//         },
//         insurance: {
//           ...prevData.insurance,
//           provider: user.insurance?.provider || prevData.insurance.provider,
//           policyNumber: user.insurance?.policyNumber || prevData.insurance.policyNumber,
//           expiryDate: user.insurance?.expiryDate || prevData.insurance.expiryDate,
//         },
//         medicalHistory: {
//           ...prevData.medicalHistory,
//           conditions: user.medicalHistory?.conditions || prevData.medicalHistory.conditions,
//           allergies: user.medicalHistory?.allergies || prevData.medicalHistory.allergies,
//           medications: user.medicalHistory?.medications || prevData.medicalHistory.medications, 
//         }
//       }));
//     }
//   }, [user])

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes('.')) {
//       const [section, field] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [section]: {
//           ...prev[section],
//           [field]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setMessage({ type: "", content: "" });

//     try {
//       const response = await fetch("/api/auth/profile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         }, 
//         credentials: "include",
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();

//       if (response) {
//         setMessage({ type: "success", content: "Profile updated successfully." });
//         await refreshUser();
//       } else {
//         throw new Error(data.message || "Failed to update profile");
//       }
//     } catch (error) {
//       console.log("Error updating profile:", error);
//       setMessage({ type: "error", content: error.message });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   console.log("user", user)
//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Personal Information */}
//       <section className="space-y-4">
//         <h2 className="text-xl font-semibold">Personal Information</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             placeholder="First Name"
//             className="input-field"
//           />
//           <input
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             placeholder="Last Name"
//             className="input-field"
//           />
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Email"
//             className="input-field"
//           />
//           <input
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             placeholder="Phone"
//             className="input-field"
//           />
//           <input
//             type="text"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             placeholder="Address"
//             className="input-field col-span-2"
//           />
//           <input
//             type="date"
//             name="dateOfBirth"
//             value={formData.dateOfBirth}
//             onChange={handleChange}
//             className="input-field"
//           />
//           <select
//             name="gender"
//             value={formData.gender}
//             onChange={handleChange}
//             className="input-field"
//           >
//             <option value="">Select Gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//         </div>
//       </section>

//       {/* Emergency Contact */}
//       <section className="space-y-4">
//         <h2 className="text-xl font-semibold">Emergency Contact</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="emergencyContact.name"
//             value={formData.emergencyContact.name}
//             onChange={handleChange}
//             placeholder="Contact Name"
//             className="input-field"
//           />
//           <input
//             type="tel"
//             name="emergencyContact.phone"
//             value={formData.emergencyContact.phone}
//             onChange={handleChange}
//             placeholder="Contact Phone"
//             className="input-field"
//           />
//           <input
//             type="text"
//             name="emergencyContact.relationship"
//             value={formData.emergencyContact.relationship}
//             onChange={handleChange}
//             placeholder="Relationship"
//             className="input-field"
//           />
//         </div>
//       </section>

//       {/* Insurance Information */}
//       <section className="space-y-4">
//         <h2 className="text-xl font-semibold">Insurance Information</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="insurance.provider"
//             value={formData.insurance.provider}
//             onChange={handleChange}
//             placeholder="Insurance Provider"
//             className="input-field"
//           />
//           <input
//             type="text"
//             name="insurance.policyNumber"
//             value={formData.insurance.policyNumber}
//             onChange={handleChange}
//             placeholder="Policy Number"
//             className="input-field"
//           />
//           <input
//             type="date"
//             name="insurance.expiryDate"
//             value={formData.insurance.expiryDate}
//             onChange={handleChange}
//             className="input-field"
//           />
//         </div>
//       </section>
//       {/* Medical History */}
//       <section className="space-y-4">
//         <h2 className="text-xl font-semibold">Medical History</h2>
//         <div className="grid grid-cols-1 gap-4">
//           <textarea
//             name="medicalHistory.conditions"
//             value={formData.medicalHistory.conditions}
//             onChange={handleChange}
//             placeholder="Medical Conditions"
//             className="input-field"
//             rows="3"
//           />
//           <textarea
//             name="medicalHistory.allergies"
//             value={formData.medicalHistory.allergies}
//             onChange={handleChange}
//             placeholder="Allergies"
//             className="input-field"
//             rows="3"
//           />
//           <textarea
//             name="medicalHistory.medications"
//             value={formData.medicalHistory.medications}
//             onChange={handleChange}
//             placeholder="Current Medications"
//             className="input-field"
//             rows="3"
//           />
//         </div>
//       </section>
//       {message.content && (
//         <div className={`p-4 rounded ${
//           message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//         }`}>
//           {message.content}
//         </div>
//       )}

//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
//       >
//         {isSubmitting ? 'Updating...' : 'Update Profile'}
//       </button>
//     </form>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export default function PatientPersonalInfoEdit() {
  const { user, checkAuth } = useAuth();

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
    },
    contactInfo: {
      phone: "",
      email: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  // Populate form when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        personalInfo: {
          firstName: user.profile?.personalInfo?.firstName || "",
          lastName: user.profile?.personalInfo?.lastName || "",
          dateOfBirth: user.profile?.personalInfo?.dateOfBirth
            ? new Date(user.profile.personalInfo.dateOfBirth)
                .toISOString()
                .split("T")[0]
            : "",
          gender: user.profile?.personalInfo?.gender || "",
        },
        contactInfo: {
          phone: user.profile?.contactInfo?.phone || "",
          email: user.email || "",
          address: {
            street: user.profile?.contactInfo?.address?.street || "",
            city: user.profile?.contactInfo?.address?.city || "",
            state: user.profile?.contactInfo?.address?.state || "",
            country: user.profile?.contactInfo?.address?.country || "",
            zipCode: user.profile?.contactInfo?.address?.zipCode || "",
          },
        },
      });
    }
  }, [user]);

  // Handle nested fields (dot notation like "contactInfo.address.city")
  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setFormData((prev) => {
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", content: "" });

    try {
      const response = await fetch(`/api/patients/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessage({ type: "success", content: "Profile updated successfully." });
        toast.success("Profile updated successfully");
        await checkAuth(); // Refresh user data
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", content: error.message });
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl shadow-md">
      {/* Personal Information */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="">
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="personalInfo.firstName"
              value={formData.personalInfo.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="personalInfo.lastName"
              value={formData.personalInfo.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.contactInfo.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date Of Birth</label>
            <input
              type="date"
              name="personalInfo.dateOfBirth"
              value={formData.personalInfo.dateOfBirth}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="personalInfo.gender"
              value={formData.personalInfo.gender}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="contactInfo.phone"
              value={formData.contactInfo.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Street Address</label>
            <input
              type="text"
              name="contactInfo.address.street"
              value={formData.contactInfo.address.street}
              onChange={handleChange}
              placeholder="Street"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="contactInfo.address.city"
              value={formData.contactInfo.address.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              name="contactInfo.address.state"
              value={formData.contactInfo.address.state}
              onChange={handleChange}
              placeholder="State"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input
              type="text"
              name="contactInfo.address.country"
              value={formData.contactInfo.address.country}
              onChange={handleChange}
              placeholder="Country"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Zip Code</label>
            <input
              type="text"
              name="contactInfo.address.zipCode"
              value={formData.contactInfo.address.zipCode}
              onChange={handleChange}
              placeholder="Zip Code"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {message.content && (
        <div
          className={`p-4 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.content}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 transition"
      >
        {isSubmitting ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
