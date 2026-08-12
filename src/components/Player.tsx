"use client";

import { useRef, useCallback } from "react";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";

const PLAYER_ELEMENT_ID = "youtube-player";

function formatSeconds(total: number) {
  if (!Number.isFinite(total) || total <= 0) return "0:00";
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function Player() {
  const {
    isPlaying,
    currentTime,
    duration,
    currentTrack,
    isReady,
    togglePlay,
    next,
    previous,
    seek,
  } = useYouTubePlayer(PLAYER_ELEMENT_ID);

  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = progressBarRef.current;
      if (!bar || !duration) return;
      const rect = bar.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seek(duration * pct);
    },
    [duration, seek]
  );

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <>
      <div
        id={PLAYER_ELEMENT_ID}
        className="pointer-events-none absolute left-0 top-0 h-[200px] w-[200px] opacity-0"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-4 md:px-8 md:pb-8">
        <div className="flex w-full max-w-md items-center gap-3 rounded-[28px] border border-white/20 bg-white/10 p-2.5 pr-4 shadow-xl backdrop-blur-sm backdrop-saturate-150 transition-all duration-500 md:max-w-2xl md:gap-4 md:rounded-full md:p-3 md:pr-6">
          {/* Album art */}
          <div
            className={[
              "relative h-14 w-14 shrink-0 overflow-hidden rounded-full md:h-16 md:w-16",
              "border border-white/30 shadow-xl",
              "transition-transform duration-700",
              isPlaying ? "animate-[music-spin_8s_linear_infinite]" : "",
            ].join(" ")}
          >
            {currentTrack?.thumbnail ? (
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-rose-300 via-amber-200 to-emerald-200" />
            )}
          </div>

          {/* Title / artist / progress */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white md:text-base">
              {currentTrack?.title ?? (isReady ? "Loading music..." : "Connecting...")}
            </p>
            <p className="truncate text-xs text-white/70 md:text-sm">
              {currentTrack?.artist ?? "YouTube"}
            </p>

            <div
              ref={progressBarRef}
              className="mt-2 flex h-1.5 w-full cursor-pointer items-center rounded-full bg-white/25"
              onClick={handleSeek}
            >
              <div
                className="h-full rounded-full bg-white/90 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] tabular-nums text-white/60 md:text-xs">
              {formatSeconds(currentTime)} / {formatSeconds(duration)}
            </p>
          </div>

          {/* Controls */}
          <div className="flex shrink-0 items-center gap-1.5 md:gap-3">
            <button
              aria-label="Previous track"
              className="flex h-8 w-8 items-center justify-center text-white/80 transition hover:text-white"
              onClick={previous}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M6 6h2v12H6zM20 6v12l-8.5-6z" />
              </svg>
            </button>

            <button
              aria-label={isPlaying ? "Pause" : "Play"}
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4a2f28] shadow transition hover:scale-105 md:h-11 md:w-11"
            >
              {isPlaying ? (
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
              onClick={next}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M16 6h2v12h-2zM4 6v12l8.5-6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
