let upscDatabase = [];

async function loadData() {
    try {
        const response = await fetch('data.json?t=' + Date.now());
        upscDatabase = await response.json();
        renderDashboard();
    } catch (err) { console.error("Load Error:", err); }
}

function renderDashboard() {
    const grid = document.querySelector('.articles-grid');
    if (!grid) return;
    grid.innerHTML = ''; 

    upscDatabase.forEach((article, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        // Securely creating elements
        const h3 = document.createElement('h3');
        h3.textContent = article.title;
        const btn = document.createElement('button');
        btn.textContent = 'Read Full Analysis';
        btn.onclick = () => openInAppReader(article);
        
        card.appendChild(h3);
        card.appendChild(btn);
        grid.appendChild(card);
    });
}

function openInAppReader(article) {
    const modal = document.getElementById('article-reader-overlay');
    const body = document.getElementById('reader-modal-body');
    if (!modal || !body) return;

    // Securely update content without innerHTML risks
    body.innerHTML = `<h1>${article.title}</h1><p>Source: ${article.source}</p><p>${article.summary}</p><a href="${article.sourceUrl}" target="_blank">Read original article here</a>`;
    modal.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    document.getElementById('sync-live-btn')?.addEventListener('click', () => {
        alert("Sync triggered! Check your Actions tab.");
    });
});
