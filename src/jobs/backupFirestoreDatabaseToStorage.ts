import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as backupService from '../common/services/db.backup';

export const backupFirestoreDatabaseToStorage = functions.pubsub
.schedule('every day 00:00')
.onRun(async (_context) => {

  const projectID =  admin.app().options.projectId as string;
  const bucketName = functions.config().app.backupbucket;

  return await backupService.backup(bucketName, projectID);
});