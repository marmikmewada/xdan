"use client"
import React from 'react'
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";


function OrderHistory() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
          if (!session) return;
    
          setLoading(true);

          try {
            const response = await fetch("/api/get-user-profile");
            const data = await response.json();
            console.log("data of user profile", data);
            if (data.success) {
            //   setUserData(data.userDetails);
              setOrders(data.orders);
            //   setIs2FAEnabled(data.userDetails?.twofa || false);
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

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
<Link href="/profile"> Back to profile </Link>
    <div className="bg-white p-6 rounded-lg shadow-md">
        {orders.length > 0 ? (
          <ul>
            {orders.map((order,index) => (
              <li key={index} className="border-b py-4">
                <h3 className="text-lg font-medium">Order ID: {order._id}</h3>
                <p><strong>Status:</strong> {order.statusForUser}</p>
                <p><strong>Total Amount:</strong> £{order.totalAmount}</p>
                <p><strong>Order Type:</strong> {order.orderType}</p>
                <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                <p><strong>Delivery Address:</strong> {order.deliveryAddress || "N/A"}</p>

                {order.productRef && order.productRef.length > 0 && (
                  <div>
                    <h4 className="font-semibold mt-2">Products:</h4>
                    <ul>
                      {order.productRef.map((product,index) => (
                        <li key={index}>
                          {product.name} - £{product.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {order.packageRef && order.packageRef.length > 0 && (
                  <div>
                    <h4 className="font-semibold mt-2">Packages:</h4>
                    <ul>
                      {order.packageRef.map((pkg,index) => (
                        <li key={index}>
                          {pkg.name} - £{pkg.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
      </div>
  )
}

export default OrderHistory