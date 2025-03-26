import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, Sun, Moon, X, ChevronDown } from 'lucide-react';
import AuthModal from './AuthModal';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';
import DropdownMenu from './DropdownMenu';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isStar, setIsStar] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkStarRegistration = async () => {
      if (user) {
        const starRef = doc(db, 'stars', user.uid);
        const starDoc = await getDoc(starRef);
        setIsStar(starDoc.exists());
      } else {
        setIsStar(false);
      }
    };

    checkStarRegistration();

    // Add event listener for star registration
    const handleStarRegistered = () => {
      checkStarRegistration();
    };

    window.addEventListener('starRegistered', handleStarRegistered);

    return () => {
      window.removeEventListener('starRegistered', handleStarRegistered);
    };
  }, [user]);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setIsDark(!isDark);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  }

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                <Logo />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                StarConnect
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="text-gray-700 dark:text-gray-200 flex items-center gap-1"
                  >
                    <span>{user.displayName || user.email}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {isDropdownOpen && (
                    <DropdownMenu 
                      isDark={isDark} 
                      toggleDarkMode={toggleDarkMode} 
                      onClose={closeDropdown}
                      isStar={isStar} // Pass isStar as prop
                    />
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsDrawerOpen(true)}>
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-xl z-50 transition-transform duration-300 ease-in-out transform ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <button onClick={() => setIsDrawerOpen(false)} className="absolute top-4 right-4 text-gray-600 dark:text-gray-300">
            <X className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center mt-10 space-y-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-8 h-8" />
              ) : (
                <Moon className="w-8 h-8" />
              )}
            </button>
            {user ? (
              <div className="relative w-full">
                <button
                    onClick={toggleDropdown}
                    className="text-gray-700 dark:text-gray-200 w-full text-center flex items-center justify-center gap-1"
                  >
                    <span>{user.displayName || user.email}</span>
                    <ChevronDown className="w-4 h-4" />
                </button>
                {isDropdownOpen && (
                    <DropdownMenu isDark={isDark} toggleDarkMode={toggleDarkMode} onClose={closeDropdown}/>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                <User className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
