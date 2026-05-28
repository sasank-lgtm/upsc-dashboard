let upscDatabase = [];

async function initDashboard() {
    console.log("Initializing Dashboard...");
    try {
        const response = await fetch('data.json?v=' + new Date().getTime());
        upscDatabase = await response.json();
        console.log("Data loaded:", upscDatabase);
        renderDashboard();
    } catch (e) {
        console.error("Fetch failed. Trying local mock data.");
        // Fallback if fetch fails
        upscDatabase = [{ title: "System Ready", pillar: "polity", source: "Internal", time: "Now", summary: "Data loaded", fullAnalysis: "System online.", prelimsSummary: "Ready." }];
        renderDashboard();
    }
}

function renderDashboard() {
    const grid = document.querySelector('.articles-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const chosenMonth = document.getElementById('month-selector').value;
    const activeLi = document.querySelector('.pillar-list li.active');
    const chosenPillar = activeLi ? activeLi.getAttribute('data-pillar') : 'all';

    upscDatabase.filter(item => {
        return (chosenMonth === "all-months" || item.month === chosenMonth) &&
               (chosenPillar === "all" || item.pillar === chosenPillar);
    }).forEach((article, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h3>${article.title}</h3><button class="open-article-btn" data-index="${index}">Read</button>`;
        grid.appendChild(card);
    });

    // Re-bind all click events
    document.querySelectorAll('.open-article-btn').forEach(btn => {
        btn.onclick = (e) => {
            const idx = e.target.getAttribute('data-index');
            openInAppReader(upscDatabase[idx]);
        };
    });
}

function openInAppReader(article) {
    document.getElementById('article-reader-overlay').style.display = 'flex';
    document.getElementById('reader-modal-body').innerHTML = `<h1>${article.title}</h1><p>${article.fullAnalysis}</p>`;
}

// Attach filters to window so they are always available
window.onload = () => {
    initDashboard();
    document.getElementById('month-selector').onchange = renderDashboard;
    document.querySelectorAll('.pillar-list li').forEach(li => {
        li.onclick = () => {
            document.querySelector('.pillar-list li.active')?.classList.remove('active');
            li.classList.add('active');
            renderDashboard();
        };
    });
};
