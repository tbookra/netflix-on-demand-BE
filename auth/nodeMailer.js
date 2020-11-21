const nodemailer = require('nodemailer');
password = process.env.EMAIL_PASSWORD;
NGROK_PATH = process.env.NGROK_PATH;


const sendEmail = async (user,type) =>{
    const register_message =  {
        subject: 'wellcome to NETFLIXonDEMAND',
        text: 'You have successfully registered!',
        html: `<b> wellcome abord ${user.full_name}</b><br>
        <form action= "${NGROK_PATH}/auth/ConfirmationAccepted" mothod="get" target="_self">
        
                <button>Confirm</button>
                </form>
        `,
    };
    
    const password_change_message =  {
        subject: 'Your password has been successfuly chainged!',
        text: 'You have successfully chainged your password!',
        html: '<b> Now you can go back to enjoy our site </b>',
    };

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user:'netflixondemandproject@gmail.com',
            pass: password,
        },
        tls: {
            rejectUnauthorized:false
        }
    });
    
    let mailOptions = {
        from: 'netflixondemandproject@gmail.com',
        to: user.email,
        subject: type === "register" ? register_message.subject : password_change_message.subject,
        text: type === "register" ? register_message.text : password_change_message.text,
        html: type === "register" ? register_message.html : password_change_message.html,
    };
     
    
    transporter.sendMail(mailOptions, function(err,data){
    if(err) {
        console.log('error', err)
    } else {
        console.log('email sent!!')
    }
    })
};

module.exports.sendEmail = sendEmail;
