"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

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

      <ThemeToggle />
    </header>
  );
}
