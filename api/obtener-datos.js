export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { binId } = req.query;
  if (!binId) return res.status(400).json({ error: 'binId requerido' });

  const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
    headers: { 'X-Master-Key': process.env.JSONBIN_API_KEY }
  });

  const data = await response.json();
  res.status(200).json(data.record);
}