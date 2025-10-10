export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { lang = 'ru' } = req.query || {};
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'Vantorrr/NWconsult';
  const BRANCH = 'main';
  const filename = `data/admin-${lang}.json`;

  if (req.method === 'GET') {
    // Читаем данные из repo
    try {
      const url = `https://api.github.com/repos/${REPO}/contents/${filename}?ref=${BRANCH}`;
      const r = await fetch(url, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!r.ok) {
        if (r.status === 404) return res.status(200).json({});
        throw new Error(`GitHub API: ${r.status}`);
      }
      
      const json = await r.json();
      const content = Buffer.from(json.content, 'base64').toString('utf-8');
      return res.status(200).json(JSON.parse(content));
    } catch (e) {
      console.error('GET error:', e);
      return res.status(200).json({});
    }
  }

  if (req.method === 'POST') {
    // Сохраняем данные в repo через commit
    try {
      if (!GITHUB_TOKEN) {
        return res.status(500).json({ error: 'GITHUB_TOKEN not set' });
      }

      const data = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
      const content = JSON.stringify(data, null, 2);
      const encodedContent = Buffer.from(content).toString('base64');

      // Получаем SHA файла (если существует)
      let sha = null;
      try {
        const getUrl = `https://api.github.com/repos/${REPO}/contents/${filename}?ref=${BRANCH}`;
        const getRes = await fetch(getUrl, {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (getRes.ok) {
          const existing = await getRes.json();
          sha = existing.sha;
        }
      } catch (e) {}

      // Создаём/обновляем файл
      const putUrl = `https://api.github.com/repos/${REPO}/contents/${filename}`;
      const putBody = {
        message: `chore(data): update admin-${lang}.json via admin panel`,
        content: encodedContent,
        branch: BRANCH
      };
      if (sha) putBody.sha = sha;

      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(putBody)
      });

      if (!putRes.ok) {
        const err = await putRes.text();
        throw new Error(`GitHub PUT failed: ${putRes.status} ${err}`);
      }

      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('POST error:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

