'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/app/store/useStore'; // Importing useStore
import { useSession } from "next-auth/react";

export default function AssignStaffPage() {
    const { data: session,status } = useSession(); 
    const { user } = session || {};
  const { role } = user || {};
  const router = useRouter();
   useEffect(() => {
      if (status !== "loading" && role !== "admin") {
        router.back();
      }
    }, [role, router, status]);
    const { selectedMode } = useStore(); // Using selectedMode from the store
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
                const response = await fetch('/api/assignget');
                const data = await response.json();
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
            router.push('/admin/locations');
        } catch (err) {
            setError(err.message || 'Error assigning staff');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // Dynamic styling based on selectedMode
    const gradientClass = selectedMode === 'dark' ? 'bg-gradient-to-r from-gray-800 to-black' : 'bg-gradient-to-r from-white to-gray-200';
    const textClass = selectedMode === 'dark' ? 'text-white' : 'text-black';
    const inputClass = selectedMode === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-400';
    const buttonClass = selectedMode === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2' : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2';

    return (
        <div className={`min-h-screen ${gradientClass} ${textClass} py-8`}>
            <br />
            <br />
            <br />
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">Assign Staff to Store</h1>

                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
                    <div>
                        <label htmlFor="store" className="block text-sm font-semibold">Select Store</label>
                        <select
                            id="store"
                            className={`w-full p-3 rounded-md shadow-sm ${inputClass}`}
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.target.value)}
                        >
                            <option value="">-- Select a Store --</option>
                            {stores.map((store) => (
                                <option key={store.id} value={store.id}>{store.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="staff" className="block text-sm font-semibold">Select Staff</label>
                        <select
                            id="staff"
                            className={`w-full p-3 rounded-md shadow-sm ${inputClass}`}
                            value={selectedStaff}
                            onChange={(e) => setSelectedStaff(e.target.value)}
                        >
                            <option value="">-- Select a Staff Member --</option>
                            {staff.map((user) => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={`w-full p-3 rounded-md font-semibold focus:outline-none focus:ring-2 ${buttonClass}`}
                            disabled={isLoading || !selectedStore || !selectedStaff}
                        >
                            {isLoading ? 'Assigning...' : 'Assign Staff'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}



// // /admin/assignstaff/page.js
// "use client"
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function AssignStaffPage() {
//     const router = useRouter();
//     const [stores, setStores] = useState([]);
//     const [staff, setStaff] = useState([]);
//     const [selectedStore, setSelectedStore] = useState('');
//     const [selectedStaff, setSelectedStaff] = useState('');
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(true);

//     // Fetch stores and staff when the component mounts
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch('/api/assignget'); // Assuming this is the API we created earlier to fetch stores and staff
//                 const data = await response.json();
//                 console.log(data);
//                 if (response.ok) {
//                     setStores(data.stores);
//                     setStaff(data.staff);
//                 } else {
//                     setError(data.message || 'Failed to fetch data');
//                 }
//             } catch (err) {
//                 setError('Error fetching data');
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!selectedStore || !selectedStaff) {
//             setError('Please select both store and staff member.');
//             return;
//         }

//         setIsLoading(true);

//         try {
//             const response = await fetch('/api/assignget/assignstaffpost', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     storeId: selectedStore,
//                     userId: selectedStaff,
//                 }),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to assign staff');
//             }

//             // alert('Staff assigned successfully!');
//             router.push('/admin/locations'); // Redirect to locations page or any other page
//         } catch (err) {
//             setError(err.message || 'Error assigning staff');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     if (isLoading) {
//         return <div className="flex justify-center items-center h-screen">Loading...</div>;
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-2xl font-bold mb-6">Assign Staff to Store</h1>

//             {error && <div className="text-red-500 mb-4">{error}</div>}

//             <form onSubmit={handleSubmit} className="max-w-2xl">
//                 <div className="mb-4">
//                     <label htmlFor="store" className="block text-sm font-semibold">Select Store</label>
//                     <select
//                         id="store"
//                         className="w-full p-2 border rounded-lg"
//                         value={selectedStore}
//                         onChange={(e) => setSelectedStore(e.target.value)}
//                     >
//                         <option value="">-- Select a Store --</option>
//                         {stores.map((store) => (
//                             <option key={store.id} value={store.id}>{store.name}</option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="staff" className="block text-sm font-semibold">Select Staff</label>
//                     <select
//                         id="staff"
//                         className="w-full p-2 border rounded-lg"
//                         value={selectedStaff}
//                         onChange={(e) => setSelectedStaff(e.target.value)}
//                     >
//                         <option value="">-- Select a Staff Member --</option>
//                         {staff.map((user) => (
//                             <option key={user.id} value={user.id}>{user.name}</option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className="mb-4">
//                     <button
//                         type="submit"
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                         disabled={isLoading || !selectedStore || !selectedStaff}
//                     >
//                         {isLoading ? 'Assigning...' : 'Assign Staff'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }