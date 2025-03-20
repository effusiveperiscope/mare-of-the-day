import cloudscraper
import time
import re
from bs4 import BeautifulSoup
import json
import urllib.parse
import dotenv
import os
import random

dotenv.load_dotenv()
STORIES_LIMIT = 3
STORIES_OUTPUT_FILE = "fimfiction_stories_data.json"
HTML_OUTPUT_FILE = "fimfiction_stories.html"

# This doesn't appear to be rate limited? Or if it is, it isn't very much
def auth(scraper, uname, pword):
    REQUEST_URL = "https://www.fimfiction.net/ajax/login"
    response = scraper.post(REQUEST_URL, data={"username": uname, "password": pword,
        "otp": "", "keep_logged_in": "true"})

    if response.status_code == 200:
        print("Successfully authenticated")
    else:
        print(f"Failed to authenticate (status code: {response.status_code})")
    
    from http.cookies import SimpleCookie
    cookies = SimpleCookie()
    for cookie in response.headers["Set-Cookie"].split(","):
        cookies.load(cookie)
    return {
        'session_token': cookies['session_token'].value,
        'signing_key': cookies['signing_key'].value
    }

def get_fimfiction_page(scraper, query='sunset shimmer #pony', url_override=None, page=1):
    """
    Fetches search results from FimFiction.net while bypassing CloudFlare protection.
    
    Args:
        query (str): Search query for stories
        page (int): Page number of results to fetch
        
    Returns:
        str: HTML content of the page
    """
    # Ensure the query is properly URL encoded
    encoded_query = urllib.parse.quote_plus(query)
    url = f"https://www.fimfiction.net/stories?q={encoded_query}&page={page}&order=random"
    
    if url_override is not None:
        url = url_override
    
    # Add retry mechanism
    max_retries = 3
    for attempt in range(max_retries):
        try:
            # Use cloudscraper to handle CloudFlare protection
            print(f"Requesting URL: {url}")
            response = scraper.get(url)
            # with open(HTML_OUTPUT_FILE, 'w', encoding='utf-8') as f:
                # f.write(response.text)
            
            # Check if we got a successful response
            if response.status_code == 200:
                print(f"Successfully retrieved page (status code: {response.status_code})")
                return response.text
            else:
                print(f"Attempt {attempt+1}/{max_retries}: Failed to bypass CloudFlare (status code: {response.status_code})")
                
                if attempt < max_retries - 1:
                    # Wait before retrying with exponential backoff
                    time.sleep(2 ** attempt)
                    
        except Exception as e:
            print(f"Attempt {attempt+1}/{max_retries}: Error: {str(e)}")
            
            if attempt < max_retries - 1:
                # Wait before retrying with exponential backoff
                time.sleep(2 ** attempt)
    
    print("Failed to retrieve page after maximum retries")
    return None

def extract_stories(html_content):
    """
    Extracts story information from the FimFiction.net search results page.
    
    Args:
        html_content (str): HTML content of the page
        
    Returns:
        list: List of dictionaries containing story information
    """
    if not html_content:
        return []
    
    stories = []
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find all story cards
    story_cards = soup.find_all('div', class_='story-card-container')
    
    for card in story_cards:
        story = {}
        
        # Get story title and URL
        title_element = card.find('a', class_='story_link')
        if title_element:
            story['title'] = title_element.text.strip()
            story['url'] = f"https://www.fimfiction.net{title_element['href']}"
            
            # Extract story ID from URL
            story_id_match = re.search(r'/story/(\d+)/', story['url'])
            if story_id_match:
                story['id'] = story_id_match.group(1)
        
        # Get author name and URL
        author_element = card.find('a', class_='story-card__author')
        if author_element:
            story['author'] = author_element.text.strip()
            story['author_url'] = f"https://www.fimfiction.net{author_element['href']}"
        
        # Get description
        description_element = card.find('div', class_='short_description')
        if description_element:
            story['description'] = description_element.text.strip()
        
        # Get tags
        tags = []
        tags_container = card.find('ul', class_='story-card__tags')
        if tags_container:
            tag_elements = tags_container.find_all('li')
            for tag in tag_elements:
                tag_text = tag.text.strip()
                if tag_text:
                    tags.append(tag_text)
            
            story['tags'] = tags
        
        stories.append(story)
    
    return stories

if __name__ == "__main__":
    # Custom headers that match the browser configuration
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        # "Accept-Encoding": "gzip, deflate, br, zstd",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Priority": "u=0, i",
        "TE": "trailers"
    }
    
    # Create a cloudscraper session
    scraper = cloudscraper.create_scraper(
        browser={
            'browser': 'firefox',
            'platform': 'linux',
            'mobile': False
        },
        delay=5
    )
    
    # Add the headers to the session
    scraper.headers.update(headers)

    authinfo = auth(scraper, os.getenv("FIMFICTION_UNAME"), os.getenv("FIMFICTION_PWORD"))

    scraper.headers.update({
        'Cookie': f"d_browse_default=2; stylesheet=dark; "
            f"session_token={authinfo['session_token']}; signing_key={authinfo['signing_key']}"
    })

    content = get_fimfiction_page(scraper, query=
        'words:<2999 #mlp-fim -#anthro -#fetish -#mature -#human -#equestria-girls status:complete')
    
    if content:
        # Extract and process stories
        stories = extract_stories(content)
        random.seed(time.time())
        random.shuffle(stories)

        export_stories = []
        with open(STORIES_OUTPUT_FILE, 'w', encoding='utf-8') as f:
            for story in stories[:STORIES_LIMIT]:
                # https://www.fimfiction.net/story/download/252186/txt
                story_txt_url = f"https://www.fimfiction.net/story/download/{story['id']}/txt"
                page = get_fimfiction_page(scraper, url_override=story_txt_url)
                story['text'] = page
                export_stories.append(story)
            f.write(json.dumps(export_stories, ensure_ascii=True) + '\n')
    else:
        print("Failed to retrieve content from FimFiction.net")
