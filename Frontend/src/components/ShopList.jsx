import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Store, Search, MapPin, ChevronRight, Phone, Mail } from 'lucide-react';

const ShopList = ({ onShopSelect }) => {
    const [shops, setShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:4040/api/shops');
            setShops(response.data);
            setError('');
        } catch (err) {
            console.error("Error fetching shops:", err);
            setError('Failed to load shops. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredShops = shops.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12 h-64">
                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center justify-center text-center h-64">
                <p className="font-medium mb-4">{error}</p>
                <button
                    onClick={fetchShops}
                    className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Registered Shopes</h2>
                    <p className="text-gray-500 mt-1">Browse all available restaurants and shopes on the platform.</p>
                </div>

                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search shopes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all shadow-sm font-medium text-gray-700"
                    />
                </div>
            </div>

            {/* List View */}
            {filteredShops.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm h-64">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                        <Store className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No shops found</h3>
                    <p className="text-gray-500 max-w-sm">
                        {searchTerm
                            ? "We couldn't find any shops matching your search criteria. Try a different query."
                            : "There are currently no shops registered on the platform."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredShops.map((shop) => (
                        <div
                            key={shop.id}
                            onClick={() => onShopSelect(shop)}
                            className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full hover:border-orange-200 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>

                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                    <Store className="w-7 h-7" />
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <h3 className="font-bold text-xl text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                                        {shop.name}
                                    </h3>
                                    <p className="text-sm font-medium text-gray-500 truncate">@{shop.username}</p>
                                </div>
                            </div>

                            <div className="mt-auto space-y-2.5">
                                {shop.email && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">{shop.email}</span>
                                    </div>
                                )}
                                {shop.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{shop.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-orange-600 font-bold text-sm opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                <span>View Shop Products</span>
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShopList;
