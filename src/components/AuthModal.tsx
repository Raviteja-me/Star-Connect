import React, { useState, useContext } from 'react';
import { X, User, Mail, Lock, LogOut } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Add username state
  const { signIn, signUp, signInWithGoogle, signOut } = useContext(AuthContext);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await signIn(email, password);
    } else {
      await signUp(email, password, username); // Pass username
    }
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? 'flex' : 'hidden'
      } items-center justify-center bg-black bg-opacity-50`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold dark:text-white">{isLogin ? 'Sign In' : 'Sign Up'}</h2>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Google Sign-In Button */}
        <button
          onClick={signInWithGoogle}
          className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-semibold mt-4 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          <FcGoogle size={24} />
          <span>{isLogin ? 'Sign In with Google' : 'Sign Up with Google'}</span>
        </button>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {isLogin ? 'Create an account' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
