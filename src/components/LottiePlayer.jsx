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

    // Destroy existing animation
    if (animRef.current) {
      animRef.current.destroy();
      animRef.current = null;
    }

    try {
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: loop,
        autoplay: autoplay,
        path: src,
      });

      animRef.current.setSpeed(speed);

      animRef.current.addEventListener('data_failed', () => {
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
        className={`${className} object-contain`}
      />
    );
  }

  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
