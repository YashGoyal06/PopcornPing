import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import VideoRoom from './components/VideoRoom';
import ProtectedRoute from './components/ProtectedRoute';
import Snippets from './components/Snippets';
import Footer from './components/Footer';
import Login from './components/Login';

// --- OAuth Handler Component (FIXED) ---
// This component simply detects the "success" flag from the backend
// and redirects to the dashboard. The AuthContext & ProtectedRoute
// will handle the "loading" and "user fetching" automatically.
function OAuthHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = searchParams.get('auth');
    const errorStatus = searchParams.get('error');

    // 1. Success Case
    if (authStatus === 'success') {
      // The backend has set the cookie. We just need to go to the dashboard.
      // The ProtectedRoute will see we are "loading", wait for AuthContext
      // to fetch the user, and then let us in.
      navigate('/dashboard', { replace: true });
    }

    // 2. Error Case
    if (errorStatus) {
      console.error('OAuth Error:', errorStatus);
      navigate(`/login?error=${errorStatus}`, { replace: true });
    }

  }, [searchParams, navigate]);

  return null;
}

// --- Main Routes ---
function AppRoutes() {
  return (
    <>
      <OAuthHandler />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Public Landing Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Snippets />
              <Footer />
            </>
          }
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Video Room */}
        <Route
          path="/room/:roomId"
          element={
            <ProtectedRoute>
              <VideoRoom />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

// --- Main App Component ---
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
