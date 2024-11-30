"use client"; // Ensures that this component runs on the client-side

import { useState, useEffect } from "react";
import Image from "next/image"
import Link from "next/link";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import useStore from "@/app/store/useStore"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const {cartCount,setCartCount } = useStore();

  // Hero section image URLs array
  const heroImages = [
    "https://unsplash.com/blog/content/images/2024/02/us-header--1-.jpg",
    "https://unsplash.com/photos/swimming-pool-surrounded-by-trees--eLfQTmDfLk",
    "https://unsplash.com/photos/a-large-body-of-water-with-a-city-in-the-background-fhYSQyeFgU0",
    "https://unsplash.com/photos/an-aerial-view-of-a-beach-with-umbrellas-and-chairs-6fE0xjiZvrs",
  ];

  // State for hero image index and fetched data
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingItemId, setLoadingItemId] = useState(null); // Tracks loading state for buttons

  // console.log("stores", stores);
  // Fetch data for stores, products, packages, and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeRes = await fetch(`${baseUrl}/api/store`);
        const storeData = await storeRes.json();
        setStores(storeData?.data || []);

        const productRes = await fetch(`${baseUrl}/api/product`);
        const productData = await productRes.json();
        // console.log(productData);
        setProducts(productData?.data || []);

        const packageRes = await fetch(`${baseUrl}/api/package`);
        const packageData = await packageRes.json();
        // console.log(packageData);
        setPackages(packageData?.data || []);

        const categoryRes = await fetch(`${baseUrl}/api/category`);
        const categoryData = await categoryRes.json();
        setCategories(categoryData?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Hero image change interval
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [baseUrl]);

  const addToCart = async (itemId) => {
    if (!session) {
      router.push("/login")
      return
    }
    try {
      setLoadingItemId(itemId); // Set loading state for this button
      const response = await fetch(`${baseUrl}/api/addproductcart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });

      const result = await response.json();

      if (result.success) {
        setCartCount(cartCount+1)
        // alert(result.message || "Failed to add item to cart.");
      } else {
        // alert("Item added to cart successfully!");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      // alert("Error adding item to cart. Please try again.");
    } finally {
      setLoadingItemId(null); // Reset loading state
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[50vh] flex items-center justify-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url("${heroImages[currentImageIndex]}")`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Glow Up at{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              SunKissed
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10">
            Experience the best tanning services in the UK
          </p>
          <Link
            href="/booking"
            className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Book Your Session
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
            Explore Product Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/products/category/${category._id}`}
                className="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="w-16 h-16 mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  {/* You can add an icon here if available */}
                  <span className="text-2xl text-white">
                    {category.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-center text-gray-800 group-hover:text-orange-500 transition-colors duration-300">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Stores Locations Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
            Our Stores Locations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores.map((store) => (
              <Link key={store._id} href={`/locations/${store?._id}`}>
              <div
                className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                {store.imageUrl && (
                  <Image
                    src={store.imageUrl}
                    alt={store.name}
                    fill
                    objectFit="cover"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {store.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{store.address}</p>
                  <p className="text-gray-600 mb-4">Phone: {store.phone}</p>

                  {/* Google Map Embed Section */}
                  {store.coordinates ? (
                    <div className="mb-4">
                      <h4 className="text-gray-700 text-sm font-semibold mb-2">
                        Google Map
                      </h4>
                      {/* Generate iframe using the coordinates (Google Maps link) */}
                      <iframe
                        src={store.coordinates}
                        width="100%"
                        height="300"
                        frameBorder="0"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        aria-hidden="false"
                        tabIndex="0"
                      ></iframe>
                    </div>
                  ) : (
                    <div className="text-red-500 mb-4">
                      <p>Error: Google Map not available for this location.</p>
                    </div>
                  )}

                  <Link
                    href={`/locations/${store._id}`}
                    className="block w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold text-center transition-all duration-300 hover:from-yellow-500 hover:to-orange-600"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
            Our Tanning Products
          </h2>
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
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
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
                      £{product.price}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        addToCart(product._id)
                      }}
                      disabled={loadingItemId === product._id}
                      className={`relative z-20 block w-full py-2 px-4 rounded-full font-semibold text-center transition-all duration-300 ${
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
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
            Our Premium Packages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div key={pkg._id} className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
                <Link href={`/packages/${pkg._id}`} className="absolute inset-0 z-10">
                  <span className="sr-only">View details for {pkg.name}</span>
                </Link>
                <div className="relative">
                  <div className="relative w-full h-48">
                    {pkg.imageUrl && pkg.imageUrl[0] ? (
                      <Image
                        src={pkg.imageUrl[0]}
                        alt={pkg.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
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
                    <p className="text-2xl font-bold mb-4 text-orange-500">
                      £{pkg.price}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        addToCart(pkg._id)
                      }}
                      disabled={loadingItemId === pkg._id}
                      className={`relative z-20 block w-full py-2 px-4 rounded-full font-semibold text-center transition-all duration-300 ${
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
      </section>
    </div>
  );
}
