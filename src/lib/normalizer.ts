export const TAG_ALIASES: Record<string, string> = {
  js: "javascript",
  ecmascript: "javascript",
  ts: "typescript",
  next: "next.js",
  nextjs: "next.js",
  reactjs: "react",
  "react.js": "react",
  vuejs: "vue",
  "vue.js": "vue",
  nuxt: "nuxtjs",
  "nuxt.js": "nuxtjs",
  py: "python",
  golang: "go",
  k8s: "kubernetes",
  ai: "artificial intelligence",
  ml: "machine learning",
  llm: "large language models",
  nlp: "natural language processing",
  pg: "postgresql",
  postgres: "postgresql",
  css3: "css",
  html5: "html",
  tailwind: "tailwindcss",
  node: "nodejs",
  "node.js": "nodejs",
  csharp: "c#",
  cpp: "c++",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  gcp: "gcp",
  azure: "azure",
  openai: "openai",
  llama: "llama",
  huggingface: "hugging face",
  svelte: "svelte",
  solid: "solidjs",
  bun: "bun",
  deno: "deno",
  rustlang: "rust",
  solidity: "solidity",
  web3: "web3",
  blockchain: "blockchain",
  serverless: "serverless",
  edge: "edge computing",
};

export function normalizeTag(tag: string): string {
  if (!tag) return "";
  const lowerTag = tag.trim().toLowerCase();
  
  // Remove common prefixes/suffixes if needed (e.g., "-lang")
  const stripped = lowerTag.replace(/-lang$/, "");
  
  // Lookup in aliases dictionary
  return TAG_ALIASES[stripped] || stripped;
}

export function extractTagsFromText(text: string): string[] {
    const textLower = text.toLowerCase();
    const foundTags = new Set<string>();
    
    // To be thorough, we check BOTH keys (aliases) and values (canonical)
    const keywords = Array.from(new Set([
        ...Object.keys(TAG_ALIASES),
        ...Object.values(TAG_ALIASES)
    ])).filter(k => k.length > 2 || k === 'go' || k === 'c' || k === 'c#'); 
    
    keywords.forEach((keyword) => {
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // If keyword ends with a special char (like # or +), \b won't match. 
        // We use a custom boundary: (start of string or non-word) + keyword + (end of string or non-word/space)
        let regex: RegExp;
        if (/[#+]$/.test(keyword)) {
            regex = new RegExp(`(^|[^a-zA-Z0-9])${escapedKeyword}([^a-zA-Z0-9]|$)`, 'i');
        } else {
            regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
        }
        
        if (regex.test(textLower)) {
            foundTags.add(normalizeTag(keyword));
        }
    });

    return Array.from(foundTags);
}

export type EcosystemKey = "All" | "Frontend" | "Systems" | "AI / ML" | "DevOps" | "Backend";

export const ECOSYSTEM_FILTERS: Record<EcosystemKey, string[]> = {
  All: [],
  Frontend: ["react", "next.js", "vue", "nuxtjs", "svelte", "typescript", "javascript", "css", "html", "tailwindcss", "angular", "vite"],
  "AI / ML": ["python", "machine learning", "large language models", "natural language processing", "pytorch", "tensorflow", "artificial intelligence", "hugging face", "llama", "openai", "ollama"],
  Systems: ["rust", "go", "c++", "c", "linux", "webassembly", "zig", "kernel", "assembly"],
  Backend: ["nodejs", "postgresql", "redis", "docker", "prisma", "graphql", "rest", "django", "fastapi", "express", "elixir", "ruby", "java", "spring"],
  DevOps: ["kubernetes", "docker", "terraform", "ci/cd", "github actions", "aws", "gcp", "azure", "linux", "nginx", "cloudflare"],
};
