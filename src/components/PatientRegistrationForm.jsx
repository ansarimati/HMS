'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";

export function PatientRegistrationForm ({ onSubmit, loading }) {
  // STATES
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    personalInfo: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      maritalStatus: "",
      occupation: "",
      nationality: "Indian"
    },
    contactInfo: {
      phone: "",
      alternatePhone: "",
      email: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India"
      }
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      address: ""
    },
    medicalInfo: {
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      insuranceInfo: {
        provider: "",
        policyNumber: "",
        groupNumber: "",
        validUntil: ""
      }
    }
  });

  // phone number validation regex
  const PHONE_REGEX = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;

  // Check if email id already exist or not
  const checkEmailAvailability = async (email, role, setErrors) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }

    const emailReges = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: 'Please enter a valid email address',
      }));
      return;
    }

    try {
      const res = await fetch(`/api/check-email?email=${encodeURIComponent(email)}&role=patient`);
      const data = await res.json();

      if (data.exist) {
        setErrors(prev => ({
          ...prev,
          email: "Patient already exist",
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          email: ""
        }))
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        email: "Could not verify email MATI"
      }));
    }
  }

  const handleChange = (e, section = null, subsection = null) => {
    const { name, value } = e.target;

    setFormData(prev => {
      if (section && subsection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subsection]: {
              ...prev[section][subsection],
              [name]: value
            }
          }
        }
      } else if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [name]: value
          }
        }
      } else {
        return {
          ...prev,
          [name]: value
        }
      }
    });

    // clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }


  const handleArrayChange = (e, section, field) => {
      const { value } = e.target;
      const items = value.split(",").map(item => item.trim()).filter(item => item);

      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: items
        }
      }));
    }


    const validateStep1 = () => {
      const newErrors = {};

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
      }
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 char";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Password do not match";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
      const newErrors = {};

      if (!formData.personalInfo.firstName) newErrors.firstName = "First name is required";
      if (!formData.personalInfo.lastName) newErrors.lastName = "Last name is required";
      if (!formData.personalInfo.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.personalInfo.gender) newErrors.gender = "Gender is required";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    const validateStep3 = () => {
      const newErrors = {};

      if (!formData.contactInfo.phone) newErrors.phone = "Phone number is required";
        else if (!PHONE_REGEX.test(formData.contactInfo.phone)) newErrors.phone = "Enter valid phone number";
      if (!formData.contactInfo.address.street) newErrors.street = "Street address is required";
      if (!formData.contactInfo.address.city) newErrors.city = "City is required";
      if (!formData.contactInfo.address.state) newErrors.state = "State is required";
      if (!formData.contactInfo.address.zipCode) newErrors.zipCode = "Zipcode is required";
      if (formData.contactInfo.alternatePhone && !PHONE_REGEX.test(formData.contactInfo.alternatePhone)) {
        newErrors.alternatePhone = "Enter valid alternate phone number";
      } 
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
      let isValid = false;

      switch (currentStep) {
        case 1: 
          isValid = validateStep1();
          break;
        case 2:
          isValid = validateStep2();
          break;
        case 3:
          isValid = validateStep3();
          break;
      }

      if (isValid && currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }


    const handleSubmit = (e) => {
      e.preventDefault();
      e.stopPropagation();

      console.log("Submit triggered at step:", currentStep);
      if(currentStep !== 4) {
        return;
      }

      if (validateStep1() && validateStep2() && validateStep3()) {
        // Sync contact email with login email
        const submitData = {
          ...formData,
          contactInfo: {
            ...formData.contactInfo,
            email: formData.email
          }
        }
        console.log("Final API payload:", submitData);
        onSubmit(submitData)
      }
    };

  
  const renderStepIndicator = () => (
    <div className="flex justify-center items-center space-x-4 mb-6">
      {
        [1, 2, 3, 4].map((step) => (
          <div className="flex items-center" key={step}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep >= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              {step}
            </div>
            {
              step < 4  && (
                <div className={`w-12 h-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )
            }
          </div>
        ))
      }
    </div>
  )

  // RENDER STEPS
  const renderStep1 = () => (
    <div className='space-y-4'>
      <h2 className='font-bold'>Account Information</h2>
      <p className='text-sm text-gray-500 mb-0'>
        Fields marked with <span className='text-red-500'>*</span> are
        mandatory.
      </p>
      <p className='text-sm text-gray-500'>
        Password must be at least 8 characters.
      </p>

      {/* EMAIL */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Email Address <span className='text-red-500'>*</span>
        </label>
        <Input
          name='email'
          type='email'
          label='Email Address'
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder={'Enter your email'}
          // onBlur={(e) => {
          //   const email = e.target.value;
          //   if (!email) {
          //     setErrors((prev) => ({ ...prev, email: 'Email is required' }));
          //   } else {
          //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          //     if (!emailRegex.test(email)) {
          //       setErrors((prev) => ({
          //         ...prev,
          //         email: 'Please enter a valid email address',
          //       }));
          //     } else {
          //       setErrors((prev) => ({ ...prev, email: '' }));
          //     }
          //   }
          // }}
          onBlur={(e) => checkEmailAvailability(e.target.value.trim(), formData.role, setErrors)}
        />
        {errors.email && <p className='text-sm text-red-600'>{errors.email}</p>}
      </div>

      {/* PASSWORD */}
      <div className='space-y-1 relative'>
        <label className='block text-sm font-medium text-gray-700'>
          Password
          <span className='text-red-500'> *</span>
        </label>
        <Input
          name='password'
          type={showPassword ? 'text' : 'password'}
          label='Password'
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder={`Enter your password`}
        />
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className='absolute right-3 top-8 text-gray-500 hover:text-gray-700'
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {errors.password && (
          <p className='text-sm text-red-600'>{errors.password}</p>
        )}
      </div>

      {/* CONFIRM PASSWORD */}

      <div className='space-y-1 relative mb-2'>
        <label className='block text-sm font-medium text-gray-700'>
          Confirm Password <span className='text-red-500'>*</span>
        </label>
        <Input
          name='confirmPassword'
          type={showConfirmPassword ? 'text' : 'password'}
          label='Confirm Password'
          value={formData.confirmPassword}
          onChange={(e) => {
            handleChange(e);
            // on spot validation for password match
            if (formData.password && e.target.value !== formData.password) {
              setErrors((prev) => ({
                ...prev,
                confirmPassword: 'Password do not match',
              }));
            } else {
              setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }
          }}
          error={errors.confirmPassword}
          placeholder={'Confirm your password'}
        />
        <button
          type='button'
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className='absolute right-3 top-8 text-gray-500 hover:text-gray-700'
        >
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {errors.confirmPassword && (
          <p className='text-sm text-red-600'>{errors.confirmPassword}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Personal Information</h3>

      {/* First & Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <Input
            name="firstName"
            label="First Name"
            value={formData.personalInfo.firstName}
            onChange={(e) => handleChange(e, "personalInfo")}
            error={errors.firstName}
            placeholder="Enter your first name"
            onBlur={(e) => handleValidation(e, "personalInfo")}
          />
          {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName}</p>
          )}

          {/* Show formatted date below input */}
          {/* {formData.personalInfo.dateOfBirth && (
            <p className="text-gray-600 text-sm">
              Selected: {format(new Date(formData.personalInfo.dateOfBirth), "dd/MM/yyyy")}
            </p>
          )} */}
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <Input
            name="lastName"
            label="Last Name"
            value={formData.personalInfo.lastName}
            onChange={(e) => handleChange(e, 'personalInfo')}
            error={errors.lastName}
            placeholder="Enter your last name"
            onBlur={(e) => handleValidation(e, "personalInfo")}
          />
          {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
        
      </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Date of birth<span className="text-red-500">*</span>
          </label>
          <Input
            name="dateOfBirth"
            type="date"
            label="Date of Birth"
            value={formData.personalInfo.dateOfBirth}
            onChange={(e) => handleChange(e, 'personalInfo')}
            error={errors.dateOfBirth}
            onBlur={(e) => handleValidation(e, "personalInfo")}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-red-600">{errors.dateOfBirth}</p>
          )}
        </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.personalInfo.gender}
            onChange={(e) => handleChange(e, 'personalInfo')}
            onBlur={(e) => handleValidation(e, "personalInfo")}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          { errors.gender && <p className="text-sm text-red-600">{errors.gender}</p> }
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.personalInfo.bloodGroup}
            onChange={(e) => handleChange(e, 'personalInfo')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Marital Status</label>
          <select
            name="maritalStatus"
            value={formData.personalInfo.maritalStatus}
            onChange={(e) => handleChange(e, 'personalInfo')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Occupation</label>
          <Input
            name="occupation"
            label="Occupation"
            value={formData.personalInfo.occupation}
            onChange={(e) => handleChange(e, 'personalInfo')}
            placeholder="Enter your occupation"
            className="px-2 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Contact Information</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="phone"
          label="Phone Number"
          value={formData.contactInfo.phone}
          onChange={(e) => handleChange(e, 'contactInfo')}
          error={errors.phone}
          placeholder="Enter your phone number *"
        />
        {errors.phone && (
          <p className="text-sm text-red-600">{errors.phone}</p>
        )}

        <Input
          name="alternatePhone"
          label="Alternate Phone (Optional)"
          value={formData.contactInfo.alternatePhone}
          onChange={(e) => handleChange(e, 'contactInfo')}
          placeholder="Enter alternate phone number"
          error={errors.alternatePhone}
        />
        {errors.alternatePhone && (
          <p className="text-sm text-red-600">{errors.alternatePhone}</p>
        )}
      </div>
      <Input
        name="street"
        label="Street Address"
        value={formData.contactInfo.address.street}
        onChange={(e) => handleChange(e, 'contactInfo', 'address')}
        error={errors.street}
        placeholder="Enter your street address *"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="city"
          label="City"
          value={formData.contactInfo.address.city}
          onChange={(e) => handleChange(e, 'contactInfo', 'address')}
          error={errors.city}
          placeholder="Enter your city *"
        />
        <Input
          name="state"
          label="State"
          value={formData.contactInfo.address.state}
          onChange={(e) => handleChange(e, 'contactInfo', 'address')}
          error={errors.state}
          placeholder="Enter your state *"
        />
      </div>

      <Input
        name="zipCode"
        label="Zip Code"
        value={formData.contactInfo.address.zipCode}
        onChange={(e) => handleChange(e, 'contactInfo', 'address')}
        error={errors.zipCode}
        placeholder="Enter your zip code *"
      />
    </div>
  );


  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Emergency Contact & Medical Information</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="name"
          label="Emergency Contact Name"
          value={formData.emergencyContact.name}
          onChange={(e) => handleChange(e, 'emergencyContact')}
          placeholder="Enter contact name"
        />

        <Input
          name="relationship"
          label="Relationship"
          value={formData.emergencyContact.relationship}
          onChange={(e) => handleChange(e, 'emergencyContact')}
          placeholder="Enter relationship"
        />
      </div>
      <Input
        name="phone"
        label="Emergency Contact Phone"
        value={formData.emergencyContact.phone}
        onChange={(e) => handleChange(e, 'emergencyContact')}
        placeholder="Enter emergency contact phone"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Allergies (comma separated)
        </label>
        <textarea
          placeholder="Enter allergies separated by commas"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => handleArrayChange(e, 'medicalInfo', 'allergies')}
        />
      </div>
       <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Chronic Conditions (comma separated)
        </label>
        <textarea
          placeholder="Enter chronic conditions separated by commas"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => handleArrayChange(e, 'medicalInfo', 'chronicConditions')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="provider"
          label="Insurance Provider (Optional)"
          value={formData.medicalInfo.insuranceInfo.provider}
          onChange={(e) => handleChange(e, 'medicalInfo', 'insuranceInfo')}
          placeholder="Enter insurance provider"
        />
        <Input
          name="policyNumber"
          label="Policy Number (Optional)"
          value={formData.medicalInfo.insuranceInfo.policyNumber}
          onChange={(e) => handleChange(e, 'medicalInfo', 'insuranceInfo')}
          placeholder="Enter policy number"
        />
      </div>
    </div>
  )

  const handleValidation = (e, section) => {
    const { name, value } = e.target;
    let errorMsg = "";
    if (["firstName", "lastName", "dateOfBirth", "gender"].includes(name)) {
    if (!value.trim()) {
      errorMsg = `${name.replace(/([A-Z])/g, " $1")} is required`;
    }
  }

  setErrors((prev) => ({
    ...prev,
    [name]: errorMsg,
  }));
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Always prevent default Enter behavior
      
      if (currentStep < 4) {
        console.log("Enter pressed on step", currentStep, "- calling handleNext");
        handleNext();
      } else {
        console.log("Enter pressed on final step - submitting form");
        handleSubmit(e);
      }
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <h2 className='text-2xl font-bold text-center text-gray-900'>
          Patient Registration
        </h2>
        <p className='text-sm text-center text-gray-600'>
          Please fill in your information to create your patients account
        </p>
      </CardHeader>
      <CardContent>
        {renderStepIndicator()}

        <form
          onSubmit={handleSubmit}
          className='space-y-6'
          // onKeyDown={(e) => {
          //   if (e.key === 'Enter' && currentStep < 4) {
          //     e.preventDefault(); // block accidental submits
          //     handleNext(); // treat Enter as "Next"
          //   }
          // }}
          onKeyDown={handleKeyDown}
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          <div className='flex justify-between'>
            {currentStep > 1 && (
              <Button
                type='button'
                variant={'outline'}
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous
              </Button>
            )}

            {currentStep < 4 && (
              <Button type='button' onClick={handleNext} className={'ml-auto'}>
                Next
              </Button>
            )}
            {
              currentStep === 4 && (
              <Button
                type='submit'
                // loading={loading}
                disabled={loading}
                className={'ml-auto'}
              >
                Register Patient
              </Button>
            )
            }
          </div>
        </form>
      </CardContent>
    </Card>
  );
}