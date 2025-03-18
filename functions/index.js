const functions = require('./stripe-payment');

// Export all functions
module.exports = {
  createPaymentIntent: functions.createPaymentIntent,
  stripeWebhook: functions.stripeWebhook
};