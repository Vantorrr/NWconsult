import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Expect JSON with { name, contentBase64 }
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { name, contentBase64 } = body;
    if (!name || !contentBase64) {
      return res.status(400).json({ error: 'name and contentBase64 are required' });
    }

    const repoOwner = 'Vantorrr';
    const repoName = 'NWconsult';
    const branch = 'main';
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const safeName = name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const path = `uploads/${Date.now()}-${safeName}`;

    await octokit.repos.createOrUpdateFileContents({
      owner: repoOwner,
      repo: repoName,
      path,
      message: `chore(upload): add ${safeName}`,
      content: contentBase64, // should already be base64 without data: prefix
      branch,
    });

    // Public URL served by Vercel after rebuild
    return res.status(200).json({ ok: true, url: `/${path}` });
  } catch (e) {
    console.error('upload-image error', e);
    return res.status(500).json({ error: e.message || 'Failed to upload' });
  }
}


