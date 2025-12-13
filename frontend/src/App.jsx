import React, { useEffect, useState } from 'react';
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
  const [isProcessing, setIsProcessing] = useState(false);

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
        if (isProcessing) {
          console.log('⏳ Already processing OAuth, skipping...');
          return;
        }
        
        setIsProcessing(true);
        console.log('✅ OAuth success detected, checking authentication...');
        
        // Give cookies time to be set
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
          console.log('📡 Calling checkAuth...');
          const isAuthenticated = await checkAuth();
          
          console.log('🔍 checkAuth result:', isAuthenticated);
          
          if (isAuthenticated) {
            console.log('✅ Authentication verified! Navigating to dashboard...');
            // Clean up URL before navigating
            window.history.replaceState({}, '', location.pathname);
            navigate('/dashboard', { replace: true });
          } else {
            console.error('❌ checkAuth returned false');
            console.log('🔄 Retrying in 1 second...');
            
            // Retry once after a delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            const retryAuth = await checkAuth();
            
            if (retryAuth) {
              console.log('✅ Retry successful! Navigating to dashboard...');
              window.history.replaceState({}, '', location.pathname);
              navigate('/dashboard', { replace: true });
            } else {
              console.error('❌ Retry failed. Authentication verification failed');
              navigate('/login?error=verification_failed', { replace: true });
            }
          }
        } catch (error) {
          console.error('❌ Error verifying authentication:', error);
          navigate('/login?error=verification_error', { replace: true });
        } finally {
          setIsProcessing(false);
        }
      }
      
      // Check for OAuth errors
      if (params.get('error')) {
        const errorMessage = params.get('error');
        console.error('❌ OAuth error detected:', errorMessage);
        navigate(`/login?error=${errorMessage}`, { replace: true });
        // Clean up URL
        window.history.replaceState({}, '', location.pathname);
      }
    };

    handleOAuthRedirect();
  }, [location.search, navigate, checkAuth, isProcessing]);

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
