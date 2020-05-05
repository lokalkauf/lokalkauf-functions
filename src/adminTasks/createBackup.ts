import {Stage, loadApp, getBackupBucket, callAsync } from './adminStage';
import * as backupService from '../common/services/db.backup';
import * as admin from 'firebase-admin';

/*
  call this admin task to create a backup manually
*/
async function creeateBackup() {

    const stage = process.argv[2] as Stage;
    const app = loadApp(stage);
    const projectID = (app.options.credential as any)?.projectId;
    const bucketName = getBackupBucket(stage);

    const credentials = { 
      client_email: (app.options.credential as any)?.clientEmail, 
      private_key:  (app.options.credential as any)?.privateKey
    };

    const firestoreClient = new admin.firestore.v1.FirestoreAdminClient({credentials: credentials, projectId: projectID});

    


    await backupService.backup(bucketName, projectID, app, firestoreClient); 
}

callAsync(creeateBackup);