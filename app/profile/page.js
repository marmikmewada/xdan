"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // Assuming you're using next-auth for session management

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
console.log("userData",userData)
  // Fetch user details and orders data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return; // Skip if not logged in

      setLoading(true);

      try {
        const response = await fetch("/api/get-user-profile");
        const data = await response.json();
console.log("data of user profile",data)
        if (data.success) {
          setUserData(data.userDetails);
          setOrders(data.orders); // Set orders data
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

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">User Profile</h1>

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
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Order History</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order._id} className="border-b py-4">
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
                      {order.productRef.map((product) => (
                        <li key={product._id}>
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
                      {order.packageRef.map((pkg) => (
                        <li key={pkg._id}>
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
  );
};

export default ProfilePage;
