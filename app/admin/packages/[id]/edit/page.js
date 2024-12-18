'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { X } from 'lucide-react'

import ImageKit from "imagekit"

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT,
})

export default function EditPackagePage() {
    const router = useRouter()
    const { id } = useParams()
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        minutes: 0,
        price: 0,
        imageUrl: []
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/package/${id}`)

                if (!response.ok) {
                    throw new Error('Failed to fetch package data')
                }

                const packageData = await response.json()

                // Ensure imageUrl is always an array
                const imageUrl = packageData.data.imageUrl
                    ? Array.isArray(packageData.data.imageUrl)
                        ? packageData.data.imageUrl
                        : [packageData.data.imageUrl]
                    : []

                setFormData({
                    ...packageData.data,
                    imageUrl
                })
            } catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            fetchData()
        }
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'minutes' || name === 'price' ? Number(value) : value
        }))
    }

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files)
        setIsLoading(true)

        try {
            const uploadPromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = async (event) => {
                        const result = await imagekit.upload({
                            file: event.target.result,
                            fileName: file.name,
                            folder: `dan-studio/packages`,
                        })

                        if (result.url) {
                            resolve(result.url)
                        } else {
                            reject(new Error('Failed to upload image'))
                        }
                    }
                    reader.onerror = (error) => reject(error)
                    reader.readAsDataURL(file)
                })
            })

            const imageUrls = await Promise.all(uploadPromises)
            setFormData(prevData => ({
                ...prevData,
                imageUrl: [...(prevData.imageUrl || []), ...imageUrls]
            }))
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveImage = (indexToRemove) => {
        setFormData(prevData => ({
            ...prevData,
            imageUrl: prevData.imageUrl.filter((_, index) => index !== indexToRemove)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/package/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error('Failed to update package')
            }

            router.push(`/admin/packages/${id}`)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
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
            <h1 className="text-2xl font-bold mb-6">Edit Package</h1>
            <form onSubmit={handleSubmit} className="max-w-2xl">
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
                    <label htmlFor="minutes" className="block text-gray-700 text-sm font-bold mb-2">
                        Minutes
                    </label>
                    <input
                        type="number"
                        id="minutes"
                        name="minutes"
                        value={formData.minutes}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
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
                    <label htmlFor="images" className="block text-gray-700 text-sm font-bold mb-2">
                        Add More Images
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
                {formData.imageUrl && formData.imageUrl.length > 0 && (
                    <div className="mb-4">
                        <p className="block text-gray-700 text-sm font-bold mb-2">Current Images:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {formData.imageUrl.map((url, index) => (
                                <div key={index} className="relative h-40 w-full">
                                    <Image
                                        src={url}
                                        alt={`Package image ${index + 1}`}
                                        fill
                                        className="rounded object-cover"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
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
                    {isLoading ? 'Updating...' : 'Update Package'}
                </button>
            </form>
        </div>
    )
}