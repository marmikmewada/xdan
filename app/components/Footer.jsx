"use client";

import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
  FaTiktok,
} from "react-icons/fa";
import { useState } from "react";
import useStore from "@/app/store/useStore";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { selectedMode } = useStore();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log(`Newsletter subscription request sent for: ${email}`);
    setEmail("");
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
  const iconColor = selectedMode === "dark" ? "text-white" : "text-gray-800";
  const hoverIconColor =
    selectedMode === "dark" ? "hover:text-blue-400" : "hover:text-blue-500";

  return (
    <footer className={`py-16 ${gradientClass} ${textColor}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* The Tanning Shop */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">The Tanning Shop</h2>
            <ul className="space-y-3 text-sm">
              <li>
                The Feel Good Group Ltd T/A The Tanning Shop is registered in the
                UK
              </li>
              <li>Company number 05891329, VAT number 287155376</li>
              <li>
                Registered address: Unit J6, Morton Park, Darlington DL1 4PG
              </li>
              <li>customerservices@tfgg.co.uk</li>
            </ul>
          </div>

          {/* Help & Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Help & Info</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Responsible Tanning
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Our Stores
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Influencer & Content Creator Program
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Minutes & Packages
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  UV Tanning Beds
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Spray Tan Automated Booths
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Lotions
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Red Light Therapy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information and Newsletter */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <FaPhoneAlt className={`inline-block mr-2 ${textColor}`} />
                <span>+1 (800) 123-4567</span>
              </li>
              <li>
                <FaEnvelope className={`inline-block mr-2 ${textColor}`} />
                <span>contact@mytanningsalon.com</span>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps"
                  className={`hover:underline ${textColor}`}
                >
                  View on Map
                </a>
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">
              Subscribe to Our Newsletter
            </h2>
            <form onSubmit={handleNewsletterSubmit}>
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`p-2 w-full rounded-md ${inputBg}`}
                  placeholder="Enter your email"
                  required
                />
                <button
                  type="submit"
                  className={`p-2 rounded-md ${buttonBg} text-white`}
                >
                  <FaEnvelope />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className={`${iconColor} ${hoverIconColor} text-2xl`}
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className={`${iconColor} ${hoverIconColor} text-2xl`}
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className={`${iconColor} ${hoverIconColor} text-2xl`}
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 text-center border-t border-gray-700 pt-6">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Bronze and beauty Tanning saloon. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
// "use client";

// import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
// import { useState, useEffect } from 'react';
// import useStore from "@/app/store/useStore";  // Import useStore to get selectedMode
// // Import BannerSection if needed
// // import BannerSection from './BannerSection';

// export default function Footer() {
//   const [email, setEmail] = useState('');
//   const { selectedMode } = useStore();  // Access the selectedMode from the store

//   const handleNewsletterSubmit = (e) => {
//     e.preventDefault();
//     console.log(`Newsletter subscription request sent for: ${email}`);
//     setEmail('');
//   };

//   // Define gradient classes based on selectedMode
//   const gradientClass = selectedMode === 'dark' ? 'bg-gradient-to-r from-gray-800 to-black' : 'bg-gradient-to-r from-white to-gray-200';
//   const textColor = selectedMode === 'dark' ? 'text-white' : 'text-black';
//   const inputBg = selectedMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';
//   const buttonBg = selectedMode === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300';
  
//   // Adjust the social media icon color for better visibility in dark mode
//   const iconColor = selectedMode === 'dark' ? 'text-white' : 'text-gray-800';
//   const hoverIconColor = selectedMode === 'dark' ? 'hover:text-blue-400' : 'hover:text-blue-500';

//   return (
//     <footer className={`py-16 ${gradientClass} ${textColor}`}>
//       <div className="max-w-7xl mx-auto px-6 sm:px-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
//           {/* Social Links */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
//             <div className="flex space-x-6">
//               <a href="#" aria-label="Facebook">
//                 <FaFacebook className={`text-3xl ${iconColor} ${hoverIconColor} transition-colors`} />
//               </a>
//               <a href="#" aria-label="Instagram">
//                 <FaInstagram className={`text-3xl ${iconColor} ${hoverIconColor} transition-colors`} />
//               </a>
//               <a href="#" aria-label="Twitter">
//                 <FaTwitter className={`text-3xl ${iconColor} ${hoverIconColor} transition-colors`} />
//               </a>
//               <a href="#" aria-label="YouTube">
//                 <FaYoutube className={`text-3xl ${iconColor} ${hoverIconColor} transition-colors`} />
//               </a>
//             </div>
//           </div>

//           {/* Newsletter Form */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
//             <form onSubmit={handleNewsletterSubmit}>
//               <div className="flex space-x-2">
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className={`p-2 w-full rounded-md ${inputBg}`}
//                   placeholder="Enter your email"
//                   required
//                 />
//                 <button
//                   type="submit"
//                   className={`p-2 rounded-md ${buttonBg} text-white`}
//                 >
//                   <FaEnvelope />
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Contact Information */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
//             <ul className="space-y-3 text-sm">
//               <li>
//                 <FaPhoneAlt className={`inline-block mr-2 ${textColor}`} />
//                 <span>+1 (800) 123-4567</span>
//               </li>
//               <li>
//                 <FaEnvelope className={`inline-block mr-2 ${textColor}`} />
//                 <span>contact@mytanningsalon.com</span>
//               </li>
//               <li>
//                 <a href="https://www.google.com/maps" className={`hover:underline ${textColor}`}>
//                   View on Map
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* FAQs */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
//             <ul className="space-y-3 text-sm">
//               <li>
//                 <strong className={textColor}>What are the benefits of tanning?</strong>
//                 <p className={textColor}>Tanning can help improve your skin&apos;s appearance by giving it a healthy, sun-kissed glow.</p>
//               </li>
//               <li>
//                 <strong className={textColor}>How often should I tan?</strong>
//                 <p className={textColor}>It depends on your skin type, but typically once a week for moderate tanning is recommended.</p>
//               </li>
//               <li>
//                 <strong className={textColor}>Are your tanning services safe?</strong>
//                 <p className={textColor}>Yes, all our services use high-quality equipment and safe products.</p>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="mt-12 text-center border-t border-gray-700 pt-6">
//           <p className="text-sm">
//             &copy; {new Date().getFullYear()} MyTanningSalon. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }