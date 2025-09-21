"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar, Clock, User, Plus, Filter, Search
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const [error, setError] = useState("");

  const fetchAppointments = async (status = "all", page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status,
        page: page.toString(),
        limit: 10
      });

      const response = await fetch(`/api/patients/appointments?${params}`, {
        method: "GET",
        credentials: "include"
      });

      const data = await response.json();
      if (data.success) {
        setAppointments(data.data.appointments);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(filter, currentPage);
  }, [filter, currentPage, isAuthenticated]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  }

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      "in-progress": 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      "no-show": 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >=12 ? "AM" : "PM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes}:${ampm}`;
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <button 
              onClick={() => window.location.href = '/appointments/book'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Book Appointment
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'scheduled', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
  filter === status
    ? "bg-blue-600 text-white"
    : "bg-white text-gray-600 hover:bg-gray-50"
}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500 mb-6">You don't have any appointments matching the selected filter.</p>
            <button 
              onClick={() => window.location.href = '/appointments/book'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Book Your First Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Dr. {appointment.doctor?.personalInfo?.firstName} {appointment.doctor?.personalInfo?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{appointment.doctor?.professionalInfo?.specialization}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{formatDate(appointment.appointmentDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{formatTime(appointment.appointmentTime)}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">Appointment Type:</p>
                      <p className="text-gray-900 capitalize">{appointment.appointmentType.replace('-', ' ')}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Reason:</p>
                      <p className="text-gray-900">{appointment.reason}</p>
                    </div>

                    {appointment.notes && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Notes:</p>
                        <p className="text-gray-900">{appointment.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Consultation Fee: </span>
                        <span className="text-green-600 font-semibold">₹{appointment.consultationFee}</span>
                      </div>
                      
                      {/* Action buttons */}
                      {['scheduled', 'confirmed'].includes(appointment.status) && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => window.location.href = `/appointments/${appointment._id}/edit`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Reschedule
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this appointment?')) {
                                // Handle cancel appointment
                                handleCancelAppointment(appointment._id);
                              }
                            }}
                            className="text-red-600 hover:text-red-700 text-sm font-medium ml-4"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
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

export default AppointmentsPage;