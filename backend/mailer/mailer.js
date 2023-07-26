const nodeMailer = require('nodemailer');

const mailer = async (toEmail, subject, content) => {

        try {
        const html = `
        <h1>Bonjour</h1>
        <p>Voici une Confirmation que vous êtes bien inscrit</p>
        `;

        const transporter = nodeMailer.createTransport({
            host: 'smtp.seznam.cz',
            port: 465,
            secure: true,
            auth: {
                user: 'vutony@seznam.cz',
                pass: 'Test1234test'
            }
        });
        
        const info = await transporter.sendMail({
            from: 'Big Tony <vutony@seznam.cz>',
            to: 'honza.doan@gmail.com',
            subject: 'Test Message',
            html: html
        })

        console.log("Message sent: " + info.messageId);
    } catch (error) {
        // Handle any errors that occurred during user registration or email sending
    console.error(error);
    res.status(500).json({ error: 'An error occurred during user registration.' });
    }
};

module.exports = { mailer };

// main()
// .catch(e => console.log(e))