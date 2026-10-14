"use client";

import { useEffect, useState } from "react";


/**
 * Shows one image exactly like a normal <img>.
 * With several images (added in 内容管理) they cross-fade automatically,
 * keeping the same size and layout as the first image.
 */
export default function ImageCarousel({
  images,
  alt,
  className,
  interval = 5000,
}: {
  images: string[];
  alt: string;
  className?: string;
  interval?: number;
}) {

  const [active, setActive] = useState(0);
  const count = images.length;

  useEffect(() => {
    if (count < 2) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % count), interval);
    return () => clearInterval(timer);
  }, [count, interval]);

  if (count === 0) return null;

  if (count === 1) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={images[0]} alt={alt} className={className} />;
  }

  const current = active % count;

  return (
    <div className="relative h-full w-full">

      {images.map((src, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${src}-${index}`}
          src={src}
          alt={alt}
          aria-hidden={index !== current}
          className={`${className ?? ""} ${index === 0 ? "relative" : "absolute inset-0"} transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {images.map((src, index) => (
          <button
            key={`dot-${src}-${index}`}
            type="button"
            aria-label={`${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-2 rounded-full transition-all ${
              index === current ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

    </div>
  );

}
