import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [starData, setStarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  if (!starData) {
    return <div className="container mx-auto p-4 text-center">No profile data found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Star Profile</h1>

      {/* Personal Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Name:</p>
            <p>{starData.name}</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <p>{starData.email}</p>
          </div>
          <div>
            <p className="font-semibold">Phone:</p>
            <p>{starData.phone}</p>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Category:</p>
            <p>{starData.category}</p>
          </div>
          <div>
            <p className="font-semibold">Experience:</p>
            <p>{starData.experience} years</p>
          </div>
          <div>
            <p className="font-semibold">Hourly Rate:</p>
            <p>${starData.hourlyRate}</p>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Profile Picture:</p>
            <img src={starData.profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
          </div>
          <div>
            <p className="font-semibold">Video Introduction:</p>
            <a href={starData.videoIntroduction} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Watch Video
            </a>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {starData.socialMediaLinks.instagram && (
            <div>
              <p className="font-semibold">Instagram:</p>
              <a href={starData.socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {starData.socialMediaLinks.instagram}
              </a>
            </div>
          )}
          {starData.socialMediaLinks.twitter && (
            <div>
              <p className="font-semibold">Twitter:</p>
              <a href={starData.socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {starData.socialMediaLinks.twitter}
              </a>
            </div>
          )}
          {starData.socialMediaLinks.facebook && (
            <div>
              <p className="font-semibold">Facebook:</p>
              <a href={starData.socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {starData.socialMediaLinks.facebook}
              </a>
            </div>
          )}
          {starData.socialMediaLinks.youtube && (
            <div>
              <p className="font-semibold">YouTube:</p>
              <a href={starData.socialMediaLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {starData.socialMediaLinks.youtube}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Advertising Images */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Advertising Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {starData.advertisingImages.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Advertising ${index + 1}`} className="w-full h-48 object-cover rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
