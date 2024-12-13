"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import  useStore  from "@/app/store/useStore"; // Assuming you have a store for the selectedMode

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Getting the selected mode from the store
  const { selectedMode } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Login failed. Please check your credentials.");
      } else {
        // Check if 2FA is enabled
        if(data?.is_twofa_redirect){
          router.push(`/2fa-setup?email=${username}&password=${password}`)
        } else {
          router.push('/'); // Redirect to homepage if 2FA is not enabled
          router.refresh();
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  // Define gradient classes based on selectedMode
  const gradientClass = selectedMode === 'dark' ? 'bg-gradient-to-r from-gray-800 to-black' : 'bg-gradient-to-r from-white to-gray-200';
  const textColor = selectedMode === 'dark' ? 'text-white' : 'text-black';
  const inputBg = selectedMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';
  const buttonBg = selectedMode === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-black hover:bg-gray-300';
  
  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-6 ${gradientClass}`}>
      <div className={`max-w-md w-full p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out ${selectedMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <h2 className="text-3xl font-semibold text-center mb-6 tracking-tight">Login to Your Account</h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 shadow-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username / Email Field */}
          <div>
            <label htmlFor="username" className={`block text-sm font-medium ${textColor}`}>Email</label>
            <input
              type="email"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your email"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${textColor}`}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className={`w-full py-3 px-4 font-semibold rounded-md focus:outline-none focus:ring-2 transition-all ease-in-out duration-300 ${buttonBg} text-white`}
            >
              Login
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className={`text-blue-500 hover:text-blue-700 font-semibold ${textColor}`}>
              Register here
            </Link>
          </p>
        </div>

        {/* Forgot Password Link (Optional) */}
        <div className="mt-2 text-center">
          <p className="text-sm">
            <Link href="/forgot-password" className={`text-blue-500 hover:text-blue-700 font-semibold ${textColor}`}>
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}



// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: username, password }),
//       });

//       const data = await res.json();
      

//       if (!data.success) {
//         setError(data.message || "Login failed. Please check your credentials.");
//       } else {
//         // Check if 2FA is enabled
//         if (data.data.twofa) {
//           router.push('/2fa-setup'); // Redirect to 2FA setup if enabled
//         } else {
//           router.push('/'); // Redirect to homepage if 2FA is not enabled
//           router.refresh()
//         }
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("An unexpected error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-6">
//       <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login to Your Account</h2>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Username / Email Field */}
//           <div>
//             <label htmlFor="username" className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               id="username"
//               name="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//               placeholder="Enter your email"
//               className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Password Field */}
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder="Enter your password"
//               className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Submit Button */}
//           <div className="mt-6">
//             <button
//               type="submit"
//               className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               Login
//             </button>
//           </div>
//         </form>

//         {/* Register Link */}
//         <div className="mt-4 text-center">
//           <p className="text-sm text-gray-600">
//             Don&apos;t have an account?{" "}
//             <Link href="/register" className="text-blue-500 hover:text-blue-700 font-semibold">
//               Register here
//             </Link>
//           </p>
//         </div>

//         {/* Forgot Password Link (Optional) */}
//         <div className="mt-2 text-center">
//           <p className="text-sm text-gray-600">
//             <Link href="/forgot-password" className="text-blue-500 hover:text-blue-700 font-semibold">
//               Forgot Password?
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
