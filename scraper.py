import urllib.request
import xml.etree.ElementTree as ET
import json
import datetime

def fetch_live_data():
    # Fetching live national news stream
    url = "https://www.thehindu.com/news/national/feeder/default.rss"
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            root = ET.fromstring(response.read())
    except Exception as e:
        print(f"Fetch error: {e}")
        return []

    articles = []
    for item in root.findall('.//item')[:5]:
        title = item.find('title').text
        link = item.find('link').text
        desc = (item.find('description').text or "").split("<")[0]
        
        # Determine UPSC Pillar based on keywords
        pillar = "polity"
        t_low = title.lower()
        if any(w in t_low for w in ["economy", "rbi", "gdp", "finance"]): pillar = "economy"
        elif any(w in t_low for w in ["environment", "climate", "forest"]): pillar = "environment"
        elif any(w in t_low for w in ["science", "tech", "isro"]): pillar = "science"

        articles.append({
            "month": datetime.datetime.now().strftime("%B"),
            "pillar": pillar,
            "source": "The Hindu / National Feed",
            "time": datetime.datetime.now().strftime("%B %d, %Y"),
            "sourceUrl": link,
            "title": title,
            "summary": desc[:120] + "...",
            "fullAnalysis": "Live feed analysis: This article relates to core UPSC syllabus components. Reviewing structural implications for administrative reform and resource allocation.",
            "prelimsSummary": "* **Core Context:** Real-time news aggregation.\n* **Relevant Pillars:** " + pillar.capitalize()
        })
    return articles

# Save live data
with open("data.json", "w") as f:
    json.dump(fetch_live_data(), f, indent=4)
