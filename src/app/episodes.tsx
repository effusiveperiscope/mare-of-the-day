'use server';
import { readFileSync, existsSync } from 'fs';
import { clampNow, dailySelect } from './utils';
const SYNOPSIS_JSON = 'wikipedia_synopses.json'

const synopsis_text = readFileSync(SYNOPSIS_JSON, { encoding: 'utf-8' });
const synopsis_contents = JSON.parse(synopsis_text);
synopsis_contents.map((e: any, season: number) => {
    e.map((ep: any, episode: number) => {
        ep.season = season + 1;
        ep.episode = episode + 1
    })
})

const s1_2_contents = synopsis_contents.slice(0, 2).flat();
const s3_6_contents = synopsis_contents.slice(2, 6).flat();
const s7_9_contents = synopsis_contents.slice(6, 9).flat();

export async function episodesFromClient(now: Date, tzOffset: number) {
    now = clampNow(now);
    tzOffset = Math.max(Math.min(tzOffset, 60 * 60 * 1000), -60 * 60 * 1000);

    return {
        's1_2': dailySelect(s1_2_contents, now, tzOffset),
        's3_6': dailySelect(s3_6_contents, now, tzOffset),
        's7_9': dailySelect(s7_9_contents, now, tzOffset)
    }
}