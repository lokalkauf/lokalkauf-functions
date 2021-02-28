import * as functions from 'firebase-functions';
import * as insightsService from '../common/services/insights';
import admin = require('firebase-admin');

export const insights = functions.pubsub
.schedule('every day 05:00')
    .onRun(async (_context) => {
        console.log("Project ID", process.env.GCLOUD_PROJECT);
        if (process.env.GCLOUD_PROJECT === "lokalkauf-271814"){
            await insightsService.traders(admin.app());
        }
    });
