import { motion } from 'framer-motion';
import { Target, Award, Globe, Heart } from 'lucide-react';
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

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 pt-20">
            {/* Hero Section */}
            <section className="py-16 sm:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h1 className="text-5xl lg:text-6xl font-bold">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary to-blue-600 dark:from-white dark:via-primary dark:to-blue-400">
                                About Edubloom
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            We're revolutionizing education for the 21st century, making quality learning accessible to every student.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
                    >
                        {[
                            {
                                icon: <Target className="w-8 h-8" />,
                                title: 'Our Mission',
                                description: 'To empower every university student with clear, engaging, and interactive learning tools that transform the way they master complex subjects.',
                                color: 'from-blue-500 to-cyan-500'
                            },
                            {
                                icon: <Globe className="w-8 h-8" />,
                                title: 'Our Vision',
                                description: 'A world where quality education is accessible to everyone, everywhere, breaking down barriers and opening doors to unlimited possibilities.',
                                color: 'from-purple-500 to-pink-500'
                            },
                            {
                                icon: <Heart className="w-8 h-8" />,
                                title: 'Our Values',
                                description: 'Excellence, accessibility, innovation, and student-centered design. We believe in transparency, continuous improvement, and supporting every learner.',
                                color: 'from-green-500 to-emerald-500'
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -8 }}
                                className="p-8 bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-lg transition-all"
                            >
                                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-6`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-secondary/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
                            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                                <p>
                                    Edubloom was founded with a simple observation: millions of university students struggle to understand complex concepts taught in traditional lectures. Not because they weren't smart enough, but because the teaching methods weren't engaging or accessible enough.
                                </p>
                                <p>
                                    Our founder, a former engineering professor, saw brilliant students lose confidence in subjects like calculus and physics simply because textbooks and lectures didn't explain concepts visually and interactively. That's when the idea for Edubloom was born.
                                </p>
                                <p>
                                    We combined pedagogy expertise with cutting-edge technology to create a platform where every student can learn at their own pace, with visual explanations, interactive quizzes, and personalized feedback. Today, Edubloom serves over 50,000 students globally, helping them master their courses and achieve their academic goals.
                                </p>
                                <p>
                                    Our mission remains unchanged: make quality education accessible, engaging, and effective for every student who wants to succeed.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">Our Team</h2>
                        <p className="text-xl text-muted-foreground">Passionate educators, engineers, and designers working together</p>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {[
                            {
                                name: 'Dr. Sarah Johnson',
                                role: 'Founder & CEO',
                                bio: 'Former engineering professor with 15+ years of teaching experience',
                                avatar: '👩‍🏫'
                            },
                            {
                                name: 'Marcus Chen',
                                role: 'CTO',
                                bio: 'Tech entrepreneur with expertise in AI and educational technology',
                                avatar: '👨‍💻'
                            },
                            {
                                name: 'Emma Rodriguez',
                                role: 'Head of Curriculum',
                                bio: 'PhD in Education with focus on interactive learning design',
                                avatar: '👩‍🎓'
                            },
                            {
                                name: 'James Wilson',
                                role: 'VP of Operations',
                                bio: 'EdTech industry veteran, scaling products globally',
                                avatar: '👨‍💼'
                            }
                        ].map((member, idx) => (
                            <motion.div
                                key={idx}
                                variants={item}
                                whileHover={{ y: -8 }}
                                className="text-center p-6 bg-card rounded-2xl border border-border/50 hover:shadow-lg transition-all"
                            >
                                <div className="text-6xl mb-4">{member.avatar}</div>
                                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                                <p className="text-primary font-semibold mb-3">{member.role}</p>
                                <p className="text-muted-foreground text-sm">{member.bio}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-r from-primary/10 via-blue-500/5 to-transparent">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {[
                            { number: '50K+', label: 'Active Students' },
                            { number: '200+', label: 'Courses Available' },
                            { number: '50M+', label: 'Minutes Learned' },
                            { number: '98%', label: 'Satisfaction Rate' }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                variants={item}
                                className="text-center"
                            >
                                <p className="text-4xl lg:text-5xl font-bold text-primary mb-2">{stat.number}</p>
                                <p className="text-muted-foreground">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
                        <p className="text-xl text-muted-foreground">Real results from real students</p>
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
                                title: 'Academic Excellence',
                                description: 'Our students improve their GPA by an average of 0.8 points within 6 months.'
                            },
                            {
                                title: 'Time Efficiency',
                                description: 'Students spend 40% less time studying while achieving better understanding and retention.'
                            },
                            {
                                title: 'Career Growth',
                                description: '85% of our users report improved job opportunities thanks to better academic credentials.'
                            },
                            {
                                title: 'Confidence Boost',
                                description: 'Students report 90% increase in confidence when tackling challenging subjects.'
                            },
                            {
                                title: 'Global Reach',
                                description: 'We\'ve helped students in 120+ countries overcome educational barriers.'
                            },
                            {
                                title: 'Equal Opportunity',
                                description: 'Our affordable pricing ensures quality education is accessible to all students.'
                            }
                        ].map((impact, idx) => (
                            <motion.div
                                key={idx}
                                variants={item}
                                className="p-8 bg-card rounded-2xl border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
                            >
                                <Award className="h-8 w-8 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-3">{impact.title}</h3>
                                <p className="text-muted-foreground">{impact.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-20 bg-secondary/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl font-bold">
                            Have Questions? We'd Love to Hear From You
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Get in touch with our team anytime. We're passionate about helping you succeed.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link
                                to="mailto:info@edubloom.com"
                                className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:shadow-lg transition-all"
                            >
                                Send us an Email
                            </Link>
                            <Link
                                to="/"
                                className="px-8 py-4 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/10 transition-all"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
