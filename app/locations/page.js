"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useStore from "@/app/store/useStore";
import { Search, ShoppingCart } from 'lucide-react';
import { motion } from "framer-motion";

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

  const bgColor = selectedMode === "dark" ? "bg-gradient-to-r from-gray-800 to-black" : "bg-white";
  const textColor = selectedMode === "dark" ? "text-white" : "text-black";
  const cardBg = selectedMode === "dark" ? "bg-gradient-to-r from-gray-800 to-black" : "bg-white";
  const inputBg = selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800";
  const iconColor = selectedMode === "dark" ? "text-white" : "text-gray-800";
  const buttonBg = selectedMode === "dark"
    ? "bg-gray-600 hover:bg-gray-700"
    : "bg-gray-200 hover:bg-gray-300";
  const gradientClass = selectedMode === "dark" ? "from-gray-900 to-black" : "from-white to-gray-200";
  const hoverIconColor = selectedMode === "dark" ? "hover:text-blue-400" : "hover:text-blue-500";

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
    <main className={`min-h-screen ${bgColor} ${textColor}`}>
      <BannerSection
        // title="Limited Time Offer!"
        // description="Get 20% off on all tanning products when you book a session today."
        image="https://ik.imagekit.io/syziko5ml/banners/b7cddd56-a0dd-48ea-accf-f522ca1b4716.png?updatedAt=1735130396598"
        darkModeImage="https://ik.imagekit.io/syziko5ml/banners/313655a7-619e-45cc-bbc1-1949177e0b0a.png?updatedAt=1735130396543"
      />
      {/* <header className={`${bgColor} shadow`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center">Our Locations</h1>
        </div>
      </header> */}

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        {/* <div className="mb-8 relative">
          <input
            type="text"
            placeholder="Search products..."
            className={`w-full p-3 pl-10 ${inputBg} border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className={`absolute left-3 top-3 ${iconColor}`} size={20} />
        </div> */}

        {/* Locations Section */}
        {/* Stores Section */}
             {/* Locations Section */}
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

        {/* Products Section */}
        <section className={`py-12 ${bgColor} ${gradientClass}`}>
          <h2 className="text-3xl font-bold mb-6 text-center">Our Tanning Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
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

        {/* Packages Section */}
        <section className={`py-12 ${bgColor} ${gradientClass}`}>
          <h2 className="text-3xl font-bold mb-6 text-center">Our Premium Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
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
      </div>
    </main>
  );
}

