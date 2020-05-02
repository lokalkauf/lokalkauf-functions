import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';

export const sendGrid = functions.https.onCall(async (data, context) => {
    sgMail.setApiKey(functions.config().mail.sendgrid.api_key);
  
    sgMail
      .send({
        from: 'lokalkauf < info@lokalkauf.org >',
        to: data.toEmail,
        subject: data.title,
        templateId: data.templateId,
        dynamicTemplateData: data.teplateVars,
      })
      .then(
        (result) => {
          console.log('Sent email');
        },
        (err) => {
          console.error(err);
        }
      );
  
    sgMail
      .send({
        from: 'lokalkauf < info@lokalkauf.org >',
        to: data.fromEmail,
        subject: data.title,
        templateId: data.templateIdCopy,
        dynamicTemplateData: data.teplateVars,
      })
      .then(
        (result) => {
          console.log('Sent email');
        },
        (err) => {
          console.error(err);
        }
      );
  });