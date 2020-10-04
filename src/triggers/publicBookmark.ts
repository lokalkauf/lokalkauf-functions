import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { imageBuilder } from '../common/services/generate-some-merkliste';



export const updatePublicBookmark = functions.firestore.document("/Merkliste/{merklisteId}").onUpdate(async (snap, _) => {
  const privateBookmark = snap.after.data();
  if (privateBookmark !== undefined && privateBookmark.publicid) {
    const document = admin.firestore().doc(`Merkliste_PUBLIC/${privateBookmark.publicid}`);
    await document
      .update({
        bookmarks: privateBookmark.bookmarks,
        name: privateBookmark.name,
        geojson: privateBookmark.geojson,
        description: privateBookmark.description ? privateBookmark.description : "",
        isActive: privateBookmark.publicactive ? privateBookmark.publicactive : false,
      })
      .catch((err) => console.log(`Public document does not exist: ${err}`));
    const imagePaths: string[] = [];
    await Promise.all(privateBookmark.bookmarks.map(
      async (bookmark: any) => {
        const trader = (await admin.firestore().doc(`Traders/${bookmark.traderid}`).get()).data();
        if (trader && trader.defaultImagePath && trader.defaultImagePath.length > 0) {
          const defaultImage = trader.defaultImagePath.substring(trader.defaultImagePath.lastIndexOf("/") + 1);
          imagePaths.push(`Traders/${bookmark.traderid}/BusinessImages/thumb_224x224_${defaultImage}.jpg`);
        }
      }
    ));
    imageBuilder(imagePaths, privateBookmark.publicid)
      .then((result) => console.log("Result: " + result))
      .catch((err) => console.log("Error: " + err));
  }
});

export const deletePublicBookmark = functions.firestore.document("/Merkliste/{merklisteId}").onDelete(async (snap, _) => {
  const privateBookmark = snap.data();
  if (privateBookmark && privateBookmark.publicid) {
    await admin
      .firestore()
      .doc(`Merkliste_PUBLIC / ${privateBookmark.publicid}`)
      .delete()
      .catch((err) => console.log(`Public document does not exist: ${err}`));
  }
});
