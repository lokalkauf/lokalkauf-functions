import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const url = functions.config().app.url;

export const serveTraderSitemap = functions.https.onRequest(async (_req, res) => {
  genTraderSitemap().then(str => {
    res.type('text').status(200).send(str)
  }).catch((err: any) => {
    console.error(err);
  });
});

async function genTraderSitemap() {
  const snapshot = await admin.firestore().collection('Traders').get();
  let str = "";
  for (const doc of snapshot.docs) {
    str += url + '/trader-detail/' + doc.id + '\n';
  }
  return str;
}
