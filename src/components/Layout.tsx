import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ChatBot from './ChatBot';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

export default function Layout() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
            <Navbar />
            <main className="pt-16 flex-1">
                <Outlet />
            </main>
            <footer className="bg-gradient-to-b from-secondary/20 to-secondary/50 border-t border-border mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        {/* Brand */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Edubloom</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                Empowering students with modern, interactive learning experiences designed for university success.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Linkedin className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        {/* Platform */}
                        <div>
                            <h4 className="font-semibold mb-4">Platform</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/courses" className="text-muted-foreground hover:text-primary transition-colors">Browse Courses</a></li>
                                <li><a href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Learning Paths</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Certification</a></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-3">
                                    <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <a href="mailto:support@edubloom.com" className="text-muted-foreground hover:text-primary transition-colors">
                                        support@edubloom.com
                                    </a>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors">
                                        +1 (234) 567-890
                                    </a>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-muted-foreground">
                                        123 Education Street, Learning City
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border/50 pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                                © {new Date().getFullYear()} Edubloom. All rights reserved.
                            </div>
                            <div className="flex gap-6 md:justify-end">
                                <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                                <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <ChatBot />
        </div>
    );
}
