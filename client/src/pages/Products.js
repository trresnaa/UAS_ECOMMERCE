import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../contexts/WishlistContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = useCallback(() => setRefreshKey(k => k + 1), []);

  // Ganti export triggerRefresh dengan event listener supaya bisa trigger refresh dari luar
  useEffect(() => {
    const handler = () => setRefreshKey(k => k + 1);
    window.addEventListener('refreshProducts', handler);
    return () => window.removeEventListener('refreshProducts', handler);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        if (search) params.search = search;
        const res = await axios.get('/api/products', { params });
        setProducts(res.data.products || []);
      } catch (err) {
        setError('Gagal memuat produk');
      }
      setLoading(false);
    };
    fetchProducts();
  }, [selectedCategory, search, refreshKey]);

  // Tambah mapping nama produk ke banner
  const productBannerMap = {
    'Celana Jeans Slim Fit': '/slimfit_banner.webp',
    'Sepatu Sneakers': '/sneakers_banner.jpg',
    'Tas Ransel': '/ransel_banner.jpg',
    'Jam Tangan Classic': '/jam_banner.jpg',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>
        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-8">
          <select
            className="border rounded px-4 py-2 mb-2 md:mb-0"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            className="border rounded px-4 py-2 flex-1"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Produk */}
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-gray-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => {
              const wishlisted = isInWishlist(product.id);
              const bannerSrc = productBannerMap[product.name];
              return (
                <div key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col relative">
                  {/* Wishlist Icon */}
                  <button
                    className={`absolute top-3 right-3 z-10 text-xl ${wishlisted ? 'text-pink-600' : 'text-gray-400 hover:text-pink-500'}`}
                    onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <FiHeart fill={wishlisted ? '#ec4899' : 'none'} />
                  </button>
                  <img
                    src={bannerSrc ? bannerSrc : (product.images && product.images.length > 0 ? product.images[0] : '/no-image.png')}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded mb-4"
                    onError={e => { e.target.src = '/no-image.png'; }}
                  />
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-gray-900">{product.name}</div>
                    <div className="text-purple-600 font-bold text-xl mb-2">Rp{Number(product.price).toLocaleString()}</div>
                    <div className="text-sm text-gray-500 mb-2">{product.categoryName}</div>
                    <div className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</div>
                  </div>
                  <Link
                    to={`/products/${product.id}`}
                    className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-pink-700 transition-all text-center"
                  >
                    View Detail
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 