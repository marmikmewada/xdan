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

  const lightModeHeroImages = [
    "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607008829749-c0f284074b61?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&q=80",
  ];

  const darkModeHeroImages = [
    "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1470259078422-826894b933aa?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&q=80",
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
      setCurrentImageIndex((prev) => (prev + 1) % 5);
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

  const bgColor =
    selectedMode === "dark"
      ? "bg-gradient-to-b from-black to-gray-900"
      : "bg-gradient-to-b from-white to-gray-100";

  const textColor = selectedMode === "dark" ? "text-white" : "text-black";
  const buttonBgColor = selectedMode === "dark" ? "bg-gradient-to-b from-black to-gray-900" : "bg-black";
  const buttonTextColor = selectedMode === "dark" ? "text-white" : "text-white";
  const buttonHoverBgColor =
    selectedMode === "dark" ? "hover:bg-gray-200" : "hover:bg-gray-800";

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
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight tracking-tight">
            {title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap gap-6">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`px-8 py-4 ${
                  button.primary
                    ? `${buttonBgColor} ${buttonTextColor}`
                    : "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black"
                } font-semibold text-base sm:text-lg transition-all duration-300 ${buttonHoverBgColor} rounded-none shadow-md`}
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
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center text-center">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white leading-tight tracking-tight">
            {title}
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </section>
  );

  const InfoSection = ({ title, description, image, reverse = false }) => (
    <section className={`py-16 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8`}>
          <div className="md:w-1/2">
            <Image
              src={image}
              alt={title}
              width={600}
              height={400}
              className=" shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className={`text-3xl font-bold mb-4 ${textColor}`}>{title}</h2>
            <p className={`${textColor} text-lg`}>{description}</p>
          </div>
        </div>
      </div>
    </section>
  );

  const EquipmentSection = ({ title, items }) => (
    <section className={`py-16 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={`text-3xl font-bold mb-8 text-center ${textColor}`}>{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={index} className={`p-6 shadow-lg ${selectedMode === 'dark' ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-white'}`}>
              {/* Image */}
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  layout="fill" // This helps maintain responsive image sizing
                  objectFit="cover" // Ensures the image covers the container without stretching
                />
              </div>
  
              {/* Content */}
              <div className="text-center">
                <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>{item.name}</h3>
                <p className={`${textColor}`}>{item.description}</p>
              </div>
            </div>
          ))}
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
        image={selectedMode === "dark" ? darkModeHeroImages[currentImageIndex] : lightModeHeroImages[currentImageIndex]}
        buttons={[
          {
            text: "Book Your Session",
            onClick: () => router.push("/locations"),
            primary: true,
          },
          {
            text: "View Products",
            onClick: () => router.push("/products"),
            primary: false,
          },
        ]}
      />

      {/* About Bronze & Beauty Section */}
      
        {/* About Bronze & Beauty Section */}
<InfoSection
  title="About Bronze & Beauty"
  description="Bronze & Beauty is the UK's premier tanning salon, offering a luxurious and safe tanning experience. Our state-of-the-art facilities and expert staff ensure you achieve the perfect glow every time. With multiple locations across the country, we're committed to helping you look and feel your best."
  image={selectedMode === 'dark' ? 'https://images.unsplash.com/photo-1470259078422-826894b933aa?auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80'}  // Conditional image path
  className={`p-8  shadow-lg ${selectedMode === "dark" ? "bg-gradient-to-b from-gray-800 to-black" : "bg-gradient-to-b from-white to-gray-100"}`} // Apply gradient background to card
/>

