# For use in VSCode interactive python
# Automated script for gathering character profiles for Mares of the Day.  Uses openrouter
# I hand-edited some descriptions afterwards to include important details

# %%
# 1. Set up pony data
MARES_TO_COLLECT = [
    "Saffron Masala", "Tree Hugger", "Dr. Fauna", "Windy Whistles", "Sapphire Shores", "Pear Butter", "Twilight Velvet", "Mrs. Shy", "Cookie Crumbles", "Cloudy Quartz", "Tempest Shadow", "Twinkleshine", "Lemon Hearts"
]
PROFILES_FOLDER = 'profiles'
OPENROUTER_MODEL_TO_USE = 'google/gemini-2.0-flash-exp:free'
COST_EST_INPUT = 0.075 # Per million tokens
COST_EST_OUTPUT = 0.30 # Per million tokens
RATE_LIMIT_PER_MIN = 4 # We just use time.sleep() here to avoid tripping the 'requests per minute' rate limit on OpenRouter free models
aliases = {
    'Trixie Lulamoon': 'The Great and Powerful Trixie',
    'Moondancer': 'Moon Dancer',
    'Mrs. Cake': "Mrs. Cake/Chiffon Swirl",
    "Twilight Velvet": "Twilight's mom\nTwilight Velvet",
    "Mrs. Shy": "Fluttershy's mother\nMrs. Shy",
    "Cookie Crumbles": "Rarity's mom\nCookie Crumbles",
    "Cloudy Quartz": "Pinkie's mom\nCloudy Quartz",
}
reverse_aliases = {v : k for k, v in aliases.items()}

import time
import json
import logging
import os
import re
from openai import OpenAI
from dotenv import load_dotenv
from bs4 import BeautifulSoup

# Filter out profiles we already have
MARES_TO_COLLECT = [mare for mare in MARES_TO_COLLECT if f'{mare}.json' not in os.listdir(PROFILES_FOLDER)]

logging.basicConfig(level=logging.INFO)

print('load_dotenv:',load_dotenv('.env')) # Needed for OpenAI API

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
assert OPENROUTER_API_KEY is not None, 'Missing OPENROUTER_API_KEY'
client = OpenAI(
    api_key = OPENROUTER_API_KEY,
    base_url = 'https://openrouter.ai/api/v1',
)

ponies = {}
with open('ponies.json', 'r', encoding='utf-8') as f:
    raw_ponies = json.load(f)
    for pony in raw_ponies:
        ponies[pony['name']] = pony
print('Loaded', len(ponies), 'ponies')

# %%
# 2. Get mares
def get_mare(mare):
    print("Getting mare data for", mare)
    if mare in aliases:
        mare = aliases[mare]
    if mare not in ponies:
        print ("Could not find mare, try an alias", mare)
        return None
    print("Found mare data for", mare)
    return ponies[mare]

mares = {
    mare: get_mare(mare) for mare in MARES_TO_COLLECT
}

import fandom

def analyze_mare(mare):
    mare_object = mares[mare]
    
    print(f"Analyzing mare {mare}")
    print(f"Grabbing primary link for mare {mare}")
    primary_link = gather_primary_link(mare)
    source_doc = ''
    print(f'Using primary link {primary_link} for mare {mare}')
    if primary_link is None:
        source_doc = mare_object['description']
        print(f'Could not find primary link for mare {mare}, using wiki description')

    # NOTE: If we can't find a link for the character it is unlikely we will get
    # much useful information out of the retrieved link

    source_refs = extract_refs(primary_link, mare)
    source_refs['fallback_description'] = mare_object['description']
    source_refs['object'] = mare_object

    info = info_from_refs(source_refs, mare)
    print(info)
    return info

# Always must be a JSON -object-
def json_try(string):
    try:
        # Strip unwanted characters (e.g., control characters)
        cleaned_string = re.sub(r'[\x00-\x1F\x7F]', '', string)

        # Find the start and end of the JSON
        start = cleaned_string.find('{')
        end = cleaned_string.rfind('}')
        
        if start != -1 and end != -1:
            return json.loads(cleaned_string[start:end + 1].strip())

        raise ValueError(f'Could not find JSON object in string: {string}')
    except:
        print(string)
        raise
    
# Link pertaining to character, or episode with character, or any other link
def gather_primary_link(mare):
    # Try fandom page
    primary_link = ''
    link_priority = 1
    try:
        primary_link = fandom.page(mare, wiki = 'mlp')
        primary_link = mare
        return {'link': primary_link, 'priority': 1}
    except fandom.error.PageError as e:
        primary_link = None

    if primary_link is None:
        # Grab all links mentioned in description
        links = mares[mare]['links']
        # If there is only one link, treat it as primary
        primary_link = links[0]['text']
        if len(links) == 1:
            return {'link': primary_link, 'priority': 1}

        links = {l['text']: l['url'] for l in mares[mare]['links']}
        if len(links) > 1:
            # LLM: Decide which link is relevant and if link points to a char page
            primary_link = analyze_links(list(links.keys()), mare, mares[mare]['description'])
            primary_link = json_try(primary_link)
            return primary_link

    if primary_link is None:
        print("Could not find primary link for", mare)
        return None

