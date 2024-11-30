'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditLocationPage() {
    const router = useRouter();
    const { id, date } = useParams(); // Get store ID and date from URL params
    const [availableSlots, setAvailableSlots] = useState([]);  // Ensure it's an array by default
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch available slots for the specific store and date
    useEffect(() => {
        const fetchSlots = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/store/${id}/dates/slots?date=${date}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch available slots');
                }
                const data = await response.json();
                console.log("slot data", data);
    
                // Ensure that the availableSlots is an array
                if (Array.isArray(data.slots)) {
                    setAvailableSlots(data.slots); // Use 'slots' instead of 'availableSlots'
                } else {
                    setAvailableSlots([]);  // If not an array, default to an empty array
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
            // Don't allow selecting booked or unavailable slots
            return;
        }
        setSelectedSlot(slot);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSlot) {
            alert('Please select a slot before submitting.');
            return;
        }

        // Send the selected slot to the backend for booking
        setIsLoading(true);
        try {
            const response = await fetch(`/api/store/${id}/dates/slots/bookaslot`, {  // Correct API endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date, // The date you're booking for
                    timeSlots: [
                        { startTime: selectedSlot.startTime, endTime: selectedSlot.endTime }
                    ], // Sending only the selected slot in the correct format
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to book the slot');
            }

            // Redirect after successful booking
            router.push(`/locations/${id}`); // Redirect to the store's location page
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Select a Slot for {date}</h1>
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-4">Available Slots</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {availableSlots.length === 0 ? (
                            <p>No available slots for this date.</p>
                        ) : (
                            availableSlots.map((slot, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`p-4 border rounded-lg ${selectedSlot === slot ? 'bg-blue-500 text-white' : 'bg-white'} ${slot.status !== 'available' ? 'cursor-not-allowed opacity-50' : ''}`}
                                    onClick={() => handleSlotSelect(slot)}
                                    disabled={slot.status !== 'available'}
                                >
                                    {slot.startTime} - {slot.endTime}
                                    {slot.status === 'booked' && <div className="text-sm text-gray-500">unavailable</div>}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={isLoading || !selectedSlot}
                    >
                        {isLoading ? 'Booking...' : 'Book a slot'}
                    </button>
                </div>
            </form>
        </div>
    );
}
