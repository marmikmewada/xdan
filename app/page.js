"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useStore from "../app/store/useStore";
import PartnersCarousel from "./components/Partner";

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [cartCount, setCartCount] = useState(0);
  const { selectedMode } = useStore();
  const {setSelectedMode} =useStore();

  const lightModeHeroImages = [
    "https://ik.imagekit.io/syziko5ml/banners/photo_5985568644383491626_y.jpg?updatedAt=1734538542277",
    "https://ik.imagekit.io/syziko5ml/banners/photo_5985568644383491627_y.jpg?updatedAt=1734538539169",
    "https://ik.imagekit.io/syziko5ml/banners/photo_5985568644383491625_y.jpg?updatedAt=1734538539019",
    "https://ik.imagekit.io/syziko5ml/banners/944c4a7f-cc83-4687-a08e-b4374c585ea1.png?updatedAt=1735062490537",
    "https://ik.imagekit.io/syziko5ml/banners/photo_5987599773072474968_y.jpg?updatedAt=1735062760554",
  ];
  
  const darkModeHeroImages = [
    "https://ik.imagekit.io/syziko5ml/banners/photo_5985568644383491619_y.jpg?updatedAt=1734538542263",
    "https://ik.imagekit.io/syziko5ml/banners/photo_5985568644383491624_y.jpg?updatedAt=1734538539164",
    "https://ik.imagekit.io/syziko5ml/banners/photo_5985568644383491623_y.jpg?updatedAt=1734538538872",
    "https://ik.imagekit.io/syziko5ml/banners/c30667ff-1e81-4bb8-ae6d-0847c77d0c0d.png?updatedAt=1735062490530",
    "https://ik.imagekit.io/syziko5ml/banners/photo_5987599773072474969_y.jpg?updatedAt=1735062760643",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingItemId, setLoadingItemId] = useState(null);

  const categoriesRef = useRef(null);

  useEffect(() => {
    const fetchMode = async () => {
      try {
        const response = await fetch("/api/getmode");
        const data = await response.json();

        if (data.success && data.data?.selectedMode) {
          setSelectedMode(data.data.selectedMode);
        } else {
          console.error(
            "Failed to fetch mode:",
            data.message || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error fetching mode:", error.message);
      }
    };

    fetchMode();
  }, [setSelectedMode]);

  useEffect(() => {
    if (selectedMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [selectedMode]);

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
              {/* <div className="text-center">
                <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>{item.name}</h3>
                <p className={`${textColor}`}>{item.description}</p>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  const gradientClass = selectedMode === "dark"
    ? "bg-gradient-to-r from-gray-800 to-black"
    : "bg-gradient-to-r from-white to-gray-200";
  const inputBg = selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800";
  const buttonBg = selectedMode === "dark"
    ? "bg-gray-600 hover:bg-gray-700"
    : "bg-gray-200 hover:bg-gray-300";
  const iconColor = selectedMode === "dark" ? "text-white" : "text-gray-800";
  const hoverIconColor = selectedMode === "dark" ? "hover:text-blue-400" : "hover:text-blue-500";

  return (
    <main className={`min-h-screen ${bgColor} ${textColor}`}>
      {/* Hero Section */}
      <HeroSection
        title="Come & Glow At Bronze & Beauty Studio"
        description="Come And Experience The Best Tanning Studio In The Staffordshire Area, With State Of The Art Facilities & Exceptional Customer Service"
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
  description="Bronze & Beauty Studio is a professional tanning shop located in the heart of Hednesford High Street, Staffordshire. Our goal is to help customers achieve a healthy, responsible tan in our immaculate and friendly shop. Bronze & Beauty Studio promotes responsible tanning and are proud members of The Sunbed Association, our staff are trained to provide educated recommendations for the best tanning results. Our sun beds are maintained to the highest standards, checked and sanitised after every use. Each tanning room comes with a fresh towel, goggles for UV protection on the eyes, body wipes, and head bands. We pride ourselves on customer satisfaction and customer service."
  image={selectedMode === 'dark' ? 'https://ik.imagekit.io/syziko5ml/banners/6.png?updatedAt=1734539275694' : 'https://ik.imagekit.io/syziko5ml/banners/5.png?updatedAt=1734539275697'} 
  className={`p-8 shadow-lg ${selectedMode === "dark" ? "bg-gradient-to-b from-gray-800 to-black" : "bg-gradient-to-b from-white to-gray-100"}`} 
/>


<PartnersCarousel/>
{/* UV Equipment Section */}
{/* <EquipmentSection
  title="Our Partners"
  items={[
    {
      // name: "High-Pressure Tanning Bed",
      // description: "Experience fast, deep tanning with our high-pressure beds, perfect for those seeking quick results.",
      image: selectedMode === 'dark' ? 'https://images.unsplash.com/photo-1470259078422-826894b933aa?auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80'
    },
    {
      name: "Low-Pressure Tanning Bed",
      description: "Ideal for building a base tan or maintaining your glow, our low-pressure beds offer a gentle tanning experience.",
      image: selectedMode === 'dark' ? 'https://images.unsplash.com/photo-1470259078422-826894b933aa?auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80'
    },
    {
      name: "Stand-Up Tanning Booth",
      description: "For those who prefer not to lie down, our stand-up booths provide a quick and effective tanning session.",
      image: selectedMode === 'dark' ? 'https://images.unsplash.com/photo-1470259078422-826894b933aa?auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80'
    }
  ]}
  className={`p-8 shadow-lg ${selectedMode === "dark" ? "bg-gradient-to-b from-gray-800 to-black" : "bg-gradient-to-b from-white to-gray-100"}`} 
/> */}


<InfoSection
  title="Our Sun Beds"
  description="At Bronze & Beauty, we offer a variety of sun beds to suit your tanning needs. From gentle low-pressure beds for beginners to high-intensity beds for experienced tanners, we have the perfect option for everyone. Our beds are regularly maintained and sanitized to ensure your safety and comfort."
  image={selectedMode === 'dark' ? 'https://ik.imagekit.io/syziko5ml/banners/18.png?updatedAt=1734543345312' : 'https://ik.imagekit.io/syziko5ml/banners/17.png?updatedAt=1734543345580'} 
  reverse={true}
  className={`p-8 shadow-lg ${selectedMode === "dark" ? "bg-gradient-to-b from-gray-800 to-black" : "bg-gradient-to-b from-white to-gray-100"}`} 
/>


      {/* Locations Section */}
      {/* {stores.map((store, index) => (
        <div key={store._id} className="w-full">
          <section className="relative pb-16 sm:pb-24">
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
      ))} */}
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

      <BannerSection
        // title="Limited Time Offer!"
        // description="Get 20% off on all tanning products when you book a session today."
        image={
          selectedMode === "dark"
            ? `https://ik.imagekit.io/2o9y0v10p/dan-studio/banners/Heading-black-white.png?updatedAt=1733332141665`
            : "https://ik.imagekit.io/2o9y0v10p/dan-studio/banners/Heading-colored.jpg?updatedAt=1733332160124"
        }
      />
    </main>
  );
}

