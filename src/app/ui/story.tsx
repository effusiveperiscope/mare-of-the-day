'use client';
import { useEffect, useState } from "react";
import { serverGetStories } from '../serverActions';
import { writeOutDate } from "../text";

export default function Story() {
  const [selections, setSelections] = useState<any>(null);

  useEffect(() => {
    async function fetchEps() {
      var now = new Date();
      const data = await serverGetStories(writeOutDate(now));
      setSelections(data);
    }
    fetchEps();
    }, []);

    if (!selections) return (
        <p>Loading...</p>
    );

    return (
        <div className="text-lg m-6">
        <div className="max-w-3xl ml-auto mr-auto text-justify" id="news_story">
         <div dangerouslySetInnerHTML={{ __html: selections }} />
        </div>
        </div>
    )
}