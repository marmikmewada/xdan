"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);


  // Fetch user details and orders data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return;

      setLoading(true);

      try {
        const response = await fetch("/api/get-user-profile");
        const data = await response.json();
        console.log("data of user profile", data);
        if (data.success) {
          setUserData(data.userDetails);
          setOrders(data.orders);
          setIs2FAEnabled(data.userDetails?.twofa || false);
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

  const toggle2FA = async () => {
    try {
      const response = await fetch("/api/toggle-twofa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enable: !is2FAEnabled }),
      });

      const data = await response.json();
      if (data.success) {
        setIs2FAEnabled(!is2FAEnabled);
      } else {
        console.log("Failed to update 2FA status:", data.message);
      }
    } catch (error) {
      console.log("Error updating 2FA status:", error);
    }
  };

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">User Profile</h1>
      <div className="grid gap-2">
      <Link href="/profile/order-history"> Order history </Link>
      <Link href="/profile/my-bookings"> Booking history </Link>
      </div>
      {userData && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
          <div>
            <p><strong>Name:</strong> {userData.name} {userData.lastName}</p>
            <p><strong>Minutes:</strong> {userData.minutes || "Not provided"}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone:</strong> {userData.phone}</p>
            <p><strong>Date of Birth:</strong> {new Date(userData.dob).toLocaleDateString()}</p>
            <p><strong>Address:</strong> {userData.address || "Not provided"}</p>
            <div className="flex items-center mt-4">
              <label className="mr-4"><strong>Two-Factor Authentication:</strong></label>
              <div
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                  is2FAEnabled ? "bg-green-500" : "bg-gray-400"
                }`}
                onClick={toggle2FA}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    is2FAEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <h2 className="text-xl font-semibold mb-4">Order History</h2>

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
      </div> */}
    </div>
  );
};

export default ProfilePage;
