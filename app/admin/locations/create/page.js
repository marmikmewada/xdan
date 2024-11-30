'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateLocationPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        googleMapEmbed: '', // This will hold just the src URL from the iframe
        staff: [],
    });
    const [staffOptions, setStaffOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch staff options
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await fetch('/api/getallstaff');
                if (!response.ok) throw new Error('Failed to fetch staff data');
                const staffData = await response.json();
                setStaffOptions(staffData?.data || []);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Error fetching staff');
            }
        };

        fetchStaff();
    }, []);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Function to extract the src from the iframe code
    const extractSrcFromIframe = (iframeCode) => {
        const regex = /<iframe[^>]+src="([^"]+)"/;
        const match = iframeCode.match(regex);
        return match ? match[1] : ''; // Return the src URL or an empty string if no match
    };

    // Handle the Google Maps Embed field change
    const handleGoogleMapEmbedChange = (e) => {
        const iframeCode = e.target.value;
        const extractedSrc = extractSrcFromIframe(iframeCode);
        setFormData((prevData) => ({
            ...prevData,
            googleMapEmbed: extractedSrc, // Save only the src part
        }));
    };

    // Add staff to the form data
    const handleAddStaff = (staffId) => {
        if (!formData?.staff?.includes(staffId)) {
            setFormData((prevData) => ({
                ...prevData,
                staff: [...(prevData?.staff || []), staffId],
            }));
        }
    };

    // Remove staff from the form data
    const handleRemoveStaff = (indexToRemove) => {
        setFormData((prevData) => ({
            ...prevData,
            staff: prevData?.staff?.filter((_, index) => index !== indexToRemove),
        }));
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to create location');

            // Reset form after successful submission
            setFormData({
                name: '',
                address: '',
                phone: '',
                googleMapEmbed: '',
                staff: [],
            });
            router.push('/admin/locations');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error creating location');
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
            <h1 className="text-2xl font-bold mb-6">Create Location</h1>
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData?.name || ''}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData?.address || ''}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                        Phone
                    </label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData?.phone || ''}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="googleMapEmbed" className="block text-gray-700 text-sm font-bold mb-2">
                        Google Maps Embed Code
                    </label>
                    <textarea
                        id="googleMapEmbed"
                        name="googleMapEmbed"
                        value={formData?.googleMapEmbed || ''}
                        onChange={handleGoogleMapEmbedChange}  // Updated handler for iframe src extraction
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder='<iframe src="https://maps.google.com/..." />'
                        rows="5"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="staff" className="block text-gray-700 text-sm font-bold mb-2">
                        Assign Staff
                    </label>
                    <select
                        onChange={(e) => handleAddStaff(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Select Staff</option>
                        {staffOptions?.map((staff) => (
                            <option key={staff?._id} value={staff?._id}>
                                {staff?.name}
                            </option>
                        ))}
                    </select>
                    {formData?.staff?.length > 0 && (
                        <ul className="mt-4">
                            {formData.staff.map((staffId, index) => {
                                const staff = staffOptions?.find((s) => s?._id === staffId);
                                return (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center bg-gray-100 rounded px-3 py-2 mb-2"
                                    >
                                        {staff ? `${staff?.name}` : staffId}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveStaff(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Location'}
                </button>
            </form>
        </div>
    );
}
