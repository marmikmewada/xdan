'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '@/app/store/useStore'; // Importing useStore

export default function CreateCategoryPage() {
    const { selectedMode } = useStore(); // Using selectedMode from the store
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error('Failed to create category')
            }

            router.push('/admin/categories')
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Dynamic styling based on selectedMode
    const gradientClass = selectedMode === 'dark' ? 'bg-gradient-to-r from-gray-800 to-black' : 'bg-gradient-to-r from-white to-gray-200';
    const textClass = selectedMode === 'dark' ? 'text-white' : 'text-black';
    const inputClass = selectedMode === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300';
    const buttonClass = selectedMode === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600';

    return (
        <div className={`container mx-auto px-4 py-8 ${gradientClass} ${textClass}`}>
            <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">Create Category</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-bold mb-2">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${inputClass}`}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-bold mb-2">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${inputClass}`}
                        rows="3"
                        required
                    ></textarea>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    type="submit"
                    className={`w-full sm:w-auto py-2 px-4 rounded focus:outline-none focus:shadow-outline ${buttonClass}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Category'}
                </button>
            </form>
        </div>
    )
}





// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'

// export default function CreateCategoryPage() {
//     const router = useRouter()
//     const [formData, setFormData] = useState({
//         name: '',
//         description: ''
//     })
//     const [isLoading, setIsLoading] = useState(false)
//     const [error, setError] = useState(null)

//     const handleChange = (e) => {
//         const { name, value } = e.target
//         setFormData(prevData => ({
//             ...prevData,
//             [name]: value
//         }))
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         setIsLoading(true)
//         setError(null)

//         try {
//             const response = await fetch('/api/category', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData)
//             })

//             if (!response.ok) {
//                 throw new Error('Failed to create category')
//             }

//             router.push('/admin/categories')
//         } catch (err) {
//             setError(err.message)
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-2xl font-bold mb-6">Create Category</h1>
//             <form onSubmit={handleSubmit} className="max-w-lg">
//                 <div className="mb-4">
//                     <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
//                         Name
//                     </label>
//                     <input
//                         type="text"
//                         id="name"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         required
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
//                         Description
//                     </label>
//                     <textarea
//                         id="description"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleChange}
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         rows="3"
//                         required
//                     ></textarea>
//                 </div>
//                 {error && <p className="text-red-500 mb-4">{error}</p>}
//                 <button
//                     type="submit"
//                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                     disabled={isLoading}
//                 >
//                     {isLoading ? 'Creating...' : 'Create Category'}
//                 </button>
//             </form>
//         </div>
//     )
// }