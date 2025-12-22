import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <Navbar />
            <main className="pt-16">
                <Outlet />
            </main>
            <footer className="bg-secondary/30 mt-20 border-t border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4">Edubloom</h3>
                            <p className="text-muted-foreground text-sm">Empowering students with modern, interactive learning experiences.</p>
                        </div>
                        {/* Add more footer columns as needed */}
                    </div>
                    <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Edubloom. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
