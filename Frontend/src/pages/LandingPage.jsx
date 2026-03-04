import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-black overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed w-full flex justify-between items-center py-6 px-10 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                    <div className="bg-orange-600 p-2 rounded-lg">
                        <ShoppingBag className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tighter">E Com</span>
                </div>
                <div className="space-x-8 hidden md:flex font-medium">
                    <a href="#features" className="hover:text-orange-600 transition-colors">Features</a>
                    <a href="#collections" className="hover:text-orange-600 transition-colors">Collections</a>
                </div>
                <div className="space-x-4">
                    <Link to="/login" className="px-5 py-2.5 font-medium hover:text-orange-600 transition-colors">
                        Log In
                    </Link>
                    <Link to="/register" className="bg-black text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-600 transition-colors duration-300">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-32 pb-20 px-10">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 pr-10">
                        <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-medium text-sm">
                            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
                            <span>New Collection 2026</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
                            Elevate Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700">Digital Lifestyle</span>
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
                            Discover curated tech and fashion collections designed for the modern trailblazer. Experience seamless shopping redefined.
                        </p>
                        <div className="flex space-x-4 pt-4">
                            <Link to="/register" className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold flex items-center space-x-2 hover:bg-black transition-all duration-300 shadow-xl shadow-orange-600/20 transform hover:-translate-y-1">
                                <span>Shop Now</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button className="bg-gray-50 text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all border border-gray-200">
                                View Catalog
                            </button>
                        </div>

                        <div className="pt-8 flex items-center space-x-8 border-t border-gray-100">
                            <div>
                                <h4 className="text-3xl font-bold">10k+</h4>
                                <p className="text-gray-500 text-sm">Active Users</p>
                            </div>
                            <div className="w-px h-12 bg-gray-200"></div>
                            <div>
                                <h4 className="text-3xl font-bold space-x-1 flex items-center">
                                    <span>4.9</span>
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                </h4>
                                <p className="text-gray-500 text-sm">Customer Rating</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Elegant Image Placeholder / Hero Art */}
                        <div className="w-full aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden relative shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/40 to-black/5 mix-blend-multiply flex items-center justify-center">
                                <div className="relative w-full h-full p-8 flex flex-col justify-between">
                                    <div className="w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-20 absolute top-10 right-10"></div>
                                    <div className="w-40 h-40 bg-black rounded-full blur-3xl opacity-10 absolute bottom-10 left-10"></div>

                                    {/* Abstract Shopping Interface Elements */}
                                    <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl w-64 self-end mt-10 border border-white/50 transform translate-x-4 -rotate-2">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg mb-3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-black rounded w-1/4"></div>
                                    </div>

                                    <div className="bg-black/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl w-72 text-white border border-gray-800 transform -translate-x-4 rotate-3 mb-10">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-medium">Order #890</span>
                                            <span className="text-orange-500 text-sm">Shipped</span>
                                        </div>
                                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-500 w-2/3"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section id="features" className="py-24 bg-black text-white px-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for Excellence</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">We've stripped away the noise to bring you a shopping experience that focuses purely on quality, speed, and reliability.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="w-8 h-8 text-orange-500" />}
                            title="Lightning Fast"
                            desc="Optimized microservices ensure your cart loads instantly and checkout is frictionless."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="w-8 h-8 text-orange-500" />}
                            title="Secure by Default"
                            desc="Bank-grade JWT authentication and encrypted data keeps your shopping profiles safe."
                        />
                        <FeatureCard
                            icon={<ShoppingBag className="w-8 h-8 text-orange-500" />}
                            title="Smart Cart"
                            desc="Persistent shopping sessions and intelligent inventory management at your fingertips."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Lumière Commerce. Cloud-Native Microservices.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800 hover:border-orange-500/50 transition-colors group">
        <div className="bg-black w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;
