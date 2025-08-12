export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const response = await fetch('http://backend/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // Simples autenticação - em produção usar cookies seguros
    res.setHeader('Set-Cookie', `user=${JSON.stringify(data.user)}; Path=/`);
    res.status(200).json(data);
  } else {
    res.status(response.status).json(data);
  }
}