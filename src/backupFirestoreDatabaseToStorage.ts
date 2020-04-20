import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const backupFirestoreDatabaseToStorage = functions.pubsub
.schedule('every day 00:00')
.onRun(async (_context) => {
  const projectId = admin.app().options.projectId;
  const backupBucket = functions.config().app.backupbucket;
  const client = new admin.firestore.v1.FirestoreAdminClient();
  const databaseName = client.databasePath(projectId, '(default)');
  console.log(databaseName);
  return client
    .exportDocuments({
      name: databaseName,
      outputUriPrefix: backupBucket,
      collectionIds: [],
    })
    .then((responses: any) => {
      const response = responses[0];
      console.log(`Operation Name: ${response['name']}`);
      return true;
    })
    .catch((err: any) => {
      console.error(err);
      throw new Error('Export operation failed');
    });
});