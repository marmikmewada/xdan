"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/app/store/useStore"; // Assuming your store hook for dark/light mode

const BookingSuccessPage = ({params}) => {
    
  const { selectedMode } = useStore();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } =params||{}; // Get the booking ID from the URL

  useEffect(() => {
    if (!id) return; // Wait until the ID is available

    // Fetch the booking details using the API
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`/api/get-booking/${id}`);
        const data = await response.json();

        if (response.ok) {
          setBookingDetails(data.data); // Store the booking details in the state
        } else {
          throw new Error(data.message || "Failed to fetch booking details");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  // Define CSS class based on mode
  const gradientClass = selectedMode === "dark" ? "bg-gradient-to-b from-gray-800 to-black" : "bg-gradient-to-b from-white to-gray-200";
  const textClass = selectedMode === "dark" ? "text-white" : "text-gray-900";
  const buttonClass = selectedMode === "dark" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white";

  if (loading) return <div className="text-center p-4">Loading...</div>;

  if (error) return <div className="bg-red-100 text-red-600 p-4 rounded-lg shadow-md mb-4">{error}</div>;

  return (
    <div className={`min-h-screen ${gradientClass} ${textClass} p-8`}>
      <br />
      <br />
      <br />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Booking Successful!</h1>

        {/* Display Booking Details */}
        {bookingDetails && (
          <div className="mb-6">
            <p className="text-lg mb-4">Your booking for the bed {bookingDetails?.bedRef?.bedName} has been successfully completed.</p>
            <p className="text-md mb-4">
              <strong>Booking ID:</strong> {bookingDetails._id}
            </p>
            <p className="text-md mb-4">
              <strong>Store:</strong> {bookingDetails?.storeRef?.name} - {bookingDetails?.storeRef?.address}
            </p>
            {/* <p className="text-md mb-4">
              <strong>Package:</strong> {bookingDetails?.packageRef?.packageName} - ${bookingDetails?.packageRef?.price}
            </p> */}
            <p className="text-md mb-4">
              <strong>Booking Date:</strong> {new Date(bookingDetails.date).toLocaleDateString()}
            </p>
            <p className="text-md mb-6">
              <strong>Time Slot:</strong> {bookingDetails.timeSlots[0].startTime} - {bookingDetails.timeSlots[0].endTime}
            </p>
          </div>
        )}

        {/* Redirection Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/profile/my-bookings')}
            className={`px-6 py-3 rounded-md ${buttonClass}`}
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
