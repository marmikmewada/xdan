'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import useStore from '@/app/store/useStore'; // Importing useStore

export default function CouponListPage() {
    const { selectedMode } = useStore(); // Using selectedMode from the store
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/getallcoupons');
            if (!response.ok) {
                throw new Error('Failed to fetch coupons');
            }
            const data = await response.json();
            setCoupons(data?.data || []);
        } catch (err) {
            console.log(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (couponCode) => {
        if (!confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) return;

        setDeleting(true);
        try {
            const response = await fetch('/api/deletecoupon', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ couponCode }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to delete coupon');
            }

            alert('Coupon deleted successfully!');
            fetchCoupons(); // Refresh the coupon list
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setDeleting(false);
        }
    };

    // Dynamic styling based on selectedMode
    const gradientClass = selectedMode === 'dark' ? 'bg-gradient-to-r from-gray-800 to-black' : 'bg-gradient-to-r from-white to-gray-200';
    const textClass = selectedMode === 'dark' ? 'text-white' : 'text-black';
    const tableClass = selectedMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800';
    const buttonClass = selectedMode === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600';
    const deleteButtonClass = selectedMode === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600';

    return (
        <div className={`container mx-auto px-4 py-8 ${gradientClass} ${textClass}`}>
            <br />
            <br />
            <br />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Coupon List</h1>
                <Link
                    href="/admin/coupons/create"
                    className={`py-2 px-4 rounded ${buttonClass}`}
                >
                    Create Coupon
                </Link>
            </div>

            {isLoading && <p>Loading coupons...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && coupons.length === 0 && <p>No coupons found.</p>}

            {/* Make the table scrollable on small screens */}
            <div className="overflow-x-auto">
                <table className={`min-w-full table-auto border-collapse ${tableClass}`}>
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">Coupon Code</th>
                            <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">Discount (%)</th>
                            <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">Max Usage</th>
                            <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">Usage</th>
                            <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">Expiry</th>
                            <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon._id}>
                                <td className="border border-gray-300 px-4 py-2 text-sm sm:text-base">{coupon.couponCode}</td>
                                <td className="border border-gray-300 px-4 py-2 text-sm sm:text-base">{coupon.percentage}%</td>
                                <td className="border border-gray-300 px-4 py-2 text-sm sm:text-base">{coupon.maxUsage}</td>
                                <td className="border border-gray-300 px-4 py-2 text-sm sm:text-base">{coupon.usage}</td>
                                <td className="border border-gray-300 px-4 py-2 text-sm sm:text-base">
                                    {new Date(coupon.expiry).toLocaleDateString()}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-sm sm:text-base">
                                    <button
                                        className={`py-1 px-3 rounded ${deleteButtonClass}`}
                                        onClick={() => handleDelete(coupon.couponCode)}
                                        disabled={deleting}
                                    >
                                        {deleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}




// 'use client';

// import { useEffect, useState } from 'react';
// import Link from "next/link";

// export default function CouponListPage() {
//     const [coupons, setCoupons] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [deleting, setDeleting] = useState(false);

//     useEffect(() => {
//         fetchCoupons();
//     }, []);

//     const fetchCoupons = async () => {
//         setIsLoading(true);
//         try {
//             const response = await fetch('/api/getallcoupons');
//             if (!response.ok) {
//                 throw new Error('Failed to fetch coupons');
//             }
//             const data = await response.json();
//             setCoupons(data?.data || []);
//         } catch (err) {
//             console.log(err.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleDelete = async (couponCode) => {
//         if (!confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) return;

//         setDeleting(true);
//         try {
//             const response = await fetch('/api/deletecoupon', {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ couponCode }),
//             });

//             const result = await response.json();
//             if (!response.ok) {
//                 throw new Error(result.message || 'Failed to delete coupon');
//             }

//             alert('Coupon deleted successfully!');
//             fetchCoupons(); // Refresh the coupon list
//         } catch (err) {
//             alert(`Error: ${err.message}`);
//         } finally {
//             setDeleting(false);
//         }
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-2xl font-bold">Coupon List</h1>
//                 <Link
//                     href="/admin/coupons/create"
//                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                 >
//                     Create Coupon
//                 </Link>
//             </div>
//             {isLoading && <p>Loading coupons...</p>}
//             {error && <p className="text-red-500">{error}</p>}
//             {!isLoading && !error && coupons.length === 0 && <p>No coupons found.</p>}
//             <div className="overflow-x-auto">
//                 <table className="table-auto w-full border-collapse border border-gray-300">
//                     <thead>
//                         <tr>
//                             <th className="border border-gray-300 px-4 py-2">Coupon Code</th>
//                             <th className="border border-gray-300 px-4 py-2">Discount (%)</th>
//                             <th className="border border-gray-300 px-4 py-2">Max Usage</th>
//                             <th className="border border-gray-300 px-4 py-2">Expiry</th>
//                             <th className="border border-gray-300 px-4 py-2">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {coupons.map((coupon) => (
//                             <tr key={coupon._id}>
//                                 <td className="border border-gray-300 px-4 py-2">{coupon.couponCode}</td>
//                                 <td className="border border-gray-300 px-4 py-2">{coupon.percentage}%</td>
//                                 <td className="border border-gray-300 px-4 py-2">{coupon.maxUsage}</td>
//                                 <td className="border border-gray-300 px-4 py-2">
//                                     {new Date(coupon.expiry).toLocaleDateString()}
//                                 </td>
//                                 <td className="border border-gray-300 px-4 py-2">
//                                     <button
//                                         className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
//                                         onClick={() => handleDelete(coupon.couponCode)}
//                                         disabled={deleting}
//                                     >
//                                         {deleting ? 'Deleting...' : 'Delete'}
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }
