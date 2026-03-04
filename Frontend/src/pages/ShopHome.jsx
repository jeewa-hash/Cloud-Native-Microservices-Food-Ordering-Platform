import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, PlusCircle, User, LogOut, Menu, X, Store, ClipboardList } from 'lucide-react';
import AddProduct from '../components/AddProduct';
import ProductCatalog from '../components/ProductCatalog';

const ShopHome = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('catalog');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { id: 'catalog', label: 'Product Catalog', icon: Package },
        { id: 'add-product', label: 'Add Products', icon: PlusCircle },
        { id: 'orders', label: 'Orders For Us', icon: ClipboardList },
        { id: 'profile', label: 'Manage Profile', icon: User },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'catalog':
                return (
                    <ProductCatalog
                        onAddProduct={() => {
                            setEditingProduct(null);
                            setActiveTab('add-product');
                        }}
                        onEditProduct={(product) => {
                            setEditingProduct(product);
                            setActiveTab('add-product');
                        }}
                    />
                );
            case 'add-product':
                return (
                    <AddProduct
                        initialData={editingProduct}
                        onProductAdded={() => {
                            setEditingProduct(null);
                            setActiveTab('catalog');
                        }}
                    />
                );
            case 'profile':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Profile</h2>
                        <p className="text-gray-500">Shop details and profile management will go here.</p>
                        {/* Profile form */}
                    </div>
                );
            case 'orders':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Orders For Us</h2>
                        <p className="text-gray-500">Manage incoming orders here.</p>
                    </div>
                );
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
                            <Store className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Shop Dashboard</span>
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
                                    if (item.id === 'add-product') {
                                        setEditingProduct(null);
                                    }
                                    setActiveTab(item.id);
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
            <main className="flex-1 min-w-0 overflow-x-hidden">
                {/* Header for mobile */}
                <header className="lg:hidden bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <Store className="w-6 h-6 text-orange-600" />
                        <span className="text-lg font-bold">Shop Admin</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* Content */}
                <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default ShopHome;
