'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Edit, Trash2 } from 'lucide-react'

export default function ProductsPage() {
    const router = useRouter()
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/product')
                if (!response.ok) {
                    throw new Error('Failed to fetch products')
                }
                const data = await response.json()
                setProducts(data.data || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [])

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/product/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) {
                throw new Error('Failed to delete product')
            }
            setProducts(products.filter(product => product._id !== id))
            setDeleteModalOpen(false)
        } catch (err) {
            setError(err.message)
        }
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <Link href="/admin/products/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create Product
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product?._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-48 w-full relative" onClick={() => router.push(`/admin/products/${product?._id}`)}>
                            {product?.imageUrl && product?.imageUrl.length > 0 ? (
                                <Image
                                    src={product.imageUrl[0]} // Display the first image
                                    alt={product?.name || 'Product Image'}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                                    No image
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h2 className="font-bold text-xl mb-2">{product?.name}</h2>
                            <p className="text-gray-700 text-base mb-2">{product?.description}</p>
                            <p className="text-gray-900 font-bold">${product?.price?.toFixed(2)}</p>
                            <p className="text-sm text-gray-600 mt-2">Category: {product?.category?.name}</p>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => router.push(`/admin/products/${product?._id}/edit`)}
                                    className="text-blue-500 hover:text-blue-700 mr-2"
                                >
                                    <Edit size={20} />
                                </button>
                                <button
                                    onClick={() => {
                                        setProductToDelete(product)
                                        setDeleteModalOpen(true)
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {deleteModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl">
                        <h2 className="text-xl mb-4">Are you sure you want to delete this product?</h2>
                        <p className="mb-4">Product: {productToDelete?.name}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(productToDelete?._id)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
