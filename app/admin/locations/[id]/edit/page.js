'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditLocationPage() {
    const router = useRouter();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        staff: [], // Now it stores objects with id and name
    });
    const [newStaffName, setNewStaffName] = useState(''); // Store the new staff name input
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch store data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/store/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch store data');
                }
                const storeData = await response.json();
                console.log(storeData);
                
                // Handle the store and staff data
                const staffData = storeData?.data[0]?.staff.map(staff => ({
                    id: staff?.id,
                    name: staff?.name,
                }));

                // Set form data with fetched store info and staff details
                setFormData({
                    ...storeData.data[0],
                    staff: staffData,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Add new staff
    const handleAddStaff = () => {
        if (newStaffName.trim()) {
            setFormData((prevData) => ({
                ...prevData,
                staff: [
                    ...prevData.staff,
                    { id: Date.now().toString(), name: newStaffName.trim() }, // Temporarily using timestamp as id
                ],
            }));
            setNewStaffName('');
        }
    };

    // Remove staff by index
    const handleRemoveStaff = (indexToRemove) => {
        setFormData((prevData) => ({
            ...prevData,
            staff: prevData.staff.filter((_, index) => index !== indexToRemove),
        }));
    };

    // Handle form submission (Update store data)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Prepare the data to be submitted, sending only staff ids
        const formDataToSubmit = {
            ...formData,
            staff: formData.staff.map(staff => staff.id), // Only send ids of staff
        };

        try {
            const response = await fetch(`/api/store/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formDataToSubmit),
            });

            if (!response.ok) {
                throw new Error('Failed to update location');
            }

            router.push(`/admin/locations/${id}`);
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
            <h1 className="text-2xl font-bold mb-6">Edit Location</h1>
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
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
                        value={formData.address}
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
                        value={formData.phone}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Staff Members
                    </label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            value={newStaffName}
                            onChange={(e) => setNewStaffName(e.target.value)}
                            placeholder="Add new staff member"
                            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex-grow"
                        />
                        <button
                            type="button"
                            onClick={handleAddStaff}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add
                        </button>
                    </div>
                    {formData?.staff?.length > 0 && (
                        <ul className="mt-4">
                            {formData?.staff.map((staff, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center bg-gray-100 rounded px-3 py-2 mb-2"
                                >
                                    {staff?.name} {/* Display the staff's name */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveStaff(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Update Location'}
                </button>
            </form>
        </div>
    );
}

// kira code 