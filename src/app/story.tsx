import OpenAI from 'openai';
import { generateSlug } from "random-word-slugs";
import profilesData from './profiles.json';

type ProfileData = {
    profile: string;
    quotes: string[]
}
type ProfilesData = {
    [key: string]: ProfileData
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
