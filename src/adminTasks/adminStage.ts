import * as admin from 'firebase-admin';
const devStageSecret = require("../../secrets/lokalkauf-security-testing-secret.json");
const intStageSecret = require("../../secrets/lokalkauf-staging-secrets.json");
const prodStageSecret = require("../../secrets/prod-secret.json");




export enum Stage {
    DEVELOPMENT = "development",
    INTEGRATION = "integration",
    PRODUCTION = "production"
}

export function getBackupBucket(stage: Stage){
    switch(stage) {
        case Stage.DEVELOPMENT:
            return 'gs://lokalkauf-st-backup-bucket';
        case Stage.INTEGRATION:
            return 'gs://staging-backup-bucket';
        case Stage.PRODUCTION:
            return 'gs://production-backup-bucket';
    }
}

export function loadApp(stage: Stage) {
    switch(stage) {
        case Stage.DEVELOPMENT:
            return loadAdminApp(devStageSecret, 
                "https://lokalkauf-security-testing.firebaseio.com",
                "gs://lokalkauf-security-testing.appspot.com");
        case Stage.INTEGRATION:
            return loadAdminApp(intStageSecret, 
                "https://lokalkauf-staging.firebaseio.com",
                "gs://lokalkauf-staging.appspot.com"); 
        case Stage.PRODUCTION:
            return loadAdminApp(prodStageSecret, 
                "https://lokalkauf-271814.firebaseio.com",
                "gs://lokalkauf-271814.appspot.com");                       
     }
}

function loadAdminApp(secret:any, dbUrl: string, storageBucketUrl: string) {
    return admin.initializeApp({
        credential: admin.credential.cert(secret),
        databaseURL: dbUrl,
        storageBucket: storageBucketUrl
    });
}