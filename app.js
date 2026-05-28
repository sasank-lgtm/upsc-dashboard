let upscDatabase = [];

// 1. Fetch data first
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Could not fetch data.json');
        upscDatabase = await response.json();
        renderDashboard(); // Render happens only after data arrives
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// 2. Render and re-attach listeners
function renderDashboard() {
    const grid = document.querySelector('.articles-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const chosenMonth = document.getElementById('month-selector').value;
    const activeLi = document.querySelector('.pillar-list li.active');
    const chosenPillar = activeLi ? activeLi.getAttribute('data-pillar') : 'all';

    let filteredList = upscDatabase.filter(item => {
        const matchesMonth = (chosenMonth === "all-months" || item.month === chosenMonth);
        const matchesPillar = (chosenPillar === "all" || item.pillar === chosenPillar);
        return matchesMonth && matchesPillar;
    });

    if (filteredList.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem;">No articles found.</div>`;
        return;
    }

    // Generate HTML first
    filteredList.forEach(article => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <span class="source-tag">${article.source}</span>
                <span class="time-tag">${article.time}</span>
            </div>
            <h3>${article.title}</h3>
            <p>${article.summary}</p>
            <button class="open-article-btn">Read Full Analysis</button>
        `;
        grid.appendChild(card);
    });

    // 3. ATTACH LISTENERS ONLY NOW: After cards are in the DOM
    document.querySelectorAll('.open-article-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => openInAppReader(filteredList[index]));
    });
}

// 4. Modal handler
function openInAppReader(article) {
    const modal = document.getElementById('article-reader-overlay');
    const body = document.getElementById('reader-modal-body');
    
    body.innerHTML = `
        <h1>${article.title}</h1>
        <p><strong>Source:</strong> ${article.source}</p>
        <div>${article.fullAnalysis.replace(/\\n/g, '<br><br>')}</div>
        <div style="margin-top:20px; padding:10px; background:#f0f0f0;">
            <h3>Prelims Facts</h3>
            <p>${article.prelimsSummary.replace(/\\n/g, '<br>')}</p>
        </div>
    `;
    modal.style.display = 'flex';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    // Re-attach listeners for filter selectors
    document.getElementById('month-selector').addEventListener('change', renderDashboard);
    document.querySelectorAll('.pillar-list li').forEach(li => {
        li.addEventListener('click', () => {
            document.querySelector('.pillar-list li.active')?.classList.remove('active');
            li.classList.add('active');
            renderDashboard();
        });
    });
});
