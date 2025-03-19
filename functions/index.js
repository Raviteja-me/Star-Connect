require('dotenv').config();
const functions = require('./stripe-payment');

// Export both functions from a single project
exports.createPaymentIntent = functions.createPaymentIntent;
exports.stripeWebhook = functions.stripeWebhook;
