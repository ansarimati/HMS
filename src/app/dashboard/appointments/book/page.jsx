"use client";
import React, { useState, useEffect } from "react";
import {
  Search, User, Star, Calendar, Clock, MapPin, ArrowLeft, Phone, Mail
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const {isAuthenticated} = useAuth();

  // Booking form state
  const [bookingData, setBookingData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    appointmentType: "consultation",
    reason: "",
    note: ""
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  const router = useRouter();

  // Fetch Doctors
  const fetchDoctors = async (specialization = "all", page= 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        specialization,
        page: page.toString(),
        limit: '12'
      });

      const response = await fetch(`/api/doctors?${params}`, {
        method: "GET",
        credentials: "include"
      });

      const data = await response.json();

      if (data.success) {
        setDoctors(data.data.doctors);
        setSpecializations(data.data.specializations);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw new Error('Error fetching doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(selectedSpecialization, currentPage);
  }, [selectedSpecialization, currentPage]);

  const handleSpecializationChange = (specialization) => {
    setSelectedSpecialization(specialization);
    setCurrentPage(1);
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingForm(true);
    // set min date to today
    const today = new Date().toISOString().split("T")[0];
    setBookingData(prev => ({ ...prev, appointmentDate: today }));
  };

  const handleBookingSubmit = async () => {
    setBookingLoading(true);
    try {
        const response = await fetch(`api/appointments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            doctor: selectedDoctor._id,
            ...bookingData
          })
        });

        const data = await response.json();

        if (data.success) {
          alert("Appointment booked successfully");
          setShowBookingForm(false);
          setSelectedDoctor(null);
          setBookingData({
            appointmentDate: "",
            appointmentTime: "",
            appointmentType: "consultation",
            reason: "",
            notes: ""
          });

          router.push("/dashboard/appointments");
        } else {
          alert(data.error || "Failed to book appointment");
        }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  const filterDoctors = doctors.filter(doctor => 
    doctor.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.professionalInfo.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDayFromDate = (date) => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[new Date(date).getDay()];
  };

  const isTimeSlotAvailable = (doctor, selectedDate, selectedTime) => {
    if (!selectedDate || !selectedTime) return true;

    const day = getDayFromDate(selectedDate);
    const availableHours = doctor.professionalInfo?.availableHours?.[day];

    if (!availableHours?.isAvailable) return false;

    if (availableHours.start && availableHours.end) {
      const [startHour, startMin] = availableHours.start.split(":").map(Number);
      const [endHour, endMin] = availableHours.end.split(":").map(Number);
      const [selectedHour, selectedMin] = selectedTime.split(":").map(Number);

      const startMinutes = startHour * 60  + startMin;
      const endMinutes = endHour * 60 + endMin;
      const selectedMinutes = selectedHour * 60 + selectedMin;

      return selectedMinutes >= startMinutes && selectedMinutes <= endMinutes; 
    }

    return true;
  };

  if (showBookingForm && selectedDoctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => setShowBookingForm(false)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft size={20} />
              Back to Doctors
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
            <p className="text-gray-600">Schedule your appointment with Dr. {selectedDoctor.personalInfo.firstName} {selectedDoctor.personalInfo.lastName}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Dr. {selectedDoctor.personalInfo.firstName} {selectedDoctor.personalInfo.lastName}
                </h3>
                <p className="text-gray-600">{selectedDoctor.professionalInfo.specialization}</p>
                <p className="text-green-600 font-medium">₹{selectedDoctor.professionalInfo.consultationFees || 0} consultation fee</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.appointmentDate}
                    onChange={(e) => setBookingData({ ...bookingData, appointmentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={bookingData.appointmentTime}
                    onChange={(e) => setBookingData({ ...bookingData, appointmentTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {bookingData.appointmentDate && bookingData.appointmentTime && 
                   !isTimeSlotAvailable(selectedDoctor, bookingData.appointmentDate, bookingData.appointmentTime) && (
                    <p className="text-red-500 text-sm mt-1">This time slot may not be available during doctor's working hours</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Type *
                </label>
                <select
                  required
                  value={bookingData.appointmentType}
                  onChange={(e) => setBookingData({ ...bookingData, appointmentType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="emergency">Emergency</option>
                  <option value="routine-checkup">Routine Checkup</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Appointment *
                </label>
                <textarea
                  required
                  rows={3}
                  minLength={10}
                  placeholder="Please describe your symptoms or reason for the appointment"
                  value={bookingData.reason}
                  onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  maxLength={1000}
                  placeholder="Any additional information you'd like the doctor to know"
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookingSubmit}
                  disabled={bookingLoading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {bookingLoading ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => window.location.href = '/appointments'}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft size={20} />
              Back to Appointments
            </button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book an Appointment</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search doctors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={selectedSpecialization}
              onChange={(e) => handleSpecializationChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dr. {doctor.personalInfo.firstName} {doctor.personalInfo.lastName}
                    </h3>
                    <p className="text-gray-600 text-sm">{doctor.professionalInfo.specialization}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  {doctor.professionalInfo.experience && (
                    <p>{doctor.professionalInfo.experience} years experience</p>
                  )}
                  
                  {doctor.professionalInfo.qualification && (
                    <p>Qualifications: {doctor.professionalInfo.qualification.join(', ')}</p>
                  )}
                  
                  {doctor.personalInfo.email && (
                    <div className="flex items-center gap-1">
                      <Mail size={14} />
                      <span className="truncate">{doctor.personalInfo.email}</span>
                    </div>
                  )}
                  
                  {doctor.personalInfo.phone && (
                    <div className="flex items-center gap-1">
                      <Phone size={14} />
                      <span>{doctor.personalInfo.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-lg font-semibold text-green-600">
                    ₹{doctor.professionalInfo.consultationFees || 0}
                  </div>
                  <button
                    onClick={() => handleBookAppointment(doctor)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total > 1 && (
          <div className="flex items-center justify-between mt-8 px-4 py-3 bg-white rounded-lg shadow-sm">
            <div className="text-sm text-gray-700">
              Page {pagination.current} of {pagination.total}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

}

export default BookAppointment;