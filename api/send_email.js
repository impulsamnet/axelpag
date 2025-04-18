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
    const { nombre, telefono, mail, texto, recaptchaResponse } = req.body;

    // Validate required fields
    if (!nombre || !telefono || !mail || !texto) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Opcionalmente validar reCAPTCHA en el servidor
    // Si deseas implementar esta validación, necesitarás hacer una petición a la API de reCAPTCHA

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Impulsam Website <noreply@impulsam.net>', // Actualiza con tu dominio verificado
      to: 'impulsamnet@gmail.com', // Tu dirección de correo electrónico
      subject: `Nuevo contacto de ${nombre}`,
      html: `
        <h2>Nuevo mensaje desde el formulario de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Email:</strong> ${mail}</p>
        <p><strong>Mensaje:</strong> ${texto}</p>
      `,
      reply_to: mail
    });

    if (error) {
      console.error('Error de API Resend:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Error del servidor:', err);
    return res.status(500).json({ error: 'Error al enviar el email' });
  }
};