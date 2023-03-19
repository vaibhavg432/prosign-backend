const nodemailer = require("nodemailer");

module.exports.sendMail = (
    mailOptions,
    transporterOptions = {
        service: "gmail",
        user: "graminfreelancer@gmail.com",
        pass: "gsqugqglavnegkkf",
    }
) => {
    const transporter = nodemailer.createTransport({
        service: transporterOptions.service,
        auth: {
            user: transporterOptions.user,
            pass: transporterOptions.pass,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mail = {
        from: transporterOptions.user,
        to: mailOptions.to,
        bcc: mailOptions.bcc,
        subject: mailOptions.subject,
        text: mailOptions.text,
        html: mailOptions.html,
    };

    transporter.sendMail(mail, function (error, info) {
        if (error) {
            console.log(error);
            return error;
        }
        return info;
    });
};