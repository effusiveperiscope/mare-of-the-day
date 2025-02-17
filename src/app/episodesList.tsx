'use client';
import { useEffect, useState } from "react";
import { episodesFromClient } from "./episodes";

export default function EpisodesList() {
  const [selections, setSelections] = useState<any>(null);

  useEffect(() => {
    async function fetchEps() {
      var now = new Date();
      // Adjust the date for testing different days
      //now.setDate(now.getDate() + 1); // Add 1 day

      const data = await episodesFromClient(now, now.getTimezoneOffset() * 60 * 1000);
      setSelections(data);
    }
    fetchEps();
    }, []);

    if (!selections) return (
        <p>Loading...</p>
    );

    function makeSelection(selection: any) {
        return <p>
            <b><u>
                <a href={`https://fim.heartshine.gay/?s=${selection.season}&e=${selection.episode}`}>
                {selection.title.toUpperCase()} (S{selection.season}E{selection.episode})</a></u></b> - {selection.synopsis}</p>
    }

    return (
        <div className="text-xl m-6">
        <div className="max-w-3xl ml-auto mr-auto text-justify">
          
        <h2 className="text-2xl mb-4 font-bold">Daily Episode Selection</h2>
        <h3 className="text-xl mb-4 font-bold">~ Flightless and Fancy Free ~</h3>
        {makeSelection(selections['s1_2'])}
        <br/>
        <h3 className="text-xl mb-4 font-bold">~ Wings and Glam ~</h3>
        {makeSelection(selections['s3_6'])}
        <br/>
        <h3 className="text-xl mb-4 font-bold">~ You Vill Vatch Ze Slop ~</h3>
        {makeSelection(selections['s7_9'])}
           </div>
        </div>
    )
}