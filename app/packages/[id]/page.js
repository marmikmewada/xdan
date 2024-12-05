"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useStore from "@/app/store/useStore";

export default function PackagePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cartCount, setCartCount } = useStore();
  const { selectedMode } = useStore();

  const [packageData, setPackageData] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loadingItemId, setLoadingItemId] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [packageRes, productsRes, storesRes] = await Promise.all([
          fetch(`/api/package/${id}`),
          fetch('/api/product'),
          fetch('/api/store')
        ]);

        const packageDetails = await packageRes.json();
        const productsData = await productsRes.json();
        const storesData = await storesRes.json();

        if (packageDetails.success) {
          setPackageData(packageDetails.data);
        }

        setRelatedProducts(productsData.data || []);
        setStores(storesData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    window.scrollTo(0, 0);
  }, [id]);

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

  if (!packageData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const bgColor = selectedMode === "dark" ? "bg-gradient-to-b from-gray-800 to-black" : "bg-white";
  const textColor = selectedMode === "dark" ? "text-white" : "text-black";
  const cardBg = selectedMode === "dark" ? "bg-gradient-to-r from-gray-800 to-black" : "bg-white";
  const gradientClass = selectedMode === "dark" ? "from-gray-900 to-black" : "from-white to-gray-200";

  const BannerSection = ({ title, description, image }) => (
    <section className="relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white leading-tight animate__animated animate__fadeIn">
            {title}
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 animate__animated animate__fadeIn animate__delay-1s">
            {description}
          </p>
        </div>
      </div>
    </section>
  );

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      <main>
        <BannerSection
          title={packageData.name}
          description="Experience the perfect glow with our premium tanning packages"
          image={packageData.imageUrl && packageData.imageUrl[0] ? packageData.imageUrl[0] : "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80"}
        />

        <section className={`${bgColor} py-12`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Package Images Gallery */}
              <div className="space-y-4">
                <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden transition-all duration-500 ease-in-out rounded-lg shadow-lg">
                  {packageData?.imageUrl && packageData.imageUrl[selectedImage] ? (
                    <Image
                      src={packageData.imageUrl[selectedImage]}
                      alt={`${packageData.name} - View ${selectedImage + 1}`}
                      layout="fill"
                      objectFit="cover"
                      priority
                      className="transition-transform transform hover:scale-105"
                    />
                  ) : (
                    <div className={`flex items-center justify-center h-full ${selectedMode === "dark" ? "bg-gray-800" : "bg-gray-200"} text-gray-500`}>
                      No image available
                    </div>
                  )}
                </div>
                {/* Thumbnails */}
                {packageData?.imageUrl && packageData.imageUrl.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {packageData.imageUrl.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md ${selectedImage === index ? 'ring-2 ring-blue-500' : ''} transition-all duration-300 hover:scale-105`}
                      >
                        <Image
                          src={img}
                          alt={`${packageData.name} thumbnail ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Package Details */}
              <div className="flex flex-col justify-start">
                <h1 className={`text-3xl font-bold ${textColor} sm:text-4xl animate__animated animate__fadeIn`}>{packageData.name}</h1>
                <p className={`mt-2 text-3xl font-semibold ${textColor}`}>£{packageData.price.toFixed(2)}</p>
                <p className={`mt-4 mb-6 text-lg ${selectedMode === "dark" ? "text-gray-300" : "text-gray-600"} animate__animated animate__fadeIn animate__delay-1s`}>{packageData.description}</p>
                <p className={`mb-6 text-lg ${selectedMode === "dark" ? "text-gray-300" : "text-gray-600"}`}>{packageData.minutes} minutes</p>
                <button
                  onClick={() => addToCart(packageData._id)}
                  disabled={loadingItemId === packageData._id}
                  className={`w-full py-3 px-4 text-lg font-semibold text-center transition-all duration-300 ${
                    loadingItemId === packageData._id
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : `${
                          selectedMode === "dark" ? "bg-gradient-to-r from-gray-800 to-black text-white hover:from-gray-700 hover:to-gray-900" : "bg-black text-white hover:bg-gray-800"
                        }`
                  } transform hover:scale-105 rounded-md shadow-md`}
                >
                  {loadingItemId === packageData._id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products Section */}
        <section className={`py-12 ${bgColor} ${gradientClass}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-bold mb-6 text-center ${textColor}`}>Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.slice(0, 3).map((product) => (
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
                          className="transition-all duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <p
                        className={`text-sm mb-3 ${
                          selectedMode === "dark" ? "text-gray-400" : "text-gray-600"
                        } group-hover:text-gray-800 transition-all duration-300`}
                      >
                        {product.description.substring(0, 100)}...
                      </p>
                      <p className="text-xl font-bold mb-3">£{product.price.toFixed(2)}</p>

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
                                selectedMode === "dark" ? "bg-gradient-to-b from-gray-800 to-black text-white" : "bg-black text-white"
                              } hover:bg-gray-800 hover:text-white`
                        }`}
                      >
                        {loadingItemId === product._id ? "Adding..." : "Add to Cart"}
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Locations Section */}
        {stores.map((store, index) => (
          <div key={store._id} className="w-full mb-8">
            <section className="relative pb-8">
              {/* Map Section */}
              <div className="w-full h-[500px] rounded-lg shadow-lg overflow-hidden">
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

              {/* Store Details Section */}
              <div
                className={`absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center justify-center ${
                  selectedMode === "dark"
                    ? "bg-gradient-to-b from-gray-900 to-black text-white"
                    : "bg-gradient-to-b from-white to-gray-100 text-black"
                }`}
                style={{
                  boxShadow: "0px -2px 20px rgba(0, 0, 0, 0.1)",
                  borderRadius: "20px 20px 0 0",
                }}
              >
                <div className="text-center space-y-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-center">{store.name}</h1>
                  <p className={`text-sm sm:text-base ${selectedMode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {store.address}
                  </p>
                  <p className={`text-sm sm:text-base ${selectedMode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {store.phone}
                  </p>
                  <button
                    onClick={() => router.push(`/locations/${store._id}`)}
                    className={`px-6 py-3 border-2 font-semibold text-lg transition-all duration-300 ${
                      selectedMode === "dark"
                        ? "bg-gradient-to-r from-gray-800 to-black border-white text-white hover:bg-white hover:text-gray-400"
                        : "bg-transparent border-black text-black hover:bg-black hover:text-white"
                    }`}
                    style={{
                      padding: "12px 24px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </section>

            {/* Banner */}
            {index === stores.length - 1 && (
              <BannerSection
                title="Limited Time Offer!"
                description="Get 20% off on all tanning packages when you book a session today."
                image="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80"
              />
            )}
          </div>
        ))}

        {/* Final Banner Section - Removed as it's now included in the Stores section */}
      </main>
    </div>
  );
}








// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import useStore from "@/app/store/useStore"

// export default function PackagePage() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const { cartCount, setCartCount, selectedMode } = useStore();

//   const [packageData, setPackageData] = useState(null);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [stores, setStores] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [loadingItemId, setLoadingItemId] = useState(null);
//   const [loadingPackage, setLoadingPackage] = useState(false);

//   const { id } = useParams();

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!id) return;

//       try {
//         const [packageRes, productsRes, storesRes] = await Promise.all([
//           fetch(`/api/package/${id}`),
//           fetch('/api/product'),
//           fetch('/api/store'),
//         ]);

//         const packageDetails = await packageRes.json();
//         const productsData = await productsRes.json();
//         const storesData = await storesRes.json();

//         if (packageDetails.success) {
//           setPackageData(packageDetails.data);
//         }

//         setRelatedProducts(productsData.data || []);
//         setStores(storesData.data || []);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();

//     // Scroll to top when component mounts
//     window.scrollTo(0, 0);
//   }, [id]);

//   const addToCart = async (itemId, isPackage = false) => {
//     if (!session) {
//       router.push('/login');
//       return;
//     }
//     try {
//       if (isPackage) {
//         setLoadingPackage(true);
//       } else {
//         setLoadingItemId(itemId);
//       }

//       const endpoint = '/api/addproductcart';
//       const body = { itemId };

//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//       });

//       const result = await response.json();

//       if (result.success) {
//         setCartCount(cartCount + 1);
//         router.refresh();
//       } else {
//         // Handle error here if necessary
//       }
//     } catch (error) {
//       console.error('Error adding item to cart:', error);
//     } finally {
//       if (isPackage) {
//         setLoadingPackage(false);
//       } else {
//         setLoadingItemId(null);
//       }
//     }
//   };

//   if (!packageData) {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
//   }

//   return (
//     <div className={`min-h-screen ${selectedMode === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
//       <main>
//         <section className={`${selectedMode === 'dark' ? 'bg-black' : 'bg-white'}`}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//   {/* Package Images Gallery */}
//   <div className="space-y-4 flex flex-col items-center md:items-start">
//     <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
//       {packageData?.imageUrl && packageData.imageUrl[selectedImage] ? (
//         <Image
//           src={packageData.imageUrl[selectedImage]}
//           alt={`${packageData.name} - View ${selectedImage + 1}`}
//           fill
//           sizes="(max-width: 768px) 100vw, 50vw"
//           style={{ objectFit: 'cover' }}
//           priority
//         />
//       ) : (
//         <div className="flex items-center justify-center h-full bg-gray-300 text-gray-600">
//           No image available
//         </div>
//       )}
//     </div>
//     {/* Thumbnails */}
//     {packageData?.imageUrl && packageData.imageUrl.length > 1 && (
//       <div className="flex gap-2 overflow-x-auto pb-2 mt-4">
//         {packageData.imageUrl.map((img, index) => (
//           <button
//             key={index}
//             onClick={() => setSelectedImage(index)}
//             className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden ${selectedImage === index ? 'border-2 border-white' : ''}`}
//           >
//             <Image
//               src={img}
//               alt={`${packageData.name} thumbnail ${index + 1}`}
//               fill
//               sizes="80px"
//               style={{ objectFit: 'cover' }}
//             />
//           </button>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* Package Details */}
//   <div className={`flex flex-col justify-start ${selectedMode === 'dark' ? 'bg-black' : 'bg-white'}`}>
//     <h1 className="text-3xl font-extrabold">{packageData.name}</h1>
//     <p className="mt-4 text-xl">{packageData.description}</p>
//     <p className="mt-6 text-3xl font-bold">{`£${packageData.price.toFixed(2)}`}</p>
//     <button
//       onClick={() => addToCart(packageData._id, true)}
//       disabled={loadingPackage}
//       className={`mt-6 w-full py-2 px-4 font-semibold text-center transition-all duration-300 transform ${loadingPackage
//         ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
//         : `${selectedMode === 'dark' ? 'bg-white text-black border-black hover:bg-black hover:text-white' : 'bg-black text-white border-white hover:bg-white hover:text-black'}`}`}
//     >
//       {loadingPackage ? 'Adding...' : 'Add to Cart'}
//     </button>
//   </div>
// </div>

//         </section>

//         {/* Related Products Section */}
//         <section className={`${selectedMode === 'dark' ? 'bg-black' : 'bg-white'} max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8`}>
//           <h2 className="text-2xl font-extrabold mb-6">Related Products</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {relatedProducts.slice(0, 3).map((product) => (
//               <div
//                 key={product._id}
//                 className={`relative ${selectedMode === 'dark' ? 'bg-black text-white border-white' : 'bg-white text-black border-black'} overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl`}
//               >
//                 <Link href={`/products/${product._id}`} className="absolute inset-0 z-10">
//                   <span className="sr-only">View details for {product.name}</span>
//                 </Link>
//                 <div className="relative">
//                   <div className="relative w-full h-48">
//                     {product.imageUrl && product.imageUrl[0] ? (
//                       <Image
//                         src={product.imageUrl[0]}
//                         alt={product.name}
//                         fill
//                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                         style={{ objectFit: 'cover' }}
//                       />
//                     ) : (
//                       <div className="flex items-center justify-center h-full bg-gray-300 text-gray-600">
//                         No image
//                       </div>
//                     )}
//                   </div>
//                   <div className="p-6">
//                     <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
//                     <p className="mb-4">{product.description}</p>
//                     <p className="text-2xl font-bold mb-4">£{product.price}</p>
//                     <button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         addToCart(product._id);
//                       }}
//                       disabled={loadingItemId === product._id}
//                       className={`relative z-20 mt-4 w-full py-2 px-4 font-semibold text-center transition-all duration-300 ${loadingItemId === product._id
//                         ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
//                         : `${selectedMode === 'dark' ? 'bg-white text-black border-white hover:bg-black hover:text-white' : 'bg-black text-white border-black hover:bg-white hover:text-black'}`
//                       }`}
//                     >
//                       {loadingItemId === product._id ? 'Adding...' : 'Add to Cart'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Stores Section */}
//         {/* Locations Section */}
//       {stores.map((store, index) => (
//   <div key={store._id} className="w-full mb-8">
//     <section className="relative pb-8">
//       {/* Map Section - Increase map size and add shadow */}
//       <div className="w-full h-[500px] rounded-lg shadow-lg overflow-hidden">
//         {store.coordinates ? (
//           <iframe
//             src={`${store.coordinates}${selectedMode === "dark" 
//               ? "&style=feature:all|element:geometry|color:0x212121|element:labels.icon|visibility:off|feature:poi|visibility:off" 
//               : "&style=feature:all|element:geometry|color:0xeeeeee|element:labels.icon|visibility:on|feature:poi|visibility:on"}`}
//             width="100%"
//             height="100%"
//             frameBorder="0"
//             style={{ border: 0 }}
//             allowFullScreen
//             aria-hidden="false"
//             tabIndex="0"
//           />
//         ) : (
//           <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
//             No map available
//           </div>
//         )}
//       </div>

//       {/* Store Details Section - Card Layout */}
//       <div
//         className={`absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center justify-center ${selectedMode === "dark" ? "bg-gradient-to-b from-gray-800 to-black text-white" : "bg-gradient-to-b from-white to-gray-200 text-black"}`}
//         style={{
//           boxShadow: "0px -2px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for the card
//           borderRadius: "20px 20px 0 0", // More rounded corners
//         }}
//       >
//         <div className="text-center space-y-4">
//           {/* Store Name (larger, bold) */}
//           <h1 className="text-2xl sm:text-3xl font-bold text-center">{store.name}</h1>

//           {/* Store Address and Phone (smaller, softer colors) */}
//           <p className="text-sm sm:text-base text-gray-700">{store.address}</p>
//           <p className="text-sm sm:text-base text-gray-700">{store.phone}</p>

//           {/* Button with hover and border animation */}
//           <button
//             onClick={() => router.push(`/locations/${store._id}`)}
//             className={`px-6 py-3 border-2 font-semibold text-lg transition-all duration-300 ${selectedMode === "dark" ? "bg-transparent border-white text-white hover:bg-white hover:text-black" : "bg-transparent border-black text-black hover:bg-black hover:text-white"}`}
//             style={{
//               padding: "12px 24px",
//               boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
//             }}
//           >
//             Book Appointment
//           </button>
//         </div>
//       </div>
//     </section>

//     {/* Banner Section - Only on the last store */}
    
//   </div>
// ))}
//       </main>
//     </div>
//   );
// }



// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import useStore from "@/app/store/useStore"

// export default function PackagePage() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const { cartCount, setCartCount } = useStore();

//   const [packageData, setPackageData] = useState(null);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [stores, setStores] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [loadingItemId, setLoadingItemId] = useState(null);
//   const [loadingPackage, setLoadingPackage] = useState(false);

//   const { id } = useParams();

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!id) return;

//       try {
//         const [packageRes, productsRes, storesRes] = await Promise.all([
//           fetch(`/api/package/${id}`),
//           fetch('/api/product'),
//           fetch('/api/store'),
//         ]);

//         const packageDetails = await packageRes.json();
//         const productsData = await productsRes.json();
//         const storesData = await storesRes.json();

//         if (packageDetails.success) {
//           setPackageData(packageDetails.data);
//         }

//         setRelatedProducts(productsData.data || []);
//         setStores(storesData.data || []);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();

//     // Scroll to top when component mounts
//     window.scrollTo(0, 0);
//   }, [id]);

//   const addToCart = async (itemId, isPackage = false) => {
//     if (!session) {
//       router.push('/login');
//       return;
//     }
//     try {
//       if (isPackage) {
//         setLoadingPackage(true);
//       } else {
//         setLoadingItemId(itemId);
//       }

//       const endpoint = '/api/addproductcart';
//       const body = { itemId };

//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//       });

//       const result = await response.json();

//       if (result.success) {
//         setCartCount(cartCount + 1)
//         router.refresh()
//       } else {
//       }
//     } catch (error) {
//       console.error('Error adding item to cart:', error);
//     } finally {
//       if (isPackage) {
//         setLoadingPackage(false);
//       } else {
//         setLoadingItemId(null);
//       }
//     }
//   };

//   if (!packageData) {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <main>
//         <section className="bg-white">
//           <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {/* Package Images Gallery */}
//               <div className="space-y-4">
//                 <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
//                   {packageData?.imageUrl && packageData.imageUrl[selectedImage] ? (
//                     <Image
//                       src={packageData.imageUrl[selectedImage]}
//                       alt={`${packageData.name} - View ${selectedImage + 1}`}
//                       fill
//                       sizes="(max-width: 768px) 100vw, 50vw"
//                       style={{ objectFit: 'cover' }}
//                       priority
//                     />
//                   ) : (
//                     <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
//                       No image available
//                     </div>
//                   )}
//                 </div>
//                 {/* Thumbnails */}
//                 {packageData?.imageUrl && packageData.imageUrl.length > 1 && (
//                   <div className="flex gap-2 overflow-x-auto pb-2">
//                     {packageData.imageUrl.map((img, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setSelectedImage(index)}
//                         className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${selectedImage === index ? 'ring-2 ring-orange-500' : ''
//                           }`}
//                       >
//                         <Image
//                           src={img}
//                           alt={`${packageData.name} thumbnail ${index + 1}`}
//                           fill
//                           sizes="80px"
//                           style={{ objectFit: 'cover' }}
//                         />
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Package Details */}
//               <div className="flex flex-col justify-start">
//                 <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{packageData.name}</h1>
//                 <p className="mt-4 text-xl text-gray-500">{packageData.description}</p>
//                 <p className="mt-6 text-3xl font-bold text-orange-500">£{packageData.price.toFixed(2)}</p>
//                 <button
//                   onClick={() => addToCart(packageData._id, true)}
//                   disabled={loadingPackage}
//                   className={`mt-6 w-full py-2 px-4 rounded-full font-semibold text-center transition-all duration-300 ${loadingPackage
//                       ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
//                       : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
//                     }`}
//                 >
//                   {loadingPackage ? 'Adding...' : 'Add to Cart'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Related Products Section */}
//         <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//           <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Related Products</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {relatedProducts.slice(0, 3).map((product) => (
//               <div
//                 key={product._id}
//                 className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
//               >
//                 <Link href={`/products/${product._id}`} className="absolute inset-0 z-10">
//                   <span className="sr-only">View details for {product.name}</span>
//                 </Link>
//                 <div className="relative">
//                   <div className="relative w-full h-48">
//                     {product.imageUrl && product.imageUrl[0] ? (
//                       <Image
//                         src={product.imageUrl[0]}
//                         alt={product.name}
//                         fill
//                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                         style={{ objectFit: 'cover' }}
//                       />
//                     ) : (
//                       <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
//                         No image
//                       </div>
//                     )}
//                   </div>
//                   <div className="p-6">
//                     <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h3>
//                     <p className="text-gray-600 mb-4">{product.description}</p>
//                     <p className="text-2xl font-bold mb-4 text-orange-500">£{product.price}</p>
//                     <button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         addToCart(product._id);
//                       }}
//                       disabled={loadingItemId === product._id}
//                       className={`relative z-20 mt-4 w-full py-2 px-4 rounded-full font-semibold text-center transition-all duration-300 ${loadingItemId === product._id
//                           ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
//                           : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
//                         }`}
//                     >
//                       {loadingItemId === product._id ? 'Adding...' : 'Add to Cart'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Stores Section */}
//         <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//           <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Our Stores</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {stores.slice(0, 3).map((store) => (
//               <Link href={`/locations/${store._id}`} key={store._id}>
//                 <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
//                   <div className="p-6">
//                     <h3 className="text-xl font-semibold mb-2 text-gray-800">{store.name}</h3>
//                     <p className="text-gray-600 mb-2">{store.address}</p>
//                     <p className="text-gray-600 mb-4">Phone: {store.phone}</p>
//                     {store.coordinates && (
//                       <div className="mb-4">
//                         <iframe
//                           src={store.coordinates}
//                           width="100%"
//                           height="200"
//                           frameBorder="0"
//                           style={{ border: 0 }}
//                           allowFullScreen=""
//                           aria-hidden="false"
//                           tabIndex={0}
//                           className="rounded-lg"
//                         />
//                       </div>
//                     )}
//                     <button
//                       onClick={() => router.push(`/booking/${store._id}`)}
//                       className="block w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold text-center transition-all duration-300 hover:from-yellow-500 hover:to-orange-600"
//                     >
//                       Book Appointment
//                     </button>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }
