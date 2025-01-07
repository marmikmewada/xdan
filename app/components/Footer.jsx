'use client';

import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import { useState } from "react";
import useStore from "@/app/store/useStore";
import Link from 'next/link';
import Image from 'next/image';

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
        <div className="flex justify-center mb-8">
          <Image
            src="https://ik.imagekit.io/syziko5ml/banners/37b1259e-701e-4a20-9220-63948c0cd75b.png"
            alt="Bronze & Beauty Studio Logo"
            width={200}
            height={100}
            className="h-auto w-auto"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Company Information</h2>
            <ul className="space-y-3 text-sm">
              <li>
                Bronze & Beauty Studio Hednesford Limited. Company Registration Number: 16059465
              </li>
              <li>
                Registered Address: 39 Market Street, Hednesford, Cannock, Staffordshire WS12 1AY
              </li>
            </ul>
          </div>

          {/* Help & Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Help & Info</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:underline">
                  Our Stores
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:underline">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/packages" className="hover:underline">
                  Minutes & Packages
                </Link>
              </li>
              <li>
                <Link href="/sunbeds" className="hover:underline">
                  UV Tanning Beds
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:underline">
                  Lotions
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Times */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Opening Times</h2>
            <ul className="space-y-3 text-sm">
              <li>Monday: 09:00 - 20:00</li>
              <li>Tuesday: 09:00 - 20:00</li>
              <li>Wednesday: 09:00 - 20:00</li>
              <li>Thursday: 09:00 - 20:00</li>
              <li>Friday: 09:00 - 20:00</li>
              <li>Saturday: 10:00 - 16:00</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>

          {/* Contact Information and Newsletter */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <FaPhoneAlt className={`inline-block mr-2 ${textColor}`} />
                <span>01543 524754</span>
              </li>
              <li>
                <FaEnvelope className={`inline-block mr-2 ${textColor}`} />
                <span>hednesford@bronzebeautystudio.co.uk</span>
              </li>
              <li>
                <Link
                  href="https://maps.app.goo.gl/6zFXpdBxqoHkXqtJ8"
                  className={`hover:underline ${textColor}`}
                >
                  View on Map
                </Link>
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

        {/* Certification Logos */}
        <div className="mt-12 mb-8">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <Image
              src="https://ik.imagekit.io/syziko5ml/banners/SA-Logo.png?updatedAt=1736266887655"
              alt="Certification Logo 1"
              width={120}
              height={120}
              className="h-auto w-auto object-contain"
            />
            <Image
              src="https://ik.imagekit.io/syziko5ml/banners/Visa-Logo.png?updatedAt=1736266887164"
              alt="Certification Logo 2"
              width={120}
              height={120}
              className="h-auto w-auto object-contain"
            />
            <Image
              src="https://ik.imagekit.io/syziko5ml/banners/Mastercard-Logo.png?updatedAt=1736266887244"
              alt="Certification Logo 3"
              width={120}
              height={120}
              className="h-auto w-auto object-contain"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6">
            <a
              href="https://www.facebook.com/profile.php?id=61567174911803"
              className={`${iconColor} ${hoverIconColor} text-2xl`}
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com/bronzebeautystudioltd"
              className={`${iconColor} ${hoverIconColor} text-2xl`}
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.tiktok.com/@bronzebeautystudioltd"
              className={`${iconColor} ${hoverIconColor} text-2xl`}
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 text-center border-t border-gray-700 pt-6">
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Bronze & Beauty Studio Hednesford Limited. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}


// 'use client';

// import {
//   FaFacebook,
//   FaInstagram,
//   FaTiktok,
//   FaEnvelope,
//   FaPhoneAlt,
// } from "react-icons/fa";
// import { useState } from "react";
// import useStore from "@/app/store/useStore";
// import Link from 'next/link';
// import Image from 'next/image';

// export default function Footer() {
//   const [email, setEmail] = useState("");
//   const { selectedMode } = useStore();

//   const handleNewsletterSubmit = (e) => {
//     e.preventDefault();
//     console.log(`Newsletter subscription request sent for: ${email}`);
//     setEmail("");
//   };

//   const gradientClass =
//     selectedMode === "dark"
//       ? "bg-gradient-to-r from-gray-800 to-black"
//       : "bg-gradient-to-r from-white to-gray-200";
//   const textColor = selectedMode === "dark" ? "text-white" : "text-black";
//   const inputBg =
//     selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800";
//   const buttonBg =
//     selectedMode === "dark"
//       ? "bg-gray-600 hover:bg-gray-700"
//       : "bg-gray-200 hover:bg-gray-300";
//   const iconColor = selectedMode === "dark" ? "text-white" : "text-gray-800";
//   const hoverIconColor =
//     selectedMode === "dark" ? "hover:text-blue-400" : "hover:text-blue-500";

//   return (
//     <footer className={`py-16 ${gradientClass} ${textColor}`}>
//       <div className="max-w-7xl mx-auto px-6 sm:px-8">
//         <div className="flex justify-center mb-8">
//           <Image
//             src="https://ik.imagekit.io/syziko5ml/banners/37b1259e-701e-4a20-9220-63948c0cd75b.png?updatedAt=1735747408340"
//             alt="Bronze & Beauty Studio Logo"
//             width={200}
//             height={100}
//             className="h-auto w-auto"
//           />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
//           {/* Company Information */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Company Information</h2>
//             <ul className="space-y-3 text-sm">
//               <li>
//                 Bronze & Beauty Studio Hednesford Limited. Company Registration Number: 16059465
//               </li>
//               <li>
//                 Registered Address: 39 Market Street, Hednesford, Cannock, Staffordshire WS12 1AY
//               </li>
//             </ul>
//           </div>

//           {/* Help & Info */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Help & Info</h2>
//             <ul className="space-y-3 text-sm">
//               <li>
//                 <Link href="/contact" className="hover:underline">
//                   Contact Us
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/faq" className="hover:underline">
//                   FAQs
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/locations" className="hover:underline">
//                   Our Stores
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/privacy-policy" className="hover:underline">
//                   Privacy Policy
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/terms-and-conditions" className="hover:underline">
//                   Terms &amp; Conditions
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Products */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Products</h2>
//             <ul className="space-y-3 text-sm">
//               <li>
//                 <Link href="/packages" className="hover:underline">
//                   Minutes & Packages
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/sunbeds" className="hover:underline">
//                   UV Tanning Beds
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/products" className="hover:underline">
//                   Lotions
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Contact Information and Newsletter */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
//             <ul className="space-y-3 text-sm">
//               <li>
//                 <FaPhoneAlt className={`inline-block mr-2 ${textColor}`} />
//                 <span>01543 524754</span>
//               </li>
//               <li>
//                 <FaEnvelope className={`inline-block mr-2 ${textColor}`} />
//                 <span>hednesford@bronzebeautystudio.co.uk</span>
//               </li>
//               <li>
//                 <Link
//                   href="https://maps.app.goo.gl/6zFXpdBxqoHkXqtJ8"
//                   className={`hover:underline ${textColor}`}
//                 >
//                   View on Map
//                 </Link>
//               </li>
//             </ul>

//             <h2 className="text-2xl font-semibold mt-6 mb-4">
//               Subscribe to Our Newsletter
//             </h2>
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
//         </div>

//         {/* Social Media Links */}
//         <div className="mt-8 text-center">
//           <div className="flex justify-center space-x-6">
//             <a
//               href="https://www.facebook.com/profile.php?id=61567174911803"
//               className={`${iconColor} ${hoverIconColor} text-2xl`}
//               aria-label="Facebook"
//             >
//               <FaFacebook />
//             </a>
//             <a
//               href="https://www.instagram.com/bronzebeautystudioltd"
//               className={`${iconColor} ${hoverIconColor} text-2xl`}
//               aria-label="Instagram"
//             >
//               <FaInstagram />
//             </a>
//             <a
//               href="https://www.tiktok.com/@bronzebeautystudioltd"
//               className={`${iconColor} ${hoverIconColor} text-2xl`}
//               aria-label="TikTok"
//             >
//               <FaTiktok />
//             </a>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="mt-12 text-center border-t border-gray-700 pt-6">
//           <div className="text-sm">
//             &copy; {new Date().getFullYear()} Bronze & Beauty Studio Hednesford Limited. All rights
//             reserved.
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }







// 'use client';

// import {
//   FaFacebook,
//   FaInstagram,
//   FaTiktok,
//   FaEnvelope,
//   FaPhoneAlt,
// } from "react-icons/fa";
// import { useState } from "react";
// import useStore from "@/app/store/useStore";
// import Link from 'next/link';

// export default function Footer() {
//   const [email, setEmail] = useState("");
//   const { selectedMode } = useStore();

//   const handleNewsletterSubmit = (e) => {
//     e.preventDefault();
//     console.log(`Newsletter subscription request sent for: ${email}`);
//     setEmail("");
//   };

//   const gradientClass =
//     selectedMode === "dark"
//       ? "bg-gradient-to-r from-gray-800 to-black"
//       : "bg-gradient-to-r from-white to-gray-200";
//   const textColor = selectedMode === "dark" ? "text-white" : "text-black";
//   const inputBg =
//     selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800";
//   const buttonBg =
//     selectedMode === "dark"
//       ? "bg-gray-600 hover:bg-gray-700"
//       : "bg-gray-200 hover:bg-gray-300";
//   const iconColor = selectedMode === "dark" ? "text-white" : "text-gray-800";
//   const hoverIconColor =
//     selectedMode === "dark" ? "hover:text-blue-400" : "hover:text-blue-500";

//   return (
//     <footer className={`py-16 ${gradientClass} ${textColor}`}>
//       <div className="max-w-7xl mx-auto px-6 sm:px-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
//           {/* The Tanning Shop */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">The Tanning Shop</h2>
//             <ul className="space-y-3 text-sm">
//               <li>
//                 Bronze and Beautify Studio is a registered business in the UK.
//               </li>
//               <li>Company number 05891329, VAT number 287155376</li>
//               <li>
//                 Registered address: Unit J6, Morton Park, Darlington DL1 4PG
//               </li>
//               <li>customerservices@tfgg.co.uk</li>
//             </ul>
//           </div>

//           {/* Help & Info */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Help & Info</h2>
//             <ul className="space-y-3 text-sm">
//               <li>
//                 <Link href="#" className="hover:underline">
//                   Contact Us
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/faq" className="hover:underline">
//                   FAQs
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="hover:underline">
//                   Our Stores
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Products */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Products</h2>
//             <ul className="space-y-3 text-sm">
//               <li>
//                 <Link href="#" className="hover:underline">
//                   Minutes & Packages
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="hover:underline">
//                   UV Tanning Beds
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="hover:underline">
//                   Lotions
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Contact Information and Newsletter */}
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
//                 <Link
//                   href="https://www.google.com/maps"
//                   className={`hover:underline ${textColor}`}
//                 >
//                   View on Map
//                 </Link>
//               </li>
//             </ul>

//             <h2 className="text-2xl font-semibold mt-6 mb-4">
//               Subscribe to Our Newsletter
//             </h2>
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
//         </div>

//         {/* Social Media Links */}
//         <div className="mt-8 text-center">
//           <div className="flex justify-center space-x-6">
//             <a
//               href="#"
//               className={`${iconColor} ${hoverIconColor} text-2xl`}
//               aria-label="Facebook"
//             >
//               <FaFacebook />
//             </a>
//             <a
//               href="#"
//               className={`${iconColor} ${hoverIconColor} text-2xl`}
//               aria-label="Instagram"
//             >
//               <FaInstagram />
//             </a>
//             <a
//               href="#"
//               className={`${iconColor} ${hoverIconColor} text-2xl`}
//               aria-label="TikTok"
//             >
//               <FaTiktok />
//             </a>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="mt-12 text-center border-t border-gray-700 pt-6">
//           <div className="text-sm">
//             &copy; {new Date().getFullYear()} Bronze and Beautify Studio. All rights
//             reserved. <br />
//             <div className="flex justify-center gap-4 mt-4">
//               <Link href="/privacy-policy" className="text-blue-500 hover:underline">
//                 Privacy Policy
//               </Link>
//               <span>|</span>
//               <Link href="/terms-and-conditions" className="text-blue-500 hover:underline">
//                 Terms &amp; Conditions
//               </Link>
//               <span>|</span>
//               <Link href="/faq" className="text-blue-500 hover:underline">
//                 FAQ
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }



