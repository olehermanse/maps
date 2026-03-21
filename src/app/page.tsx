"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type PhotoMarker = { imgs: string[]; x: number; y: number; size: number; depth: number; label: string };
type LabelMarker = { x: number; y: number; label: string };

const photoMarkers: PhotoMarker[] = [
  { imgs: ["lektern-north.jpg"], x: 23, y: 76, size: 8, depth: 17, label: "Lektern N" },
  { imgs: ["ring.jpg", "ring-1.jpg", "ring-2.jpg", "ring-3.jpg", "ring-4.jpg"], x: 6, y: 50, size: 8, depth: 12, label: "Ringen" },
  { imgs: ["old-platform-1.jpg", "old-platform-2.jpg", "old-platform-3.jpg", "old-platform-4.jpg"], x: 17, y: 45, size: 8, depth: 11, label: "Gamleplatta" },
  { imgs: ["platform-2.jpg", "platform-1.jpg", "platform-3.jpg", "platform-4.jpg", "platform-5.jpg"], x: 6, y: 30, size: 8, depth: 7, label: "Plattingen" },
  { imgs: ["sword.jpg"], x: 30, y: 55, size: 8, depth: 12, label: "Sverdanker" },
  { imgs: ["lektern-east-1.jpg", "lektern-east-2.jpg", "lektern-east-3.jpg"], x: 46, y: 60, size: 8, depth: 12, label: "Lektern Ø" },
  { imgs: ["rocks-1.jpg", "rocks-2.jpg", "rocks-3.jpg"], x: 38, y: 36, size: 8, depth: 7, label: "Steinrøys" },
  { imgs: ["tube-1.jpg", "tube-2.jpg"], x: 54, y: 42, size: 8, depth: 9, label: "Rør" },
  { imgs: ["tubes-4.jpg", "tubes-1.jpg", "tubes-2.jpg", "tubes-3.jpg", "tubes-5.jpg", "tubes-6.jpg"], x: 74, y: 44, size: 8, depth: 8, label: "2 rør" },
  { imgs: ["end-of-line.jpg", "pillar.jpg"], x: 81, y: 58, size: 8, depth: 10, label: "Line" },
  { imgs: ["front.jpg", "under.jpg", "tire.jpg"], x: 54, y: 88, size: 8, depth: 19, label: "Nedafor" },
  { imgs: ["hole.jpg", "corner.jpg"], x: 64, y: 72, size: 8, depth: 16, label: "Høl" },
];

const labelMarkers: LabelMarker[] = [
  { x: 90, y: 1.5, label: "Prodykk ^" },
  { x: 22, y: 22, label: "Skolebrygga" },
];

