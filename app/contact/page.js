'use client';

import { useState } from "react";
import useStore from "@/app/store/useStore";
import {
    FaFacebook,
    FaInstagram,
    FaTiktok,
    FaEnvelope,
    FaPhoneAlt,
  } from "react-icons/fa";
import Link from 'next/link';

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { selectedMode } = useStore();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted: ", { name, email, message });
    setName("");
    setEmail("");
    setMessage("");
  };

  const gradientClass =
    selectedMode === "dark"
      ? "bg-gradient-to-r from-gray-800 to-black"
      : "bg-gradient-to-r from-white to-gray-200";
  const textColor = selectedMode === "dark" ? "text-white" : "text-black";
  const inputBg =
    selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800";
  const buttonBg =
    selectedMode === "dark"
      ? "bg-gray-600 hover:bg-gray-700"
      : "bg-gray-200 hover:bg-gray-300";

  return (
    <div className={`min-h-screen ${gradientClass} ${textColor}`}>
        <br />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <h1 className="text-4xl font-lg text-center mb-8">Contact Us</h1>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="col-span-1">
                <label htmlFor="name" className="block text-lg font-medium mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-4 rounded-md ${inputBg}`}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="col-span-1">
                <label htmlFor="email" className="block text-lg font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-4 rounded-md ${inputBg}`}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="message" className="block text-lg font-medium mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full p-4 rounded-md ${inputBg}`}
                placeholder="Enter your message"
                rows="6"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-md ${buttonBg} text-white text-lg`}
            >
              Submit
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Other Ways to Reach Us</h2>
          <div className="space-y-4 text-lg">
            <div>
              <FaPhoneAlt className="inline-block mr-2" />
              <span>+1 (800) 123-4567</span>
            </div>
            <div>
              <FaEnvelope className="inline-block mr-2" />
              <span>contact@bronzebeautystudio.co.uk</span>
            </div>
            <div>
              <Link
                href="https://www.google.com/maps?q=39+Market+Street,+Hednesford"
                className="text-blue-500 hover:underline"
              >
                View on Map
              </Link>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        {/* <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="text-gray-800 hover:text-blue-500 text-2xl"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className="text-gray-800 hover:text-blue-500 text-2xl"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="text-gray-800 hover:text-blue-500 text-2xl"
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
}
