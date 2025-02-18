'use client';
import { useEffect, useState } from "react";
import { serverGetEpisodeSelections } from '../serverActions';
import { writeOutDate } from "../text";

export default function EpisodesList() {
  const [selections, setSelections] = useState<any>(null);

  useEffect(() => {
    async function fetchEps() {
      var now = new Date();
      const data = await serverGetEpisodeSelections(writeOutDate(now));
      setSelections(data);
    }
    fetchEps();
    }, []);

    if (!selections) return (
        <p>Loading...</p>
    );

    function makeSelection(selection: any) {
      if (selection === null) {
        return <p>Missing info</p>;
      }
        return <p>
            <b><u>
                <a href={`https://fim.heartshine.gay/?s=${selection.season}&e=${selection.episode}`}>
                {selection.title.toUpperCase()} (S{selection.season}E{selection.episode})</a></u></b> - {selection.synopsis}</p>
    }

    return (
        <div className="text-lg m-6">
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