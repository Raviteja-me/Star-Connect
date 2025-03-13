import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const starsRef = collection(db, 'stars');
        const q = query(starsRef, where('category', '==', categoryId));
        const querySnapshot = await getDocs(q);
        
        const starsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setStars(starsData);
      } catch (error) {
        console.error('Error fetching stars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStars();
  }, [categoryId]);

  const categoryInfo = {
    'pop-singer': {
      title: 'Pop Singers',
      description: 'Book talented pop singers for your events and performances.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1920'
    },
    'dj': {
      title: 'DJs',
      description: 'Find the perfect DJ for your party or event.',
      image: 'https://images.unsplash.com/photo-1571266866051-47551e216e1c?auto=format&fit=crop&w=1920'
    },
    'band': {
      title: 'Bands',
      description: 'Book amazing bands for live performances.',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920'
    },
    'hip-hop': {
      title: 'Hip-Hop Artists',
      description: 'Connect with talented hip-hop artists for your events.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1920'
    }
  }[categoryId] || { title: '', description: '', image: '' };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        {/* Stats Bar */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-lg shadow-lg p-4 mb-8 flex justify-around items-center relative" style={{ zIndex: 0 }}>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stars.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Available Stars</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              ${Math.min(...stars.map(s => s.hourlyRate || 0)) || 0}/hr
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Starting Price</p>
          </div>
        </div>

        {/* Stars Grid - Enhanced styling */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : stars.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">No Stars Available</h3>
            <p className="text-gray-600 dark:text-gray-400">Check back soon for updates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stars.map((star) => (
              <div
                key={star.id}
                onClick={() => navigate(`/star/${star.id}`)}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative">
                  <img 
                    src={star.profilePicture || star.advertisingImages?.[0] || '/default-avatar.png'} 
                    alt={star.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/default-avatar.png';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-xl font-semibold text-white">{star.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 font-medium">{star.rating || 'New'}</span>
                    </div>
                    <p className="text-indigo-600 dark:text-indigo-400 font-bold">
                      ${star.hourlyRate}/hr
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {star.specialties?.slice(0, 3).map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;