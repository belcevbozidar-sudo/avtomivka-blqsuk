export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const EXTENDSCLASS_URL = 'https://extendsclass.com/api/json-storage/bin/bfefdfb';

  if (req.method === 'GET') {
    try {
      const response = await fetch(EXTENDSCLASS_URL);
      if (!response.ok) throw new Error('Extendsclass GET failed');
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const response = await fetch(EXTENDSCLASS_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
      });
      if (!response.ok) throw new Error('Extendsclass PUT failed');
      return res.status(200).json({ status: 'ok' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
