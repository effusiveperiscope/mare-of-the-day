'use client'
import { useEffect, useState } from "react";
import { selectionsFromClient } from "./mares";

export default function MaresList() {
  const [selections, setSelections] = useState<any>(null);

  useEffect(() => {
    async function fetchMares() {
      const now = new Date();
      const timezoneOffset = now.getTimezoneOffset() * 60 * 1000;
      const data = await selectionsFromClient(timezoneOffset);
      setSelections(data);
    }

    fetchMares();
  }, []);

  if (!selections) { 
    return <div className="flex flex-col">
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-4">Mare of the Day</h1>
      <p className="h-[100px] mb-4">Loading...</p>
      <p className="text-2xl mb-4"> </p>
      <h1 className="text-3xl font-bold mb-4">M.6. of the Week</h1>
      <p className="h-[100px] mb-4">Loading...</p>
      <p className="text-2xl mb-4"> </p>
      <h1 className="text-3xl font-bold mb-4">Mare of Interest</h1>
      <p className="h-[100px] mb-4">Loading...</p>
      <p className="text-2xl mb-4"> </p>
      <p>Loading...</p>
    </div>
  </div>;
  }

  return <div className="flex flex-col">
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-4">Mare of the Day</h1>
      {selections['mare_of_the_day']}
      <h1 className="text-3xl font-bold mb-4">M.6. of the Week</h1>
      {selections['m6_of_the_week']}
      <h1 className="text-3xl font-bold mb-4">Mare of Interest</h1>
      {selections['mare_of_interest']}
    </div>
  </div>;
}
