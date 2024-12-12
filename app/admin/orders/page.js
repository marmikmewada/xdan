'use client';

import { useEffect, useState } from 'react';
import useStore from '@/app/store/useStore'; // Importing useStore for dynamic mode selection

const AdminGetAllOrders = () => {
  const { selectedMode } = useStore(); // Get the selected mode (light or dark)
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date

  const statusForUserOptions = ['failed', 'placed', 'ready-for-pickup', 'collected'];
  const paymentStatusOptions = ['pending', 'completed', 'failed'];

  // Fetch orders based on date
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/getallorders?date=${selectedDate}`);
        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders || []);
        } else {
          throw new Error(data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOrders();
  }, [selectedDate]);

  // Update order function
  const updateOrder = async (orderId, field, value) => {
    try {
      const response = await fetch(`/api/updateorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, [field]: value }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      // Refresh orders
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, [field]: value } : order
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Dynamic styling based on selectedMode
  const gradientClass =
    selectedMode === 'dark'
      ? 'bg-gradient-to-r from-gray-800 to-black'
      : 'bg-gradient-to-r from-white to-gray-200';
  const textClass = selectedMode === 'dark' ? 'text-white' : 'text-gray-900';
  const inputClass =
    selectedMode === 'dark'
      ? 'bg-gray-800 text-white border-gray-700'
      : 'bg-white text-gray-800 border-gray-300';
  const tableContainerClass =
    selectedMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800';
  const errorClass = selectedMode === 'dark' ? 'text-red-500' : 'text-red-600';
  const tableHeaderClass =
    selectedMode === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-500';
  const rowHoverClass = selectedMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const tableBodyClass =
    selectedMode === 'dark' ? 'bg-gray-800 text-white divide-gray-700' : 'bg-white text-gray-900 divide-gray-200';

  return (
    <div className={`min-h-screen ${gradientClass} ${textClass}`}>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-4xl font-semibold mb-8">All Orders</h1>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Filter by Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`border rounded-md p-2 ${inputClass}`}
            />
          </div>

          {error ? (
            <div className={`p-4 rounded-lg shadow-md ${errorClass} bg-red-100 mb-4`}>
              <p>Error: {error}</p>
            </div>
          ) : (
            <div className={`overflow-x-auto ${tableContainerClass} shadow-lg rounded-lg border border-gray-200`}>
              <table className="min-w-full table-auto divide-y">
                <thead className={tableHeaderClass}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order Status</th>
                  </tr>
                </thead>
                <tbody className={tableBodyClass}>
                  {orders.map((order) => (
                    <tr key={order._id} className={rowHoverClass}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.userRef?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => updateOrder(order._id, 'paymentStatus', e.target.value)}
                          className={`border rounded-md p-1 ${inputClass}`}
                        >
                          {paymentStatusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          value={order.statusForUser}
                          onChange={(e) => updateOrder(order._id, 'statusForUser', e.target.value)}
                          className={`border rounded-md p-1 ${inputClass}`}
                        >
                          {statusForUserOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminGetAllOrders;
