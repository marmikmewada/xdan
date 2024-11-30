'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: "private_KqUF8hy7OdWsOVnfZt//RA1O9k0=",
    urlEndpoint: "https://ik.imagekit.io/2o9y0v10p",
});

export default function CreateProductPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: []
    })
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/category')
                if (!response.ok) {
                    throw new Error('Failed to fetch categories')
                }
                const data = await response.json()
                setCategories(data.data || [])
            } catch (err) {
                setError(err.message)
            }
        }

        fetchCategories()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        setIsLoading(true);

        try {
            const uploadPromises = files.map((file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                        try {
                            const result = await imagekit.upload({
                                file: event.target.result,
                                fileName: file.name,
                                folder: `dan-studio/products`,
                            });
                            if (result.url) {
                                resolve(result.url);
                            } else {
                                reject(new Error("Failed to upload image to ImageKit"));
                            }
                        } catch (error) {
                            reject(error);
                        }
                    };
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                });
            });

            const imageUrls = await Promise.all(uploadPromises);
            setFormData((prevData) => ({
                ...prevData,
                imageUrl: [...prevData.imageUrl, ...imageUrls],
            }));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const productData = {
                ...formData,
                imageUrl: formData.imageUrl.length > 0 ? formData.imageUrl[0] : '',
            };

            const response = await fetch('/api/product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error('Failed to create product');
            }

            router.push('/admin/products');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Create Product</h1>
            <form onSubmit={handleSubmit} className="max-w-lg">
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
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="3"
                        required
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                        Category
                    </label>
                    <div className="flex items-center">
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category?._id} value={category?._id}>
                                    {category?.name}
                                </option>
                            ))}
                        </select>
                        <Link href="/admin/categories/create" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Create Category
                        </Link>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="images" className="block text-gray-700 text-sm font-bold mb-2">
                        Images
                    </label>
                    <input
                        type="file"
                        id="images"
                        name="images"
                        onChange={handleImageUpload}
                        multiple
                        accept="image/*"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                {formData.imageUrl.length > 0 && (
                    <div className="mb-4">
                        <p className="block text-gray-700 text-sm font-bold mb-2">Uploaded Images:</p>
                        <div className="grid grid-cols-3 gap-2">
                            {formData.imageUrl.map((url, index) => (
                                <div key={index} className="relative aspect-w-1 aspect-h-1">
                                    <Image src={url} alt={`Uploaded image ${index + 1}`} layout="fill" objectFit="cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Product'}
                </button>
            </form>
        </div>
    )
}