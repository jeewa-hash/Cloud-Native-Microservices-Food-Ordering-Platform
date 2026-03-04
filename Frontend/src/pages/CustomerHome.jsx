import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, User, LogOut, Menu, X, Store,Clock } from 'lucide-react';
import ShoppingItems from '../components/ShoppingItems';
import ShopList from '../components/ShopList';

const CustomerHome = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('shopping-items');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { id: 'shopping-items', label: 'Shopping Items', icon: ShoppingBag },
        { id: 'shops', label: 'Shopes', icon: Store },
        { id: 'cart', label: 'My Cart', icon: ShoppingCart },
        { id: 'profile', label: 'Manage Profile', icon: User },
        { id: 'orders', label: 'Track Orders', icon: Clock },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'shopping-items':
                return <ShoppingItems />;
            case 'shops':
                if (selectedShop) {
                    return (
                        <ShoppingItems
                            shopId={selectedShop.id}
                            shopName={selectedShop.name}
                            onBack={() => setSelectedShop(null)}
                        />
                    );
                }
                return <ShopList onShopSelect={(shop) => setSelectedShop(shop)} />;
            case 'cart':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">My Cart</h2>
                        <p className="text-gray-500">View and manage items in your shopping cart.</p>
                        {/* Cart component will go here */}
                    </div>
                );
            case 'profile':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Profile</h2>
                        <p className="text-gray-500">Customer details and profile management will go here.</p>
                        {/* Profile component will go here */}
                    </div>
                );
             case 'orders':
            // Navigate to Order History page
            navigate('/order-history');
            return null;
        default:
            return null;
    }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-30 h-screen w-72 bg-white border-r border-gray-200 
                transform transition-transform duration-300 ease-in-out flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-600 p-2 rounded-xl">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">E Com</span>
                    </div>
                    <button
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    if (item.id !== 'shops') {
                                        setSelectedShop(null); // Reset selected shop when navigating away
                                    }
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                    ? 'bg-orange-50 text-orange-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-600' : 'text-gray-400'}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
                {/* Header for mobile */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 w-full shrink-0">
                    <div className="flex items-center gap-2">
                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="lg:hidden flex items-center gap-2">
                            <ShoppingBag className="w-6 h-6 text-orange-600" />
                            <span className="text-lg font-bold text-gray-900">E Com</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 md:p-8 lg:p-12 w-full max-w-7xl mx-auto flex-1 overflow-y-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default CustomerHome;
