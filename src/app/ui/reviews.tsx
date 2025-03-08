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
            <h1 className="text-3xl font-bold mb-4">Twilight's Fanfiction Corner</h1>
                <Image src="/images/twilight_fanfic.png" alt="Image of Twilight" className="mr-4 float-left" width="200" height="212" />
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