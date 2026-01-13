import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import DashboardPage from './pages/DashboardPage';
import Layout from './components/Layout';
import AddQuery from './components/AddQuery';
import Profile from './components/Profile';

function App() {
  const [currentView, setCurrentView] = useState('home');

  // Listen for hash changes to navigate
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentView(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <Login />;

      case 'signup':
        return <Signup />;

      case 'pricing':
        return (
          <>
            <Navbar />
            <Pricing />
            <Footer />
          </>
        );

      case 'contact':
        return (
          <>
            <Navbar />
            <Contact />
            <Footer />
          </>
        );

      case 'dashboard':
        return (
          <>
            <Navbar />
            <DashboardPage />
            <Footer />
          </>
        );

      case 'add-query':
        return (
          <>
            <Navbar />
            <AddQuery />
            <Footer />
          </>
        );

      case 'profile':
        return (
          <>
            <Navbar />
            <Profile />
            <Footer />
          </>
        );

      case 'features':
        // Scroll to features section on home page
        setTimeout(() => {
          const featuresSection = document.getElementById('features');
          if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        return (
          <>
            <Navbar />
            <LandingPage />
            <Footer />
          </>
        );

      case 'home':
      default:
        return (
          <>
            <Navbar />
            <LandingPage />
            <Footer />
          </>
        );
    }
  };

  return <div className="min-h-screen">{renderView()}</div>;
}

export default App;
