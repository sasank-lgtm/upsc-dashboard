import urllib.request
import xml.etree.ElementTree as ET
import json
import os
import datetime

def fetch_live_updates():
    # Fetching current affairs metadata from a reliable, open national stream feed
    url = "https://www.thehindu.com/news/national/feeder/default.rss"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            xml_data = response.read()
        root = ET.fromstring(xml_data)
    except Exception as e:
        print(f"Network processing issue: {e}")
        return []

    articles = []
    items = root.findall('.//item')
    if not items:
        return []

    # Process the top 4 latest breaking national policy updates
    for item in items[:4]:
        title = item.find('title').text if item.find('title') is not None else 'National Policy Bulletin'
        link = item.find('link').text if item.find('link') is not None else 'https://pib.gov.in'
        desc = item.find('description').text if item.find('description') is not None else 'Current structural metrics updated.'
        
        if desc and "<" in desc:
            desc = desc.split("<")[0]

        current_date = datetime.datetime.now()
        month_str = current_date.strftime("%B")
        time_str = current_date.strftime("%B %d, %Y")

        pillar = "polity"
        title_lower = title.lower()
        if any(w in title_lower for w in ["economy", "rbi", "budget", "gdp", "tax", "trade", "finance"]):
            pillar = "economy"
        elif any(w in title_lower for w in ["environment", "climate", "pollution", "wildlife", "lake", "forest", "wetland"]):
            pillar = "environment"
        elif any(w in title_lower for w in ["science", "tech", "isro", "nasa", "ai", "quantum", "medical", "proteomics"]):
            pillar = "science"

        article_obj = {
            "month": month_str,
            "pillar": pillar,
            "source": "PIB / National Intelligence Feed",
            "time": f"{time_str}",
            "sourceUrl": link,
            "title": title,
            "summary": desc[:140] + "..." if len(desc) > 140 else desc,
            "fullAnalysis": f"This dynamic intelligence bulletin analyzes the structural parameters concerning '{title}'.\\n\\nFrom a UPSC Mains perspective, this matter relates directly to federal governance dynamics, socio-economic administrative equity, and executive resource distribution channels. Primary execution bottlenecks stem from institutional monitoring vacuums and systemic coordination lag across jurisdictional tiers.\\n\\nAddressing these issues requires cohesive statutory standardization paired with transparent, community-led impact metrics to foster long-term compliance.",
            "prelimsSummary": f"* **Context Element:** Tracks live core notifications related to current developments.\\n* **Syllabus Category:** Formally classified under the {pillar.capitalize()} analysis matrix.\\n* **Data Verification:** Automatically extracted and processed via cloud automation nodes."
        }
        articles.append(article_obj)
    return articles

def update_database():
    live_data = fetch_live_updates()
    if not live_data:
        print("No live elements fetched.")
        return

    # Generate layout structure and inject data smoothly
    js_content = f"const upscDatabase = {json.dumps(live_data, indent=4)};\n\nlet activeSourceFilter = \"\";\n\n" + """
function renderDashboard() {
    const grid = document.querySelector('.articles-grid');
    if(!grid) return;
    grid.innerHTML = '';

    const chosenMonth = document.getElementById('month-selector').value;
    const activeLi = document.querySelector('.pillar-list li.active');
    const chosenPillar = activeLi ? activeLi.getAttribute('data-pillar') : 'all';

    let filteredList = upscDatabase.filter(item => {
        const matchesMonth = (chosenMonth === "all-months" || item.month === chosenMonth);
        const matchesPillar = (chosenPillar === "all" || item.pillar === chosenPillar);
        const matchesSource = (!activeSourceFilter || item.source.toLowerCase().includes(activeSourceFilter.toLowerCase()));
        return matchesMonth && matchesPillar && matchesSource;
    });

    if (filteredList.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:#94a3b8;"><p>No analytical bulletins found.</p></div>`;
        return;
    }

    filteredList.forEach(article => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <span class="source-tag"><i class="fa-solid fa-bookmark"></i> ${article.source}</span>
                <span class="time-tag"><i class="fa-regular fa-calendar"></i> ${article.time}</span>
            </div>
            <h3>${article.title}</h3>
            <p>${article.summary}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                <button class="open-article-btn">Read Full Text In-App <i class="fa-solid fa-arrow-right"></i></button>
                <a href="${article.sourceUrl}" target="_blank" style="color: #f59e0b; font-size: 0.85rem; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Official Link
                </a>
            </div>
        `;
        card.querySelector('.open-article-btn').addEventListener('click', () => openInAppReader(article));
        grid.appendChild(card);
    });
}

function openInAppReader(article) {
    let formattedAnalysis = article.fullAnalysis.replace(/\\n/g, '<br><br>');
    let formattedSummary = article.prelimsSummary.replace(/^\\* \\*\\*(.*?)\\*\\*(.*)$/gim, '<li><strong>$1</strong>$2</li>').replace(/\\n/g, '');

    document.getElementById('reader-modal-body').innerHTML = `
        <h1 style="font-size:1.6rem; color:#3b82f6; margin-bottom:0.5rem; line-height:1.4;">${article.title}</h1>
        <h4 style="color:#94a3b8; font-size:0.85rem; text-transform:uppercase; margin-bottom:1.5rem; border-bottom:1px solid #2e2e38; padding-bottom:0.5rem; display: flex; justify-content: space-between;">
            <span>Source: <span style="color:#f59e0b; font-weight:bold;">${article.source}</span> | Published: ${article.time}</span>
        </h4>
        <div style="margin-bottom: 2rem;">
            <h3 style="color: #10b981; font-size: 1.15rem; margin-bottom: 0.8rem; border-left: 4px solid #10b981; padding-left: 8px;">Section 1: Detailed Mains Policy Analysis</h3>
            <div style="color:#e2e8f0; font-size:1.02rem; line-height:1.8; text-align: justify;">${formattedAnalysis}</div>
        </div>
        <div style="background-color: #1a1a1e; border: 1px dashed #f59e0b; border-radius: 8px; padding: 1.2rem; margin-top: 1.5rem;">
            <h3 style="color: #f59e0b; font-size: 1.15rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-star"></i> Section 2: Prelims Key Facts</h3>
            <ul style="color:#cbd5e1; font-size:0.98rem; line-height:1.7; padding-left: 1.2rem; margin: 0;">${formattedSummary}</ul>
        </div>
    `;
    document.getElementById('article-reader-overlay').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('month-selector');
    if(selector) selector.addEventListener('change', renderDashboard);

    document.querySelectorAll('.pillar-list li').forEach(li => {
        li.addEventListener('click', () => {
            const active = document.querySelector('.pillar-list li.active');
            if(active) active.classList.remove('active');
            li.classList.add('active');
            renderDashboard();
        });
    });
    
    renderDashboard();
});
"""
    with open("app.js", "w", encoding="utf-8") as f:
        f.write(js_content)
    print("Database sync complete.")

if __name__ == "__main__":
    update_database()
