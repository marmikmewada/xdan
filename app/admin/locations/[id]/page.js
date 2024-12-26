'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function ViewStorePage() {

  const { id } = useParams()
  const { data: session, status } = useSession();
  const router = useRouter();
  const { user } = session || {};
  const { role } = user || {};

  useEffect(() => {
    if (status !== "loading" && (role !== "admin" && role !== "staff")) {
      router.back();
    }
  }, [role, router, status]);
  // const router = useRouter()
  // const {data:session}=useSession()
  // const {user}=session||{}
  // const {role}=user||{}
  // console.log("role",role)
  const [store, setStore] = useState(null)
  const [isUpdate,setIsUpdate]=useState(1)
  const [availableDates, setAvailableDates] = useState([])
  const [unavailableDates, setUnavailableDates] = useState([]) 
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDates, setSelectedDates] = useState([])

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch(`/api/store/${id}`)
        const dates = await fetch(`/api/store/${id}/dates`)
        const dateResult = await dates.json()
        console.log("dateResult", dateResult)

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
  }, [id,isUpdate])

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Combine available and unavailable dates and sort them
  const allDates = [...availableDates, ...unavailableDates].sort((a, b) => new Date(a) - new Date(b))

  // Handle date selection
  const handleDateSelect = (date) => {
    const dateString = formatDate(new Date(date))  
    setSelectedDates((prevDates) =>
      prevDates.includes(dateString)
        ? prevDates.filter((d) => d !== dateString)
        : [...prevDates, dateString]
    )
  }

  // Handle marking dates as unavailable
  const handleMarkUnavailable = async () => {
    if (selectedDates.length === 0) {
      alert('Please select a date to mark as unavailable.')
      return
    }
    try {
      const response = await fetch(`/api/store/${id}/markundates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dates: selectedDates,
          reason: 'Staff vacation',
        }),
      })

      const result = await response.json()
      if (result.success) {
        setAvailableDates((prevDates) =>
          prevDates.filter((date) => !selectedDates.includes(date))
        )
        setSelectedDates([])  
        router.refresh()
        setIsUpdate(isUpdate+1)
      } else {
        alert(result.message)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to mark date(s) as unavailable')
    }
  }

  // Redirect when "Open Slots" is clicked
  const handleOpenSlots = () => {
    if (selectedDates.length === 0) {
      alert('Please select a date to open slots.')
      return
    }
    if (selectedDates.length > 1) {
      alert('Please select only one date to open slots.')
      return
    }
    router.push(`/admin/locations/${id}/${selectedDates}`)
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
      
      {role==="admin"&&
      <div className="mb-6">
        <Link href="/admin/locations" className="text-blue-500 hover:text-blue-700">
          &larr; Back to Stores
        </Link>
      </div>}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <br />
     
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
                    className={`py-2 px-4 rounded ${selectedDates.includes(date) ? 'bg-blue-500 text-white' : 'bg-gray-200'} ${isUnavailable ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={() => !isUnavailable && handleDateSelect(date)}
                    disabled={isUnavailable}
                  >
                    {formattedDate}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleMarkUnavailable}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={selectedDates.length === 0}
            >
              Mark Unavailable
            </button>
            <button
              onClick={handleOpenSlots}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              disabled={selectedDates.length === 0}
            >
              Open beds
            </button>
          </div>
        </div>
      </div>

      {/* Render map */}
      <div className="mt-6">{memoizedMap}</div>
    </div>
  )
}
