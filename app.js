let upscDatabase = [];

async function loadData() {
    try {
        const response = await fetch('data.json?t=' + Date.now());
        upscDatabase = await response.json();
        renderCards(upscDatabase);
    } catch (err) { console.error("Sync Error:", err); }
}

function renderCards(data) {
    const grid = document.querySelector('.articles-grid');
    grid.innerHTML = '';
    data.forEach(article => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<h3>${article.title}</h3>`;
        const btn = document.createElement('button');
        btn.textContent = 'Read Full Analysis';
        btn.onclick = () => openModal(article);
        div.appendChild(btn);
        grid.appendChild(div);
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
    document.getElementById('sync-live-btn').onclick = () => alert("Check GitHub Actions tab!");
    document.getElementById('close-modal-btn').onclick = () => document.getElementById('article-reader-overlay').style.display = 'none';
    
    document.querySelectorAll('.pillar-list li').forEach(li => {
        li.onclick = (e) => {
            document.querySelector('.pillar-list li.active').classList.remove('active');
            e.target.classList.add('active');
            const pillar = e.target.getAttribute('data-pillar');
            renderCards(pillar === 'all' ? upscDatabase : upscDatabase.filter(a => a.pillar === pillar));
        };
    });
});
