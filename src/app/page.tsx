import Image from "next/image";
import MaresList from "./ui/maresList";
import EpisodesList from "./ui/episodesList";
import {} from "./work";
{} 
export default function Home() {
  return (
    <div className="relative w-full min-h-screen flex justify-center items-center p-10">
      <div className="absolute inset-0 -z-10">
      <Image
      src="/images/bg_small.jpg"
      className="blur-md h-full w-auto object-cover"
      width="10"
      height="10"
      alt="Background" priority />
      </div>
      <div className="w-4/5 bg-white/90 p-6 shadow-lg text-center overflow-hidden">
        <div className="marquee-container">
          <h1 className="text-4xl font-bold mb-4 marquee-content">MARES MARES MARES</h1>
        </div>
        <MaresList />
        <hr className="border border-gray-300 mb-4"></hr>
        <EpisodesList />
      </div>
    </div>
  );
}

