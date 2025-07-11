import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Perfect Style
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Explore our curated collection of fashion items that define your unique personality. 
              From trendy clothing to elegant accessories, find your perfect match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                Shop Now
                <FiArrowRight className="ml-2" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-purple-600 hover:text-purple-600 transition-all duration-300"
              >
                <FiShoppingBag className="mr-2" />
                Browse Categories
              </Link>
            </div>
          </motion.div>

          {/* Model Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* First Section - Fashion Model */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative group"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative group">
                  <img
                    src="/summer-banner.jpg"
                    alt="Summer Collection"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg">Summer Collection</h3>
                    <p className="text-sm opacity-90">Trendy & Comfortable</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Accessories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative group"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative group">
                  <img
                    src="/accesories-banner.jpg"
                    alt="Accessories"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg">Accessories</h3>
                    <p className="text-sm opacity-90">Complete Your Look</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Second Section - Lifestyle Model */}
            <div className="space-y-4 pt-8">
              {/* Casual Wear */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="relative group"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative group">
                  <img
                    src="/casual-banner.jpg"
                    alt="Casual Wear"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg">Casual Wear</h3>
                    <p className="text-sm opacity-90">Everyday Comfort</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Formal Collection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="relative group"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative group">
                  <img
                    src="/formal-banner.jpg"
                    alt="Formal Collection"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg">Formal Collection</h3>
                    <p className="text-sm opacity-90">Elegant & Professional</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 