import { getMareSelections } from './db';
import { mareDisplay } from './ui/mareDisplay';
import { weeklySelect, dailySelect } from './utils';

export const mares: Record<string, { image: string }> = {
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
    'Minuette'
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

export async function getSelections(nominalDate: string) {
    const selections = await getMareSelections(nominalDate);
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