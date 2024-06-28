import nodemailer from "nodemailer";

// el transporter contiene la información del correo que envía el email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        // LUEGO CAMBIAR AL CORREO DE LA EMPRESA
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

console.log(process.env.MAIL_USER)
console.log(process.env.MAIL_PASS)

export const sendEmail = async (to, subject, text, html) => {

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent");
    } catch (error) {
        console.log(error);
    }

}