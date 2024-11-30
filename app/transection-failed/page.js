"use client"
import { useRouter } from 'next/navigation';

export default function PaymentFailed() {
  const router = useRouter();

  const backToCart = () => {
    router.push('/cart'); // Redirect to the cart page
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-lg text-gray-700 mb-6">Sorry, something went wrong with your payment. Please try again later.</p>
        <div className="flex justify-center">
          <button
            onClick={backToCart}
            className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
