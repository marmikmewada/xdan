'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import emailjs from "@emailjs/browser";
import useStore from "@/app/store/useStore";
import { motion } from 'framer-motion';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("order_id");
  const { selectedMode } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleEmptyCart = async () => {
      await fetch("/api/emptycart", {
        method: "DELETE",
      });
      await fetch("/api/change-payment-status");
    };
    handleEmptyCart();

    const fetchOrderDetails = async () => {
      try {
        const sentOrders = JSON.parse(localStorage.getItem("sentOrders")) || [];
        console.log("sentOrders", sentOrders);

        if (sentOrders.includes(id)) {
          console.log("Email already sent for this order.");
          return;
        }

        const response = await fetch(`/api/get-single-order-email/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (result.success) {
          const { userRef, _id: order_id, totalAmount, paymentMethod, paymentStatus } = result.data || {};
          const { name, email } = userRef || {};

          await emailjs.send(
            process.env.NEXT_PUBLIC_SERVICE_ID,
            process.env.NEXT_PUBLIC_ORDER_TEMPLATE_ID,
            {
              to: email,
              to_name: name,
              order_id,
              total_amount: totalAmount,
              paymentMethod,
              paymentStatus,
              from_name: "Bronze & Beauty Studio",
            },
            {
              publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
            }
          );

          sentOrders.push(order_id);
          localStorage.setItem("sentOrders", JSON.stringify(sentOrders));
          
          console.log("Email sent for order", order_id);
        } else {
          console.error("Failed to fetch order details:", result.message);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [id, router]);

  const trackOrder = () => {
    router.push("/profile/order-history");
  };

  if (!mounted) {
    return null;
  }

  const bgColor = selectedMode === 'dark' ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-gradient-to-b from-white to-gray-100';
  const textColor = selectedMode === 'dark' ? 'text-white' : 'text-gray-900';
  const cardBg = selectedMode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = selectedMode === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const buttonBg = selectedMode === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';
  const successTextColor = selectedMode === 'dark' ? 'text-green-400' : 'text-green-600';

  return (
    <div className={`min-h-screen ${bgColor} flex items-center justify-center px-4 sm:px-6 lg:px-8`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${cardBg} p-8 rounded-lg shadow-lg max-w-lg w-full ${borderColor} border`}
      >
        <h1 className={`text-3xl font-bold ${successTextColor} mb-4`}>
          Payment Successful!
        </h1>
        <p className={`text-lg ${textColor} mb-6`}>
          Thank you for your purchase. Your payment has been successfully processed.
        </p>
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={trackOrder}
            className={`${buttonBg} ${textColor} py-2 px-6 rounded-lg focus:outline-none transition duration-300 ease-in-out transform hover:scale-105`}
          >
            Order Status
          </button>
        </div>
      </motion.div>
    </div>
  );
}







// "use client";
// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import emailjs from "@emailjs/browser";

// export default function PaymentSuccess() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const id = searchParams.get("order_id");

//   useEffect(() => {
//     const hanldeEmptyCart = async () => {
//       await fetch("/api/emptycart", {
//         method: "DELETE",
//       });
//       await fetch("/api/change-payment-status");
//     };
//     hanldeEmptyCart();

//     const fetchOrderDetails = async () => {
//       try {
//         // Check if the email has already been sent for the current order_id
//         const sentOrders = JSON.parse(localStorage.getItem("sentOrders")) || [];
//         console.log("sentOrders",sentOrders)
    
//         // If the order has already been processed (email sent), skip sending the email
//         if (sentOrders.includes(id)) {
//           console.log("Email already sent for this order.");
//           return;
//         }
    
//         // Fetch the order details
//         const response = await fetch(`/api/get-single-order-email/${id}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
    
//         const result = await response.json();
//         if (result.success) {
//           const { userRef, _id: order_id, totalAmount, paymentMethod, paymentStatus } = result.data || {};
//           const { name, email } = userRef || {};
    
//           // Send the email via emailjs
//           await emailjs.send(
//             process.env.NEXT_PUBLIC_SERVICE_ID,
//             process.env.NEXT_PUBLIC_ORDER_TEMPLATE_ID,
//             {
//               to: email,
//               to_name: name,
//               order_id,
//               total_amount: totalAmount,
//               paymentMethod,
//               paymentStatus,
//               from_name: "The Tanning Salon",
//             },
//             {
//               publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
//             }
//           );
    
//           // Mark this order as processed by adding its order_id to the list
//           sentOrders.push(order_id);
//           localStorage.setItem("sentOrders", JSON.stringify(sentOrders));
          
//           console.log("Email sent for order", order_id);
//         } else {
//           console.error("Failed to fetch order details:", result.message);
//           // You can redirect or show a fallback message here if needed
//         }
//       } catch (error) {
//         console.error("Error fetching order details:", error);
//         // You can redirect or show a fallback message here if needed
//       }
//     };
//     ;

//     fetchOrderDetails();

//   }, [id,router]);

//   // Handle redirection to the profile page
//   const trackOrder = () => {
//     router.push("/profile"); // Redirect to the user's profile page
//   };

//   return (
//     <div className="min-h-screen bg-green-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
//         <h1 className="text-3xl font-bold text-green-600 mb-4">
//           {" "}
//           Payment Successful!{" "}
//         </h1>{" "}
//         <p className="text-lg text-gray-700 mb-6">
//           {" "}
//           Thank you for your purchase.Your payment has been successfully
//           processed.{" "}
//         </p>
//         {/* Buttons */}{" "}
//         <div className="flex flex-col items-center space-y-4">
//           <button
//             onClick={trackOrder}
//             className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none"
//           >
//             Order Status{" "}
//           </button>{" "}
//         </div>{" "}
//       </div>{" "}
//     </div>
//   );
// }
