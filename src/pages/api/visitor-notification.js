// API endpoint to send email notifications when someone visits the site
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { page, userAgent, referrer, timestamp } = req.body;

  // Get client IP (handling proxies)
  const ip = req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] || 
             req.connection.remoteAddress;

  try {
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport(process.env.SMTP_URL);

    // Verify connection configuration
    await transporter.verify();

    // Email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .info-item { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
          .label { font-weight: bold; color: #667eea; }
          .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎉 New Site Visitor!</h2>
          </div>
          <div class="content">
            <div class="info-item">
              <span class="label">📄 Page:</span> ${page || 'Unknown'}
            </div>
            <div class="info-item">
              <span class="label">🕒 Time:</span> ${new Date(timestamp).toLocaleString()}
            </div>
            <div class="info-item">
              <span class="label">🌐 IP Address:</span> ${ip || 'Unknown'}
            </div>
            <div class="info-item">
              <span class="label">💻 User Agent:</span> ${userAgent || 'Unknown'}
            </div>
            <div class="info-item">
              <span class="label">🔗 Referrer:</span> ${referrer || 'Direct visit'}
            </div>
          </div>
          <div class="footer">
            <p>This is an automated notification from your portfolio site.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
New Site Visitor!

Page: ${page || 'Unknown'}
Time: ${new Date(timestamp).toLocaleString()}
IP Address: ${ip || 'Unknown'}
User Agent: ${userAgent || 'Unknown'}
Referrer: ${referrer || 'Direct visit'}

This is an automated notification from your portfolio site.
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.EMAIL,
      subject: `🎉 New Visitor on Your Portfolio - ${page}`,
      text: emailText,
      html: emailHtml,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Notification sent successfully' 
    });
  } catch (error) {
    console.error('Visitor notification error:', error);
    return res.status(500).json({ 
      error: 'Failed to send notification',
      message: error.message 
    });
  }
}
