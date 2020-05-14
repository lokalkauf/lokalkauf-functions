// import * as traders from '../../repositories/traders.repository';
import admin = require('firebase-admin');

function getServiceProvider(source: string){
    return require('./' + source +'/provider');
}

export async function importData(app: admin.app.App, source: string, options: any) {

    const provider = getServiceProvider(source); 
    const traders = await provider.loadData(options);

    if (traders && traders.length > 0) {

        for(const trader of traders) {
            try {
                // console.log(trader);
                // await traders.upsert(app, trader);
            } catch(e) {
                console.log('errow while importing', trader);
            }
        }

        console.log('items: ' + traders.length)
    }
}