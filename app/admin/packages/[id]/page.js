'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSession } from "next-auth/react";

export default function ViewPackagePage() {
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
    const [package_, setPackage] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await fetch(`/api/package/${id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch package')
                }
                const data = await response.json()
                setPackage(data.data)
            } catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            fetchPackage()
        }
    }, [id])

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
    }

    if (!package_) {
        return <div className="flex justify-center items-center h-screen">Package not found</div>
    }
    const nextImage = () => {
        if (package_?.imageUrl?.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === package_.imageUrl.length - 1 ? 0 : prev + 1
            )
        }
    }

    const previousImage = () => {
        if (package_?.imageUrl?.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? package_.imageUrl.length - 1 : prev - 1
            )
        }
    }

    const hasMultipleImages = Array.isArray(package_.imageUrl) && package_.imageUrl.length > 1
    const currentImage = Array.isArray(package_.imageUrl) ? package_.imageUrl[currentImageIndex] : package_.imageUrl

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/admin/packages" className="text-blue-500 hover:text-blue-700">
                    &larr; Back to Packages
                </Link>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2 relative">
                        {currentImage ? (
                            <div className="relative h-[400px] w-full">
                                <Image
                                    src={currentImage}
                                    alt={package_.name}
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
                                            {package_.imageUrl.map((_, index) => (
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
                    <div className="p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{package_.name}</h1>
                        <p className="text-gray-600 mb-4">{package_.description}</p>
                        <div className="mb-4">
                            <span className="font-bold">Duration:</span> {package_.minutes} minutes
                        </div>
                        <div className="mb-4">
                            <span className="font-bold">Price:</span> ${package_.price.toFixed(2)}
                        </div>
                        <div className="mt-6 flex space-x-3">
                            <button
                                onClick={() => router.push(`/admin/packages/${id}/edit`)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Edit Package
                            </button>
                            <button
                                onClick={() => {
                                    // Implement delete functionality here
                                    if (confirm('Are you sure you want to delete this package?')) {
                                        // Call delete API
                                    }
                                }}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Delete Package
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}