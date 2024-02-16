import emailjs from '@emailjs/browser';

function sendEmailNotification  (email , {message})  {
    console.log("Sending email notification...");
  const templateParams = {
    from_name: "Twitter Clone",
    from_email: "tanishkhandelwaldsa16@gmail.com",
    to_email: email,
    message: message,
  };
  emailjs
  .send(
    "service_tk7k8dn",
    "template_6wesx6j",
    templateParams,
  )
  .then((response) => {
    console.log("Email sent successfully:", response);
  })
  .catch((error) => {
    console.error("Error sending email:", error);
  });
};


export {
sendEmailNotification,
};
