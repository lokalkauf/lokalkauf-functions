import * as functions from 'firebase-functions';

const url = functions.config().app.url;

export const serveBaseSitemap = functions.https.onRequest(async (_req, res) => {
  const str = url + '/feedback\n' +
    url + '/aboutus\n' +
    url + '/press\n' +
    url + '/faq\n'
  res.type('text').status(200).send(str)
});
