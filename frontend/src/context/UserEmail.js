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
    from_email: "tanishguptadsa@gmail.com",
  };
  console.log("templateParams",templateParams)

  emailjs.send(
    "service_qb9zv0v",
    "template_fc9tjmb",
    templateParams,
    "RHS_8Uh_12ZB_A9JT"
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
