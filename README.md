# Tech Ecosystem Intelligence Dashboard

A centralized, real-time platform designed to aggregate, normalize, and score technology trends from disparate sources. It answers the critical question: **"Which frameworks, languages, and tools are gaining genuine traction across the industry right now?"**

Built by **Team Shadow Garden** (Aman Painuly, Vishwas Chaudhary, Amol Singhal, Vaishnavi Bhandari).

---

## 🚀 Core Features & Advanced Implementations

### 1. Live Multi-Source Data Ingestion
The dashboard eliminates the need to jump between tabs by querying multiple APIs simultaneously upon page load:
- **GitHub**: Scrapes the weekly trending page via `cheerio` (since GitHub's API lacks accurate "stars gained this week" metrics).
- **HackerNews**: Queries the Firebase API, fetching the top story IDs and their details in parallel.
- **StackOverflow**: Fetches `/questions` sorted by `hot`.
- **Dev.to**: Fetches trending `/api/articles`.
- **Lobsters**: Ingests trending developer discussions.

### 2. Intelligent Tag Normalization Engine (`normalizer.ts`)
Different platforms return data inconsistently (e.g., lowercase slugs on Dev.to vs. proper casing on GitHub vs. zero tags natively on HackerNews).
- **Alias Dictionary**: Contains ~50 rules deduplicating terms (e.g., "reactjs", "react.js", and "react" all merge to "react").
- **Regex Extraction**: A custom regular expression parser scans post titles and descriptions to extract implicit technologies when native tags are absent. Special handlers are included to correctly identify languages with special characters like **C#** and **C++** without breaking standard word boundaries.

### 3. Cross-Platform Diversity Scoring (`aggregation.ts`)
To prevent a single viral post on one platform from dominating the overall ecosystem rank, we implemented a custom scoring algorithm:
- **Source Weighting**: High-signal sources (like GitHub repositories) apply a higher base multiplier than community discussion boards (like Lobsters).
- **Logarithmic Diversity Multiplier**: Technologies trending across independent platforms receive a compounded bonus. We apply the formula:  
  `Final Score = Base Score × (1 + log₂(source_count) × 0.8)`  
  This ensures a technology mentioned on three different platforms scores meaningfully higher than a technology spiking heavily on just one.

### 4. Idea Researcher
A native cross-platform search engine page. When a user queries a topic (e.g., "WebSockets"), the backend concurrently searches:
- GitHub (Repositories)
- Dev.to (Articles)
- Reddit (Discussions in r/programming)
- StackOverflow (Q&A)

### 5. Gemini AI Repository Comparison (`/api/compare`)
Paste two GitHub repository URLs, and the dashboard will automatically:
1. Fetch the raw README markdown of both repositories.
2. Construct a specialized prompt.
3. Call the **Google Gemini 2.5 Flash** API to generate a detailed, side-by-side Markdown comparison table.
- **Resiliency Engine**: Includes an exponential backoff loop. If it encounters a `503 Service Unavailable` error, it retries automatically, eventually falling back to **Gemini 1.5 Flash** to guarantee a successful response.

### 6. Interactive UI & Global State
- **Universal CMD+K Command Palette**: Live keyboard-driven navigation and global search across the dashboard.
- **Global Ecosystem Filters**: Users can select "Frontend", "AI/ML", "Backend", "DevOps", or "Systems". This global state is wired into all child components, instantly filtering all charts, raw feeds, and stats simultaneously.
- **Hydration Safe**: Dynamically generated dates and timestamps are carefully deferred via `useEffect` to safely mount on the client, eliminating Next.js hydration mismatches.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) — Zero backend database, entirely Server-Side Rendered (SSR) on demand.
- **Styling**: Tailwind CSS v4 (Premium Dark Theme)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Integration**: Google Generative AI (`@google/generative-ai`)
- **Data Extractor**: Cheerio (HTML Parsing)
- **Deployment**: Vercel

---

## 📦 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Amanpainuly33/Tech-Ecosystem-Intelligence-Dashboard.git
cd Tech-Ecosystem-Intelligence-Dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory to enable the Gemini comparison feature:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000).

### 5. Production Build
```bash
npm run build
```
*(The codebase has successfully passed production builds with zero TypeScript warnings).*

---

## 📡 Challenges Overcome & API Limitations

- **Reddit Rate Limits (403 Forbidden)**: Reddit strictly blocks server-side requests without a custom browser-like `User-Agent`. We successfully bypassed this by spoofing specific headers, paired with graceful empty-state fallbacks if aggressive rate limits are hit.
- **GitHub Limitations**: To get accurate "stars gained this week" data which the official API does not provide, we use Cheerio to scrape the DOM. *Be advised that DOM changes by GitHub may require scraping updates.*
- **Unauthenticated API Scaling**: StackExchange limits unauthenticated traffic to 300 requests/day. If hosted on a shared platform like Vercel (Free Tier), the IP pool may encounter `429 Too Many Requests`. For production scaling, OAuth/API tokens will be required.

---

## 🔮 Future Scope
- **Persistent Tracking**: Incorporating SQLite to track how technology scores change week-over-week.
- **Expanded Aggregation**: Integrating ProductHunt, npm download statistics, and X (Twitter) discussions for enhanced signals.
- **Personalized Watchlists & Email Digests**: Empowering users to pin stacks and receive weekly summaries of ecosystem changes.
