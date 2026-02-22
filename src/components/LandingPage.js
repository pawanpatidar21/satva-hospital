import React, { useState, useEffect } from 'react';
import SeoHead from './SeoHead';
import { getClinic, getDoctors, getServices } from '../services/localStorageApi';
import { FaPhone, FaStethoscope, FaUserMd, FaCalendarAlt, FaCheckCircle, FaArrowDown, FaHeartbeat, FaShieldAlt, FaAward, FaHospital, FaCalculator } from 'react-icons/fa';
import BMICalculator from './BMICalculator';
import DiabeticCalculator from './DiabeticCalculator';
import BSACalculator from './BSACalculator';
import IdealWeightCalculator from './IdealWeightCalculator';
import WaterIntakeCalculator from './WaterIntakeCalculator';
import ThyroidTSHCalculator from './ThyroidTSHCalculator';
import CalorieBMRCalculator from './CalorieBMRCalculator';
import WaistHipCalculator from './WaistHipCalculator';
import FitzpatrickQuiz from './FitzpatrickQuiz';
import HealthMeasureGuide from './HealthMeasureGuide';

const LandingPage = () => {
  const [clinicData, setClinicData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState(null);

  useEffect(() => {
    fetchClinicData();
    fetchDoctors();
    fetchServices();
  }, []);

  const fetchClinicData = async () => {
    try {
      const data = await getClinic();
      setClinicData(data);
    } catch (error) {
      console.error('Error fetching clinic data:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Get available time slots based on selected date
  return (
    <div className="min-h-screen bg-gray-50" role="document">
      <SeoHead clinic={clinicData} />
      <main id="main-content">
      {/* Enhanced Hero Section - Responsive */}
      <section aria-label="Welcome to Sattva Clinic" className="relative min-h-[100vh] sm:min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 overflow-hidden py-8 sm:py-0">
        {/* Enhanced Animated Background with Medical Theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-transparent"></div>
        
        {/* Floating Medical Icons - Responsive */}
        <div className="absolute inset-0 overflow-hidden">
          <FaHeartbeat className="absolute top-10 left-4 sm:top-20 sm:left-10 text-white/10 text-5xl sm:text-7xl md:text-9xl animate-pulse" style={{ animationDuration: '4s' }} />
          <FaShieldAlt className="absolute top-20 right-4 sm:top-40 sm:right-20 text-white/10 text-4xl sm:text-6xl md:text-8xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <FaHospital className="absolute bottom-20 left-1/4 text-white/10 text-4xl sm:text-5xl md:text-7xl animate-pulse hidden sm:block" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          <FaAward className="absolute bottom-10 right-1/3 text-white/10 text-3xl sm:text-4xl md:text-6xl animate-pulse hidden md:block" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }} />
        </div>

        {/* Animated Gradient Orbs - Responsive */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-4 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-bounce-slow"></div>
          <div className="absolute top-20 right-4 sm:top-40 sm:right-20 w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-secondary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-bounce-slow animation-delay-2000"></div>
          <div className="absolute -bottom-16 left-1/2 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-bounce-slow animation-delay-4000"></div>
          <div className="absolute top-1/2 right-4 sm:right-10 w-36 h-36 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
        </div>

        {/* Geometric Shapes - Responsive */}
        <div className="absolute inset-0">
          <div className="absolute top-16 right-8 sm:top-32 sm:right-32 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-4 border-white/20 rotate-45 animate-spin-slow hidden sm:block"></div>
          <div className="absolute bottom-20 left-8 sm:bottom-40 sm:left-40 w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 border-4 border-white/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-1/3 left-4 sm:left-20 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/10 rotate-12 animate-pulse"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-fade-in">
          {/* Trust Badges - Responsive */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 animate-slide-up">
            <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <span className="text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2">
                <FaAward className="text-yellow-300 text-sm sm:text-base" />
                <span className="whitespace-nowrap">Expert Doctors</span>
              </span>
            </div>
            <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <span className="text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2">
                <FaShieldAlt className="text-green-300 text-sm sm:text-base" />
                <span className="whitespace-nowrap">Trusted Care</span>
              </span>
            </div>
            <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <span className="text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2">
                <FaHeartbeat className="text-red-300 text-sm sm:text-base" />
                <span className="whitespace-nowrap">24/7 Support</span>
              </span>
            </div>
          </div>

          {/* Main Logo/Title Section - Responsive */}
          <div className="mb-6 sm:mb-8 relative">
            <div className="inline-block p-4 sm:p-5 md:p-6 bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 border-white/30 shadow-2xl mb-4 sm:mb-6 animate-slide-up">
              <FaHospital className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold text-white mb-3 sm:mb-4 hindi-text drop-shadow-2xl animate-slide-up bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
              सत्त्व
            </h1>
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 px-4">
              <div className="h-0.5 sm:h-1 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-transparent via-white to-white rounded-full"></div>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white/95 tracking-wide sm:tracking-widest animate-slide-up whitespace-nowrap">
                Sattva Clinic
              </p>
              <div className="h-0.5 sm:h-1 w-8 sm:w-12 md:w-16 bg-gradient-to-l from-transparent via-white to-white rounded-full"></div>
            </div>
            <div className="w-24 sm:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-primary-300 via-white to-secondary-300 mx-auto rounded-full mb-4 sm:mb-6"></div>
          </div>

          {/* Subtitle with Enhanced Styling */}
          <div className="mb-12 animate-slide-up">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-4 hindi-text leading-relaxed max-w-5xl mx-auto font-medium">
              {clinicData?.fullName || 'स्किन, डायबिटीज़ थायराइड & एंडोक्राइनोलोजी क्लिनीक, नीमच'}
            </h2>
            <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto mt-4">
              Your Health, Our Priority - Expert Medical Care You Can Trust
            </p>
          </div>

          {/* Enhanced CTA Buttons - Responsive */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center items-center mb-10 sm:mb-12 md:mb-16 animate-slide-up px-4">
            <a 
              href="#appointment" 
              className="group relative w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white text-primary-600 rounded-full font-bold text-base sm:text-lg md:text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 hover:bg-primary-50 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary-100 to-secondary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <FaCalendarAlt className="relative z-10 text-lg sm:text-xl md:text-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              <span className="relative z-10 whitespace-nowrap">Book Appointment</span>
              <span className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-400 rounded-full animate-ping"></span>
            </a>
            <a 
              href="#services" 
              className="group w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/40 rounded-full font-bold text-base sm:text-lg md:text-xl hover:bg-white/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-xl hover:shadow-2xl"
            >
              <FaStethoscope className="text-lg sm:text-xl md:text-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              <span className="whitespace-nowrap">Our Services</span>
            </a>
            <a 
              href="#health-tools" 
              className="group w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/40 rounded-full font-bold text-base sm:text-lg md:text-xl hover:bg-white/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-xl hover:shadow-2xl"
            >
              <FaCalculator className="text-lg sm:text-xl md:text-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              <span className="whitespace-nowrap">Health Tools</span>
            </a>
          </div>

          {/* Quick Stats - Responsive */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-12 animate-slide-up px-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 sm:hover:scale-110">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">10+</div>
              <div className="text-xs sm:text-sm text-white/80">Years Experience</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 sm:hover:scale-110">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">2</div>
              <div className="text-xs sm:text-sm text-white/80">Expert Doctors</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 sm:hover:scale-110">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">4</div>
              <div className="text-xs sm:text-sm text-white/80">Specializations</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 sm:hover:scale-110">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-xs sm:text-sm text-white/80">Patient Care</div>
            </div>
          </div>

          {/* Scroll Indicator - Responsive */}
          <a 
            href="#contact" 
            aria-label="Scroll to contact section"
            className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 text-white/90 hover:text-white animate-bounce flex flex-col items-center gap-1 sm:gap-2 group"
          >
            <span className="text-xs sm:text-sm font-medium hidden sm:block">Scroll Down</span>
            <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1.5 sm:p-2 group-hover:border-white transition-colors">
              <div className="w-1 h-2 sm:w-1.5 sm:h-3 bg-white/70 rounded-full animate-bounce"></div>
            </div>
            <FaArrowDown className="text-base sm:text-lg md:text-xl" />
          </a>
        </div>

        {/* Wave Decoration at Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24 text-white" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C150,80 350,80 600,40 C850,0 1050,0 1200,40 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Enhanced Contact Bar - Responsive */}
      <header id="contact" role="banner" aria-label="Contact information" className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-3 sm:py-4 md:py-5 sticky top-0 z-50 shadow-2xl border-b border-white/10 backdrop-blur-md">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 md:gap-10">
            <a 
              href={`tel:${clinicData?.contact?.phone1 || '9131960802'}`} 
              className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto justify-center"
            >
              <div className="p-1.5 sm:p-2 bg-primary-500 rounded-full group-hover:bg-primary-400 transition-colors">
                <FaPhone className="text-white text-xs sm:text-sm" />
              </div>
              <span className="font-semibold text-sm sm:text-base">{clinicData?.contact?.phone1 || '9131960802'}</span>
            </a>
            <div className="hidden sm:block w-px h-6 md:h-8 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
            <a 
              href={`tel:${clinicData?.contact?.phone2 || '9340633407'}`} 
              className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto justify-center"
            >
              <div className="p-1.5 sm:p-2 bg-secondary-500 rounded-full group-hover:bg-secondary-400 transition-colors">
                <FaPhone className="text-white text-xs sm:text-sm" />
              </div>
              <span className="font-semibold text-sm sm:text-base">{clinicData?.contact?.phone2 || '9340633407'}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Enhanced About Section - Responsive */}
      <section aria-labelledby="about-heading" className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-white via-gray-50 to-primary-50 overflow-hidden">
        {/* Background Decorations - Responsive */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-4 sm:top-20 sm:right-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-10 left-4 sm:bottom-20 sm:left-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg">
              <FaHospital className="text-3xl sm:text-4xl md:text-5xl text-primary-600" />
            </div>
            <h2 id="about-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent px-4">
              About Our Clinic
            </h2>
            <div className="w-24 sm:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 mx-auto rounded-full mb-6 sm:mb-8"></div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-white/50 transform hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 text-center leading-relaxed hindi-text font-medium">
              सत्त्व क्लिनिक एक आधुनिक चिकित्सा सुविधा है जो त्वचा रोग, मधुमेह, थायराइड और एंडोक्राइनोलॉजी में विशेषज्ञता प्रदान करती है।
              हमारा लक्ष्य उच्च गुणवत्ता वाली चिकित्सा सेवाएं प्रदान करना है।
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center mt-4 sm:mt-6 leading-relaxed">
              Sattva Clinic is a modern medical facility specializing in Skin Diseases, Diabetes, Thyroid, and Endocrinology. 
              Our goal is to provide high-quality medical services with expert care and compassion.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Doctors Section - Responsive */}
      <section id="doctors" aria-labelledby="doctors-heading" className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-primary-50 overflow-hidden">
        {/* Background Decorations - Responsive */}
        <div className="absolute inset-0">
          <div className="absolute top-5 left-4 sm:top-10 sm:left-10 w-36 h-36 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
          <div className="absolute bottom-5 right-4 sm:bottom-10 sm:right-10 w-36 h-36 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-block p-4 sm:p-5 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 shadow-xl">
              <FaUserMd className="text-4xl sm:text-5xl md:text-6xl text-primary-600" />
            </div>
            <h2 id="doctors-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent px-4">
              Our Expert Doctors
            </h2>
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="h-0.5 sm:h-1 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-transparent to-primary-500 rounded-full"></div>
              <div className="w-24 sm:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-full"></div>
              <div className="h-0.5 sm:h-1 w-8 sm:w-12 md:w-16 bg-gradient-to-l from-transparent to-primary-500 rounded-full"></div>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Meet our team of highly qualified and experienced medical professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 max-w-7xl mx-auto px-0 sm:px-1 md:px-2">
            {doctors.map((doctor) => (
              <article
                key={doctor.id}
                className="group relative bg-white/90 sm:bg-white/85 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] sm:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] md:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.12)] sm:hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)] hover:border-primary-200/60 hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-500 ease-out"
              >
                {/* Accent: top on mobile/tablet, left on desktop */}
                <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 opacity-90 z-10 lg:hidden" aria-hidden />
                <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-primary-500 to-secondary-500 opacity-90 z-10 hidden lg:block" aria-hidden />

                <div className="flex flex-col lg:flex-row lg:pl-0">
                  {/* Photo: responsive at all breakpoints */}
                  <div className="relative w-full aspect-[4/5] sm:aspect-[4/5] md:aspect-[5/4] lg:aspect-auto lg:w-[260px] xl:w-[300px] lg:h-[260px] xl:h-[320px] flex-shrink-0 bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-5 md:p-6 lg:p-4">
                      {doctor.image ? (
                        <div className="relative w-full h-full max-w-[180px] max-h-[220px] sm:max-w-[220px] sm:max-h-[260px] md:max-w-[280px] md:max-h-[200px] lg:max-w-none lg:max-h-none lg:w-full lg:h-full rounded-xl sm:rounded-2xl overflow-hidden bg-gray-200 group-hover:scale-[1.02] transition-transform duration-500">
                          <img
                            src={doctor.image}
                            alt={`${doctor.englishName} - ${doctor.type}`}
                            loading="lazy"
                            width="300"
                            height="360"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full max-w-[180px] max-h-[220px] sm:max-w-[220px] sm:max-h-[260px] md:max-w-[280px] md:max-h-[200px] lg:max-w-none lg:max-h-none lg:w-full lg:h-full rounded-xl sm:rounded-2xl bg-gray-200/80 flex items-center justify-center">
                          <FaUserMd className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content: padding and typography scale for all screens */}
                  <div className="flex flex-col justify-center p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 lg:min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-widest text-primary-600 mb-1.5 sm:mb-2 md:mb-2.5">
                      {doctor.type}
                    </span>
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-[1.5rem] xl:text-[1.65rem] font-bold text-gray-900 mb-0.5 hindi-text leading-tight tracking-tight">
                      {doctor.name}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-primary-600 font-semibold mb-3 sm:mb-4 md:mb-5">
                      {doctor.englishName}
                    </p>
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base text-gray-600 hindi-text leading-relaxed">
                      <p>{doctor.qualifications}</p>
                      {doctor.specialization && (
                        <p className="text-gray-500">{doctor.specialization}</p>
                      )}
                      {doctor.experience && (
                        <p className="text-gray-400 text-[11px] sm:text-xs md:text-sm italic pt-0.5 sm:pt-1">{doctor.experience}</p>
                      )}
                    </div>
                    <div className="mt-3 sm:mt-4 h-px w-8 sm:w-10 bg-gradient-to-r from-primary-400 to-transparent rounded-full" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Services Section - Responsive */}
      <section id="services" aria-labelledby="services-heading" className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-white via-gray-50 to-secondary-50 overflow-hidden">
        {/* Background Decorations - Responsive */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-4 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-10 right-4 sm:bottom-20 sm:right-20 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-block p-4 sm:p-5 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 shadow-xl">
              <FaStethoscope className="text-4xl sm:text-5xl md:text-6xl text-primary-600" />
            </div>
            <h2 id="services-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-6 hindi-text bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent px-4">
              उपलब्ध सुविधाएँ
            </h2>
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="h-0.5 sm:h-1 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-transparent to-primary-500 rounded-full"></div>
              <div className="w-24 sm:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-full"></div>
              <div className="h-0.5 sm:h-1 w-8 sm:w-12 md:w-16 bg-gradient-to-l from-transparent to-primary-500 rounded-full"></div>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Comprehensive medical and cosmetic services tailored to your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-6xl mx-auto">
            <div className="group bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-[1.01] sm:hover:scale-[1.02] border-2 border-primary-200/50 relative overflow-hidden">
              {/* Decorative Background - Responsive */}
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-primary-200/20 to-transparent rounded-bl-full"></div>
              <div className="absolute -top-5 -right-5 sm:-top-10 sm:-right-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-primary-300/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl shadow-lg">
                    <FaHeartbeat className="text-3xl sm:text-4xl text-white" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                  Endocrinology & Internal Medicine
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  {services?.endocrinology?.map((service, index) => (
                    <li key={index} className="flex items-start gap-3 sm:gap-4 text-gray-700 group/item">
                      <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg group-hover/item:bg-green-200 transition-colors mt-0.5 flex-shrink-0">
                        <FaCheckCircle className="text-green-600 text-base sm:text-lg flex-shrink-0" />
                      </div>
                      <span className="hindi-text text-sm sm:text-base md:text-lg font-medium leading-relaxed">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="group bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-[1.01] sm:hover:scale-[1.02] border-2 border-secondary-200/50 relative overflow-hidden">
              {/* Decorative Background - Responsive */}
              <div className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-secondary-200/20 to-transparent rounded-br-full"></div>
              <div className="absolute -top-5 -left-5 sm:-top-10 sm:-left-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-secondary-300/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl sm:rounded-2xl shadow-lg">
                    <FaStethoscope className="text-3xl sm:text-4xl text-white" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                  Dermatology & Cosmetology
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  {services?.dermatology?.map((service, index) => (
                    <li key={index} className="flex items-start gap-3 sm:gap-4 text-gray-700 group/item">
                      <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg group-hover/item:bg-green-200 transition-colors mt-0.5 flex-shrink-0">
                        <FaCheckCircle className="text-green-600 text-base sm:text-lg flex-shrink-0" />
                      </div>
                      <span className="hindi-text text-sm sm:text-base md:text-lg font-medium leading-relaxed">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Tools Section - BMI & Diabetic Calculators */}
      <section id="health-tools" aria-labelledby="health-tools-heading" className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-primary-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-4 sm:top-20 sm:right-20 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-10 left-4 sm:bottom-20 sm:left-20 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-block p-4 sm:p-5 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 shadow-xl">
              <FaCalculator className="text-4xl sm:text-5xl md:text-6xl text-primary-600" />
            </div>
            <h2 id="health-tools-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent px-4">
              Health Tools
            </h2>
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="h-0.5 sm:h-1 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-transparent to-primary-500 rounded-full"></div>
              <div className="w-24 sm:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-full"></div>
              <div className="h-0.5 sm:h-1 w-8 sm:w-12 md:w-16 bg-gradient-to-l from-transparent to-primary-500 rounded-full"></div>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Use these calculators for quick health checks. For accurate assessment, book an appointment with our specialists.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-7xl mx-auto">
            <BMICalculator />
            <DiabeticCalculator />
            <BSACalculator />
            <IdealWeightCalculator />
            <WaterIntakeCalculator />
            <ThyroidTSHCalculator />
            <CalorieBMRCalculator />
            <WaistHipCalculator />
            <FitzpatrickQuiz />
          </div>
          <HealthMeasureGuide />
          <div className="text-center mt-8 sm:mt-10">
            <a 
              href="#appointment" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              <FaCalendarAlt />
              Book Appointment with Specialist
            </a>
          </div>
        </div>
      </section>

      {/* Appointment / Contact to Book Section - booking done from admin */}
      <section id="appointment" aria-labelledby="appointment-heading" className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-4 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-4 sm:bottom-20 sm:right-20 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <FaCalendarAlt className="absolute top-16 right-8 sm:top-32 sm:right-32 text-white/5 text-5xl sm:text-7xl md:text-9xl hidden sm:block" />
          <FaStethoscope className="absolute bottom-16 left-8 sm:bottom-32 sm:left-32 text-white/5 text-4xl sm:text-6xl md:text-8xl hidden sm:block" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <div className="inline-block p-4 sm:p-5 bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 shadow-xl border border-white/30">
            <FaCalendarAlt className="text-4xl sm:text-5xl md:text-6xl text-white" />
          </div>
          <h2 id="appointment-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-6 drop-shadow-2xl">
            Book an Appointment
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10">
            Call us or visit the clinic to schedule your visit with our specialists.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a
              href={`tel:${clinicData?.contact?.phone1 || '9131960802'}`}
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-700 rounded-xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <FaPhone className="text-xl sm:text-2xl" />
              <span>{clinicData?.contact?.phone1 || '9131960802'}</span>
            </a>
            {clinicData?.contact?.phone2 && (
              <a
                href={`tel:${clinicData.contact.phone2}`}
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-md text-white border-2 border-white/50 rounded-xl font-bold text-base sm:text-lg hover:bg-white/30 transition-all duration-300"
              >
                <FaPhone className="text-xl sm:text-2xl" />
                <span>{clinicData.contact.phone2}</span>
              </a>
            )}
          </div>
          <p className="text-white/80 text-sm sm:text-base mt-6">
            We will help you fix a convenient date and time for your appointment.
          </p>
        </div>
      </section>

      </main>

      {/* Enhanced Footer - Responsive */}
      <footer role="contentinfo" aria-label="Site footer" className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-10 sm:py-12 md:py-16 overflow-hidden">
        {/* Background Decorations - Responsive */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-primary-500/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-secondary-500/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
            {/* Clinic Info */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl sm:rounded-2xl shadow-xl">
                  <FaHospital className="text-2xl sm:text-3xl text-white" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold hindi-text bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  सत्त्व
                </h3>
              </div>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                Skin, Diabetes, Thyroid & Endocrinology Clinic
              </p>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-400 rounded-full animate-pulse"></div>
                <span className="text-sm sm:text-base">Neemuch</span>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-primary-400 to-secondary-400 rounded-full"></div>
                Contact Us
              </h4>
              <div className="space-y-3 sm:space-y-4">
                <a 
                  href={`tel:${clinicData?.contact?.phone1 || '9131960802'}`}
                  className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="p-2 sm:p-3 bg-primary-500 rounded-lg sm:rounded-xl group-hover:bg-primary-400 transition-colors">
                    <FaPhone className="text-white text-sm sm:text-base" />
                  </div>
                  <span className="text-base sm:text-lg font-semibold group-hover:text-primary-300 transition-colors">
                    {clinicData?.contact?.phone1 || '9131960802'}
                  </span>
                </a>
                <a 
                  href={`tel:${clinicData?.contact?.phone2 || '9340633407'}`}
                  className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="p-2 sm:p-3 bg-secondary-500 rounded-lg sm:rounded-xl group-hover:bg-secondary-400 transition-colors">
                    <FaPhone className="text-white text-sm sm:text-base" />
                  </div>
                  <span className="text-base sm:text-lg font-semibold group-hover:text-secondary-300 transition-colors">
                    {clinicData?.contact?.phone2 || '9340633407'}
                  </span>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1">
              <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-primary-400 to-secondary-400 rounded-full"></div>
                Quick Links
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <a 
                  href="#doctors" 
                  className="group flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:translate-x-1 sm:hover:translate-x-2"
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  <span className="text-base sm:text-lg font-medium group-hover:text-primary-300 transition-colors">Our Doctors</span>
                </a>
                <a 
                  href="#services" 
                  className="group flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:translate-x-1 sm:hover:translate-x-2"
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondary-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  <span className="text-base sm:text-lg font-medium group-hover:text-secondary-300 transition-colors">Services</span>
                </a>
                <a 
                  href="#health-tools" 
                  className="group flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:translate-x-1 sm:hover:translate-x-2"
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  <span className="text-base sm:text-lg font-medium group-hover:text-amber-300 transition-colors">Health Tools</span>
                </a>
                <a 
                  href="#appointment" 
                  className="group flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:translate-x-1 sm:hover:translate-x-2"
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  <span className="text-base sm:text-lg font-medium group-hover:text-green-300 transition-colors">Book Appointment</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Footer Bottom - Responsive */}
          <div className="border-t border-white/10 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <p className="text-gray-400 text-center sm:text-left text-sm sm:text-base">
                &copy; {new Date().getFullYear()} <span className="font-bold text-white">Sattva Clinic</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-gray-400 text-sm sm:text-base">
                <FaHeartbeat className="text-red-400 animate-pulse text-base sm:text-lg" />
                <span>Your Health, Our Priority</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
