// ====================================================
// UPSC 2026 DASHBOARD - SECURE RENDERER
// ====================================================
let upscDatabase = [];

async function loadData() {
    try {
        const response = await fetch('data.json?t=' + new Date().getTime());
        upscDatabase = await response.json();
        renderDashboard();
    } catch (err) {
        console.error("Dashboard Engine Error:", err);
    }
}

function renderDashboard() {
    const grid = document.querySelector('.articles-grid');
    if (!grid) return;
    grid.innerHTML = ''; // Clear existing

    const activePillar = document.querySelector('.pillar-list li.active')?.getAttribute('data-pillar') || 'all';

    const filtered = upscDatabase.filter(item => 
        activePillar === 'all' || item.pillar === activePillar
    );

    filtered.forEach((article, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        // Create title
        const title = document.createElement('h3');
        title.textContent = article.title;
        // Create button
        const btn = document.createElement('button');
        btn.className = 'open-article-btn';
        btn.textContent = 'Read Full Analysis';
        btn.onclick = () => openInAppReader(article);
        
        card.appendChild(title);
        card.appendChild(btn);
        grid.appendChild(card);
    });
}
function openInAppReader(article) {
    const modal = document.getElementById('article-reader-overlay');
    const body = document.getElementById('reader-modal-body');
    
    if (modal && body) {
        body.innerHTML = `
            <h1 style="color:#1e293b;">${article.title}</h1>
            <p style="color:#64748b;"><strong>Source:</strong> ${article.source} | <strong>Date:</strong> ${article.time}</p>
            <hr>
            <div style="margin:20px 0; line-height:1.6;">${article.fullAnalysis}</div>
            <div style="background:#f1f5f9; padding:15px; border-radius:8px;">
                <h3>Read More</h3>
                <a href="${article.sourceUrl}" target="_blank" style="color:#2563eb;">Click here to visit the original source</a>
                <h3 style="margin-top:20px;">Quick Fact Check</h3>
                <p>${article.prelimsSummary.replace(/\\n/g, '<br>')}</p>
            </div>
            <button onclick="document.getElementById('article-reader-overlay').style.display='none'" style="margin-top:20px; width:100%; padding:10px;">Close Analysis</button>
        `;
        modal.style.display = 'flex';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    document.querySelectorAll('.pillar-list li').forEach(li => {
        li.onclick = () => {
            document.querySelector('.pillar-list li.active')?.classList.remove('active');
            li.classList.add('active');
            renderDashboard();
        };
    });
});
