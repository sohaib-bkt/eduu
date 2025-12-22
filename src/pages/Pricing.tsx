import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    const plans = [
        {
            name: 'Free',
            price: '0',
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
            price: '9.99',
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
            ctaLink: '/register',
            highlighted: false,
        },
        {
            name: 'Pro',
            price: '24.99',
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
            ctaLink: '/register',
            highlighted: true,
        },
        {
            name: 'Premium',
            price: '49.99',
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
            highlighted: false,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 pt-20">
            {/* Header */}
            <section className="py-16 sm:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h1 className="text-5xl lg:text-6xl font-bold">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary to-blue-600 dark:from-white dark:via-primary dark:to-blue-400">
                                Simple, Transparent Pricing
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Choose the perfect plan for your learning goals. Start free, upgrade anytime, cancel anytime.
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex justify-center pt-4">
                            <div className="inline-flex items-center gap-4 bg-secondary/50 p-1 rounded-full border border-border/30">
                                <button className="px-6 py-2 rounded-full font-medium text-foreground bg-white dark:bg-gray-800 shadow-sm">
                                    Monthly
                                </button>
                                <button className="px-6 py-2 rounded-full font-medium text-muted-foreground hover:text-foreground transition-colors">
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
                                className={`relative rounded-2xl transition-all ${
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
                                            <span className="text-5xl font-bold">${plan.price}</span>
                                            <p className="text-muted-foreground text-sm">{plan.period}</p>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <Link
                                        to={plan.ctaLink}
                                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all text-center flex items-center justify-center gap-2 ${
                                            plan.highlighted
                                                ? 'bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg hover:shadow-primary/30'
                                                : 'bg-secondary text-foreground hover:bg-secondary/80'
                                        }`}
                                    >
                                        {plan.cta}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>

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
