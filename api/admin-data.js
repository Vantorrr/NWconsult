import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { lang = 'ru' } = req.query || {};
  const filename = `admin-data-${lang}.json`;

  try {
    if (req.method === 'GET') {
      const items = await list({ prefix: filename });
      if (!items || !items.blobs || items.blobs.length === 0) {
        return res.status(200).json({});
      }
      const url = items.blobs[0].url;
      const r = await fetch(url);
      if (!r.ok) return res.status(200).json({});
      const data = await r.json().catch(() => ({}));
      return res.status(200).json(data || {});
    }

    if (req.method === 'POST') {
      const data = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
      await put(filename, JSON.stringify(data || {}), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false
      });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('admin-data error', e);
    return res.status(200).json({});
  }
}



