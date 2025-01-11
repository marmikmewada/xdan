"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import useStore from "@/app/store/useStore";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const windowLocation = window.location.href;
  const { selectedMode } = useStore();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${windowLocation}/api/auth/reset-password?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to reset password. Please try again.");
      } else {
        setSuccess("Password reset successfully. You can now login with your new password.");
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch (err) {
      console.error("Reset password error:", err);
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
        <h2 className="text-3xl font-semibold text-center mb-6 tracking-tight">Reset Password</h2>

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
            <label htmlFor="password" className={`block text-sm font-medium ${textColor}`}>New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter new password"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={`block text-sm font-medium ${textColor}`}>Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className={`w-full py-3 px-4 font-semibold rounded-md focus:outline-none focus:ring-2 transition-all ease-in-out duration-300 ${buttonBg} text-white`}
            >
              Reset Password
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

