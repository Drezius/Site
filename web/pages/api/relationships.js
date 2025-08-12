export default async function handler(req, res) {
  if (!req.cookies.user) return res.status(401).json({ error: 'Unauthorized' });
  
  const user = JSON.parse(req.cookies.user);
  const baseUrl = 'http://backend/api';
  
  if (req.method === 'GET') {
    const response = await fetch(`${baseUrl}/relationships`, {
      headers: { 'Cookie': `user=${req.cookies.user}` },
    });
    res.status(response.status).json(await response.json());
  } else if (req.method === 'POST') {
    const response = await fetch(`${baseUrl}/relationships`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': `user=${req.cookies.user}`,
      },
      body: JSON.stringify(req.body),
    });
    res.status(response.status).json(await response.json());
  } else {
    res.status(405).end();
  }
}