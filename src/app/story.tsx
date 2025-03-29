import OpenAI from 'openai';
import { generateSlug } from "random-word-slugs";
import { readFileSync } from 'fs';
import profilesData from './profiles.json';
import { spawn, SpawnOptionsWithoutStdio } from 'child_process';

// https://github.com/vercel/next.js/discussions/38989
// https://github.com/vercel/next.js/discussions/46722
// https://nextjs.org/blog/next-15-2#nodejs-middleware-experimental

type ProfileData = {
    profile: string;
    quotes: string[]
}
type ProfilesData = {
    [key: string]: ProfileData
}
type StoriesData = {
    title: string;
    url: string;
    id: string;
    author: string;
    author_url: string;
    tags: string[];
    text: string;
}
type Review = {
    title: string;
    url: string;
    review: string;
    author: string;
}

const typedProfilesData: ProfilesData = profilesData as ProfilesData

export async function generateStory(mares: string[]): Promise<string> {
    let prompt = `
    Generate a fictional news story involving the mares: ${mares}. 

    You may format your response using basic HTML formatting tags, e.g. <b>Bold</b>,
    but do not use semantic tags like <article> or <code>. Do not include a newspaper title.

    You may use the following randomly generated slug for inspiration, but
    do not include it in the text: ${generateSlug(5)}

    You will be given character profiles to assist you in your task.
    `

    for (const mare of mares) {
        const profile = typedProfilesData[mare];
        if (!profile) {
            console.log('Could not find profile for mare '+mare)
            continue;
        }
        prompt += `\n\nProfile for ${mare}: \n${JSON.stringify(profile, null, 2)}\n\n`
    }

    prompt += `Begin your response immediately with no other text.`

    const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
    });
    const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
            { role: 'system', content: 'You are an entertaining writer of fictional news stories.' },
            { role: 'user', content: prompt },
        ],
    });
    if (completion.choices) {
        return completion.choices[0].message.content!
    } else {
        throw new Error('No choices received')
    }
}

function spawnAsync(command: string, args: string[], options: SpawnOptionsWithoutStdio | undefined) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(`child process exited with code ${code}`);
      }
    });

    child.on('error', (err) => {
        reject(`Failed to start child process. ${err}`);
    });
  });
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateReviews(): Promise<Review[]> {
    const reviewer = 'Twilight Sparkle';

    // First: We have to grab stories from FiMFiction using a python script
    const proc = spawnAsync('python', ['story_fetch.py'], {
        cwd: 'marescripts'
    })

    await proc;
    const STORIES_FILE = 'marescripts/fimfiction_stories_data.json'
    const data = readFileSync(STORIES_FILE, 'utf-8');
    const stories = JSON.parse(data) as StoriesData[];

    const completions: Review[] = []

    for (const story of stories) {
        console.log('Generating review for ' + story.title);
        const openai = new OpenAI({
            baseURL: 'http://ponychats.celestia.ai:8000/api/v1',
            apiKey: 'none',
        })
        try {
        const completion = await openai.chat.completions.create({
            model: reviewer,
            messages: [{role: 'user', content: story.text}]
        })
        if (completion.choices) {
            console.log('Wrote review for ' + story.title);
            completions.push({
                title: story.title,
                url: story.url,
                review: completion.choices[0].message.content!,
                author: story.author,
            })
        }
    } catch (e) {
        console.log(e)
    }
        await sleep(3000); // Avoid sending too many requests
    }
    return completions
}

export async function generateWorkout(): Promise<string> {
    const prompt = `
    Generate a calisthenics workout using no equipment, for humans. 
    Keep the descriptions short and simple. 
    Format your response in markdown.`

    const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
    });
    const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
            { role: 'system', content: 'You are Rainbow Dash, acting as an athletic coach.' },
            { role: 'user', content: prompt },
        ],
    });
    if (completion.choices) {
        return completion.choices[0].message.content!
    } else {
        throw new Error('No choices received')
    }
}