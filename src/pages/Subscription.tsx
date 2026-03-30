import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { createSubscription, getUserSubscription, cancelSubscription } from '../lib/api';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    monthly: 0,
    period: 'Forever',
    description: 'Perfect for exploring Edubloom',
    features: [
      { name: 'Access to free courses', included: true },
      { name: 'Community support', included: true },
      { name: 'Premium course access', included: false },
      { name: 'AI-powered quizzes', included: false },
      { name: 'Priority support', included: false },
    ],
    cta: 'Current Plan',
    isPaid: false,
  },
  {
    name: 'Starter',
    monthly: 9.99,
    period: 'per month',
    description: 'Great for focused learning',
    features: [
      { name: 'All basic and free courses', included: true },
      { name: 'Certificate of completion', included: true },
      { name: 'Premium content', included: true },
      { name: 'AI-powered quizzes', included: false },
      { name: '24/7 expert support', included: false },
    ],
    cta: 'Start Trial',
    isPaid: true,
  },
  {
    name: 'Pro',
    monthly: 24.99,
    period: 'per month',
    description: 'Best for serious learners',
    features: [
      { name: 'All Starter features', included: true },
      { name: 'AI-powered quizzes', included: true },
      { name: '24/7 expert support', included: true },
      { name: 'Downloadable materials', included: true },
    ],
    cta: 'Start Trial',
    isPaid: true,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function SubscriptionPage() {
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        navigate('/login?redirect=/subscription');
        return;
      }

      setUserId(user.id);

      const subscription = await getUserSubscription(user.id);
      setCurrentSubscription(subscription);

      const params = new URLSearchParams(window.location.search);
      const checkoutSuccess = params.get('checkout') === 'success';
      const plan = params.get('plan') || localStorage.getItem('eduu_pending_plan');

      if ((checkoutSuccess || plan) && plan) {
        try {
          await createSubscription(user.id, plan);
          localStorage.removeItem('eduu_pending_plan');
          window.history.replaceState({}, document.title, window.location.pathname);
          setCurrentSubscription(await getUserSubscription(user.id));
        } catch (error) {
          console.error('Error saving subscription after checkout:', error);
        }
      }

      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  const formatPrice = (monthly: number) => {
    if (monthly === 0) return 'Free';
    return `$${monthly.toFixed(2)}`;
  };

  const handleSubscribe = async (plan: any) => {
    if (!userId) return;

    setLoadingPlan(plan.name);

    try {
      localStorage.setItem('eduu_pending_plan', plan.name.toLowerCase());

      const amount = plan.monthly * 100;
      const interval = 'month';

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planName: plan.name,
          amount,
          interval,
          successUrl: `${window.location.origin}/dashboard?checkout=success&plan=${plan.name.toLowerCase()}`,
          cancelUrl: `${window.location.origin}/subscription?checkout=canceled`,
        },
      });

      if (error) throw new Error(error.message || 'Error executing checkout');
      if (!data?.url) throw new Error('Failed to create checkout session.');

      window.location.href = data.url;
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`Unable to checkout at this time. Error: ${error.message}`);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!userId) return;
    setIsCancelling(true);
    try {
      await cancelSubscription(userId);
      const subscription = await getUserSubscription(userId);
      setCurrentSubscription(subscription);
      alert('Subscription canceled. You are now on Free plan.');
    } catch (error: any) {
      console.error('Cancel subscription error:', error);
      alert('Unable to cancel subscription. Please try again later.');
    } finally {
      setIsCancelling(false);
    }
  };

  const activePlan = currentSubscription?.plan_type || 'free';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading subscription details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-primary/5 pt-20 px-4 sm:px-6 lg:px-8">
      <section className="max-w-5xl mx-auto py-10">
        <div className="bg-white rounded-2xl border border-border/30 shadow-sm p-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Manage Subscription</h1>
              <p className="text-sm text-muted-foreground mt-1">Current plan: <strong>{activePlan.toUpperCase()}</strong></p>
              <p className="text-sm text-gray-600 mt-2">You can choose a paid plan to start a 30-day trial. All paid plans are auto-renewing and fully cancellable.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={activePlan === 'free' || isCancelling}
                className={`px-4 py-2 rounded-lg font-semibold transition ${activePlan === 'free' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-destructive text-white hover:bg-destructive/90'}`}
              >
                {isCancelling ? 'Canceling...' : 'Cancel Subscription'}
              </button>
            </div>
          </div>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = activePlan === plan.name.toLowerCase();
            return (
              <motion.div
                key={plan.name}
                variants={item}
                className={`rounded-2xl border p-6 h-full flex flex-col transition-all ${isCurrent ? 'border-primary shadow-lg' : 'border-border/50 shadow-sm hover:shadow-lg'}`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
                <p className="text-4xl font-bold text-primary mb-4">{formatPrice(plan.monthly)}</p>
                <p className="text-sm text-gray-500 mb-6">{plan.monthly === 0 ? plan.period : 'per month (30-day trial)'}</p>

                <div className="space-y-2 mb-5 flex-1">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      {feature.included ? <Check className="w-4 h-4 text-green-500 mt-1" /> : <X className="w-4 h-4 text-muted-foreground/40 mt-1" />}
                      <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground/60 line-through'}`}>{feature.name}</span>
                    </div>
                  ))}
                </div>

                {isCurrent ? (
                  <button disabled className="w-full px-4 py-3 rounded-lg bg-primary text-white font-semibold">Current Plan</button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={!plan.isPaid || loadingPlan === plan.name}
                    className={`w-full px-4 py-3 rounded-lg font-semibold ${plan.isPaid ? 'bg-secondary hover:bg-secondary/90 text-foreground' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
                    {loadingPlan === plan.name ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : plan.cta}
                  </button>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
