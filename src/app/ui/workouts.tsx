
'use client';
import { useEffect, useState } from "react";
import { serverGetWorkouts } from "../serverActions";
import { writeOutDate } from "../text";
import Image from "next/image";

export default function Workouts() {
    const [workouts, setWorkouts] = useState<string | null>(null);
    useEffect(() => {
        async function fetchWorkouts() {
          const now = new Date();
            const workouts = await serverGetWorkouts(writeOutDate(now));
            setWorkouts(workouts);
        }
        fetchWorkouts();
    }, []);
    if (!workouts) return (<p>Loading...</p>);

    return (
            <div className="text-lg m-6">
            <div className="max-w-3xl ml-auto mr-auto text-justify" id="workout_section">
            <h1 className="text-3xl font-bold mb-4">Rainbow Dash&apos;s Daily Workouts</h1>
            
                <Image src="/images/rd_profile.jpg" alt="Image of Rainbow Dash" className="mr-4 float-left" width="200" height="212" />
  <p>Hey there, desk jockey! Sitting all day staring at screens? Ugh, <strong>lame</strong>. It&apos;s time to get off that chair and <strong>move</strong>—the <strong>awesome</strong> way!</p>

  <p>Join me, Rainbow Dash, for quick, energizing workouts that&apos;ll wake up your body faster than my patented carb-bomb sandwiches. I&apos;m talking stretches, jumps, and power moves you can do right in your room—no gym, no equipment, no excuses. Just 10–15 minutes a day to boost your energy, sharpen your focus, and feel like <strong>20% cooler</strong> every time.</p>

  <p>Whether you&apos;re coding, gaming, or just scrolling endlessly—take a break, stretch those wings (or arms, whatever), and <strong>let&apos;s get moving!</strong></p>

  <p><strong>Speed. Strength. Stamina. Style.</strong><br/>
  That&apos;s the Rainbow Dash way. You in?</p>
                <hr className="border border-gray-300 m-2"></hr>
            <div className="pl-8 pt-4 pr-8 max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6 text-gray-800">
                <div dangerouslySetInnerHTML={{ __html: workouts }} />
            </div>
            </div>
            </div>
    )
}
