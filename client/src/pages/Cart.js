import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!items.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link to="/products" className="text-purple-600 hover:underline">Go Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-center">Price</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-center">Subtotal</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b">
                  <td className="py-3 px-4 flex items-center gap-4">
                    <img
                      src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/no-image.png'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={e => { e.target.src = '/no-image.png'; }}
                    />
                    <div>
                      <div className="font-semibold">{item.product.name}</div>
                      <div className="text-sm text-gray-500">{item.product.categoryName}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">Rp{Number(item.price).toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => updateQuantity(item.id, Number(e.target.value))}
                      className="w-16 border rounded px-2 py-1 text-center"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">Rp{Number(item.price * item.quantity).toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
          <div className="text-xl font-bold">Total: <span className="text-purple-600">Rp{Number(total).toLocaleString()}</span></div>
          <button
            onClick={handleCheckout}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart; 