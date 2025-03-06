import { getMareSelections } from './db';
import { mareDisplay } from './ui/mareDisplay';
import { weeklySelect, dailySelect } from './utils';

export type Mare = { image: string };
export const mares: Record<string, Mare> = {
    'Twilight Sparkle': {
        'image': '/images/twilight_sparkle.png',
    },
    'Applejack': {
        'image': '/images/applejack.png',
    },
    'Fluttershy': {
        'image': '/images/fluttershy.png',
    },
    'Pinkie Pie': {
        'image': '/images/pinkie_pie.png',
    },
    'Rarity': {
        'image': '/images/rarity.png',
    },
    'Rainbow Dash': {
        'image': '/images/rainbow_dash.png',
    },
    'Princess Celestia': {
        'image': '/images/princess_celestia.png',
    },
    'Princess Luna': {
        'image': '/images/princess_luna.png',
    },
    'Princess Cadance': {
        'image': '/images/princess_cadance.png',
    },
    'Trixie Lulamoon': {
        'image': '/images/trixie_lulamoon.png',
    },
    'Starlight Glimmer': {
        'image': '/images/starlight_glimmer.png',
    },
    'Maud Pie': {
        'image': '/images/maud_pie.png',
    },
    'Marble Pie': {
        'image': '/images/marble_pie.png',
    },
    'Limestone Pie': {
        'image': '/images/limestone_pie.png',
    },
    'Mayor Mare': {
        'image': '/images/mayor_mare.png',
    },
    'Cheerilee': {
        'image': '/images/cheerilee.png',
    },
    'Spitfire': {
        'image': '/images/spitfire.png',
    },
    'Daring Do': {
        'image': '/images/daring_do.png',
    },
    'Sassy Saddles': {
        'image': '/images/sassy_saddles.png',
    },
    'Ms. Harshwhinny': {
        'image': '/images/ms_harshwhinny.png',
    },
    'Sugar Belle': {
        'image': '/images/sugar_belle.png',
    },
    'Lightning Dust': {
        'image': '/images/lightning_dust.png',
    },
    'Coco Pommel': {
        'image': '/images/coco_pommel.png',
    },
    'Coloratura': {
        'image': '/images/coloratura.png',
    },
    'Moondancer': {
        'image': '/images/moondancer.png',
    },
    'Minuette': {
        'image': '/images/minuette.png',
    },
    'Saffron Masala': {
        'image': '/images/saffron_masala.png',
    },
    'Tree Hugger': {
        'image': '/images/tree_hugger.png',
    },
    'Dr. Fauna': {
        'image': '/images/dr_fauna.png',
    },
    'Windy Whistles': { 
        'image': '/images/windy_whistles.png',
    },
    'Sapphire Shores': {
        'image': '/images/sapphire_shores.png',
    },
    'Pear Butter': {
        'image': '/images/pear_butter.png',
    },
    'Twilight Velvet': {
        'image': '/images/twilight_velvet.png',
    },
    'Mrs. Shy': {
        'image': '/images/mrs_shy.png',
    },
    'Cookie Crumbles': {
        'image': '/images/cookie_crumbles.png',
    },
    'Cloudy Quartz': {
        'image': '/images/cloudy_quartz.png',
    },
    'Tempest Shadow': {
        'image': '/images/tempest_shadow.png',
    },
    'Twinkleshine': {
        'image': '/images/twinkleshine.png',
    },
    'Lemon Hearts': {
        'image': '/images/lemon_hearts.png',
    }
}

const mane6Array = [
    'Twilight Sparkle', 'Applejack', 'Fluttershy', 'Pinkie Pie', 'Rarity', 'Rainbow Dash'
]

const voicedArray = [
    ...mane6Array, 'Princess Celestia', 'Princess Luna',
    'Princess Cadance', 'Trixie Lulamoon', 'Starlight Glimmer', 'Maud Pie',
    'Marble Pie', 'Limestone Pie', 
    'Mayor Mare', 'Cheerilee', 'Spitfire', 'Daring Do'
]

const maresArray = [...voicedArray, 'Sassy Saddles', 'Ms. Harshwhinny',
    'Sugar Belle', 'Lightning Dust', 'Coco Pommel', 'Coloratura', 'Moondancer',
    'Minuette', 'Saffron Masala', 'Tree Hugger', 'Dr. Fauna', 'Windy Whistles',
    'Sapphire Shores', 'Pear Butter', 'Twilight Velvet', 'Mrs. Shy', 'Cookie Crumbles',
    'Cloudy Quartz', 'Tempest Shadow', 'Twinkleshine', 'Lemon Hearts'
]

export function rawSelections(timeDate: Date, nominalDate: string) {
    return {
        'mare_of_the_day': dailySelect(maresArray, timeDate, nominalDate, 'motd'),
        'm6_of_the_week': weeklySelect(mane6Array, timeDate, 'm6otw'),
        'mare_of_interest': dailySelect(voicedArray, timeDate, nominalDate, 'moi'),
    }
}

export function getMare(mare: string) {
    return mares[mare];
}

export type MareSelections = { 
    mare_of_the_day: string,
    m6_of_the_week: string, 
    mare_of_interest: string };
export async function getSelections(nominalDate: string) {
    const selections = await getMareSelections(nominalDate) as MareSelections;
    if (!selections) return {
        'mare_of_the_day': null,
        'm6_of_the_week': null,
        'mare_of_interest': null,
    }
    return {
        'mare_of_the_day': mareDisplay(selections.mare_of_the_day),
        'm6_of_the_week': mareDisplay(selections.m6_of_the_week),
        'mare_of_interest': mareDisplay(selections.mare_of_interest),
    }
}