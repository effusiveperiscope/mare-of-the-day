// Hardcoded mares!
'use server';
import Image from "next/image";
import dotenv from 'dotenv';
import { time } from "console";

dotenv.config();

const seed = process.env.MARES_SEED || 'mares';

var seedrandom = require('seedrandom');

const mares: Record<string, { image: string }> = {
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

function weeklySelect(array: string[], tzOffset: number) {
    const weekTimestamp = Math.floor(
        (new Date().getTime() - new Date('1970-01-04').getTime() + tzOffset) /
        (7 * 24 * 60 * 60 * 1000)); // Weeks since January 4, 1970
    const randomIndex = Math.floor(
        seedrandom(seed + weekTimestamp)() * array.length);
    return array[randomIndex];
}

function dailySelect(array: string[], tzOffset: number) {
    const dayTimestamp = Math.floor(
        (new Date().getTime() - new Date('1970-01-04').getTime() + tzOffset) /
        (24 * 60 * 60 * 1000)); // Days since January 4, 1970
    const randomIndex = Math.floor(
        seedrandom(seed + dayTimestamp)() * array.length);
    return array[randomIndex];
}

function secondSelect(array: string[], tzOffset: number) {
    const secondTimestamp = Math.floor(
        (new Date().getTime() - new Date('1970-01-04').getTime()) /
        (1000)); // Seconds since January 4, 1970
    const randomIndex = Math.floor(
        seedrandom(seed + secondTimestamp + tzOffset)() * array.length);
    // console.log(randomIndex);
    return array[randomIndex];
}

function mareDisplay(mare: string) {
    return (
        <div className="flex flex-col items-center">
            <Image 
                src={mares[mare].image} alt={`Image of ${mare}`} 
                className="rounded-full mb-4 h-32 w-32" width="100" height="100"/>
            <h2 className="text-2xl mb-4">{mare}</h2>
        </div>
    );
}

export async function selectionsFromClient(tzOffset: number) {
    return {'mare_of_the_day': mareDisplay(dailySelect(maresArray, tzOffset)),
        'm6_of_the_week': mareDisplay(weeklySelect(mane6Array, tzOffset)),
        'mare_of_interest': mareDisplay(dailySelect(voicedArray, tzOffset))};
    }