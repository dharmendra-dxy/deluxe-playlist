"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 5 * 60 + 4; // 5:04 in seconds

function formatSeconds(total: number) {
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function Player() {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(5);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => (prev >= DURATION ? DURATION : prev + 1));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  const progress = Math.min(100, (elapsed / DURATION) * 100);

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-4 md:px-8 md:pb-8">
      <div className="flex w-full max-w-md items-center gap-3 rounded-[28px] bg-gradient-to-r from-[#4a2f28]/90 to-[#7a4a3a]/80 p-2.5 pr-4 shadow-lg backdrop-blur-md md:max-w-2xl md:gap-4 md:rounded-full md:p-3 md:pr-6">
        {/* Album art */}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-rose-300 via-amber-200 to-emerald-200 md:h-16 md:w-16 md:rounded-full">
          <img
            src="/album/cover.jpg"
            alt="Album cover"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {/* Title / artist / progress */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white md:text-base">
            Mujhse Mohabbat Ka Izhaar Karta
          </p>
          <p className="truncate text-xs text-white/70 md:text-sm">Satrang Music Official</p>

          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white/90 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="mt-1 text-[10px] tabular-nums text-white/60 md:text-xs">
            {formatSeconds(elapsed)} / {formatSeconds(DURATION)}
          </p>
        </div>

        {/* Controls */}
        <div className="flex shrink-0 items-center gap-1.5 md:gap-3">
          <button
            aria-label="Previous track"
            className="flex h-8 w-8 items-center justify-center text-white/80 transition hover:text-white"
            onClick={() => setElapsed(0)}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M6 6h2v12H6zM20 6v12l-8.5-6z" />
            </svg>
          </button>

          <button
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => setPlaying((p) => !p)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4a2f28] shadow transition hover:scale-105 md:h-11 md:w-11"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            aria-label="Next track"
            className="flex h-8 w-8 items-center justify-center text-white/80 transition hover:text-white"
            onClick={() => setElapsed(DURATION)}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M16 6h2v12h-2zM4 6v12l8.5-6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}