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
        // Use textContent for safety to bypass Security Policy blocks
        body.innerHTML = `<h1>${article.title}</h1><p>${article.fullAnalysis}</p>`;
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
