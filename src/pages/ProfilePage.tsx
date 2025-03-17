import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const [starData, setStarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStarData = async () => {
      if (user) {
        try {
          const starRef = doc(db, 'stars', user.uid);
          const starDoc = await getDoc(starRef);

          if (starDoc.exists()) {
            setStarData(starDoc.data());
          } else {
            setError('Star profile not found.');
          }
        } catch (error) {
          console.error('Error fetching star data:', error);
          setError('Failed to fetch profile data.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStarData();
  }, [user]);

  const handleUpgradeClick = () => {
    navigate('/plan-upgrade');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 p-6 rounded-lg shadow-lg">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    </div>;
  }

  if (!starData) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
        <p className="text-gray-600 font-medium">No profile data found.</p>
      </div>
    </div>;
  }

  // Assuming starData has a plan field, defaulting to 'free' if not present
  const currentPlan = starData.plan || 'free';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Plan Information Banner */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-500">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentPlan === 'free' ? 'Free Plan' : 'Premium Plan'}
              </h2>
              <p className="text-gray-600 mb-4">
                {currentPlan === 'free' 
                  ? 'You are currently on the Free Plan with limited features. Upgrade to Premium to unlock all benefits!'
                  : 'You are on the Premium Plan. Enjoy all the benefits and features!'}
              </p>
            </div>
            {currentPlan === 'free' && (
              <button
                onClick={handleUpgradeClick}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center"
              >
                <span>Upgrade to Premium</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
          </div>
          {currentPlan === 'free' && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="font-medium text-gray-700 mb-2">Premium Benefits:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Marketing & Promotion
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure Payment Processing
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Fraud Protection
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority Visibility
                </li>
              </ul>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Star Profile
        </h1>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-transform hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="font-semibold text-gray-700">Name:</p>
              <p className="text-gray-600">{starData.name}</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gray-700">Email:</p>
              <p className="text-gray-600">{starData.email}</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gray-700">Phone:</p>
              <p className="text-gray-600">{starData.phone}</p>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-transform hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Professional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="font-semibold text-gray-700">Category:</p>
              <p className="text-gray-600">{starData.category}</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gray-700">Experience:</p>
              <p className="text-gray-600">{starData.experience} years</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gray-700">Hourly Rate:</p>
              <p className="text-gray-600 text-lg font-medium">${starData.hourlyRate}</p>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-transform hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="font-semibold text-gray-700">Profile Picture:</p>
              <img 
                src={starData.profilePicture} 
                alt="Profile" 
                className="w-40 h-40 rounded-full object-cover shadow-lg ring-4 ring-gray-50" 
              />
            </div>
            <div className="space-y-4">
              <p className="font-semibold text-gray-700">Video Introduction:</p>
              <a 
                href={starData.videoIntroduction} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span className="mr-2">Watch Video</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-transform hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {starData.socialMediaLinks && Object.entries(starData.socialMediaLinks).map(([platform, url]) => (
              url && (
                <div key={platform} className="space-y-2">
                  <p className="font-semibold text-gray-700 capitalize">{platform}:</p>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:text-blue-600 transition-colors flex items-center"
                  >
                    <span className="truncate">{url}</span>
                    <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Advertising Images */}
        <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Advertising Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {starData.advertisingImages && starData.advertisingImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img 
                  src={imageUrl} 
                  alt={`Advertising ${index + 1}`} 
                  className="w-full h-48 object-cover rounded-lg shadow-md transition-transform group-hover:scale-[1.02]" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
