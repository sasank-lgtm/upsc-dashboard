// ====================================================
// UPSC 2026 DASHBOARD - CORE ENGINE
// ====================================================
let upscDatabase = [];

// 1. DATA LOADER: Fetches live data from the JSON engine
async function loadData() {
    try {
        const response = await fetch('data.json?t=' + new Date().getTime());
        if (!response.ok) throw new Error('Data sync failed');
        upscDatabase = await response.json();
        renderDashboard();
    } catch (err) {
        console.error("Dashboard Engine Error:", err);
        document.querySelector('.articles-grid').innerHTML = '<p style="text-align:center;">Failed to load data. Please click Sync to refresh.</p>';
    }
}

// 2. RENDERER: Builds the UI cards dynamically
function renderDashboard() {
    const grid = document.querySelector('.articles-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const activePillar = document.querySelector('.pillar-list li.active')?.getAttribute('data-pillar') || 'all';

    const filtered = upscDatabase.filter(item => 
        activePillar === 'all' || item.pillar === activePillar
    );

    filtered.forEach((article, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <span class="source-tag">${article.source}</span>
                <span class="time-tag">${article.time}</span>
            </div>
            <h3>${article.title}</h3>
            <p>${article.summary}</p>
            <button class="open-article-btn" data-index="${index}">Read Full Analysis</button>
        `;
        grid.appendChild(card);
    });

    // Re-bind click events after render
    document.querySelectorAll('.open-article-btn').forEach(btn => {
        btn.onclick = (e) => {
            const idx = e.target.getAttribute('data-index');
            openInAppReader(filtered[idx]);
        };
    });
}

// 3. MODAL MANAGER: Displays article in the overlay
function openInAppReader(article) {
    const modal = document.getElementById('article-reader-overlay');
    const body = document.getElementById('reader-modal-body');
    
    if (modal && body) {
        body.innerHTML = `
            <h1>${article.title}</h1>
            <p><strong>Source:</strong> ${article.source}</p>
            <div style="margin:20px 0;">${article.fullAnalysis.replace(/\\n/g, '<br><br>')}</div>
            <div style="background:#f8fafc; padding:15px; border-radius:8px; border-left:4px solid #3b82f6;">
                <h3>Key Prelims Facts</h3>
                <p>${article.prelimsSummary.replace(/\\n/g, '<br>')}</p>
            </div>
        `;
        modal.style.display = 'flex';
    }
}

// 4. INITIALIZER: Bind events on load
document.addEventListener('DOMContentLoaded', () => {
    loadData();

    // Bind Filter List
    document.querySelectorAll('.pillar-list li').forEach(li => {
        li.onclick = () => {
            document.querySelector('.pillar-list li.active')?.classList.remove('active');
            li.classList.add('active');
            renderDashboard();
        };
    });

    // Bind Sync Button
    document.getElementById('sync-live-btn')?.addEventListener('click', () => {
        alert("Automation active: GitHub Actions is handling the sync. Check your repository Actions tab to see the live progress.");
    });

    // Bind Modal Close
    window.onclick = (e) => {
        const modal = document.getElementById('article-reader-overlay');
        if (e.target === modal) modal.style.display = 'none';
    };
});
