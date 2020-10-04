import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const merklisteMetaPage = functions.https.onRequest(async (req, res) => {
  const path = req.path.split('/');
  const merklisteId = path[2];
  const documentRef = admin.firestore().doc('Merkliste_PUBLIC/' + merklisteId);
  const merklistePub = await documentRef
    .get()
    .then((snapshot: any) => {
      return snapshot.data();
    })
    .catch((err: any) => {
      console.log('Error getting documents', err);
    });
  const bucket = admin.storage().bucket();
  const imagePath = `Merklisten/${merklisteId}/thumb_224x224_preview.jpg.jpg`;
  const url =
    (await 'https://firebasestorage.googleapis.com/v0/b/') +
    bucket.name +
    '/o/' +
    encodeURIComponent(imagePath) +
    '?alt=media';
  res.status(200).send(buildHtmlWithMerkliste(merklistePub, url, merklisteId));
});

function buildHtmlWithMerkliste(merklistePub: any, imageUrl: string, merklisteId: string) {
  const url = functions.config().app.url;
  const html = `
<!DOCTYPE html><head>
<title>lokalkauf | ${merklistePub.name} </title>
<meta name="description" content="${merklistePub.description}"/>
<meta property="twitter:title" content="lokalkauf | ${merklistePub.name}"/>
<meta name="twitter:card" content="summary"/>
<meta name="twitter:description" content="${merklistePub.description}"/>
<meta name="twitter:image" content="${imageUrl}"/>
<meta name="twitter:site" content="@loaklkauf"/>
<meta name="twitter:creator" content="@lokalkauf"/>
<meta property="og:title" content="lokalkauf | ${merklistePub.name}"/>
<meta property="og:image" itemprop="image" content="${imageUrl}"/>
<meta property="og:type" content="web app"/>
<meta property="og:description" content="${merklistePub.description}"/>
<link rel="icon" href="https://www.lokalkauf.org/assets/lokalkauf-logo.svg"/>
</head><body>
<script>window.location.replace("${url}/bookmarks-public-redirect/${merklisteId}");</script>
</body></html>
`
  return html;
}