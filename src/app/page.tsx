import Image from "next/image";
import { writeOutDate } from "./text";
import MaresList from "./maresList";
import { motion } from "motion/react";

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
      <div className="w-4/5 bg-white/90 p-6 shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-4">MARES MARES MARES</h1>
        <p>{writeOutDate(new Date())}</p>
        <hr className="border border-gray-300 mb-4"></hr>
        <MaresList />
      </div>
    </div>
  );
}

