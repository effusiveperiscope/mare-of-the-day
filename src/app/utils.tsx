import dotenv from 'dotenv';
var seedrandom = require('seedrandom');

dotenv.config();
const seed = process.env.MARES_SEED || 'mares';

export function clampNow(now: Date) {
    const serverNow = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const lowerBound = new Date(serverNow.getTime() - oneDay);
    const upperBound = new Date(serverNow.getTime() + oneDay);
    now = new Date(Math.min(upperBound.getTime(), Math.max(lowerBound.getTime(), now.getTime())));
    return now;
}

export function weeklySelect<T>(array: T[], timeDate: Date, extraSeed: string) {
    const weekTimestamp = Math.floor(
        (timeDate.getTime() - new Date('1970-01-06').getTime()) /
        (7 * 24 * 60 * 60 * 1000)); // Weeks since January 6, 1970
    console.log(weekTimestamp);
    const randomIndex = Math.floor(
        seedrandom(seed + weekTimestamp + extraSeed)() * array.length);
    return array[randomIndex];
}

export function dailySelect<T>(array: T[], timeDate: Date, nominalDate: string, extraSeed: string = '') {
    const dayTimestamp = Math.floor(
        (timeDate.getTime() - new Date('1970-01-01').getTime()) /
        (24 * 60 * 60 * 1000)); // Days since January 1, 1970
    const randomIndex = Math.floor(
        seedrandom(seed + dayTimestamp + nominalDate + extraSeed)() * array.length);
    return array[randomIndex];
}