'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Edit, Trash2 } from 'lucide-react'

export default function PackagesPage() {
    const router = useRouter()
    const [packages, setPackages] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [packageToDelete, setPackageToDelete] = useState(null)

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch('/api/package')
                if (!response.ok) {
                    throw new Error('Failed to fetch packages')
                }
                const data = await response.json()
                setPackages(data.data || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPackages()
    }, [])

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/package/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) {
                throw new Error('Failed to delete package')
            }
            setPackages(packages.filter(pkg => pkg._id !== id))
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
            <br />
            <br />
            <br />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Packages</h1>
                <Link href="/admin/packages/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create Package
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <div key={pkg?._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div  onClick={()=>router.push(`/admin/packages/${pkg?._id}`)}>
                            <div className="h-48 w-full relative" >
                                {pkg?.imageUrl && pkg?.imageUrl.length > 0 ? (
                                    <Image
                                        src={pkg.imageUrl[0]} // Display the first image
                                        alt={pkg?.name || 'package Image'}
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
                                <h2 className="font-bold text-xl mb-2">{pkg?.name}</h2>
                                <p className="text-gray-700 text-base mb-2">{pkg?.description}</p>
                                <p className="text-gray-900 font-bold">${pkg?.price?.toFixed(2)}</p>
                                <p className="text-sm text-gray-600 mt-2">{pkg?.minutes} minutes</p>
                                <div className="flex justify-end mt-4">
                                    <Link
                                        href={`/admin/packages/${pkg?._id}/edit`}
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                    >
                                        <Edit size={20} />
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setPackageToDelete(pkg)
                                            setDeleteModalOpen(true)
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {deleteModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl">
                        <h2 className="text-xl mb-4">Are you sure you want to delete this package?</h2>
                        <p className="mb-4">Package: {packageToDelete?.name}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(packageToDelete?._id)}
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