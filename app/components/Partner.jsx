"use client"
import React, { useEffect, useState } from 'react';
import  useStore  from '@/app/store/useStore';

const partners = [
  { name: 'Partner 1', lightModeImage: 'https://ik.imagekit.io/syziko5ml/banners/3%20(1).png?updatedAt=1735064048038', darkModeImage: 'https://ik.imagekit.io/syziko5ml/banners/4%20(1).png?updatedAt=1735064047380' },
  { name: 'Partner 2', lightModeImage: 'https://ik.imagekit.io/syziko5ml/banners/7.png?updatedAt=1735064047401', darkModeImage: 'https://ik.imagekit.io/syziko5ml/banners/8.png?updatedAt=1735064045243' },
  { name: 'Partner 3', lightModeImage: 'https://ik.imagekit.io/syziko5ml/banners/9.png?updatedAt=1735064046949', darkModeImage: 'https://ik.imagekit.io/syziko5ml/banners/10.png?updatedAt=1735064041965' },
  { name: 'Partner 4', lightModeImage: 'https://ik.imagekit.io/syziko5ml/banners/5%20(1).png?updatedAt=1735064045087', darkModeImage: 'https://ik.imagekit.io/syziko5ml/banners/6%20(1).png?updatedAt=1735064044187' },
  { name: 'Partner 5', lightModeImage: 'https://ik.imagekit.io/syziko5ml/banners/11.png?updatedAt=1735064042274', darkModeImage: 'https://ik.imagekit.io/syziko5ml/banners/12.png?updatedAt=1735064041804' },
  { name: 'Partner 6', lightModeImage: 'https://ik.imagekit.io/syziko5ml/banners/13.png?updatedAt=1735064040336', darkModeImage: 'https://ik.imagekit.io/syziko5ml/banners/14%20(1).png?updatedAt=1735064039874' },
  { name: 'Partner 7', lightModeImage: 'https://ik.imagekit.io/syziko5ml/banners/15.png?updatedAt=1735064039393', darkModeImage: 'https://ik.imagekit.io/syziko5ml/banners/16.png?updatedAt=1735064039121' },
  { name: 'Partner 8', lightModeImage: 'https://ik.imagekit.io/syziko5ml/banners/25.png?updatedAt=1735064039001', darkModeImage: 'https://ik.imagekit.io/syziko5ml/banners/26.png?updatedAt=1735064038815' },
  { name: 'Partner 9', lightModeImage: 'https://ik.imagekit.io/syziko5ml/banners/17%20(1).png?updatedAt=1735064038850', darkModeImage: 'https://ik.imagekit.io/syziko5ml/banners/18%20(1).png?updatedAt=1735064037058' },
  { name: 'Partner 10', lightModeImage: 'https://ik.imagekit.io/syziko5ml/banners/19.png?updatedAt=1735064038752', darkModeImage: 'https://ik.imagekit.io/syziko5ml/banners/20.png?updatedAt=1735064037194' },
  { name: 'Partner 11', lightModeImage: 'https://ik.imagekit.io/syziko5ml/banners/21.png?updatedAt=1735064037738', darkModeImage: 'https://ik.imagekit.io/syziko5ml/banners/22.png?updatedAt=1735064037049' },
  { name: 'Partner 12', lightModeImage: 'https://ik.imagekit.io/syziko5ml/banners/23.png?updatedAt=1735064036782', darkModeImage: 'https://ik.imagekit.io/syziko5ml/banners/24.png?updatedAt=1735064035781' },
];

const PartnersCarousel = () => {
  const [currentPartners, setCurrentPartners] = useState([0, 1, 2]); // Indices of partners to show
  const [counter, setCounter] = useState(0);
    const {selectedMode} = useStore();
  const textColor = selectedMode === "dark" ? "text-white" : "text-black";
  const bgColor =
  selectedMode === "dark"
    ? "bg-gradient-to-b from-black to-gray-900"
    : "bg-gradient-to-b from-white to-gray-100";

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev + 1) % partners.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const nextPartners = [
      (counter + 0) % partners.length,
      (counter + 1) % partners.length,
      (counter + 2) % partners.length,
    ];
    setCurrentPartners(nextPartners);
  }, [counter]);

  return (
    <div className={`py-16 ${bgColor} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
         <h2 className={`text-3xl font-bold mb-4 ${textColor}`}>Our Partners</h2>
         <div className="flex space-x-4">
        
      {currentPartners.map((partnerIndex, i) => {
        const partner = partners[partnerIndex];
        const imageSrc = selectedMode === 'dark' ? partner.darkModeImage : partner.lightModeImage;

        return (
          <div key={i} className="w-1/3 p-2 transition-all duration-700 ease-in-out transform hover:scale-105">
           
            <div className="relative">
              <img 
                src={imageSrc} 
                alt={partner.name} 
                className="w-full h-full object-cover rounded-lg shadow-lg transition-opacity duration-1000 opacity-80 hover:opacity-100" 
              />
              {/* <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold">
                {partner.name}
              </div> */}
            </div>
          </div>
        );
      })}
    </div>
    </div>
    
   
  );
};

export default PartnersCarousel;
