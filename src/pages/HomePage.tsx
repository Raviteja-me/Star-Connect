import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mic, Music, Headphones, Guitar, Search, Calendar, CreditCard, Star, Shield, Clock, Users, Award, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import Logo from '../components/Logo';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const categories = [
  { id: 'All Categories', name: 'All Categories', icon: Star, color: 'bg-purple-500' },
  { id: 'Pop Singer', name: 'Pop Singer', icon: Mic, color: 'bg-blue-500' },
  { id: 'DJ', name: 'DJ', icon: Headphones, color: 'bg-green-500' },
  { id: 'Band', name: 'Band', icon: Users, color: 'bg-pink-500' },
  { id: 'Hip-Hop Artist', name: 'Hip-Hop Artist', icon: Mic, color: 'bg-red-500' }  // Added new category
];

const featuredStars = [
  {
    id: 1,
    name: 'John Smith',
    category: 'Musicians',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800',
    price: '$1000/hour'
  },
  {
    id: 2,
    name: 'Emma Davis',
    category: 'Actors',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800',
    price: '$1500/hour'
  },
  {
    id: 3,
    name: 'Michael Jordan',
    category: 'Athletes',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800',
    price: '$2000/hour'
  },
];

const steps = [
  {
    title: 'Browse & Discover',
    description: 'Explore profiles of top artists, bands, and entertainers.',
    icon: Search,
    color: 'bg-blue-500'
  },
  {
    title: 'Book & Customize',
    description: 'Select your favorite star and personalize the booking.',
    icon: Calendar,
    color: 'bg-green-500'
  },
  {
    title: 'Secure Payment',
    description: 'Pay safely through our platform.',
    icon: CreditCard,
    color: 'bg-purple-500'
  },
  {
    title: 'Enjoy the Experience',
    description: 'Sit back and enjoy an unforgettable event.',
    icon: Star,
    color: 'bg-pink-500'
  }
];

const benefits = [
  {
    title: 'Verified Artists & Secure Payments',
    description: 'All artists are verified and payments are protected.',
    icon: Shield,
    color: 'bg-indigo-500'
  },
  {
    title: 'Fast & Easy Booking',
    description: 'Book your favorite artist in minutes.',
    icon: Clock,
    color: 'bg-green-500'
  },
  {
    title: 'Customizable Experiences',
    description: 'Personalize your event exactly how you want it.',
    icon: Users,
    color: 'bg-purple-500'
  },
  {
    title: 'Exclusive Talent',
    description: 'Access to top-tier artists for any occasion.',
    icon: Award,
    color: 'bg-blue-500'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    event: 'Wedding Reception',
    rating: 5,
    comment: 'Amazing experience! The booking process was smooth and the artist exceeded our expectations.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400'
  },
  {
    name: 'David Chen',
    event: 'Corporate Event',
    rating: 5,
    comment: 'Professional service from start to finish. Will definitely use StarConnect again!',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400'
  }
];

const faqs = [
  {
    question: 'How do I book an artist?',
    answer: 'Simply browse our catalog, select your preferred artist, choose your date and time, and complete the booking process through our secure platform.'
  },
  {
    question: 'What if an artist cancels?',
    answer: 'We offer full refunds for artist cancellations and will help you find a suitable replacement immediately.'
  },
  {
    question: 'How do artists get paid?',
    answer: 'Artists receive payment through our secure platform after the event is successfully completed.'
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [featuredStars, setFeaturedStars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedStars = async () => {
      try {
        const starsRef = collection(db, 'stars');
        const querySnapshot = await getDocs(starsRef);
        const starsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Get only first 3 stars for featured section
        setFeaturedStars(starsData.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured stars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedStars();
  }, []);

  const handleActionClick = (path: string) => {
    if (user) {
      navigate(path);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="mb-8 flex justify-center">
            <Logo size="lg" animated />
          </div>
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">Experience Unforgettable Moments with Your Favorite Rock Stars</h1>
          <p className="text-xl mb-8 animate-fade-in-delay">Book personalized experiences.</p>
          <div className="flex justify-center gap-4 animate-fade-in-delay-2">
            <button 
              onClick={() => handleActionClick('/book-star')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105"
            >
              Book a Star
            </button>
            <button
              onClick={() => handleActionClick('/register-star')}
              className="bg-white hover:bg-gray-100 text-indigo-600 px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105"
            >
              Register as a Star
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleActionClick(`/category/${category.id}`)}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6 cursor-pointer transform hover:scale-105 transition"
              >
                <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold dark:text-white">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stars Section */}
      <section className="py-16 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Featured Stars</h2>
          {loading ? (
            <div className="text-center">Loading featured stars...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredStars.map((star) => (
                <div
                  key={star.id}
                  onClick={() => handleActionClick(`/star/${star.id}`)}
                  className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition"
                >
                  <img src={star.profilePicture} alt={star.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{star.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{star.category}</p>
                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold">${star.hourlyRate}/hour</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose StarConnect Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Why Choose StarConnect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6">
                <div className={`${benefit.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h3 className="font-semibold dark:text-white">{testimonial.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{testimonial.event}</p>
                  </div>
                </div>
                <div className="flex mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300">{testimonial.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-6 bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AuthModal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default HomePage;
