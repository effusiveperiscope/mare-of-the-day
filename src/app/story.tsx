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
        console.log(completion)
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
    let prompt = `You will be provided a story to review. `

    console.log('Spawning child process');
    // First: We have to grab stories from FiMFiction using a python script
    const proc = spawnAsync('python', ['story_fetch.py'], {
        cwd: 'marescripts'
    })
    console.log('Child process spawned');

    await proc;
    const STORIES_FILE = 'marescripts/fimfiction_stories_data.json'
    const data = readFileSync(STORIES_FILE, 'utf-8');
    const stories = JSON.parse(data) as StoriesData[];
    const includeSpoilers = true;

    let completions: Review[] = []

    for (const story of stories) {
        console.log('Generating review for ' + story.title);
        prompt += `\n\nTitle: ${story.title}\nStory:`
        prompt += `===== BEGINNING OF STORY =====`
        prompt += `\n${story.text}\n\n`

        prompt += `===== END OF STORY =====`
        prompt += `
        - As ${reviewer}, write a short (1-2 paragraph) newspaper-style review of the story in-character.
        - You may format your response using basic HTML formatting tags, e.g. <b>Bold</b>,
        but do not use semantic tags like <article> or <code>. 
        - Do not include any titles or headers.
        - Do not include an assent like "Okay, here's my review" or "Here is a review", only your review.
        ${includeSpoilers ? '' : '- Please write a spoiler-free review. You can describe general premises, but avoid revealing major plot points.'}
        - Remember that part of your review should discuss what audiences may find the story entertaining.
        - Make your review entertaining and fitting to the personality and experiences of ${reviewer}.
        - Strive to provide a balanced review; consider ${reviewer}'s preferences and values. She may not like every story!
        A short description of the reviewer you are acting as: ${typedProfilesData[reviewer].profile}

        Begin your review immediately, with no other text.`

        const openai = new OpenAI({
            apiKey: process.env.OPENROUTER_API_KEY,
            baseURL: 'https://openrouter.ai/api/v1',
        });
        const completion = await openai.chat.completions.create({
            model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
            messages: [
                { role: 'system', content: `You are the character ${reviewer}. 
                ` },
                { role: 'user', content: prompt },
            ],
        });
        if (completion.choices) {
            console.log('Wrote review for ' + story.title + '. Response: ' + completion.choices[0].message.content!);
            completions.push({
                title: story.title,
                url: story.url,
                review: completion.choices[0].message.content!,
                author: story.author,
            })
        } else {
            console.log(completion)
            throw new Error('No choices received')
        }
        await sleep(3000); // Avoid sending too many requests
    }
    return completions
}