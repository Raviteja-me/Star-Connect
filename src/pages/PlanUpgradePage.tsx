import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_live_51R30jsJIqVbqWMncnbLVJYDJ6smeCGrsMw7AHyxmu354YV7RVWIM00iHD4xq3GCU3iqfwSd7wQ26PWkjzY70gimo00S9GWyhaA');
const CheckoutForm = ({ onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setCardError('');

    try {
      // Call your backend to create a payment intent
      // Update this URL to your deployed cloud function
      // In the handleSubmit function
      const response = await fetch('https://us-central1-lazyowner-7571d.cloudfunctions.net/createPaymentIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: 4900,  // Make sure this is a number
        }),
      });
      
      // Add error logging
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Payment Intent Error:', errorData);
        throw new Error(errorData.error || 'Payment processing failed');
      }

      const data = await response.json();
      
      const cardElement = elements.getElement(CardElement);
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        setCardError(error.message);
        onPaymentError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      onPaymentError('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="block text-gray-700 mb-2 font-medium">Card Details</label>
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
          className="p-3 border border-gray-300 rounded-md"
        />
        {cardError && <div className="text-red-500 mt-2 text-sm">{cardError}</div>}
      </div>
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${processing || !stripe ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {processing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </span>
        ) : (
          <span>Pay $49.00</span>
        )}
      </button>
    </form>
  );
};

const PlanUpgradePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleUpgradePlan = async (paymentIntent) => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Update the user's plan in Firestore
      const starRef = doc(db, 'stars', user.uid);
      await updateDoc(starRef, {
        plan: 'premium',
        planUpdatedAt: new Date().toISOString(),
        paymentId: paymentIntent.id,
        paymentAmount: paymentIntent.amount / 100, // Convert cents to dollars
        paymentDate: new Date().toISOString()
      });
      
      setSuccess(true);
      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Error upgrading plan:', error);
      setError('Failed to upgrade plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const handleInitiatePayment = () => {
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8 text-white">
            <h1 className="text-3xl font-bold mb-4">Upgrade to Premium Plan</h1>
            <p className="text-lg opacity-90">
              Unlock the full potential of Star Connect and grow your audience
            </p>
          </div>
          
          <div className="p-8">
            {success ? (
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Upgrade Successful!</h2>
                <p className="text-green-700 mb-4">You've been upgraded to the Premium Plan. Redirecting to your profile...</p>
              </div>
            ) : showPayment ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Payment</h2>
                <p className="text-gray-600 mb-6">You're just one step away from unlocking all premium features.</p>
                
                {error && <div className="bg-red-50 p-4 rounded-lg text-red-600 mb-6">{error}</div>}
                
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    onPaymentSuccess={handleUpgradePlan}
                    onPaymentError={handlePaymentError}
                  />
                </Elements>
                
                <p className="text-gray-500 mt-6 text-center text-sm">
                  By completing this payment, you agree to our <a href="/terms" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Upgrade to Premium?</h2>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Premium Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-blue-800">Marketing & Promotion</h4>
                      </div>
                      <p className="text-blue-700">We actively promote your profile to potential clients, increasing your visibility and booking opportunities.</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-purple-800">Secure Payment Processing</h4>
                      </div>
                      <p className="text-purple-700">We handle all payment processing securely, ensuring you get paid on time without worrying about fraud or chargebacks.</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-green-800">Fraud Protection</h4>
                      </div>
                      <p className="text-green-700">Our system verifies all clients and bookings, protecting you from scams and ensuring legitimate business opportunities.</p>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="bg-red-100 p-2 rounded-full mr-3">
                          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-red-800">Priority Visibility</h4>
                      </div>
                      <p className="text-red-700">Premium members appear at the top of search results and get featured in our promotional campaigns.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">What We Provide</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">Marketing and promotion to bring clients to the platform</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">Secure payment processing and handling</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">Fraud detection and prevention systems</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">Client verification and vetting</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">Exclusive deals and promotional opportunities</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">24/7 customer support for both you and your clients</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Premium Plan Pricing</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
                      <div>
                        <p className="text-gray-600 mb-2">Monthly subscription</p>
                        <p className="text-4xl font-bold text-gray-800">$49<span className="text-xl text-gray-600">/month</span></p>
                      </div>
                      <p className="text-gray-600 italic mt-2 md:mt-0">Billed monthly, cancel anytime</p>
                    </div>
                    <p className="text-gray-700 mb-6">
                      We only charge stars, not users. This subscription fee covers all the services we provide to help you grow your presence and connect with more clients.
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-blue-100 mb-6">
                      <p className="text-gray-700 font-medium">Why we charge stars and not users:</p>
                      <p className="text-gray-600 mt-2">
                        By charging only stars, we can keep the platform free for users, which means more potential clients for you. Our business model is designed to bring you more bookings and opportunities, making the subscription fee a worthwhile investment in your career.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={handleInitiatePayment}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    Continue to Payment
                  </button>
                  <p className="text-gray-500 mt-4">
                    By upgrading, you agree to our <a href="/terms" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>
                  </p>
                </div>
                
                <div className="mt-12 border-t border-gray-100 pt-8">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Can I cancel my subscription anytime?</h4>
                      <p className="text-gray-600">Yes, you can cancel your premium subscription at any time. Your benefits will continue until the end of your current billing period.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">How will this help me get more clients?</h4>
                      <p className="text-gray-600">Premium members receive priority placement in search results, are featured in our marketing campaigns, and get access to exclusive promotional opportunities that help you stand out to potential clients.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">What payment methods do you accept?</h4>
                      <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for premium subscriptions.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Why do you only charge stars and not users?</h4>
                      <p className="text-gray-600">Our business model is designed to attract as many users as possible to the platform, creating more opportunities for stars. By keeping the platform free for users, we can bring you more potential clients, making the subscription fee a worthwhile investment.</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/profile')} 
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            &larr; Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanUpgradePage;