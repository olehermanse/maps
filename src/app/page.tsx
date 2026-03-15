import Image from "next/image";

const markers = [
  { src: "/lektern-north.png", x: 23, y: 76, size: 12 },
];

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lektern-bg.png"
          alt=""
          className="block max-w-full max-h-screen h-auto w-auto"
        />
        {markers.map((marker, i) => (
          <a
            key={i}
            href={marker.src}
            target="_blank"
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
              width: `${marker.size}%`,
            }}
          >
            <Image
              src={marker.src}
              alt=""
              width={1000}
              height={1000}
              className="w-full h-auto border-2 border-black transition-transform duration-300 ease-in-out hover:scale-150"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
