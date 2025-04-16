'use server';
import { getEpisodeSelections, getMareSelections, getReviews, getStories, getWorkouts } from './db';
import { Episode, getEpisodeData } from './episodes';
import { MareSelections } from './mares';
import { mareDisplay } from './ui/mareDisplay';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

export async function serverGetMareSelections(nominalDate: string) {
    const selections = await getMareSelections(nominalDate) as MareSelections;
    if (!selections) return {
        'mare_of_the_day': null,
        'm6_of_the_week': null,
        'mare_of_interest': null,
    };
    return {
        'mare_of_the_day': mareDisplay(selections.mare_of_the_day),
        'm6_of_the_week': mareDisplay(selections.m6_of_the_week),
        'mare_of_interest': mareDisplay(selections.mare_of_interest),
    };
}

export type EpisodeSelections = { s1_2: Episode|null,
     s3_6: Episode|null,
      s7_9: Episode|null };

export async function serverGetEpisodeSelections(nominalDate: string) {
    const selections = await getEpisodeSelections(nominalDate) as Record<string, string>; // These will just be keys
    if (!selections) return {
        's1_2': null,
        's3_6': null,
        's7_9': null,
    };
    return {
        's1_2': getEpisodeData(selections.s1_2),
        's3_6': getEpisodeData(selections.s3_6),
        's7_9': getEpisodeData(selections.s7_9),
    };
}

export async function serverGetStories(nominalDate: string) {
    const story = await getStories(nominalDate) as { story: string };
    if (!story) { return null; }
    const sanitized = DOMPurify.sanitize(story.story);
    return sanitized;
}

export async function serverGetReviews(nominalDate: string) {
    const reviews = await getReviews(nominalDate) as {
        author: string,
        title: string,
        review: string
        url: string
    }[];
    if (!reviews) { return null; }
    return reviews.map(review => ({ author: review.author, title: review.title, review: DOMPurify.sanitize(review.review), url: review.url }));
}

export async function serverGetWorkouts(nominalDate: string) {
    const workouts = await getWorkouts(nominalDate) as { workout: string };
    if (!workouts) { return null; }
    const sanitized = DOMPurify.sanitize(
        await marked(workouts.workout)
    );
    return sanitized;
}