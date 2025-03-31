require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'soumenbhandari88@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-specific-password' // Use environment variable
    }
});

// Verify email configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Hardware communication endpoints
app.get('/api/status', (req, res) => {
    // Replace this with actual hardware communication
    res.json({
        status: 'online',
        power: 'on',
        energyUsage: '2.5 kWh',
        occupancy: true
    });
});

app.post('/api/control', (req, res) => {
    const { action, value } = req.body;
    // Replace this with actual hardware control
    console.log(`Sending command to hardware: ${action} = ${value}`);
    res.json({ success: true, message: `Command ${action} executed successfully` });
});

// Handle form submissions
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, interest, message } = req.body;

    // Validate input
    if (!name || !email || !phone || !interest || !message) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    try {
        // Send email
        const mailOptions = {
            from: 'soumenbhandari88@gmail.com',
            to: 'soumenbhandari88@gmail.com',
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Interest:</strong> ${interest}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);

        res.json({
            success: true,
            message: 'Message sent successfully!',
            messageId: info.messageId
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again.',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 