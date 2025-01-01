'use client';

import useStore from "@/app/store/useStore";

export default function AboutPage() {
  const { selectedMode } = useStore(); // Get selected mode (light or dark)

  // Define colors based on the selected mode
  const bgColor =
    selectedMode === "dark"
      ? "bg-gradient-to-b from-black to-gray-900"
      : "bg-gradient-to-b from-white to-gray-100";

  const textColor = selectedMode === "dark" ? "text-white" : "text-black";
  const buttonBgColor = selectedMode === "dark" ? "bg-gradient-to-b from-black to-gray-900" : "bg-black";
  const buttonTextColor = selectedMode === "dark" ? "text-white" : "text-white";
  const buttonHoverBgColor =
    selectedMode === "dark" ? "hover:bg-gray-200" : "hover:bg-gray-800";

  // Gradient for the About section background
  const sectionBgColor =
    selectedMode === "dark"
      ? "bg-gradient-to-b from-black to-gray-800"
      : "bg-gradient-to-b from-white to-gray-200";

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
      <br />
      <br />
      <div className="container mx-auto px-4 py-8">
        {/* About Section */}
        <div className={`p-8 shadow-lg ${sectionBgColor} rounded-lg mb-8`}>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">About Bronze & Beauty Studio</h2>
          <p className="mb-4 text-base md:text-lg">
            Bronze & Beauty Studio is a professional tanning shop located in the heart of Hednesford High Street, Staffordshire. Our goal is to help customers achieve a healthy, responsible tan in our immaculate and friendly shop. Bronze & Beauty Studio promotes responsible tanning and are proud members of The Sunbed Association, our staff are trained to provide educated recommendations for the best tanning results.
          </p>
          <p className="mb-4 text-base md:text-lg">
            Our sun beds are maintained to the highest standards, checked and sanitised after every use. Each tanning room comes with a fresh towel, goggles for UV protection on the eyes, body wipes, and headbands. We pride ourselves on customer satisfaction and customer service.
          </p>
          <p className="mb-4 text-base md:text-lg">
            When you make your booking, please note that there must be 24 – 48 hours between sessions, depending on your skin type.
          </p>
          <p className="mb-4 text-base md:text-lg">
            If you have any inquiries about any of our products or services, you can drop in or email us at{" "}
            <a href="mailto:admin@bronzebeautystudio.co.uk" className="text-blue-500 hover:underline">admin@bronzebeautystudio.co.uk</a>.
          </p>
          <img
            src={selectedMode === 'dark' ? 'https://ik.imagekit.io/syziko5ml/banners/6.png?updatedAt=1734539275694' : 'https://ik.imagekit.io/syziko5ml/banners/5.png?updatedAt=1734539275697'}
            alt="Bronze & Beauty Studio"
            className="w-full h-64 md:h-80 object-cover rounded-lg"
          />
        </div>

        {/* Contact Section */}
        <div className={`text-center ${textColor}`}>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4 text-base md:text-lg">For any Enquires or more information, feel free to contact us via email or visit us in person.</p>
          <a
            href="mailto:admin@bronzebeautystudio.co.uk"
            className={`inline-block px-6 py-2 rounded ${buttonBgColor} ${buttonTextColor} ${buttonHoverBgColor} transition duration-300`}
          >
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
}
