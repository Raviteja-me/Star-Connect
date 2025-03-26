import React, { useState, useContext, useEffect } from 'react';
import { X, User, Mail, Lock } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectAfterLogin?: string | null;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, redirectAfterLogin }) => {
  const [isLogin, setIsLogin] = useState(false);
  // Add welcome message state
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (redirectAfterLogin) {
      // Optionally handle redirect after login if needed
    }
  }, [redirectAfterLogin, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await signIn(email, password);
        setWelcomeMessage(`Welcome back!`);
        setShowWelcome(true);
        setTimeout(() => {
          setShowWelcome(false);
          onClose();
          if (redirectAfterLogin) {
            navigate(redirectAfterLogin);
          }
        }, 2000);
      } else {
        await signUp(email, password, username);
        
        // Check if user was registered as a star
        if (redirectAfterLogin === '/profile') {
          const user = auth.currentUser;
          if (user) {
            const starRef = doc(db, 'stars', user.uid);
            const starDoc = await getDoc(starRef);
            if (starDoc.exists()) {
              toast.success('Successfully registered as a star!');
              // Force reload to update navbar state
              window.location.href = '/profile';
              return;
            }
          }
        }
        
        onClose();
      }
    } catch (error) {
      console.error("Authentication error:", error.message);
      if (!error.message.includes("permissions")) {
        setError(error.message);
      } else {
        onClose();
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
      onClose();
      if (redirectAfterLogin) {
        navigate(redirectAfterLogin);
      }
    } catch (error) {
      console.error("Google Sign-In error:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
        {showWelcome ? (
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">
              {welcomeMessage}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {isLogin ? 'Glad to see you again!' : 'Your account has been created successfully!'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold dark:text-white">{isLogin ? 'Sign In' : 'Create Account'}</h2>
              <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}
            <form onSubmit={handleFormSubmit} className="space-y-6">
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-200" // Increased py to py-3
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-200" // Increased py to py-3
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-200" // Increased py to py-3
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <button
              onClick={handleGoogleSignIn}
              className="w-full mt-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex justify-center items-center transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLogin ? 'Sign In with Google' : 'Sign Up with Google'}
            </button>

            <div className="text-center mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
