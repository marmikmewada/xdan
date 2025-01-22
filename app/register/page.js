// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import useStore from "@/app/store/useStore";
// import { FaCheck, FaTimes, FaInfoCircle, FaTimes as FaClose } from "react-icons/fa";
// import emailjs from "@emailjs/browser";

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
//     agreeTerms: false,
//     agreeDiscounts: false,
//     agreeSkinType: false,
//     interestedServices: [],
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [showSkinTypeInfo, setShowSkinTypeInfo] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState({
//     length: false,
//     lowercase: false,
//     uppercase: false,
//     number: false,
//   });
//   const router = useRouter();

//   const { selectedMode } = useStore();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (type === 'checkbox') {
//       if (name === 'interestedServices') {
//         setFormData(prevState => ({
//           ...prevState,
//           interestedServices: checked
//             ? [...prevState.interestedServices, value]
//             : prevState.interestedServices.filter(service => service !== value)
//         }));
//       } else {
//         setFormData(prevState => ({ ...prevState, [name]: checked }));
//       }
//     } else {
//       setFormData(prevState => ({ ...prevState, [name]: value }));
//     }

//     if (name === 'password') {
//       checkPasswordStrength(value);
//     }
//   };

//   const checkPasswordStrength = (password) => {
//     setPasswordStrength({
//       length: password.length >= 8,
//       lowercase: /[a-z]/.test(password),
//       uppercase: /[A-Z]/.test(password),
//       number: /[0-9]/.test(password),
//     });
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
//   const modalBg = selectedMode === "dark" ? "bg-gray-800" : "bg-white";
//   const modalOverlay = selectedMode === "dark" ? "bg-black/70" : "bg-gray-600/70";

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
//   const services = ["UV Tanning", "Spray Tanning", "Red Light Therapy", "Cryotherapy"];

//   return (
//     <>
//       {/* Skin Type Information Modal */}
//       {showSkinTypeInfo && (
//         <div 
//           className={`fixed inset-0 ${modalOverlay} z-50 flex items-center justify-center p-4`}
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               setShowSkinTypeInfo(false);
//             }
//           }}
//         >
//           <div className={`${modalBg} rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
//             <div className="flex justify-between items-center p-4 border-b border-gray-200">
//               <h3 className={`text-lg font-semibold ${textColor}`}>SKIN TYPE INFORMATION</h3>
//               <button
//                 onClick={() => setShowSkinTypeInfo(false)}
//                 className={`${textColor} hover:opacity-70`}
//               >
//                 <FaClose size={24} />
//               </button>
//             </div>
//             <div className={`p-6 ${textColor}`}>
//               <p className="mb-4">Always proceed with caution when selecting your skin type.</p>

//               <h4 className="font-bold mb-2">Sensitive:</h4>
//               <p className="mb-4">Often light blue, grey or green eye colour. Red/strawberry blonde hair, very pale natural skin colour, have a lot of freckles or all over skin, hardly tan with UV exposure, cant stand sun exposure on face/sensitive, havent tanned in 2-3 months+</p>

//               <h4 className="font-bold mb-2">Fair:</h4>
//               <p className="mb-4">Often have blue, grey or dark green eyes, blonde/light natural hair colour, pale natural skin, more than a few freckles, tan slightly, slow developing tan, face can be sensitive to sun, last sunbed session was 1-2 months ago.</p>

//               <h4 className="font-bold mb-2">Medium:</h4>
//               <p className="mb-4">Often have Light brown/brown eye colour, Dark blonde/brown natural hair colour, medium natural skin colour, few freckles, tan reasonably well, quick developing tan, normal sensitivity to sun exposure on face, last sunbed session was 1-2 months ago.</p>

//               <h4 className="font-bold mb-2">Dark:</h4>
//               <p className="mb-4">Often have brown/dark brown eyes, dark brown/black natural hair, olive/black natural skin type, none to a couple of freckles, tan very easily/never burn, develop a tan instantly/rapidly, face rare/never reacts to sunshine, 1-30 days since last sunbathing session.</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className={`min-h-screen flex items-center justify-center py-24 px-6 ${gradientClass}`}>
//         <div className={`max-w-md w-full p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out ${selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
//           <h2 className="text-3xl font-semibold text-center mb-6 tracking-tight">Create an Account</h2>

//           {successMessage && (
//             <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 shadow-md">
//               {successMessage}
//             </div>
//           )}

//           {error && (
//             <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 shadow-md">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="name" className={`block text-sm font-medium ${textColor}`}>First Name</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your first name"
//                 className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//               />
//             </div>

//             <div>
//               <label htmlFor="lastName" className={`block text-sm font-medium ${textColor}`}>Last Name</label>
//               <input
//                 type="text"
//                 id="lastName"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your last name"
//                 className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//               />
//             </div>

//             <div>
//               <label htmlFor="email" className={`block text-sm font-medium ${textColor}`}>Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your email"
//                 className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//               />
//             </div>

//             <div>
//               <label htmlFor="confirmEmail" className={`block text-sm font-medium ${textColor}`}>Confirm Email</label>
//               <input
//                 type="email"
//                 id="confirmEmail"
//                 name="confirmEmail"
//                 value={formData.confirmEmail}
//                 onChange={handleChange}
//                 required
//                 placeholder="Confirm your email"
//                 className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//               />
//             </div>

//             <div>
//               <label htmlFor="phone" className={`block text-sm font-medium ${textColor}`}>Phone</label>
//               <input
//                 type="text"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your phone number"
//                 className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className={`block text-sm font-medium ${textColor}`}>Password</label>
//               <p className={`text-sm ${textColor} mt-1`}>Passwords must meet the following requirements:</p>
//               <ul className={`text-sm ${textColor} mb-2`}>
//                 <li className={passwordStrength.length ? "text-green-500" : "text-red-500"}>
//                   {passwordStrength.length ? <FaCheck className="inline mr-1" /> : <FaTimes className="inline mr-1" />}
//                   Be at least 8 characters long
//                 </li>
//                 <li className={passwordStrength.lowercase && passwordStrength.uppercase ? "text-green-500" : "text-red-500"}>
//                   {passwordStrength.lowercase && passwordStrength.uppercase ? <FaCheck className="inline mr-1" /> : <FaTimes className="inline mr-1" />}
//                   Contain at least 1 lower and 1 upper case letter
//                 </li>
//                 <li className={passwordStrength.number ? "text-green-500" : "text-red-500"}>
//                   {passwordStrength.number ? <FaCheck className="inline mr-1" /> : <FaTimes className="inline mr-1" />}
//                   Contain at least 1 number
//                 </li>
//               </ul>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your password"
//                 className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//               />
//             </div>

//             <div>
//               <label htmlFor="confirmPassword" className={`block text-sm font-medium ${textColor}`}>Confirm Password</label>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 placeholder="Confirm your password"
//                 className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//               />
//             </div>

//             <div>
//               <label htmlFor="dob" className={`block text-sm font-medium ${textColor}`}>Date of Birth</label>
//               <input
//                 type="date"
//                 id="dob"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 required
//                 className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//               />
//             </div>

//             <div>
//               <label htmlFor="gender" className={`block text-sm font-medium ${textColor}`}>Gender</label>
//               <select
//                 id="gender"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 required
//                 className={`mt-1 block w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
//               >
//                 <option value="">Select Gender</option>
//                 {genders.map((gender) => (
//                   <option key={gender} value={gender}>
//                     {gender}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label htmlFor="skinType" className={`block text-sm font-medium ${textColor}`}>Skin Type</label>
//               <select
//                 id="skinType"
//                 name="skinType"
//                 value={formData.skinType}
//                 onChange={handleChange}
//                 required
//                 className={`mt-1 block w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
//               >
//                 <option value="">Select Skin Type</option>
//                 {skinTypes.map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 type="button"
//                 onClick={() => setShowSkinTypeInfo(true)}
//                 className={`mt-2 flex items-center text-sm ${textColor} hover:opacity-70`}
//               >
//                 <FaInfoCircle className="mr-2" />
//                 Click here for more information on skin types
//               </button>
//             </div>

//             <div>
//               <label htmlFor="hereAbout" className={`block text-sm font-medium ${textColor}`}>How did you hear about us?</label>
//               <select
//                 id="hereAbout"
//                 name="hereAbout"
//                 value={formData.hereAbout}
//                 onChange={handleChange}
//                 className={`mt-1 block w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
//               >
//                 <option value="">Select an option</option>
//                 {hereAboutOptions.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label htmlFor="street" className={`block text-sm font-medium ${textColor}`}>Street Address</label>
//               <input
//                 type="text"
//                 id="street"
//                 name="street"
//                 value={formData.street}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your street address"
//                 className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//               />
//             </div>

//             <div>
//               <label htmlFor="city" className={`block text-sm font-medium ${textColor}`}>City</label>
//               <input
//                 type="text"
//                 id="city"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your city"
//                 className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//               />
//             </div>

//             <div>
//               <label htmlFor="state" className={`block text-sm font-medium ${textColor}`}>State</label>
//               <input
//                 type="text"
//                 id="state"
//                 name="state"
//                 value={formData.state}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your state"
//                 className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//               />
//             </div>

//             <div>
//               <label htmlFor="zipCode" className={`block text-sm font-medium ${textColor}`}>Zip Code</label>
//               <input
//                 type="text"
//                 id="zipCode"
//                 name="zipCode"
//                 value={formData.zipCode}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your zip code"
//                 className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
//               />
//             </div>

//             <div>
//               <p className={`block text-sm font-medium ${textColor} mb-2`}>What services are you interested in?</p>
//               {services.map((service) => (
//                 <div key={service} className="flex items-center mb-2">
//                   <input
//                     type="checkbox"
//                     id={service}
//                     name="interestedServices"
//                     value={service}
//                     checked={formData.interestedServices.includes(service)}
//                     onChange={handleChange}
//                     className="mr-2"
//                   />
//                   <label htmlFor={service} className={`text-sm ${textColor}`}>{service}</label>
//                 </div>
//               ))}
//             </div>

//             <div>
//               <div className="flex items-center mb-2">
//                 <input
//                   type="checkbox"
//                   id="agreeTerms"
//                   name="agreeTerms"
//                   checked={formData.agreeTerms}
//                   onChange={handleChange}
//                   className="mr-2"
//                 />
//                 <label htmlFor="agreeTerms" className={`text-sm ${textColor}`}>
//                   I agree to the terms and conditions and consent that I am suitable for tanning services.
//                 </label>
//               </div>
//               <div className="flex items-center mb-2">
//                 <input
//                   type="checkbox"
//                   id="agreeDiscounts"
//                   name="agreeDiscounts"
//                   checked={formData.agreeDiscounts}
//                   onChange={handleChange}
//                   className="mr-2"
//                 />
//                 <label htmlFor="agreeDiscounts" className={`text-sm ${textColor}`}>
//                   I agree to receiving the latest discounts, deals and offers.
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="agreeSkinType"
//                   name="agreeSkinType"
//                   checked={formData.agreeSkinType}
//                   onChange={handleChange}
//                   className="mr-2"
//                 />
//                 <label htmlFor="agreeSkinType" className={`text-sm ${textColor}`}>
//                   I hereby certify that the skin type selected is accurate.
//                 </label>
//               </div>
//             </div>

//             <div className="mt-8">
//               <button
//                 type="submit"
//                 className={`w-full py-3 px-4 font-semibold rounded-md focus:outline-none focus:ring-2 transition-all ease-in-out duration-300 ${buttonBg} text-white`}
//                 disabled={loading}
//               >
//                 {loading ? "Registering..." : "Register"}
//               </button>
//             </div>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-sm">
//               Already have an account?{" "}
//               <Link href="/login" className={`text-blue-500 hover:text-blue-700 font-semibold ${textColor}`}>
//                 Login here
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useStore from "@/app/store/useStore";
import { FaCheck, FaTimes,FaTimes as FaClose,FaInfoCircle } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { useSession } from "next-auth/react";


export default function Register({isSendMail=false}) {
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
  const [showSkinTypeInfo, setShowSkinTypeInfo] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
  });
  const [notification, setNotification] = useState(null); // For showing error/success messages

  const { data: session, status } = useSession();
  const router = useRouter();
  const { user } = session || {};


  useEffect(() => {
    if(!isSendMail){
    if (status !== "loading" && user) {
      router.back();
    }
  }
  }, [router, status,user,isSendMail]);

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

      console.log(process.env.NEXT_PUBLIC_SERVICE_ID);
      if (data.success) {
        const { token} = data?.user || {};
if(!isSendMail){
        await emailjs.send(
          process.env.NEXT_PUBLIC_SERVICE_ID,
          process.env.NEXT_PUBLIC_REGISTER_TEMPLATE_ID,
          {
            to: formData.email,
            user_name: formData.name,
            verification_url:`${process.env.NEXT_PUBLIC_API_URL}/verify-email?token=${token}`,
            from_name:"Bronze & Beauty Studio"
          },
          {
            publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
          }
        )
        setNotification({ type: 'success', message: 'A email has been sent to your email, please verify your email. our emails sometimes can end up in Junk please also check there' });
        
      }else{
      setSuccessMessage("User registered successfully!");
      }
        // setTimeout(() => router.push("/login"), 2000);
      } else {
        setNotification({ type: 'error', message: data?.message });
        // setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.log("error",error)
      setError("Error registering user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const gradientClass = selectedMode === "dark" ? "bg-gradient-to-r from-gray-800 to-black" : "bg-gradient-to-r from-white to-gray-200";
  const textColor = selectedMode === "dark" ? "text-white" : "text-black";
  const inputBg = selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800";
  const buttonBg = selectedMode === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-black hover:bg-gray-300';
  const selectClass = selectedMode === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-400';
  const modalOverlay = selectedMode === "dark" ? "bg-black/70" : "bg-gray-600/70";
  const modalBg = selectedMode === "dark" ? "bg-gray-800" : "bg-white";

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
  const services = ["UV Tanning"];

  useEffect(() => {
    if (notification) {
        const timer = setTimeout(() => {
            setNotification(null); // Hide notification after 3 seconds
        }, 9000);
        return () => clearTimeout(timer);
    }
}, [notification]);

  return (
    <>
    {showSkinTypeInfo && (
        <div 
          className={`fixed inset-0 ${modalOverlay} z-50 flex items-center justify-center p-4`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSkinTypeInfo(false);
            }
          }}
        >
          <div className={`${modalBg} rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className={`text-lg font-semibold ${textColor}`}>SKIN TYPE INFORMATION</h3>
              <button
                onClick={() => setShowSkinTypeInfo(false)}
                className={`${textColor} hover:opacity-70`}
              >
                <FaClose size={24} />
              </button>
            </div>
            <div className={`p-6 ${textColor}`}>
              <p className="mb-4">Always proceed with caution when selecting your skin type.</p>

              <h4 className="font-bold mb-2">Sensitive:</h4>
              <p className="mb-4">Often light blue, grey or green eye colour. Red/strawberry blonde hair, very pale natural skin colour, have a lot of freckles or all over skin, hardly tan with UV exposure, cant stand sun exposure on face/sensitive, havent tanned in 2-3 months+</p>

              <h4 className="font-bold mb-2">Fair:</h4>
              <p className="mb-4">Often have blue, grey or dark green eyes, blonde/light natural hair colour, pale natural skin, more than a few freckles, tan slightly, slow developing tan, face can be sensitive to sun, last sunbed session was 1-2 months ago.</p>

              <h4 className="font-bold mb-2">Medium:</h4>
              <p className="mb-4">Often have Light brown/brown eye colour, Dark blonde/brown natural hair colour, medium natural skin colour, few freckles, tan reasonably well, quick developing tan, normal sensitivity to sun exposure on face, last sunbed session was 1-2 months ago.</p>

              <h4 className="font-bold mb-2">Dark:</h4>
              <p className="mb-4">Often have brown/dark brown eyes, dark brown/black natural hair, olive/black natural skin type, none to a couple of freckles, tan very easily/never burn, develop a tan instantly/rapidly, face rare/never reacts to sunshine, 1-30 days since last sunbathing session.</p>
            </div>
          </div>
        </div>
      )}
    <div className={`min-h-screen flex items-center justify-center py-12 px-6 ${gradientClass}`}>
      <br />
      <br />
      <br />
      <div className={`max-w-md w-full p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out ${selectedMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
        <h2 className="text-3xl font-semibold text-center mb-6 tracking-tight">Create an Account</h2>

        {notification && (
                    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg ${
                        notification.type === 'success' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gradient-to-b from-black to-gray-900 text-white'
                    }`}>
                        {notification.message}
                    </div>
                )}
        {/* {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 shadow-md">
            {successMessage}
          </div>
        )} */}

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
          <button
                type="button"
                onClick={() => setShowSkinTypeInfo(true)}
                className={`mt-2 flex items-center text-sm ${textColor} hover:opacity-70`}
              >
                <FaInfoCircle className="mr-2" />
                Click here for more information on skin types
              </button>

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
            <label htmlFor="city" className={`block text-sm font-medium ${textColor}`}>Town</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Enter your town"
              className={`w-full px-4 py-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} border-gray-300`}
            />
          </div>

          <div>
            <label htmlFor="state" className={`block text-sm font-medium ${textColor}`}>County</label>
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
            <label htmlFor="zipCode" className={`block text-sm font-medium ${textColor}`}>Postal Code</label>
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
    </>
  );
}