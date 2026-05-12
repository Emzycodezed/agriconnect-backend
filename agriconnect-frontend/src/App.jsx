import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

// --- Components ---
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// --- Pages ---
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import FRADashboard from './pages/FRADashboard';
import CooperativeDashboard from './pages/CooperativeDashboard';
import AdminDashboard from './pages/AdminDashboard';

// --- Configuration ---

// Paths where the main Navbar should be hidden (e.g., Auth pages)
const NO_NAVBAR_PATHS = ['/login', '/register'];

// Route Configuration Object
// Allows for easier management, iteration, and potential sidebar generation later
const routeConfig = [
  {
    path: '/',
    element: <Landing />,
    isProtected: false,
  },
  {
    path: '/register',
    element: <Register />,
    isProtected: false,
  },
  {
    path: '/login',
    element: <Login />,
    isProtected: false,
  },
  {
    path: '/farmer',
    element: <FarmerDashboard />,
    isProtected: true,
    allowedRoles: ['farmer'],
  },
  {
    path: '/buyer',
    element: <BuyerDashboard />,
    isProtected: true,
    allowedRoles: ['buyer'],
  },
  {
    path: '/supplier',
    element: <SupplierDashboard />,
    isProtected: true,
    allowedRoles: ['supplier'],
  },
  {
    path: '/fra',
    element: <FRADashboard />,
    isProtected: true,
    allowedRoles: ['fra', 'extension', 'admin'],
  },
  {
    path: '/cooperative',
    element: <CooperativeDashboard />,
    isProtected: true,
    allowedRoles: ['cooperative', 'admin'],
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
    isProtected: true,
    allowedRoles: ['admin'],
  },
];

/**
 * Main Application Component
 * Handles global layout, navigation visibility, and routing logic.
 */
export default function App() {
  const location = useLocation();

  // Determine if Navbar should be visible based on current path
  const shouldShowNavbar = !NO_NAVBAR_PATHS.includes(location.pathname);
  const appBackground = {
    backgroundImage:
      "linear-gradient(rgba(248,250,252,0.88), rgba(248,250,252,0.88)), url('https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1800&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-900" style={appBackground}>
      {/* Conditional Navbar Rendering */}
      {shouldShowNavbar && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Map through configuration to generate routes */}
          {routeConfig.map(({ path, element, isProtected, allowedRoles }) => (
            <Route
              key={path}
              path={path}
              element={
                isProtected ? (
                  <ProtectedRoute allowedRoles={allowedRoles}>
                    {element}
                  </ProtectedRoute>
                ) : (
                  element
                )
              }
            />
          ))}

          {/* 404 Fallback - Redirects to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Optional: Global Footer could go here */}
    </div>
  );
}
