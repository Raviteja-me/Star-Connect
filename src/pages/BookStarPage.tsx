import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Search, Filter, Star } from 'lucide-react';
    import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
    import { db } from '../config/firebase';

    const BookStarPage = () => {
      const navigate = useNavigate();
      const [selectedCategory, setSelectedCategory] = useState('All Categories');
      const [searchQuery, setSearchQuery] = useState('');
      const [categories, setCategories] = useState([]);
      const [stars, setStars] = useState([]);
      const [loading, setLoading] = useState(true);
      const [filteredStars, setFilteredStars] = useState([]);
      const [error, setError] = useState(null); // Add error state

      useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          setError(null); // Clear any previous errors
          try {
            const starsRef = collection(db, 'stars');
            const starsSnapshot = await getDocs(starsRef);

            console.log("Raw Firestore snapshot:", starsSnapshot);

            const starsData = starsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            console.log("Stars data:", starsData);

            const uniqueCategories = [
              'All Categories',
              ...new Set(starsData.map((star) => star.category)),
            ];
            console.log("Unique categories:", uniqueCategories);

            setCategories(uniqueCategories);
            setStars(starsData);

            // Fetch and log a specific star document (REPLACE 'your_star_id' with an actual ID)
            const testStarRef = doc(db, 'stars', 'your_star_id'); // IMPORTANT: Change 'your_star_id'
            const testStarSnap = await getDoc(testStarRef);
            if (testStarSnap.exists()) {
              console.log("Test Star Data:", testStarSnap.data());
            } else {
              console.log("No such document!");
            }


            let filtered = starsData;
            if (selectedCategory !== 'All Categories') {
              filtered = filtered.filter((star) => star.category === selectedCategory);
            }
            if (searchQuery) {
              filtered = filtered.filter((star) =>
                star.name.toLowerCase().includes(searchQuery.toLowerCase())
              );
            }
            setFilteredStars(filtered);

          } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message); // Set the error message
          } finally {
            setLoading(false);
          }
        };

        fetchData();
      }, [selectedCategory, searchQuery]);

      if (loading) {
        return (
          <div className="max-w-7xl mx-auto px-4 py-8 text-gray-900 dark:text-gray-100 flex justify-center items-center">
            <p>Loading...</p>
          </div>
        );
      }

      if (error) {
        return (
          <div className="max-w-7xl mx-auto px-4 py-8 text-gray-900 dark:text-gray-100 flex justify-center items-center">
            <p>Error: {error}</p>
          </div>
        );
      }

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
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                  <Filter className="w-5 h-5" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Display Categories */}
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {categories.map((category) => (
              category !== 'All Categories' &&
              <div
                key={category}
                className="flex items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                onClick={() => setSelectedCategory(category)}
              >
                <Star className="w-6 h-6 mr-2 text-yellow-400" />
                <span className="text-lg font-semibold">{category}</span>
              </div>
            ))}
          </div>

          {/* Display Stars */}
          <h2 className="text-2xl font-semibold mb-4">Available Stars</h2>

          {/* Hardcoded Star Card (for testing) */}
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition">
            <img
              src="https://via.placeholder.com/150" // Replace with a placeholder image URL
              alt="Test Star"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold dark:text-white">
                  Test Star
                </h3>
                <span className="bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded text-sm">
                  Test Category
                </span>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-yellow-400">★</span>
                <span className="ml-1 dark:text-gray-300">4.8</span>
                <span className="text-gray-400 dark:text-gray-400 ml-1">(156 reviews)</span>
              </div>
              <p className="text-indigo-600 dark:text-indigo-400 font-semibold">$1000/hour</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStars.length === 0 ? (
              <p>No stars found for the selected category.</p>
            ) : (
              filteredStars.map((star) => (
                <div
                  key={star.id}
                  onClick={() => navigate(`/star/${star.id}`)}
                  className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition"
                >
                  <img
                    src={star.imageURL}
                    alt={star.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold dark:text-white">
                        {star.name}
                      </h3>
                      <span className="bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded text-sm">
                        {star.category}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 dark:text-gray-300">
                        {/* You might want to store ratings in Firestore too */}
                        {4.8}
                      </span>
                      <span className="text-gray-400 dark:text-gray-400 ml-1">
                        ({156} reviews)
                      </span>
                    </div>
                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      {/* And prices */}
                      {star.price || '$1000/hour'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    };

    export default BookStarPage;
