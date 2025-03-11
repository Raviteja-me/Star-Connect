import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookStarPage from './pages/BookStarPage';
import CategoryPage from './pages/CategoryPage';
import StarDetailsPage from './pages/StarDetailsPage';
import RegisterStarPage from './pages/RegisterStarPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/book-star" element={<BookStarPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/star/:starId" element={<StarDetailsPage />} />
              <Route path="/register-star" element={<RegisterStarPage />} />
              <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
