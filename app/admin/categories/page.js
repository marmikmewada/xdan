'use client'

import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useStore from '@/app/store/useStore'; // Importing useStore

export default function CategoriesPage() {
    const { selectedMode } = useStore(); // Using selectedMode from the store
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
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
            } finally {
                setIsLoading(false)
            }
        }

        fetchCategories()
    }, [])

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            try {
                const response = await fetch(`/api/category/${id}`, {
                    method: 'DELETE',
                })
                if (!response.ok) {
                    throw new Error('Failed to delete category')
                }
                setCategories(categories.filter(category => category._id !== id))
            } catch (err) {
                setError(err.message)
            }
        }
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
    }

    // Dynamic styling based on selectedMode
    const gradientClass = selectedMode === 'dark' ? 'bg-gradient-to-r from-gray-800 to-black' : 'bg-gradient-to-r from-white to-gray-200';
    const textClass = selectedMode === 'dark' ? 'text-white' : 'text-black';
    const tableClass = selectedMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800';
    const buttonClass = selectedMode === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600';
    const iconClass = selectedMode === 'dark' ? 'text-white hover:text-gray-300' : 'text-gray-800 hover:text-gray-600';

    return (
        <div className={`container mx-auto px-4 py-8 ${gradientClass} ${textClass}`}>
            <br />
            <br />
            <br />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Link href="/admin/categories/create" className={`py-2 px-4 rounded ${buttonClass}`}>
                    Create Category
                </Link>
            </div>

            <div className={`shadow-md rounded my-6 ${tableClass}`}>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Description</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id}>
                                <td className="text-left py-3 px-4">{category.name}</td>
                                <td className="text-left py-3 px-4">{category.description}</td>
                                <td className="text-left py-3 px-4">
                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        className={`p-2 rounded ${iconClass}`}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


// 'use client'

// import { Trash2 } from 'lucide-react'
// import Link from 'next/link'
// import { useEffect, useState } from 'react'

// export default function CategoriesPage() {
//     const [categories, setCategories] = useState([])
//     const [isLoading, setIsLoading] = useState(true)
//     const [error, setError] = useState(null)

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const response = await fetch('/api/category')
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch categories')
//                 }
//                 const data = await response.json()
//                 setCategories(data.data || [])
//             } catch (err) {
//                 setError(err.message)
//             } finally {
//                 setIsLoading(false)
//             }
//         }

//         fetchCategories()
//     }, [])

//     const handleDelete = async (id) => {
//         if (confirm('Are you sure you want to delete this category?')) {
//             try {
//                 const response = await fetch(`/api/category/${id}`, {
//                     method: 'DELETE',
//                 })
//                 if (!response.ok) {
//                     throw new Error('Failed to delete category')
//                 }
//                 setCategories(categories.filter(category => category._id !== id))
//             } catch (err) {
//                 setError(err.message)
//             }
//         }
//     }

//     if (isLoading) {
//         return <div className="flex justify-center items-center h-screen">Loading...</div>
//     }

//     if (error) {
//         return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-2xl font-bold">Categories</h1>
//                 <Link href="/admin/categories/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                     Create Category
//                 </Link>
//             </div>
//             <div className="bg-white shadow-md rounded my-6">
//                 <table className="min-w-full">
//                     <thead>
//                         <tr>
//                             <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
//                             <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Description</th>
//                             <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="text-gray-700">
//                         {categories.map((category) => (
//                             <tr key={category._id}>
//                                 <td className="text-left py-3 px-4">{category.name}</td>
//                                 <td className="text-left py-3 px-4">{category.description}</td>
//                                 <td className="text-left py-3 px-4">

//                                     <button
//                                         onClick={() => handleDelete(category._id)}
//                                         className="text-red-500 hover:text-red-700"
//                                     >
//                                         <Trash2 size={20} />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     )
// }