'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ViewStorePage() {
  const { id } = useParams()
  const router = useRouter()
  const [store, setStore] = useState(null)
  const [isUpdate, setIsUpdate] = useState(1)
  const [availableDates, setAvailableDates] = useState([]) 
  const [unavailableDates, setUnavailableDates] = useState([]) 
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch(`/api/store/${id}`)
        const dates = await fetch(`/api/store/${id}/dates`)
        const dateResult = await dates.json()

        if (!response.ok) {
          throw new Error('Failed to fetch store')
        }
        const storeData = await response.json()
        setStore(storeData.data)
        setAvailableDates(dateResult.availableDates)  
        setUnavailableDates(dateResult.unavailableDates)  
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchStore()
    }
  }, [id, isUpdate])

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Combine available and unavailable dates and sort them
  const allDates = [...availableDates, ...unavailableDates].sort((a, b) => new Date(a) - new Date(b))

  // Handle date click
  const handleDateClick = (date) => {
    // Only allow navigating if the date is available
    if (!unavailableDates.includes(date)) {
      const formattedDate = formatDate(new Date(date))
      router.push(`/locations/${id}/${formattedDate}`)
    }
  }

  const memoizedMap = useMemo(() => {
    if (store?.coordinates) {
      return (
        <div
          className="mt-2 h-[450px]"
          dangerouslySetInnerHTML={{
            __html: `<iframe src="${store.coordinates}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
          }}
        />
      )
    }
    return null
  }, [store?.coordinates])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  if (!store) {
    return <div className="flex justify-center items-center h-screen">Store not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/locations" className="text-blue-500 hover:text-blue-700">
          &larr; Back to Stores
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{store?.name}</h1>
          <div className="mb-4">
            <span className="font-bold">Address:</span> {store?.address || 'N/A'}
          </div>
          <div className="mb-4">
            <span className="font-bold">Phone:</span> {store?.phone || 'N/A'}
          </div>
          <div className="mb-4">
            <span className="font-bold">Staff:</span> {store?.staff.map((item) => item?.name) || 'No staff assigned'}
          </div>

          {/* Render all dates (mixed November and December) */}
          <div className="my-6">
            <div className="flex flex-wrap space-x-2">
              {allDates.map((date) => {
                const isUnavailable = unavailableDates.includes(date)
                const dateObj = new Date(date)
                const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' })}`
                return (
                  <button
                    key={date}
                    className={`py-2 px-4 rounded ${isUnavailable ? 'cursor-not-allowed opacity-50' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    onClick={() => handleDateClick(date)}
                    disabled={isUnavailable}
                  >
                    {formattedDate}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Render map */}
      <div className="mt-6">{memoizedMap}</div>
    </div>
  )
}
