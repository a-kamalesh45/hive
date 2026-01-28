import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import Pricing from './pages/PricingPage';
import Contact from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import AddQuery from './pages/AddQueryPage';
import Profile from './pages/ProfilePage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };

  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };

  return !isLoggedIn() ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Public Routes with Navbar */}
          <Route path="/" element={
            <>
              <Navbar />
              <LandingPage />
              <Footer />
            </>
          } />

          <Route path="/pricing" element={
            <>
              <Navbar />
              <Pricing />
              <Footer />
            </>
          } />

          <Route path="/contact" element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          } />

          <Route path="/features" element={
            <>
              <Navbar />
              <FeaturesPage />
              <Footer />
            </>
          } />

          {/* Auth Routes (no navbar) */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <DashboardPage />
                <Footer />
              </>
            </ProtectedRoute>
          } />

          <Route path="/add-query" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <AddQuery />
                <Footer />
              </>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Profile />
                <Footer />
              </>
            </ProtectedRoute>
          } />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
