'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';

export function DoctorRegistrationForm({ onSubmit, loading }) {
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
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
      },
    },
    professionalInfo: {
      specialization: '',
      qualification: [],
      experience: 0,
      licenseNumber: '',
      department: '',
      consultationFee: 0,
      availableHours: {
        monday: { start: '09:00', end: '17:00', isAvailable: true },
        tuesday: { start: '09:00', end: '17:00', isAvailable: true },
        wednesday: { start: '09:00', end: '17:00', isAvailable: true },
        thursday: { start: '09:00', end: '17:00', isAvailable: true },
        friday: { start: '09:00', end: '17:00', isAvailable: true },
        saturday: { start: '09:00', end: '13:00', isAvailable: false },
        sunday: { start: '09:00', end: '13:00', isAvailable: false },
      },
    },
  });

  const [errors, setErrors] = useState({});

  // Fetch department from dropdown;
  // useEffect(() => {
  //   setDepartments([
  //     { _id: 1, name: 'Cardiology' },
  //     { _id: '2', name: 'Neurology' },
  //     { _id: '3', name: 'Orthopedics' },
  //     { _id: '4', name: 'Pediatrics' },
  //     { _id: '5', name: 'General Medicine' },
  //     { _id: '6', name: 'Surgery' },
  //     { _id: '7', name: 'Gynecology' },
  //     { _id: '8', name: 'Emergency Medicine' },
  //   ]);
  // }, []);

  const handleChange = (e, section = null, subsection = null) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (section && subsection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subsection]: {
              ...[section][subsection],
              [name]: value,
            },
          },
        };
      } else if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [name]: value,
          },
        };
      } else {
        return {
          ...prev,
          [name]: value,
        };
      }
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // password and confirm password match check
    if ((name === "password" || name === "confirmPassword")) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 
          name === "confirmPassword" && value !== formData.password
            ? "Password do not match"
            : name === "password" && formData.confirmPassword && formData.confirmPassword !== value
            ? "Password do not match"
            : ""
      }))
    }
  };

  const handleArrayChange = (e) => {
    const { value } = e.target;
    const qualifications = value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item);

    setFormData((prev) => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        qualification: qualifications,
      },
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        availableHours: {
          ...prev.professionalInfo.availableHours,
          [day]: {
            ...prev.professionalInfo.availableHours[day],
            [field]: value,
          },
        },
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Personal info validation
    if (!formData.personalInfo.firstName)
      newErrors.firstName = 'First name is required';
    if (!formData.personalInfo.lastName)
      newErrors.lastName = 'Last name is required';
    if (!formData.personalInfo.phone)
      newErrors.phone = 'Phone number is required';
    if (!formData.personalInfo.dateOfBirth) 
      newErrors.dateOfBirth = "Date of birth is required"

    // Professional info validation
    if (!formData.professionalInfo.specialization)
      newErrors.specialization = 'Specialization is required';
    if (!formData.professionalInfo.licenseNumber)
      newErrors.licenseNumber = 'License number is required';
    if (!formData.professionalInfo.department)
      newErrors.department = 'Department is required';
    if (!formData.professionalInfo.consultationFee)
      newErrors.consultationFee = 'Consultation fee is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments?active=true');
        if (response.ok) {
          const data = await response.json();
          setDepartments(data.departments);
        } else {
          console.log('Failed to fetch departments');
          // Fall back to static data
          setDepartments([
            { _id: 1, name: 'Cardiology' },
            { _id: '2', name: 'Neurology' },
            { _id: '3', name: 'Orthopedics' },
            { _id: '4', name: 'Pediatrics' },
            { _id: '5', name: 'General Medicine' },
            { _id: '6', name: 'Surgery' },
            { _id: '7', name: 'Gynecology' },
            { _id: '8', name: 'Emergency Medicine' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  const handleBlur = (e, section = null) => {
  const { name, value } = e.target;
  let error = '';

  if (name === 'email') {
    if (!value) {
      error = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Invalid email address';
    }
  }

  if (error) {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }
};

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <h2 className='text-2xl font-bold text-center text-gray-900'>
          Doctor Registration
        </h2>
        <p className='text-sm text-center text-gray-600'>
          Register as a medical professional
        </p>
        <p className="text-xs text-center text-red-600 mt-1">
          Note: All fields are mandatory
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* Account Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium border-b pb-2'>
              Account Information
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>Email Address</label>
                <Input
                  name='email'
                  type='email'
                  label='Email Address'
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder='Enter your email'
                  onBlur={handleBlur}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Password</label>
                <Input
                  name='password'
                  type='password'
                  label='Password'
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder='Enter your password'
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Confirm Password</label>
                <Input
                  name='confirmPassword'
                  type='password'
                  label='Confirm Password'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder='Confirm your password'
                />
                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium border-b pb-2'>
              Personal Information
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>First Name</label> 
                <Input
                  name='firstName'
                  label='First Name'
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handleChange(e, 'personalInfo')}
                  error={errors.firstName}
                  placeholder='Enter your first name'
                />
                {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Last Name</label>
                <Input
                  name='lastName'
                  label='Last Name'
                  value={formData.personalInfo.lastName}
                  onChange={(e) => handleChange(e, 'personalInfo')}
                  error={errors.lastName}
                  placeholder='Enter your last name'
                />
                {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Date of Birth</label>
                <Input
                  name='dateOfBirth'
                  type='date'
                  label='Date of Birth'
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) => handleChange(e, 'personalInfo')}
                  error={errors.dateOfBirth}
                />
                {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <label className='block text-sm font-medium'>
                  Gender
                </label>
                <select
                  name='gender'
                  value={formData.personalInfo.gender}
                  onChange={(e) => handleChange(e, 'personalInfo')}
                  className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                >
                  <option value=''>Select Gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='other'>Other</option>
                </select>
                {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Phone Number</label>
                <Input
                  name='phone'
                  label='Phone Number'
                  value={formData.personalInfo.phone}
                  onChange={(e) => handleChange(e, 'personalInfo')}
                  error={errors.phone}
                  placeholder='Enter your phone number'
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium border-b pb-2'>
              Professional Information
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>Specialization</label>
                <Input
                  name='specialization'
                  label='Specialization'
                  value={formData.professionalInfo.specialization}
                  onChange={(e) => handleChange(e, 'professionalInfo')}
                  error={errors.specialization}
                  placeholder='e.g., Cardiology, Neurology'
                />
                {errors.specialization && <p className="text-sm text-red-600">{errors.specialization}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Medical License Number</label>
                <Input
                  name='licenseNumber'
                  label='Medical License Number'
                  value={formData.professionalInfo.licenseNumber}
                  onChange={(e) => handleChange(e, 'professionalInfo')}
                  error={errors.licenseNumber}
                  placeholder='Enter your license number'
                />
                {errors.licenseNumber && <p className="text-sm text-red-600">{errors.licenseNumber}</p>}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-1'>
                <label className='block text-sm font-medium text-gray-700'>
                  Department
                </label>
                <select
                  name='department'
                  value={formData.professionalInfo.department}
                  onChange={(e) => handleChange(e, 'professionalInfo')}
                  className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                >
                  <option value=''>Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className='text-sm text-red-600'>{errors.department}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Experience (Years)</label>
                <Input
                  name='experience'
                  type='number'
                  label='Experience (Years)'
                  value={formData.professionalInfo.experience}
                  onChange={(e) => handleChange(e, 'professionalInfo')}
                  placeholder='Years of experience'
                  min='0'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Consultation Fee (₹)</label>
                <Input
                  name='consultationFee'
                  type='number'
                  label='Consultation Fee (₹)'
                  value={formData.professionalInfo.consultationFee}
                  onChange={(e) => handleChange(e, 'professionalInfo')}
                  error={errors.consultationFee}
                  placeholder='Enter consultation fee'
                  min='0'
                />
                {errors.consultationFee && <p className="text-sm text-red-600">{errors.consultationFee}</p>}
              </div>
            </div>

            <div className='space-y-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Qualifications (comma separated)
              </label>
              <textarea
                placeholder='e.g., MBBS, MD, FRCS'
                className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                onChange={handleArrayChange}
              />
            </div>
          </div>

          <Button
            type='submit'
            // loading={loading}
            disabled={loading}
            className='w-full'
          >
            Register Doctor
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
