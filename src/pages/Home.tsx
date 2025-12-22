import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-background to-background" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="mx-auto max-w-3xl text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                                Master University Courses with <span className="text-primary">Interactive Learning</span>
                            </h1>
                            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                                Clear explanations, animated videos, and AI-powered quizzes designed specifically for university students aged 17-25.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-0.5"
                            >
                                Start Learning Now <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                to="/courses"
                                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-foreground bg-secondary rounded-full hover:bg-secondary/80 transition-all"
                            >
                                Explore Courses
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-secondary/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Animated Videos',
                                desc: 'Visual learning that simplifies complex scientific concepts.',
                                icon: <Play className="h-6 w-6 text-primary" />
                            },
                            {
                                title: 'AI Quizzes',
                                desc: 'Personalized assessments to track your progress and understanding.',
                                icon: <CheckCircle2 className="h-6 w-6 text-primary" />
                            },
                            {
                                title: 'Expert Support',
                                desc: 'Get help with your final projects and exam preparations.',
                                icon: <User className="h-6 w-6 text-primary" /> /* User icon placeholder, check imports if needed */
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 bg-card rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow"
                            >
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

// Simple User icon import since I used it above
// Note: I need to verify imports. I imported Play, CheckCircle2 above. I used User in the map but didn't import it. 
// Actually I didn't import User in the top imports. I will fix that in the file content.
// WAIT, I cannot edit the content *while* streaming it to this tool, but I can correct it in the tool argument.
// Correcting imports now.
import { User } from 'lucide-react';
