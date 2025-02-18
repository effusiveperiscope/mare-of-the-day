'use server';
import { getEpisodeSelections, getMareSelections, getStories } from './db';
import { getEpisodeData } from './episodes';
import { mareDisplay } from './ui/mareDisplay';
import DOMPurify from 'dompurify';

export async function serverGetMareSelections(nominalDate: string) {
    const selections = await getMareSelections(nominalDate);
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

export async function serverGetEpisodeSelections(nominalDate: string) {
    const selections = await getEpisodeSelections(nominalDate); // These will just be keys
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
    const story = await getStories(nominalDate);
    if (!story) { return null; }
    const sanitized = DOMPurify.sanitize(story);
    return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}