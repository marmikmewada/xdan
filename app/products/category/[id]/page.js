'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useStore from "@/app/store/useStore";

export default function SingleCategoryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cartCount, setCartCount } = useStore();
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const { id: categoryId } = useParams();

  const [selectedMode, setSelectedMode] = useState("light"); // Manage selectedMode here

  const gradientClass = selectedMode === "dark"
    ? "bg-gradient-to-br from-gray-700 via-gray-800 to-black"
    : "bg-gradient-to-br from-gray-300 via-gray-100 to-white";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [productResponse, packageResponse, storeResponse] = await Promise.all([
          fetch(`/api/product?category=${categoryId}`),
          fetch('/api/package'),
          fetch('/api/store')
        ]);

        const [productResult, packageResult, storeResult] = await Promise.all([
          productResponse.json(),
          packageResponse.json(),
          storeResponse.json()
        ]);

        if (!productResult.success) {
          throw new Error(productResult.message || "Error fetching products");
        }
        if (!packageResult.success) {
          throw new Error(packageResult.message || "Error fetching packages");
        }
        if (!storeResult.success) {
          throw new Error(storeResult.message || "Error fetching stores");
        }

        setProducts(productResult.data || []);
        setPackages(packageResult.data || []);
        setStores(storeResult.data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  const addToCart = async (itemId) => {
    if (!session) {
      router.push("/login");
      return;
    }
    try {
      setLoadingItemId(itemId);
      const response = await fetch(`/api/addproductcart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });

      const result = await response.json();

      if (result.success) {
        setCartCount(cartCount + 1);
        router.refresh();
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!products.length && !packages.length && !stores.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No products, packages, or stores found in this category.
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${gradientClass}`}>
      <main>
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Category Products, Packages, and Stores
          </h1>

          {/* Products Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product._id} className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
                  <Link href={`/products/${product._id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View details for {product.name}</span>
                  </Link>
                  <div className="relative">
                    <div className="relative w-full h-48">
                      {product.imageUrl && product.imageUrl[0] ? (
                        <Image
                          src={product.imageUrl[0]}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4 h-12 overflow-hidden">
                        {product.description}
                      </p>
                      <p className="text-2xl font-bold mb-4 text-orange-500">
                        £{product.price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => addToCart(product._id)}
                        disabled={loadingItemId === product._id}
                        className={`relative z-20 w-full py-2 px-4 rounded-full font-semibold text-center transition-all duration-300 ${
                          loadingItemId === product._id
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
                        }`}
                      >
                        {loadingItemId === product._id ? "Adding..." : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Packages Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Packages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.slice(0, 3).map((pkg) => (
                <div
                  key={pkg._id}
                  className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
                >
                  <Link href={`/packages/${pkg._id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View details for {pkg.name}</span>
                  </Link>
                  <div className="relative">
                    <div className="relative w-full h-48">
                      {pkg.imageUrl && pkg.imageUrl[0] ? (
                        <Image
                          src={pkg.imageUrl[0]}
                          alt={pkg.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">
                        {pkg.name}
                      </h3>
                      <p className="text-gray-600 mb-4 h-16 overflow-hidden">
                        {pkg.description}
                      </p>
                      <p className="text-lg font-semibold mb-2 text-orange-500">
                        {pkg.minutes} minutes
                      </p>
                      <p className="text-2xl font-bold mb-6 text-orange-500">
                        £{pkg.price.toFixed(2)}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent redirection
                          addToCart(pkg._id);
                        }}
                        disabled={loadingItemId === pkg._id}
                        className={`relative z-20 w-full py-2 px-4 rounded-full font-semibold text-center transition-all duration-300 ${
                          loadingItemId === pkg._id
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
                        }`}
                      >
                        {loadingItemId === pkg._id ? "Adding..." : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stores Section */}
          <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Our Stores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {stores.slice(0, 3).map((store) => (
                <div key={store._id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{store.name}</h3>
                    <p className="text-gray-600 mb-2">{store.address}</p>
                    <p className="text-gray-600 mb-4">Phone: {store.phone}</p>
                    {store.coordinates && (
                      <div className="mb-4 relative w-full h-48">
                        <iframe
                          src={store.coordinates}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="absolute inset-0 w-full h-full rounded-lg"
                        ></iframe>
                      </div>
                    )}
                    <Link
                      href={`/locations/${store._id}`}
                      className="mt-4 block w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold text-center transition-all duration-300 hover:from-yellow-500 hover:to-orange-600"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}



// 'use client'

// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"
// import Image from "next/image"
// import Link from "next/link"
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import useStore from "@/app/store/useStore"

// export default function SingleCategoryPage() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const {cartCount,setCartCount } = useStore();

//   const baseUrl = process.env.NEXT_PUBLIC_API_URL;

//   const [products, setProducts] = useState([])
//   const [packages, setPackages] = useState([])
//   const [stores, setStores] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [loadingItemId, setLoadingItemId] = useState(null);

//   const { id: categoryId } = useParams()

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)

//         const [productResponse, packageResponse, storeResponse] = await Promise.all([
//           fetch(`/api/product?category=${categoryId}`),
//           fetch('/api/package'),
//           fetch('/api/store')
//         ])

//         const [productResult, packageResult, storeResult] = await Promise.all([
//           productResponse.json(),
//           packageResponse.json(),
//           storeResponse.json()
//         ])

//         if (!productResult.success) {
//           throw new Error(productResult.message || "Error fetching products")
//         }
//         if (!packageResult.success) {
//           throw new Error(packageResult.message || "Error fetching packages")
//         }
//         if (!storeResult.success) {
//           throw new Error(storeResult.message || "Error fetching stores")
//         }

//         setProducts(productResult.data || [])
//         setPackages(packageResult.data || [])
//         setStores(storeResult.data || [])
//       } catch (error) {
//         setError(error.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (categoryId) {
//       fetchData()
//     }
//   }, [categoryId])

//   if (loading) {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>
//   }

//   if (error) {
//     return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
//   }

//   if (!products.length && !packages.length && !stores.length) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         No products, packages, or stores found in this category.
//       </div>
//     )
//   }

//   const addToCart = async (itemId) => {
//     if (!session) {
//       router.push("/login");
//       return;
//     }
//     try {
//       setLoadingItemId(itemId);
//       const response = await fetch(`/api/addproductcart`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ itemId }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         setCartCount(cartCount+1)
//         router.refresh()
//       } else {
//       }
//     } catch (error) {
//       console.error("Error adding item to cart:", error);
//     } finally {
//       setLoadingItemId(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <main>
//         <section className="bg-white">
//           <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-8">
//               Category Products, Packages, and Stores
//             </h1>

//             {/* Products Section */}
//             <div className="mb-12">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">Products</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {products.map((product) => (
//                   <div key={product._id} className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
//                     <Link href={`/products/${product._id}`} className="absolute inset-0 z-10">
//                   <span className="sr-only">View details for {product.name}</span>
//                 </Link>
//                 <div className="relative">
//                 <div className="relative w-full h-48">
//                   {product.imageUrl && product.imageUrl[0] ? (
//                     <Image
//                       src={product.imageUrl[0]}
//                       alt={product.name}
//                       layout="fill"
//                       objectFit="cover"
//                     />
//                   ) : (
//                     <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
//                       No image
//                     </div>
//                   )}
//                 </div>
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold mb-2 text-gray-800">
//                     {product.name}
//                   </h3>
//                   <p className="text-gray-600 mb-4 h-12 overflow-hidden">
//                     {product.description}
//                   </p>
//                   <p className="text-2xl font-bold mb-4 text-orange-500">
//                     £{product.price.toFixed(2)}
//                   </p>
//                   <button
//                     onClick={() => addToCart(product._id)}
//                     disabled={loadingItemId === product._id}
//                     className={`relative z-20 w-full py-2 px-4 rounded-full font-semibold text-center transition-all duration-300 ${
//                       loadingItemId === product._id
//                         ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                         : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
//                     }`}
//                   >
//                     {loadingItemId === product._id ? "Adding..." : "Add to Cart"}
//                   </button>
//                 </div>
//                 </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Packages Section */}
//             <div className="mb-12">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">Packages</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {packages.slice(0, 3).map((pkg) => (
//                   <div
//                   key={pkg._id}
//                   className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
//                   // onClick={() => router.push(`/packages/${pkg._id}`)} // Add redirection
//                 >
//                   <Link href={`/packages/${pkg._id}`} className="absolute inset-0 z-10">
//                     <span className="sr-only">View details for {pkg.name}</span>
//                   </Link>
//                   <div className="relative">
//                   <div className="relative w-full h-48">
//                     {pkg.imageUrl && pkg.imageUrl[0] ? (
//                       <Image
//                         src={pkg.imageUrl[0]}
//                         alt={pkg.name}
//                         layout="fill"
//                         objectFit="cover"
//                       />
//                     ) : (
//                       <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
//                         No image
//                       </div>
//                     )}
//                   </div>
//                   <div className="p-6">
//                     <h3 className="text-xl font-semibold mb-2 text-gray-800">
//                       {pkg.name}
//                     </h3>
//                     <p className="text-gray-600 mb-4 h-16 overflow-hidden">
//                       {pkg.description}
//                     </p>
//                     <p className="text-lg font-semibold mb-2 text-orange-500">
//                       {pkg.minutes} minutes
//                     </p>
//                     <p className="text-2xl font-bold mb-6 text-orange-500">
//                       £{pkg.price.toFixed(2)}
//                     </p>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation(); // Prevent redirection
//                         addToCart(pkg._id);
//                       }}
//                       disabled={loadingItemId === pkg._id}
//                       className={`relative z-20 w-full py-2 px-4 rounded-full font-semibold text-center transition-all duration-300 ${
//                         loadingItemId === pkg._id
//                           ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                           : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
//                       }`}
//                     >
//                       {loadingItemId === pkg._id ? "Adding..." : "Add to Cart"}
//                     </button>
//                   </div>
//                 </div>
//                 </div>
//                 ))}
//               </div>
//             </div>

//             {/* Stores Section */}
//             <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//           <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Our Stores</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {stores.slice(0, 3).map((store) => (
//               <div key={store._id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold mb-2 text-gray-800">{store.name}</h3>
//                   <p className="text-gray-600 mb-2">{store.address}</p>
//                   <p className="text-gray-600 mb-4">Phone: {store.phone}</p>
//                   {store.coordinates && (
//                     <div className="mb-4 relative w-full h-48">
//                       <iframe
//                         src={store.coordinates}
//                         width="100%"
//                         height="100%"
//                         style={{ border: 0 }}
//                         allowFullScreen=""
//                         loading="lazy"
//                         referrerPolicy="no-referrer-when-downgrade"
//                         className="absolute inset-0 w-full h-full rounded-lg"
//                       ></iframe>
//                     </div>
//                   )}
//                   <Link
//                     href={`/locations/${store._id}`}
//                     className="mt-4 block w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold text-center transition-all duration-300 hover:from-yellow-500 hover:to-orange-600"
//                   >
//                     Book Appointment
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }