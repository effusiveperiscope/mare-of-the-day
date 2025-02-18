'use client'
import { useEffect, useState } from "react";
import { serverGetMareSelections } from '../serverActions';
import { motion } from "motion/react";
import { writeOutDate } from "../text";

export default function MaresList() {
  const [selections, setSelections] = useState<any>(null);

  useEffect(() => {
    async function fetchMares() {
      var now = new Date();
      const data = await serverGetMareSelections(writeOutDate(now));
      setSelections(data);
    }

    fetchMares();
  }, []);

  if (!selections) { 
    return (
        <div className="flex flex-col">
          <p>{writeOutDate(new Date())}</p>
          <hr className="border border-gray-300 mb-4"></hr>
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">Mare of the Day</h1>
            <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
            <h2 className="text-2xl mb-4">Loading</h2>
            <h1 className="text-3xl font-bold mb-4">M.6. of the Week</h1>
            <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
            <h2 className="text-2xl mb-4">Loading</h2>
            <h1 className="text-3xl font-bold mb-4">Mare of Interest</h1>
            <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
            <h2 className="text-2xl mb-4">Loading</h2>
          </div>
        </div>
      );
  }

  return <div className="flex flex-col">
    <p>{writeOutDate(new Date())}</p>
    <hr className="border border-gray-300 mb-4"></hr>
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-4">Mare of the Day</h1>
      <AnimatedMare duration={0.5}>
        {selections['mare_of_the_day']}
      </AnimatedMare>
      <h1 className="text-3xl font-bold mb-4">M.6. of the Week</h1>
      <AnimatedMare duration={1}>
        {selections['m6_of_the_week']}
      </AnimatedMare>
      <h1 className="text-3xl font-bold mb-4">Mare of Interest</h1>
      <AnimatedMare duration={1.5}>
        {selections['mare_of_interest']}
      </AnimatedMare>
    </div>
  </div>;
}
function AnimatedMare({ children, duration }: { children: React.ReactNode, duration: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
}