'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Edit, Trash2 } from 'lucide-react'
import useStore from "@/app/store/useStore"
import { useSession } from "next-auth/react";

export default function ProductsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { user } = session || {};
    const { role } = user || {};
  
    useEffect(() => {
      if (status !== "loading" && role !== "admin") {
        router.back();
      }
    }, [role, router, status]);
    
    const { selectedMode } = useStore()
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

    const bgColor = selectedMode === "dark"
        ? "bg-gradient-to-b from-black to-gray-900"
        : "bg-gradient-to-b from-white to-gray-100"
    const textColor = selectedMode === "dark" ? "text-white" : "text-black"
    const buttonBgColor = selectedMode === "dark" ? "bg-gradient-to-b from-black to-gray-900" : "bg-black"
    const buttonTextColor = "text-white"
    const buttonHoverBgColor = selectedMode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-800"
    const cardBgColor = selectedMode === "dark" ? "bg-gray-800" : "bg-white"
    const cardBorderColor = selectedMode === "dark" ? "border-gray-700" : "border-gray-200"

    if (isLoading) {
        return (
            <div className={`flex justify-center items-center h-screen ${bgColor} ${textColor}`}>
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={`flex justify-center items-center h-screen ${bgColor} ${textColor}`}>
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen ${bgColor} ${textColor} px-4 py-8 md:px-8`}>
            <br />
            <br />
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Products</h1>
                    <Link href="/admin/products/create" className={`${buttonBgColor} ${buttonTextColor} px-6 py-2 rounded-lg font-semibold ${buttonHoverBgColor} transition duration-300`}>
                        Create Product
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product?._id} className={`${cardBgColor} rounded-lg shadow-lg overflow-hidden border ${cardBorderColor} transition-all duration-300 ease-in-out`}>
                            <div className="h-48 w-full relative cursor-pointer" onClick={() => router.push(`/admin/products/${product?._id}`)}>
                                {product?.imageUrl && product?.imageUrl.length > 0 ? (
                                    <Image
                                        src={product.imageUrl[0]}
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
                                <p className={`${textColor} text-base mb-2`}>{product?.description}</p>
                                <p className="text-lg font-bold mb-2">£{product?.price?.toFixed(2)}</p>
                                {/* <p className={`text-sm ${textColor} mb-4`}>Category: {product?.category?.name}</p> */}
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => router.push(`/admin/products/${product?._id}/edit`)}
                                        className="text-blue-500 hover:text-blue-700 mr-4 transition duration-300"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setProductToDelete(product)
                                            setDeleteModalOpen(true)
                                        }}
                                        className="text-red-500 hover:text-red-700 transition duration-300"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {deleteModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
                        <div className={`${cardBgColor} p-8 rounded-lg shadow-xl max-w-md w-full`}>
                            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                            <p className="mb-6">Are you sure you want to delete the product: {productToDelete?.name}?</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className={`px-4 py-2 rounded-lg ${buttonBgColor} ${buttonTextColor} ${buttonHoverBgColor} transition duration-300`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(productToDelete?._id)}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}




// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import { Edit, Trash2 } from 'lucide-react'

// export default function ProductsPage() {
//     const router = useRouter()
//     const [products, setProducts] = useState([])
//     const [isLoading, setIsLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false)
//     const [productToDelete, setProductToDelete] = useState(null)

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const response = await fetch('/api/product')
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch products')
//                 }
//                 const data = await response.json()
//                 setProducts(data.data || [])
//             } catch (err) {
//                 setError(err.message)
//             } finally {
//                 setIsLoading(false)
//             }
//         }

//         fetchProducts()
//     }, [])

//     const handleDelete = async (id) => {
//         try {
//             const response = await fetch(`/api/product/${id}`, {
//                 method: 'DELETE',
//             })
//             if (!response.ok) {
//                 throw new Error('Failed to delete product')
//             }
//             setProducts(products.filter(product => product._id !== id))
//             setDeleteModalOpen(false)
//         } catch (err) {
//             setError(err.message)
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
//                 <h1 className="text-2xl font-bold">Products</h1>
//                 <Link href="/admin/products/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                     Create Product
//                 </Link>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {products.map((product) => (
//                     <div key={product?._id} className="bg-white rounded-lg shadow-md overflow-hidden">
//                         <div className="h-48 w-full relative" onClick={() => router.push(`/admin/products/${product?._id}`)}>
//                             {product?.imageUrl && product?.imageUrl.length > 0 ? (
//                                 <Image
//                                     src={product.imageUrl[0]} // Display the first image
//                                     alt={product?.name || 'Product Image'}
//                                     fill
//                                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                                     className="object-cover"
//                                 />
//                             ) : (
//                                 <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
//                                     No image
//                                 </div>
//                             )}
//                         </div>
//                         <div className="p-4">
//                             <h2 className="font-bold text-xl mb-2">{product?.name}</h2>
//                             <p className="text-gray-700 text-base mb-2">{product?.description}</p>
//                             <p className="text-gray-900 font-bold">${product?.price?.toFixed(2)}</p>
//                             <p className="text-sm text-gray-600 mt-2">Category: {product?.category?.name}</p>
//                             <div className="flex justify-end mt-4">
//                                 <button
//                                     onClick={() => router.push(`/admin/products/${product?._id}/edit`)}
//                                     className="text-blue-500 hover:text-blue-700 mr-2"
//                                 >
//                                     <Edit size={20} />
//                                 </button>
//                                 <button
//                                     onClick={() => {
//                                         setProductToDelete(product)
//                                         setDeleteModalOpen(true)
//                                     }}
//                                     className="text-red-500 hover:text-red-700"
//                                 >
//                                     <Trash2 size={20} />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {deleteModalOpen && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
//                     <div className="bg-white p-5 rounded-lg shadow-xl">
//                         <h2 className="text-xl mb-4">Are you sure you want to delete this product?</h2>
//                         <p className="mb-4">Product: {productToDelete?.name}</p>
//                         <div className="flex justify-end">
//                             <button
//                                 onClick={() => setDeleteModalOpen(false)}
//                                 className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={() => handleDelete(productToDelete?._id)}
//                                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }
