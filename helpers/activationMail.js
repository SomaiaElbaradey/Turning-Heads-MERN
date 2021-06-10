"use strict";
const nodemailer = require("nodemailer");

module.exports.sendActivationMail = async function (
  userMail,
  username,
  userId
) {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "brandeldev@gmail.com",
        pass: process.env.mailPass,
      },
    });

    let info = await transporter.sendMail({
      from: {
        name: "Turning Heads",
        address: "brandeldev@gmail.com",
      },
      to: `${userMail}`,
      subject: `[Turning Heads] Welcome to Turning Heads ${username}`,
      text: "Welcome to Turning Heads",
      html: `
                   <body style="color: white; margin: 0 auto; width: 50%; background-color: black; padding:50px">
                    <h1>Welcome to Turning Heads!</h1>
                    <div style="color:rgb(18, 102, 95); background-color: white; 
                                    padding: 60px; border-radius: 5px; border: rgb(69, 85, 83) 2px solid;">
                        <h3>Almost done, ${username}! To complete your Turning Heads sign up, we just need to verify your 
                            email address: ${userMail}</h3>
                        <div>
                         <a none;" href="https://turning-heads.herokuapp.com/api/user/verify/${userId}">
                         <button style="height: 30px; background-color: #44c1c1c7; 
                         border: none; border-radius: 5%; margin: 10px; cursor: pointer;"> Verify your mail address</button><br>
                         </a>
                        </div>
                        <img style="margin: 20px auto; cursor:default; width:20vw;" src="cid:myImage" alt="Turning Heads">
                    </div>
                   </body>`,
    });

    console.log("Message sent: %s", info);
  } catch (err) {
    console.log(err.message);
  }
};
