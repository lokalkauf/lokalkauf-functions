import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const deleteUser = functions.auth.user().onDelete(async (user) => {
    admin
      .storage()
      .bucket()
      .deleteFiles({ prefix: `Traders/${user.uid}` }, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log(
            `All the Firebase Storage files in users/${user.uid}/ have been deleted`
          );
        }
      });
    await admin.firestore().doc(`Traders/${user.uid}`).delete();
    console.log(`Deleted Firestore document Traders/${user.uid}`);
    await admin.firestore().doc(`locations/${user.uid}`).delete();
    console.log(`Deleted Firestore document locations/${user.uid}`);
  });
  