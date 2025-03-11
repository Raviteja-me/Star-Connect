import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Star, Award, MessageCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const StarDetailsPage = () => {
  const { starId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [starData, setStarData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!starData) {
    return <div className="text-center py-8">Star not found</div>;
  }

  const serviceFee = Math.round(Number(starData.hourlyRate) * 0.1);
  const total = Number(starData.hourlyRate) + serviceFee;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Star Info */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <img
              src={starData.profilePicture || starData.advertisingImages?.[0]}
              alt={starData.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-2 dark:text-white">{starData.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{starData.category}</p>
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-gray-600 dark:text-gray-400">{starData.experience} years experience</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Professional {starData.category} with {starData.experience} years of experience. 
                Available for events and performances.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-indigo-600" />
                  <span className="dark:text-gray-300">Professional Experience: {starData.experience} years</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-indigo-600" />
                  <span className="dark:text-gray-300">Contact: {starData.email}</span>
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
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarDetailsPage;
