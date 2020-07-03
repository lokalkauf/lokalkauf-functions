import * as importService from '../common/services/import/import.service';
import admin = require('firebase-admin');
import { callAsync } from './adminStage';

async function importData(app: admin.app.App) {
    console.log('start import...');

    const options = {
        region: 'unna'
        // , file: '/tmp/lokalkauf/import.csv'
    }
    
    await importService.importData(app, 'lokalwirkt', options);
}

callAsync(importData);