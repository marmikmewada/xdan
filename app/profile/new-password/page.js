"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useStore from "@/app/store/useStore"; // Assuming you have this Zustand store set up

export default function ChangePasswordPage() {
  const { data: session } = useSession(); 
  const router = useRouter();

  // State to manage form values and notifications
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null); // For custom notification
  const [error, setError] = useState(null);

  const { selectedMode } = useStore();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmNewPassword) {
      setNotification({ type: "error", message: "All fields are required." });
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setNotification({ type: "error", message: "New passwords don't match." });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ type: "success", message: data.message || "Password changed successfully!" });
        // Optionally redirect after success
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      } else {
        setNotification({ type: "error", message: data.message || "Error while changing password." });
      }
    } catch (err) {
      setNotification({ type: "error", message: err.message || "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-hide notifications after 3 seconds
  if (notification) {
    setTimeout(() => setNotification(null), 3000);
  }

  // Apply styles based on the selected theme (dark or light mode)
  const bgGradient = selectedMode === 'dark' 
    ? 'bg-gradient-to-b from-black to-gray-900' 
    : 'bg-gradient-to-r from-white to-gray-200';
  const textColor = selectedMode === 'dark' ? 'text-white' : 'text-black';
  const buttonBg = selectedMode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const buttonText = selectedMode === 'dark' ? 'text-white' : 'text-gray-800';
  const buttonHover = selectedMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

  return (
    <div className={`min-h-screen ${bgGradient} ${textColor} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Change Your Password</h1>

        {/* Custom Notification */}
        {notification && (
          <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}>
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
              placeholder="Enter your old password"
              className="w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter your new password"
              className="w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your new password"
              className="w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 border-gray-300"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`w-full py-3 px-4 font-semibold rounded-md focus:outline-none focus:ring-2 transition-all ease-in-out duration-300 ${buttonBg} ${buttonText} ${buttonHover}`}
              disabled={isLoading}
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
