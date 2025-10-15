// api/news.js - Vercel serverless function for Guardian API
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
        const GUARDIAN_API_KEY = process.env.VITE_GUARDIAN_API_KEY;

        if (!GUARDIAN_API_KEY) {
            return res.status(500).json({ error: 'Guardian API key not configured' });
        }

        const response = await fetch(
            `https://content.guardianapis.com/search?q=${encodeURIComponent(query)}&api-key=${GUARDIAN_API_KEY}&show-fields=thumbnail,headline,trailText,bodyText&page-size=10&order-by=relevance`
        );

        if (!response.ok) {
            throw new Error(`Guardian API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Transform Guardian API response to match your existing UI structure
        const transformedData = {
            articles: data.response.results.map(item => ({
                title: item.webTitle,
                description: item.fields?.trailText || item.fields?.bodyText?.substring(0, 200) + '...' || 'No description available',
                url: item.webUrl,
                urlToImage: item.fields?.thumbnail || 'https://via.placeholder.com/92x92?text=No+Image',
                source: {
                    name: 'The Guardian'
                },
                publishedAt: item.webPublicationDate
            }))
        };

        res.status(200).json(transformedData);

    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}