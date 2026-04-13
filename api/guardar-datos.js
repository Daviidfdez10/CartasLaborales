export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const response = await fetch('https://api.jsonbin.io/v3/b', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': process.env.JSONBIN_API_KEY,
      'X-Bin-Private': 'true'
    },
    body: JSON.stringify(req.body)
  });

  const data = await response.json();
  res.status(200).json({ binId: data.metadata.id });
}