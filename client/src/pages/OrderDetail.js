import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('orders')) || [];
    const found = saved.find(o => String(o.id) === String(id));
    setOrder(found || null);
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Order not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Detail</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-2 font-semibold">Order Number: <span className="font-normal">{order.orderNumber}</span></div>
          <div className="mb-2 font-semibold">Date: <span className="font-normal">{order.date}</span></div>
          <div className="mb-2 font-semibold">Status: <span className="font-normal">{order.status}</span></div>
          <div className="mb-2 font-semibold">Payment: <span className="font-normal">{order.paymentMethod}</span></div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <div>{order.shipping.name}</div>
          <div>{order.shipping.phone}</div>
          <div>{order.shipping.address}</div>
          <div>{order.shipping.city}, {order.shipping.postalCode}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <ul>
            {order.items.map(item => (
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
          <div className="font-bold text-lg mt-4">Total: <span className="text-purple-600">Rp{Number(order.total).toLocaleString()}</span></div>
        </div>
        <Link to="/orders" className="text-purple-600 hover:underline">Back to Orders</Link>
      </div>
    </div>
  );
};

export default OrderDetail; 