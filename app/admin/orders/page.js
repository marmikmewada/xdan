"use client"
import { useEffect, useState } from 'react';
import useStore from '@/app/store/useStore';
import Image from 'next/image';
import {  useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

const AdminGetAllOrders = () => {
  const { data: session,status } = useSession(); 
  const { user } = session || {};
const { role } = user || {};
const router = useRouter();

  const { selectedMode } = useStore();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (status !== "loading" && (role !== "admin" && role !== "staff")) {
      router.back();
    }
  }, [role, router, status]);

  const statusForUserOptions = ['failed', 'placed', 'ready-for-pickup', 'collected', 'shipped'];
  const paymentStatusOptions = ['pending', 'completed', 'failed'];

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

  const updateOrder = async (orderId, field, value) => {
    try {
      const response = await fetch(`/api/update-order-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, [field]: value }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, [field]: value } : order
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const gradientClass =
    selectedMode === 'dark'
      ? 'bg-gradient-to-b from-gray-800 to-black'
      : 'bg-gradient-to-b from-white to-gray-200';
  const textClass = selectedMode === 'dark' ? 'text-white' : 'text-gray-900';
  const inputClass =
    selectedMode === 'dark'
      ? 'bg-gray-800 text-white border-gray-700'
      : 'bg-white text-gray-800 border-gray-300';
  const cardClass = selectedMode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300';

  return (
    <div className={`min-h-screen ${gradientClass} ${textClass}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold mb-6">All Orders</h1>

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
              <div
                key={order._id}
                className={`${cardClass} rounded-lg shadow-lg border p-6`}
              >
                {/* Order Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">Order #{order._id}</h3>
                      <p className="text-sm opacity-75">
                        Created: {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm opacity-75">
                        Coupon Discount: {order.couponDiscountAmount}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">£{order.totalAmount}</p>
                      {order.couponDiscountAmount > 0 && (
                        <p className="text-sm text-green-500">
                          Discount: £{order.couponDiscountAmount}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Customer Details</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Name:</strong> {order.userRef?.name} {order.userRef?.lastName}</p>
                      <p><strong>Email:</strong> {order.userRef?.email}</p>
                      <p><strong>Phone:</strong> {order.userRef?.phone}</p>
                    </div>
                    <div>
                      <p><strong>Order Type:</strong> {order.orderType}</p>
                      {order.deliveryAddress && (
                        <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                      )}
                      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Products</h4>
                  <div className="grid gap-4">
                    {order.productRef.map((product, index) => (
                      <div 
                        key={`${product._id}-${index}`}
                        className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900"
                      >
                        {/* Product Image */}
                        {product.imageUrl?.[0] && (
                          <div className="w-full sm:w-32 h-32 relative rounded-lg overflow-hidden">
                            <Image
                              src={product.imageUrl[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Product Details */}
                        <div className="flex-grow">
                          <h5 className="font-semibold">{product.name}</h5>
                          {/* <p className="text-sm opacity-75 line-clamp-2">{product.description}</p> */}
                          <p className="mt-2 font-semibold">£{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Package Details if any */}
                {order.packageRef?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">Packages</h4>
                    <div className="grid gap-4">
                      {order.packageRef.map((pkg,index) => (
                      <div 
                        key={`${pkg._id}-${index}`} 
                        className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900"
                      >
                        {/* Package Image */}
                        {pkg.imageUrl?.[0] && (
                          <div className="w-full sm:w-32 h-32 relative rounded-lg overflow-hidden">
                            <Image
                              src={pkg.imageUrl[0]}
                              alt={pkg.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Package Details */}
                        <div className="flex-grow">
                          <h5 className="font-semibold">{pkg.name}</h5>
                          <h5 className="font-semibold">{pkg.minutes} minutes</h5>
                          {/* <p className="text-sm opacity-75 line-clamp-2">{product.description}</p> */}
                          <p className="mt-2 font-semibold">£{pkg.price}</p>
                        </div>
                      </div>


                      ))}
                    </div>
                  </div>
                )}

                {/* Status Controls */}
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="mb-1"><strong>Payment Status</strong></p>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => updateOrder(order._id, 'paymentStatus', e.target.value)}
                      className={`border rounded-md p-2 w-full ${inputClass}`}
                    >
                      {paymentStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="mb-1"><strong>Order Status</strong></p>
                    <select
                      value={order.statusForUser}
                      onChange={(e) => updateOrder(order._id, 'statusForUser', e.target.value)}
                      className={`border rounded-md p-2 w-full ${inputClass}`}
                    >
                      {statusForUserOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>
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

export default AdminGetAllOrders;



// 'use client';

// import { useEffect, useState } from 'react';
// import useStore from '@/app/store/useStore'; // Importing useStore for dynamic mode selection

// const AdminGetAllOrders = () => {
//   const { selectedMode } = useStore(); // Get the selected mode (light or dark)
//   const [orders, setOrders] = useState([]);
//   const [error, setError] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date

//   const statusForUserOptions = ['failed', 'placed', 'ready-for-pickup', 'collected'];
//   const paymentStatusOptions = ['pending', 'completed', 'failed'];

//   // Fetch orders based on date
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await fetch(`/api/getallorders?date=${selectedDate}`);
//         const data = await response.json();

//         if (response.ok) {
//           setOrders(data.orders || []);
//         } else {
//           throw new Error(data.message || 'Failed to fetch orders');
//         }
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchOrders();
//   }, [selectedDate]);

//   // Update order function
//   const updateOrder = async (orderId, field, value) => {
//     try {
//       const response = await fetch(`/api/updateorder`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ orderId, [field]: value }),
//       });

//       if (!response.ok) throw new Error('Failed to update order');

//       // Refresh orders
//       setOrders((prev) =>
//         prev.map((order) =>
//           order._id === orderId ? { ...order, [field]: value } : order
//         )
//       );
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Dynamic styling based on selectedMode
//   const gradientClass =
//     selectedMode === 'dark'
//       ? 'bg-gradient-to-r from-gray-800 to-black'
//       : 'bg-gradient-to-r from-white to-gray-200';
//   const textClass = selectedMode === 'dark' ? 'text-white' : 'text-gray-900';
//   const inputClass =
//     selectedMode === 'dark'
//       ? 'bg-gray-800 text-white border-gray-700'
//       : 'bg-white text-gray-800 border-gray-300';
//   const tableContainerClass =
//     selectedMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800';
//   const errorClass = selectedMode === 'dark' ? 'text-red-500' : 'text-red-600';
//   const tableHeaderClass =
//     selectedMode === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-500';
//   const rowHoverClass = selectedMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
//   const tableBodyClass =
//     selectedMode === 'dark' ? 'bg-gray-800 text-white divide-gray-700' : 'bg-white text-gray-900 divide-gray-200';

//   return (
//     <div className={`min-h-screen ${gradientClass} ${textClass}`}>
//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <h1 className="text-4xl font-semibold mb-8">All Orders</h1>

//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-2">Filter by Date:</label>
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className={`border rounded-md p-2 ${inputClass}`}
//             />
//           </div>

//           {error ? (
//             <div className={`p-4 rounded-lg shadow-md ${errorClass} bg-red-100 mb-4`}>
//               <p>Error: {error}</p>
//             </div>
//           ) : (
//             <div className={`overflow-x-auto ${tableContainerClass} shadow-lg rounded-lg border border-gray-200`}>
//               <table className="min-w-full table-auto divide-y">
//                 <thead className={tableHeaderClass}>
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className={tableBodyClass}>
//                   {orders.map((order) => (
//                     <tr key={order._id} className={rowHoverClass}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order._id}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         {order.userRef?.name || 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <select
//                           value={order.paymentStatus}
//                           onChange={(e) => updateOrder(order._id, 'paymentStatus', e.target.value)}
//                           className={`border rounded-md p-1 ${inputClass}`}
//                         >
//                           {paymentStatusOptions.map((status) => (
//                             <option key={status} value={status}>
//                               {status}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <select
//                           value={order.statusForUser}
//                           onChange={(e) => updateOrder(order._id, 'statusForUser', e.target.value)}
//                           className={`border rounded-md p-1 ${inputClass}`}
//                         >
//                           {statusForUserOptions.map((status) => (
//                             <option key={status} value={status}>
//                               {status}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminGetAllOrders;
