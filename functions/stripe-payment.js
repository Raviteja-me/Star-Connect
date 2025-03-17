const functions = require('firebase-functions');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors')({origin: true});

exports.createPaymentIntent = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      // Validate the request
      if (request.method !== 'POST') {
        return response.status(405).send('Method Not Allowed');
      }

      const { amount } = request.body;
      
      // Create a PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        // Optional metadata
        metadata: {
          integration_check: 'accept_a_payment',
          application: 'star-connect'
        }
      });

      // Return the client secret to the frontend
      return response.status(200).json({ 
        clientSecret: paymentIntent.client_secret 
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return response.status(500).json({ error: error.message });
    }
  });
});

// Optional: Add a webhook handler for Stripe events
exports.stripeWebhook = functions.https.onRequest(async (request, response) => {
  const signature = request.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
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