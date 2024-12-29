"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useStore from "../../store/useStore";
import emailjs from "@emailjs/browser";

const OrderConfirmationPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { selectedMode } = useStore();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const bgColor =
    selectedMode === "dark"
      ? "bg-gradient-to-b from-black to-gray-900"
      : "bg-gradient-to-b from-white to-gray-100";
  const textColor = selectedMode === "dark" ? "text-white" : "text-black";
  const buttonBgColor =
    selectedMode === "dark"
      ? "bg-gradient-to-b from-black to-gray-900"
      : "bg-black";
  const buttonTextColor = selectedMode === "dark" ? "text-white" : "text-white";
  const buttonHoverBgColor =
    selectedMode === "dark" ? "hover:bg-gray-200" : "hover:bg-gray-800";

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        await fetch("/api/emptycart", {
          method: "DELETE",
        });
        // Check if the email has already been sent for the current order_id
        const sentOrders = JSON.parse(localStorage.getItem("sentOrders")) || [];
    
          setLoading(false)
          // If the order has already been processed (email sent), skip sending the email
        // if (sentOrders.includes(id)) {
        //   console.log("Email already sent for this order.");
        //   return;
        // }
    
        // Fetch the order details
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
          setLoading(false)
          // Send the email via emailjs
          if (!sentOrders.includes(id)) {
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
              from_name: "The Tanning Salon",
            },
            {
              publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
            }
          );}
          console.log("result.data",result.data)
          setOrder(result.data)
          // Mark this order as processed by adding its order_id to the list
          sentOrders.push(order_id);
          localStorage.setItem("sentOrders", JSON.stringify(sentOrders));
          
          console.log("Email sent for order", order_id);
        } else {
          console.error("Failed to fetch order details:", result.message);
          // You can redirect or show a fallback message here if needed
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        // You can redirect or show a fallback message here if needed
      }
    };
    ;

    fetchOrderDetails();
  }, [router, id]);

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${bgColor} ${textColor}`}
      >
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${bgColor} ${textColor}`}
      >
        <p className="text-2xl">No order found. Please try again.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${bgColor} ${textColor}`}>
      <br />
      <br />
      <div className={`max-w-3xl mx-auto ${bgColor} shadow-lg rounded-lg p-6`}>
        <h3 className="text-3xl font-bold mb-6">Order Confirmation</h3>

        <div className="mb-8">
          <h4 className="text-2xl font-semibold mb-4">Order Details</h4>
          <div
            className={`border-b pb-4 ${
              selectedMode === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Order Type:</strong> {order.orderType}
            </p>
            <p>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Payment Status:</strong> {order.paymentStatus}
            </p>
            <p>
              <strong>Order Status:</strong> {order.statusForUser}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="text-2xl font-semibold mb-4">Items</h4>
          <div className="space-y-4">
            {order?.productRef?.map((product) => (
              <div
                key={product?._id}
                className={`flex items-center justify-between border-b pb-4 ${
                  selectedMode === "dark"
                    ? "border-gray-700"
                    : "border-gray-200"
                }`}
              >
                <div>
                  <h5 className="font-medium text-lg">{product?.name}</h5>
                  <p
                    className={`text-sm ${
                      selectedMode === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    Product
                  </p>
                </div>
                <div className="text-xl font-semibold">
                  £{product?.price?.toFixed(2)}
                </div>
              </div>
            ))}
            {order?.packageRef?.map((pkg) => (
              <div
                key={pkg?._id}
                className={`flex items-center justify-between border-b pb-4 ${
                  selectedMode === "dark"
                    ? "border-gray-700"
                    : "border-gray-200"
                }`}
              >
                <div>
                  <h5 className="font-medium text-lg">{pkg?.name}</h5>
                  <p
                    className={`text-sm ${
                      selectedMode === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    Package
                  </p>
                </div>
                <div className="text-xl font-semibold">
                  £{pkg?.price?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 text-lg">
          <p className="flex justify-between">
            <span>Total Amount:</span>{" "}
            <span>£{order?.totalAmount?.toFixed(2)}</span>
          </p>
          {order.couponDiscountAmount > 0 && (
            <p className="flex justify-between">
              <span>Coupon Discount:</span>{" "}
              <span>-£{order?.couponDiscountAmount?.toFixed(2)}</span>
            </p>
          )}
          <p className="flex justify-between font-bold mt-2">
            <span>Final Total:</span>{" "}
            <span>
              £
              {(order?.totalAmount - (order?.couponDiscountAmount || 0))?.toFixed(
                2
              )}
            </span>
          </p>
        </div>

        {order.orderType === "pickup" && (
          <div className="mb-8">
            <h4 className="text-2xl font-semibold mb-4">Pickup Instructions</h4>
            <p>
              Please bring your Order ID and a valid ID when picking up your
              order.
            </p>
          </div>
        )}

        <button
          onClick={() => router.push("/")}
          className={`w-full py-3 ${buttonBgColor} ${buttonTextColor} rounded-lg font-semibold ${buttonHoverBgColor} transition duration-300`}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
