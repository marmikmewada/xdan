'use client';

import { useState, useEffect } from "react";
import useStore from "../store/useStore"
import { useRouter } from "next/navigation";

export default function CartPage() {
    const router = useRouter();

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const {cartCount,setCartCount } = useStore();

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
            const response = await fetch(`${baseUrl}/api/getcart`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();

            if (!result.success) {
                console.log(result.message || "Failed to fetch cart.");
            } else {
                console.log("result.data.items.length",result.data.items.length)
                // setCartCount(result.data.items.length)
                setCartItems(result.data.items || []);
                setCartTotal(result.data.cartTotal || 0);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Increase Quantity
    const handleIncreaseQuantity = async (itemId) => {
        try {
            const response = await fetch(`${baseUrl}/api/increasecart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId }),
            });

            const result = await response.json();
            if (!result.success) {
                console.log(result.message || "Failed to increase quantity.");
            } else {
                fetchCart(); // Refresh cart
                router.refresh()
                console.log("Quantity increased.");
        
            }
        } catch (error) {
            console.error("Error increasing quantity:", error);
        }
    };

    // Handle Decrease Quantity
    const handleDecreaseQuantity = async (itemId) => {
        try {
            const response = await fetch(`${baseUrl}/api/decreasecart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId }),
            });

            const result = await response.json();
            if (!result.success) {
                console.log(result.message || "Failed to decrease quantity.");
            } else {
                fetchCart(); // Refresh cart
                console.log("Quantity decreased.");
                router.refresh()
            }
        } catch (error) {
            console.error("Error decreasing quantity:", error);
        }
    };

    // Handle Remove Item
    const handleRemoveItem = async (itemId) => {
        try {
            const response = await fetch(`${baseUrl}/api/removeitemfromcart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId }),
            });

            const result = await response.json();
            if (!result.success) {
                console.log(result.message || "Failed to remove item.");
            } else {
                fetchCart(); // Refresh cart
                console.log("Item removed.");
                router.refresh()
            }
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    // Handle Empty Cart
    const handleEmptyCart = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/emptycart`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();
            if (!result.success) {
                console.log(result.message || "Failed to empty cart.");
            } else {
                fetchCart(); // Refresh cart
                router.refresh()
                console.log("Cart emptied.");
            }
        } catch (error) {
            console.error("Error emptying cart:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
                    Your Cart
                </h1>

                {loading ? (
                    <div className="text-center text-gray-600">
                        <p>Loading your cart...</p>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center text-gray-600">
                        <p>Your cart is empty. Start adding items!</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="divide-y divide-gray-200">
                                {cartItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-6 flex justify-between items-center"
                                    >
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800">
                                                {item.name}
                                            </h2>
                                            <p className="text-sm text-gray-600 capitalize">
                                                {item.type}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => handleDecreaseQuantity(item.itemId)}
                                                className="text-sm font-semibold text-gray-600 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                                            >
                                                -
                                            </button>
                                            <button
                                                onClick={() => handleIncreaseQuantity(item.itemId)}
                                                className="text-sm font-semibold text-gray-600 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => handleRemoveItem(item.itemId)}
                                                className="text-sm font-semibold text-red-600 bg-red-200 px-3 py-1 rounded hover:bg-red-300"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="text-lg font-bold text-orange-500">
                                            £{item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 text-right">
                                <p className="text-xl font-bold text-gray-800">
                                    Total: £{cartTotal}
                                </p>
                                <button
                                    onClick={handleEmptyCart}
                                    className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                                >
                                    Empty Cart
                                </button>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button onClick={() => router.push("/checkout")} className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
