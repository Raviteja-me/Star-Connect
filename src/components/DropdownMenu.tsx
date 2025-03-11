import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DropdownMenuProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  onClose: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ isDark, toggleDarkMode, onClose }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onClose(); // Close the dropdown after logout
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20">
      <div className="py-1">
        {user?.displayName && (
          <Link to="/profile" onClick={onClose} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            Profile
          </Link>
        )}
        <Link to="/register-star" onClick={onClose} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
          Register as a Star
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
};

export default DropdownMenu;