export default function Home() {
  const [fullscreen, setFullscreen] = useState<PhotoMarker | null>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const lastTouchDist = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);
  const isPinching = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const clampPan = (p: { x: number; y: number }, z: number) => {
      const map = mapRef.current;
      if (!map || !el) return p;
      const mw = map.offsetWidth * z;
      const mh = map.offsetHeight * z;
      const maxX = Math.max((mw - el.offsetWidth) / 2, 0);
      const maxY = Math.max((mh - el.offsetHeight) / 2, 0);
      return {
        x: Math.min(Math.max(p.x, -maxX), maxX),
        y: Math.min(Math.max(p.y, -maxY), maxY),
      };
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cursorX = e.clientX - rect.left - rect.width / 2;
      const cursorY = e.clientY - rect.top - rect.height / 2;
      const z = zoomRef.current;
      const p = panRef.current;
      const next = Math.min(Math.max(z - e.deltaY * 0.001, 1), 5);
      const scale = next / z;
      const newPan = clampPan({
        x: cursorX - scale * (cursorX - p.x),
        y: cursorY - scale * (cursorY - p.y),
      }, next);
      zoomRef.current = next;
      panRef.current = newPan;
      setZoom(next);
      setPan(newPan);
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        isPinching.current = true;
        isDragging.current = false;
        const dx = e.touches[1].clientX - e.touches[0].clientX;
        const dy = e.touches[1].clientY - e.touches[0].clientY;
        lastTouchDist.current = Math.hypot(dx, dy);
        lastTouchCenter.current = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && lastTouchDist.current !== null && lastTouchCenter.current !== null) {
        e.preventDefault();
        const dx = e.touches[1].clientX - e.touches[0].clientX;
        const dy = e.touches[1].clientY - e.touches[0].clientY;
        const dist = Math.hypot(dx, dy);
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const rect = el.getBoundingClientRect();
        const cx = centerX - rect.left - rect.width / 2;
        const cy = centerY - rect.top - rect.height / 2;
        const z = zoomRef.current;
        const p = panRef.current;
        const next = Math.min(Math.max(z * (dist / lastTouchDist.current), 1), 5);
        const scale = next / z;
        const panDx = centerX - lastTouchCenter.current.x;
        const panDy = centerY - lastTouchCenter.current.y;
        const newPan = clampPan({
          x: cx - scale * (cx - p.x) + panDx,
          y: cy - scale * (cy - p.y) + panDy,
        }, next);
        zoomRef.current = next;
        panRef.current = newPan;
        setZoom(next);
        setPan(newPan);
        lastTouchDist.current = dist;
        lastTouchCenter.current = { x: centerX, y: centerY };
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        isPinching.current = false;
      }
      lastTouchDist.current = null;
      lastTouchCenter.current = null;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0 || isPinching.current) return;
    isDragging.current = true;
    hasDragged.current = false;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || isPinching.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasDragged.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    const p = panRef.current;
    const map = mapRef.current;
    const container = containerRef.current;
    const z = zoomRef.current;
    let newPan = { x: p.x + dx, y: p.y + dy };
    if (map && container) {
      const mw = map.offsetWidth * z;
      const mh = map.offsetHeight * z;
      const maxX = Math.max((mw - container.offsetWidth) / 2, 0);
      const maxY = Math.max((mh - container.offsetHeight) / 2, 0);
      newPan = {
        x: Math.min(Math.max(newPan.x, -maxX), maxX),
        y: Math.min(Math.max(newPan.y, -maxY), maxY),
      };
    }
    panRef.current = newPan;
    setPan(newPan);
  }, [zoom]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-dvh w-dvw overflow-hidden select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDragStart={(e) => e.preventDefault()}
    >
      <div
        ref={mapRef}
        className="relative"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lektern-bg.png"
          alt=""
          className="block max-w-full max-h-dvh h-auto w-auto"
        />
        {photoMarkers.map((marker, i) => (
          <button
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
              width: `${marker.size}%`,
            }}
            onClick={() => { if (!hasDragged.current) { setImgIndex(0); setFullscreen(marker); } }}
          >
            <div className="relative transition-transform duration-300 ease-in-out group-hover:scale-150 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/thumbnails/${marker.imgs[0]}`}
                alt=""
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
        {labelMarkers.map((marker, i) => (
          <div
            key={`label-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
              fontSize: "1.2vw",
            }}
          >
            {marker.label}
          </div>
        ))}
      </div>
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setFullscreen(null)}
        >
          <div
            className={`relative ${imgIndex < fullscreen.imgs.length - 1 ? "cursor-pointer" : "cursor-default"}`}
            onClick={(e) => {
              e.stopPropagation();
              if (imgIndex < fullscreen.imgs.length - 1) {
                setImgIndex((i) => i + 1);
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/photos/${fullscreen.imgs[imgIndex]}`}
              alt=""
              className="max-w-full max-h-dvh object-contain"
            />
            <button
              className="absolute top-2 right-2 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 text-white text-3xl font-bold cursor-pointer hover:bg-black/80"
              onClick={(e) => { e.stopPropagation(); setFullscreen(null); }}
            >
              &times;
            </button>
            {imgIndex > 0 && (
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 text-white text-3xl font-bold cursor-pointer hover:bg-black/80"
                onClick={(e) => { e.stopPropagation(); setImgIndex((i) => i - 1); }}
              >
                &lsaquo;
              </button>
            )}
            {imgIndex < fullscreen.imgs.length - 1 && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 text-white text-3xl font-bold cursor-pointer hover:bg-black/80"
                onClick={(e) => { e.stopPropagation(); setImgIndex((i) => i + 1); }}
              >
                &rsaquo;
              </button>
            )}
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-2xl font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] whitespace-nowrap">
            {fullscreen.label} &middot; {fullscreen.depth}m &middot; {fullscreen.imgs[imgIndex]}
            {fullscreen.imgs.length > 1 && ` (${imgIndex + 1}/${fullscreen.imgs.length})`}
          </div>
        </div>
      )}
    </div>
  );
}
