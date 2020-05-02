import * as admin from 'firebase-admin';

export async function backup(bucketName: string, app: admin.app.App = admin.app()) {

    const projectId = app.options.projectId;
    const backupBucket = bucketName;
    const firestoreClient = new admin.firestore.v1.FirestoreAdminClient()
    const databaseName = firestoreClient.databasePath(projectId, '(default)');
  
    console.log(databaseName);
    
    return firestoreClient
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
}