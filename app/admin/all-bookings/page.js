"use client";
import { useEffect, useState } from 'react';
 // Optional: for formatting dates
import useStore from '@/app/store/useStore';  // Assuming your store hook for dark/light mode
import {  useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

const BookingsPage = () => {
  const { data: session,status } = useSession(); 
  const { user } = session || {};
const { role } = user || {};
const router = useRouter();
 useEffect(() => {
    if (status !== "loading" && (role !== "admin" && role !== "staff")) {
      router.back();
    }
  }, [role, router, status]);
  const { selectedMode } = useStore();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today

  // Fetch bookings whenever the date changes
  useEffect(() => {
    const fetchBookingsData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/getallbookings?date=${selectedDate}`);
        const data = await response.json();

        if (response.ok) {
          setBookings(data.data || []);
        } else {
          throw new Error(data.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsData();
  }, [selectedDate]);

  // Define CSS class based on mode
  const gradientClass = selectedMode === 'dark' ? 'bg-gradient-to-b from-gray-800 to-black' : 'bg-gradient-to-b from-white to-gray-200';
  const textClass = selectedMode === 'dark' ? 'text-white' : 'text-gray-900';
  const inputClass = selectedMode === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300';
  const tableClass = selectedMode === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300';

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');  // Month is 0-based, so +1
    const day = d.getDate().toString().padStart(2, '0');
    // const hours = d.getHours().toString().padStart(2, '0');
    // const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  return (
    <div className={`min-h-screen ${gradientClass} ${textClass} p-8`}>
      <br />
      <br />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Bookings</h1>

        {/* Date Filter */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <label className="block text-sm font-medium">Filter by Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`border rounded-md p-2 w-full sm:w-auto ${inputClass}`}
          />
        </div>

        {/* Loading State */}
        {loading && <div className="text-center p-4">Loading...</div>}

        {/* Error State */}
        {error && <div className="bg-red-100 text-red-600 p-4 rounded-lg shadow-md mb-4">{error}</div>}

        {/* No Data State */}
        {bookings.length === 0 && !loading && (
          <div className="bg-gray-100 text-gray-700 p-6 rounded-lg shadow-md text-center">
            <p>No bookings found for the selected date.</p>
          </div>
        )}

        {/* Table of Bookings */}
        {bookings.length > 0 && !loading && (
          <div className="overflow-x-auto shadow-md border-b border-gray-200 rounded-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${inputClass}`}>User</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${inputClass}`}>Store</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${inputClass}`}>Bed</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${inputClass}`}>Booking Date</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${inputClass}`}>Time</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                    return (
                  <tr key={booking._id} className={`${tableClass} border-t`}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ${inputClass}`}>{booking?.userRef?.name}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${inputClass}`}>{booking?.storeRef?.name}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${inputClass}`}>{booking?.bedRef?.bedName}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${inputClass}`}>
                      {formatDate(new Date(booking.date))}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${inputClass}`}>
                      {`${booking.timeSlots[0].startTime}: ${booking.timeSlots[0].endTime}`}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                    </td> */}
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
