import { getStories, writeStory, getMareSelections, writeMareSelections, getEpisodeSelections, writeEpisodeSelections, getReviews, writeReview } from "./db";
import { rawSelections as rawMareSelections } from "./mares";
import { rawSelections as rawEpisodeSelections } from "./episodes";
import { writeOutDate } from "./text";
import { generateReviews, generateStory } from "./story";

let isWorking = false;
// Work that has to be run periodically
async function work() {
    if (isWorking) return;
    isWorking = true;
    const date = new Date();
    const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    const datesToRun = [yesterday, date, tomorrow];

    for (const dateToRun of datesToRun) {
        const datestr = writeOutDate(dateToRun);
        // 1. Generate selection
        if (!await getMareSelections(datestr)) {
            const selections = rawMareSelections(dateToRun, datestr);
            writeMareSelections(selections.mare_of_the_day, selections.m6_of_the_week, selections.mare_of_interest, datestr);
        }
        if (!await getEpisodeSelections(datestr)) {
            const selections = await rawEpisodeSelections(dateToRun, datestr);
            writeEpisodeSelections(selections.s1_2, selections.s3_6, selections.s7_9, datestr);
        }
        // 2. Generate story
        if (!await getStories(datestr)) {
            const mareSelections = await getMareSelections(datestr) as Record<string, string>;
            const story = await generateStory([mareSelections.mare_of_the_day, mareSelections.m6_of_the_week, mareSelections.mare_of_interest,])
            writeStory(story, datestr);
        }
        // 3. Generate reviews
        if ((await getReviews(datestr)).length === 0) {
            const reviews = await generateReviews();
            for (const review of reviews) {
                writeReview(review.author, review.title, review.review, review.url, datestr);
            }
        }
    }
    isWorking = false;
}

export function initializeWork() {
    setInterval(work, 15000);
}