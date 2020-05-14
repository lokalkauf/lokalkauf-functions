import * as functions from 'firebase-functions';
import * as insightsService from '../common/services/insights';
import admin = require('firebase-admin');

export const insights = functions.pubsub
.schedule('every day 05:00')
.onRun(async (_context) => {
    await insightsService.traders(admin.app());
 })