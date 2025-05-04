import { getStories, writeStory, getMareSelections, writeMareSelections, getEpisodeSelections, writeEpisodeSelections, getReviews, writeReview, writeWorkout, getWorkouts } from "./db";
import { rawSelections as rawMareSelections } from "./mares";
import { rawSelections as rawEpisodeSelections } from "./episodes";
import { writeOutDate } from "./text";
import { generateReviews, generateStory, generateWorkout } from "./story";
import logger from './logger';

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
        try {
            if (!await getMareSelections(datestr)) {
                const selections = rawMareSelections(dateToRun, datestr);
                writeMareSelections(selections.mare_of_the_day, selections.m6_of_the_week, selections.mare_of_interest, datestr);
            }
        } catch (e) {
            logger.error("Failed to generate mare selections", e);
        }
        try {
            if (!await getEpisodeSelections(datestr)) {
                const selections = await rawEpisodeSelections(dateToRun, datestr);
                writeEpisodeSelections(selections.s1_2, selections.s3_6, selections.s7_9, datestr);
            }
        } catch (e) {
            logger.error("Failed to generate episode selections", e);
        }

        // 2. Generate story
        try {
            if (!await getStories(datestr)) {
                const mareSelections = await getMareSelections(datestr) as Record<string, string>;
                const story = await generateStory([mareSelections.mare_of_the_day, mareSelections.m6_of_the_week, mareSelections.mare_of_interest,])
                writeStory(story, datestr);
            }
        } catch (e) {
            logger.error("Failed to generate story", e);
        }
        // 3. Generate reviews
        try {
            if ((await getReviews(datestr)).length === 0) {
                const reviews = await generateReviews();
                for (const review of reviews) {
                    writeReview(review.author, review.title, review.review, review.url, datestr);
                }
            }
        } catch (e) {
            logger.error("Failed to generate reviews", e);
        }

        // 4. Generate workouts
        try {
            if (!await getWorkouts(datestr)) {
                const workout = await generateWorkout();
                writeWorkout(workout, datestr);
            }
        } catch (e) {
            logger.error("Failed to generate workout", e);
        }
        // Hm... we're violating DRY...
    }
    isWorking = false;
}

export function initializeWork() {
    setInterval(work, 15000);
}