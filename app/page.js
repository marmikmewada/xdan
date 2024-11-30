"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link"

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [cartCount, setCartCount] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607008829749-c0f284074b61?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingItemId, setLoadingItemId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeData, productData, packageData, categoryData] = await Promise.all([
          fetch(`${baseUrl}/api/store`).then(res => res.json()),
          fetch(`${baseUrl}/api/product`).then(res => res.json()),
          fetch(`${baseUrl}/api/package`).then(res => res.json()),
          fetch(`${baseUrl}/api/category`).then(res => res.json())
        ]);

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
      setCurrentImageIndex(prev => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [baseUrl]);

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
        body: JSON.stringify({ itemId })
      });

      const result = await response.json();
      if (result.success) {
        setCartCount(prev => prev + 1);
        router.refresh()
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-1000 ease-out transform scale-105"
          style={{
            backgroundImage: `url(${heroImages[currentImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-7xl font-black mb-6 text-white leading-tight">
              Glow Up at{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Bronze & Beauty
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed">
              Experience the best tanning services in the UK with our state-of-the-art facilities
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push('/locations')}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-orange-500/20 hover:scale-105"
              >
                Book Your Session
              </button>
              <button
                onClick={() => router.push('/services')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg shadow-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
              >
                View Services
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-50 to-transparent" />
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-100/40 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Explore Our Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our range of professional tanning and beauty services
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <div
                key={category._id}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-50 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl text-white font-bold">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <button
                    onClick={() => router.push(`/categories/${category._id}`)}
                    className="mt-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-900 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                  >
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 bg-neutral-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-100/30 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Premium Tanning Products
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Professional-grade products for the perfect tan
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
              key={product._id}
              className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
            // onClick={() => router.push(`/products/${product._id}`)}
            >
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
                      className="object-cover"
                    // layout="fill"
                    // objectFit="cover"
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
                    className={`relative z-20 w-full py-2 px-4 rounded-full font-semibold text-center transition-all duration-300 ${loadingItemId === product._id
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
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-100/30 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Exclusive Packages
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose from our carefully curated tanning packages
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
              key={pkg._id}
              className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
            // onClick={() => router.push(`/packages/${pkg._id}`)} // Add redirection
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
                      className="object-cover"
                      fill
                    // layout="fill"
                    // objectFit="cover"
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
                    className={`relative z-20 w-full py-2 px-4 rounded-full font-semibold text-center transition-all duration-300 ${loadingItemId === pkg._id
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

      {/* Locations Section */}
      <section className="py-24 bg-neutral-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-100/30 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Our Locations
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find your nearest Bronze & Beauty salon
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores.map((store, index) => (
              <Link key={store._id} href={`/locations/${store?._id}`}>
              <div
                className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                {store.imageUrl && (
                  <Image
                    src={store.imageUrl}
                    alt={store.name}
                    fill
                    // objectFit="cover"
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

                  <button
                    onClick={() => router.push(`/booking/${store._id}`)}
                    className="block w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold text-center transition-all duration-300 hover:from-yellow-500 hover:to-orange-600"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}