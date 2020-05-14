import {callAsync } from './adminStage';
import admin = require('firebase-admin');

/*
    sample call:

    node ./lib/adminTasks/service-call development    insights        traders
                                           ↑             ↑               ↑
                                         STAGE      SERVICE_NAME   SERVICE_FUNCTION

*/
async function callService(app: admin.app.App) {

    console.log('CALL SERVICE: ' + app);

    const serviceName =  process.argv[3];
    const serviceMethod = process.argv[4];

    const service = require('../common/services/' + serviceName);

    await service[serviceMethod](app);
}

callAsync(callService);