// Contact form API endpoint
// Integration instructions:
// - For SendGrid: npm install @sendgrid/mail, set SENDGRID_API_KEY env var
// - For AWS SES: npm install @aws-sdk/client-ses, configure AWS credentials
// - For development: logs to console

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (message.length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters' });
  }

  try {
    // For development: log to console
    console.log('📧 Contact Form Submission:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    console.log('---');

    // TODO: Integration with email service
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to: 'paul@example.com',
    //   from: 'noreply@paulmadu.com',
    //   subject: `Contact Form: ${name}`,
    //   text: message,
    //   html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
    // });

    // Example with AWS SES:
    // const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
    // const ses = new SESClient({ region: 'us-east-1' });
    // await ses.send(new SendEmailCommand({
    //   Source: 'noreply@paulmadu.com',
    //   Destination: { ToAddresses: ['paul@example.com'] },
    //   Message: {
    //     Subject: { Data: `Contact Form: ${name}` },
    //     Body: { Text: { Data: message } }
    //   }
    // }));

    return res.status(200).json({ 
      success: true, 
      message: 'Message received successfully' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
