const functions = require('firebase-functions');
const config = functions.config();
const stripe = require('stripe')(config.stripe.secret_key);

const createPaymentIntent = functions
  .runWith({
    enforceAppCheck: false // Disable Firebase App Check
  })
  .https.onRequest(async (request, response) => {
  // Set CORS headers directly
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    response.status(204).send('');
    return;
  
  }

  console.log('Request headers:', request.headers);
  console.log('Request received:', request.body);
  try {
    if (request.method !== 'POST') {
      return response.status(405).send('Method Not Allowed');
    }

    const { amount } = request.body;
    console.log('Amount:', amount);
    console.log('Using Stripe key:', config.stripe.secret_key ? 'Key exists' : 'No key found');

    if (!amount) {
      return response.status(400).json({ error: 'Amount is required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount),
      currency: 'usd',
      payment_method_types: ['card']
    });

    console.log('PaymentIntent created:', paymentIntent.id);
    return response.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Detailed error:', error);
    return response.status(500).json({ 
      error: error.message,
      code: error.code,
      type: error.type
    });
  }
});

// Optional: Add a webhook handler for Stripe events
const stripeWebhook = functions.https.onRequest(async (request, response) => {
  const signature = request.headers['stripe-signature'];
  const webhookSecret = config.stripe.webhook_secret;
  
  try {
    const event = stripe.webhooks.constructEvent(
      request.rawBody,
      signature,
      webhookSecret
    );
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        // Here you could update the user's subscription status in Firestore
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        break;
      // Add other event types as needed
    }
    
    response.status(200).send({received: true});
  } catch (error) {
    console.error('Webhook error:', error);
    response.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = {
  createPaymentIntent,
  stripeWebhook
};