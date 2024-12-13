"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import useStore from "@/app/store/useStore";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function OrderHistory() {
  const { data: session, status } = useSession();
  const { selectedMode } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return;

      setLoading(true);

      try {
        const response = await fetch("/api/get-user-profile");
        const data = await response.json();
        console.log("data of user profile", data);

        if (data.success) {
          setOrders(data.orders);
        } else {
          console.log("Failed to fetch user data:", data.message);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  const bgColor = selectedMode === "dark"
    ? "bg-gradient-to-b from-black to-gray-900"
    : "bg-gradient-to-b from-white to-gray-100";
  const textColor = selectedMode === "dark" ? "text-white" : "text-black";
  const buttonBgColor = selectedMode === "dark" ? "bg-gradient-to-b from-black to-gray-900" : "bg-black";
  const buttonTextColor = "text-white";
  const buttonHoverBgColor = selectedMode === "dark" ? "hover:bg-gray-200" : "hover:bg-gray-800";
  const inputBgColor = selectedMode === "dark" ? "bg-gray-800" : "bg-white";
  const inputBorderColor = selectedMode === "dark" ? "border-gray-700" : "border-gray-300";

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} px-4 py-8 md:px-8`}>
      <br />
      <br />
      <br />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Order History</h2>
          <Link href="/profile" className={`${buttonBgColor} ${buttonTextColor} px-6 py-2 rounded-lg font-semibold ${buttonHoverBgColor} transition duration-300`}>
            Back to Profile
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order._id || index}
                className={`${inputBgColor} rounded-lg shadow-lg overflow-hidden border ${inputBorderColor} transition-all duration-300 ease-in-out`}
              >
                <div className={`p-6 cursor-pointer`} onClick={() => toggleOrderExpansion(order._id)}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Order ID: {order._id}</h3>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${buttonBgColor} ${buttonTextColor}`}>
                        {order.statusForUser}
                      </span>
                      {expandedOrder === order._id ? (
                        <FaChevronUp className="w-5 h-5 ml-2" />
                      ) : (
                        <FaChevronDown className="w-5 h-5 ml-2" />
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p><strong>Total Amount:</strong> £{order.totalAmount}</p>
                    <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {expandedOrder === order._id && (
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <p><strong>Order Type:</strong> {order.orderType}</p>
                      <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                      <p><strong>Delivery Address:</strong> {order.deliveryAddress || "N/A"}</p>
                    </div>

                    {order.usedCouponCode && (
                      <div className={`p-4 mb-4 ${inputBgColor} rounded-lg`}>
                        <h4 className="font-semibold mb-2">Coupon Applied</h4>
                        <p>Code: {order.usedCouponCode.couponCode}</p>
                        <p>Discount: {order.usedCouponCode.percentage}%</p>
                      </div>
                    )}

                    {order.packageRef && order.packageRef.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-lg mb-4">Packages</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {order.packageRef.map((pkg, idx) => (
                            <div key={idx} className={`${inputBgColor} p-4 rounded-lg shadow`}>
                              <div className="relative h-40 mb-3">
                                <Image
                                  src={pkg.imageUrl[0]}
                                  alt={pkg.name}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded-md"
                                />
                              </div>
                              <h5 className="font-medium text-lg mb-2">{pkg.name}</h5>
                              <p className="mb-1">Price: £{pkg.price}</p>
                              <p className="mb-1">Duration: {pkg.minutes} minutes</p>
                              <p className="text-sm">{pkg.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {order.productRef && order.productRef.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-lg mb-4">Products</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {order.productRef.map((product, idx) => (
                            <div key={idx} className={`${inputBgColor} p-4 rounded-lg shadow`}>
                              <div className="relative h-40 mb-3">
                                <Image
                                  src={product.imageUrl[0]}
                                  alt={product.name}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded-md"
                                />
                              </div>
                              <h5 className="font-medium text-lg mb-2">{product.name}</h5>
                              <p className="mb-1">Price: £{product.price}</p>
                              <p className="text-sm">{product.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`${inputBgColor} rounded-lg shadow-lg p-8 text-center`}>
            <p className="text-xl">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;









// "use client"
// import React from 'react'
// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";


// function OrderHistory() {
//   const { data: session, status } = useSession();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchUserData = async () => {
//           if (!session) return;
    
//           setLoading(true);

//           try {
//             const response = await fetch("/api/get-user-profile");
//             const data = await response.json();
//             console.log("data of user profile", data);
//             if (data.success) {
//             //   setUserData(data.userDetails);
//               setOrders(data.orders);
//             //   setIs2FAEnabled(data.userDetails?.twofa || false);
//             } else {
//               console.log("Failed to fetch user data:", data.message);
//             }
//           } catch (error) {
//             console.log("Error fetching user data:", error);
//           } finally {
//             setLoading(false);
//           }
//         };
    
//         fetchUserData();
//       }, [session]);

//   return (
//     <div className="mt-4">
//       <h2 className="text-xl font-semibold mb-4">Order History</h2>
// <Link href="/profile"> Back to profile </Link>
//     <div className="bg-white p-6 rounded-lg shadow-md">
//         {orders.length > 0 ? (
//           <ul>
//             {orders.map((order,index) => (
//               <li key={index} className="border-b py-4">
//                 <h3 className="text-lg font-medium">Order ID: {order._id}</h3>
//                 <p><strong>Status:</strong> {order.statusForUser}</p>
//                 <p><strong>Total Amount:</strong> £{order.totalAmount}</p>
//                 <p><strong>Order Type:</strong> {order.orderType}</p>
//                 <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
//                 <p><strong>Delivery Address:</strong> {order.deliveryAddress || "N/A"}</p>

//                 {order.productRef && order.productRef.length > 0 && (
//                   <div>
//                     <h4 className="font-semibold mt-2">Products:</h4>
//                     <ul>
//                       {order.productRef.map((product,index) => (
//                         <li key={index}>
//                           {product.name} - £{product.price}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {order.packageRef && order.packageRef.length > 0 && (
//                   <div>
//                     <h4 className="font-semibold mt-2">Packages:</h4>
//                     <ul>
//                       {order.packageRef.map((pkg,index) => (
//                         <li key={index}>
//                           {pkg.name} - £{pkg.price}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No orders found.</p>
//         )}
//       </div>
//       </div>
//   )
// }

// export default OrderHistory