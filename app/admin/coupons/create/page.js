'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCouponPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        couponCode: '',
        percentage: '',
        maxUsage: '',
        expiry: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/createcoupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create coupon');
            }

            router.push('/admin/coupons');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Create Coupon</h1>
            <form onSubmit={handleSubmit} className="max-w-lg">
                <div className="mb-4">
                    <label htmlFor="couponCode" className="block text-gray-700 text-sm font-bold mb-2">
                        Coupon Code
                    </label>
                    <input
                        type="text"
                        id="couponCode"
                        name="couponCode"
                        value={formData.couponCode}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="percentage" className="block text-gray-700 text-sm font-bold mb-2">
                        Discount Percentage
                    </label>
                    <input
                        type="number"
                        id="percentage"
                        name="percentage"
                        value={formData.percentage}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="maxUsage" className="block text-gray-700 text-sm font-bold mb-2">
                        Max Usage
                    </label>
                    <input
                        type="number"
                        id="maxUsage"
                        name="maxUsage"
                        value={formData.maxUsage}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="expiry" className="block text-gray-700 text-sm font-bold mb-2">
                        Expiry Date
                    </label>
                    <input
                        type="date"
                        id="expiry"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Coupon'}
                </button>
            </form>
        </div>
    );
}
