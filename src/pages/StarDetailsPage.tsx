import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Star, Award, MessageCircle, Video, Image, Users, Mail, Phone } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { doc, getDoc } from 'firebase/firestore';
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

    const handleChatButtonClick = () => {
    if (user) {
      // Redirect to chat page if user is logged in
      navigate(`/chat/${starId}`);
    } else {
      // Open the authentication modal if user is not logged in
      setIsAuthModalOpen(true);
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Star Info */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Header with Profile Picture and Name */}
            <div className="p-6 flex items-center space-x-4 border-b dark:border-gray-700">
              {starData.profilePicture && (
                <img
                  src={starData.profilePicture}
                  alt={starData.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold mb-1 dark:text-white">{starData.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">{starData.category}</p>
              </div>
            </div>

            {/* Video Section */}
            {starData.videoIntroduction && (
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 dark:text-white flex items-center">
                  <Video className="w-5 h-5 mr-2 text-indigo-600" />
                  Introduction Video
                </h2>
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <iframe
                    src={getYouTubeEmbedUrl(starData.videoIntroduction)}
                    title={`${starData.name} - Introduction Video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Advertising Images Gallery */}
            {starData.advertisingImages && starData.advertisingImages.length > 0 && (
              <div className="flex overflow-x-auto py-4 px-6 space-x-4 scrollbar-hide">
                {starData.advertisingImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${starData.name} - Image ${index + 1}`}
                    className="w-72 h-48 object-cover rounded-lg flex-shrink-0 hover:scale-105 transition-all duration-300"
                  />
                ))}
              </div>
            )}

            {/* Star Info Section */}
            <div className="p-6 border-t dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">{starData.experience} years experience</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 animate-fade-in-delay-2">
                {starData.bio}
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-indigo-600" />
                  <span className="dark:text-gray-300">Professional Experience: {starData.experience} years</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-indigo-600" />
                  <span className="dark:text-gray-300">Expertise: {starData.expertise}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-indigo-600" />
                  <span className="dark:text-gray-300">Contact: {starData.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-indigo-600" />
                  <span className="dark:text-gray-300">Phone: {starData.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Social Media</h2>
            <div className="space-y-2">
              {starData.socialMediaLinks?.facebook && (
                <a href={starData.socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 hover:underline block">Facebook</a>
              )}
              {starData.socialMediaLinks?.twitter && (
                <a href={starData.socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 hover:underline block">LinkedIn</a>
              )}
              {starData.socialMediaLinks?.youtube && (
                <a href={starData.socialMediaLinks.youtube} target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 hover:underline block">YouTube</a>
              )}
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-fit">
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">Book an Experience</h2>
          <div className="animate-fade-in">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={date => setSelectedDate(date)}
                  minDate={new Date()}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Select Time</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {`${i.toString().padStart(2, '0')}:00`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Base Price</span>
                  <span className="font-semibold dark:text-white">${starData.hourlyRate}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
                  <span className="font-semibold dark:text-white">${serviceFee}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                  <span className="dark:text-white">Total</span>
                  <span className="text-indigo-600 dark:text-indigo-400">${total}</span>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/booking-confirmation'}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition mb-4"
              >
                Book Now
              </button>

              {/* Chat Button (Placeholder) */}
              <button onClick={handleChatButtonClick} className="w-full block text-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                Chat with Star
              </button>
            </div>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={handleAuthModalClose} />
    </div>
  );
};

export default StarDetailsPage;
