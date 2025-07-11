import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(saved);
  }, []);

  const handleVerify = (id) => {
    const updated = orders.map(order =>
      order.id === id ? { ...order, status: 'shipping' } : order
    );
    setOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>
        {orders.length === 0 ? (
          <div className="text-gray-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Order #</th>
                  <th className="py-3 px-4 text-center">Date</th>
                  <th className="py-3 px-4 text-center">Total</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3 px-4">{order.orderNumber}</td>
                    <td className="py-3 px-4 text-center">{order.date}</td>
                    <td className="py-3 px-4 text-center">Rp{Number(order.total).toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">{order.status}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <Link to={`/orders/${order.id}`} className="text-purple-600 hover:underline">Detail</Link>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleVerify(order.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders; 