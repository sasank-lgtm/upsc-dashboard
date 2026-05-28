# UPSC CSE 2026 Current Affairs Dashboard 🚀

A lightweight, high-yield, fully responsive digital study portal engineered specifically for UPSC Civil Services Examination preparation. This platform acts as a decentralized static databank that organizes monthly current affairs into core syllabus pillars, optimized for both deep structural answer-writing and quick factual revision.

📱 **Live Mobile-Responsive Link:** [Access the Dashboard Now](https://sasank-lgtm.github.io/upsc-dashboard/)

---

## 🌟 Key Architecture & Features

### 1. Dual-Section Pedagogical Layout
When opening an analytical bulletin inside the application reader, the data dynamically partitions into two distinct exam-oriented views:
* **Section 1: Detailed Mains Policy Analysis:** Immersive, multi-paragraph dossiers covering underlying systemic bottlenecks, structural friction, multi-sectoral impacts, and forward-looking administrative recommendations suitable for GS Papers II and III.
* **Section 2: High-Yield Prelims Bulletins:** Crisp, isolated fact blocks tracking statutory bodies, constitutional provisions (e.g., Article 82, Article 142), geographic landmarks, and technical specifications designed for instant elimination practice.

### 2. Multi-Dimensional Navigation
* **Syllabus Pillars:** Filter historical feeds instantaneously by core themes—*Polity & Governance*, *Economy & Infrastructure*, *Environment & Ecology*, and *Science & Technology*.
* **Source Badge Isolators:** Narrow down content streams directly by primary tracking authorities such as the **Press Information Bureau (PIB)**, **The Hindu**, and verified **Government Portals**.
* **Archive Timeline Dropdowns:** Quickly cycle backward through distinct historical monthly caches.

### 3. Native Fluid Responsiveness
The interface is engineered with a mobile-first paradigm utilizing custom CSS media queries:
* **Desktop View:** Features a side-by-side split view with a static structural navigation control tower and an expansive dual-column article matrix.
* **Mobile View:** Gracefully transforms into an ergonomic vertical column stack with a horizontal swipable top carousel for thumb-friendly reading on the go.

---

## 🛠️ Built With

* **HTML5:** Semantic document structure optimized for lightning-fast DOM rendering.
* **CSS3:** Custom properties (CSS variables), Flexbox grid alignments, and viewport-responsive media break queries for a modern dark-theme visual footprint.
* **Vanilla JavaScript:** Native ES6 data-driven compilation framework utilizing array filtering methods (`.filter()`, `.forEach()`) without heavy third-party framework dependencies.

---

## 📂 File Directory Tree

```text
upsc-dashboard/
│
├── index.html       # Application backbone, structural containers, and filter navigation controls.
├── style.css       # Core design engine, dark theme tokens, and mobile-responsive layouts.
└── app.js          # Unified analytical databank, dynamic filter logic, and interactive modal renderer.

🧑‍💻 Local Installation & Contribution Workflow
If you want to pull this archive locally onto your PC to customize your own study pillars or expand the dataset:

1 Clone the Repository:
git clone [https://github.com/sasank-lgtm/upsc-dashboard.git](https://github.com/sasank-lgtm/upsc-dashboard.git)

2 Launch a Local Server:

Open the directory in your code editor (e.g., VS Code).

Right-click index.html and choose Open with Live Server or run a local Python terminal server:
python -m http.server 8000

3 Adding New Bulletins:
Open app.js and push a structured object schema into the master upscDatabase array layout:
{
    month: "MonthName",
    pillar: "pillar-identifier",
    source: "Primary Publication Node",
    time: "Exact Publication Date",
    sourceUrl: "[https://verified-source-link.gov.in](https://verified-source-link.gov.in)",
    title: "Core Analytical Heading",
    summary: "Brief card teaser text.",
    fullAnalysis: `Mains relevant analysis paragraphs...`,
    prelimsSummary: `* **Fact Node:** Associated prelims metadata point.`
}


📑 Verifiable Sources Utilized
Press Information Bureau (PIB Delhi)

The Hindu / Indian Express Editorial Desks

Ministry Bulletins (MoEFCC, MeitY, MNRE)

Supreme Court Gazettes & Law Reviews

