import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";



export const updatePublicBookmark = functions.firestore
  .document('/Merkliste/{merklisteId}')
  .onUpdate(async (snap, _) => {
    const privateBookmark = snap.after.data();
    if (privateBookmark !== undefined && privateBookmark.publicid) {
      const document = admin.firestore().doc(`Merkliste_PUBLIC/${privateBookmark.publicid}`);
      await document.update({
        bookmarks: privateBookmark.bookmarks,
        name: privateBookmark.name,
        geojson: privateBookmark.geojson,
        description: privateBookmark.description ? privateBookmark.description : '',
      }).catch(err => console.log(`Public document does not exist: ${err}`));
    }
  });


export const deletePublicBookmark = functions.firestore
  .document('/Merkliste/{merklisteId}')
  .onDelete(async (snap, _) => {
    const privateBookmark = snap.data();
    if (privateBookmark && privateBookmark.publicid) {
      await admin.firestore().doc(`Merkliste_PUBLIC/${privateBookmark.publicid}`)
        .delete()
        .catch(err => console.log(`Public document does not exist: ${err}`));
    }
  });
