"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useStore from "../app/store/useStore";

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [cartCount, setCartCount] = useState(0);
  const { selectedMode } = useStore();

  const heroImages = [
    "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607008829749-c0f284074b61?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingItemId, setLoadingItemId] = useState(null);

  const categoriesRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeData, productData, packageData, categoryData] =
          await Promise.all([ 
            fetch(`/api/store`).then((res) => res.json()), 
            fetch(`/api/product`).then((res) => res.json()), 
            fetch(`/api/package`).then((res) => res.json()), 
            fetch(`/api/category`).then((res) => res.json()), 
          ]);

        console.log("productData", productData?.data);
        console.log("packageData", packageData?.data);
        setStores(storeData?.data || []);
        setProducts(productData?.data || []);
        setPackages(packageData?.data || []);
        setCategories(categoryData?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [baseUrl]);

  useEffect(() => {
    if (selectedMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [selectedMode]);

  const addToCart = async (itemId) => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      setLoadingItemId(itemId);
      const response = await fetch(`${baseUrl}/api/addproductcart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      const result = await response.json();
      if (result.success) {
        setCartCount((prev) => prev + 1);
        router.refresh();
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  const bgColor = selectedMode === "dark" 
  ? "bg-gradient-to-b from-black to-gray-900" // Dark gradient
  : "bg-gradient-to-b from-white to-gray-100"; // Light gradient

const textColor = selectedMode === "dark" ? "text-white" : "text-black";
const buttonBgColor = selectedMode === "dark" ? "bg-white" : "bg-black";
const buttonTextColor = selectedMode === "dark" ? "text-black" : "text-white";
const buttonHoverBgColor = selectedMode === "dark" ? "hover:bg-gray-200" : "hover:bg-gray-800";



  const HeroSection = ({ title, description, image, buttons }) => (
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
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white leading-tight">
            {title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8">
            {description}
          </p>
          <div className="flex flex-wrap gap-4">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`px-6 py-3 ${button.primary ? `${buttonBgColor} ${buttonTextColor}` : 'bg-transparent border border-white text-white hover:bg-white hover:text-black'} font-semibold text-lg sm:text-xl transition-all duration-300 ${buttonHoverBgColor}`}
              >
                {button.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

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
      {/* Hero Section */}
      <HeroSection
        title="Glow Up at Bronze & Beauty"
        description="Experience the best tanning services in the UK with our state-of-the-art facilities"
        image={heroImages[currentImageIndex]}
        buttons={[
          { text: "Book Your Session", onClick: () => router.push("/locations"), primary: true },
          { text: "View Services", onClick: () => router.push("/services"), primary: false },
        ]}
      />

      {/* Products Section */}
      {products.map((product, index) => (
        <div key={product._id}>
          <HeroSection
            title={product.name}
            description={product.description + ' ' + product.description}
            image={product.imageUrl && product.imageUrl.length > 0 ? product.imageUrl[0] : heroImages[0]}
            buttons={[
              { 
                text: loadingItemId === product._id ? "Adding..." : "Add to Cart", 
                onClick: (e) => { e.preventDefault(); addToCart(product._id); },
                primary: true,
                className: "cart-button"
              },
              { 
                text: `£${product.price.toFixed(2)}`, 
                onClick: (e) => { e.preventDefault(); addToCart(product._id); },
                primary: false 
              },
            ]}
            images={product.imageUrl}
          />
          {index === products.length - 1 && (
            <BannerSection
              title="Limited Time Offer!"
              description="Get 20% off on all tanning products when you book a session today."
              image="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80"
            />
          )}
        </div>
      ))}

      {/* Packages Section */}
      {packages.map((pkg, index) => (
        <div key={pkg._id}>
          <HeroSection
            title={pkg.name}
            description={`${pkg.minutes} minutes`}
            image={pkg.imageUrl && pkg.imageUrl[0] ? pkg.imageUrl[0] : heroImages[1]}
            buttons={[
              { 
                text: loadingItemId === pkg._id ? "Adding..." : "Add to Cart", 
                onClick: (e) => { e.preventDefault(); addToCart(pkg._id); },
                primary: true
              },
              { 
                text: `£${pkg.price.toFixed(2)}`, 
                onClick: (e) => { e.preventDefault(); addToCart(pkg._id); },
                primary: false 
              },
            ]}
          />
          {index === packages.length - 1 && (
            <BannerSection
              title="Limited Time Offer!"
              description="Get 20% off on all tanning products when you book a session today."
              image="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80"
            />
          )}
        </div>
      ))}

      {/* Locations Section */}
      {stores.map((store, index) => (
  <div key={store._id} className="w-full mb-8">
    <section className="relative pb-8">
      {/* Map Section - Increase map size and add shadow */}
      <div className="w-full h-[500px] rounded-lg shadow-lg overflow-hidden">
        {store.coordinates ? (
          <iframe
            src={`${store.coordinates}${selectedMode === "dark" 
              ? "&style=feature:all|element:geometry|color:0x212121|element:labels.icon|visibility:off|feature:poi|visibility:off" 
              : "&style=feature:all|element:geometry|color:0xeeeeee|element:labels.icon|visibility:on|feature:poi|visibility:on"}`}
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
        className={`absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center justify-center ${selectedMode === "dark" ? "bg-gradient-to-b from-gray-800 to-black text-white" : "bg-gradient-to-b from-white to-gray-200 text-black"}`}
        style={{
          boxShadow: "0px -2px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for the card
          borderRadius: "20px 20px 0 0", // More rounded corners
        }}
      >
        <div className="text-center space-y-4">
          {/* Store Name (larger, bold) */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center">{store.name}</h1>

          {/* Store Address and Phone (smaller, softer colors) */}
          <p className="text-sm sm:text-base text-gray-700">{store.address}</p>
          <p className="text-sm sm:text-base text-gray-700">{store.phone}</p>

          {/* Button with hover and border animation */}
          <button
            onClick={() => router.push(`/locations/${store._id}`)}
            className={`px-6 py-3 border-2 font-semibold text-lg transition-all duration-300 ${selectedMode === "dark" ? "bg-transparent border-white text-white hover:bg-white hover:text-black" : "bg-transparent border-black text-black hover:bg-black hover:text-white"}`}
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

    {/* Banner Section - Only on the last store */}
    {index === stores.length - 1 && (
      <BannerSection
        title="Limited Time Offer!"
        description="Get 20% off on all tanning products when you book a session today."
        image="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80"
      />
    )}
  </div>
))}





    </main>
  );
}











// "use client"
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import useStore from "../app/store/useStore";
// // import Image from "next/image";

// export default function Page() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL;
//   const [cartCount, setCartCount] = useState(0);
//   const { selectedMode } = useStore();

//   const heroImages = [
//     "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80",
//     "https://images.unsplash.com/photo-1607008829749-c0f284074b61?auto=format&fit=crop&q=80",
//     "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80",
//     "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80",
//   ];

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [stores, setStores] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [packages, setPackages] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loadingItemId, setLoadingItemId] = useState(null);

//   const carouselRef = useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [storeData, productData, packageData, categoryData] =
//           await Promise.all([ 
//             fetch(`${baseUrl}/api/store`).then((res) => res.json()), 
//             fetch(`${baseUrl}/api/product`).then((res) => res.json()), 
//             fetch(`${baseUrl}/api/package`).then((res) => res.json()), 
//             fetch(`${baseUrl}/api/category`).then((res) => res.json()), 
//           ]);

//         setStores(storeData?.data || []);
//         setProducts(productData?.data || []);
//         setPackages(packageData?.data || []);
//         setCategories(categoryData?.data || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();

//     const intervalId = setInterval(() => {
//       setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
//     }, 5000);

//     return () => clearInterval(intervalId);
//   }, [baseUrl]);

//   useEffect(() => {
//     if (selectedMode === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [selectedMode]);

//   const addToCart = async (itemId) => {
//     if (!session) {
//       router.push("/login");
//       return;
//     }

//     try {
//       setLoadingItemId(itemId);
//       const response = await fetch(`${baseUrl}/api/addproductcart`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ itemId }),
//       });

//       const result = await response.json();
//       if (result.success) {
//         setCartCount((prev) => prev + 1);
//         router.refresh();
//       }
//     } catch (error) {
//       console.error("Error adding item to cart:", error);
//     } finally {
//       setLoadingItemId(null);
//     }
//   };

//   const scrollCarousel = (direction) => {
//     if (carouselRef.current) {
//       const scrollAmount = direction === "left" ? -200 : 200;
//       carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
//     }
//   };

//   const bgColor = selectedMode === "dark" ? "bg-black" : "bg-white";
//   const textColor = selectedMode === "dark" ? "text-white" : "text-black";
//   const cardBg = selectedMode === "dark" ? "bg-black" : "bg-white";

//   return (
//     <main className={`min-h-screen ${bgColor} ${textColor}`}>
//       {/* Hero Section */}
//       <section className="relative h-screen overflow-hidden">
//         <div
//           className="absolute inset-0 transition-opacity duration-1000 ease-out"
//           style={{
//             backgroundImage: `url(${heroImages[currentImageIndex]})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//         >
//           <div className="absolute inset-0 bg-black bg-opacity-60" />
//         </div>
//         <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
//           <div className="max-w-2xl">
//             <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white leading-tight">
//               Glow Up at Bronze & Beauty
//             </h1>
//             <p className="text-lg md:text-xl text-gray-200 mb-8">
//               Experience the best tanning services in the UK with our state-of-the-art facilities
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <button
//                 onClick={() => router.push("/locations")}
//                 className="px-6 py-3 bg-white text-black font-semibold text-lg transition-all duration-300 hover:bg-gray-200"
//               >
//                 Book Your Session
//               </button>
//               <button
//                 onClick={() => router.push("/services")}
//                 className="px-6 py-3 bg-transparent border border-white text-white font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-black"
//               >
//                 View Services
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Categories Section */}
//       <section className={`py-8 ${bgColor}`}>
//   <div className="max-w-7xl mx-auto px-4">
//     <h2 className="text-4xl font-bold mb-6 text-center">Explore Categories</h2>

//     <div className="relative">
//       {/* Scroll Indicators */}
//       <div className="absolute inset-y-0 left-0 flex items-center justify-center z-10">
//         <button
//           onClick={() => scrollCarousel("left")}
//           className={`${
//             selectedMode === "dark" ? "bg-white text-black" : "bg-black text-white"
//           } text-2xl p-2 rounded-full shadow-lg hover:opacity-75 transition-all`}
//           aria-label="Scroll left"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>
//       </div>
//       <div className="absolute inset-y-0 right-0 flex items-center justify-center z-10">
//         <button
//           onClick={() => scrollCarousel("right")}
//           className={`${
//             selectedMode === "dark" ? "bg-white text-black" : "bg-black text-white"
//           } text-2xl p-2 rounded-full shadow-lg hover:opacity-75 transition-all`}
//           aria-label="Scroll right"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </button>
//       </div>

//       {/* Category Links Carousel */}
//       <div
//         ref={carouselRef}
//         className="flex overflow-x-auto gap-8 pb-8 scrollbar-hidden"
//       >
//         {categories.map((category) => (
//           <div
//             key={category._id}
//             className={`flex-shrink-0 w-32 h-16 ${
//               selectedMode === "dark" ? "bg-black" : "bg-white"
//             } flex items-center justify-center text-lg font-semibold text-center text-${selectedMode === "dark" ? "white" : "black"} rounded-lg hover:scale-105 transition-all`}
//           >
//             <Link href={`/categories/${category._id}`} className="block">
//               <span className="capitalize">{category.name}</span>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>

//   {/* Custom Scrollbar Styles */}
//   <style jsx>{`
//     .scrollbar-hidden::-webkit-scrollbar {
//       height: 8px;
//     }

//     .scrollbar-hidden::-webkit-scrollbar-thumb {
//       background-color: ${selectedMode === "dark" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"};
//       border-radius: 999px;
//       transition: background-color 0.3s ease;
//     }

//     .scrollbar-hidden::-webkit-scrollbar-thumb:hover {
//       background-color: ${selectedMode === "dark" ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)"};
//     }

//     .scrollbar-hidden::-webkit-scrollbar-track {
//       background: transparent;
//     }
//   `}</style>
// </section>





//       {/* Products Section */}
//       <section className={`py-0 ${bgColor}`}>
//   <div className="relative w-full h-screen overflow-hidden">
//     <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50">
//       <h2 className="text-5xl font-bold text-white mb-6">Premium Tanning Products</h2>
//     </div>
//     <div className="relative w-full h-full overflow-hidden">
//       <div className="flex h-full overflow-x-auto gap-6 pb-8 items-center justify-center">
//         {products.map((product) => (
//           <div
//             key={product._id}
//             className={`relative w-full min-w-[100vw] h-[100vh] ${cardBg} overflow-hidden shadow-md transition-all duration-300 group`}
//           >
//             <div className="relative w-full h-3/4">
//               {/* Product Image as Background */}
//               {product.imageUrl && product.imageUrl[0] ? (
//                 <Image
//                   src={product.imageUrl[0]}
//                   alt={product.name}
//                   layout="fill"
//                   objectFit="cover"
//                   className="absolute inset-0 group-hover:scale-110 transition-all duration-300"
//                 />
//               ) : (
//                 <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
//                   No image
//                 </div>
//               )}
//             </div>

//             {/* Product Details Overlaid */}
//             <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center p-6">
//               <h3 className="text-3xl font-semibold text-white mb-4">{product.name}</h3>
//               <p className="text-lg text-gray-200 mb-4">
//                 {product.description.substring(0, 100)}...
//               </p>
//               <p className="text-xl font-bold text-white mb-6">£{product.price.toFixed(2)}</p>

//               {/* Add to Cart Button */}
//               <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   addToCart(product._id);
//                 }}
//                 disabled={loadingItemId === product._id}
//                 className={`w-full py-3 px-6 text-lg font-semibold text-center transition-all duration-300 transform group-hover:scale-105 ${
//                   loadingItemId === product._id
//                     ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                     : "bg-white text-black hover:bg-gray-200"
//                 }`}
//               >
//                 {loadingItemId === product._id ? "Adding..." : "Add to Cart"}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// </section>




// <section className="py-12 text-center">
//   {/* Banner Text */}
//   <h3 className="text-2xl font-semibold">Limited Time Offer!</h3>
//   <p className="mt-4">Get 20% off on all tanning products when you book a session today.</p>

//   {/* Banner Image based on light or dark mode */}
//   <div className="mt-8">
//     {selectedMode === "dark" ? (
//       <div className="w-full h-auto relative">
//         <Image 
//           src="https://www.sunspawellness.com/images/posts/kbl-p9s-hybrid-1.jpg" 
//           alt="Limited Time Offer - Dark Mode" 
//           layout="responsive"
//           width={640}
//           height={286}
//         />
//       </div>
//     ) : (
//       <div className="w-full h-auto relative">
//         <Image 
//           src="https://static.wixstatic.com/media/f2b14c_92160940e2d9435ea71e29271334893a~mv2.jpg/v1/fill/w_640,h_286,fp_0.95_0.44,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/f2b14c_92160940e2d9435ea71e29271334893a~mv2.jpg" 
//           alt="Limited Time Offer - Light Mode" 
//           layout="responsive"
//           width={640}
//           height={286}
//         />
//       </div>
//     )}
//   </div>
// </section>




// {/* Packages Section */}
// <section className={`py-12 ${bgColor}`}>
//   <div className="max-w-7xl mx-auto px-4">
//     <h2 className="text-3xl font-bold mb-6 text-center">Exclusive Packages</h2>
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {packages.map((pkg) => (
//         <div
//           key={pkg._id}
//           className={`${cardBg} shadow-md transition-all duration-300 hover:shadow-lg relative group`}
//         >
//           <Link href={`/packages/${pkg._id}`} className="block">
//             <div className="relative h-48 w-full group-hover:opacity-75 transition-all duration-300">
//               {pkg.imageUrl && pkg.imageUrl[0] ? (
//                 <Image
//                   src={pkg.imageUrl[0]}
//                   alt={pkg.name}
//                   layout="fill"
//                   objectFit="cover"
//                   className="transition-all duration-300 group-hover:scale-110"
//                 />
//               ) : (
//                 <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
//                   No image
//                 </div>
//               )}
//             </div>

//             {/* Package Details */}
//             <div className="p-4">
//               <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
//               {/* Description with hover effect */}
//               <p
//                 className={`text-sm mb-3 text-gray-600 group-hover:text-gray-800 transition-all duration-300`}
//               >
//                 {pkg.description.substring(0, 100)}...
//               </p>
//               <p className="text-lg font-semibold mb-2">{pkg.minutes} minutes</p>
//               <p className="text-xl font-bold mb-3">£{pkg.price.toFixed(2)}</p>

//               {/* Add to Cart Button */}
//               <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   addToCart(pkg._id);
//                 }}
//                 disabled={loadingItemId === pkg._id}
//                 className={`w-full py-2 px-4 text-sm font-semibold text-center transition-all duration-300 transform group-hover:scale-105 ${
//                   loadingItemId === pkg._id
//                     ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                     : "bg-black text-white hover:bg-gray-800"
//                 }`}
//               >
//                 {loadingItemId === pkg._id ? "Adding..." : "Add to Cart"}
//               </button>
//             </div>
//           </Link>
//         </div>
//       ))}
//     </div>
//   </div>
// </section>

// <section className="py-12 text-center">
//   {/* Banner Text */}
//   <h3 className="text-2xl font-semibold">Limited Time Offer!</h3>
//   <p className="mt-4">Get 20% off on all tanning products when you book a session today.</p>

//   {/* Banner Image based on light or dark mode */}
//   <div className="mt-8">
//     {selectedMode === "dark" ? (
//       <div className="w-full h-auto relative">
//         <Image 
//           src="https://www.sunspawellness.com/images/posts/kbl-p9s-hybrid-1.jpg" 
//           alt="Limited Time Offer - Dark Mode" 
//           layout="responsive"
//           width={640}
//           height={286}
//         />
//       </div>
//     ) : (
//       <div className="w-full h-auto relative">
//         <Image 
//           src="https://static.wixstatic.com/media/f2b14c_92160940e2d9435ea71e29271334893a~mv2.jpg/v1/fill/w_640,h_286,fp_0.95_0.44,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/f2b14c_92160940e2d9435ea71e29271334893a~mv2.jpg" 
//           alt="Limited Time Offer - Light Mode" 
//           layout="responsive"
//           width={640}
//           height={286}
//         />
//       </div>
//     )}
//   </div>
// </section>


// <section className={`py-12 ${bgColor}`}>
//   <div className="max-w-7xl mx-auto px-4">
//     <h2 className="text-3xl font-bold mb-6 text-center">Our Locations</h2>
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {stores.map((store) => (
//         <div
//           key={store._id}
//           className={`${cardBg} shadow-md transition-all duration-300 hover:shadow-lg relative group`}
//         >
//           <Link href={`/locations/${store?._id}`}>
//             {/* Map Section */}
//             <div className="relative h-48 w-full">
//               {store.coordinates ? (
//                 <div className="relative h-full w-full">
//                   <iframe
//                     src={`${store.coordinates}${
//                       selectedMode === "dark"
//                         ? "&style=feature:all|element:geometry|color:0x212121"
//                         : ""
//                     }`} // Custom dark/light style for the map
//                     width="100%"
//                     height="100%"
//                     frameBorder="0"
//                     style={{ border: 0 }}
//                     allowFullScreen=""
//                     aria-hidden="false"
//                     tabIndex="0"
//                     className="absolute inset-0 group-hover:scale-105 transition-all duration-300"
//                   />
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
//                   No map available
//                 </div>
//               )}
//             </div>

//             {/* Location Details */}
//             <div className="p-4">
//               <p
//                 className={`text-sm mb-2 ${
//                   selectedMode === "dark" ? "text-gray-300" : "text-gray-600"
//                 }`}
//               >
//                 {store.address}
//               </p>
//               <p
//                 className={`text-sm mb-3 ${
//                   selectedMode === "dark" ? "text-gray-300" : "text-gray-600"
//                 }`}
//               >
//                 Phone: {store.phone}
//               </p>
//               <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   router.push(`/booking/${store._id}`);
//                 }}
//                 className="w-full py-2 px-4 bg-black text-white text-sm font-semibold transition-all duration-300 hover:bg-gray-800"
//               >
//                 Book Appointment
//               </button>
//             </div>
//           </Link>
//         </div>
//       ))}
//     </div>
//   </div>
// </section>



// <section className="py-12 text-center">
//   {/* Banner Text */}
//   <h3 className="text-2xl font-semibold">Limited Time Offer!</h3>
//   <p className="mt-4">Get 20% off on all tanning products when you book a session today.</p>

//   {/* Banner Image based on light or dark mode */}
//   <div className="mt-8">
//     {selectedMode === "dark" ? (
//       <div className="w-full h-auto relative">
//         <Image 
//           src="https://www.sunspawellness.com/images/posts/kbl-p9s-hybrid-1.jpg" 
//           alt="Limited Time Offer - Dark Mode" 
//           layout="responsive"
//           width={640}
//           height={286}
//         />
//       </div>
//     ) : (
//       <div className="w-full h-auto relative">
//         <Image 
//           src="https://static.wixstatic.com/media/f2b14c_92160940e2d9435ea71e29271334893a~mv2.jpg/v1/fill/w_640,h_286,fp_0.95_0.44,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/f2b14c_92160940e2d9435ea71e29271334893a~mv2.jpg" 
//           alt="Limited Time Offer - Light Mode" 
//           layout="responsive"
//           width={640}
//           height={286}
//         />
//       </div>
//     )}
//   </div>
// </section>


//     </main>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import Link from "next/link"

// export default function Page() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL;
//   const [cartCount, setCartCount] = useState(0);

//   const heroImages = [
//     "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80",
//     "https://images.unsplash.com/photo-1607008829749-c0f284074b61?auto=format&fit=crop&q=80",
//     "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80",
//     "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80"
//   ];

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [stores, setStores] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [packages, setPackages] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loadingItemId, setLoadingItemId] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [storeData, productData, packageData, categoryData] = await Promise.all([
//           fetch(`${baseUrl}/api/store`).then(res => res.json()),
//           fetch(`${baseUrl}/api/product`).then(res => res.json()),
//           fetch(`${baseUrl}/api/package`).then(res => res.json()),
//           fetch(`${baseUrl}/api/category`).then(res => res.json())
//         ]);

//         setStores(storeData?.data || []);
//         setProducts(productData?.data || []);
//         setPackages(packageData?.data || []);
//         setCategories(categoryData?.data || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();

//     const intervalId = setInterval(() => {
//       setCurrentImageIndex(prev => (prev + 1) % heroImages.length);
//     }, 5000);

//     return () => clearInterval(intervalId);
//   }, [baseUrl]);

//   const addToCart = async (itemId) => {
//     if (!session) {
//       router.push("/login");
//       return;
//     }

//     try {
//       setLoadingItemId(itemId);
//       const response = await fetch(`${baseUrl}/api/addproductcart`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ itemId })
//       });

//       const result = await response.json();
//       if (result.success) {
//         setCartCount(prev => prev + 1);
//         router.refresh()
//       }
//     } catch (error) {
//       console.error("Error adding item to cart:", error);
//     } finally {
//       setLoadingItemId(null);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
//       {/* Hero Section */}
//       <section className="relative h-[85vh] overflow-hidden">
//         <div
//           className="absolute inset-0 transition-transform duration-1000 ease-out transform scale-105"
//           style={{
//             backgroundImage: `url(${heroImages[currentImageIndex]})`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center'
//           }}
//         >
//           <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
//         </div>
//         <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
//           <div className="max-w-2xl">
//             <h1 className="text-6xl md:text-7xl font-black mb-6 text-white leading-tight">
//               Glow Up at{" "}
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
//                 Bronze & Beauty
//               </span>
//             </h1>
//             <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed">
//               Experience the best tanning services in the UK with our state-of-the-art facilities
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <button
//                 onClick={() => router.push('/locations')}
//                 className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-orange-500/20 hover:scale-105"
//               >
//                 Book Your Session
//               </button>
//               <button
//                 onClick={() => router.push('/services')}
//                 className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg shadow-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
//               >
//                 View Services
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-50 to-transparent" />
//       </section>

//       {/* Categories Section */}
//       <section className="py-24 bg-white relative overflow-hidden">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-100/40 via-transparent to-transparent" />
//         <div className="max-w-7xl mx-auto px-4 relative">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4 text-gray-900">
//               Explore Our Services
//             </h2>
//             <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//               Discover our range of professional tanning and beauty services
//             </p>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
//             {categories.map((category, index) => (
//               <div
//                 key={category._id}
//                 className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-50 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 <div className="relative text-center">
//                   <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
//                     <span className="text-2xl text-white font-bold">
//                       {category.name.charAt(0)}
//                     </span>
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors duration-300">
//                     {category.name}
//                   </h3>
//                   <button
//                     onClick={() => router.push(`/categories/${category._id}`)}
//                     className="mt-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-900 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
//                   >
//                     Explore
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Products Section */}
//       <section className="py-24 bg-neutral-50 relative">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-100/30 via-transparent to-transparent" />
//         <div className="max-w-7xl mx-auto px-4 relative">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4 text-gray-900">
//               Premium Tanning Products
//             </h2>
//             <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//               Professional-grade products for the perfect tan
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {products.map((product, index) => (
//               <div
//               key={product._id}
//               className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
//             // onClick={() => router.push(`/products/${product._id}`)}
//             >
//               <Link href={`/products/${product._id}`} className="absolute inset-0 z-10">
//                 <span className="sr-only">View details for {product.name}</span>
//               </Link>
//               <div className="relative">
//                 <div className="relative w-full h-48">
//                   {product.imageUrl && product.imageUrl[0] ? (
//                     <Image
//                       src={product.imageUrl[0]}
//                       alt={product.name}
//                       fill
//                       className="object-cover"
//                     // layout="fill"
//                     // objectFit="cover"
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
//                     className={`relative z-20 w-full py-2 px-4 rounded-full font-semibold text-center transition-all duration-300 ${loadingItemId === product._id
//                       ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                       : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
//                       }`}
//                   >
//                     {loadingItemId === product._id ? "Adding..." : "Add to Cart"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Packages Section */}
//       <section className="py-24 bg-white relative overflow-hidden">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-100/30 via-transparent to-transparent" />
//         <div className="max-w-7xl mx-auto px-4 relative">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4 text-gray-900">
//               Exclusive Packages
//             </h2>
//             <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//               Choose from our carefully curated tanning packages
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {packages.map((pkg, index) => (
//               <div
//               key={pkg._id}
//               className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
//             // onClick={() => router.push(`/packages/${pkg._id}`)} // Add redirection
//             >
//               <Link href={`/packages/${pkg._id}`} className="absolute inset-0 z-10">
//                 <span className="sr-only">View details for {pkg.name}</span>
//               </Link>
//               <div className="relative">
//                 <div className="relative w-full h-48">
//                   {pkg.imageUrl && pkg.imageUrl[0] ? (
//                     <Image
//                       src={pkg.imageUrl[0]}
//                       alt={pkg.name}
//                       className="object-cover"
//                       fill
//                     // layout="fill"
//                     // objectFit="cover"
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
//                   <p className="text-2xl font-bold mb-6 text-orange-500">
//                     £{pkg.price.toFixed(2)}
//                   </p>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent redirection
//                       addToCart(pkg._id);
//                     }}
//                     disabled={loadingItemId === pkg._id}
//                     className={`relative z-20 w-full py-2 px-4 rounded-full font-semibold text-center transition-all duration-300 ${loadingItemId === pkg._id
//                       ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                       : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
//                       }`}
//                   >
//                     {loadingItemId === pkg._id ? "Adding..." : "Add to Cart"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Locations Section */}
//       <section className="py-24 bg-neutral-50 relative">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-100/30 via-transparent to-transparent" />
//         <div className="max-w-7xl mx-auto px-4 relative">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4 text-gray-900">
//               Our Locations
//             </h2>
//             <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//               Find your nearest Bronze & Beauty salon
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {stores.map((store, index) => (
//               <Link key={store._id} href={`/locations/${store?._id}`}>
//               <div
//                 className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
//               >
//                 {store.imageUrl && (
//                   <Image
//                     src={store.imageUrl}
//                     alt={store.name}
//                     fill
//                     // objectFit="cover"
//                     className="w-full h-48 object-cover"
//                   />
//                 )}
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold mb-2 text-gray-800">
//                     {store.name}
//                   </h3>
//                   <p className="text-gray-600 mb-2">{store.address}</p>
//                   <p className="text-gray-600 mb-4">Phone: {store.phone}</p>

//                   {/* Google Map Embed Section */}
//                   {store.coordinates ? (
//                     <div className="mb-4">
//                       <h4 className="text-gray-700 text-sm font-semibold mb-2">
//                         Google Map
//                       </h4>
//                       {/* Generate iframe using the coordinates (Google Maps link) */}
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

//                   <button
//                     onClick={() => router.push(`/booking/${store._id}`)}
//                     className="block w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold text-center transition-all duration-300 hover:from-yellow-500 hover:to-orange-600"
//                   >
//                     Book Appointment
//                   </button>
//                 </div>
//               </div>
//             </Link>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }
