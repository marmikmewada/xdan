"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useStore from "@/app/store/useStore"; // Assuming you have a store for the selectedMode

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmEmail: "",  // New field for confirm email
    confirmPassword: "",  // New field for confirm password
    gender: "",
    skinType: "",
    dob: "",
    hereAbout: "",
    theme: "light",  // New field for theme, default value is "light"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // Getting the selected mode from the store
  const { selectedMode } = useStore();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    // Validation for confirm email and confirm password
    if (formData.email !== formData.confirmEmail) {
      setError("Email and Confirm Email do not match.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage("User registered successfully!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("Error registering user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Define gradient classes based on selectedMode
  const gradientClass = selectedMode === "dark" ? "bg-gradient-to-r from-gray-800 to-black" : "bg-gradient-to-r from-white to-gray-200";
  const textColor = selectedMode === "dark" ? "text-white" : "text-black";
  const inputBg = selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800";
  const buttonBg = selectedMode === "dark" ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300";
  const selectClass = selectedMode === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-400';

  const genders = ["Male", "Female", "Prefer not to say"];
  const skinTypes = ["Dark", "Medium", "Fair", "Sensitive"];
  const hereAboutOptions = [
    "Website",
    "Flyer",
    "TV Advert",
    "Email",
    "Seen Store",
    "Social Media",
    "Word of Mouth",
    "Ad Banner",
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-6 ${gradientClass}`}>
      <br />
      <br />
      <br />
      <div className={`max-w-md w-full p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out ${selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
        <h2 className="text-3xl font-semibold text-center mb-6 tracking-tight">Create an Account</h2>

        {/* Display success message */}
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 shadow-md">
            {successMessage}
          </div>
        )}

        {/* Display error message */}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 shadow-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <label htmlFor="name" className={`block text-sm font-medium ${textColor}`}>First Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your first name"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className={`block text-sm font-medium ${textColor}`}>Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Enter your last name"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${textColor}`}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          {/* Confirm Email */}
          <div>
            <label htmlFor="confirmEmail" className={`block text-sm font-medium ${textColor}`}>Confirm Email</label>
            <input
              type="email"
              id="confirmEmail"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
              required
              placeholder="Confirm your email"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={`block text-sm font-medium ${textColor}`}>Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dob" className={`block text-sm font-medium ${textColor}`}>Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className={`block text-sm font-medium ${textColor}`}>Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className={`mt-1 block w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
            >
              <option value="">Select a Gender</option>
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>

          {/* Skin Type */}
          <div>
            <label htmlFor="skinType" className={`block text-sm font-medium ${textColor}`}>Skin Type</label>
            <select
              id="skinType"
              name="skinType"
              value={formData.skinType}
              onChange={handleChange}
              className={`mt-1 block w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
            >
              <option value="">Select a Skin Type</option>
              {skinTypes.map((skin) => (
                <option key={skin} value={skin}>
                  {skin}
                </option>
              ))}
            </select>
          </div>

          {/* How did you hear about us */}
          <div>
            <label htmlFor="hereAbout" className={`block text-sm font-medium ${textColor}`}>How did you hear about us?</label>
            <select
              id="hereAbout"
              name="hereAbout"
              value={formData.hereAbout}
              onChange={handleChange}
              className={`mt-1 block w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
            >
              <option value="">Select an option</option>
              {hereAboutOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Selection */}
          <div>
            <label htmlFor="theme" className={`block text-sm font-medium ${textColor}`}>Theme</label>
            <select
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className={`mt-1 block w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${textColor}`}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className={`block text-sm font-medium ${textColor}`}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className={`w-full py-3 px-4 font-semibold rounded-md focus:outline-none focus:ring-2 transition-all ease-in-out duration-300 ${buttonBg} text-white`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link href="/login" className={`text-blue-500 hover:text-blue-700 font-semibold ${textColor}`}>
              Login here
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
// import  useStore  from "@/app/store/useStore"; // Assuming you have a store for the selectedMode

// export default function Register() {
//   const [formData, setFormData] = useState({
//     name: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     gender:"",
//     skinType:"",
//     dob: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const router = useRouter();

//   // Getting the selected mode from the store
//   const { selectedMode } = useStore();

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccessMessage("");

//     try {
//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setSuccessMessage("User registered successfully!");
//         setTimeout(() => router.push("/login"), 2000);
//       } else {
//         setError(data.message || "Something went wrong. Please try again.");
//       }
//     } catch (error) {
//       setError("Error registering user. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Define gradient classes based on selectedMode
//   const gradientClass = selectedMode === "dark" ? "bg-gradient-to-r from-gray-800 to-black" : "bg-gradient-to-r from-white to-gray-200";
//   const textColor = selectedMode === "dark" ? "text-white" : "text-black";
//   const inputBg = selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800";
//   const buttonBg = selectedMode === "dark" ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300";
//   const selectClass = selectedMode === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-400';
  
//   const genders=["Male","Female","Prefer not say"]
//   const skinTypes=["Dark","Medium","Fare", "Sensetive"]
//   return (
//     <div className={`min-h-screen flex items-center justify-center py-12 px-6 ${gradientClass}`}>
//       <br />
//       <br />
//       <br />
//       <div className={`max-w-md w-full p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out ${selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
//         <h2 className="text-3xl font-semibold text-center mb-6 tracking-tight">Create an Account</h2>

//         {/* Display success message */}
//         {successMessage && (
//           <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 shadow-md">
//             {successMessage}
//           </div>
//         )}

//         {/* Display error message */}
//         {error && (
//           <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 shadow-md">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* First Name */}
//           <div>
//             <label htmlFor="name" className={`block text-sm font-medium ${textColor}`}>First Name</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               placeholder="Enter your first name"
//               className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//             />
//           </div>

//           {/* Last Name */}
//           <div>
//             <label htmlFor="lastName" className={`block text-sm font-medium ${textColor}`}>Last Name</label>
//             <input
//               type="text"
//               id="lastName"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               required
//               placeholder="Enter your last name"
//               className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label htmlFor="email" className={`block text-sm font-medium ${textColor}`}>Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               placeholder="Enter your email"
//               className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//             />
//           </div>

//           {/* Phone */}
//           <div>
//             <label htmlFor="phone" className={`block text-sm font-medium ${textColor}`}>Phone</label>
//             <input
//               type="text"
//               id="phone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//               placeholder="Enter your phone number"
//               className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//             />
//           </div>

//           {/* Date of Birth */}
//           <div>
//             <label htmlFor="dob" className={`block text-sm font-medium ${textColor}`}>Date of Birth</label>
//             <input
//               type="date"
//               id="dob"
//               name="dob"
//               value={formData.dob}
//               onChange={handleChange}
//               required
//               className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//             />
//           </div>

//           <div>
//           <label htmlFor="gender" className={`block text-sm font-medium ${textColor}`}>Gender</label>
//           <select
//                 id="gender"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={(e) => setFormData({gender:e.target.value})}
//                 className={`mt-1 block w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
//               >
//                 <option value="">Select a Gender</option>
//                 {genders.map((gender) => (
//                   <option key={gender} value={gender}>
//                     {gender}
//                   </option>
//                 ))}
//               </select>
//           </div>

//           <div>
//             <label htmlFor="skinType" className={`block text-sm font-medium ${textColor}`}>Skin Type</label>
//             <select
//                 id="skinType"
//                 name="skinType"
//                 value={formData.skinType}
//                 onChange={(e) => setFormData({skinType:e.target.value})}
//                 className={`mt-1 block w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
//               >
//                 <option value="">Select a Skin Type</option>
//                 {skinTypes.map((skin) => (
//                   <option key={skin} value={skin}>
//                     {skin}
//                   </option>
//                 ))}
//               </select>
//             {/* <input
//               type="text"
//               id="skinType"
//               name="skinType"
//               value={formData.skinType}
//               onChange={handleChange}
//               required
//               placeholder="Enter your Skin type"
//               className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//             /> */}
//           </div>
//           {/* Password */}
//           <div>
//             <label htmlFor="password" className={`block text-sm font-medium ${textColor}`}>Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               placeholder="Enter your password"
//               className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//             />
//           </div>

//           {/* Submit Button */}
//           <div className="mt-8">
//             <button
//               type="submit"
//               className={`w-full py-3 px-4 font-semibold rounded-md focus:outline-none focus:ring-2 transition-all ease-in-out duration-300 ${buttonBg} text-white`}
//               disabled={loading}
//             >
//               {loading ? "Registering..." : "Register"}
//             </button>
//           </div>
//         </form>

//         {/* Login Link */}
//         <div className="mt-6 text-center">
//           <p className="text-sm">
//             Already have an account?{" "}
//             <Link href="/login" className={`text-blue-500 hover:text-blue-700 font-semibold ${textColor}`}>
//               Login here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function Register() {
//   const [formData, setFormData] = useState({
//     name: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     dob: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const router = useRouter();

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccessMessage("");

//     try {
//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setSuccessMessage("User registered successfully!");
//         // Redirect to login or another page after successful registration
//         setTimeout(() => router.push("/login"), 2000);
//       } else {
//         setError(data.message || "Something went wrong. Please try again.");
//       }
//     } catch (error) {
//       setError("Error registering user. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-6">
//       <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>

//         {/* Display success message */}
//         {successMessage && (
//           <div className="bg-green-100 text-green-800 p-3 mb-4 rounded-lg">
//             {successMessage}
//           </div>
//         )}

//         {/* Display error message */}
//         {error && (
//           <div className="bg-red-100 text-red-800 p-3 mb-4 rounded-lg">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4">
//             {/* Name */}
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                 First Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             {/* Last Name */}
//             <div>
//               <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
//                 Last Name
//               </label>
//               <input
//                 type="text"
//                 id="lastName"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             {/* Phone */}
//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//                 Phone
//               </label>
//               <input
//                 type="text"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             {/* Date of Birth */}
//             <div>
//               <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
//                 Date of Birth
//               </label>
//               <input
//                 type="date"
//                 id="dob"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             {/* Submit Button */}
//             <div className="mt-6">
//               <button
//                 type="submit"
//                 className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading && "opacity-50 cursor-not-allowed"}`}
//                 disabled={loading}
//               >
//                 {loading ? "Registering..." : "Register"}
//               </button>
//             </div>
//           </div>
//         </form>

//         <div className="mt-6 text-center">
//           <p className="text-sm text-gray-600">
//             Already have an account?{" "}
//             <Link href="/login" className="text-blue-500 hover:text-blue-700">
//               Login here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
