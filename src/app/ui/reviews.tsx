'use client';
import { useEffect, useState } from "react";
import { writeOutDate } from "../text";
import { serverGetReviews } from "../serverActions";
import Image from "next/image";

export default function ReviewsList() {
    const [reviews, setReviews] = useState<null|{
        author: string,
        title: string,
        review: string,
        url: string
    }[]>(null);

    useEffect(() => {
        async function fetchEps() {
          const now = new Date();
          const data = await serverGetReviews(writeOutDate(now));
          setReviews(data);
        }
        fetchEps();
        }, []);
    
        if (!reviews) return (
            <p>Loading...</p>
        );

        return (
            <div className="text-lg m-6">
            <div className="max-w-3xl ml-auto mr-auto text-justify" id="reviews_list">
            <h1 className="text-3xl font-bold mb-4">Twilight&apos;s Fanfiction Corner</h1>
            
                <Image src="/images/twilight_fanfic.png" alt="Image of Twilight" className="mr-4 float-left" width="200" height="212" />
<p><i>Oh! Hello there! You might know me as Twilight Sparkle—Princess of Friendship, Element of Magic, and, apparently, the subject of an alarming number of fanfictions. Yes, really. It turns out that after starring in My Little Pony: Friendship is Magic, my friends and I have inspired hundreds of thousands of stories on FiMFiction.net—some heartwarming, some mind-boggling, and a few that I really, really wish I could un-read.
 
 But as a librarian and a dedicated scholar, I believe all writing has value! So, through the magic of automation, I’ll be reviewing random fanfictions—analyzing themes, critiquing character arcs, and occasionally questioning my very existence. Will I find literary brilliance, or will I be scarred for life? Let’s find out together!                    </i></p>
 <p><i>
 Also, due to some *ahem* arcane constraints (totally not the result of me trying to read a 500,000-word epic in one go and breaking reality… again), all stories reviewed here are under a certain word count. Apparently, there’s only so much processing power an automated alicorn can use before somepony—or some server—starts complaining. So, if you’ve written an 18-part saga detailing every alternate timeline Starlight Glimmer accidentally created… well, I admire your dedication, but I won’t be covering it here!
     </i></p>
                {reviews.map(review => (
                <div key={review.title + writeOutDate(new Date())} className="text-justify">
                <hr className="border border-gray-300 m-2"></hr>
                <b><u><a href={review.url}>{review.title}</a></u></b> by {review.author} 
                <hr className="border border-gray-300 m-2"></hr>
                <div className="mb-4" dangerouslySetInnerHTML={{ __html: review.review }}></div>
                </div>))}
            </div>
            </div>
        )
    
}