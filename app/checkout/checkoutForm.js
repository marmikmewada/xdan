// /app/checkout/checkoutForm.js
'use client';

import { useState } from 'react';
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ paymentMethod, cartTotal, cartItems, shippingAddress, setShippingAddress }) => {
    // const stripe = useStripe();
    // const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        if (paymentMethod === 'stripe') {
            // const cardElement = elements.getElement(CardElement);
            // if (!cardElement) {
            //     setError('Card element is missing');
            //     setIsProcessing(false);
            //     return;
            // }

            // Handle Stripe payment processing here
            // const { error, paymentIntent } = await stripe.confirmCardPayment(
            //     'your_stripe_client_secret', // Replace with your Stripe client secret
            //     {
            //         payment_method: {
            //             card: cardElement,
            //             billing_details: {
            //                 name: 'Customer Name',
            //                 email: 'customer@example.com',
            //                 address: shippingAddress,
            //             },
            //         },
            //     }
            // );

            // if (error) {
            //     setError(error.message);
            // } else if (paymentIntent.status === 'succeeded') {
            //     setIsSuccessful(true);
            //     // Optionally, save the payment and order details in your backend here
            // }

            setIsProcessing(false);
        } else {
            // Handle pay-on-pickup payment logic here (you could skip Stripe handling if selected)
            setIsSuccessful(true);
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl font-semibold">Shipping Address</h3>
            <div>
                <label className="block text-lg">Street Address</label>
                <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md"
                />
            </div>
            <div>
                <label className="block text-lg">City</label>
                <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md"
                />
            </div>
            <div>
                <label className="block text-lg">State</label>
                <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md"
                />
            </div>
            <div>
                <label className="block text-lg">Zip Code</label>
                <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md"
                />
            </div>

            {/* {paymentMethod === 'stripe' && (
                <div>
                    <label className="block text-lg">Card Details</label>
                    <div className="p-3 border border-gray-300 rounded-md">
                        <CardElement />
                    </div>
                </div>
            )} */}

            {error && <p className="text-red-500">{error}</p>}
            {isSuccessful && (
                <p className="text-green-500">Payment successful! Your order is being processed.</p>
            )}

            <button
                type="submit"
                disabled={isProcessing}
                className={`w-full p-3 mt-6 text-white font-semibold rounded-md ${isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isProcessing ? 'Processing...' : 'Complete Order'}
            </button>
        </form>
    );
};

export default CheckoutForm;
