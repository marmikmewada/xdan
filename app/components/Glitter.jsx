"use client"
import React, { useEffect, useState } from 'react';

const Glitter = () => {
  const [glitters, setGlitters] = useState([]);

  useEffect(() => {
    const newGlitters = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 1}px`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    setGlitters(newGlitters);
  }, []);

  return (
    <div className="relative overflow-hidden" style={{ background: 'linear-gradient(to right, #f36e7a, #f9c04a)' }}>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg shadow-lg p-6" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-2 drop-shadow-md">
              Special Offer
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white text-center drop-shadow-md">
              Look Out For Local Leaflets Being Delivered For An Extra 10% Off Courses & Lotions!
            </p>
          </div>
        </div>
      </div>
      {glitters.map((glitter) => (
        <div
          key={glitter.id}
          className="absolute rounded-full bg-white"
          style={{
            top: glitter.top,
            left: glitter.left,
            width: glitter.size,
            height: glitter.size,
            animation: `twinkle ${glitter.animationDuration} ease-in-out infinite`,
            animationDelay: glitter.animationDelay,
          }}
        ></div>
      ))}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .8;
          }
        }
        @keyframes twinkle {
          0%, 100% {
            opacity: 0;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default Glitter;

