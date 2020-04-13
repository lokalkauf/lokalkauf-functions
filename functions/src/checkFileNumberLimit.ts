import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';


const MAX_NUMBER_OF_IMAGES = 6;


export const checkFileNumberLimit = functions.storage
  .object()
  .onFinalize(async (object) => {
    if (object.name !== undefined) {
      const filePath = object.name;
      const bucket = admin.storage().bucket();
      const directory = filePath.split('/').slice(0, 2).join('/');

      bucket
        .getFiles({ directory: directory })
        .then(function (files) {
          if (files[0].length > MAX_NUMBER_OF_IMAGES) {
            console.log('Reachd max file num. Delete File...');
            bucket
              .file(filePath)
              .delete()
              .catch(() => {
                console.log('File delete faild');
              });
          }
        })
        .catch(() => console.log('Check faild'));
    }
  });