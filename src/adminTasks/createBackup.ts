import {Stage, loadApp, getBackupBucket, callAsync } from './adminStage';
import * as backupService from '../common/services/db.backup';

/*
  call this admin task to create a backup manually
*/
async function creeateBackup() {

    const stage = process.argv[2] as Stage;
    const app = loadApp(stage);
    const projectID = (app.options.credential as any)?.projectId;
    const bucketName = getBackupBucket(stage);

    


    await backupService.backup(bucketName, projectID, app); 
}

callAsync(creeateBackup);