import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 1. IF LOADING: Show a spinner (Don't redirect yet!)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 2. IF NOT LOADING & NO USER: Redirect to Home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. IF USER EXISTS: Show Dashboard
  return children;
};

export default ProtectedRoute;
