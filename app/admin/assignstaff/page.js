// /admin/assignstaff/page.js
"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AssignStaffPage() {
    const router = useRouter();
    const [stores, setStores] = useState([]);
    const [staff, setStaff] = useState([]);
    const [selectedStore, setSelectedStore] = useState('');
    const [selectedStaff, setSelectedStaff] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch stores and staff when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/assignget'); // Assuming this is the API we created earlier to fetch stores and staff
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setStores(data.stores);
                    setStaff(data.staff);
                } else {
                    setError(data.message || 'Failed to fetch data');
                }
            } catch (err) {
                setError('Error fetching data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStore || !selectedStaff) {
            setError('Please select both store and staff member.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/assignget/assignstaffpost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storeId: selectedStore,
                    userId: selectedStaff,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to assign staff');
            }

            // alert('Staff assigned successfully!');
            router.push('/admin/locations'); // Redirect to locations page or any other page
        } catch (err) {
            setError(err.message || 'Error assigning staff');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Assign Staff to Store</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="mb-4">
                    <label htmlFor="store" className="block text-sm font-semibold">Select Store</label>
                    <select
                        id="store"
                        className="w-full p-2 border rounded-lg"
                        value={selectedStore}
                        onChange={(e) => setSelectedStore(e.target.value)}
                    >
                        <option value="">-- Select a Store --</option>
                        {stores.map((store) => (
                            <option key={store.id} value={store.id}>{store.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="staff" className="block text-sm font-semibold">Select Staff</label>
                    <select
                        id="staff"
                        className="w-full p-2 border rounded-lg"
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(e.target.value)}
                    >
                        <option value="">-- Select a Staff Member --</option>
                        {staff.map((user) => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={isLoading || !selectedStore || !selectedStaff}
                    >
                        {isLoading ? 'Assigning...' : 'Assign Staff'}
                    </button>
                </div>
            </form>
        </div>
    );
}