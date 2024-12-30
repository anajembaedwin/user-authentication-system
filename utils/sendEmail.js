const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io', // Use Mailtrap's SMTP host
        port: 587, // Typically use 587 for secure connections
        auth: {
            user: process.env.MAILTRAP_USER, // Mailtrap username from your Mailtrap account
            pass: process.env.MAILTRAP_PASS, // Mailtrap password from your Mailtrap account
        },
    });

    const mailOptions = {
        from: `"Support Team" <support@example.com>`, // Can use a generic or domain-specific sender
        to: options.email, // Recipient's email
        subject: options.subject, // Email subject
        text: options.message, // Email message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
