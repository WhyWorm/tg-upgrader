import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';

export default function LottiePlayer({
  src,
  fallbackImage,
  className = "w-full h-full",
  autoplay = true,
  loop = true,
  speed = 1.0
}) {
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !src) return;

    let isMounted = true;
    setLoadError(false);

    if (animRef.current) {
      animRef.current.destroy();
      animRef.current = null;
    }

    // Resolve relative URL properly for Vite base path
    let url = src;
    if (!url.startsWith('http') && !url.startsWith('data:')) {
      const base = import.meta.env.BASE_URL || './';
      const cleanBase = base.endsWith('/') ? base : base + '/';
      const cleanSrc = src.replace(/^\.?\//, '');
      url = cleanBase + cleanSrc;
    }

    try {
      // Use canvas renderer for 10x higher performance and 0 DOM node thrashing
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'canvas',
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
          clearCanvas: true
        },
        loop: loop,
        autoplay: autoplay,
        path: url,
      });

      animRef.current.setSpeed(speed);

      animRef.current.addEventListener('DOMLoaded', () => {
        if (isMounted) setLoadError(false);
      });

      animRef.current.addEventListener('data_failed', () => {
        if (isMounted) setLoadError(true);
      });

      animRef.current.addEventListener('error', () => {
        if (isMounted) setLoadError(true);
      });
    } catch (e) {
      if (isMounted) setLoadError(true);
    }

    return () => {
      isMounted = false;
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [src, loop, autoplay, speed]);

  if (loadError || !src) {
    return (
      <img
        src={fallbackImage}
        alt=""
        loading="lazy"
        className={`${className} object-contain`}
      />
    );
  }

  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <div 
        ref={containerRef} 
        className="w-full h-full flex items-center justify-center [&>canvas]:w-full [&>canvas]:h-full [&>canvas]:max-h-full [&>canvas]:object-contain" 
      />
    </div>
  );
}
