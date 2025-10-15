// api/news.js - Vercel serverless function
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY;

        if (!NEWS_API_KEY) {
            return res.status(500).json({ error: 'News API key not configured' });
        }

        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=popularity&apiKey=${NEWS_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`NewsAPI error: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}