'use client';

import { useEffect } from 'react';

export default function ScrollHandler() {
  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    const glitter = document.getElementById('glitter-component');

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      if (currentScrollY > lastScrollY) {
        glitter.style.transform = 'translateY(-100%)';
      } else {
        glitter.style.transform = 'translateY(0)';
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
}

