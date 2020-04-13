import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const traderDetail = functions.https.onRequest(async (req, res) => {
    const path = req.path.split('/');
    const traderId = path[2];
    const documentRef = admin.firestore().doc('Traders/' + traderId);
    const trader = await documentRef
      .get()
      .then((snapshot: any) => {
        return snapshot.data();
      })
      .catch((err: any) => {
        console.log('Error getting documents', err);
      });
    const bucket = admin.storage().bucket();
    let imagePath;
    if ( trader.defaultImagePath !== undefined ){
	imagePath = getPathToThumbnail(trader.defaultImagePath);
    } else {
	imagePath = "";
    }
    const url =
      (await 'https://firebasestorage.googleapis.com/v0/b/') +
      bucket.name +
      '/o/' +
      encodeURIComponent(imagePath) +
      '?alt=media';
    res.status(200).send(buildHtmlWithTrader(traderId, trader, url));
  });


function buildHtmlWithTrader(traderId: string, trader: any, imgUrl: string) {
    const url = functions.config().app.url;
    const string =
      '<!DOCTYPE html><head>' +
      '<title>lokalkauf | ' +
      trader.businessname +
      '</title>' +
      '<meta name="description" content="' +
      trader.description +
      '">' +
      '<meta property="twitter:title" content="lokalkauf | ' +
      trader.businessname +
      '">' +
      '<meta name="twitter:card" content="summary" />' +
      '<meta name="twitter:description" content="' +
      trader.description +
      '" />' +
      '<meta name="twitter:image" content="' +
      imgUrl +
      '" />' +
      '<meta name="twitter:site" content="@loaklkauf" />' +
      '<meta name="twitter:creator" content="@lokalkauf" />' +
      '<meta property="og:title" content="lokalkauf | ' +
      trader.businessname +
      '">' +
      '<meta property="og:image" itemprop="image" content="' +
      imgUrl +
      '" />' +
      '<meta property="og:image:width" content="200" />' +
      '<meta property="og:image:height" content="200" />' +
      '<meta property="og:type" content="web app" />' +
      '<meta property="og:description" content="' +
      trader.description +
      '" />' +
      '<link rel="icon" href="https://lokalkauf-staging.web.app/assets/logo.png">' +
      '</head><body>' +
      '<script>window.location.replace("' +
      url +
      '/trader-detail-redirect/' +
      traderId +
      '");</script>' +
      '</body></html>';
    return string;
  }
  
  function getPathToThumbnail(path: string) {
    const prefix = path.split('/').slice(0, -1).join('/');
    const filename = path
      .split('/')
      .slice(-1)
      .join()
      .split('.')
      .slice(0, -1)
      .join('.');
    const fileExtension = path
      .split('/')
      .slice(-1)
      .join()
      .split('.')
      .slice(-1)
      .join();
    return prefix + '/thumbs/' + filename + '_200x200.' + fileExtension;
  }
  
