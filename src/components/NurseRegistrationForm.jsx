'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';

export function NurseRegistrationForm({ onSubmit, loading }) {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      phone: '',
      email: ''
    },
    professionalInfo: {
      qualification: [],
      experience: 0,
      licenseNumber: '',
      department: '',
      shift: 'morning',
      wardAssigned: ''
    }
  });

  const [errors, setErrors] = useState({});

  // Fetch departments for dropdown
  useEffect(() => {
    // In a real app, you'd fetch this from your API
    // For now, we'll use static data
    setDepartments([
      { _id: '1', name: 'General Medicine' },
      { _id: '2', name: 'ICU' },
      { _id: '3', name: 'Emergency' },
      { _id: '4', name: 'Pediatrics' },
      { _id: '5', name: 'Surgery' },
      { _id: '6', name: 'Maternity' },
      { _id: '7', name: 'Orthopedics' },
      { _id: '8', name: 'Cardiology' },
      { _id: '9', name: 'Neurology' },
      { _id: '10', name: 'Oncology' }
    ]);
  }, []);

  const handleChange = (e, section = null) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [name]: value
          }
        };
      } else {
        return {
          ...prev,
          [name]: value
        };
      }
    });

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (e) => {
    const { value } = e.target;
    const qualifications = value.split(',').map(item => item.trim()).filter(item => item);
    
    setFormData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        qualification: qualifications
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Personal info validation
    if (!formData.personalInfo.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (formData.personalInfo.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.personalInfo.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.personalInfo.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.personalInfo.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.personalInfo.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 65) {
        newErrors.dateOfBirth = 'Age must be between 18 and 65 years';
      }
    }

    if (!formData.personalInfo.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.personalInfo.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,15}$/.test(formData.personalInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Professional info validation
    if (!formData.professionalInfo.licenseNumber) {
      newErrors.licenseNumber = 'License number is required';
    } else if (formData.professionalInfo.licenseNumber.length < 5) {
      newErrors.licenseNumber = 'License number must be at least 5 characters';
    }

    if (!formData.professionalInfo.department) {
      newErrors.department = 'Department is required';
    }

    if (formData.professionalInfo.experience < 0 || formData.professionalInfo.experience > 40) {
      newErrors.experience = 'Experience must be between 0 and 40 years';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Sync personal email with login email
      const submitData = {
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          email: formData.email
        }
      };
      onSubmit(submitData);
    }
  };

  const validateField = (name, value) => {
  let error = "";

  if (name === "email") {
    if (!value) {
      error = "Email is required";
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      error = "Please enter a valid email";
    }
  }

  if (name === "password") {
    if (!value) {
      error = "Password is required";
    } else if (value.length < 8) {
      error = "Password must be at least 8 characters";
    }
    if (formData.confirmPassword && formData.confirmPassword !== value) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    }
  }

  if (name === "confirmPassword") {
    if (!value) {
      error = "Please confirm your password";
    } else if (value !== formData.password) {
      error = "Passwords do not match";
    }
  }

  setErrors(prev => ({ ...prev, [name]: error }));
};


  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-gray-900">Nurse Registration</h2>
        <p className="text-sm text-center text-gray-600">
          Register as a nursing professional in our healthcare system
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Account Information Section */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
              <p className="text-sm text-gray-600">Create your login credentials</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <Input
                  name="email"
                  type="email"
                  label="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  onBlur={(e) => validateField("email", e.target.value)}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Password *</label>
                <Input
                  name="password"
                  type="password"
                  label="Password *"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  onBlur={(e) => validateField("password", e.target.value)}
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
                <Input
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password *"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  onBlur={(e) => validateField("confirmPassword", e.target.value)}
                />
                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Password Requirements:</strong> Minimum 8 characters with a mix of letters and numbers
              </p>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              <p className="text-sm text-gray-600">Your basic personal details</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">First Name *</label>
                <Input
                  name="firstName"
                  label="First Name *"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handleChange(e, 'personalInfo')}
                  error={errors.firstName}
                  placeholder="Enter your first name"
                  autoComplete="given-name"
                />
                {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
              </div>

              <div className='space-y-1'>
                <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                <Input
                  name="lastName"
                  label="Last Name *"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => handleChange(e, 'personalInfo')}
                  error={errors.lastName}
                  placeholder="Enter your last name"
                  autoComplete="family-name"
                />
                {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <Input
                  name="dateOfBirth"
                  type="date"
                  label="Date of Birth *"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) => handleChange(e, 'personalInfo')}
                  error={errors.dateOfBirth}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                />
                {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.personalInfo.gender}
                  onChange={(e) => handleChange(e, 'personalInfo')}
                  className={`
                    block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                    ${errors.gender ? 'border-red-300' : 'border-gray-300'}
                  `}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-red-600">{errors.gender}</p>
                )}
              </div>

              <div className='space-y-1'>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Input
                  name="phone"
                  label="Phone Number *"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handleChange(e, 'personalInfo')}
                  error={errors.phone}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
              <p className="text-sm text-gray-600">Your nursing qualifications and work details</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className='space-y-1'>
                <label className="block text-sm font-medium text-gray-700">Nursing License Number</label>
                <Input
                  name="licenseNumber"
                  label="Nursing License Number *"
                  value={formData.professionalInfo.licenseNumber}
                  onChange={(e) => handleChange(e, 'professionalInfo')}
                  error={errors.licenseNumber}
                  placeholder="Enter your license number"
                  className="font-mono"
                />
                {errors.licenseNumber && (
                  <p className="text-sm text-red-600">{errors.licenseNumber}</p>
                )}
              </div>

              <div className='space-y-1'>
                <label className="block text-sm font-medium text-gray-700">
                  Years of Experience
                </label>
                <Input
                  name="experience"
                  type="number"
                  label="Years of Experience"
                  value={formData.professionalInfo.experience}
                  onChange={(e) => handleChange(e, 'professionalInfo')}
                  error={errors.experience}
                  placeholder="Years of nursing experience"
                  min="0"
                  max="40"
                />
                {errors.experience && (
                  <p className="text-sm text-red-600">{errors.experience}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.professionalInfo.department}
                  onChange={(e) => handleChange(e, 'professionalInfo')}
                  className={`
                    block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                    ${errors.department ? 'border-red-300' : 'border-gray-300'}
                  `}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-sm text-red-600">{errors.department}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Preferred Shift
                </label>
                <select
                  name="shift"
                  value={formData.professionalInfo.shift}
                  onChange={(e) => handleChange(e, 'professionalInfo')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="morning">Morning Shift (6:00 AM - 2:00 PM)</option>
                  <option value="evening">Evening Shift (2:00 PM - 10:00 PM)</option>
                  <option value="night">Night Shift (10:00 PM - 6:00 AM)</option>
                </select>
                <p className="text-xs text-gray-500">
                  You can change this later based on hospital requirements
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Qualifications & Certifications
              </label>
              <textarea
                placeholder="Enter your nursing qualifications separated by commas (e.g., BSc Nursing, MSc Nursing, Critical Care Certification, BLS Certification)"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                onChange={handleArrayChange}
              />
              <p className="text-xs text-gray-500">
                Separate multiple qualifications with commas. Include any special certifications.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Ward Assignment Preference (Optional)
              </label>
              <Input
                name="wardAssigned"
                value={formData.professionalInfo.wardAssigned}
                onChange={(e) => handleChange(e, 'professionalInfo')}
                placeholder="Preferred ward (e.g., ICU Ward 3, General Ward A)"
              />
              <p className="text-xs text-gray-500">
                This is optional and can be assigned by the nursing supervisor later
              </p>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I acknowledge that I have read and agree to the hospital's terms of service and privacy policy. 
                I confirm that all information provided is accurate and complete. I understand that providing 
                false information may result in rejection of my application or termination of employment.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              // loading={loading}
              disabled={loading}
              className="w-full md:w-auto px-8 py-3"
            >
              {loading ? 'Registering...' : 'Register as Nurse'}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Need help with registration? Contact HR at{' '}
              <a href="mailto:hr@hospital.com" className="text-blue-600 hover:text-blue-500">
                hr@hospital.com
              </a>{' '}
              or call{' '}
              <a href="tel:+91-XXX-XXX-XXXX" className="text-blue-600 hover:text-blue-500">
                +91-XXX-XXX-XXXX
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}