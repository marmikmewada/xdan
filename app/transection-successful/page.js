"use client"
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(()=>{
const hanldeEmptyCart=async()=>{
  await fetch("/api/emptycart")
}
hanldeEmptyCart()
  },[])

  // Handle redirection to the profile page
  const trackOrder = () => {
    router.push('/profile'); // Redirect to the user's profile page
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-lg text-gray-700 mb-6">Thank you for your purchase. Your payment has been successfully processed.</p>
        
        {/* Buttons */}
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={trackOrder}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Order Status
          </button>
        </div>
      </div>
    </div>
  );
}
