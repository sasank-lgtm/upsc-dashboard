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
    const activePillar = document.querySelector('.pillar-list li.active').dataset.pillar;
    grid.innerHTML = ''; 

    const filtered = activePillar === 'all' ? upscDatabase : upscDatabase.filter(a => a.pillar === activePillar);

    filtered.forEach(article => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h3>${article.title}</h3>`;
        const btn = document.createElement('button');
        btn.textContent = 'Read Full Analysis';
        btn.onclick = () => openModal(article);
        card.appendChild(btn);
        grid.appendChild(card);
    });
}

function openModal(article) {
    const modal = document.getElementById('article-reader-overlay');
    const content = document.getElementById('content-area');
    content.innerHTML = `<h1>${article.title}</h1><p>${article.fullAnalysis || article.summary}</p><a href="${article.sourceUrl}" target="_blank">View Original</a>`;
    modal.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    // Sync Button
    document.getElementById('sync-live-btn').onclick = () => alert("Check GitHub Actions!");
    // Close Modal
    document.getElementById('close-modal-btn').onclick = () => document.getElementById('article-reader-overlay').style.display = 'none';
    // Pillar Filter
    document.querySelectorAll('.pillar-list li').forEach(li => {
        li.onclick = (e) => {
            document.querySelector('.pillar-list li.active').classList.remove('active');
            e.currentTarget.classList.add('active');
            renderDashboard();
        };
    });
});
