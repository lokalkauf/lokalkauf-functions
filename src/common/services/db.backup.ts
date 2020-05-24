import * as admin from 'firebase-admin';

export async function backup(backupBucket: string, projectId: string, app: admin.app.App = admin.app(), firestoreClient: any = new admin.firestore.v1.FirestoreAdminClient()) {

    try {        
        console.log(`start backupd the ${projectId} stage...`);

        const databaseName = firestoreClient.databasePath(projectId, '(default)');
        
        await firestoreClient.exportDocuments({
            name: databaseName,
            outputUriPrefix: backupBucket,
            collectionIds: [],
        });

        console.log(`backup of ${projectId} successfully completed.`);
        return true;

    } catch(err) {
        console.error(err);
        throw new Error('Export operation failed');        
    }
}