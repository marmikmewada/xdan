"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "../store/useStore";

const CheckoutPage = () => {
  const navigate = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const { cartCount, setCartCount } = useStore();
  const { selectedMode } = useStore();

  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [orderType, setOrderType] = useState('pickup');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [notification, setNotification] = useState(null);

  const bgColor = selectedMode === "dark"
    ? "bg-gradient-to-b from-black to-gray-900"
    : "bg-gradient-to-b from-white to-gray-100";
  const textColor = selectedMode === "dark" ? "text-white" : "text-black";
  const buttonBgColor = selectedMode === "dark" ? "bg-gradient-to-b from-black to-gray-900" : "bg-black";
  const buttonTextColor = selectedMode === "dark" ? "text-white" : "text-white";
  const buttonHoverBgColor = selectedMode === "dark" ? "hover:bg-gray-200" : "hover:bg-gray-800";
  const inputBgColor = selectedMode === "dark" ? "bg-gray-800" : "bg-white";
  const inputBorderColor = selectedMode === "dark" ? "border-gray-700" : "border-gray-300";

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/getcart`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (result.success) {
          setCartCount(result.data.items.length);
          setCart(result.data.items || []);
          setTotalAmount(result.data.cartTotal || 0);
        } else {
          navigate.push("/")
          console.log(result.message || "Failed to fetch cart.");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  const handleStripePayment = async () => {
    try {
      setLoading(true);

      const orderData = {
        paymentMethod: 'stripe',
        orderType,
        deliveryAddress: formatDeliveryAddress(),
        cartItems: cart,
        totalAmount: totalAmount + deliveryCharges,
        couponCode,
      };

      console.log("orderData",orderData)

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();

      if (responseData.success) {
        console.log("stripeUrl",responseData.data.stripeUrl)
        navigate.push(responseData.data.stripeUrl)
      } else {
        console.log(responseData.message);
        setNotification({ type: 'error', message: "Payment failed. Please try again." });
      }
    } catch (error) {
      console.error("Error during Stripe payment:", error);
      setNotification({ type: 'error', message: "Payment failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentOnPickup = async () => {
    try {
      setLoading(true);

      const orderData = {
        paymentMethod: 'pay-on-pickup',
        orderType,
        deliveryAddress: formatDeliveryAddress(),
        cartItems: cart,
        totalAmount: totalAmount + deliveryCharges,
        couponCode,
      };
      console.log("orderData",orderData)

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();

      if (responseData.success) {
        await fetch("/api/emptycart",{ method: 'DELETE'})
        const {_id}=responseData.data||{}
        navigate.push(`/order-confirmation/${_id}`);
        navigate.refresh()
      } else {
        setNotification({ type: 'error', message: responseData.message });
      }
    } catch (error) {
      console.error("Error processing payment on pickup:", error);
      setNotification({ type: 'error', message: "Order placement failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => setStreetAddress(e.target.value);
  const handleCityChange = (e) => setCity(e.target.value);
  const handlePostcodeChange = (e) => setPostcode(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);

  const handleOrderTypeChange = (e) => {
    setOrderType(e.target.value);
    setDeliveryCharges(e.target.value === "delivery" ? 7.5 : 0);
  };

  const formatDeliveryAddress = () => {
    return `${streetAddress}, ${city}, ${postcode}, Phone: ${phone}`;
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const verifyCoupon = async () => {
    try {
      const response = await fetch("/api/verify-coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ couponCode }),
      });
  
      const data = await response.json();
      if (response.ok) {
        const discountPercentage = data.discountPercentage;
        const discountAmount = (totalAmount * discountPercentage) / 100;
        setCouponDiscount(discountAmount);
        setNotification({ type: 'success', message: "Coupon applied successfully!" });
      } else {
        setNotification({ type: 'error', message: data.message});
        setCouponDiscount(0);
      }
    } catch (error) {
      console.error("Error verifying coupon:", error);
      setNotification({ type: 'error', message: "Error verifying coupon. Please try again." });
    }
  };

  const final_amount = totalAmount + deliveryCharges - couponDiscount;

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${bgColor} ${textColor}`}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${bgColor} ${textColor}`}>
      <br />
      <br />
      <div className={`max-w-3xl mx-auto ${bgColor} shadow-lg rounded-lg p-6`}>
        <h3 className="text-3xl font-bold mb-6">Order Summary</h3>

        {notification && (
          <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : `${buttonBgColor} ${buttonTextColor}`
          }`}>
            {notification.message}
          </div>
        )}

        <div className="mb-8">
          <h4 className="text-2xl font-semibold mb-4">Cart Items</h4>
          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.itemId} className={`flex items-center justify-between border-b pb-4 ${selectedMode === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                  <div>
                    <h5 className="font-medium text-lg">{item.name}</h5>
                    <p className={`text-sm ${selectedMode === "dark" ? "text-gray-400" : "text-gray-600"}`}>{item.type === 'product' ? "Product" : "Package"}</p>
                  </div>
                  <div className="text-xl font-semibold">£{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        <div className="mb-8 text-lg">
          <p className="flex justify-between"><span>Total Amount:</span> <span>£{totalAmount.toFixed(2)}</span></p>
          {deliveryCharges > 0 && (
            <p className="flex justify-between"><span>Delivery Charges:</span> <span>£{deliveryCharges.toFixed(2)}</span></p>
          )}
          {couponDiscount > 0 && (
            <p className="flex justify-between"><span>Coupon Discount:</span> <span>-£{couponDiscount.toFixed(2)}</span></p>
          )}
          <p className="flex justify-between font-bold mt-2"><span>Final Total:</span> <span>£{final_amount.toFixed(2)}</span></p>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Coupon Code</label>
          <div className="flex">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className={`flex-grow ${inputBgColor} ${textColor} ${inputBorderColor} rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              onClick={verifyCoupon}
              className={`${buttonBgColor} ${buttonTextColor} px-6 py-2 rounded-r-lg font-semibold ${buttonHoverBgColor} transition duration-300`}
            >
              Apply
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Payment Method</label>
          <select
            className={`block w-full ${inputBgColor} ${textColor} ${inputBorderColor} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="pay-on-pickup">Pay on Pickup</option>
            <option value="stripe">Stripe</option>
          </select>
        </div>

        {paymentMethod === 'stripe' && (
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Order Type</label>
            <select
              className={`block w-full ${inputBgColor} ${textColor} ${inputBorderColor} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={orderType}
              onChange={handleOrderTypeChange}
            >
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
        )}

        {orderType === 'delivery' &&paymentMethod === 'stripe' && (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-lg font-medium mb-2">Street Address</label>
              <input
                type="text"
                value={streetAddress}
                onChange={handleAddressChange}
                placeholder="Enter your street address"
                className={`w-full ${inputBgColor} ${textColor} ${inputBorderColor} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">City</label>
              <input
                type="text"
                value={city}
                onChange={handleCityChange}
                placeholder="Enter your city"
                className={`w-full ${inputBgColor} ${textColor} ${inputBorderColor} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">Postcode</label>
              <input
                type="text"
                value={postcode}
                onChange={handlePostcodeChange}
                placeholder="Enter your postcode"
                className={`w-full ${inputBgColor} ${textColor} ${inputBorderColor} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter your phone number"
                className={`w-full ${inputBgColor} ${textColor} ${inputBorderColor} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>
        )}

        {paymentMethod === 'stripe' ? (
          <button
            onClick={handleStripePayment}
            className={`w-full py-3 ${buttonBgColor} ${buttonTextColor} rounded-lg font-semibold ${buttonHoverBgColor} transition duration-300`}
          >
            Pay With Card
          </button>
        ) : (
          <button
            onClick={handlePaymentOnPickup}
            className={`w-full py-3 ${buttonBgColor} ${buttonTextColor} rounded-lg font-semibold ${buttonHoverBgColor} transition duration-300`}
          >
            Place Order
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;






















// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import useStore from "../store/useStore";
// import dynamic from 'next/dynamic';

// const CheckoutPage = () => {
//   const navigate = useRouter();
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL;
//   const { cartCount, setCartCount } = useStore();
//   const {selectedMode} = useStore();

//   const [loading, setLoading] = useState(true);
//   const [cart, setCart] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState('stripe');
//   const [orderType, setOrderType] = useState('pickup');
//   const [streetAddress, setStreetAddress] = useState('');
//   const [city, setCity] = useState('');
//   const [postcode, setPostcode] = useState('');
//   const [phone, setPhone] = useState('');
//   const [deliveryCharges, setDeliveryCharges] = useState(0);
//   const [couponCode, setCouponCode] = useState('');
//   const [couponDiscount, setCouponDiscount] = useState(0);
//   const [notification, setNotification] = useState(null); // For showing error/success messages
//   console.log("notification",notification)
//   console.log(selectedMode);

//   useEffect(() => {
//     const fetchCart = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(`/api/getcart`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         const result = await response.json();
//         if (result.success) {
//           setCartCount(result.data.items.length);
//           setCart(result.data.items || []);
//           setTotalAmount(result.data.cartTotal || 0);
//         } else {
//           navigate.push("/")
//           console.log(result.message || "Failed to fetch cart.");
//         }
//       } catch (error) {
//         console.error("Error fetching cart:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCart();
//   }, [navigate]);

//   const handleStripePayment = async () => {
//     try {
//       setLoading(true);

//       const orderData = {
//         paymentMethod: 'stripe',
//         orderType,
//         deliveryAddress: formatDeliveryAddress(),
//         cartItems: cart,
//         totalAmount: totalAmount + deliveryCharges,
//         couponCode,
//       };

//       const response = await fetch('/api/checkout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(orderData),
//       });

//       const responseData = await response.json();

//       if (responseData.success) {
//         navigate.push(responseData.order.stripeUrl)
//         // window.location.href = responseData.order.stripeUrl;
//       } else {
//         console.log(responseData.message);
//         // alert("Payment failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error during Stripe payment:", error);
//       alert("Payment failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePaymentOnPickup = async () => {
//     try {
//       setLoading(true);

//       const orderData = {
//         paymentMethod: 'pay-on-pickup',
//         orderType,
//         deliveryAddress: formatDeliveryAddress(),
//         cartItems: cart,
//         totalAmount: totalAmount + deliveryCharges,
//         couponCode,
//       };

//       const response = await fetch('/api/checkout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(orderData),
//       });

//       const responseData = await response.json();

//       if (responseData.success) {
//         await fetch("/api/emptycart",{ method: 'DELETE'})
//         // alert("Order placed successfully. Please pick up your items.");
//         navigate.push("/order-confirmation");
//       } else {
//         alert(responseData.message);
//       }
//     } catch (error) {
//       console.error("Error processing payment on pickup:", error);
//       alert("Order placement failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddressChange = (e) => {
//     setStreetAddress(e.target.value);
//   };

//   const handleCityChange = (e) => {
//     setCity(e.target.value);
//   };

//   const handlePostcodeChange = (e) => {
//     setPostcode(e.target.value);
//   };

//   const handlePhoneChange = (e) => {
//     setPhone(e.target.value);
//   };

//   const handleOrderTypeChange = (e) => {
//     setOrderType(e.target.value);
//     if (e.target.value === "delivery") {
//       setDeliveryCharges(7.5); // Add delivery charges for delivery orders
//     } else {
//       setDeliveryCharges(0); // No delivery charges for pickup
//     }
//   };

//   const formatDeliveryAddress = () => {
//     // Merge street, city, postcode, and phone into one address string
//     return `${streetAddress}, ${city}, ${postcode}, Phone: ${phone}`;
//   };

//   useEffect(() => {
//     if (notification) {
//         const timer = setTimeout(() => {
//             setNotification(null); // Hide notification after 3 seconds
//         }, 3000);
//         return () => clearTimeout(timer);
//     }
// }, [notification]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="spinner"></div> {/* Add your spinner or loading indicator here */}
//       </div>
//     );
//   }

//   const verifyCoupon = async () => {
//     try {
//       const response = await fetch("/api/verify-coupon", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ couponCode }),
//       });
  
//       const data = await response.json();
//       if (response.ok) {
//         const discountPercentage = data.discountPercentage;

//       // Update the coupon discount state
      
//       // Calculate the discount amount
//       const discountAmount = (totalAmount * discountPercentage) / 100;
//       setCouponDiscount(discountAmount);
//       console.log("discountAmount",discountAmount)

//       // Update the total amount after applying the discount
//       const updatedTotalAmount = totalAmount - discountAmount;
//       console.log("updatedTotalAmount",updatedTotalAmount)
//       // setTotalAmount(updatedTotalAmount);
//       } else {
//         setNotification({ type: 'error', message: data.message});
//         setCouponDiscount(0);
//         console.error(data.message);
//       }
//     } catch (error) {
//       console.error("Error verifying coupon:", error);
//     }
//   };

  
  

//   const final_amount=deliveryCharges&&couponDiscount?totalAmount+deliveryCharges-couponDiscount:deliveryCharges?totalAmount+deliveryCharges:couponDiscount?totalAmount-couponDiscount:0
//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>

//         {notification && (
//                     <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg ${
//                         notification.type === 'success' 
//                             ? 'bg-green-500 text-white' 
//                             : 'bg-gradient-to-b from-black to-gray-900 text-white'
//                     }`}>
//                         {notification.message}
//                     </div>
//                 )}
//         {/* Cart Items Display */}
//         <div className="mb-6">
//           <h4 className="text-xl font-semibold mb-3">Cart Items</h4>
//           {cart.length > 0 ? (
//             <div className="space-y-4">
//               {cart.map((item) => (
//                 <div key={item.itemId} className="flex items-center justify-between border-b pb-3">
//                   <div className="flex items-center">
//                     <div>
//                       <h5 className="font-medium">{item.name}</h5>
//                       <p className="text-sm text-gray-500">{item.type === 'product' ? "Product" : "Package"}</p>
//                     </div>
//                   </div>
//                   <div className="text-lg font-semibold">£{item.price * item.quantity}</div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p>Your cart is empty.</p>
//           )}
//         </div>

//         {/* Cart Total */}
//         <div className="mb-6">
//           <p><strong>Total Amount: </strong>£{totalAmount}</p>
//           {deliveryCharges > 0 && (
//             <p><strong>Delivery Charges: </strong>£{deliveryCharges}</p>
//           )}
//           {couponDiscount > 0 && (
//             <p><strong>Coupon Discount: </strong>£{couponDiscount}</p>
//           )}
//           {final_amount > 0&&
//           <p><strong>Final Total: </strong>£{final_amount} </p>
//           }
//           {/* <p><strong>Final Total: </strong>£{deliveryCharges?deliveryCharges+totalAmount :totalAmount-couponDiscount}</p> */}
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
//           <input
//             type="text"
//             value={couponCode}
//             onChange={(e) => setCouponCode(e.target.value)}
//             placeholder="Enter coupon code (optional)"
//             className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2"
//           />
//            <button
//               onClick={verifyCoupon}
//               className="py-2 px-6 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600"
//             >
//               Apply
//             </button>
//         </div>

//         {/* Payment Method Selection */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Payment Method</label>
//           <select
//             className="block w-full mt-2 border border-gray-300 rounded-lg px-4 py-2"
//             value={paymentMethod}
//             onChange={(e) => setPaymentMethod(e.target.value)}
//           >
//             <option value="pay-on-pickup">Pay on Pickup</option>
//             <option value="stripe">Stripe</option>
//           </select>
//         </div>

//         {/* Conditionally render Order Type dropdown */}
//         {paymentMethod === 'stripe' && (
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Order Type</label>
//             <select
//               className="block w-full mt-2 border border-gray-300 rounded-lg px-4 py-2"
//               value={orderType}
//               onChange={handleOrderTypeChange}
//             >
//               <option value="pickup">Pickup</option>
//               <option value="delivery">Delivery</option>
//             </select>
//           </div>
//         )}

//         {/* Delivery Address Input */}
//         {orderType === 'delivery' && (
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Street Address</label>
//             <input
//               type="text"
//               value={streetAddress}
//               onChange={handleAddressChange}
//               placeholder="Enter your street address"
//               className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2"
//             />
//             <label className="block text-sm font-medium text-gray-700 mt-2">City</label>
//             <input
//               type="text"
//               value={city}
//               onChange={handleCityChange}
//               placeholder="Enter your city"
//               className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2"
//             />
//             <label className="block text-sm font-medium text-gray-700 mt-2">Postcode</label>
//             <input
//               type="text"
//               value={postcode}
//               onChange={handlePostcodeChange}
//               placeholder="Enter your postcode"
//               className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2"
//             />
//             <label className="block text-sm font-medium text-gray-700 mt-2">Phone Number</label>
//             <input
//               type="text"
//               value={phone}
//               onChange={handlePhoneChange}
//               placeholder="Enter your phone number"
//               className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2"
//             />
//           </div>
//         )}

//         {/* Stripe Payment Option */}
//         {paymentMethod === 'stripe' && (
//           <div className="mb-4">
//             <button
//               onClick={handleStripePayment}
//               className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
//             >
//               Pay With Card
//             </button>
//           </div>
//         )}

//         {/* Pay on Pickup Option */}
//         {paymentMethod === 'pay-on-pickup' && (
//           <button
//             onClick={handlePaymentOnPickup}
//             className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
//           >
//             Place Order
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
