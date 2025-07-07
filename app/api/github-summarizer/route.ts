import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { summarizeReadme } from '../../lib/summarizeReadme';

export async function POST(req: NextRequest) {
  const { githubUrl } = await req.json();
  const apiKey = req.headers.get('x-api-key');
  if (!githubUrl || !apiKey) {
    return NextResponse.json({ error: 'Missing githubUrl or apiKey' }, { status: 400 });
  }

  // Use service role key for secure server-side access
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Validate API key
  const { data: keyRecord, error } = await adminSupabase
    .from('api_keys')
    .select('*')
    .eq('key', apiKey)
    .single();

  if (error || !keyRecord) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const readme = await fetchReadmeFromGithub(githubUrl);
  if (!readme) {
    return NextResponse.json({ error: 'Failed to fetch README.md' }, { status: 500 });
  }
  // Summarize the README using langchain
  try {
    const summary = await summarizeReadme(readme);
    return NextResponse.json(summary);
  } catch (e: any) {
    console.error(e);
    // Check for OpenAI quota/insufficient funds error
    const errorMessage = e?.message || e?.toString() || '';
    if (errorMessage.toLowerCase().includes('insufficient_quota') || errorMessage.toLowerCase().includes('insufficient funds') || errorMessage.toLowerCase().includes('quota')) {
      return NextResponse.json({
        summary: `NOTE: The summary could not be generated due to insufficient OpenAI quota or funds.\n\n---\n\n${readme}`,
        cool_facts: []
      });
    }
    return NextResponse.json({ error: 'Failed to summarize README.md' }, { status: 500 });
  }
}

// Store the apiKey for use in summarizer logic (for now, just keep in a variable)
// const userApiKey = apiKey;
async function fetchReadmeFromGithub(githubUrl: string): Promise<string | null> {
  try {
    // Parse the githubUrl to extract owner and repo
    const match = githubUrl.match(
      /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/
    );
    if (!match) return null;
    const owner = match[1];
    const repo = match[2];

    // Try to fetch README.md from main or master branch
    const branches = ['main', 'master'];
    for (const branch of branches) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
      const res = await fetch(rawUrl);
      if (res.ok) {
        return await res.text();
      }
    }
    // If not found, try default branch via GitHub API
    const apiRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!apiRes.ok) return null;
    const repoData = await apiRes.json();
    if (repoData.default_branch) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${repoData.default_branch}/README.md`;
      const res = await fetch(rawUrl);
      if (res.ok) {
        return await res.text();
      }
    }
    return null;
  } catch {
    return null;
  }
}