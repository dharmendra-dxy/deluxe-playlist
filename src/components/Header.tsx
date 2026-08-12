"use client";

import { useEffect, useState } from "react";

function formatTime(date: Date) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return { time: `${hours}:${minutes}`, period };
}

export default function Header() {
  const [now, setNow] = useState<Date | null>(null);
  const [listeners, setListeners] = useState<number | null>(null);

  useEffect(() => {
    setNow(new Date());
    setListeners(Math.floor(Math.random() * (48 - 18 + 1)) + 18);

    const clockId = setInterval(() => setNow(new Date()), 1000 * 30);
    const listenersId = setInterval(() => {
      setListeners(Math.floor(Math.random() * (48 - 18 + 1)) + 18);
    }, 1000 * 20);

    return () => {
      clearInterval(clockId);
      clearInterval(listenersId);
    };
  }, []);

  const { time, period } = now ? formatTime(now) : { time: "--:--", period: "" };

  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 md:px-8 md:py-6">
      <div className="flex items-center justify-between text-white">
        <span className="text-sm font-medium tabular-nums md:text-base">
          {time} <span className="opacity-80">{period}</span>
        </span>
      </div>

      <div className="flex items-center justify-between text-white">
        <span className="flex items-center gap-1.5 text-sm md:gap-2 md:text-base">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="tabular-nums">{listeners ?? "--"}</span>
          <span className="opacity-80">online</span>
        </span>
      </div>

      <nav className="flex items-center justify-between gap-3 text-white md:gap-5">
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm opacity-90 transition hover:opacity-100 md:text-base"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Spotify
          <ArrowIcon />
        </a>
        <a
          href="https://music.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm opacity-90 transition hover:opacity-100 md:text-base"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="currentColor">
            <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm-2.4 16.8V7.2L16.8 12l-7.2 4.8z" />
          </svg>
          YT Music
          <ArrowIcon />
        </a>
      </nav>
    </header>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3 opacity-70" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}