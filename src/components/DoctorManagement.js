import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAdminDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor as deleteDoctorApi,
} from '../services/localStorageApi';
import {
  FaUserMd,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaSave,
  FaStethoscope,
  FaGraduationCap,
  FaBriefcase,
  FaUser
} from 'react-icons/fa';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    englishName: '',
    qualifications: '',
    specialization: '',
    title: '',
    type: '',
    experience: '',
    image: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await getAdminDoctors();
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to fetch doctors', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (doctor) => {
    setEditingId(doctor.id);
    setFormData({
      name: doctor.name || '',
      englishName: doctor.englishName || '',
      qualifications: doctor.qualifications || '',
      specialization: doctor.specialization || '',
      title: doctor.title || '',
      type: doctor.type || '',
      experience: doctor.experience || '',
      image: doctor.image || ''
    });
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      englishName: '',
      qualifications: '',
      specialization: '',
      title: '',
      type: '',
      experience: '',
      image: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.englishName) {
      toast.error('Name and English name are required', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try {
      if (editingId) {
        await updateDoctor(editingId, formData);
        toast.success('Doctor updated successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        await createDoctor(formData);
        toast.success('Doctor added successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      handleCancel();
      fetchDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
      toast.error(error.response?.data?.error || 'Failed to save doctor', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }
    try {
      await deleteDoctorApi(id);
      toast.success('Doctor deleted successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast.error('Failed to delete doctor', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <FaUserMd className="text-2xl sm:text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Doctor Management</h2>
              <p className="text-sm text-white/90 mt-1">Manage clinic doctors</p>
            </div>
          </div>
          <button
            onClick={() => {
              handleCancel();
              setShowAddForm(true);
            }}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <FaPlus className="text-sm" />
            <span>Add Doctor</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-primary-600" />
                  Name (Hindi/Devanagari)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  placeholder="डॉ. दीक्षा पाटीदार"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-primary-600" />
                  English Name
                </label>
                <input
                  type="text"
                  name="englishName"
                  value={formData.englishName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  placeholder="Dr. Diksha Patidar"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaGraduationCap className="inline mr-2 text-primary-600" />
                  Qualifications
                </label>
                <input
                  type="text"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  placeholder="एमबीबीएस, एमडी मेडिसिन (AIIMS नई दिल्ली)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaStethoscope className="inline mr-2 text-primary-600" />
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  placeholder="डीआरएनबी एंडोक्राइनोलॉजी (नई दिल्ली)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaBriefcase className="inline mr-2 text-primary-600" />
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  placeholder="हार्मान रोग विशेषज्ञ"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaStethoscope className="inline mr-2 text-primary-600" />
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="Endocrinologist">Endocrinologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaBriefcase className="inline mr-2 text-primary-600" />
                  Experience
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                  placeholder="पूर्व चिकित्सक ईएसआईसी मेडीकल कॉलेज, फरीदाबाद"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Photo (Image URL)
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  placeholder="https://example.com/doctor-photo.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Optional. Used on the landing page. Leave empty for placeholder icon.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold flex items-center gap-2"
              >
                <FaTimes />
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold flex items-center gap-2"
              >
                <FaSave />
                {editingId ? 'Update' : 'Add'} Doctor
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Doctors List */}
      <div className="p-4 sm:p-6">
        {doctors.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl mb-4">
              <FaUserMd className="text-4xl text-primary-600" />
            </div>
            <p className="text-gray-600 text-lg font-semibold mb-2">No doctors found</p>
            <p className="text-gray-400 text-sm">Add your first doctor to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className={`p-4 sm:p-6 border-2 rounded-xl transition-all duration-200 ${
                  editingId === doctor.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
                }`}
              >
                {editingId === doctor.id ? (
                  <div className="text-sm text-primary-600 font-semibold mb-2">
                    ✏️ Editing...
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg">
                          <FaUserMd className="text-white text-2xl" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                            {doctor.name}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-2">
                            {doctor.englishName}
                          </p>
                          <div className="space-y-1 text-sm text-gray-600">
                            {doctor.qualifications && (
                              <div className="flex items-start gap-2">
                                <FaGraduationCap className="text-primary-600 mt-1 flex-shrink-0" />
                                <span>{doctor.qualifications}</span>
                              </div>
                            )}
                            {doctor.specialization && (
                              <div className="flex items-start gap-2">
                                <FaStethoscope className="text-primary-600 mt-1 flex-shrink-0" />
                                <span>{doctor.specialization}</span>
                              </div>
                            )}
                            {doctor.title && (
                              <div className="flex items-start gap-2">
                                <FaBriefcase className="text-primary-600 mt-1 flex-shrink-0" />
                                <span>{doctor.title}</span>
                              </div>
                            )}
                            {doctor.type && (
                              <div>
                                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                                  {doctor.type}
                                </span>
                              </div>
                            )}
                            {doctor.experience && (
                              <div className="mt-2 text-xs text-gray-500 italic">
                                {doctor.experience}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 md:flex-col">
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="px-4 py-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-all duration-200 transform hover:scale-105 font-semibold text-sm flex items-center gap-2"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.id)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200 transform hover:scale-105 font-semibold text-sm flex items-center gap-2"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorManagement;

