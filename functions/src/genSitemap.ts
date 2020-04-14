import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const bucket = admin.storage().bucket()
const url = functions.config().app.url;

export const genSitemap = functions.pubsub.schedule('every day 00:00')
  .onRun(async (_context) => {
    const file = bucket.file('Data/trader.txt');
    const ws = file.createWriteStream();
    const snapshot = await admin.firestore().collection('Traders').get()
    for (const doc of snapshot.docs) {
      ws.write(url + '/trader-detail/' + doc.id + '\n');
    }
    ws.end();
  });
