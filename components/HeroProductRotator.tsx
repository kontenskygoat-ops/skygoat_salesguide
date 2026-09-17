"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const products = [
  {
    name: "Original",
    image: "/products/original.webp",
    alt: "SKYGOAT Original",
  },
  {
    name: "Cokelat",
    image: "/products/cokelat.webp",
    alt: "SKYGOAT Cokelat",
  },
  {
    name: "Madu",
    image: "/products/madu.webp",
    alt: "SKYGOAT Madu",
  },
];

export default function HeroProductRotator() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % products.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, []);

  const active = products[activeIndex];

  return (
    <div className="heroProductRotator" aria-label="Varian produk SKYGOAT">
      <div className="heroProductViewport">
        <Image
          key={active.name}
          className="heroProductRotatorImage"
          src={active.image}
          alt={active.alt}
          width={900}
          height={900}
          sizes="(max-width: 720px) 82vw, 520px"
          priority
        />
      </div>

      <div className="heroProductMeta" aria-live="polite">
        <span>SKYGOAT</span>
        <strong>{active.name}</strong>
      </div>

      <div className="heroProductDots" aria-label="Pilih varian produk">
        {products.map((product, index) => (
          <button
            key={product.name}
            type="button"
            className={`heroProductDot ${index === activeIndex ? "active" : ""}`}
            aria-label={`Tampilkan SKYGOAT ${product.name}`}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
