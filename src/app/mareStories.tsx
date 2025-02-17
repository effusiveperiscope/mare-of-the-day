import OpenAI from 'openai';
import { sqlite3 } from 'sqlite3';
import { readFileSync, existsSync } from 'fs';

const PROFILES_DIR = 'marescripts/profiles/'

async function generateStory(mares: string[]) {
    var prompt = `
    Generate a fictional news story involving the mares: ${mares}. 
    You may format your response using basic HTML tags, e.g. <b>Bold</b>. 
    You will be given character profiles to assist you in your task.
    `

    for (const mare of mares) {
        const profile_file = PROFILES_DIR + mare + '.json'
        if (!existsSync(profile_file)) {
            console.log('Could not find profile for mare '+mare)
            continue;
        }
        const profile = JSON.parse(readFileSync(profile_file,
            { encoding: 'utf-8' }
        ))
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
        return completion.choices[0].message.content
    } else {
        console.log(completion)
        throw new Error('No choices received')
    }
}