// api/send-email.js
const { Resend } = require('resend');

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get request body
    const { nombre, telefono, mail, texto } = req.body;
    
    // Validate required fields
    if (!nombre || !telefono || !mail || !texto) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Impulsam Website <onboarding@resend.dev>', // Update with your verified domain
      to: 'impulsamnet@gmail.com', // Your company email address
      subject: `New Contact from ${nombre}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${nombre}</p>
        <p><strong>Phone:</strong> ${telefono}</p>
        <p><strong>Email:</strong> ${mail}</p>
        <p><strong>Message:</strong> ${texto}</p>
      `,
      reply_to: mail
    });

    if (error) {
      console.error('Resend API error:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};