def do_prompt(prompt, max_tokens=600):
    if RATE_LIMIT_PER_MIN != 0:
        time.sleep(60 / RATE_LIMIT_PER_MIN)
    try:
        response = client.chat.completions.create(
            model=OPENROUTER_MODEL_TO_USE,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that analyzes text."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_tokens
        )
    except Exception as e:
        print(e)
    if response.choices is None or len(response.choices) == 0:
        print(response)
        raise Exception('No choices received')
    choice = response.choices[0].message.content
    logging.info(f'Performed prompt with input tokens: {response.usage.prompt_tokens},'
        f' output tokens: {response.usage.completion_tokens}')
    return choice

def analyze_links(links: list[dict], name: str, desc: str, use_reasoning=False):
    fmt = '''{
        "link": Verbatim name of the relevant link,
        "priority": Numeric priority level met by the link,
    }'''
    if use_reasoning:
        fmt['reasoning'] = 'Reasoning behind your choice'
    prompt = f"""
    You must gather information on {name}. 
    You will be given a web description and a list of link names.
    Based on these, determine which link is most relevant and return your result.
    
    Suggested priority of links:
    1. Link specifically about the character {name}
    2. A link to an episode where {name} appears
    3. Any other link

    Return your result as a valid JSON object in the following format:
    {fmt}
    Do not use backticks or any extra formatting.

    Description: {desc}
    Links: {links}
    """
    return do_prompt(prompt)

def gather_first_part(html_raw):
    soup = BeautifulSoup(html_raw, 'html.parser')
    content_div = soup.find('div', id='content')
    if content_div is None:
        return None
    # Stop before the TOC
    toc_div = content_div.find('div', id='toc')
    output = ""
    for sib in content_div.descendants:
        if sib == toc_div:
            break
        if sib.name == 'p':
            output += sib.text
    return output

def extract_refs(primary_link, mare):
    source_refs = {}
    if primary_link is not None:
        print(f"Retrieving source document for mare {mare}")
        try:
            source_page = fandom.page(primary_link['link'], wiki='mlp')
        except fandom.error.PageError as e:
            print(e)
            print(f'Could not find source page for mare {mare}')
        # Issue: Right now we have no way to separate this from the character table that has irrelevant
        # info like the voice actors
        if 'content' in source_page.content:
            source_refs['first_part'] = source_page.content['content']
        is_character = False

        # Most character pages will have one or both of these sections
        if 'Personality' in source_page.sections or 'Depiction in the series' in source_page.sections:
            is_character = True
            print('Character page detected')
        else:
            print('Episode/other page detected')

        if is_character:
            if 'Personality' in source_page.sections:
                source_refs['personality'] = source_page.section('Personality')
            if 'Depiction in the series' in source_page.sections:
                source_refs['depiction'] = source_page.section('Depiction in the series')

        # If it is an episode we should also try to grab the transcript
        if not is_character:
            episode_part = source_page.url.split('/')[-1]
            transcript_link = f'Transcripts/{episode_part}'
            try:
                transcript_page = fandom.page(transcript_link, wiki='mlp')
                print('Got transcript for mare', mare, 'episode part', episode_part)
            except fandom.error.PageError as e:
                print(e)
                print(f'Could not find transcript for mare {mare} episode part {episode_part}')
            if 'content' in transcript_page.content:
                source_refs['transcript'] = transcript_page.content['content']

        if 'Quotes' in source_page.sections:
            source_refs['quotes'] = source_page.section('Quotes')
        if 'Summary' in source_page.sections:
            source_refs['summary'] = source_page.section('Summary')
        return source_refs

def info_from_refs(source_refs, mare):
    # If we only have access to object/fallback description, then use that first.
    info = None
    if len(source_refs.keys()) == 2 and 'fallback_description' in source_refs:
        info = info_from_object(source_refs['object'], mare)
        return info

    # LLM: Use source_refs first_part if it exists
    if 'first_part' in source_refs:
        info = info_from_first_part(source_refs['first_part'], source_refs['object'], mare)
        if info.get('want_more_info', False):
            source_refs['first_try'] = info
            # If not enough information, look through 'depictions' + 'personality' sections, and/or or transcript
            info = info_from_extended_info(source_refs, mare)
        else:
            info = info['profile']
    
    # gather quotes
    quotes = quotes_from_refs(source_refs, info, mare)

    return {'profile': info, 'quotes': quotes['quotes']}

