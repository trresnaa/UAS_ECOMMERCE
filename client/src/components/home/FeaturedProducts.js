import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked collection of trending fashion items that will elevate your style.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Placeholder products - will be replaced with real data */}
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: item * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-200 rounded-lg aspect-square mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200"></div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Product {item}</h3>
              <p className="text-gray-600 mb-2">$99.99</p>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            View All Products
            <FiArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts; 