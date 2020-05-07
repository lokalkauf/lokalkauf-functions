import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

export const sendCustomVerifyMail = functions.auth
  .user()
  .onCreate(async (user) => {
    const url = functions.config().app.url;
    const apiKey = functions.config().app.apikey;

    let link = '';
    let parameter;

    if (typeof user.email === 'undefined') {
      return;
    }

    const verify_email = functions.config().app.email_verification;
    if (verify_email !== 'false') {
      link = await admin.auth().generateEmailVerificationLink(user.email);
      parameter = link.split('&');
      const finalLink =
                url +
                '/verify?mode=verifyEmail&' +
                parameter.slice(1, 2) +
                '&apiKey=' +
                apiKey +
                '&lang=de';

      sgMail.setApiKey(functions.config().mail.sendgrid.api_key);

      sgMail
        .send({
          from: 'lokalkauf < info@lokalkauf.org >',
          to: user.email,
          subject: 'Bestätige deine E-Mail-Adresse für lokalkauf',
          templateId: 'd-e8b544e2d76242fdac65fafdae382e37',
          dynamicTemplateData: {
            verification_url: finalLink,
          },
        })
        .then(
          (result) => {
            console.log('Sent email');
          },
          (err) => {
            console.error(err);
          }
        );
    } else {
      admin.auth()
        .updateUser(user.uid, { emailVerified: true })
        .then(
          (result) => {
            console.log('Email verified without user interaction.');
          },
          (err) => {
            console.error(err);
          }
        );
    }
  });

