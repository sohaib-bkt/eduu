import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "npm:stripe@^13.0.0"

// Initialize Stripe. We use the fetch http client for Deno compatibility
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { planName, amount, interval, successUrl, cancelUrl } = await req.json()

    if (!planName || amount == null || !interval || !successUrl || !cancelUrl) {
      throw new Error('Missing required checkout parameters.')
    }

    // Determine the interval count based on whether it's billed monthly or annually
    const recurringInterval = interval === 'year' ? 'year' : 'month'

    // Create Checkout Sessions from body params
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Edubloom ${planName} Plan`,
              description: `Access to ${planName} features on Edubloom.`,
            },
            unit_amount: amount, // Amount is expected in cents
            recurring: {
              interval: recurringInterval,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 30,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      // You can also pass customer_email from the auth header if available, but optional
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Checkout session creation error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
