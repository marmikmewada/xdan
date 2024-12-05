'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit, Trash2 } from 'lucide-react'

export default function LocationsPage() {
    const router = useRouter()
    const [locations, setLocations] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [locationToDelete, setLocationToDelete] = useState(null)

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('/api/store')
                if (!response.ok) {
                    throw new Error('Failed to fetch locations')
                }
                const data = await response.json()
                setLocations(data.data || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchLocations()
    }, [])

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/store/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) {
                throw new Error('Failed to delete location')
            }
            setLocations(locations.filter(location => location._id !== id))
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
                <h1 className="text-2xl font-bold">Locations</h1>
                <Link href="/admin/locations/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Location
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((location) => (
                    <div key={location?._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <Link href={`/admin/locations/${location?._id}`}>
                            <div className="p-4">
                                <h2 className="font-bold text-xl mb-2">{location?.name}</h2>
                                <p className="text-gray-700 text-base mb-2">Address: {location?.address}</p>
                                <p className="text-gray-900 font-bold">Phone: {location?.phone}</p>
                                {location?.coordinates && (
                                    <p className="text-blue-500 mt-2">
                                        <Link
                                            href={location.coordinates}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline"
                                        >
                                            View on Map
                                        </Link>
                                    </p>
                                )}
                            </div>
                        </Link>
                        <div className="flex justify-end mt-4 p-4">
                                    {/* <Link
                                        href={`/admin/locations/${location?._id}/edit`}
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                    >
                                        <Edit size={20} />
                                    </Link> */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setLocationToDelete(location)
                                            setDeleteModalOpen(true)
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                    </div>
                ))}
            </div>

            {deleteModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl">
                        <h2 className="text-xl mb-4">Are you sure you want to delete this location?</h2>
                        <p className="mb-4">Location: {locationToDelete?.name}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(locationToDelete?._id)}
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
