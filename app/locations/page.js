"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useStore from "@/app/store/useStore";

export default function LocationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cartCount, setCartCount } = useStore();
  const { selectedMode } = useStore();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingItemId, setLoadingItemId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storesRes, productsRes, packagesRes] = await Promise.all([
          fetch("/api/store"),
          fetch("/api/product"),
          fetch("/api/package"),
        ]);

        const storesData = await storesRes.json();
        const productsData = await productsRes.json();
        const packagesData = await packagesRes.json();

        setStores(storesData.data || []);
        setProducts(productsData.data || []);
        setPackages(packagesData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const bgColor = selectedMode === "dark" ? "bg-black" : "bg-white";
  const textColor = selectedMode === "dark" ? "text-white" : "text-black";
  const cardBg = selectedMode === "dark" ? "bg-black" : "bg-white";

  const BannerSection = ({ title, description, image }) => (
    <section className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-out"
        style={{
          backgroundImage: `url(${image})`,
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
    <main className={`min-h-screen ${bgColor} ${textColor}`}>
      <BannerSection
        title="Limited Time Offer!"
        description="Get 20% off on all tanning products when you book a session today."
        image="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80"
      />
      <header className={`${bgColor} shadow`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center">Our Locations</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search locations, products, or packages..."
            className={`w-full p-2 border ${
              selectedMode === "dark"
                ? "border-gray-700 bg-gray-800"
                : "border-gray-300 bg-white"
            } rounded-md`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Locations Section */}
        {/* Stores Section */}
        <section className={`py-12 ${bgColor}`}>
          <h2 className="text-3xl font-bold mb-6 text-center">
            Our Stores Locations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => (
              <div key={store._id} className="w-full">
                <section className="relative pb-8">
                  {/* Map Section */}
                  <div className="w-full h-[400px]">
                    {store.coordinates ? (
                      <iframe
                        src={`${store.coordinates}${
                          selectedMode === "dark"
                            ? "&style=feature:all|element:geometry|color:0x212121"
                            : ""
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

                  {/* Store Details Section - Card Layout */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center justify-center ${
                      selectedMode === "dark"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                    style={{
                      boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px 10px 0 0",
                    }}
                  >
                    <div className="text-center">
                      <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
                        {store.name}
                      </h1>
                      <p className="text-base sm:text-lg mb-4">
                        {store.address}
                      </p>
                      <p className="text-base sm:text-lg mb-6">{store.phone}</p>

                      <button
                        onClick={() => router.push(`/locations/${store._id}`)}
                        className={`px-6 py-3 ${
                          selectedMode === "dark"
                            ? "bg-white text-black hover:bg-gray-200"
                            : "bg-black text-white hover:bg-gray-800"
                        } font-semibold text-lg transition-all duration-300`}
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </section>

                
               
              </div>
            ))}
            
          </div>
          {/* Banner Section */}
                
          <BannerSection
                    title="Limited Time Offer!"
                    description="Get 20% off on all tanning products when you book a session today."
                    image="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80"
                  />
        </section>

        {/* Products Section */}
        <section className={`py-12 ${bgColor}`}>
          <h2 className="text-3xl font-bold mb-6 text-center">
            Our Tanning Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className={`${cardBg} shadow-md transition-all duration-300 hover:shadow-lg relative group`}
              >
                <Link href={`/products/${product._id}`} className="block">
                  <div className="relative h-48 w-full group-hover:opacity-75 transition-all duration-300">
                    {product.imageUrl && product.imageUrl[0] ? (
                      <Image
                        src={product.imageUrl[0]}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-all duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {product.name}
                    </h3>
                    <p
                      className={`text-sm mb-3 ${
                        selectedMode === "dark"
                          ? "text-gray-400"
                          : "text-gray-600"
                      } group-hover:text-gray-800 transition-all duration-300`}
                    >
                      {product.description.substring(0, 100)}...
                    </p>
                    <p className="text-xl font-bold mb-3">
                      £{product.price.toFixed(2)}
                    </p>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product._id);
                      }}
                      disabled={loadingItemId === product._id}
                      className={`w-full py-2 px-4 text-sm font-semibold text-center transition-all duration-300 transform group-hover:scale-105 ${
                        loadingItemId === product._id
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : `${
                              selectedMode === "dark"
                                ? "bg-white text-black"
                                : "bg-black text-white"
                            } hover:bg-gray-800 hover:text-white`
                      }`}
                    >
                      {loadingItemId === product._id
                        ? "Adding..."
                        : "Add to Cart"}
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Packages Section */}
        <section className={`py-12 ${bgColor}`}>
          <h2 className="text-3xl font-bold mb-6 text-center">
            Our Premium Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg._id}
                className={`${cardBg} shadow-md transition-all duration-300 hover:shadow-lg relative group`}
              >
                <Link href={`/packages/${pkg._id}`} className="block">
                  <div className="relative h-48 w-full group-hover:opacity-75 transition-all duration-300">
                    {pkg.imageUrl && pkg.imageUrl[0] ? (
                      <Image
                        src={pkg.imageUrl[0]}
                        alt={pkg.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-all duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Package Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
                    <p
                      className={`text-sm mb-3 ${
                        selectedMode === "dark"
                          ? "text-gray-400"
                          : "text-gray-600"
                      } group-hover:text-gray-800 transition-all duration-300`}
                    >
                      {pkg.description.substring(0, 100)}...
                    </p>
                    <p className="text-lg font-semibold mb-2">
                      {pkg.minutes} minutes
                    </p>
                    <p className="text-xl font-bold mb-3">
                      £{pkg.price.toFixed(2)}
                    </p>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(pkg._id);
                      }}
                      disabled={loadingItemId === pkg._id}
                      className={`w-full py-2 px-4 text-sm font-semibold text-center transition-all duration-300 transform group-hover:scale-105 ${
                        loadingItemId === pkg._id
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : `${
                              selectedMode === "dark"
                                ? "bg-white text-black"
                                : "bg-black text-white"
                            } hover:bg-gray-800 hover:text-white`
                      }`}
                    >
                      {loadingItemId === pkg._id ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
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
// import Link from "next/link";
// import useStore from "@/app/store/useStore"

// export default function LocationsPage() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL;
//   const {cartCount,setCartCount } = useStore();

//   const [stores, setStores] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [packages, setPackages] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [loadingItemId, setLoadingItemId] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [storesRes, productsRes, packagesRes] = await Promise.all([
//           fetch("/api/store"),
//           fetch("/api/product"),
//           fetch("/api/package"),
//         ]);

//         const storesData = await storesRes.json();
//         const productsData = await productsRes.json();
//         const packagesData = await packagesRes.json();

//         setStores(storesData.data || []);
//         setProducts(productsData.data || []);
//         setPackages(packagesData.data || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const filteredStores = stores.filter((store) =>
//     store.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return <div className="text-center py-20">Loading...</div>;
//   }

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

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-gray-900">Our Locations</h1>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {/* Search Bar */}
//         <div className="mb-6">
//           <input
//             type="text"
//             placeholder="Search locations..."
//             className="w-full p-2 border border-gray-300 rounded-md"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {/* Stores Section */}
//         <section className="py-20 bg-white">
//           <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
//             Our Store Locations
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredStores.map((store) => (
//               <Link key={store._id} href={`/locations/${store?._id}`}>
//               <div
//                 className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
//               >
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

// <button
//                     onClick={() => router.push(`/booking/${store._id}`)}
//                     className="block w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold text-center transition-all duration-300 hover:from-yellow-500 hover:to-orange-600"
//                   >
//                     Book Appointment
//                   </button>
//                 </div>
//               </div>
//               </Link>
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
//               key={product._id}
//               className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
//               // onClick={() => router.push(`/products/${product._id}`)}
//             >
//                <Link href={`/products/${product._id}`} className="absolute inset-0 z-10">
//                 <span className="sr-only">View details for {product.name}</span>
//               </Link>
//               <div className="relative">
//               <div className="relative w-full h-48">
//                 {product.imageUrl && product.imageUrl[0] ? (
//                   <Image
//                     src={product.imageUrl[0]}
//                     alt={product.name}
//                     layout="fill"
//                     objectFit="cover"
//                   />
//                 ) : (
//                   <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
//                     No image
//                   </div>
//                 )}
//               </div>
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2 text-gray-800">
//                   {product.name}
//                 </h3>
//                 <p className="text-gray-600 mb-4 h-12 overflow-hidden">
//                   {product.description}
//                 </p>
//                 <p className="text-2xl font-bold mb-4 text-orange-500">
//                   £{product.price.toFixed(2)}
//                 </p>
//                 <button
//                   onClick={() => addToCart(product._id)}
//                   disabled={loadingItemId === product._id}
//                   className={`relative z-20 w-full py-2 px-4 rounded-full font-semibold text-center transition-all duration-300 ${
//                     loadingItemId === product._id
//                       ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                       : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
//                   }`}
//                 >
//                   {loadingItemId === product._id ? "Adding..." : "Add to Cart"}
//                 </button>
//               </div>
//               </div>
//             </div>
//             ))}
//           </div>
//         </section>

//         {/* Packages Section */}
//         <section className="py-20 bg-white">
//           <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
//             Featured Packages
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {packages.slice(0, 3).map((pkg) => (
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
//       </main>
//     </div>
//   );
// }
