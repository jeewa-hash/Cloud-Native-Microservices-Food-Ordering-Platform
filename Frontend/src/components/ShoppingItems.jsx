import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Search, Filter, ShoppingCart, Info, ArrowLeft } from 'lucide-react';
import CartSidebar from '../OrderManagementServiceFrontend/CartSidebar';
import { PRODUCTS_API, ORDER_API } from '../apiConfig';

const ShoppingItems = ({ shopId = null, shopName = null, onBack = null }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [cart, setCart] = useState({ items: [] });
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [shopId]);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const url = shopId
                ? `${PRODUCTS_API}/shops/${shopId}`
                : PRODUCTS_API;
            const response = await axios.get(url);
            setProducts(response.data);
            setError('');
        } catch (err) {
            console.error("Error fetching products:", err);
            setError('Failed to load products. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await axios.get(`${ORDER_API}/cart`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) setCart(res.data.cart);
        } catch (err) {
            console.error('Error fetching cart:', err);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to add items to your cart.');
                return;
            }

            const response = await axios.post(
                `${ORDER_API}/cart/add`,
                { productId: product._id, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setCart(response.data.cart);
                setIsCartOpen(true); // open cart automatically
            } else {
                alert('Failed to add item: ' + response.data.message);
            }
        } catch (err) {
            console.error('Add to cart error:', err);
            alert('Something went wrong while adding to cart.');
        }
    };

    const filteredProducts = products.filter(product => {
        if (!product.isAvailable) return false;
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (isLoading) return (
        <div className="flex items-center justify-center p-12 h-64">
            <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center justify-center text-center h-64">
            <p className="font-medium mb-4">{error}</p>
            <button
                onClick={fetchProducts}
                className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
            >
                Try Again
            </button>
        </div>
    );

    return (
        <div className="space-y-6 relative">
            {/* Cart Sidebar */}
            <CartSidebar
                cart={cart}
                setCart={setCart}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />

            {/* Back Button */}
            {shopId && onBack && (
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition-colors mb-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Shops
                </button>
            )}

            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {shopId ? `${shopName} Products` : 'Shopping Items'}
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {shopId
                            ? 'Browse the menu for this specific shop.'
                            : 'Discover products from your favorite stores.'}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Cart Badge */}
                    <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
                        <ShoppingCart className="w-6 h-6 text-black" />
                        {cart.items.length > 0 && (
                            <span className="absolute -top-2 -right-2 text-xs font-bold bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                {cart.items.length}
                            </span>
                        )}
                    </div>

                    {/* Category & Search */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                        <div className="relative w-full sm:w-48">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all shadow-sm appearance-none cursor-pointer text-gray-700 font-medium"
                            >
                                <option value="All">All Categories</option>
                                <option value="Food">Food</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Grocery">Grocery</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="relative w-full sm:w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search Products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all shadow-sm font-medium text-gray-700"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Product List */}
            {filteredProducts.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm h-64">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                        <Package className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
                    <p className="text-gray-500 max-w-sm">
                        {searchTerm || selectedCategory !== 'All'
                            ? "We couldn't find any products matching your search criteria."
                            : "There are currently no items available."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col"
                        >
                            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Package className="w-12 h-12 opacity-20" />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    {product.category}
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1 flex-1 pr-2" title={product.name}>
                                        {product.name}
                                    </h3>
                                    <span className="font-bold text-orange-600 ml-auto shrink-0 flex items-center text-lg">
                                        LKR {Number(product.price).toFixed(2)}
                                    </span>
                                </div>

                                {product.shopName && (
                                    <p className="text-sm font-medium text-orange-600 mb-2 flex items-center gap-1.5">
                                        from {product.shopName}
                                    </p>
                                )}

                                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                                    {product.description || "No description provided."}
                                </p>

                                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => alert('View Details functionality')}
                                        className="w-10 h-10 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors shrink-0"
                                        title="View Details"
                                    >
                                        <Info className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1 bg-black text-white hover:bg-orange-600 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors shadow-md hover:shadow-orange-600/30"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShoppingItems;