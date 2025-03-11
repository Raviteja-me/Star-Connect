import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Filter } from 'lucide-react';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // Mock data - In a real app, this would be filtered based on categoryId
  const stars = [
    {
      id: 1,
      name: 'John Smith',
      category: 'Musicians',
      image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800',
      price: '$1000/hour',
      rating: 4.8,
      reviews: 156,
      specialties: ['Live Performance', 'Guitar', 'Vocals']
    },
    {
      id: 2,
      name: 'Emma Davis',
      category: 'Musicians',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800',
      price: '$1500/hour',
      rating: 4.9,
      reviews: 203,
      specialties: ['Piano', 'Songwriting', 'Voice Training']
    },
    // Add more stars here...
  ];

  const categoryInfo = {
    musicians: {
      title: 'Musicians',
      description: 'Book talented musicians for your events, private performances, or virtual concerts.',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920'
    },
    actors: {
      title: 'Actors',
      description: 'Connect with professional actors for events, workshops, or personalized performances.',
      image: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=1920'
    },
    // Add more categories...
  }[categoryId] || {
    title: 'Category Not Found',
    description: 'Please select a valid category',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920'
  };

  return (
    <div className="text-gray-900 dark:text-gray-100">
      {/* Category Hero */}
      <div className="relative h-[300px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${categoryInfo.image})`
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{categoryInfo.title}</h1>
          <p className="text-lg">{categoryInfo.description}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            <Filter className="w-5 h-5" />
            Price Range
          </button>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            Rating (4+)
          </button>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            Available Today
          </button>
        </div>

        {/* Stars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stars.map((star) => (
            <div
              key={star.id}
              onClick={() => navigate(`/star/${star.id}`)}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition"
            >
              <img src={star.image} alt={star.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{star.name}</h3>
                <div className="flex items-center mb-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="ml-1">{star.rating}</span>
                  <span className="text-gray-400 dark:text-gray-400 ml-1">({star.reviews} reviews)</span>
                </div>
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {star.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{star.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
