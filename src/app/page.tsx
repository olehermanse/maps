"use client";

import Image from "next/image";
import { useState } from "react";

const markers = [
  { src: "/photos/lektern-north.jpg", x: 23, y: 76, size: 8, depth: 17, label: "Lektern N" },
  { src: "/photos/ring.jpg", x: 6, y: 50, size: 8, depth: 12, label: "Ringen" },
  { src: "/photos/old-platform-1.jpg", x: 17, y: 45, size: 8, depth: 11, label: "Gamleplatta" },
  { src: "/photos/platform-2.jpg", x: 6, y: 30, size: 8, depth: 7, label: "Plattingen" },
  { src: "/photos/sword.jpg", x: 30, y: 55, size: 8, depth: 12, label: "Sverdanker" },
  { src: "/photos/lektern-east-1.jpg", x: 46, y: 60, size: 8, depth: 12, label: "Lektern Ø" },
  { src: "/photos/rocks-1.jpg", x: 38, y: 36, size: 8, depth: 7, label: "Steinrøys" },
  { src: "/photos/tube-1.jpg", x: 54, y: 42, size: 8, depth: 9, label: "Rør" },
  { src: "/photos/tubes-4.jpg", x: 74, y: 44, size: 8, depth: 8, label: "2 rør" },
  { src: "/photos/end-of-line.jpg", x: 81, y: 58, size: 8, depth: 10, label: "Line" },
  { src: "/photos/front.jpg", x: 54, y: 88, size: 8, depth: 19, label: "Nedafor" },
  { src: "/photos/hole.jpg", x: 64, y: 72, size: 8, depth: 16, label: "Høl" },
];

export default function Home() {
  const [fullscreen, setFullscreen] = useState<typeof markers[number] | null>(null);

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
            onClick={() => setFullscreen(marker)}
          >
            <div className="relative transition-transform duration-300 ease-in-out group-hover:scale-150 rounded-lg overflow-hidden">
              <Image
                src={marker.src}
                alt=""
                width={1000}
                height={1000}
                className="block w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 rounded-lg pointer-events-none" style={{ boxShadow: "inset 0 0 0 0.15vw black" }} />
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] whitespace-nowrap" style={{ fontSize: "1vw" }}>
                {marker.label}
              </span>
              <span className="absolute bottom-1 right-2 text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" style={{ fontSize: "1vw" }}>
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
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fullscreen.src}
              alt=""
              className="max-w-full max-h-dvh object-contain"
            />
            <button
              className="absolute top-2 right-2 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 text-white text-3xl font-bold cursor-pointer hover:bg-black/80"
              onClick={() => setFullscreen(null)}
            >
              &times;
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-2xl font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] whitespace-nowrap">
            {fullscreen.label} &middot; {fullscreen.depth}m &middot; {fullscreen.src.split("/").pop()}
          </div>
        </div>
      )}
    </div>
  );
}
