import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Briefcase, Award, DollarSign, Image, Video, Music, Film, File, PlusCircle } from 'lucide-react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

const RegisterStarPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    experience: '',
    hourlyRate: '',
    profilePicture: '', // Store URL or file
    profilePictureType: 'url', // 'url' or 'file'
    videoIntroduction: '',
    socialMediaLinks: {
      instagram: '',
      twitter: '',
      facebook: '',
      youtube: '',
    },
    governmentId: null, // Store file
    advertisingImages: [], // Store URLs or files
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'governmentId') {
      setFormData((prevData) => ({
        ...prevData,
        governmentId: files[0],
      }));
    } else if (name.startsWith('socialMediaLinks.')) {
      const platform = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        socialMediaLinks: {
          ...prevData.socialMediaLinks,
          [platform]: value,
        },
      }));
    } else if (name === 'profilePictureType') {
      setFormData((prevData) => ({
        ...prevData,
        profilePictureType: value,
        profilePicture: value === 'url' ? '' : null, // Reset profilePicture
      }));
    } else if (name === 'profilePicture') {
      if (formData.profilePictureType === 'file') {
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: files[0],
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: value,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddAdvertisingImage = () => {
    if (formData.advertisingImages.length < 5) {
      setFormData((prevData) => ({
        ...prevData,
        advertisingImages: [...prevData.advertisingImages, { type: 'url', value: '' }],
      }));
    }
  };

  const handleAdvertisingImageChange = (index, e) => {
    const { value, files } = e.target;
    const newAdvertisingImages = [...formData.advertisingImages];

    if (e.target.name === 'advertisingImageType') {
      newAdvertisingImages[index].type = value;
      newAdvertisingImages[index].value = value === 'url' ? '' : null;
    } else {
      if (newAdvertisingImages[index].type === 'file') {
        newAdvertisingImages[index].value = files[0];
      } else {
        newAdvertisingImages[index].value = value;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      advertisingImages: newAdvertisingImages,
    }));
  };

  const handleRemoveAdvertisingImage = (index) => {
    const newAdvertisingImages = [...formData.advertisingImages];
    newAdvertisingImages.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      advertisingImages: newAdvertisingImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!auth.currentUser) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }

    const user = auth.currentUser;
    const storage = getStorage();

    try {
      // Upload Government ID
      let governmentIdUrl = '';
      if (formData.governmentId) {
        const governmentIdRef = ref(storage, `governmentIds/${user.uid}/${formData.governmentId.name}`);
        const snapshot = await uploadBytes(governmentIdRef, formData.governmentId);
        governmentIdUrl = await getDownloadURL(snapshot.ref);
      }

      // Upload Profile Picture
      let profilePictureUrl = formData.profilePicture;
      if (formData.profilePictureType === 'file' && formData.profilePicture) {
        const profilePictureRef = ref(storage, `profilePictures/${user.uid}/${formData.profilePicture.name}`);
        const snapshot = await uploadBytes(profilePictureRef, formData.profilePicture);
        profilePictureUrl = await getDownloadURL(snapshot.ref);
      }

      // Upload Advertising Images
      const advertisingImageUrls = [];
      for (const image of formData.advertisingImages) {
        if (image.type === 'file' && image.value) {
          const imageRef = ref(storage, `advertisingImages/${user.uid}/${image.value.name}`);
          const snapshot = await uploadBytes(imageRef, image.value);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          advertisingImageUrls.push(downloadUrl);
        } else if (image.type === 'url') {
          advertisingImageUrls.push(image.value);
        }
      }

      // Prepare data for Firestore
      const starData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        experience: formData.experience,
        hourlyRate: formData.hourlyRate,
        profilePicture: profilePictureUrl,
        videoIntroduction: formData.videoIntroduction,
        socialMediaLinks: formData.socialMediaLinks,
        governmentId: governmentIdUrl,
        advertisingImages: advertisingImageUrls,
      };

      // Save to Firestore
      await setDoc(doc(db, 'stars', user.uid), starData);
      navigate('/'); // Redirect to home page after successful registration
    } catch (error) {
      console.error('Error registering star:', error);
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">Register as a Star</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Professional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Hip-Hop Artist">Hip-Hop Artist</option>
                  <option value="Pop Singer">Pop Singer</option>
                  <option value="DJ">DJ</option>
                  <option value="Music Band">Music Band</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Years of Experience
              </label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hourly Rate
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media */}
        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4 mb-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="profilePictureType"
                    value="url"
                    checked={formData.profilePictureType === 'url'}
                    onChange={handleChange}
                    className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">URL</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="profilePictureType"
                    value="file"
                    checked={formData.profilePictureType === 'file'}
                    onChange={handleChange}
                    className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Upload</span>
                </label>
              </div>
              <div className="relative">
                {formData.profilePictureType === 'url' ? (
                  <>
                    <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      name="profilePicture"
                      value={formData.profilePicture}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                    />
                  </>
                ) : (
                  <>
                    <File className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="file"
                      name="profilePicture"
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                    />
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Video Introduction URL
              </label>
              <div className="relative">
                <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="videoIntroduction"
                  value={formData.videoIntroduction}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                />
              </div>
            </div>

            {/* Government ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Government ID
              </label>
              <div className="relative">
                <File className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="file"
                  name="governmentId"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Advertising Images */}
        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Advertising Images (Max 5)</h2>
          {formData.advertisingImages.map((image, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image {index + 1}
                </label>
                <div className="flex items-center space-x-4 mb-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`advertisingImageType${index}`}
                      value="url"
                      checked={image.type === 'url'}
                      onChange={(e) => handleAdvertisingImageChange(index, e)}
                      className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">URL</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`advertisingImageType${index}`}
                      value="file"
                      checked={image.type === 'file'}
                      onChange={(e) => handleAdvertisingImageChange(index, e)}
                      className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Upload</span>
                  </label>
                </div>
                <div className="relative">
                  {image.type === 'url' ? (
                    <>
                      <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="url"
                        name={`advertisingImage${index}`}
                        value={image.value}
                        onChange={(e) => handleAdvertisingImageChange(index, e)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                      />
                    </>
                  ) : (
                    <>
                      <File className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="file"
                        name={`advertisingImage${index}`}
                        onChange={(e) => handleAdvertisingImageChange(index, e)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                      />
                    </>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveAdvertisingImage(index)}
                className="text-red-500 hover:text-red-700 mt-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddAdvertisingImage}
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            Add Image
          </button>
        </div>

        {/* Social Media Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instagram
              </label>
              <div className="relative">
                <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="socialMediaLinks.instagram"
                  value={formData.socialMediaLinks.instagram}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Twitter
              </label>
              <div className="relative">
                <Film className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="socialMediaLinks.twitter"
                  value={formData.socialMediaLinks.twitter}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Facebook
              </label>
              <div className="relative">
                <Film className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="socialMediaLinks.facebook"
                  value={formData.socialMediaLinks.facebook}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                YouTube
              </label>
              <div className="relative">
                <Film className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="socialMediaLinks.youtube"
                  value={formData.socialMediaLinks.youtube}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterStarPage;
