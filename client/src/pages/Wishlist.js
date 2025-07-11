import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Wishlist</h1>
          <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
          <Link to="/products" className="text-purple-600 hover:underline">Go Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col relative">
              <button
                className="absolute top-3 right-3 z-10 text-xl text-pink-600"
                onClick={() => removeFromWishlist(product.id)}
                aria-label="Remove from wishlist"
              >
                &times;
              </button>
              <img
                src={product.images && product.images.length > 0 ? product.images[0] : '/no-image.png'}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
                onError={e => { e.target.src = '/no-image.png'; }}
              />
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">{product.name}</div>
                <div className="text-purple-600 font-bold text-xl mb-2">Rp{Number(product.price).toLocaleString()}</div>
                <div className="text-sm text-gray-500 mb-2">{product.categoryName}</div>
                <div className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</div>
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Add to Cart
              </button>
              <Link
                to={`/products/${product.id}`}
                className="mt-2 text-purple-600 hover:underline text-center"
              >
                View Detail
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist; 