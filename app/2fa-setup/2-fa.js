"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import useStore from "@/app/store/useStore"; // Assuming you have a store for the selectedMode

export default function TwoFAStep({ server_session_data }) {
  const { data: session, update } = useSession(); // Get the session
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Getting the selected mode from the store
  const { selectedMode } = useStore();

  useEffect(() => {
    if (server_session_data) {
      update(server_session_data);
    }
  }, [server_session_data]);

  useEffect(() => {
    async function fetchQRCode() {
      try {
        const res = await fetch("/api/auth/generate-totp", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch QR code");
        const data = await res.json();
        if (data.qrCodeUrl) {
          setQrCodeUrl(data.qrCodeUrl);
        }
      } catch (error) {
        console.error("Error fetching QR code:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchQRCode();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpCode) {
      alert("Please enter the OTP.");
      return;
    }

    const response = await fetch("/api/auth/verify-totp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp: otpCode }), // Send only the OTP
    });

    const data = await response.json();

    if (data.success) {
      console.log("session by kira", session);
      router.push("/"); // Redirect on success
    } else {
      alert(data.message || "An unknown error occurred.");
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
        <h2 className="text-3xl font-semibold text-center mb-6 tracking-tight">2FA Setup</h2>

        {/* Loading or QR Code */}
        <div className="flex justify-center mb-6">
          {loading ? (
            <p className="text-gray-600">Loading QR Code...</p>
          ) : qrCodeUrl ? (
            <Image
              src={qrCodeUrl}
              alt="QR Code for 2FA"
              width={300}
              height={300}
              className="border border-gray-300 rounded-md"
            />
          ) : (
            <p className="text-red-500">Failed to load QR Code</p>
          )}
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <label htmlFor="otp" className={`block text-sm font-medium ${textColor} mb-2`}>Enter the OTP from your app</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            placeholder="Enter OTP"
            maxLength={6}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${buttonBg}`}
          >
            Verify OTP
          </button>
        </div>

        {/* Optional Resend OTP Link */}
        <div className="mt-4 text-center">
          <Link
            href="#"
            className={`text-sm text-blue-500 hover:text-blue-700 font-semibold ${textColor}`}
            onClick={() => alert("Resend OTP functionality not implemented")}
          >
            Resend OTP
          </Link>
        </div>
      </div>
    </div>
  );
}




// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import { useSession } from "next-auth/react";

// export default function TwoFAStep({ server_session_data }) {
//   const { data: session, update } = useSession(); // Get the session
//   const [qrCodeUrl, setQrCodeUrl] = useState("");
//   const [otpCode, setOtpCode] = useState("");
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // Log the session for debugging
//   useEffect(() => {
//     console.log("Session:", session);
//   }, [session]);

//   useEffect(() => {
//     if (server_session_data) {
//       update(server_session_data);
//     }
//   }, [server_session_data]);

//   useEffect(() => {
//     async function fetchQRCode() {
//       try {
//         const res = await fetch("/api/auth/generate-totp", {
//           method: "GET",
//           credentials: "include",
//         });

//         if (!res.ok) throw new Error("Failed to fetch QR code");
//         const data = await res.json();
//         if (data.qrCodeUrl) {
//           setQrCodeUrl(data.qrCodeUrl);
//         }
//       } catch (error) {
//         console.error("Error fetching QR code:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchQRCode();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!otpCode) {
//       alert("Please enter the OTP.");
//       return;
//     }

//     // Send only the OTP to the verify-totp API
//     const response = await fetch("/api/auth/verify-totp", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ otp: otpCode }), // Send only the OTP
//     });

//     const data = await response.json();

//     if (data.success) {
//       console.log("session by kira", session);
//       router.push("/"); // Redirect on success
//     } else {
//       alert(data.message || "An unknown error occurred.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-6">
//       <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">2FA Setup</h2>

//         {/* Loading or QR Code */}
//         <div className="flex justify-center mb-6">
//           {loading ? (
//             <p className="text-gray-600">Loading QR Code...</p>
//           ) : qrCodeUrl ? (
//             <Image
//               src={qrCodeUrl}
//               alt="QR Code for 2FA"
//               width={300}
//               height={300}
//               className="border border-gray-300 rounded-md"
//             />
//           ) : (
//             <p className="text-red-500">Failed to load QR Code</p>
//           )}
//         </div>

//         {/* OTP Input */}
//         <div className="mb-6">
//           <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
//             Enter the OTP from your app
//           </label>
//           <input
//             type="text"
//             id="otp"
//             name="otp"
//             value={otpCode}
//             onChange={(e) => setOtpCode(e.target.value)}
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter OTP"
//             maxLength={6}
//           />
//         </div>

//         {/* Submit Button */}
//         <div className="mt-6">
//           <button
//             onClick={handleSubmit}
//             className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Verify OTP
//           </button>
//         </div>

//         {/* Optional Resend OTP Link */}
//         <div className="mt-4 text-center">
//           <Link
//             href="#"
//             className="text-sm text-blue-500 hover:text-blue-700 font-semibold"
//             onClick={() => alert("Resend OTP functionality not implemented")}
//           >
//             Resend OTP
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
