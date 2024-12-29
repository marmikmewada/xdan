'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useStore from "@/app/store/useStore"; // Assuming you have this Zustand store set up
import { useSession } from "next-auth/react";
import emailjs from "@emailjs/browser";

export default function EditLocationPage() {
    const { data: session } = useSession(); 
    const router = useRouter();
    const { id, date,bedId } = useParams();
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null); // For showing error/success messages
    const { selectedMode } = useStore();

    useEffect(() => {
        const fetchSlots = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/store/${id}/dates/${bedId}/slots?date=${date}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch available slots');
                }
                const data = await response.json();
                console.log("slot data", data);
    
                if (Array.isArray(data.slots)) {
                    setAvailableSlots(data.slots);
                } else {
                    setAvailableSlots([]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
    
        if (id && date) {
            fetchSlots();
        }
    }, [id, date]);
    
    const handleSlotSelect = (slot) => {
        if (slot.status !== 'available') {
            return;
        }
        setSelectedSlot(slot);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSlot) {
            setNotification({ type: 'error', message: 'Please select a slot before submitting.' });
            return;
        }
        if (!session) {
            router.push("/login");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/store/${id}/dates/${bedId}/slots/bookaslot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date,
                    timeSlots: [
                        { startTime: selectedSlot.startTime, endTime: selectedSlot.endTime }
                    ],
                }),
            });
            console.log("response", response);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to book the slot');
            }
            const {data} = await response.json();
            console.log("data",data)
            // console.log(" ~ handleSubmit ~ data:", data)
            const {userRef,bedRef,storeRef,timeSlots,date:booking_date}=data||{}
            await emailjs.send(
                process.env.NEXT_PUBLIC_SERVICE_ID,
                process.env.NEXT_PUBLIC_BOOKING_TEMPLATE_ID,
                {
                  to: userRef.email,
                  to_name: userRef.name,
                  store_name: storeRef.name,
                  booking_date: new Date(booking_date).toLocaleDateString(),
                  bed_name: bedRef.bedName, // Consider renaming this to 'service' in your schema
                  booking_time: timeSlots
                    .map((slot) => `${slot.startTime} - ${slot.endTime}`)
                    .join(", "),
                  from_name: "The Tanning Studio",
                },
                {
                  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
                }
              );
            const {_id:booking_id}=data||{}

            setNotification({ type: 'success', message: 'Slot booked successfully!' });
            router.push(`/booking-successful/${booking_id}`);
        } catch (err) {
            setNotification({ type: 'error', message: err.message });
        } finally {
            setIsLoading(false);
        }
    };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!selectedSlot) {
    //         setNotification({ type: 'error', message: 'Please select a slot before submitting.' });
    //         return;
    //     }
    //     if (!session) {
    //         router.push("/login");
    //         return;
    //     }

    //     setIsLoading(true);
    //     try {
    //         const response = await fetch(`/api/store/${id}/dates/${bedId}/slots/bookaslot`, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 date,
    //                 timeSlots: [
    //                     { startTime: selectedSlot.startTime, endTime: selectedSlot.endTime }
    //                 ],
    //             }),
    //         });
    //         console.log("response", response);

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.message || 'Failed to book the slot');
    //         }
    //         const data = await response.json();
    //         console.log("data",data)
    //         const {_id:booking_id}=data||{}

    //         setNotification({ type: 'success', message: 'Slot booked successfully!' });
    //         router.push(`/booking-successful/${booking_id}`);
    //     } catch (err) {
    //         setNotification({ type: 'error', message: err.message });
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null); // Hide notification after 3 seconds
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
    }

    const bgGradient = selectedMode === 'dark' 
        ? 'bg-gradient-to-b from-black to-gray-900' 
        : 'bg-gradient-to-r from-white to-gray-200';
    const textColor = selectedMode === 'dark' ? 'text-white' : 'text-black';
    const buttonBg = selectedMode === 'dark' ? 'bg-gray-800' : 'bg-white';
    const buttonText = selectedMode === 'dark' ? 'text-white' : 'text-gray-800';
    const buttonHover = selectedMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

    return (
        <div className={`min-h-screen ${bgGradient} ${textColor} transition-colors duration-300`}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-6">Select a Slot for {date}</h1>

                {notification && (
                    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg ${
                        notification.type === 'success' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gradient-to-b from-black to-gray-900'
                    }`}>
                        {notification.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                    <div className="mb-4">
                        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Available Slots</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {availableSlots.length === 0 ? (
                                <p>No available slots for this date.</p>
                            ) : (
                                availableSlots.map((slot, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`p-4 text-xs md:text-sm border rounded-lg ${buttonBg} ${buttonText} ${buttonHover} transition-colors duration-300
                                            ${selectedSlot === slot ? 'ring-2 ring-blue-500' : ''}
                                            ${slot.status !== 'available' ? 'cursor-not-allowed opacity-50' : ''}`}
                                        onClick={() => handleSlotSelect(slot)}
                                        disabled={slot.status !== 'available'}
                                    >
                                        {slot.startTime} - {slot.endTime}
                                        {slot.status !== 'available'  && <div className="text-sm opacity-70">unavailable</div>}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Fixed Book Slot Button */}
                    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 shadow-lg">
                        <button
                            type="submit"
                            className={`w-full ${buttonBg} ${buttonText} ${buttonHover} font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300`}
                            disabled={isLoading || !selectedSlot}
                        >
                            {isLoading ? 'Booking...' : 'Book a slot'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
