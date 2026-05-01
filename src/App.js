import React, { useEffect, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { initialCloudSync, FIREBASE_ENABLED } from './services/localStorageApi';
import './App.css';

// Lazy-load route-level components so they are only downloaded when visited
const LandingPage    = lazy(() => import('./components/LandingPage'));
const Login          = lazy(() => import('./components/Login'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

// Full-page loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading…</p>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    if (FIREBASE_ENABLED) {
      initialCloudSync().then((result) => {
        if (result.synced) {
          console.log('[Sattva] Data synced from Firestore');
        }
      });
    }
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/admin/login" element={<Login />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </Suspense>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;