# "Worst case scenario - can only use the object description"
def info_from_object(mare_object, mare):
    print("Gathering info using object only for mare", mare)
    lang_object = {k:v for k,v in mare_object.items() if k not in ['first_appearance', 'links']}
    prompt = f"""
    Using only the following JSON information on {mare}:
    {lang_object}

    Return a character profile of {mare} in prose that is one paragraph long.
    Include any mentioned information such as personality, appearance, species,
    relations to other main characters, and occupation. 
    Do not refer to 'the text', as these profiles are to be standalone.

    You may simplify the names of colors to one or two words for brevity. For example, a pony
    with coat color 'pale, light grayish raspberry' might be said to have a 'pink' coat.

    Begin your response immediately with no other text.
    """
    return do_prompt(prompt)

def info_from_first_part(text, mare_object, mare):
    print("Gathering info using object and first part for mare", mare)
    fmt = '''{
        "reasoning": Explain your reasoning, one paragraph maximum,
        "profile": Two paragraph character profile,
        "want_more_info": bool, if more information would be helpful
    }'''
    lang_object = {k:v for k,v in mare_object.items() if k not in ['first_appearance', 'links']}
    prompt = f"""
    Using only the following text and JSON description, 
    create a character profile of {mare}.

    Include any mentioned information such as personality, appearance, species,
    relations with main characters, and occupation. If you believe further information
    may be helpful, mark want_more_info as true.

    You may simplify the names of colors to one or two words for brevity. For example, a pony
    with coat color 'pale, light grayish raspberry' can be said to have a 'pale pink'
    coat.

    Return your result as a valid JSON object in the following format:
    {fmt}

    Do not use backticks or any extra formatting.

    Text: {text}
    Description: {lang_object}
    """
    return json_try(do_prompt(prompt))

def info_from_extended_info(source_refs, mare):
    print("Extended gather info for mare", mare)
    mare_object = source_refs['object']
    lang_object = {k:v for k,v in mare_object.items() if k not in ['first_appearance', 'links']}
    prompt = f"""
    Given the following research materials, create a two paragraph character profile of {mare}.

    Include any information such as personality, appearance, species,
    relations with main characters, and occupation.

    You may simplify the names of colors to one or two words for brevity. For example, a pony
    with coat color 'pale, light grayish raspberry' can be said to have a 'pale pink'
    coat.

    Begin your response immediately with no other text.

    Research materials follow below.
    """
    if 'first_part' in source_refs:
        prompt += '\nFirst part: ' + source_refs['first_part']
    prompt += '\nJSON description: ' + str(lang_object)
    if 'personality' in source_refs:
        prompt += '\nPersonality: ' + source_refs['personality']
    if 'depiction' in source_refs:
        prompt += '\nDepiction in the series: ' + source_refs['depiction']
    if 'summary' in source_refs:
        prompt += '\nSummary of an episode with ' + mare + ': ' + source_refs['summary']
    if 'transcript' in source_refs:
        prompt += f'\nTranscript of an episode with {mare}: ' + source_refs['transcript']
    return do_prompt(prompt)

def quotes_from_refs(source_refs, profile, mare):
    print("Gathering quotes for mare", mare)
    if not ('quotes' in source_refs or 'transcript' in source_refs):
        return None # We can't extract any quotes

    fmt = '''{
        "quotes": ['This is the first quote.', 'This is the second quote.']
    }'''
    prompt = f"""
    Given the following research materials and character profile, gather
    up to five quotes uttered by {mare} most illustrative of the profile.

    Return your result as a valid JSON object in the following format:
    {fmt}

    Do not use backticks or any extra formatting.

    Research materials follow below.
    """
    prompt += '\nCharacter profile: ' + str(profile)
    if 'quotes' in source_refs:
        prompt += '\nQuotes (may not be spoken by actual character): ' + source_refs['quotes']
    if 'transcript' in source_refs:
        prompt += f'\nTranscript of an episode with {mare}: ' + source_refs['transcript']
    return json_try(do_prompt(prompt))
    
# %%
# 3. Run analysis
for mare in MARES_TO_COLLECT:
    profile = analyze_mare(mare)
    with open(f'profiles/{mare}.json', 'w', encoding='utf-8') as f:
        json.dump(profile, f, indent=4)

# %%
# 4. Condense profiles
profiles = {}
for name in os.listdir(PROFILES_FOLDER):
    with open(f'profiles/{name}', 'r', encoding='utf-8') as f:
        profile = json.load(f)
    char_name = '.'.join(name.split('.')[:-1])
    profiles[char_name] = profile

with open('profiles.json', 'w', encoding='utf-8') as f:
    json.dump(profiles, f, indent=4)
# %%
# 5. Move profiles.json
import shutil
shutil.copy2('profiles.json', '../src/app/profiles.json')
