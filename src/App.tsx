import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import StarDetailsPage from './pages/StarDetailsPage';
import BookStarPage from './pages/BookStarPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import RegisterStarPage from './pages/RegisterStarPage';
import ProfilePage from './pages/ProfilePage'; // Import the new ProfilePage
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css';

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <Router>
      <AuthProvider>
        <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 ${isDark ? 'dark' : ''}`}>
          <Navbar isDark={isDark} toggleDarkMode={toggleDarkMode} />
          <main className="py-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/star/:starId" element={<StarDetailsPage />} />
              <Route path="/book/:starId" element={<BookStarPage />} />
              <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
              <Route path="/register-star" element={<RegisterStarPage />} />
              <Route path="/profile" element={<ProfilePage />} /> {/* Add the new route */}
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
