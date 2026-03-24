# Global Developer Intelligence Dashboard

A real-time dashboard that answers: **"Where should I focus as a developer right now?"**

## 🚀 Features

- **GitHub Trending**: Shows repositories created in the last 7 days with the most stars.
- **StackOverflow**: Top hot questions and discussions.
- **Dev.to**: Trending articles and posts.
- **Hacker News**: Top stories from the tech world.
- **Reddit**: Hot topics from r/programming.
- **Visual Analytics**: Interactive topic clouds and language popularity heatmaps.

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Premium Dark Theme)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel (Recommended)

## 📡 API Integrations & Limitations

This MVP uses public, unauthenticated APIs. While free, they come with limitations:

| Service | Endpoint Used | Limitation / Rate Limit | Strategy Used |
|Str|Str|Str|Str|
| **GitHub** | `github.com/trending` (Scraping) | **Note**: We scrape the official `github.com/trending?since=weekly` page to get accurate "stars gained this week" data, which the official API lacks. This may be fragile if GitHub changes their HTML. |
| **StackExchange** | `GET /questions` | 300 requests/day | Sorted by `hot`, Cached 1h |
| **Dev.to** | `GET /api/articles` | Generous (approx 1 req/sec) | Cached 1h |
| **Hacker News** | Firebase API | No strict rate limit documented | Fetched top 5 IDs then details in parallel |
| **Reddit** | `GET /r/programming/hot.json` | Requires custom User-Agent | User-Agent header added to request |

### ⚠️ Important Note

Because these APIs are being called from the server component (Node.js environment) without API keys:
1. **Rate Limiting**: If you deploy this to a shared server (like Vercel Free Tier), the IP might be shared, leading to faster 429 errors from GitHub/StackOverflow.
2. **Production Use**: For a production app, you should register applications with each provider and use OAuth/API Keys to increase rate limits.

## 📦 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```
