'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSession } from "next-auth/react";

export default function ViewProductPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { user } = session || {};
    const { role } = user || {};
  
    useEffect(() => {
      if (status !== "loading" && role !== "admin") {
        router.back();
      }
    }, [role, router, status]);
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/product/${id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch product')
                }
                const data = await response.json()
                setProduct(data.data)
            } catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            fetchProduct()
        }
    }, [id])

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`/api/product/${id}`, {
                    method: 'DELETE',
                })
                if (!response.ok) {
                    throw new Error('Failed to delete product')
                }
                router.push('/admin/products')
            } catch (err) {
                setError(err.message)
            }
        }
    }

    const nextImage = () => {
        if (product?.imageUrl?.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === product.imageUrl.length - 1 ? 0 : prev + 1
            )
        }
    }

    const previousImage = () => {
        if (product?.imageUrl?.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? product.imageUrl.length - 1 : prev - 1
            )
        }
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
    }

    if (!product) {
        return <div className="flex justify-center items-center h-screen">Product not found</div>
    }

    const hasMultipleImages = Array.isArray(product.imageUrl) && product.imageUrl.length > 1
    const currentImage = Array.isArray(product.imageUrl) ? product.imageUrl[currentImageIndex] : product.imageUrl

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/admin/products" className="text-blue-500 hover:text-blue-700">
                    &larr; Back to Products
                </Link>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2 relative">
                        {currentImage ? (
                            <div className="relative h-[400px] w-full">
                                <Image
                                    src={currentImage}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                {hasMultipleImages && (
                                    <>
                                        <button
                                            onClick={previousImage}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {product.imageUrl.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="h-[400px] bg-gray-200 flex items-center justify-center text-gray-500">
                                No image available
                            </div>
                        )}
                    </div>
                    <div className="p-8 md:w-1/2">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                            {product.category?.name}
                        </div>
                        <h1 className="mt-1 text-4xl font-bold">{product.name}</h1>
                        <p className="mt-2 text-gray-500">{product.description}</p>
                        <div className="mt-4">
                            <span className="text-gray-500">Price:</span>
                            <span className="ml-2 text-2xl font-bold">${product.price?.toFixed(2)}</span>
                        </div>
                        <div className="mt-6 flex space-x-3">
                            <button
                                onClick={() => router.push(`/admin/products/${id}/edit`)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Edit Product
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Delete Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}