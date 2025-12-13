import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import VideoRoom from './components/VideoRoom';
import ProtectedRoute from './components/ProtectedRoute';
import Snippets from './components/Snippets';
import Footer from './components/Footer';
import Login from './components/Login';

// OAuth Handler Component
function OAuthHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const params = new URLSearchParams(location.search);
      
      console.log('🔍 OAuthHandler: Checking URL params...', {
        auth: params.get('auth'),
        error: params.get('error'),
        fullURL: window.location.href
      });
      
      // Check for successful OAuth
      if (params.get('auth') === 'success') {
        console.log('✅ OAuth success detected, checking authentication...');
        
        // Small delay to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
          // Verify authentication with backend
          const isAuthenticated = await checkAuth();
          
          if (isAuthenticated) {
            console.log('✅ Authentication verified, navigating to dashboard');
            navigate('/dashboard', { replace: true });
          } else {
            console.error('❌ Authentication verification failed');
            navigate('/login?error=verification_failed', { replace: true });
          }
        } catch (error) {
          console.error('❌ Error verifying authentication:', error);
          navigate('/login?error=verification_error', { replace: true });
        }
      }
      
      // Check for OAuth errors
      if (params.get('error')) {
        const errorMessage = params.get('error');
        console.error('❌ OAuth error detected:', errorMessage);
        navigate(`/login?error=${errorMessage}`, { replace: true });
      }
    };

    handleOAuthRedirect();
  }, [location.search, navigate, checkAuth]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <OAuthHandler />
      <Routes>
        <Route path="/login" element={<Login />} />
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
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
