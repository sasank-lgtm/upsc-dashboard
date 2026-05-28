import urllib.request
import xml.etree.ElementTree as ET
import json
import datetime

def fetch_from_source(name, url):
    articles = []
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            root = ET.fromstring(response.read())
            for item in root.findall('.//item')[:3]: # 3 items per source
                title = item.find('title').text
                link = item.find('link').text
                # Clean up descriptions
                desc = (item.find('description') is not None) and item.find('description').text or "No summary available."
                
                articles.append({
                    "month": datetime.datetime.now().strftime("%B"),
                    "pillar": "polity", # Defaulting; you can add keyword logic here
                    "source": name,
                    "time": datetime.datetime.now().strftime("%B %d, %Y"),
                    "sourceUrl": link,
                    "title": title,
                    "summary": desc[:150] + "...",
                    "fullAnalysis": f"Analysis based on {name} report. Visit source for deep-dive: {link}",
                    "prelimsSummary": f"* **Source:** {name}\\n* **URL:** {link}"
                })
    except Exception as e:
        print(f"Error fetching {name}: {e}")
    return articles

def run_multi_source():
    sources = [
        ("The Hindu", "https://www.thehindu.com/news/national/feeder/default.rss"),
        ("Indian Express", "https://indianexpress.com/feed/"),
        ("PIB Delhi", "https://pib.gov.in/rssfeed.aspx")
    ]
    all_data = []
    for name, url in sources:
        all_data.extend(fetch_from_source(name, url))
    
    with open("data.json", "w") as f:
        json.dump(all_data, f, indent=4)

if __name__ == "__main__":
    run_multi_source()
