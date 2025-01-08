"use client";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useStore from "../store/useStore";
import { SunIcon, MoonIcon, MenuIcon, XIcon } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Glitter from "@/app/components/Glitter";
export default function Nav({ server_session_data }) {
  const router = useRouter();
  const [showGlitter, setShowGlitter] = useState(true);
  const { data: session, status, update } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const pathname = usePathname();
  const { selectedMode, setSelectedMode, cartCount, setCartCount } = useStore();


  useEffect(() => {
    if (server_session_data) {
      update(server_session_data);
    }
  }, [server_session_data]);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowGlitter(scrollPosition === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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
    const fetchCart = async () => {
      if (!session) return;

      try {
        const response = await fetch("/api/getcart");
        // const mode = await fetch("/api/getmode");

        const data = await response.json();

        if (data.success) {
          const totalQuantity = data.data.items.reduce(
            (total, item) => total + item.quantity,
            0
          );
          setCartCount(totalQuantity);
          // setSelectedMode(mode);
        } else {
          console.log("Failed to fetch cart:", data.message || "Unknown error");
        }
      } catch (error) {
        console.log("Error fetching cart:", error.message);
      }
    };

    fetchCart();
  }, [session]);

  const toggleMode = async () => {
    const newMode = selectedMode === "light" ? "dark" : "light";
    if (!session) {
      setSelectedMode(newMode);
      router.push("/login");
      return;
    }
    try {
      const response = await fetch("/api/setmode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedMode: newMode }),
      });
      const data = await response.json();

      if (data.success) {
        setSelectedMode(newMode);
      } else {
        console.error(
          "Failed to update mode:",
          data.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error updating mode:", error.message);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const isLoginPage = pathname === "/login";

  const navLinkClass = `text-sm font-semibold transition-colors duration-300 ease-in-out transform ${
    selectedMode === "dark"
      ? "text-white hover:text-gray-300 hover:underline"
      : "text-black hover:text-gray-700 hover:underline"
  }`;

  const closeMenu = () => setIsMenuOpen(false); // New function to close menu on link click

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        selectedMode === "dark"
          ? "bg-gradient-to-b from-gray-800 to-black"
          : "bg-gradient-to-b from-white to-gray-200"
      } text-white shadow-lg transition-colors duration-300 ease-in-out`}
    >
      {showGlitter && <Glitter />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="md:pt-4 flex items-center xs:h-14 xs:pt-2 xs:pb-2 xs:w-32 sm:h-4 md:h-10 lg:w-64 lg:h-10 xl:w-72 xl:h-12">
            <Link href="/" className="flex-shrink-0 flex items-center">
            <Image alt="logo" src={"https://ik.imagekit.io/syziko5ml/banners/37b1259e-701e-4a20-9220-63948c0cd75b.png?updatedAt=1735747408340"} width={250} height={250} className=""/>
              {/* <span
                className={`text-3xl font-extrabold ${
                  selectedMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                MySite
              </span> */}
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link href="/" className={navLinkClass}>
              Home
            </Link>
            <Link href="/about" className={navLinkClass}>
              About Us
            </Link>
            <Link href="/products" className={navLinkClass}>
              Shop Lotions
            </Link>
            <Link href="/packages" className={navLinkClass}>
              Shop Packages
            </Link>
            <Link href="/locations" className={navLinkClass}>
              Locations
            </Link>
            
            <Link href="/sunbeds" className={navLinkClass}>
              Sun Beds
            </Link>

            {session && (
              <Link href="/cart" className={`${navLinkClass} relative`}>
                <FaShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            {session && session.user.role === "staff" && (
              <Link href={`/staff/${session.user.id}`} className={navLinkClass}>
                Staff Panel
              </Link>
            )}
            {session && session.user.role === "admin" && (
              <Link href="/admin" className={navLinkClass}>
                Admin Panel
              </Link>
            )}
            {!session && !isLoginPage && (
              <Link href="/login" className={navLinkClass}>
                Login/Register
              </Link>
            )}
            {session &&
              !isLoginPage &&
              session.user.role !== "staff" &&
              session.user.role !== "admin" && (
                <Link href="/profile" className={navLinkClass}>
                  {session.user.name}
                </Link>
              )}
            {session && !isLoginPage && (
              <button onClick={handleLogout} className={navLinkClass}>
                Logout
              </button>
            )}
            <button
              onClick={toggleMode}
              className={`p-2 rounded-full focus:outline-none transition-colors duration-300 ease-in-out ${
                selectedMode === "dark"
                  ? "hover:bg-gray-800"
                  : "hover:bg-gray-200"
              }`}
            >
              {selectedMode === "dark" ? (
                <MoonIcon className="w-6 h-6 text-white" />
              ) : (
                <SunIcon className="w-6 h-6 text-black" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMode}
              className={`p-2 rounded-full focus:outline-none transition-colors duration-300 ease-in-out mr-2 ${
                selectedMode === "dark"
                  ? "hover:bg-gray-800"
                  : "hover:bg-gray-200"
              }`}
            >
              {selectedMode === "dark" ? (
                <MoonIcon className="w-6 h-6 text-white" />
              ) : (
                <SunIcon className="w-6 h-6 text-black" />
              )}
            </button>

            <Link
              href="/cart"
              className="relative text-gray-800 dark:text-white"
            >
              <FaShoppingCart className="w-6 h-6" color={selectedMode === "dark"?"white":"#32325d"} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-all duration-300 ${
                selectedMode === "dark"
                  ? "text-white hover:bg-gray-800"
                  : "text-black hover:bg-gray-200"
              } focus:outline-none  focus:ring-inset focus:ring-white`}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XIcon className="block h-8 w-8" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-8 w-8" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
        {/* Mobile Menu */}
{isMenuOpen && (
  <div className="sm:hidden">
    <div
      className={`px-2 pt-2 pb-3 space-y-1 ${
        selectedMode === "dark"
          ? "bg-gradient-to-b from-gray-800 to-black" // Gradient for dark mode
          : "bg-gradient-to-b from-white to-gray-200" // Gradient for light mode
      }`}
    >
      <Link
        href="/"
        onClick={closeMenu}
        className={`${navLinkClass} block px-3 py-2 rounded-md text-base font-medium`}
      >
        Home
      </Link>
      <Link
        href="/about"
        onClick={closeMenu}
        className={`${navLinkClass} block px-3 py-2 rounded-md text-base font-medium`}
      >
        About Us
      </Link>
      <Link
        href="/products"
        onClick={closeMenu}
        className={`${navLinkClass} block px-3 py-2 rounded-md text-base font-medium`}
      >
        Shop Lotions
      </Link>
      <Link
        href="/packages"
        onClick={closeMenu}
        className={`${navLinkClass} block px-3 py-2 rounded-md text-base font-medium`}
      >
        Shop Packages
      </Link>
      
      <Link
        href="/locations"
        onClick={closeMenu}
        className={`${navLinkClass} block px-3 py-2 rounded-md text-base font-medium`}
      >
        Locations
      </Link>
      
      <Link
        href="/sunbeds"
        onClick={closeMenu}
        className={`${navLinkClass} block px-3 py-2 rounded-md text-base font-medium`}
      >
        Sun Beds
      </Link>


      {session && session.user.role === "staff" && (
        <Link
          href={`/staff/${session.user.id}`}
          onClick={closeMenu}
          className={`${navLinkClass} block px-3 py-2 rounded-md text-base font-medium`}
        >
          Staff Panel
        </Link>
      )}
      {session && session.user.role === "admin" && (
        <Link
          href="/admin"
          onClick={closeMenu}
          className={`${navLinkClass} block px-3 py-2 rounded-md text-base font-medium`}
        >
          Admin Panel
        </Link>
      )}
      {!session && !isLoginPage && (
        <Link
          href="/login"
          onClick={closeMenu}
          className={`${navLinkClass} block px-3 py-2 rounded-md text-base font-medium`}
        >
          Login/Register
        </Link>
      )}
      {session &&
        !isLoginPage &&
        session.user.role !== "staff" &&
        session.user.role !== "admin" && (
          <Link
            href="/profile"
            onClick={closeMenu}
            className={`${navLinkClass} block px-3 py-2 rounded-md text-base font-medium`}
          >
            {session.user.name}
          </Link>
        )}
      {session && !isLoginPage && (
        <button
          onClick={() => {
            handleLogout();
            closeMenu(); // Close the menu after logging out
          }}
          className={`${navLinkClass} block px-3 py-2 rounded-md text-base font-medium w-full text-left`}
        >
          Logout
        </button>
      )}
    </div>
  </div>
)}

    </nav>
  );
}

// "use client";

// import { useSession, signOut } from "next-auth/react";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import useStore from "../store/useStore" // Import Zustand store
// import { SunIcon, MoonIcon } from "lucide-react"; // Use Lucide-react for icons
// import { useRouter } from "next/navigation";

// export default function Nav({ server_session_data }) {
//   const router = useRouter();
//   const { data: session, status, update } = useSession();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [cartItemCount, setCartItemCount] = useState(0); // State to store cart count
//   const pathname = usePathname();
//   const { selectedMode, setSelectedMode,cartCount,setCartCount } = useStore();

//   // Fetch session data if provided by the server
//   useEffect(() => {
//     if (server_session_data) {
//       update(server_session_data);
//     }
//   }, [server_session_data]);

//   // Fetch mode from the API and update Zustand store
//   useEffect(() => {
//     const fetchMode = async () => {
//       try {
//         const response = await fetch("/api/getmode");
//         const data = await response.json();

//         if (data.success && data.data?.selectedMode) {
//           setSelectedMode(data.data.selectedMode); // Update Zustand store
//         } else {
//           console.error("Failed to fetch mode:", data.message || "Unknown error");
//         }
//       } catch (error) {
//         console.error("Error fetching mode:", error.message);
//       }
//     };

//     fetchMode();
//   }, [setSelectedMode]);

//   // Fetch cart details
//   useEffect(() => {
//     const fetchCart = async () => {
//       if (!session) return; // Skip if not logged in
//       // console.log("session from nav",session)

//       try {
//         const response = await fetch("/api/getcart",);
//         const data = await response.json();

//         if (data.success) {
//           const totalQuantity = data.data.items.reduce((total, item) => total + item.quantity, 0);
//           // console.log("data.data.items.length",data.data.items.length)
//           setCartCount(totalQuantity); // Update cart item count
//         } else {
//           console.log("Failed to fetch cart:", data.message || "Unknown error");
//         }
//       } catch (error) {
//         console.log("Error fetching cart:", error.message);
//       }
//     };

//     fetchCart();
//   }, [session]);

//   // Toggle between light and dark modes
//   const toggleMode = async () => {
//     const newMode = selectedMode === "light" ? "dark" : "light";
//     if (!session) {
//       setSelectedMode(newMode); // Update Zustand store
//       router.push("/login");
//       return;
//     }
//     try {
//       const response = await fetch("/api/setmode", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ selectedMode: newMode }),
//       });
//       const data = await response.json();

//       if (data.success) {
//         setSelectedMode(newMode); // Update Zustand store
//       } else {
//         console.error("Failed to update mode:", data.message || "Unknown error");
//       }
//     } catch (error) {
//       console.error("Error updating mode:", error.message);
//     }
//   };

//   // Loader state
//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   // Toggle menu on mobile
//   const toggleMenu = () => setIsMenuOpen((prev) => !prev);

//   // Handle SignOut
//   const handleLogout = async () => {
//     await signOut({ callbackUrl: "/" });
//   };

//   // Check if the current page is the login page using pathname
//   const isLoginPage = pathname === "/login";

//   return (
//     <nav
//       className={`p-4 shadow-md flex justify-between items-center ${
//         selectedMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
//       }`}
//     >
//       <Link href="/" className="text-xl font-bold hover:text-gray-400">
//         MySite
//       </Link>
//       <button className="lg:hidden" onClick={toggleMenu}>
//         <svg
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M4 6h16M4 12h16M4 18h16"
//           ></path>
//         </svg>
//       </button>
//       <div className="hidden lg:flex items-center space-x-6">
//         {/* Navigation Links */}
//         <Link href="/" className="hover:text-gray-400">
//           Home
//         </Link>
//         <Link href="/products" className="hover:text-gray-400">
//           Products
//         </Link>
//         <Link href="/packages" className="hover:text-gray-400">
//           Packages
//         </Link>
//         <Link href="/locations" className="hover:text-gray-400">
//           Locations
//         </Link>
//         <Link href="/about" className="hover:text-gray-400">
//           About
//         </Link>
//         <Link href="/reviews" className="hover:text-gray-400">
//           Customer Reviews
//         </Link>
//         {session && (
//           <Link href="/cart" className="hover:text-gray-400 relative">
//           Cart
//           {cartCount > 0 && (
//             <span
//               className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
//             >
//               {cartCount}
//             </span>
//           )}
//         </Link>
//         )}
//         {session && session.user.role === "staff" && (
//           <Link href={`/staff/${session.user.id}`} className="hover:text-gray-400">
//             Staff Panel
//           </Link>
//         )}
//         {session && session.user.role === "admin" && (
//           <Link href="/admin" className="hover:text-gray-400">
//             Admin Panel
//           </Link>
//         )}
//         {!session && !isLoginPage && (
//           <Link href="/login" className="hover:text-gray-400">
//             Login
//           </Link>
//         )}
//         {session && !isLoginPage && session.user.role !== "staff" && session.user.role !== "admin" && (
//           <Link href="/profile" className="hover:text-gray-400">
//             {session.user.name}
//           </Link>
//         )}
//         {session && !isLoginPage && (
//           <button onClick={handleLogout} className="hover:text-gray-400">
//             Logout
//           </button>
//         )}

//         {/* Light/Dark Mode Toggle */}
//         <button
//           onClick={toggleMode}
//           className="p-2 rounded-full focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700"
//         >
//           {selectedMode === "dark" ? (
//             <MoonIcon className="w-6 h-6 text-yellow-500" />
//           ) : (
//             <SunIcon className="w-6 h-6 text-orange-500" />
//           )}
//         </button>
//       </div>
//     </nav>
//   );
// }
