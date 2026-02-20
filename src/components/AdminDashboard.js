import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import SearchableSelect from './SearchableSelect';
import DoctorManagement from './DoctorManagement';
import PatientSlipPrint from './PatientSlipPrint';
import { useAuth } from '../context/AuthContext';
import {
  getAdminAppointments,
  getAppointmentStats,
  updateAppointment,
  deleteAppointment as deleteAppointmentApi,
  downloadAppointmentsExcel,
  downloadDayBackup,
  downloadMonthBackup,
  downloadFullBackup,
  restoreFromBackup,
  getServiceDoctorType,
  getBookedTimeSlotsForDoctorType,
} from '../services/localStorageApi';
import { appointmentUpdateSchema } from '../schemas/validation';
import { 
  FaSignOutAlt, 
  FaCalendarAlt, 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaStethoscope,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTrash,
  FaEdit,
  FaChartBar,
  FaHospital,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaFileExcel,
  FaPrint,
  FaFileDownload,
  FaUpload
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [backupDay, setBackupDay] = useState(new Date().toISOString().slice(0, 10));
  const [backupMonth, setBackupMonth] = useState(new Date().getMonth() + 1);
  const [backupYear, setBackupYear] = useState(new Date().getFullYear());
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [slipAppointment, setSlipAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' or 'doctors'
  const [restoring, setRestoring] = useState(false);
  const restoreInputRef = useRef(null);

  const {
    register: registerUpdate,
    control: controlUpdate,
    handleSubmit: handleUpdateSubmit,
    formState: { errors: updateErrors, isSubmitting: isUpdating },
    reset: resetUpdate,
    watch: watchUpdate,
    setValue: setUpdateValue
  } = useForm({
    resolver: zodResolver(appointmentUpdateSchema),
    defaultValues: {
      date: '',
      time: '',
      period: 'AM',
      notes: ''
    }
  });

  const watchedUpdateDate = watchUpdate('date');
  const watchedUpdateTime = watchUpdate('time');

  useEffect(() => {
    fetchAppointments();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const fetchAppointments = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const data = await getAdminAppointments(params);
      setAppointments(data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getAppointmentStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await updateAppointment(id, { status });
      toast.success(`Appointment status updated to ${status}`, {
        position: 'top-right',
        autoClose: 3000,
      });
      fetchAppointments();
      fetchStats();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment status', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
    try {
      await deleteAppointmentApi(id);
      toast.success('Appointment deleted successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      fetchAppointments();
      fetchStats();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const onUpdateNotes = async (data) => {
    if (!selectedAppointment) return;
    try {
      await updateAppointment(selectedAppointment.id, { notes: data.notes });
      toast.success('Notes updated successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error('Failed to update notes', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const onUpdateDateTime = async (data) => {
    if (!selectedAppointment) return;
    try {
      const dateTime = `${data.date} ${data.time} ${data.period}`;
      await updateAppointment(selectedAppointment.id, {
        date: data.date,
        time: data.time,
        period: data.period,
        dateTime,
      });
      toast.success('Date and time updated successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      fetchAppointments();
      fetchStats();
    } catch (error) {
      console.error('Error updating date/time:', error);
      toast.error('Failed to update date and time', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Get available time slots based on selected date and doctor type (for admin edit)
  // excludeAppointmentId: when editing, don't exclude this appointment's own time
  const getAvailableTimeSlots = (selectedDate, doctorType, excludeAppointmentId) => {
    const timeSlots = [
      { value: '09:00', label: '9:00 AM', hour: 9, minute: 0 },
      { value: '09:15', label: '9:15 AM', hour: 9, minute: 15 },
      { value: '09:30', label: '9:30 AM', hour: 9, minute: 30 },
      { value: '09:45', label: '9:45 AM', hour: 9, minute: 45 },
      { value: '10:00', label: '10:00 AM', hour: 10, minute: 0 },
      { value: '10:15', label: '10:15 AM', hour: 10, minute: 15 },
      { value: '10:30', label: '10:30 AM', hour: 10, minute: 30 },
      { value: '10:45', label: '10:45 AM', hour: 10, minute: 45 },
      { value: '11:00', label: '11:00 AM', hour: 11, minute: 0 },
      { value: '11:15', label: '11:15 AM', hour: 11, minute: 15 },
      { value: '11:30', label: '11:30 AM', hour: 11, minute: 30 },
      { value: '12:00', label: '12:00 PM (Noon)', hour: 12, minute: 0 },
      { value: '12:15', label: '12:15 PM', hour: 12, minute: 15 },
      { value: '12:30', label: '12:30 PM', hour: 12, minute: 30 },
      { value: '12:45', label: '12:45 PM', hour: 12, minute: 45 },
      { value: '13:00', label: '1:00 PM', hour: 13, minute: 0 },
      { value: '13:15', label: '1:15 PM', hour: 13, minute: 15 },
      { value: '13:30', label: '1:30 PM', hour: 13, minute: 30 },
      { value: '13:45', label: '1:45 PM', hour: 13, minute: 45 },
      { value: '14:00', label: '2:00 PM', hour: 14, minute: 0 },
      { value: '14:15', label: '2:15 PM', hour: 14, minute: 15 },
      { value: '14:30', label: '2:30 PM', hour: 14, minute: 30 },
      { value: '15:00', label: '3:00 PM', hour: 15, minute: 0 },
      { value: '15:15', label: '3:15 PM', hour: 15, minute: 15 },
      { value: '15:30', label: '3:30 PM', hour: 15, minute: 30 },
      { value: '15:45', label: '3:45 PM', hour: 15, minute: 45 },
      { value: '16:00', label: '4:00 PM', hour: 16, minute: 0 },
      { value: '16:15', label: '4:15 PM', hour: 16, minute: 15 },
      { value: '16:30', label: '4:30 PM', hour: 16, minute: 30 },
      { value: '16:45', label: '4:45 PM', hour: 16, minute: 45 },
      { value: '17:00', label: '5:00 PM', hour: 17, minute: 0 },
      { value: '17:15', label: '5:15 PM', hour: 17, minute: 15 },
      { value: '17:30', label: '5:30 PM', hour: 17, minute: 30 },
      { value: '17:45', label: '5:45 PM', hour: 17, minute: 45 },
      { value: '18:00', label: '6:00 PM', hour: 18, minute: 0 },
    ];

    if (!selectedDate) {
      return timeSlots; // Show all if no date selected
    }

    // Exclude slots already booked for this doctor type (separate pools per doctor type)
    const bookedForDoctorType = doctorType
      ? getBookedTimeSlotsForDoctorType(selectedDate, doctorType, excludeAppointmentId)
      : [];
    const excludeBooked = (slots) =>
      bookedForDoctorType.length > 0 ? slots.filter((s) => !bookedForDoctorType.includes(s.value)) : slots;

    const dateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);

    // If selected date is in the future, show times (minus booked for this doctor type)
    if (dateObj > today) {
      return excludeBooked(timeSlots);
    }

    // If selected date is today, filter out past times
    if (dateObj.getTime() === today.getTime()) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      return excludeBooked(timeSlots.filter(slot => {
        // If it's past 12:00 PM (noon), don't show morning slots (9:00 AM - 11:30 AM)
        if (currentHour >= 12) {
          // Only show afternoon and evening slots (12:00 PM onwards)
          return slot.hour >= 12;
        }
        // If it's before 12:00 PM, show all times from now onwards (including future morning times)
        if (slot.hour > currentHour) {
          return true;
        }
        if (slot.hour === currentHour && slot.minute >= currentMinute) {
          return true;
        }
        return false;
      }));
    }

    return excludeBooked(timeSlots);
  };

  const handleRestoreFromBackup = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setRestoring(true);
    try {
      const result = await restoreFromBackup(file);
      if (result.success) {
        toast.success(result.message, { position: 'top-right', autoClose: 5000 });
        if (restoreInputRef.current) restoreInputRef.current.value = '';
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(result.message, { position: 'top-right', autoClose: 5000 });
      }
    } finally {
      setRestoring(false);
    }
  };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    const period = appointment.period || (appointment.time && parseInt(appointment.time.split(':')[0]) >= 12 ? 'PM' : 'AM') || 'AM';
    resetUpdate({
      date: appointment.date || '',
      time: appointment.time || '',
      period: period,
      notes: appointment.notes || ''
    });
    setShowModal(true);
  };

  // Update period when time changes
  useEffect(() => {
    if (watchedUpdateTime) {
      const hour = parseInt(watchedUpdateTime.split(':')[0]);
      setUpdateValue('period', hour >= 12 ? 'PM' : 'AM');
    }
  }, [watchedUpdateTime, setUpdateValue]);

  // Reset time when date changes if it's no longer valid
  useEffect(() => {
    if (watchedUpdateDate && watchedUpdateTime && selectedAppointment) {
      const doctorType = getServiceDoctorType(selectedAppointment.service);
      const availableSlots = getAvailableTimeSlots(
        watchedUpdateDate,
        doctorType,
        selectedAppointment.id
      );
      const isTimeValid = availableSlots.some(slot => slot.value === watchedUpdateTime);
      if (!isTimeValid) {
        setUpdateValue('time', '');
      }
    }
  }, [watchedUpdateDate, watchedUpdateTime, selectedAppointment, setUpdateValue]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-yellow-300';
      case 'confirmed':
        return 'bg-gradient-to-r from-green-400 to-green-500 text-white border-green-300';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-400 to-red-500 text-white border-red-300';
      case 'completed':
        return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-300';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-white" />;
      case 'confirmed':
        return <FaCheckCircle className="text-white" />;
      case 'cancelled':
        return <FaTimesCircle className="text-white" />;
      case 'completed':
        return <FaCheckCircle className="text-white" />;
      default:
        return null;
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    searchTerm === '' || 
    apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.phone.includes(searchTerm) ||
    apt.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);
  const startItem = filteredAppointments.length > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(endIndex, filteredAppointments.length);

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Show first 3, ellipsis, last
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first, ellipsis, last 3
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        // Show first, ellipsis, current-1, current, current+1, ellipsis, last
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Enhanced Header - Responsive */}
      <header className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="p-2 sm:p-2.5 md:p-3 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl">
                <FaHospital className="text-xl sm:text-2xl md:text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-white/90 mt-0.5 sm:mt-1 hidden sm:block">Satva Clinic Management System</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg sm:rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <FaSignOutAlt className="text-sm sm:text-base" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Enhanced Statistics Cards - Responsive */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 transform hover:scale-105 transition-all duration-300 border border-gray-700">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-2.5 md:p-3 bg-white/10 rounded-lg sm:rounded-xl">
                  <FaChartBar className="text-xl sm:text-2xl md:text-3xl text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-gray-300 uppercase tracking-wide">Total</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-1 sm:mt-2">{stats.total}</p>
                </div>
              </div>
              <div className="h-0.5 sm:h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
            </div>

            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-2.5 md:p-3 bg-white/20 rounded-lg sm:rounded-xl">
                  <FaClock className="text-xl sm:text-2xl md:text-3xl text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-white/90 uppercase tracking-wide">Pending</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-1 sm:mt-2">{stats.pending}</p>
                </div>
              </div>
              <div className="h-0.5 sm:h-1 bg-white/30 rounded-full"></div>
            </div>

            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-2.5 md:p-3 bg-white/20 rounded-lg sm:rounded-xl">
                  <FaCheckCircle className="text-xl sm:text-2xl md:text-3xl text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-white/90 uppercase tracking-wide">Confirmed</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-1 sm:mt-2">{stats.confirmed}</p>
                </div>
              </div>
              <div className="h-0.5 sm:h-1 bg-white/30 rounded-full"></div>
            </div>

            <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-2.5 md:p-3 bg-white/20 rounded-lg sm:rounded-xl">
                  <FaTimesCircle className="text-xl sm:text-2xl md:text-3xl text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-white/90 uppercase tracking-wide">Cancelled</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-1 sm:mt-2">{stats.cancelled}</p>
                </div>
              </div>
              <div className="h-0.5 sm:h-1 bg-white/30 rounded-full"></div>
            </div>

            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-2.5 md:p-3 bg-white/20 rounded-lg sm:rounded-xl">
                  <FaCheckCircle className="text-xl sm:text-2xl md:text-3xl text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-white/90 uppercase tracking-wide">Completed</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-1 sm:mt-2">{stats.completed}</p>
                </div>
              </div>
              <div className="h-0.5 sm:h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl mb-4 sm:mb-6 p-2 border border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'appointments'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaCalendarAlt className="inline mr-2" />
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'doctors'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaUser className="inline mr-2" />
              Doctors
            </button>
          </div>
        </div>

        {/* Doctor Management Tab */}
        {activeTab === 'doctors' && (
          <div className="mb-6">
            <DoctorManagement />
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <>
        {/* Enhanced Filter and Search Section - Responsive */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl mb-4 sm:mb-6 p-4 sm:p-5 md:p-6 border border-gray-100">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-sm sm:text-base" />
              </div>
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm sm:text-base"
              />
            </div>

            {/* Filter Tabs and Export - Responsive */}
            <div className="flex flex-wrap gap-2 items-center">
              <FaFilter className="text-gray-400 mr-1 sm:mr-2 text-sm sm:text-base" />
              {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 ${
                    filter === status
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
              <button
                onClick={() => {
                  downloadAppointmentsExcel(filter !== 'all' ? { status: filter } : {});
                  toast.success('Appointments exported to Excel (date-wise sheets)', {
                    position: 'top-right',
                    autoClose: 3000,
                  });
                }}
                className="ml-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white transition-all flex items-center gap-1.5"
              >
                <FaFileExcel className="text-sm" />
                Export Excel
              </button>
            </div>

            {/* Day & Month Backup */}
            <div className="flex flex-wrap gap-3 sm:gap-4 items-center pt-2 border-t border-gray-100 mt-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-600">Backup:</span>
              <div className="flex flex-wrap gap-2 items-center">
                <input
                  type="date"
                  value={backupDay}
                  onChange={(e) => setBackupDay(e.target.value)}
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs sm:text-sm"
                />
                <button
                  onClick={() => {
                    downloadDayBackup(backupDay);
                    toast.success(`Day backup (${backupDay}) downloaded`, {
                      position: 'top-right',
                      autoClose: 3000,
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Day Backup
                </button>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <select
                  value={backupMonth}
                  onChange={(e) => setBackupMonth(Number(e.target.value))}
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs sm:text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                    <option key={m} value={m}>
                      {new Date(2000, m - 1).toLocaleString('default', { month: 'short' })} ({m})
                    </option>
                  ))}
                </select>
                <select
                  value={backupYear}
                  onChange={(e) => setBackupYear(Number(e.target.value))}
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs sm:text-sm"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    downloadMonthBackup(backupYear, backupMonth);
                    toast.success(`Month backup (${backupYear}-${String(backupMonth).padStart(2, '0')}) downloaded`, {
                      position: 'top-right',
                      autoClose: 3000,
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Month Backup
                </button>
              </div>
            </div>
            {/* Full backup & restore – use when switching browser */}
            <div className="flex flex-wrap gap-3 sm:gap-4 items-center pt-2 border-t border-amber-100 mt-2">
              <span className="text-xs sm:text-sm font-semibold text-amber-800">Switch browser?</span>
              <button
                type="button"
                onClick={() => {
                  downloadFullBackup();
                  toast.success('Full backup downloaded. Save this file and use Restore in the new browser.', {
                    position: 'top-right',
                    autoClose: 4000,
                  });
                }}
                className="px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5"
              >
                <FaFileDownload className="text-sm" />
                Download full backup
              </button>
              <input
                ref={restoreInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleRestoreFromBackup}
                className="hidden"
              />
              <button
                type="button"
                disabled={restoring}
                onClick={() => restoreInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white flex items-center gap-1.5"
              >
                <FaUpload className="text-sm" />
                {restoring ? 'Restoring…' : 'Restore from backup'}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Appointments Table - Responsive */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {loading ? (
            <div className="p-8 sm:p-12 md:p-16 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 text-base sm:text-lg font-medium">Loading appointments...</p>
            </div>
          ) : paginatedAppointments.length === 0 ? (
            <div className="p-8 sm:p-12 md:p-16 text-center">
              <div className="inline-block p-4 sm:p-5 md:p-6 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                <FaCalendarAlt className="text-4xl sm:text-5xl md:text-6xl text-primary-600" />
              </div>
              <p className="text-gray-600 text-lg sm:text-xl font-semibold mb-2">No appointments found</p>
              <p className="text-gray-400 text-sm sm:text-base">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedAppointments.map((appointment, index) => (
                    <tr 
                      key={appointment.id} 
                      className="hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-200 transform hover:scale-[1.01]"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-4 md:px-6 py-4 md:py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 md:h-12 md:w-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg">
                            <FaUser className="text-white text-sm md:text-lg" />
                          </div>
                          <div className="ml-3 md:ml-4">
                            <div className="text-xs sm:text-sm font-bold text-gray-900">{appointment.name}</div>
                            {appointment.email && (
                              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <FaEnvelope className="text-xs" />
                                <span className="truncate max-w-[150px]">{appointment.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-900 flex items-center gap-2 font-medium">
                          <div className="p-1.5 md:p-2 bg-gray-100 rounded-lg">
                            <FaPhone className="text-primary-600 text-xs md:text-sm" />
                          </div>
                          <span className="truncate max-w-[120px]">{appointment.phone}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5">
                        <div className="text-xs sm:text-sm text-gray-900 flex flex-col gap-0.5">
                          <div className="flex items-center gap-2 font-medium">
                            <div className="p-1.5 md:p-2 bg-primary-100 rounded-lg flex-shrink-0">
                              <FaStethoscope className="text-primary-600 text-xs md:text-sm" />
                            </div>
                            <span className="max-w-xs truncate">{appointment.service}</span>
                          </div>
                          {getServiceDoctorType(appointment.service) && (
                            <span className="text-xs text-gray-500 ml-8">
                              ({getServiceDoctorType(appointment.service)})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-900 font-medium">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
                              <FaCalendarAlt className="text-blue-600 text-xs md:text-sm" />
                            </div>
                            <span>
                              {new Date(appointment.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          {appointment.time && (
                            <div className="text-xs text-gray-600 ml-8 md:ml-12">
                              {appointment.time} {appointment.period || 'AM'}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 rounded-full text-xs font-bold shadow-md border-2 ${getStatusColor(appointment.status)}`}>
                          <span className="hidden sm:inline-block">{getStatusIcon(appointment.status)}</span>
                          <span className="truncate">{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2 md:gap-3">
                          <button
                            onClick={() => setSlipAppointment(appointment)}
                            className="p-1.5 md:p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all duration-200 transform hover:scale-110 shadow-sm"
                            title="Print Slip"
                          >
                            <FaPrint className="text-xs md:text-sm" />
                          </button>
                          <button
                            onClick={() => openModal(appointment)}
                            className="p-1.5 md:p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-all duration-200 transform hover:scale-110 shadow-sm"
                            title="Edit"
                          >
                            <FaEdit className="text-xs md:text-sm" />
                          </button>
                          <button
                            onClick={() => deleteAppointment(appointment.id)}
                            className="p-1.5 md:p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200 transform hover:scale-110 shadow-sm"
                            title="Delete"
                          >
                            <FaTrash className="text-xs md:text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {paginatedAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {/* Patient Info */}
                    <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg">
                          <FaUser className="text-white text-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-bold text-gray-900 truncate">{appointment.name}</div>
                          {appointment.email && (
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                              <FaEnvelope className="text-xs flex-shrink-0" />
                              <span className="truncate">{appointment.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold shadow-md border-2 flex-shrink-0 ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        <span className="hidden xs:inline">{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
                        <span className="xs:hidden">{appointment.status.charAt(0).toUpperCase()}</span>
                      </span>
                    </div>

                    {/* Contact & Service */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FaPhone className="text-primary-600 text-sm" />
                        </div>
                        <span className="text-gray-900 font-medium">{appointment.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-2 bg-primary-100 rounded-lg flex-shrink-0">
                          <FaStethoscope className="text-primary-600 text-sm" />
                        </div>
                        <div>
                          <span className="text-gray-900 font-medium truncate block">{appointment.service}</span>
                          {getServiceDoctorType(appointment.service) && (
                            <span className="text-xs text-gray-500">({getServiceDoctorType(appointment.service)})</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FaCalendarAlt className="text-blue-600 text-sm" />
                        </div>
                        <span className="text-gray-900 font-medium">
                          {new Date(appointment.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                          {appointment.time && ` • ${appointment.time} ${appointment.period || 'AM'}`}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setSlipAppointment(appointment)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all duration-200 font-semibold text-sm"
                      >
                        <FaPrint />
                        <span>Print Slip</span>
                      </button>
                      <button
                        onClick={() => openModal(appointment)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-all duration-200 font-semibold text-sm"
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteAppointment(appointment.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200 font-semibold text-sm"
                      >
                        <FaTrash />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination Controls */}
          {filteredAppointments.length > 0 && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mt-4 sm:mt-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Items per page selector and info */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Items per page:</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm font-medium bg-white"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{startItem}</span> to{' '}
                    <span className="font-semibold text-gray-900">{endItem}</span> of{' '}
                    <span className="font-semibold text-gray-900">{filteredAppointments.length}</span> appointments
                  </div>
                </div>

                {/* Pagination buttons */}
                <div className="flex items-center gap-2">
                  {/* First page button */}
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none text-sm font-semibold"
                    title="First page"
                  >
                    ««
                  </button>

                  {/* Previous page button */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                    title="Previous page"
                  >
                    <FaChevronLeft className="text-sm" />
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    {getPageNumbers().map((page, index) => {
                      if (page === 'ellipsis') {
                        return (
                          <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg scale-105'
                              : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next page button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                    title="Next page"
                  >
                    <FaChevronRight className="text-sm" />
                  </button>

                  {/* Last page button */}
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none text-sm font-semibold"
                    title="Last page"
                  >
                    »»
                  </button>
                </div>
              </div>

              {/* Page info for mobile */}
              <div className="mt-4 pt-4 border-t border-gray-200 text-center sm:hidden">
                <p className="text-sm text-gray-600">
                  Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
                  <span className="font-semibold text-gray-900">{totalPages}</span>
                </p>
              </div>
            </div>
          )}
        </div>
          </>
        )}

      </div>

      {/* Patient Slip Print Modal (doctor-wise) */}
      {slipAppointment && (
        <PatientSlipPrint
          appointment={slipAppointment}
          onClose={() => setSlipAppointment(null)}
        />
      )}

      {/* Enhanced Modal - Responsive */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto transform animate-slide-up border-2 border-gray-100">
            {/* Modal Header - Responsive */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 sm:p-5 md:p-6 rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Edit Appointment</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <FaTimesCircle className="text-white text-lg sm:text-xl" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6">
              {/* Patient Info Grid - Responsive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-gray-200">
                  <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Patient Name</label>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">{selectedAppointment.name}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-gray-200">
                  <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Phone</label>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaPhone className="text-primary-600 text-sm sm:text-base" />
                    {selectedAppointment.phone}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-gray-200">
                  <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Service</label>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaStethoscope className="text-primary-600 text-sm sm:text-base" />
                    <span className="truncate">{selectedAppointment.service}</span>
                    {getServiceDoctorType(selectedAppointment.service) && (
                      <span className="text-sm text-gray-500">({getServiceDoctorType(selectedAppointment.service)})</span>
                    )}
                  </p>
                </div>
                <form onSubmit={handleUpdateSubmit(onUpdateDateTime)} className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 border-blue-200 md:col-span-2">
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-3 sm:mb-4 uppercase tracking-wide flex items-center gap-2">
                    <FaCalendarAlt className="text-primary-600 text-sm sm:text-base" />
                    Date & Time (Editable)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">
                        Date <span className="text-gray-400 hidden sm:inline">(dd/mm/yyyy)</span>
                      </label>
                      <input
                        type="date"
                        {...registerUpdate('date')}
                        className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm sm:text-base ${
                          updateErrors.date ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                        }`}
                      />
                      {watchedUpdateDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(watchedUpdateDate).toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          })}
                        </p>
                      )}
                      {updateErrors.date && (
                        <p className="text-xs text-red-500 mt-1">{updateErrors.date.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Time</label>
                      <Controller
                        name="time"
                        control={controlUpdate}
                        render={({ field }) => {
                          const doctorType = selectedAppointment
                            ? getServiceDoctorType(selectedAppointment.service)
                            : '';
                          const availableSlots = getAvailableTimeSlots(
                            watchedUpdateDate,
                            doctorType,
                            selectedAppointment?.id
                          );
                          const morningSlots = availableSlots.filter(s => s.hour < 12);
                          const afternoonSlots = availableSlots.filter(s => s.hour >= 12 && s.hour < 15);
                          const eveningSlots = availableSlots.filter(s => s.hour >= 15);
                          
                          const timeOptions = [];
                          if (morningSlots.length > 0) {
                            timeOptions.push({
                              label: 'Morning (9:00 AM - 11:30 AM)',
                              options: morningSlots.map(slot => ({
                                value: slot.value,
                                label: slot.label
                              }))
                            });
                          }
                          if (afternoonSlots.length > 0) {
                            timeOptions.push({
                              label: 'Afternoon (12:00 PM - 2:30 PM)',
                              options: afternoonSlots.map(slot => ({
                                value: slot.value,
                                label: slot.label
                              }))
                            });
                          }
                          if (eveningSlots.length > 0) {
                            timeOptions.push({
                              label: 'Evening (3:00 PM - 6:00 PM)',
                              options: eveningSlots.map(slot => ({
                                value: slot.value,
                                label: slot.label
                              }))
                            });
                          }
                          
                          return (
                            <SearchableSelect
                              options={timeOptions}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                                if (value) {
                                  const hour = parseInt(value.split(':')[0]);
                                  setUpdateValue('period', hour >= 12 ? 'PM' : 'AM');
                                }
                              }}
                              placeholder={!watchedUpdateDate ? 'Select date first' : 'Search and select time...'}
                              error={!!updateErrors.time}
                              disabled={!watchedUpdateDate}
                              isGrouped={true}
                            />
                          );
                        }}
                      />
                      {watchedUpdateDate &&
                        selectedAppointment &&
                        getAvailableTimeSlots(
                          watchedUpdateDate,
                          getServiceDoctorType(selectedAppointment.service),
                          selectedAppointment.id
                        ).length === 0 && (
                        <p className="text-xs text-red-500 mt-1">No available slots for today</p>
                      )}
                      {updateErrors.time && (
                        <p className="text-xs text-red-500 mt-1">{updateErrors.time.message}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2 md:col-span-1">
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Period</label>
                      <Controller
                        name="period"
                        control={controlUpdate}
                        render={({ field }) => (
                          <SearchableSelect
                            options={[
                              { value: 'AM', label: 'AM' },
                              { value: 'PM', label: 'PM' }
                            ]}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select period..."
                            error={!!updateErrors.period}
                            disabled={false}
                            isGrouped={false}
                          />
                        )}
                      />
                      {updateErrors.period && (
                        <p className="text-xs text-red-500 mt-1">{updateErrors.period.message}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="mt-3 sm:mt-4 w-full px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isUpdating ? 'Updating...' : 'Update Date & Time'}
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">Current: {selectedAppointment.date && new Date(selectedAppointment.date).toLocaleDateString()} {selectedAppointment.time && `${selectedAppointment.time} ${selectedAppointment.period || 'AM'}`}</p>
                </form>
              </div>

              {selectedAppointment.message && (
                <div className="bg-blue-50 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-blue-200">
                  <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Message</label>
                  <p className="text-sm sm:text-base text-gray-900">{selectedAppointment.message}</p>
                </div>
              )}

              {/* Status Selection - Responsive */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border border-primary-200">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-3 sm:mb-4 uppercase tracking-wide">Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                  {['pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateAppointmentStatus(selectedAppointment.id, status)}
                      className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 ${
                        selectedAppointment.status === status
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg scale-105'
                          : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes Section - Responsive */}
              <form onSubmit={handleUpdateSubmit(onUpdateNotes)} className="bg-white p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border-2 border-gray-200">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">Notes</label>
                <textarea
                  {...registerUpdate('notes')}
                  rows="4"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none text-sm sm:text-base ${
                    updateErrors.notes ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                  }`}
                  placeholder="Add notes about this appointment..."
                />
                {updateErrors.notes && (
                  <p className="text-xs text-red-500 mt-1">{updateErrors.notes.message}</p>
                )}
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="mt-3 sm:mt-4 w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg sm:rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isUpdating ? 'Saving...' : 'Save Notes'}
                </button>
              </form>
            </div>

            {/* Modal Footer - Responsive */}
            <div className="p-4 sm:p-5 md:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl sm:rounded-b-2xl md:rounded-b-3xl flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 font-semibold text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
