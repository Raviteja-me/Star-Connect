import React from 'react';
import { Star, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <Star className="h-6 w-6" />
              <span className="text-xl font-bold">StarConnect</span>
            </div>
            <p className="mt-2 text-gray-400">
              Connect with your favorite stars and create unforgettable moments.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/book-star" className="text-gray-400 hover:text-white">Book a Star</a></li>
              <li><a href="/register-star" className="text-gray-400 hover:text-white">Register as Star</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="/category/musicians" className="text-gray-400 hover:text-white">Musicians</a></li>
              <li><a href="/category/actors" className="text-gray-400 hover:text-white">Actors</a></li>
              <li><a href="/category/athletes" className="text-gray-400 hover:text-white">Athletes</a></li>
              <li><a href="/category/influencers" className="text-gray-400 hover:text-white">Influencers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} StarConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
