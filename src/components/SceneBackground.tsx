"use client";

import { useTheme } from "@/components/ThemeContext";

export default function SceneBackground() {
  const { theme } = useTheme();
  const isEvening = theme === "evening";

  return (
    <>
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${
          isEvening
            ? "bg-[url('/bg/scene-wide.png')] opacity-100"
            : "bg-[url('/bg/scene-wide-morning.png')] opacity-100"
        } md:block`}
        aria-hidden
      />
      <div
        className={`bg-cover bg-center bg-no-repeat transition-opacity duration-700 md:hidden ${
          isEvening
            ? "bg-[url('/bg/scene-tall.png')]"
            : "bg-[url('/bg/scene-tall-morning.png')]"
        } absolute inset-0`}
        aria-hidden
      />
    </>
  );
}
