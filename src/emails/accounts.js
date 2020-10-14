const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        from: 'manchikantisaikiran7@gmail.com',
        to: email,
        subject: 'Thanks for joining us!',
        text: `welcome to the Task-Manager-App ${name}`
    })
}

const sendOffEmail = (email,name)=>{
    sgMail.send({
        from: 'manchikantisaikiran7@gmail.com',
        to: email,
        subject: 'Sorry to see you go!',
        text: `goodBye, ${name}. We hope to see you back!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendOffEmail
}