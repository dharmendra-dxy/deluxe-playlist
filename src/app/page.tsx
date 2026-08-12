import { Yatra_One } from "next/font/google";
import Header from "@/components/Header";
import Player from "@/components/Player";
import SceneBackground from "@/components/SceneBackground";

const yatra = Yatra_One({
  subsets: ["devanagari", "latin"],
  weight: "400",
});

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      <SceneBackground />
      <div className="absolute inset-0 bg-black/10" aria-hidden />

      <Header />

      {/* Hindi title */}
      <div className="absolute inset-x-0 top-[40%] z-10 flex justify-center px-4 md:top-[40%]">
        <h1
          className={`${yatra.className} text-center text-5xl leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] sm:text-6xl md:text-8xl`}
        >
          डीलक्स थाली
        </h1>
      </div>

      <Player />
    </main>
  );
}