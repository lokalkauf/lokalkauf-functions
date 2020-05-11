import * as admin from 'firebase-admin';
const devStageSecret = require("../../secrets/lokalkauf-security-testing-secret.json");
const intStageSecret = require("../../secrets/lokalkauf-staging-secrets.json");
const prodStageSecret = require("../../secrets/prod-secret.json");
const spawn = require('child_process').spawn;



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

export async function loadApp(stageName?: Stage) {
    const stage = (stageName)? stageName : process.argv[2] as Stage;

    switch(stage) {
        case Stage.DEVELOPMENT:
            return await loadAdminApp(devStageSecret, 
                "https://lokalkauf-security-testing.firebaseio.com",
                "gs://lokalkauf-security-testing.appspot.com");
        case Stage.INTEGRATION:
            return await loadAdminApp(intStageSecret, 
                "https://lokalkauf-staging.firebaseio.com",
                "gs://lokalkauf-staging.appspot.com"); 
        case Stage.PRODUCTION:
            return await loadAdminApp(prodStageSecret, 
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
                    await func(await loadApp());
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

async function loadFunctionsConfig(){

    return new Promise((resolve, reject) => {
        let out = {};

        const cmd = spawn('firebase', ['functions:config:get']);
        cmd.stdout.setEncoding('utf8');
        cmd.stdout.on('data', (data: any) => {
            out = JSON.parse(data);
        });
        cmd.stderr.on('data', (err: any) => {
            reject(err);
        });
        cmd.on('close', (code: any) => {
            resolve(out);
        });
    });
}

async function loadAdminApp(secret:any, dbUrl: string, storageBucketUrl: string) {

    const functionConfig = await loadFunctionsConfig();

    // console.log(functionConfig);

    const config: any = functionConfig;                                // process.env.FIREBASE_CONFIG;
    config.databaseURL = dbUrl;
    config.storageBucket = storageBucketUrl;
    config.credential = admin.credential.cert(secret);

    return admin.initializeApp(config);
}