import * as functions from 'firebase-functions';

import * as backupService from '../common/services/db.backup';

export const backupFirestoreDatabaseToStorage = functions.pubsub
.schedule('every day 00:00')
.onRun(async (_context) => {

  return await backupService.backup(functions.config().app.backupbucket);

});