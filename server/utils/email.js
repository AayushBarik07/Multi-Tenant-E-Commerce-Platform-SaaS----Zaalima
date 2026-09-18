const emailjs = require('@emailjs/nodejs');

// @desc Send order confirmation email using EmailJS
const sendOrderConfirmationEmail = async (customerEmail, orderTotal) => {
  try {
    // If EMAILJS keys aren't set, just mock the email for development
    if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID || !process.env.EMAILJS_PUBLIC_KEY) {
      console.log(`[DEV MODE - EmailJS] 📧 Mock Email sent to ${customerEmail} for $${(orderTotal / 100).toFixed(2)}`);
      return true;
    }

    const templateParams = {
      to_email: customerEmail,
      order_total: (orderTotal / 100).toFixed(2),
      // Add any other variables your EmailJS template expects here
    };

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY, // Required for Node.js usage
      }
    );

    console.log('EmailJS Success:', response.status, response.text);
    return true;
  } catch (error) {
    console.error('EmailJS Error:', error);
    return false;
  }
};

module.exports = {
  sendOrderConfirmationEmail
};
