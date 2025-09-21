"use client";
import { useState, useEffect } from "react";
import {
  Shield, Edit, Trash2, Plus, Save, X, Calendar, CreditCard, Building, Hash, AlertCircle, CircleCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const InsuranceDetails = () => {
  const [insuranceInfo, setInsuranceInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, isAuthenticated } = useAuth();


  const [formData, setFormData] = useState({
    provider: "",
    policyNumber: "",
    groupNumber: "",
    validUntil: ""
  });

  useEffect(() => {
    fetchInsuranceInfo();
  }, [user, isAuthenticated]);

  const fetchInsuranceInfo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/patients/insuranceDetails`, {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Error while fetching insurance details");
      }

      const data = await response.json();
      setInsuranceInfo(data.insuranceInfo);

      if (data.insuranceInfo) {
        setFormData({
          provider: data.insuranceInfo.provider || "",
          policyNumber: data.insuranceInfo.policyNumber || "",
          groupNumber: data.insuranceInfo.groupNumber || "",
          validUntil: data.insuranceInfo.validUntil || ""
        });
      }
    } catch (error) {
      console.log("error while fetching insurance details");
      setError("Error fetching insurance info");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");

      // validations
      if (!formData.provider.trim()) {
        setError("Insurance provider is required");
        return;
      }

      if (!formData.policyNumber.trim()) {
        setError("policyNumber is required")
      }

      // Decide API method dynamically
      const method = insuranceInfo ? "PUT" : "POST";

      const response = await fetch("/api/patients/insuranceDetails", {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.message || "Failed to save insurance info");
        throw new Error("Failed to save insurance details");
      }

      const data = await response.json();
      setInsuranceInfo(data.insuranceInfo);
      setIsEditing(false);
      setSuccess("insurance information saved successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.log('Error saving insurance information', error);
      setError('Error saving insurance information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSaving(true);
      setError("");

      const response = await fetch("/api/patients/insuranceDetails", {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        setError('Failed to delete insurance information')
      }

      setInsuranceInfo(null);
      setFormData({
        provider: "",
        policyNumber: "",
        groupNumber: "",
        validUntil: ""
      });
      setSuccess("Insurance information deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.log("Failed to delete insurance information");
      setError('Failed to delete insurance information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    if (insuranceInfo) {
      setFormData({
        provider: insuranceInfo.provider || "",
        policyNumber: insuranceInfo.policyNumber || "",
        groupNumber: insuranceInfo.groupNumber || "",
        validUntil: insuranceInfo.validUntil ? 
          new Date(insuranceInfo.validUntil).toISOString().split("T")[0]: ""
      });
    }
  };

  const isValidUntilExpiring = () => {
    if (!insuranceInfo?.validUntil) {
      return
    }
    const validDate = new Date(insuranceInfo.validUntil);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    return validDate <= thirtyDaysFromNow && validDate >= today;
  };

  const isValidUntilExpired = () => {
    if (!insuranceInfo?.validUntil) {
      return
    }
    const validDate = new Date(insuranceInfo.validUntil);
    const today = new Date();
    return validDate < today;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  };
  // console.log("insuranceInfo", insuranceInfo)
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Shield className="w-8 h-8 text-blue-500 mr-3" />
          Insurance Information
        </h1>
        <p className="text-gray-600">Manage patient insurance details and coverage information</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CircleCheck className="w-5 h-5 text-green-500 mr-3" />
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

       {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {!insuranceInfo && !isEditing ? (
          // No insurance info - show add button
          <div className="text-center py-8">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Insurance Information</h3>
            <p className="text-gray-500 mb-6">Add insurance details to keep patient coverage information up to date.</p>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Insurance Information
            </button>
          </div>
          ) : isEditing ? (
          // Edit form
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {insuranceInfo ? 'Edit Insurance Information' : 'Add Insurance Information'}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Provider *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    id="provider"
                    name="provider"
                    value={formData.provider}
                    onChange={handleInputChange}
                    placeholder="e.g., Blue Cross Blue Shield"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Number *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    id="policyNumber"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., ABC123456789"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="groupNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Group Number
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    id="groupNumber"
                    name="groupNumber"
                    value={formData.groupNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., GRP001"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

               <div>
                <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Until
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    id="validUntil"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          ) : (
          // Display insurance info
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Insurance Details</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
             {/* Status Alert */}
            {isValidUntilExpired() && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                  <p className="text-red-700 font-medium">Insurance Expired</p>
                </div>
                <p className="text-red-600 text-sm mt-1">
                  This insurance policy expired on {new Date(insuranceInfo.validUntil).toLocaleDateString()}
                </p>
              </div>
            )}

            {isValidUntilExpiring() && !isValidUntilExpired() && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
                  <p className="text-yellow-700 font-medium">Insurance Expiring Soon</p>
                </div>
                <p className="text-yellow-600 text-sm mt-1">
                  This insurance policy will expire on {new Date(insuranceInfo.validUntil).toLocaleDateString()}
                </p>
              </div>
            )}

             <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Insurance Provider</label>
                  <div className="flex items-center">
                    <Building className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-gray-900 font-medium">{insuranceInfo.provider || 'Not specified'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Policy Number</label>
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-gray-900 font-mono">{insuranceInfo.policyNumber || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Group Number</label>
                  <div className="flex items-center">
                    <Hash className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-gray-900 font-mono">{insuranceInfo.groupNumber || 'Not specified'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Valid Until</label>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">
                      {insuranceInfo.validUntil ? 
                        new Date(insuranceInfo.validUntil).toLocaleDateString() : 
                        'Not specified'
                      }
                      </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InsuranceDetails;