{/* UV Equipment Section */}
<EquipmentSection
  title="Our UV Equipment"
  items={[
    {
      name: "High-Pressure Tanning Bed",
      description: "Experience fast, deep tanning with our high-pressure beds, perfect for those seeking quick results.",
      image: selectedMode === 'dark' ? 'https://images.unsplash.com/photo-1470259078422-826894b933aa?auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80'  // Conditional image path
      // Apply gradient background to individual card as well
    },
    {
      name: "Low-Pressure Tanning Bed",
      description: "Ideal for building a base tan or maintaining your glow, our low-pressure beds offer a gentle tanning experience.",
      image: selectedMode === 'dark' ? 'https://images.unsplash.com/photo-1470259078422-826894b933aa?auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80'  // Conditional image path
    },
    {
      name: "Stand-Up Tanning Booth",
      description: "For those who prefer not to lie down, our stand-up booths provide a quick and effective tanning session.",
      image: selectedMode === 'dark' ? 'https://images.unsplash.com/photo-1470259078422-826894b933aa?auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80'  // Conditional image path
    }
  ]}
  className={`p-8  shadow-lg ${selectedMode === "dark" ? "bg-gradient-to-b from-gray-800 to-black" : "bg-gradient-to-b from-white to-gray-100"}`} // Apply gradient background to card
/>

{/* Sun Beds Section */}
<InfoSection
  title="Our Sun Beds"
  description="At Bronze & Beauty, we offer a variety of sun beds to suit your tanning needs. From gentle low-pressure beds for beginners to high-intensity beds for experienced tanners, we have the perfect option for everyone. Our beds are regularly maintained and sanitized to ensure your safety and comfort."
  image={selectedMode === 'dark' ? 'https://images.unsplash.com/photo-1470259078422-826894b933aa?auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80'}  // Conditional image path
  reverse={true}
  className={`p-8  shadow-lg ${selectedMode === "dark" ? "bg-gradient-to-b from-gray-800 to-black" : "bg-gradient-to-b from-white to-gray-100"}`} // Apply gradient background to card
/>

      {/* Locations Section */}
      {stores.map((store, index) => (
        <div key={store._id} className="w-full">
          <section className="relative pb-16 sm:pb-24">
            {/* Map Section */}
            <div className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] shadow-2xl overflow-hidden">
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
                  tabIndex={0}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                  No map available
                </div>
              )}
            </div>

            {/* Store Details Section */}
            <div
              className={`absolute bottom-0 left-0 right-0 p-8 sm:p-10 flex flex-col items-center justify-center ${
                selectedMode === "dark"
                  ? "bg-gradient-to-b from-gray-800 to-black text-white"
                  : "bg-gradient-to-b from-white to-gray-200 text-black"
              }`}
              style={{
                boxShadow: "0px -4px 30px rgba(0, 0, 0, 0.1)",
                borderRadius: "30px 30px 0 0",
              }}
            >
              <div className="text-center space-y-4 sm:space-y-5">
                <h1 className="text-2xl sm:text-3xl font-semibold">
                  {store.name}
                </h1>
                <p
                  className={`text-sm sm:text-base ${
                    selectedMode === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {store.address}
                </p>
                <p
                  className={`text-sm sm:text-base ${
                    selectedMode === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {store.phone}
                </p>
                <button
                  onClick={() => router.push(`/locations/${store._id}`)}
                  className={`px-8 py-3 font-medium text-base sm:text-lg transition-all duration-300 ${
                    selectedMode === "dark"
                      ? "bg-gradient-to-b from-black to-gray-900 text-white border-2 border-white hover:bg-gray-100 hover:text-gray-300"
                      : "bg-transparent text-black border-2 border-black hover:bg-black hover:text-white"
                  }`}
                  style={{
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                    borderRadius: "0",
                  }}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </section>
        </div>
      ))}

      <BannerSection
        title="Limited Time Offer!"
        description="Get 20% off on all tanning products when you book a session today."
        image={
          selectedMode === "dark"
            ? `https://ik.imagekit.io/2o9y0v10p/dan-studio/banners/Heading-black-white.png?updatedAt=1733332141665`
            : "https://ik.imagekit.io/2o9y0v10p/dan-studio/banners/Heading-colored.jpg?updatedAt=1733332160124"
        }
      />
    </main>
  );
}

