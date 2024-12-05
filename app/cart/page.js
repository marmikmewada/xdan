'use client';

import { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { useRouter } from 'next/navigation';
import { FaTrashAlt } from 'react-icons/fa'; // Import delete icon

export default function CartPage() {
  const router = useRouter();
  const { selectedMode } = useStore(); // Pull the selected mode (light or dark) from global store

  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch cart on load
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getcart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (!result.success) {
        console.log(result.message || 'Failed to fetch cart.');
      } else {
        setCartItems(result.data.items || []);
        setCartTotal(result.data.cartTotal || 0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseQuantity = async (itemId) => {
    try {
      const response = await fetch(`/api/increasecart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });

      const result = await response.json();
      if (!result.success) {
        console.log(result.message || 'Failed to increase quantity.');
      } else {
        fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  const handleDecreaseQuantity = async (itemId) => {
    try {
      const response = await fetch(`/api/decreasecart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });

      const result = await response.json();
      if (!result.success) {
        console.log(result.message || 'Failed to decrease quantity.');
      } else {
        fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await fetch(`/api/removeitemfromcart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });

      const result = await response.json();
      if (!result.success) {
        console.log(result.message || 'Failed to remove item.');
      } else {
        fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleEmptyCart = async () => {
    try {
      const response = await fetch(`/api/emptycart`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      if (!result.success) {
        console.log(result.message || 'Failed to empty cart.');
      } else {
        fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error emptying cart:', error);
    }
  };

  const containerClass = selectedMode === 'dark' ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200';
  const textColorClass = selectedMode === 'dark' ? 'text-white' : 'text-gray-900';
  const buttonClass = selectedMode === "dark" ? "bg-gradient-to-r from-gray-800 to-black text-white" : "bg-white";
  const totalTextColorClass = selectedMode === 'dark' ? 'text-gray-300' : 'text-gray-800';
  const cartBackgroundClass = selectedMode === 'dark' ? 'bg-gradient-to-b from-gray-800 via-gray-800 to-black' : 'bg-gradient-to-b from-gray-100 via-gray-100 to-gray-200';

  return (
    <div className={`min-h-screen ${containerClass}`}>
        <br />
        <br />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* <h1 className={`text-3xl md:text-4xl font-bold text-center mb-8 ${textColorClass}`}>Your Cart</h1> */}

        {loading ? (
          <div className="text-center text-gray-600">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Your cart is empty. Start adding items!</p>
          </div>
        ) : (
          <div className={`shadow-lg rounded-lg overflow-hidden ${cartBackgroundClass}`}>
            <div className="divide-y divide-gray-200">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className={`p-6 flex justify-between items-center ${selectedMode === 'dark' ? 'text-white' : 'text-black'}`}
                >
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleDecreaseQuantity(item.itemId)}
                      className="text-sm font-semibold text-gray-600 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition duration-300"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleIncreaseQuantity(item.itemId)}
                      className="text-sm font-semibold text-gray-600 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition duration-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.itemId)}
                      className="text-sm font-semibold text-black bg-white p-3 rounded-full hover:bg-gray-300 transition duration-300"
                    >
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-lg font-bold text-orange-500">£{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="p-6 text-right">
              <p className={`text-xl font-bold ${totalTextColorClass}`}>Total: £{cartTotal}</p>
              <button
                onClick={handleEmptyCart}
                className={`mt-4 px-6 py-3 bg-gradient-to-b ${selectedMode === 'dark' ? 'bg-gradient-to-r from-gray-800 to-black text-white' : 'black'} text-black  font-sm hover:bg-red-800 transition-all`}
                // "dark" ? "bg-gradient-to-r from-gray-800 to-black text-white" : "bg-white"
              >
                Empty Cart
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push('/checkout')}
            className={`px-6 py-2 ${buttonClass} font-bold text-sm shadow-lg transition-all duration-300 hover:scale-105 active:scale-95`}
            // w-full py-2 px-4 text-sm font-semibold text-center transition-all duration-300 transform group-hover:scale-105
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}





// 'use client';

// import { useState, useEffect } from "react";
// import useStore from "../store/useStore"
// import { useRouter } from "next/navigation";

// export default function CartPage() {
//     const router = useRouter();

//     const baseUrl = process.env.NEXT_PUBLIC_API_URL;
//     const {cartCount,setCartCount } = useStore();

//     const [cartItems, setCartItems] = useState([]);
//     const [cartTotal, setCartTotal] = useState(0);
//     const [loading, setLoading] = useState(true);
    
//     // Fetch cart on load
//     useEffect(() => {
//         fetchCart();
//     }, []);

//     const fetchCart = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(`/api/getcart`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });

//             const result = await response.json();

//             if (!result.success) {
//                 console.log(result.message || "Failed to fetch cart.");
//             } else {
//                 console.log("result.data.items.length",result.data.items.length)
//                 // setCartCount(result.data.items.length)
//                 setCartItems(result.data.items || []);
//                 setCartTotal(result.data.cartTotal || 0);
//             }
//         } catch (error) {
//             console.error("Error fetching cart:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle Increase Quantity
//     const handleIncreaseQuantity = async (itemId) => {
//         try {
//             const response = await fetch(`/api/increasecart`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ itemId }),
//             });

//             const result = await response.json();
//             if (!result.success) {
//                 console.log(result.message || "Failed to increase quantity.");
//             } else {
//                 fetchCart(); // Refresh cart
//                 router.refresh()
//                 console.log("Quantity increased.");
        
//             }
//         } catch (error) {
//             console.error("Error increasing quantity:", error);
//         }
//     };

//     // Handle Decrease Quantity
//     const handleDecreaseQuantity = async (itemId) => {
//         try {
//             const response = await fetch(`/api/decreasecart`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ itemId }),
//             });

//             const result = await response.json();
//             if (!result.success) {
//                 console.log(result.message || "Failed to decrease quantity.");
//             } else {
//                 fetchCart(); // Refresh cart
//                 console.log("Quantity decreased.");
//                 router.refresh()
//             }
//         } catch (error) {
//             console.error("Error decreasing quantity:", error);
//         }
//     };

//     // Handle Remove Item
//     const handleRemoveItem = async (itemId) => {
//         try {
//             const response = await fetch(`/api/removeitemfromcart`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ itemId }),
//             });

//             const result = await response.json();
//             if (!result.success) {
//                 console.log(result.message || "Failed to remove item.");
//             } else {
//                 fetchCart(); // Refresh cart
//                 console.log("Item removed.");
//                 router.refresh()
//             }
//         } catch (error) {
//             console.error("Error removing item:", error);
//         }
//     };

//     // Handle Empty Cart
//     const handleEmptyCart = async () => {
//         try {
//             const response = await fetch(`/api/emptycart`, {
//                 method: "DELETE",
//                 headers: { "Content-Type": "application/json" },
//             });

//             const result = await response.json();
//             if (!result.success) {
//                 console.log(result.message || "Failed to empty cart.");
//             } else {
//                 fetchCart(); // Refresh cart
//                 router.refresh()
//                 console.log("Cart emptied.");
//             }
//         } catch (error) {
//             console.error("Error emptying cart:", error);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//             <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//                 <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
//                     Your Cart
//                 </h1>

//                 {loading ? (
//                     <div className="text-center text-gray-600">
//                         <p>Loading your cart...</p>
//                     </div>
//                 ) : cartItems.length === 0 ? (
//                     <div className="text-center text-gray-600">
//                         <p>Your cart is empty. Start adding items!</p>
//                     </div>
//                 ) : (
//                     <>
//                         <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//                             <div className="divide-y divide-gray-200">
//                                 {cartItems.map((item, index) => (
//                                     <div
//                                         key={index}
//                                         className="p-6 flex justify-between items-center"
//                                     >
//                                         <div>
//                                             <h2 className="text-lg font-semibold text-gray-800">
//                                                 {item.name}
//                                             </h2>
//                                             <p className="text-sm text-gray-600 capitalize">
//                                                 {item.type}
//                                             </p>
//                                             <p className="text-sm text-gray-600">
//                                                 Quantity: {item.quantity}
//                                             </p>
//                                         </div>
//                                         <div className="flex items-center space-x-4">
//                                             <button
//                                                 onClick={() => handleDecreaseQuantity(item.itemId)}
//                                                 className="text-sm font-semibold text-gray-600 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
//                                             >
//                                                 -
//                                             </button>
//                                             <button
//                                                 onClick={() => handleIncreaseQuantity(item.itemId)}
//                                                 className="text-sm font-semibold text-gray-600 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
//                                             >
//                                                 +
//                                             </button>
//                                             <button
//                                                 onClick={() => handleRemoveItem(item.itemId)}
//                                                 className="text-sm font-semibold text-red-600 bg-red-200 px-3 py-1 rounded hover:bg-red-300"
//                                             >
//                                                 Remove
//                                             </button>
//                                         </div>
//                                         <div className="text-lg font-bold text-orange-500">
//                                             £{item.price * item.quantity}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="p-6 text-right">
//                                 <p className="text-xl font-bold text-gray-800">
//                                     Total: £{cartTotal}
//                                 </p>
//                                 <button
//                                     onClick={handleEmptyCart}
//                                     className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
//                                 >
//                                     Empty Cart
//                                 </button>
//                             </div>
//                         </div>
//                         <div className="mt-8 flex justify-center">
//                             <button onClick={() => router.push("/checkout")} className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
//                                 Proceed to Checkout
//                             </button>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }
