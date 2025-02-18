import { dailySelect } from './utils';
import synopsisData from './wikipedia_synopses.json';

const synopsis_contents = synopsisData;
var episode_map: {[key: string]: any} = {};
synopsis_contents.map((e: any, season: number) => {
    e.map((ep: any, episode: number) => {
        episode_map[`S${season + 1}E${episode + 1}`] = ep
        ep.season = season + 1;
        ep.episode = episode + 1
    })
})

const s1_2_contents = synopsis_contents.slice(0, 2).flat()
    .map((ep: any) => `S${ep.season}E${ep.episode}`);
const s3_6_contents = synopsis_contents.slice(2, 6).flat()
    .map((ep: any) => `S${ep.season}E${ep.episode}`);
const s7_9_contents = synopsis_contents.slice(6, 9).flat()
    .map((ep: any) => `S${ep.season}E${ep.episode}`);

export function rawSelections(timeDate: Date, nominalDate: string) :
    {s1_2: string, s3_6: string, s7_9: string} {
    return {
        's1_2': dailySelect(s1_2_contents, timeDate, nominalDate, 's1_2'),
        's3_6': dailySelect(s3_6_contents, timeDate, nominalDate, 's3_6'),
        's7_9': dailySelect(s7_9_contents, timeDate, nominalDate, 's7_9'),
    }
}

export function getEpisodeData(key: string) {
    return episode_map[key];
}

