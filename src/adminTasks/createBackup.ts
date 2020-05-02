import {Stage, loadApp, getBackupBucket } from './adminStage';
import * as backupService from '../common/services/db.backup';

/*
  call this admin task to create a backup manually
*/
async function creeateBackup() {

   const stage = process.argv[2] as Stage;

   console.log(`backupd the ${stage} stage...`);
   const app = loadApp(stage);


   console.log(getBackupBucket(stage));

   await backupService.backup(getBackupBucket(stage), app); 
}

new Promise(async (res, rej) => {
    await creeateBackup();
});