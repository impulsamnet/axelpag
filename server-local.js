// server-local.js
require('dotenv').config({ path: '.env.local' });
const express = require('express');
const { Resend } = require('resend');
const path = require('path');

// Initialize app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Email API endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { nombre, telefono, mail, texto } = req.body;
    
    // Validate required fields
    if (!nombre || !telefono || !mail || !texto) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    console.log('Sending email with data:', { nombre, telefono, mail, texto });

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Impulsam Website <onboarding@resend.dev>',
      to: 'impulsamnet@gmail.com', // Asegúrate de cambiar esto por tu correo
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

    console.log('Email sent successfully:', data);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`API endpoint available at http://localhost:${port}/api/send-email`);
});