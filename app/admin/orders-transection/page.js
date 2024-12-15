"use client";
import { useEffect, useState } from "react";
import useStore from "@/app/store/useStore";
import Image from "next/image";

const OrdersTransection = () => {
  const { selectedMode } = useStore();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/getalltransections?date=${selectedDate}`);
        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders || []);
        } else {
          throw new Error(data.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOrders();
  }, [selectedDate]);

  const gradientClass =
    selectedMode === "dark" ? "bg-gradient-to-b from-gray-800 to-black" : "bg-gradient-to-b from-white to-gray-200";
  const textClass = selectedMode === "dark" ? "text-white" : "text-gray-900";
  const inputClass =
    selectedMode === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-800 border-gray-300";
  const cardClass = selectedMode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300";

  return (
    <div className={`min-h-screen ${gradientClass} ${textClass}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold mb-6">All Order Transactions</h1>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <label className="block text-sm font-medium">Filter by Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`border rounded-md p-2 w-full sm:w-auto ${inputClass}`}
          />
        </div>
        {error ? (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg shadow-md mb-4">
            <p>Error: {error}</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div key={order._id} className={`${cardClass} rounded-lg shadow-lg border p-6`}>
                {/* Order Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">Order #{order._id}</h3>
                      <p className="text-sm opacity-75">
                        Created: {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">₹{order.orderRef.totalAmount}</p>
                      {order.couponDiscountAmount > 0 && (
                        <p className="text-sm text-green-500">
                          Discount: ₹{order.couponDiscountAmount}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2"> Done by:</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p>
                        <strong>Name:</strong> {order.doneBy?.name} {order.doneBy?.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong> {order.doneBy?.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {order.doneBy?.phone}
                      </p>
                    </div>
                    <div>
                      <p><strong>Order Type:</strong> {order?.orderRef.orderType}</p>
                      {order.deliveryAddress && (
                        <p><strong>Delivery Address:</strong> {order?.deliveryAddress}</p>
                      )}
                      <p><strong>Payment Method:</strong> {order?.orderRef.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Order Status</h4>
                  <p>
                    <strong>Previous Status:</strong> {order.previousOrderStatus}
                  </p>
                  <p>
                    <strong>Updated Status:</strong> {order.updatedOrderStatus}
                  </p>
                </div>

                {/* Payment Status */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Payment Status</h4>
                  <p>
                    <strong>Previous Payment Status:</strong> {order.previousPaymentStatus}
                  </p>
                  <p>
                    <strong>Updated Payment Status:</strong> {order.updatedPaymentStatus}
                  </p>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 text-gray-700 p-6 rounded-lg shadow-md text-center">
            <p>No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTransection;
