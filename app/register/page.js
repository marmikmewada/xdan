"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useStore from "@/app/store/useStore";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmEmail: "",
    confirmPassword: "",
    gender: "",
    skinType: "",
    dob: "",
    hereAbout: "",
    theme: "light",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    agreeTerms: false,
    agreeDiscounts: false,
    agreeSkinType: false,
    interestedServices: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
  });
  const router = useRouter();

  const { selectedMode } = useStore();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'interestedServices') {
        setFormData(prevState => ({
          ...prevState,
          interestedServices: checked
            ? [...prevState.interestedServices, value]
            : prevState.interestedServices.filter(service => service !== value)
        }));
      } else {
        setFormData(prevState => ({ ...prevState, [name]: checked }));
      }
    } else {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

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

    const address = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.zipCode}`;

    const payload = { ...formData, address };
    console.log(payload)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
  const services = ["UV Tanning", "Spray Tanning", "Red Light Therapy", "Cryotherapy"];

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-6 ${gradientClass}`}>
      <br />
      <br />
      <br />
      <div className={`max-w-md w-full p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out ${selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
        <h2 className="text-3xl font-semibold text-center mb-6 tracking-tight">Create an Account</h2>

        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 shadow-md">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 shadow-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${textColor}`}>Password</label>
            <p className={`text-sm ${textColor} mt-1`}>Passwords must meet the following requirements:</p>
            <ul className={`text-sm ${textColor} mb-2`}>
              <li className={passwordStrength.length ? "text-green-500" : "text-red-500"}>
                {passwordStrength.length ? <FaCheck className="inline mr-1" /> : <FaTimes className="inline mr-1" />}
                Be at least 8 characters long
              </li>
              <li className={passwordStrength.lowercase && passwordStrength.uppercase ? "text-green-500" : "text-red-500"}>
                {passwordStrength.lowercase && passwordStrength.uppercase ? <FaCheck className="inline mr-1" /> : <FaTimes className="inline mr-1" />}
                Contain at least 1 lower and 1 upper case letter
              </li>
              <li className={passwordStrength.number ? "text-green-500" : "text-red-500"}>
                {passwordStrength.number ? <FaCheck className="inline mr-1" /> : <FaTimes className="inline mr-1" />}
                Contain at least 1 number
              </li>
            </ul>
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
              <option value="">Select Gender</option>
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="skinType" className={`block text-sm font-medium ${textColor}`}>Skin Type</label>
            <select
              id="skinType"
              name="skinType"
              value={formData.skinType}
              onChange={handleChange}
              required
              className={`mt-1 block w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
            >
              <option value="">Select Skin Type</option>
              {skinTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

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

          <div>
            <label htmlFor="street" className={`block text-sm font-medium ${textColor}`}>Street Address</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
              placeholder="Enter your street address"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          <div>
            <label htmlFor="city" className={`block text-sm font-medium ${textColor}`}>City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Enter your city"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          <div>
            <label htmlFor="state" className={`block text-sm font-medium ${textColor}`}>State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              placeholder="Enter your state"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          <div>
            <label htmlFor="zipCode" className={`block text-sm font-medium ${textColor}`}>Zip Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
              placeholder="Enter your zip code"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          <div>
            <p className={`block text-sm font-medium ${textColor} mb-2`}>What services are you interested in?</p>
            {services.map((service) => (
              <div key={service} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={service}
                  name="interestedServices"
                  value={service}
                  checked={formData.interestedServices.includes(service)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor={service} className={`text-sm ${textColor}`}>{service}</label>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="agreeTerms" className={`text-sm ${textColor}`}>
                I agree to the terms and conditions and consent that I am suitable for tanning services.
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="agreeDiscounts"
                name="agreeDiscounts"
                checked={formData.agreeDiscounts}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="agreeDiscounts" className={`text-sm ${textColor}`}>
                I agree to receiving the latest discounts, deals and offers.
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agreeSkinType"
                name="agreeSkinType"
                checked={formData.agreeSkinType}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="agreeSkinType" className={`text-sm ${textColor}`}>
                I hereby certify that the skin type selected is accurate.
              </label>
            </div>
          </div>

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
// import useStore from "@/app/store/useStore";

// export default function Register() {
//   const [formData, setFormData] = useState({
//     name: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmEmail: "",
//     confirmPassword: "",
//     gender: "",
//     skinType: "",
//     dob: "",
//     hereAbout: "",
//     theme: "light",
//     street: "",
//     city: "",
//     state: "",
//     zipCode: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const router = useRouter();

//   const { selectedMode } = useStore();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccessMessage("");

//     if (formData.email !== formData.confirmEmail) {
//       setError("Email and Confirm Email do not match.");
//       setLoading(false);
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError("Password and Confirm Password do not match.");
//       setLoading(false);
//       return;
//     }

//     const address = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.zipCode}`;

//     const payload = { ...formData, address };
//     console.log(payload)

//     try {
//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
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

//   const gradientClass = selectedMode === "dark" ? "bg-gradient-to-r from-gray-800 to-black" : "bg-gradient-to-r from-white to-gray-200";
//   const textColor = selectedMode === "dark" ? "text-white" : "text-black";
//   const inputBg = selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800";
//   const buttonBg = selectedMode === "dark" ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300";
//   const selectClass = selectedMode === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-400';

//   const genders = ["Male", "Female", "Prefer not to say"];
//   const skinTypes = ["Dark", "Medium", "Fair", "Sensitive"];
//   const hereAboutOptions = [
//     "Website",
//     "Flyer",
//     "TV Advert",
//     "Email",
//     "Seen Store",
//     "Social Media",
//     "Word of Mouth",
//     "Ad Banner",
//   ];

//   return (
//     <div className={`min-h-screen flex items-center justify-center py-12 px-6 ${gradientClass}`}>
//       <br />
//       <br />
//       <br />
//       <div className={`max-w-md w-full p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out ${selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
//         <h2 className="text-3xl font-semibold text-center mb-6 tracking-tight">Create an Account</h2>

//         {successMessage && (
//           <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 shadow-md">
//             {successMessage}
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 shadow-md">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
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

//           <div>
//             <label htmlFor="confirmEmail" className={`block text-sm font-medium ${textColor}`}>Confirm Email</label>
//             <input
//               type="email"
//               id="confirmEmail"
//               name="confirmEmail"
//               value={formData.confirmEmail}
//               onChange={handleChange}
//               required
//               placeholder="Confirm your email"
//               className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//             />
//           </div>

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

//           <div>
//             <label htmlFor="confirmPassword" className={`block text-sm font-medium ${textColor}`}>Confirm Password</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               placeholder="Confirm your password"
//               className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//             />
//           </div>

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
//             <label htmlFor="gender" className={`block text-sm font-medium ${textColor}`}>Gender</label>
//             <select
//               id="gender"
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               required
//               className={`mt-1 block w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
//             >
//               <option value="">Select Gender</option>
//               {genders.map((gender) => (
//                 <option key={gender} value={gender}>
//                   {gender}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="skinType" className={`block text-sm font-medium ${textColor}`}>Skin Type</label>
//             <select
//               id="skinType"
//               name="skinType"
//               value={formData.skinType}
//               onChange={handleChange}
//               required
//               className={`mt-1 block w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
//             >
//               <option value="">Select Skin Type</option>
//               {skinTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="hereAbout" className={`block text-sm font-medium ${textColor}`}>How did you hear about us?</label>
//             <select
//               id="hereAbout"
//               name="hereAbout"
//               value={formData.hereAbout}
//               onChange={handleChange}
//               className={`mt-1 block w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
//             >
//               <option value="">Select an option</option>
//               {hereAboutOptions.map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="street" className={`block text-sm font-medium ${textColor}`}>Street Address</label>
//             <input
//               type="text"
//               id="street"
//               name="street"
//               value={formData.street}
//               onChange={handleChange}
//               required
//               placeholder="Enter your street address"
//               className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//             />
//           </div>

//           <div>
//             <label htmlFor="city" className={`block text-sm font-medium ${textColor}`}>City</label>
//             <input
//               type="text"
//               id="city"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               required
//               placeholder="Enter your city"
//               className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//             />
//           </div>

//           <div>
//             <label htmlFor="state" className={`block text-sm font-medium ${textColor}`}>State</label>
//             <input
//               type="text"
//               id="state"
//               name="state"
//               value={formData.state}
//               onChange={handleChange}
//               required
//               placeholder="Enter your state"
//               className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//             />
//           </div>

//           <div>
//             <label htmlFor="zipCode" className={`block text-sm font-medium ${textColor}`}>Zip Code</label>
//             <input
//               type="text"
//               id="zipCode"
//               name="zipCode"
//               value={formData.zipCode}
//               onChange={handleChange}
//               required
//               placeholder="Enter your zip code"
//               className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//             />
//           </div>

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
