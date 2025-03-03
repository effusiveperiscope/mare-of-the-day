import { dailySelect } from './utils';
import synopsisData from './wikipedia_synopses.json';

const synopsis_contents = synopsisData;
export type Episode = {season?: number, episode?: number, title: string, synopsis: string,
    writer: string, release_date: string,
    subseason_ep_number: string, absolute_ep_number: string
    }
const episode_map: {[key: string]: Episode} = {};
synopsis_contents.map((e: Episode[], season: number) => {
    e.map((ep: Episode, episode: number) => {
        episode_map[`S${season + 1}E${episode + 1}`] = ep
        ep.season = season + 1;
        ep.episode = episode + 1
    })
})

const s1_2_contents = synopsis_contents.slice(0, 2).flat()
    .map((ep: Episode) => `S${ep.season}E${ep.episode}`);
const s3_6_contents = synopsis_contents.slice(2, 6).flat()
    .map((ep: Episode) => `S${ep.season}E${ep.episode}`);
const s7_9_contents = synopsis_contents.slice(6, 9).flat()
    .map((ep: Episode) => `S${ep.season}E${ep.episode}`);

export function rawSelections(timeDate: Date, nominalDate: string) :
    {s1_2: string, s3_6: string, s7_9: string} {
    return {
        's1_2': dailySelect(s1_2_contents, timeDate, nominalDate, 's1_2'),
        's3_6': dailySelect(s3_6_contents, timeDate, nominalDate, 's3_6'),
        's7_9': dailySelect(s7_9_contents, timeDate, nominalDate, 's7_9'),
    }
}

export function getEpisodeData(key: string | null) {
    if (!key) return null;
    return episode_map[key];
}

