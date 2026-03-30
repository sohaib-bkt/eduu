import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import NotificationCenter from './NotificationCenter';

import type { Session } from '@supabase/supabase-js';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user?.id) {
                checkAdminRole(session.user.id);
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user?.id) {
                checkAdminRole(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkAdminRole = async (userId: string) => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            setIsAdmin(data?.role === 'admin');
        } catch (err) {
            setIsAdmin(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
        setIsOpen(false);
    };

    const navLinks = [
        { name: 'Courses', path: '/courses' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'About', path: '/about' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-lg'
                    : 'bg-background/70 backdrop-blur-md border-b border-border/30'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="bg-gradient-to-br from-primary to-blue-600 text-white p-2 rounded-xl group-hover:scale-110 transition-transform">
                            <BookOpen size={24} />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                                Edubloom
                            </span>
                            <p className="text-xs text-muted-foreground -mt-1">Learn Smarter</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {!session && navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    isActive(link.path)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        {session ? (
                            <div className="flex items-center space-x-4">
                                <NotificationCenter userId={session.user.id} />
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                                            isActive('/admin')
                                                ? 'bg-amber-500/20 text-amber-600'
                                                : 'text-muted-foreground hover:text-amber-600 hover:bg-amber-50'
                                        }`}
                                    >
                                        <Settings size={18} />
                                        <span className="font-medium">Admin</span>
                                    </Link>
                                )}
                                <Link
                                    to="/subscription"
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                                        isActive('/subscription')
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-secondary text-foreground hover:bg-secondary/80'
                                    }`}
                                >
                                    <Settings size={18} />
                                    <span className="font-medium">Manage Subscription</span>
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className={`flex items-center space-x-2 px-5 py-2 rounded-full transition-all ${
                                        isActive('/dashboard')
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-secondary text-foreground hover:bg-secondary/80'
                                    }`}
                                >
                                    <User size={18} />
                                    <span className="font-medium">Dashboard</span>
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                    title="Sign out"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                                        isActive('/login')
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                    }`}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-blue-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-all"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden border-t border-border bg-background/95 backdrop-blur-md"
                    >
                        <div className="px-4 py-6 space-y-3 sm:px-6">
                            {!session && navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                                        isActive(link.path)
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-foreground hover:bg-secondary/50'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {session && isAdmin && (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                                        isActive('/admin')
                                            ? 'bg-amber-500/20 text-amber-600'
                                            : 'text-foreground hover:bg-amber-50'
                                    }`}
                                >
                                    <Settings size={18} />
                                    Admin Panel
                                </Link>
                            )}

                            <div className="pt-4 border-t border-border/30 space-y-3">
                                {session ? (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsOpen(false)}
                                            className="block px-4 py-3 rounded-lg font-medium text-foreground hover:bg-secondary/50 transition-all"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                            }}
                                            className="w-full text-left px-4 py-3 rounded-lg font-medium text-destructive hover:bg-destructive/10 transition-all"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full text-center px-4 py-3 border border-primary/30 rounded-lg font-medium text-foreground hover:bg-primary/10 transition-all"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full text-center px-4 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
