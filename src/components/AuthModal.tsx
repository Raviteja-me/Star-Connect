import React, { useState, useContext, useEffect } from 'react';
import { X, User, Mail, Lock } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectAfterLogin?: string | null;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, redirectAfterLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showWelcome, setShowWelcome] = useState(false); // State for welcome message
  const { signIn, signUp, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (redirectAfterLogin) {
      // Clear the redirect state after navigation
      // This prevents an infinite loop if the user closes the modal without signing in
    }
  }, [redirectAfterLogin, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signIn(email, password);
        onClose(); // Close modal after sign in
      } else {
        await signUp(email, password, username);
        setShowWelcome(true); // Show welcome message
        setTimeout(() => {
          setShowWelcome(false); // Hide welcome message after 3 seconds
          onClose(); // Close modal after signup and welcome message
          if (redirectAfterLogin) {
            navigate(redirectAfterLogin);
          }
        }, 3000);
      }

    } catch (error) {
      console.error("Authentication error:", error.message);
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
      if (redirectAfterLogin) {
          navigate(redirectAfterLogin);
        }
    } catch (error) {
      console.error("Google Sign-In error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? 'flex' : 'hidden'
      } items-center justify-center bg-black bg-opacity-50`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        {showWelcome ? ( // Display welcome message if showWelcome is true
          <div className="text-center animate-bounce">
            <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400">Welcome to StarConnect!</h2>
          </div>
        ) : (
          <>
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

            <button
              onClick={handleGoogleSignIn}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In with Google
            </button>

            <div className="text-center mt-4">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {isLogin ? 'Create an account' : 'Already have an account? Sign in'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
