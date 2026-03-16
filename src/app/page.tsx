"use client";

import Image from "next/image";
import { useState } from "react";

const markers = [
  { src: "/lektern-north.png", x: 23, y: 76, size: 12 },
];

export default function Home() {
  const [fullscreen, setFullscreen] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-center h-dvh w-dvw">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lektern-bg.png"
          alt=""
          className="block max-w-full max-h-dvh h-auto w-auto"
        />
        {markers.map((marker, i) => (
          <button
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
              width: `${marker.size}%`,
            }}
            onClick={() => setFullscreen(marker.src)}
          >
            <Image
              src={marker.src}
              alt=""
              width={1000}
              height={1000}
              className="w-full h-auto border-2 border-black transition-transform duration-300 ease-in-out hover:scale-150"
            />
          </button>
        ))}
      </div>
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-pointer"
          onClick={() => setFullscreen(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fullscreen}
            alt=""
            className="max-w-full max-h-dvh object-contain"
          />
        </div>
      )}
    </div>
  );
}
