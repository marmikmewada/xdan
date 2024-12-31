"use client";
import { useState, useEffect } from 'react';
import useStore from '@/app/store/useStore';
import { motion } from 'framer-motion';
import Image from 'next/image'; // Import the Image component from Next.js

export default function SunbedsPage() {
  const { selectedMode } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const bgColor = selectedMode === 'dark' ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-gradient-to-b from-white to-gray-100';
  const textColor = selectedMode === 'dark' ? 'text-white' : 'text-gray-900';
  const sectionBg = selectedMode === 'dark' ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-gradient-to-b from-white to-gray-100';
  const borderColor = selectedMode === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const sunbeds = [
    {
        title: 'Ergoline Essence 440 Vibra',
        imageUrl: 'https://ik.imagekit.io/syziko5ml/banners/photo_5983316844569805744_y%20(1).jpg?updatedAt=1735643527351', // Add your image URL here
        description:
          'The Ergoline Essence 440 Vibra offers efficient Smart Power technology, particularly low space requirements, and great value for money. It provides an excellent tanning experience with 200W of power, while also including the Vibra Shape plate that helps improve fitness and even tanning.',
        features: [
          'Smart Power: Efficient technology with low energy consumption.',
          '200W Tanning Performance: Perfect tan in just 15 minutes without white spots.',
          'Vibra Shape Plate: Combines tanning with vibration therapy to help tone muscles, improve circulation, and reduce cellulite.',
          'Improved Fitness: Vibra Shape technology can help with weight loss and toning.',
          'Even Tan: Helps reach hard-to-tan areas like shoulders and back with the Vibra technology.',
        ],
      },
      
    {
      title: 'Ergoline 800 Excellence White Pearl Version',
      imageUrl: 'https://ik.imagekit.io/syziko5ml/banners/photo_5983316844569805746_y%20(1).jpg?updatedAt=1735643527281', // Add your image URL here
      description:
        'The Ergoline 800 Excellence White Pearl version features LED motion color and spacious tanning space. With 51 UV lamps and 4 520W facial tanners, this sunbed sets new standards for tanning with its advanced features.',
      features: [
        'LED Motion Color: Creates dynamic lighting effects during the tanning session.',
        '51 UV lamps for the body, each with 160W.',
        '4 520W facial tanners.',
        'Balanced Tanning: Progressive Balanced Tanning Technology for even UV distribution.',
        'Aroma: Fragrance concentrates can be sprayed for a pleasant tanning experience.',
        'Aqua Fresh: Refreshing water mist from 2 nozzles to revitalize during the session.',
        'Climatronic: Maintain a constant preferred temperature with cooling airflow.',
      ],
    },
    {
      title: 'Megasun 2000 (Coming Soon)',
      imageUrl: 'https://ik.imagekit.io/syziko5ml/banners/photo_5983316844569805749_y%20(1).jpg?updatedAt=1735643527317', // Add your image URL here
      description:
        'The Megasun 2000 combines elegant design with high-quality materials and intensive lighting. Its features offer an immersive experience with options like 3D sound and voice guidance.',
      features: [
        'Elegant and high-quality materials with intensive lighting.',
        '3D Sound: Enhanced audio experience with a 3D sound system.',
        'Ventilation: Efficient sunbed ventilation system.',
        'Aroma: Relaxing scents during the tanning session.',
        'Aqua Fresh: Cooling mist to soothe and enhance the tanning experience.',
        'Voice Guide: Friendly voice guides you through the tanning session (can be turned off).',
        'Bluetooth: Play your music via Bluetooth from your smartphone.',
        'Mirror Floor: UV rays reflect off the mirror for a deeper tan.',
        'Vibra Floor: Stimulates blood flow and helps in toning and achieving a better tan.',
        'MP3 Sound System: Play your favorite music while tanning.',
      ],
    },
    {
      title: 'Megasun P9S (Coming Soon)',
      imageUrl: 'https://ik.imagekit.io/syziko5ml/banners/photo_5983316844569805752_y%20(1).jpg?updatedAt=1735643527287', // Add your image URL here
      description:
        'The Megasun P9S, developed in collaboration with Studio F. A. Porsche, introduces a new era of tanning technology. Featuring a SunSphere LED system and Blue UVA LEDs for optimal pigmentation.',
      features: [
        'SunSphere LED System: Avoids unwanted infra-red radiation for better tanning.',
        'Blue UVA LEDs: For excellent pigmentation and visible tan.',
        'Red Beauty LEDs: Skin care while tanning.',
        'Yellow UVB Special Lamps: Build pigments and vitamin D.',
        'MegaVoice: Voice guidance throughout the session.',
        'Wireless Charging: Charge compatible smartphones during tanning.',
        'Bluetooth: Connect your smartphone to play music.',
        'Sound System: High-quality sound system for music.',
        'AirCondition: Cooling system for a comfortable tanning experience.',
        'AquaCool: Drip-free, refreshing water mist.',
        'Aroma: Optional fragrance during tanning.',
        'SunSphere (Facials, Shoulders, Legs): Specialized LEDs for each area to achieve an even tan.',
        'BeautyBooster HyperRed: Intensive beauty light for smooth skin.',
        'Matrix Lightshow: Light animations with over 2,400 special LEDs.',
        'Video Player: Play videos during the session.',
        'Intelligent Control System: Easy control of features and service settings.',
        'Easy Control: Intuitive operation of tanning functions.',
      ],
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen py-16 ${bgColor} ${textColor}`}>
      <br />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Sunbeds</h1>
        <div className="space-y-6">
          {sunbeds.map((sunbed, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`border ${borderColor} rounded-lg overflow-hidden`}
            >
              <div className={`p-6 ${sectionBg}`}>
                {/* Display Sunbed Image */}
                <div className="mb-6">
                  <Image
                    src={sunbed.imageUrl} // Image URL
                    alt={sunbed.title} // Alt text for accessibility
                    width={800} // Adjust width as needed
                    height={450} // Adjust height as needed
                    className="rounded-lg shadow-lg" // Style for the image
                  />
                </div>

                {/* Display Sunbed Title and Description */}
                <h3 className="text-2xl font-semibold mb-4">{sunbed.title}</h3>
                <p className="mb-4 text-sm sm:text-base">{sunbed.description}</p>

                {/* Display Features List */}
                <ul className="space-y-2 text-sm sm:text-base">
                  {sunbed.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className="mr-2 text-lg">•</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
