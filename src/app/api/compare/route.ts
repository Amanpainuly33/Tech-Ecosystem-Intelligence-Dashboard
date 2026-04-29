import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { repos } = body;
    
    if (!repos || !Array.isArray(repos) || repos.length < 2) {
      return NextResponse.json({ error: "Need at least 2 repos to compare" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const limitedRepos = repos.slice(0, 5);

    const fetchReadme = async (fullName: string) => {
      try {
        const res = await fetch(`https://api.github.com/repos/${fullName}/readme`, {
          headers: {
            "User-Agent": "Developer-Intelligence-Dashboard"
          }
        });
        if (!res.ok) return "No README found or accessible.";
        const data = await res.json();
        return Buffer.from(data.content, "base64").toString("utf-8");
      } catch {
        return "No README found or accessible.";
      }
    };

    const readmes = await Promise.all(limitedRepos.map((repo) => fetchReadme(repo.fullName)));

    let prompt = "You are a technical assistant helping developers choose open-source libraries. Compare the following GitHub repositories based on their README files and metadata.\n\n";

    limitedRepos.forEach((repo, index) => {
      prompt += `### Repository ${index + 1}: ${repo.fullName}\n`;
      prompt += `**Description**: ${repo.description}\n`;
      prompt += `**Stars**: ${repo.stars} | **Forks**: ${repo.forks} | **Language**: ${repo.language || 'N/A'}\n`;
      prompt += `**README Preview**: \n${readmes[index].slice(0, 15000)}\n\n`;
    });

    prompt += "OUTPUT REQUIREMENT: Your output MUST be ONLY a single Markdown table. Do not include any introductory prose, overviews, summaries, or recommendations. The table should have categories as rows (e.g., Primary Use Case, Key Features, Tech Stack, Deployment, Maintenance Status, Stars/Forks) and the repositories as columns. Keep cell contents extremely concise (use ultra-brief phrases or bullet points where necessary) to optimize readability and minimize token usage.";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = ["gemini-2.5-flash", "gemini-1.5-flash"];
    
    let responseText = "";
    let lastError: any;

    for (let i = 0; i < models.length; i++) {
      try {
        const model = genAI.getGenerativeModel({ model: models[i] }); 
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        break;
      } catch (error: any) {
        lastError = error;
        console.warn(`Attempt ${i + 1} with ${models[i]} failed:`, error?.message || error);
        
        if (i === models.length - 1) break;

        const isRetryable = error?.status === 503 || error?.status === 429 || 
                            String(error).includes("503") || String(error).includes("429") ||
                            String(error).includes("fetch failed");
                            
        if (isRetryable) {
          const delay = (i + 1) * 2000;
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error; 
        }
      }
    }

    if (!responseText) {
      console.error("Comparison failed:", lastError);
      return NextResponse.json({ error: "Failed to generate comparison. Please try again later." }, { status: 503 });
    }

    return NextResponse.json({ markdown: responseText });
  } catch (error) {
    console.error("Comparison API Error:", error);
    return NextResponse.json({ error: "Failed to generate comparison." }, { status: 500 });
  }
}
