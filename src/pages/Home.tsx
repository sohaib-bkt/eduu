import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, Users, TrendingUp, Sparkles, BookOpen, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function Home() {
    return (
        <div className="overflow-hidden bg-gradient-to-b from-background via-background to-primary/5">
            {/* Hero Section */}
            <section className="relative pt-20 pb-40 lg:pt-40 lg:pb-56">
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="space-y-8"
                        >
                            <motion.div variants={item} className="space-y-6">
                                <div className="inline-block">
                                    <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
                                        ✨ Interactive Learning Platform
                                    </span>
                                </div>
                                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary to-blue-600 dark:from-white dark:via-primary dark:to-blue-400">
                                        Master University Courses
                                    </span>
                                    <br />
                                    <span className="text-foreground">with AI-Powered Learning</span>
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                                    Animated videos, interactive quizzes, and personalized learning paths designed specifically for university students. Master complex subjects in half the time.
                                </p>
                            </motion.div>

                            <motion.div
                                variants={item}
                                className="flex flex-col sm:flex-row gap-4 pt-4"
                            >
                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-primary rounded-full hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transform hover:-translate-y-1 group"
                                >
                                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/courses"
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-foreground bg-secondary/80 rounded-full hover:bg-secondary transition-all border border-border/50"
                                >
                                    <Play className="mr-2 h-5 w-5" />
                                    Explore Courses
                                </Link>
                            </motion.div>

                            {/* Stats */}
                            <motion.div variants={item} className="grid grid-cols-3 gap-6 pt-8">
                                {[
                                    { number: '50K+', label: 'Students' },
                                    { number: '200+', label: 'Courses' },
                                    { number: '98%', label: 'Success Rate' },
                                ].map((stat, idx) => (
                                    <div key={idx} className="text-center">
                                        <p className="text-3xl font-bold text-primary">{stat.number}</p>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Right Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative w-full h-[500px]">
                                {/* Gradient background for illustration area */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-500/5 to-transparent rounded-2xl border border-border/50 overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center space-y-6 p-8">
                                            <div className="flex justify-center gap-4">
                                                <motion.div
                                                    animate={{ y: [0, -10, 0] }}
                                                    transition={{ duration: 3, repeat: Infinity }}
                                                    className="w-20 h-20 bg-gradient-to-br from-primary to-blue-500 rounded-2xl flex items-center justify-center shadow-lg"
                                                >
                                                    <Play className="w-10 h-10 text-white" />
                                                </motion.div>
                                                <motion.div
                                                    animate={{ y: [0, 10, 0] }}
                                                    transition={{ duration: 3, repeat: Infinity }}
                                                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
                                                >
                                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                                </motion.div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="font-semibold text-lg">Interactive Learning</p>
                                                <p className="text-sm text-muted-foreground">Real-time feedback and progress tracking</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating cards */}
                                <motion.div
                                    animate={{ y: [0, 20, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute -bottom-12 -right-12 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-border"
                                >
                                    <p className="text-sm font-semibold">📈 95% Pass Rate</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 bg-gradient-to-b from-transparent via-secondary/30 to-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">Why Choose Edubloom?</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Proven features designed to help you succeed in your studies
                        </p>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                title: 'Animated Videos',
                                desc: 'Complex concepts simplified with engaging animations and visual explanations.',
                                icon: <Play className="h-6 w-6" />,
                                color: 'from-blue-500 to-cyan-500'
                            },
                            {
                                title: 'AI-Powered Quizzes',
                                desc: 'Personalized assessments that adapt to your learning pace and style.',
                                icon: <Sparkles className="h-6 w-6" />,
                                color: 'from-purple-500 to-pink-500'
                            },
                            {
                                title: '24/7 Expert Support',
                                desc: 'Get help with assignments, exams, and your academic journey anytime.',
                                icon: <Users className="h-6 w-6" />,
                                color: 'from-green-500 to-emerald-500'
                            },
                            {
                                title: 'Live Progress Tracking',
                                desc: 'Real-time analytics showing exactly where you stand and what to improve.',
                                icon: <TrendingUp className="h-6 w-6" />,
                                color: 'from-yellow-500 to-orange-500'
                            },
                            {
                                title: 'Downloadable Materials',
                                desc: 'Study notes, PDFs, and resources ready for offline learning.',
                                icon: <BookOpen className="h-6 w-6" />,
                                color: 'from-indigo-500 to-blue-500'
                            },
                            {
                                title: 'Certificates & Records',
                                desc: 'Earn recognized certificates to boost your academic profile.',
                                icon: <Award className="h-6 w-6" />,
                                color: 'from-rose-500 to-red-500'
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={item}
                                whileHover={{ y: -8 }}
                                className="group p-8 bg-card rounded-2xl shadow-sm border border-border/50 hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                            >
                                <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">How It Works</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Simple steps to start your learning journey
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { number: '1', title: 'Sign Up', desc: 'Create your free account in seconds' },
                            { number: '2', title: 'Choose Course', desc: 'Browse from 200+ university courses' },
                            { number: '3', title: 'Learn & Practice', desc: 'Watch videos, take quizzes, track progress' },
                            { number: '4', title: 'Achieve Goals', desc: 'Master concepts and earn certificates' }
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                {idx < 3 && (
                                    <div className="hidden md:block absolute top-12 -right-3 w-6 h-1 bg-gradient-to-r from-primary to-blue-600" />
                                )}
                                <div className="text-center space-y-4">
                                    <div className="inline-flex h-16 w-16 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white text-2xl font-bold items-center justify-center shadow-lg">
                                        {step.number}
                                    </div>
                                    <h3 className="text-xl font-bold">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-32 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">Loved by Students</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            See what successful learners say about Edubloom
                        </p>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                name: 'Sarah Ahmed',
                                role: 'Engineering Student',
                                content: 'Edubloom helped me understand calculus like never before. The animated explanations made complex concepts crystal clear!',
                                avatar: '👩‍🎓'
                            },
                            {
                                name: 'Marcus Chen',
                                role: 'Pre-Med Student',
                                content: 'The AI quizzes are amazing. They show exactly what I need to work on. My grades improved by 30% in just 3 months.',
                                avatar: '👨‍🎓'
                            },
                            {
                                name: 'Emma Wilson',
                                role: 'Business Student',
                                content: 'Best investment in my education. The certificates are recognized by employers. Highly recommend!',
                                avatar: '👩‍💼'
                            }
                        ].map((testimonial, idx) => (
                            <motion.div
                                key={idx}
                                variants={item}
                                className="p-8 bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <span className="text-4xl">{testimonial.avatar}</span>
                                    <div>
                                        <p className="font-bold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                                <div className="mt-4 flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400">★</span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-gradient-to-r from-primary/10 via-blue-500/5 to-transparent">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-5xl lg:text-6xl font-bold">
                            Ready to Transform Your Learning?
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Join 50,000+ students already mastering their courses with Edubloom
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary rounded-full hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 hover:shadow-2xl"
                            >
                                Start Your Free Trial
                            </Link>
                            <Link
                                to="/pricing"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-primary text-primary rounded-full hover:bg-primary/10 transition-all"
                            >
                                View Pricing
                            </Link>
                        </div>
                        <p className="text-sm text-muted-foreground">No credit card required • Cancel anytime • 30-day money back guarantee</p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
