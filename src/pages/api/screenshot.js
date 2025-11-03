// API endpoint to generate website screenshots using external service
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Validate URL format
    new URL(url);

    // Using screenshotone.com API (free tier available)
    // Alternative services: 
    // - screenshot.rocks
    // - apiflash.com
    // - screenshot-api.com
    
    // For simplicity, we'll use a free screenshot service URL
    // This returns an image directly without needing an API key
    const screenshotUrl = `https://image.thum.io/get/width/1200/crop/800/maxAge/1/noanimate/${encodeURIComponent(url)}`;
    
    // Return the screenshot URL
    res.status(200).json({ 
      success: true,
      screenshotUrl,
      originalUrl: url 
    });

  } catch (error) {
    console.error('Screenshot API error:', error);
    res.status(500).json({ 
      error: 'Failed to generate screenshot',
      message: error.message 
    });
  }
}
