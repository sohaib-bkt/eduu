import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function Pricing() {
    const [billingMonthly, setBillingMonthly] = useState(true);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const plans = [
        {
            name: 'Free',
            monthly: 0,
            period: 'Forever',
            description: 'Perfect for exploring Edubloom',
            features: [
                { name: 'Access to 5+ free courses', included: true },
                { name: 'Basic course materials', included: true },
                { name: 'Community support', included: true },
                { name: 'Certificate of completion', included: false },
                { name: 'All premium courses', included: false },
                { name: 'AI-powered quizzes', included: false },
                { name: '24/7 expert support', included: false },
                { name: 'Downloadable materials', included: false },
            ],
            cta: 'Get Started Free',
            ctaLink: '/register',
            highlighted: false,
        },
        {
            name: 'Starter',
            monthly: 9.99,
            period: 'per month',
            description: 'Great for focused learning',
            features: [
                { name: 'Access to 5+ free courses', included: true },
                { name: 'Basic course materials', included: true },
                { name: 'Community support', included: true },
                { name: 'Certificate of completion', included: true },
                { name: 'All premium courses', included: true },
                { name: 'AI-powered quizzes', included: false },
                { name: '24/7 expert support', included: false },
                { name: 'Downloadable materials', included: false },
            ],
            cta: 'Start Free Trial',
            isPaid: true,
            highlighted: false,
        },
        {
            name: 'Pro',
            monthly: 24.99,
            period: 'per month',
            description: 'Best for serious learners',
            features: [
                { name: 'Access to 5+ free courses', included: true },
                { name: 'Basic course materials', included: true },
                { name: 'Community support', included: true },
                { name: 'Certificate of completion', included: true },
                { name: 'All premium courses', included: true },
                { name: 'AI-powered quizzes', included: true },
                { name: '24/7 expert support', included: true },
                { name: 'Downloadable materials', included: true },
            ],
            cta: 'Start Free Trial',
            isPaid: true,
            highlighted: true,
        },
        {
            name: 'Premium',
            monthly: 49.99,
            period: 'per month',
            description: 'Complete learning experience',
            features: [
                { name: 'Access to 5+ free courses', included: true },
                { name: 'Basic course materials', included: true },
                { name: 'Community support', included: true },
                { name: 'Certificate of completion', included: true },
                { name: 'All premium courses', included: true },
                { name: 'AI-powered quizzes', included: true },
                { name: '24/7 expert support', included: true },
                { name: 'Downloadable materials', included: true },
            ],
            cta: 'Contact Sales',
            ctaLink: '/contact',
            isPaid: false, // For premium (enterprise) they just contact
            highlighted: false,
        },
    ];

    const formatPrice = (monthly: number) => {
        if (monthly === 0) return 'Free';
        if (billingMonthly) return `$${monthly.toFixed(2)}`;
        const annual = monthly * 12 * 0.8; // 20% off annual
        return `$${annual.toFixed(2)}`;
    };

    const handleSubscribe = async (plan: any) => {
        // Enforce user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.location.href = '/login?redirect=/pricing';
            return;
        }

        setLoadingPlan(plan.name);
        try {
            const amount = billingMonthly 
                ? plan.monthly * 100 // Stripe expects cents
                : Math.round(plan.monthly * 12 * 0.8 * 100);

            const interval = billingMonthly ? 'month' : 'year';

            const { data, error } = await supabase.functions.invoke('create-checkout', {
                body: {
                    planName: plan.name,
                    amount: amount,
                    interval: interval,
                    successUrl: `${window.location.origin}/dashboard?checkout=success`,
                    cancelUrl: `${window.location.origin}/pricing?checkout=canceled`
                }
            });

            if (error) throw new Error(error.message || 'Error executing checkout');

            if (data?.url) {
                window.location.href = data.url;
            } else {
                throw new Error('Failed to create checkout session.');
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(`Unable to checkout at this time. Please make sure the Edge Function is deployed. Error: ${error.message}`);
        } finally {
            setLoadingPlan(null);
        }
    };

    const periodLabel = billingMonthly ? 'per month' : 'per year (billed annually)';

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-primary/5 pt-20">
            {/* Header */}
            <section className="py-16 sm:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h1 className="text-5xl lg:text-6xl font-bold">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                                Simple, Transparent Pricing
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Choose the perfect plan for your learning goals. Start free, upgrade anytime, cancel anytime.
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex justify-center pt-4">
                            <div className="inline-flex items-center gap-4 bg-secondary/20 p-1 rounded-full border border-border/30">
                                <button
                                    onClick={() => setBillingMonthly(true)}
                                    className={`px-6 py-2 rounded-full font-medium transition-all ${billingMonthly ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-sm' : 'bg-transparent text-gray-700 hover:bg-secondary/40'}`}>
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setBillingMonthly(false)}
                                    className={`px-6 py-2 rounded-full font-medium transition-all ${!billingMonthly ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-sm' : 'bg-transparent text-gray-700 hover:bg-secondary/40'}`}>
                                    Annual
                                    <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Save 20%</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-12 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {plans.map((plan, idx) => (
                            <motion.div
                                key={idx}
                                variants={item}
                                whileHover={{ translateY: plan.highlighted ? -8 : -4 }}
                                className={`relative rounded-2xl transition-all flex flex-col ${
                                    plan.highlighted
                                        ? 'border-2 border-primary shadow-2xl shadow-primary/20 transform md:-translate-y-4'
                                        : 'border border-border/50 shadow-sm hover:shadow-lg'
                                } ${plan.highlighted ? 'bg-card' : 'bg-card'}`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-primary to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                                            MOST POPULAR
                                        </span>
                                    </div>
                                )}

                                <div className="p-8 space-y-8 h-full flex flex-col">
                                    {/* Plan Info */}
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                        <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                                        <div className="space-y-1">
                                            <span className="text-5xl font-bold text-primary">{formatPrice(plan.monthly)}</span>
                                            <p className="text-gray-500 text-sm">{plan.monthly === 0 ? plan.period : periodLabel}</p>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    {plan.isPaid ? (
                                        <button
                                            onClick={() => handleSubscribe(plan)}
                                            disabled={loadingPlan === plan.name}
                                            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all text-center flex items-center justify-center gap-2 ${
                                                plan.highlighted
                                                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg hover:shadow-primary/30'
                                                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                                            }`}
                                        >
                                            {loadingPlan === plan.name ? <Loader2 className="w-5 h-5 animate-spin"/> : plan.cta}
                                            {loadingPlan !== plan.name && <ArrowRight className="h-4 w-4" />}
                                        </button>
                                    ) : (
                                        <Link
                                            to={plan.ctaLink!}
                                            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all text-center flex items-center justify-center gap-2 ${
                                                plan.highlighted
                                                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg hover:shadow-primary/30'
                                                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                                            }`}
                                        >
                                            {plan.cta}
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    )}

                                    {/* Features */}
                                    <div className="border-t border-border/30 pt-8 space-y-4 flex-1">
                                        {plan.features.map((feature, featureIdx) => (
                                            <div key={featureIdx} className="flex items-start gap-3">
                                                {feature.included ? (
                                                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                ) : (
                                                    <X className="h-5 w-5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                                                )}
                                                <span className={feature.included ? 'text-foreground' : 'text-muted-foreground/60 line-through'}>
                                                    {feature.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-secondary/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-muted-foreground">Everything you need to know about our pricing</p>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        {[
                            {
                                question: 'Can I cancel my subscription anytime?',
                                answer: 'Yes! You can cancel your subscription at any time with just one click. No hidden fees, no long-term contracts.'
                            },
                            {
                                question: 'Do you offer a free trial?',
                                answer: 'Absolutely! You get 30 days free with any paid plan. No credit card required to start.'
                            },
                            {
                                question: 'What payment methods do you accept?',
                                answer: 'We accept all major credit cards, PayPal, and more. Your payment information is secure and encrypted.'
                            },
                            {
                                question: 'Can I upgrade or downgrade my plan?',
                                answer: 'Yes, you can change your plan anytime. We\'ll prorate the charges based on your billing cycle.'
                            },
                            {
                                question: 'Is there a money-back guarantee?',
                                answer: 'Yes! If you\'re not satisfied within 30 days, we offer a full refund, no questions asked.'
                            },
                            {
                                question: 'Do students get discounts?',
                                answer: 'We offer 50% off all plans for verified students. Just add your .edu email during signup.'
                            }
                        ].map((faq, idx) => (
                            <motion.div
                                key={idx}
                                variants={item}
                                className="p-6 bg-card rounded-xl border border-border/50 hover:border-primary/50 transition-all"
                            >
                                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                                <p className="text-muted-foreground">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl font-bold">
                            Ready to start learning?
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
                            >
                                Start Your Free Trial
                            </Link>
                            <Link
                                to="/courses"
                                className="px-8 py-4 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/10 transition-all"
                            >
                                Browse Courses
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
