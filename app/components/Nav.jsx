"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useStore from "../store/useStore" // Import Zustand store
import { SunIcon, MoonIcon } from "lucide-react"; // Use Lucide-react for icons
import { useRouter } from "next/navigation";

export default function Nav({ server_session_data }) {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0); // State to store cart count
  const pathname = usePathname();
  const { selectedMode, setSelectedMode,cartCount,setCartCount } = useStore();

  // Fetch session data if provided by the server
  useEffect(() => {
    if (server_session_data) {
      update(server_session_data);
    }
  }, [server_session_data]);

  // Fetch mode from the API and update Zustand store
  useEffect(() => {
    const fetchMode = async () => {
      try {
        const response = await fetch("/api/getmode");
        const data = await response.json();

        if (data.success && data.data?.selectedMode) {
          setSelectedMode(data.data.selectedMode); // Update Zustand store
        } else {
          console.error("Failed to fetch mode:", data.message || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching mode:", error.message);
      }
    };

    fetchMode();
  }, [setSelectedMode]);

  // Fetch cart details
  useEffect(() => {
    const fetchCart = async () => {
      if (!session) return; // Skip if not logged in
      // console.log("session from nav",session)

      try {
        const response = await fetch("/api/getcart",);
        const data = await response.json();
        // console.log("data",data)

        if (data.success) {
          // console.log("data.data.items.length",data.data.items.length)
          setCartCount(data.data.items.length); // Update cart item count
        } else {
          console.log("Failed to fetch cart:", data.message || "Unknown error");
        }
      } catch (error) {
        console.log("Error fetching cart:", error.message);
      }
    };

    fetchCart();
  }, [session]);

  // Toggle between light and dark modes
  const toggleMode = async () => {
    const newMode = selectedMode === "light" ? "dark" : "light";
    if (!session) {
      setSelectedMode(newMode); // Update Zustand store
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
        setSelectedMode(newMode); // Update Zustand store
      } else {
        console.error("Failed to update mode:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error updating mode:", error.message);
    }
  };

  // Loader state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Toggle menu on mobile
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Handle SignOut
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Check if the current page is the login page using pathname
  const isLoginPage = pathname === "/login";

  return (
    <nav
      className={`p-4 shadow-md flex justify-between items-center ${
        selectedMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <Link href="/" className="text-xl font-bold hover:text-gray-400">
        MySite
      </Link>
      <button className="lg:hidden" onClick={toggleMenu}>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
      <div className="hidden lg:flex items-center space-x-6">
        {/* Navigation Links */}
        <Link href="/" className="hover:text-gray-400">
          Home
        </Link>
        <Link href="/products" className="hover:text-gray-400">
          Products
        </Link>
        <Link href="/packages" className="hover:text-gray-400">
          Packages
        </Link>
        <Link href="/locations" className="hover:text-gray-400">
          Locations
        </Link>
        <Link href="/about" className="hover:text-gray-400">
          About
        </Link>
        <Link href="/reviews" className="hover:text-gray-400">
          Customer Reviews
        </Link>
        {session && (
          <Link href="/cart" className="hover:text-gray-400 relative">
          Cart
          {cartCount > 0 && (
            <span
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {cartCount}
            </span>
          )}
        </Link>
        )}
        {session && session.user.role === "staff" && (
          <Link href={`/staff/${session.user.id}`} className="hover:text-gray-400">
            Staff Panel
          </Link>
        )}
        {session && session.user.role === "admin" && (
          <Link href="/admin" className="hover:text-gray-400">
            Admin Panel
          </Link>
        )}
        {!session && !isLoginPage && (
          <Link href="/login" className="hover:text-gray-400">
            Login
          </Link>
        )}
        {session && !isLoginPage && session.user.role !== "staff" && session.user.role !== "admin" && (
          <Link href="/profile" className="hover:text-gray-400">
            {session.user.name}
          </Link>
        )}
        {session && !isLoginPage && (
          <button onClick={handleLogout} className="hover:text-gray-400">
            Logout
          </button>
        )}

        {/* Light/Dark Mode Toggle */}
        <button
          onClick={toggleMode}
          className="p-2 rounded-full focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {selectedMode === "dark" ? (
            <MoonIcon className="w-6 h-6 text-yellow-500" />
          ) : (
            <SunIcon className="w-6 h-6 text-orange-500" />
          )}
        </button>
      </div>
    </nav>
  );
}
