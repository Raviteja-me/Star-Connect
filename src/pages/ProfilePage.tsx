import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Pencil, Check, X, Camera, Upload, Trash2, Video } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProfilePage = () => {
  const { user } = useAuth();
  const [starData, setStarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState({});
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStarData = async () => {
      if (user) {
        try {
          const starRef = doc(db, 'stars', user.uid);
          const starDoc = await getDoc(starRef);

          if (starDoc.exists()) {
            setStarData(starDoc.data());
            // Initialize editData with advertisingImages
            setEditData(prev => ({
              ...prev,
              'advertising.image': starDoc.data().advertisingImages || []
            }));
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

  const handleEdit = (section, field) => {
    setEditMode(prev => ({ ...prev, [`${section}.${field}`]: true }));
    setEditData(prev => ({ ...prev, [`${section}.${field}`]: starData?.[field] }));
  };

  const handleCancel = (section, field) => {
    setEditMode(prev => ({ ...prev, [`${section}.${field}`]: false }));
    setEditData(prev => ({ ...prev, [`${section}.${field}`]: starData?.[field] }));
  };

  const handleSave = async (section, field) => {
    try {
      setSaving(true);
      let newValue = editData[`${section}.${field}`];

      // Handle advertising images array
      if (field === 'advertisingImages') {
        newValue = editData['advertising.image'];
      }

      // Update Firestore
      const starRef = doc(db, 'stars', user.uid);
      await updateDoc(starRef, { [field]: newValue });

      // Update local state
      setStarData(prev => ({ ...prev, [field]: newValue }));
      setEditMode(prev => ({ ...prev, [`${section}.${field}`]: false }));

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section, field, value) => {
    if (section === 'advertising' && field.startsWith('image.')) {
      const index = parseInt(field.split('.')[1], 10);
      setEditData(prev => {
        const newImages = [...(prev['advertising.image'] || [])];
        newImages[index] = value;
        return { ...prev, 'advertising.image': newImages };
      });
    } else {
      setEditData(prev => ({ ...prev, [`${section}.${field}`]: value }));
    }
  };

  const renderEditableField = (section, field, label, type = 'text') => {
    const isEditing = editMode[`${section}.${field}`];
    const value = editData[`${section}.${field}`] || starData?.[field];

    return (
      <div className="space-y-2 relative group">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-700">{label}:</p>
          {!isEditing && (
            <button
              onClick={() => handleEdit(section, field)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-full"
            >
              <Pencil className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type={type}
              value={value}
              onChange={(e) => handleChange(section, field, e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={saving}
            />
            <button
              onClick={() => handleSave(section, field)}
              disabled={saving}
              className="p-1 hover:bg-green-100 rounded-full text-green-600 disabled:opacity-50"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleCancel(section, field)}
              disabled={saving}
              className="p-1 hover:bg-red-100 rounded-full text-red-600 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <p className="text-gray-600">{value}</p>
        )}
      </div>
    );
  };

  const getYouTubeEmbedUrl = (url: string | undefined) => {
    if (!url) return '';
    const videoId = url.match(/[?&]v=([^&]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  // Add this handler after your existing handlers
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    try {
      setSaving(true);
      const storageRef = ref(storage, `stars/${user.uid}/profile/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      const starRef = doc(db, 'stars', user.uid);
      await updateDoc(starRef, { profilePicture: downloadURL });
      
      setStarData(prev => ({ ...prev, profilePicture: downloadURL }));
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture. Please try again.');
    } finally {
      setSaving(false);
    }
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
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 flex items-center">
            <span>Personal Information</span>
            <div className="ml-auto text-sm text-gray-500">Hover to edit</div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderEditableField('personal', 'name', 'Name')}
            {renderEditableField('personal', 'email', 'Email', 'email')}
            {renderEditableField('personal', 'phone', 'Phone', 'tel')}
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-transform hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 flex items-center">
            <span>Professional Information</span>
            <div className="ml-auto text-sm text-gray-500">Hover to edit</div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderEditableField('professional', 'category', 'Category')}
            {renderEditableField('professional', 'experience', 'Experience', 'number')}
            {renderEditableField('professional', 'hourlyRate', 'Hourly Rate', 'number')}
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-transform hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 flex items-center">
            <span>Media</span>
            <div className="ml-auto text-sm text-gray-500">Hover to edit</div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Picture */}
            // Replace the profile picture section in the Media component
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-700">Profile Picture</p>
                <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                  <Camera className="w-5 h-5 text-gray-500" />
                </label>
              </div>
              <div className="relative group">
                <img 
                  src={starData?.profilePicture || '/default-avatar.png'} 
                  alt="Profile" 
                  className="w-40 h-40 rounded-full object-cover shadow-lg ring-4 ring-gray-50 transition-transform group-hover:scale-105" 
                />
                {saving && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Video Introduction */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-700">Video Introduction</p>
                <button
                  onClick={() => handleEdit('media', 'videoIntroduction')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-full"
                >
                  <Upload className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              {editMode['media.videoIntroduction'] ? (
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={editData['media.videoIntroduction'] || ''}
                    onChange={(e) => handleChange('media', 'videoIntroduction', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter YouTube video URL"
                  />
                  <button
                    onClick={() => handleSave('media', 'videoIntroduction')}
                    className="p-1 hover:bg-green-100 rounded-full text-green-600"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleCancel('media', 'videoIntroduction')}
                    className="p-1 hover:bg-red-100 rounded-full text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  {starData?.videoIntroduction && (
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={getYouTubeEmbedUrl(starData.videoIntroduction)}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-lg shadow-md"
                      ></iframe>
                    </div>
                  )}
                  <a
                    href={starData?.videoIntroduction}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-2"
                  >
                    <span className="mr-2">Watch Video</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-transform hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 flex items-center">
            <span>Social Media Links</span>
            <div className="ml-auto text-sm text-gray-500">Hover to edit</div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {starData?.socialMediaLinks && Object.entries(starData.socialMediaLinks).map(([platform, url]) => (
              <div key={platform} className="space-y-2 relative group">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-700 capitalize">{platform}</p>
                  <button
                    onClick={() => handleEdit('social', `socialMediaLinks.${platform}`)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                {editMode[`social.socialMediaLinks.${platform}`] ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={editData[`social.socialMediaLinks.${platform}`] || url || ''}
                      onChange={(e) => handleChange('social', `socialMediaLinks.${platform}`, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Enter ${platform} URL`}
                    />
                    <button
                      onClick={() => handleSave('social', `socialMediaLinks.${platform}`)}
                      disabled={saving}
                      className="p-1 hover:bg-green-100 rounded-full text-green-600 disabled:opacity-50"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleCancel('social', `socialMediaLinks.${platform}`)}
                      disabled={saving}
                      className="p-1 hover:bg-red-100 rounded-full text-red-600 disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 transition-colors flex items-center group"
                  >
                    <span className="truncate">{url}</span>
                    <svg className="w-4 h-4 ml-2 flex-shrink-0 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <p className="text-gray-400 italic">No URL provided</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Advertising Images */}
        <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 flex items-center">
            <span>Advertising Images</span>
            <div className="ml-auto text-sm text-gray-500">Hover to edit</div>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {starData?.advertisingImages && (editData['advertising.image'] || starData.advertisingImages).map((imageUrl, index) => (
              <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg">
                <img
                  src={imageUrl}
                  alt={`Advertising ${index + 1}`}
                  className="w-full h-48 object-cover shadow-md transition-all duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                  {editMode[`advertising.image.${index}`] ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="url"
                        value={editData[`advertising.image.${index}`] || imageUrl}
                        onChange={(e) => handleChange('advertising', `image.${index}`, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Enter image URL"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleSave('advertising', `image.${index}`)}
                          disabled={saving}
                          className="p-1.5 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCancel('advertising', `image.${index}`)}
                          disabled={saving}
                          className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-white">
                      <button
                        onClick={() => handleEdit('advertising', `image.${index}`)}
                        className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const newImages = [...starData.advertisingImages];
                          newImages.splice(index, 1);
                          handleChange('advertising', 'advertisingImages', newImages);
                          handleSave('advertising', 'advertisingImages');
                        }}
                        className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
