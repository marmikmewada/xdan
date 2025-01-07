'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useStore from "../store/useStore";
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, Phone, Mail, Shield, CreditCard, BookOpen, Key } from 'lucide-react';

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const { selectedMode } = useStore();
  const [mounted, setMounted] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        if(!is2FAEnabled){
          setNotification({ type: 'success', message: 'When you login to your account next time, you will need to scan the QR code on an authenticator app to enable 2FA'})
        } else {
          setNotification({ type: 'error', message:'2FA off'})
        }
        setIs2FAEnabled(!is2FAEnabled);
      } else {
        console.log("Failed to update 2FA status:", data.message);
      }
    } catch (error) {
      console.log("Error updating 2FA status:", error);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null); // Hide notification after 3 seconds
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!mounted) {
    return null;
  }

  const bgColor = selectedMode === 'dark' ? 'bg-gradient-to-b from-gray-900 to-black' : 'bg-gradient-to-b from-gray-50 to-white';
  const textColor = selectedMode === 'dark' ? 'text-white' : 'text-gray-900';
  const sectionBg = selectedMode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = selectedMode === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const linkColor = selectedMode === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700';
  const iconColor = selectedMode === 'dark' ? 'text-gray-400' : 'text-gray-500';

  if (status === "loading" || loading) {
    return (
      <div className={`${bgColor} ${textColor} min-h-screen flex items-center justify-center`}>
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className={`${bgColor} ${textColor} min-h-screen flex items-center justify-center`}>
        <div className="text-2xl">Please log in to view your profile</div>
      </div>
    );
  }

  return (
    <div className={`${bgColor} ${textColor} min-h-screen py-16`}>
      <br />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">User Profile</h1>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
        {userData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${sectionBg} p-8 rounded-lg shadow-lg mb-8 ${borderColor} border`}
          >
            <h2 className="text-3xl font-semibold mb-6">Profile Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className={`mr-3 ${iconColor}`} />
                  <p><span className="font-medium">Name:</span> {userData.name} {userData.lastName}</p>
                </div>
                <div className="flex items-center">
                  <Mail className={`mr-3 ${iconColor}`} />
                  <p><span className="font-medium">Email:</span> {userData.email}</p>
                </div>
                <div className="flex items-center">
                  <Phone className={`mr-3 ${iconColor}`} />
                  <p><span className="font-medium">Phone:</span> {userData.phone}</p>
                </div>
                <div className="flex items-center">
                  <Calendar className={`mr-3 ${iconColor}`} />
                  <p><span className="font-medium">Date of Birth:</span> {new Date(userData.dob).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className={`mr-3 ${iconColor}`} />
                  <p><span className="font-medium">Address:</span> {userData.address || "Not provided"}</p>
                </div>
                <div className="flex items-center">
                  <Shield className={`mr-3 ${iconColor}`} />
                  <p><span className="font-medium">SkinType:</span> {userData.skinType || "Not provided"}</p>
                </div>
                <div className="flex items-center">
                  <CreditCard className={`mr-3 ${iconColor}`} />
                  <p><span className="font-medium">Available Minutes:</span> {userData.minutes || "0"}</p>
                </div>
                <div className="flex items-center">
                  <Shield className={`mr-3 ${iconColor}`} />
                  <label className="font-medium mr-3">Two-Factor Authentication:</label>
                  <button
                    className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      is2FAEnabled 
                        ? "bg-green-500 focus:ring-green-500" 
                        : "bg-gray-400 focus:ring-gray-400"
                    }`}
                    onClick={toggle2FA}
                    aria-pressed={is2FAEnabled}
                    role="switch"
                  >
                    <motion.div
                      className="bg-white w-5 h-5 rounded-full shadow-md"
                      animate={{ x: is2FAEnabled ? 28 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div className="grid gap-4 mb-8">
          <Link href="/profile/order-history" className={`${linkColor} ${sectionBg} p-4 rounded-lg shadow-md flex items-center transition-colors duration-200`}>
            <CreditCard className="mr-3" />
            <span>Order history</span>
          </Link>
          <Link href="/profile/my-bookings" className={`${linkColor} ${sectionBg} p-4 rounded-lg shadow-md flex items-center transition-colors duration-200`}>
            <BookOpen className="mr-3" />
            <span>Booking history</span>
          </Link>
          <Link href="/profile/new-password" className={`${linkColor} ${sectionBg} p-4 rounded-lg shadow-md flex items-center transition-colors duration-200`}>
            <Key className="mr-3" />
            <span>New password</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


// 'use client';

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import useStore from "../store/useStore";
// import { motion } from 'framer-motion';

// const ProfilePage = () => {
//   const { data: session, status } = useSession();
//   const [userData, setUserData] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [is2FAEnabled, setIs2FAEnabled] = useState(false);
//   const { selectedMode } = useStore();
//   const [mounted, setMounted] = useState(false);
//   const [notification, setNotification] = useState(null);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Fetch user details and orders data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!session) return;

//       setLoading(true);

//       try {
//         const response = await fetch("/api/get-user-profile");
//         const data = await response.json();
//         console.log("data of user profile", data);
//         if (data.success) {
//           setUserData(data.userDetails);
//           setOrders(data.orders);
//           setIs2FAEnabled(data.userDetails?.twofa || false);
//         } else {
//           console.log("Failed to fetch user data:", data.message);
//         }
//       } catch (error) {
//         console.log("Error fetching user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [session]);

//   const toggle2FA = async () => {
//     try {
//       const response = await fetch("/api/toggle-twofa", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ enable: !is2FAEnabled }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         if(!is2FAEnabled){
//         setNotification({ type: 'success', message: 'when you login to your account next time, you will need to scan the qr code on a authenticator app to enable 2fa'})
//         }else{
//           setNotification({ type: 'error', message:'2fa off'})
//         }
//         setIs2FAEnabled(!is2FAEnabled);
//       } else {
//         console.log("Failed to update 2FA status:", data.message);
//       }
//     } catch (error) {
//       console.log("Error updating 2FA status:", error);
//     }
//   };

//   useEffect(() => {
//     if (notification) {
//         const timer = setTimeout(() => {
//             setNotification(null); // Hide notification after 3 seconds
//         }, 3000);
//         return () => clearTimeout(timer);
//     }
// }, [notification]);

//   if (!mounted) {
//     return null;
//   }

//   const bgColor = selectedMode === 'dark' ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-gradient-to-b from-white to-gray-100';
//   const textColor = selectedMode === 'dark' ? 'text-white' : 'text-gray-900';
//   const sectionBg = selectedMode === 'dark' ? 'bg-gray-800' : 'bg-white';
//   const borderColor = selectedMode === 'dark' ? 'border-gray-700' : 'border-gray-200';
//   const linkColor = selectedMode === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700';

  
//   if (status === "loading" || loading) {
//     return (
//       <div className={`${bgColor} ${textColor} min-h-screen flex items-center justify-center`}>
//         <div className="text-2xl">Loading...</div>
//       </div>
//     );
//   }

//   if (!session) {
//     return (
//       <div className={`${bgColor} ${textColor} min-h-screen flex items-center justify-center`}>
//         <div className="text-2xl">Please log in to view your profile</div>
//       </div>
//     );
//   }

//   return (
//     <div className={`${bgColor} ${textColor} min-h-screen py-16`}>
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-4xl font-semibold mb-8 text-center">User Profile</h1>
//         {notification && (
//                     <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg ${
//                         notification.type === 'success' 
//                             ? 'bg-green-500 text-white' 
//                             : 'bg-gradient-to-b from-black to-gray-900 text-white'
//                     }`}>
//                         {notification.message}
//                     </div>
//                 )}
//         {userData && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className={`${sectionBg} p-6 rounded-lg shadow-md mb-8 ${borderColor} border`}
//           >
//             <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
//             <div className="space-y-2">
//               <p><strong>Name:</strong> {userData.name} {userData.lastName}</p>
//               <p><strong>Available Minutes:</strong> {userData.minutes || "0"}</p>
//               <p><strong>Email:</strong> {userData.email}</p>
//               <p><strong>Phone:</strong> {userData.phone}</p>
//               <p><strong>SkinType:</strong> {userData.skinType || "Not provided"}</p>
//               <p><strong>Date of Birth:</strong> {new Date(userData.dob).toLocaleDateString()}</p>
//               <p><strong>Address:</strong> {userData.address || "Not provided"}</p>
//               <div className="flex items-center mt-4">
//                 <label className="mr-4"><strong>Two-Factor Authentication:</strong></label>
//                 <div
//                   className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
//                     is2FAEnabled ? "bg-green-500" : "bg-gray-400"
//                   }`}
//                   onClick={toggle2FA}
//                 >
//                   <div
//                     className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
//                       is2FAEnabled ? "translate-x-6" : "translate-x-0"
//                     }`}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//         <div className="grid gap-4 mb-8">
//           <Link href="/profile/order-history" className={`${linkColor}`}>Order history</Link>
//           <Link href="/profile/my-bookings" className={`${linkColor}`}>Booking history</Link>
//           <Link href="/profile/new-password" className={`${linkColor}`}>New password</Link>
//         </div>
//       </div>
      
//     </div>
//   );
// };

// export default ProfilePage;



// "use client";
// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import useStore from "../store/useStore";

// const ProfilePage = () => {
//   const { data: session, status } = useSession();
//   const [userData, setUserData] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [is2FAEnabled, setIs2FAEnabled] = useState(false);
//   const {selectedMode} = useStore();


//   // Fetch user details and orders data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!session) return;

//       setLoading(true);

//       try {
//         const response = await fetch("/api/get-user-profile");
//         const data = await response.json();
//         console.log("data of user profile", data);
//         if (data.success) {
//           setUserData(data.userDetails);
//           setOrders(data.orders);
//           setIs2FAEnabled(data.userDetails?.twofa || false);
//         } else {
//           console.log("Failed to fetch user data:", data.message);
//         }
//       } catch (error) {
//         console.log("Error fetching user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [session]);

//   const toggle2FA = async () => {
//     try {
//       const response = await fetch("/api/toggle-twofa", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ enable: !is2FAEnabled }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         setIs2FAEnabled(!is2FAEnabled);
//       } else {
//         console.log("Failed to update 2FA status:", data.message);
//       }
//     } catch (error) {
//       console.log("Error updating 2FA status:", error);
//     }
//   };

//   if (status === "loading" || loading) {
//     return <div>Loading...</div>;
//   }

//   if (!session) {
//     return <div>Please log in to view your profile</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-semibold mb-6">User Profile</h1>
//       <div className="grid gap-2">
//       <Link href="/profile/order-history"> Order history </Link>
//       <Link href="/profile/my-bookings"> Booking history </Link>
//       <Link href="/profile/new-password"> New password  </Link>
//       </div>
//       {userData && (
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
//           <div>
//             <p><strong>Name:</strong> {userData.name} {userData.lastName}</p>
//             <p><strong>Minutes:</strong> {userData.minutes || "Not provided"}</p>
//             <p><strong>Email:</strong> {userData.email}</p>
//             <p><strong>Phone:</strong> {userData.phone}</p>
//             <p><strong>Date of Birth:</strong> {new Date(userData.dob).toLocaleDateString()}</p>
//             <p><strong>Address:</strong> {userData.address || "Not provided"}</p>
//             <div className="flex items-center mt-4">
//               <label className="mr-4"><strong>Two-Factor Authentication:</strong></label>
//               <div
//                 className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
//                   is2FAEnabled ? "bg-green-500" : "bg-gray-400"
//                 }`}
//                 onClick={toggle2FA}
//               >
//                 <div
//                   className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
//                     is2FAEnabled ? "translate-x-6" : "translate-x-0"
//                   }`}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* <h2 className="text-xl font-semibold mb-4">Order History</h2>

//       <div className="bg-white p-6 rounded-lg shadow-md">
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
//       </div> */}
//     </div>
//   );
// };

// export default ProfilePage;
