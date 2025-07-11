import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiUser, FiSearch, FiHeart } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">FashionStore</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-purple-600 transition-colors">
              Products
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-purple-600 transition-colors">
              
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
              >
                <FiSearch />
              </button>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist & Cart hanya untuk customer */}
            {user?.role !== 'admin' && (
              <>
                <Link to="/wishlist" className="text-gray-700 hover:text-purple-600 transition-colors">
                  <FiHeart className="w-5 h-5" />
                </Link>
                <Link to="/cart" className="text-gray-700 hover:text-purple-600 transition-colors relative">
                  <FiShoppingCart className="w-5 h-5" />
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getCartItemCount()}
                    </span>
                  )}
                </Link>
              </>
            )}
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <FiUser className="w-5 h-5" />
                  <span className="hidden sm:block">{user?.name}</span>
                </button>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {user?.role === 'admin' ? (
                      <>
                        <Link
                          to="/admin/orders"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Orders
                        </Link>
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
