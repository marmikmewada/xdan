"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useStore from "@/app/store/useStore";
import { Search, ShoppingCart } from 'lucide-react';
import { motion } from "framer-motion";

export default function PackagesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cartCount, setCartCount } = useStore();
  const { selectedMode } = useStore();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const [packages, setPackages] = useState([]);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingItemId, setLoadingItemId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesRes, productsRes, storesRes] = await Promise.all([
          fetch("/api/package"),
          fetch("/api/product"),
          fetch("/api/store"),
        ]);

        const packagesData = await packagesRes.json();
        const productsData = await productsRes.json();
        const storesData = await storesRes.json();

        setPackages(packagesData.data || []);
        setProducts(productsData.data || []);
        setStores(storesData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    return <div className="text-center py-20">Loading...</div>;
  }

  const textColor = selectedMode === "dark" ? "text-white" : "text-black";
  const inputBg = selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800";
  const buttonBg = selectedMode === "dark"
    ? "bg-gray-600 hover:bg-gray-700"
    : "bg-gray-200 hover:bg-gray-300";
  const iconColor = selectedMode === "dark" ? "text-white" : "text-gray-800";
  const hoverIconColor = selectedMode === "dark" ? "hover:text-blue-400" : "hover:text-blue-500";
  const gradientClass = selectedMode === "dark"
    ? "bg-gradient-to-r from-gray-800 to-black"
    : "bg-gradient-to-r from-white to-gray-200";

  const BannerSection = ({ title, description, image, darkModeImage }) => (
    <section className="relative h-[50vh] overflow-hidden">
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-out"
        style={{
          backgroundImage: `url(${selectedMode === "dark" ? darkModeImage : image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center justify-center text-center">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
            {title}
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-200">
            {description}
          </p>
        </div>
      </div>
    </section>
  );

  return (
    <main className={`min-h-screen ${gradientClass} ${textColor}`}>
      <BannerSection
        // title="Limited Time Offer!"
        // description="Get 20% off on all tanning packages when you book a session today."
        image="https://ik.imagekit.io/syziko5ml/banners/photo_5987755899428651921_y.jpg?updatedAt=1734539487784"
        darkModeImage="https://ik.imagekit.io/syziko5ml/banners/photo_5987755899428651955_y.jpg?updatedAt=1734539488014"
      />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Our Packages</h1>

        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="Search packages..."
            className={`w-full p-3 pl-10 ${inputBg} border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className={`absolute left-3 top-3 ${iconColor}`} size={20} />
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Premium Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`${gradientClass} shadow-lg transition-all duration-300 hover:shadow-xl`}
              >
                <Link href={`/packages/${pkg._id}`} className="block">
                  <div className="relative h-64 w-full overflow-hidden">
                    {pkg.imageUrl && pkg.imageUrl[0] ? (
                      <Image
                        src={pkg.imageUrl[0]}
                        alt={pkg.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                    <p className={`text-sm mb-2 ${selectedMode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {pkg.description.substring(0, 100)}...
                    </p>
                    <p className="text-lg font-semibold mb-4">{pkg.minutes} minutes</p>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-bold">£{pkg.price.toFixed(2)}</p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(pkg._id);
                        }}
                        disabled={loadingItemId === pkg._id}
                        className={`${buttonBg} p-2 rounded-full transition-colors duration-300 ${hoverIconColor}`}
                      >
                        <ShoppingCart size={24} />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`${gradientClass} shadow-lg transition-all duration-300 hover:shadow-xl`}
              >
                <Link href={`/products/${product._id}`} className="block">
                  <div className="relative h-64 w-full overflow-hidden">
                    {product.imageUrl && product.imageUrl[0] ? (
                      <Image
                        src={product.imageUrl[0]}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className={`text-sm mb-4 ${selectedMode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {product.description.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-bold">£{product.price.toFixed(2)}</p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product._id);
                        }}
                        disabled={loadingItemId === product._id}
                        className={`${buttonBg} p-2 rounded-full transition-colors duration-300 ${hoverIconColor}`}
                      >
                        <ShoppingCart size={24} />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Locations</h2>
          {stores.map((store) => (
            <div key={store._id} className="mb-8">
              <div className="relative h-[400px] w-full overflow-hidden shadow-lg">
                {store.coordinates ? (
                  <iframe
                    src={`${store.coordinates}${
                      selectedMode === "dark"
                        ? "&style=feature:all|element:geometry|color:0x212121|element:labels.icon|visibility:off|feature:poi|visibility:off"
                        : "&style=feature:all|element:geometry|color:0xeeeeee|element:labels.icon|visibility:on|feature:poi|visibility:on"
                    }`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen
                    aria-hidden="false"
                    tabIndex="0"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                    No map available
                  </div>
                )}
              </div>
              <div className={`${gradientClass} p-6 mt-4`}>
                <h3 className="text-2xl font-bold mb-2">{store.name}</h3>
                <p className={`mb-2 ${selectedMode === "dark" ? "text-gray-300" : "text-gray-600"}`}>{store.address}</p>
                <p className={`mb-4 ${selectedMode === "dark" ? "text-gray-300" : "text-gray-600"}`}>{store.phone}</p>
                <button
                  onClick={() => router.push(`/locations/${store._id}`)}
                  className={`${buttonBg} px-6 py-2 font-semibold transition-colors duration-300`}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}



// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link"
// import useStore from "@/app/store/useStore"

// export default function PackagesPage() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const {cartCount,setCartCount } = useStore();

//   const baseUrl = process.env.NEXT_PUBLIC_API_URL;

//   const [packages, setPackages] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [stores, setStores] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [loadingItemId, setLoadingItemId] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [packagesRes, productsRes, storesRes] = await Promise.all([
//           fetch("/api/package"),
//           fetch("/api/product"),
//           fetch("/api/store"),
//         ]);

//         const packagesData = await packagesRes.json();
//         const productsData = await productsRes.json();
//         const storesData = await storesRes.json();

//         setPackages(packagesData.data || []);
//         setProducts(productsData.data || []);
//         setStores(storesData.data || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const filteredPackages = packages.filter((pkg) =>
//     pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const addToCart = async (itemId) => {
//     if (!session) {
//       router.push("/login");
//       return;
//     }
//     try {
//       setLoadingItemId(itemId);
//       const response = await fetch(`${baseUrl}/api/addproductcart`, {
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

//   if (loading) {
//     return <div className="text-center py-20">Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-gray-900">Our Packages</h1>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {/* Search Bar */}
//         <div className="mb-6">
//           <input
//             type="text"
//             placeholder="Search packages..."
//             className="w-full p-2 border border-gray-300 rounded-md"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {/* Packages Section */}
//         <section className="py-20 bg-white">
//           <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
//             Our Premium Packages
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredPackages.map((pkg) => (
//               <div
//                 key={pkg._id}
//                 className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
//               >
//                 <Link href={`/packages/${pkg._id}`} className="absolute inset-0 z-10">
//                   <span className="sr-only">View details for {pkg.name}</span>
//                 </Link>
//                 <div className="relative">
//                 <div className="relative w-full h-48">
//                   {pkg.imageUrl && pkg.imageUrl[0] ? (
//                     <Image
//                       src={pkg.imageUrl[0]}
//                       alt={pkg.name}
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
//                     {pkg.name}
//                   </h3>
//                   <p className="text-gray-600 mb-4 h-16 overflow-hidden">
//                     {pkg.description}
//                   </p>
//                   <p className="text-lg font-semibold mb-2 text-orange-500">
//                     {pkg.minutes} minutes
//                   </p>
//                   <p className="text-2xl font-bold mb-4 text-orange-500">
//                     £{pkg.price.toFixed(2)}
//                   </p>
//                   <button
//                     onClick={() => addToCart(pkg._id)}
//                     disabled={loadingItemId === pkg._id}
//                     className={`relative z-20 w-full py-2 px-4 rounded-full font-semibold text-center transition-all duration-300 ${
//                       loadingItemId === pkg._id
//                         ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                         : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
//                     }`}
//                   >
//                     {loadingItemId === pkg._id ? "Adding..." : "Add to Cart"}
//                   </button>
//                 </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Products Section */}
//         <section className="py-20 bg-gray-100">
//           <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
//             Featured Products
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {products.slice(0, 3).map((product) => (
//               <div
//                 key={product._id}
//                 className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
//               >
//                 <Link href={`/products/${product._id}`} className="absolute inset-0 z-10">
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
//               </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Stores Section */}
//         <section className="py-20 bg-white">
//           <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
//             Our Stores Locations
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {stores.map((store) => (
//               <div
//                 key={store._id}
//                 className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
//               >
//                 <Link href={`/locations/${store._id}`} className="absolute inset-0 z-10">
//                   <span className="sr-only">View details for {store.name}</span>
//                 </Link>
//                 <div className="relative">
//                 {store.imageUrl && (
//                   <div className="relative w-full h-48">
//                     <Image
//                       src={store.imageUrl}
//                       alt={store.name}
//                       layout="fill"
//                       objectFit="cover"
//                     />
//                   </div>
//                 )}
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold mb-2 text-gray-800">
//                     {store.name}
//                   </h3>
//                   <p className="text-gray-600 mb-2">{store.address}</p>
//                   <p className="text-gray-600 mb-4">Phone: {store.phone}</p>

//                   {store.coordinates ? (
//                     <div className="mb-4">
//                       <h4 className="text-gray-700 text-sm font-semibold mb-2">
//                         Google Map
//                       </h4>
//                       <iframe
//                         src={store.coordinates}
//                         width="100%"
//                         height="300"
//                         frameBorder="0"
//                         style={{ border: 0 }}
//                         allowFullScreen=""
//                         aria-hidden="false"
//                         tabIndex="0"
//                       ></iframe>
//                     </div>
//                   ) : (
//                     <div className="text-red-500 mb-4">
//                       <p>Error: Google Map not available for this location.</p>
//                     </div>
//                   )}

//                   <Link
//                     href={`/store/${store._id}`}
//                     className="relative z-20 w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold text-center transition-all duration-300 hover:from-yellow-500 hover:to-orange-600"
//                   >
//                     Book apointment
//                   </Link>
//                 </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }