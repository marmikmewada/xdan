'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";

export default function CouponListPage() {
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Coupon List</h1>
                <Link
                    href="/admin/coupons/create"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Create Coupon
                </Link>
            </div>
            {isLoading && <p>Loading coupons...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && coupons.length === 0 && <p>No coupons found.</p>}
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Coupon Code</th>
                            <th className="border border-gray-300 px-4 py-2">Discount (%)</th>
                            <th className="border border-gray-300 px-4 py-2">Max Usage</th>
                            <th className="border border-gray-300 px-4 py-2">Expiry</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon._id}>
                                <td className="border border-gray-300 px-4 py-2">{coupon.couponCode}</td>
                                <td className="border border-gray-300 px-4 py-2">{coupon.percentage}%</td>
                                <td className="border border-gray-300 px-4 py-2">{coupon.maxUsage}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {new Date(coupon.expiry).toLocaleDateString()}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
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
