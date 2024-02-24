import emailjs from '@emailjs/browser';

function sendEmailNotification  (email , {message})  {
  console.log("email",email)
  console.log("message",message)
    console.log("Sending email notification...");
  const templateParams = {
    from_name: "Twitter Clone",
    to_name: "User",
    message: message,
    to_email: email,
    from_email: "tktanishkhandelwal16@gmail.com",
  };
  console.log("templateParams",templateParams)

  emailjs.send(
    "service_5ucb2st",
    "template_ra39xpk",
    templateParams,
    "qsoqW-iWrKOynfhzO"
  )
  console.log("hellcdevfdo")
  .then((response) => {
    console.log("Email has been sent:", response);
  })
  .catch((error) => {
    console.error("Error ", error);
  });
};


export {
sendEmailNotification,
};
