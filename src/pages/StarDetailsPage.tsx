import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Star, Award, MessageCircle, Video, Image, Users, Mail, Phone } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';

const StarDetailsPage = () => {
  const { starId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [starData, setStarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStarData = async () => {
      try {
        const starDoc = await getDoc(doc(db, 'stars', starId));
        if (starDoc.exists()) {
          setStarData(starDoc.data());
        }
      } catch (error) {
        console.error('Error fetching star data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (starId) {
      fetchStarData();
    }
  }, [starId]);

  const handleChatButtonClick = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      // Create or get existing chat
      const chatId = [user.uid, starId].sort().join('_');
      
      // Create chat document if it doesn't exist
      const chatsRef = collection(db, 'chats');
      await addDoc(chatsRef, {
        participants: [user.uid, starId],
        updatedAt: serverTimestamp(),
      });

      // Navigate to chat page
      navigate(`/chat/${starId}`);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!starData) {
    return <div className="text-center py-8">Star not found</div>;
  }

  const serviceFee = Math.round(Number(starData.hourlyRate) * 0.1);
  const total = Number(starData.hourlyRate) + serviceFee;

  // Updated YouTube URL parser
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      let videoId;

      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v');
      } else if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.slice(1);
      }

      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (e) {
      console.error('Invalid URL:', e);
      return null;
    }
  };

  const embedVideoUrl = starData.videoIntroduction ? getYouTubeEmbedUrl(starData.videoIntroduction) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            {starData.profilePicture && (
              <img
                src={starData.profilePicture}
                alt={starData.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl"
              />
            )}
            <div className="text-white text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{starData.name}</h1>
              <p className="text-xl text-indigo-100 mb-4">{starData.category}</p>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <span className="text-lg">{starData.experience} years experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Video Section - Enhanced */}
          {starData.videoIntroduction && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-8 dark:text-white flex items-center">
                  <Video className="w-8 h-8 mr-4 text-indigo-600" />
                  Introduction Video
                </h2>
                <div className="relative w-full overflow-hidden rounded-xl shadow-2xl">
                  {/* Video Wrapper with custom aspect ratio */}
                  <div className="relative pb-[56.25%] h-0">
                    <iframe
                      src={getYouTubeEmbedUrl(starData.videoIntroduction)}
                      title={`${starData.name} - Introduction Video`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full rounded-xl"
                    ></iframe>
                  </div>
                </div>
                {/* Optional video description */}
                <div className="mt-6 p-6 bg-indigo-50 dark:bg-gray-700 rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300 text-lg">
                    Watch {starData.name}'s introduction video to learn more about their performances and experience.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* About Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">About</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
              {starData.bio}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center p-4 bg-indigo-50 dark:bg-gray-700 rounded-xl">
                <Award className="w-8 h-8 text-indigo-600 mr-4" />
                <div>
                  <h3 className="font-semibold dark:text-white">Experience</h3>
                  <p className="text-gray-600 dark:text-gray-300">{starData.experience} years</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-indigo-50 dark:bg-gray-700 rounded-xl">
                <Users className="w-8 h-8 text-indigo-600 mr-4" />
                <div>
                  <h3 className="font-semibold dark:text-white">Expertise</h3>
                  <p className="text-gray-600 dark:text-gray-300">{starData.expertise}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          {starData.advertisingImages && starData.advertisingImages.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 dark:text-white">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {starData.advertisingImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${starData.name} - Image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking Section - Right Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 dark:text-white">Book an Experience</h2>
              <div className="space-y-6">
                {/* Date and Time selectors remain the same */}
                {/* ... */}

                <div className="bg-indigo-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Base Price</span>
                    <span className="font-semibold dark:text-white">${starData.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
                    <span className="font-semibold dark:text-white">${serviceFee}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-indigo-100 dark:border-gray-600">
                    <span className="dark:text-white">Total</span>
                    <span className="text-indigo-600 dark:text-indigo-400">${total}</span>
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = '/booking-confirmation'}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 shadow-lg"
                >
                  Book Now
                </button>

                <button
                  onClick={handleChatButtonClick}
                  className="w-full flex items-center justify-center px-6 py-4 bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-xl font-semibold border-2 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-600 transition"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat with Star
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleAuthModalClose} 
        redirectAfterLogin={`/chat/${starId}`}
      />
    </div>
  );
};

export default StarDetailsPage;
