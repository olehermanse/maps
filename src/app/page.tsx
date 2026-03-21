"use client";

import Image from "next/image";
import { useState } from "react";

const markers = [
  { src: "/photos/lektern-north.jpg", x: 23, y: 76, size: 8, depth: 17 },
  { src: "/photos/ring.jpg", x: 6, y: 50, size: 8, depth: 12 },
  { src: "/photos/old-platform-1.jpg", x: 17, y: 45, size: 8, depth: 11 },
  { src: "/photos/platform-2.jpg", x: 6, y: 30, size: 8, depth: 7 },
  { src: "/photos/sword.jpg", x: 30, y: 55, size: 8, depth: 12 },
  { src: "/photos/lektern-east-1.jpg", x: 46, y: 60, size: 8, depth: 12 },
  { src: "/photos/rocks-1.jpg", x: 38, y: 36, size: 8, depth: 7 },
  { src: "/photos/tube-1.jpg", x: 54, y: 42, size: 8, depth: 9 },
  { src: "/photos/tubes-4.jpg", x: 74, y: 44, size: 8, depth: 8 },
  { src: "/photos/end-of-line.jpg", x: 81, y: 58, size: 8, depth: 10 },
  { src: "/photos/front.jpg", x: 54, y: 88, size: 8, depth: 19 },
  { src: "/photos/hole.jpg", x: 64, y: 72, size: 8, depth: 16 },
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
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
              width: `${marker.size}%`,
            }}
            onClick={() => setFullscreen(marker.src)}
          >
            <div className="relative transition-transform duration-300 ease-in-out group-hover:scale-150">
              <Image
                src={marker.src}
                alt=""
                width={1000}
                height={1000}
                className="w-full aspect-square object-cover rounded-lg border-2 border-black"
              />
              <span className="absolute bottom-1 right-2 text-white text-xs font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {marker.depth}m
              </span>
            </div>
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
