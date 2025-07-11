import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

function generateOrderNumber() {
  return 'ORD' + Date.now().toString().slice(-6);
}

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Simulasi order, simpan ke localStorage
      const order = {
        id: Date.now().toString(),
        orderNumber: generateOrderNumber(),
        date: new Date().toLocaleString(),
        status: 'pending',
        paymentMethod: form.paymentMethod,
        shipping: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
        },
        items,
        total,
      };
      const saved = JSON.parse(localStorage.getItem('orders')) || [];
      localStorage.setItem('orders', JSON.stringify([order, ...saved]));
      setOrderId(order.id);
      setSuccess(true);
      clearCart();
      setLoading(false);
    } catch (err) {
      setError('Gagal melakukan order');
      setLoading(false);
    }
  };

  if (success) {
    window.dispatchEvent(new Event('refreshProducts'));
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Order placed successfully!</h2>
          <button
            className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            onClick={() => navigate(`/orders/${orderId}`)}
          >
            View Order Detail
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input name="name" value={form.name} onChange={handleChange} required className="border rounded px-4 py-2" placeholder="Full Name" />
            <input name="phone" value={form.phone} onChange={handleChange} required className="border rounded px-4 py-2" placeholder="Phone Number" />
            <input name="city" value={form.city} onChange={handleChange} required className="border rounded px-4 py-2" placeholder="City" />
            <input name="postalCode" value={form.postalCode} onChange={handleChange} required className="border rounded px-4 py-2" placeholder="Postal Code" />
          </div>
          <textarea name="address" value={form.address} onChange={handleChange} required className="border rounded px-4 py-2 w-full mb-4" placeholder="Full Address" />
          <div className="mb-4">
            <label className="font-semibold mr-4">Payment Method:</label>
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="border rounded px-4 py-2">
              <option value="cod">Cash on Delivery</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="e_wallet">E-Wallet</option>
            </select>
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
        {/* Ringkasan Order */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          {items.length === 0 ? (
            <div className="text-gray-500">Your cart is empty.</div>
          ) : (
            <ul className="mb-4">
              {items.map(item => (
                <li key={item.id} className="flex justify-between items-center mb-2">
                  <span>
                    {item.product.name}
                    {item.selectedSize ? (
                      <span className="ml-2 text-xs text-gray-500">(Size: {item.selectedSize})</span>
                    ) : null}
                    x {item.quantity}
                  </span>
                  <span>Rp{Number(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="font-bold text-lg">Total: <span className="text-purple-600">Rp{Number(total).toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 