import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing!');
      setEmail('');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and fashion tips.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="flex-1 relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-full border-0 focus:ring-2 focus:ring-white/50 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter; 