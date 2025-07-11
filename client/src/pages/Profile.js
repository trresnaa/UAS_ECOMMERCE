import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(saved);
  }, []);

  const handleSelesai = (orderId) => {
    const updated = orders.map(order => order.id === orderId ? { ...order, status: 'completed' } : order);
    setOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="mb-2 font-semibold">Name: <span className="font-normal">{user?.name}</span></div>
          <div className="mb-2 font-semibold">Email: <span className="font-normal">{user?.email}</span></div>
          <div className="mb-2 font-semibold">Phone: <span className="font-normal">{user?.phone || '-'}</span></div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">{user?.role === 'admin' ? 'Orders' : 'My Orders'}</h2>
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
                      <td className="py-3 px-4 text-center">
                        <Link to={`/orders/${order.id}`} className="text-purple-600 hover:underline mr-2">Detail</Link>
                        {order.status === 'shipping' && (
                          <button
                            className="ml-2 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                            onClick={() => handleSelesai(order.id)}
                          >
                            Selesai
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
    </div>
  );
};

export default Profile; 