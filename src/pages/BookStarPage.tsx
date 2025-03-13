import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Music, Film, Radio, Mic, Users } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const categories = [
  { name: 'All Categories', icon: Star },
  { name: 'Pop Singer', icon: Mic },
  { name: 'DJ', icon: Radio },
  { name: 'Band', icon: Users },
  { name: 'Hip-Hop Artist', icon: Mic }  // Added new category
];

const BookStarPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        console.log('Starting to fetch stars...');
        const starsRef = collection(db, 'stars');
        console.log('Stars collection reference:', starsRef);
        
        const querySnapshot = await getDocs(collection(db, 'stars'));
        console.log('Query snapshot:', querySnapshot.size, 'documents found');
        
        const starsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Processing star document:', doc.id, data);
          return {
            id: doc.id,
            name: data.name || 'Unknown',
            category: data.category || 'Uncategorized',
            hourlyRate: data.hourlyRate || '0',
            profilePicture: data.profilePicture || '',
            advertisingImages: data.advertisingImages || [],
            experience: data.experience || '0',
          };
        });
        
        console.log('Final processed stars data:', starsData);
        setStars(starsData);
      } catch (error) {
        console.error('Error fetching stars:', error);
        setError('Failed to load stars. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStars();
  }, []);

  const filteredStars = stars.filter(star => {
    const matchesCategory = selectedCategory === 'All Categories' || star.category === selectedCategory;
    const matchesSearch = star.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         star.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setSelectedCategory(name)}
              className={`flex flex-col items-center p-4 rounded-lg transition ${
                selectedCategory === name
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-8 h-8 mb-2" />
              <span className="text-sm text-center">{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search stars..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stars Grid */}
      {loading ? (
        <div className="text-center py-8 dark:text-white">Loading stars...</div>
      ) : filteredStars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStars.map((star) => (
            <div
              key={star.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition"
              onClick={() => navigate(`/star/${star.id}`)}
            >
              <img
                src={star.profilePicture || star.advertisingImages?.[0] || '/default-avatar.png'}
                alt={star.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/default-avatar.png';
                }}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{star.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{star.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-600 dark:text-indigo-400">${star.hourlyRate}/hour</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">{star.experience} years exp.</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 dark:text-white">
          No stars found. Try adjusting your search or category filter.
        </div>
      )}
    </div>
  );
};

export default BookStarPage;