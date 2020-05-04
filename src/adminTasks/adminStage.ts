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

export function loadApp(stageName?: Stage) {
    const stage = (stageName)? stageName : process.argv[2] as Stage;

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
        default:
            throw new Error(`

                ${stage} is an unknown Stage! available stages are: ${Object.keys(Stage)}
            
            `);                    
     }
}

export function callAsync(...fncts: Function[]) {

    try {
        new Promise(async (res, rej) => {
            for(const func of fncts) {
                try {
                    await func(loadApp());
                } catch (e) {
                    console.log('ERROR occured: ' + e + '\n\n', e);                    
                    //rej(e);
                    break;
                }
            }

            res();
        });

    } catch(err) {
        console.log('error occured: ' + err);
    }
}

function loadAdminApp(secret:any, dbUrl: string, storageBucketUrl: string) {
    return admin.initializeApp({
        credential: admin.credential.cert(secret),
        databaseURL: dbUrl,
        storageBucket: storageBucketUrl
    });
}