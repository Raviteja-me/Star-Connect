import React from 'react';
import { CheckCircle } from 'lucide-react';

const BookingConfirmationPage = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
        <p className="text-lg mb-8">
          Thank you for booking with StarConnect. Your booking details have been sent to your email.
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          We look forward to providing you with an unforgettable experience!
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
