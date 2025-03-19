import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { Sun, Moon, LogOut, Star, User, MessageCircle } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';

interface DropdownMenuProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  onClose: () => void;
  isStar: boolean; // Add this prop
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ isDark, toggleDarkMode, onClose, isStar }) => {
  // Remove useState and useEffect for isStar since we're getting it as prop

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 animate-fade-in">
      {/* Arrow */}
      <div className="absolute top-[-5px] right-3 h-0 w-0 border-l-[5px] border-r-[5px] border-b-[5px] border-l-transparent border-r-transparent border-b-white dark:border-b-gray-800"></div>

      <button
        onClick={toggleDarkMode}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {isDark ? (
          <>
            <Sun className="w-4 h-4 mr-2" />
            Light Mode
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 mr-2" />
            Dark Mode
          </>
        )}
      </button>
      {isStar ? (
        <Link
          to="/profile"
          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <User className="w-4 h-4 mr-2 inline-block" />
          Profile
        </Link>
      ) : (
        <Link
          to="/register-star"
          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <Star className="w-4 h-4 mr-2 inline-block" />
          Register as a Star
        </Link>
      )}
      <Link
          to="/messages"
          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <MessageCircle className="w-4 h-4 mr-2 inline-block"/>
          Messages
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </button>
    </div>
  );
};

export default DropdownMenu;
