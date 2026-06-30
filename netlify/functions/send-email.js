const { Resend } = require('resend');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight OK' })
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { name, company, email, sector, message } = JSON.parse(event.body);

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: name, email, and message are required.' }),
      };
    }

    // Initialize Resend using the environment variable
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'Defence Force Security <onboarding@resend.dev>', // Replace with your verified domain in Resend if needed
      to: ['fenas.fnz@gmail.com'],
      subject: `New Enquiry from ${name} - Defence Force Security`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #ffb300; border-bottom: 2px solid #ffb300; padding-bottom: 10px; margin-top: 0;">
            Tactical Consultation Request
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 30%;">Full Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Organization:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${company}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                <a href="mailto:${email}" style="color: #ffb300; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Target Sector:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; text-transform: capitalize;">${sector}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Operational Brief:</td>
              <td style="padding: 10px 0; white-space: pre-line; line-height: 1.5;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message || 'Error sending email via Resend' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (error) {
    console.error('Serverless function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
