import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

const categories = [
  'All Categories',
  'Musicians',
  'Actors',
  'Athletes',
  'Influencers'
];

const stars = [
  {
    id: 1,
    name: 'John Smith',
    category: 'Musicians',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800',
    price: '$1000/hour',
    rating: 4.8,
    reviews: 156
  },
  // Add more stars here...
];

const BookStarPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stars..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
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
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold dark:text-white">{star.name}</h3>
                <span className="bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded text-sm">
                  {star.category}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-yellow-400">★</span>
                <span className="ml-1 dark:text-gray-300">{star.rating}</span>
                <span className="text-gray-400 dark:text-gray-400 ml-1">({star.reviews} reviews)</span>
              </div>
              <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{star.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookStarPage;
