"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useStore from "@/app/store/useStore";
import emailjs from "@emailjs/browser";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const { selectedMode } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to send reset email. Please try again.");
      } else {
        const {token,user_name}=data?.data||{}
        console.log("token",token)
        await emailjs.send(
          process.env.NEXT_PUBLIC_SERVICE_ID,
            process.env.NEXT_PUBLIC_FORGOT_PASSWORD_TEMPLATE_ID,
            {
              to: email,
              to_name: user_name,
              reset_url:`${window.Location.href}/reset-password?token=${token}`,
              from_name:"Bronze & Beauty Studio"
            },
            {
              publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
            }
          )
        setSuccess("Password reset email sent. Please check your inbox.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const gradientClass = selectedMode === 'dark' ? 'bg-gradient-to-r from-gray-800 to-black' : 'bg-gradient-to-r from-white to-gray-200';
  const textColor = selectedMode === 'dark' ? 'text-white' : 'text-black';
  const inputBg = selectedMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';
  const buttonBg = selectedMode === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-black hover:bg-gray-300';
  
  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-6 ${gradientClass}`}>
      <div className={`max-w-md w-full p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out ${selectedMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <h2 className="text-3xl font-semibold text-center mb-6 tracking-tight">Forgot Password</h2>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 shadow-md">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 shadow-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${textColor}`}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className={`w-full py-3 px-4 font-semibold rounded-md focus:outline-none focus:ring-2 transition-all ease-in-out duration-300 ${buttonBg} text-white`}
            >
              Send Reset Link
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm">
            Remember your password?{" "}
            <Link href="/login" className={`text-blue-500 hover:text-blue-700 font-semibold ${textColor}`}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

