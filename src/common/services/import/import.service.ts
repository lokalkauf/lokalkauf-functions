import * as tradersRepo from '../../repositories/traders.repository';
import admin = require('firebase-admin');
import { TraderProfile, TraderProfileStatus } from '../../models/traderProfile';
import moment = require('moment');


let adminApp: admin.app.App;


const WEIGHTS_OF_COMP_INDEX: any =  {
    businessname:  10,
    ownerFirstname: 5,
    ownerLastname: 5,
    postcode: 10,
    city: 10,
    street: 10,
    number: 10,
    description: 15,
    pickup: 2,
    delivery: 2,
    openingTime: 20,
    email: 50,
    telephone: 20,
    homepage: 20,
    confirmedLocation: 50,
    defaultImagePath: 0
}

const MAX_COMP_SCORE = Object.values(WEIGHTS_OF_COMP_INDEX)
                                    .map(v => v as number)
                                    .reduce((a,b) => a + b);


function getServiceProvider(source: string){
    return require('./' + source +'/provider');
}

export async function importData(app: admin.app.App, source: string, options: any) {

    if (!adminApp)
        adminApp = app;

    const provider = getServiceProvider(source); 
    const traders = await provider.loadData(options, app);

    if (traders && traders.length > 0) {

        for(const trader of (traders as []).filter((t: TraderProfile) => t.storeType) ) {
            try {
                // console.log(trader);
                (trader as any).import_date = moment(Date.now()).unix();
                buildCompletenessIndex(trader);

                
                // console.log(trader);
                // await tradersRepo.import_osm(app, trader);
            } catch(e) {
                console.log('errow while importing: ' + (trader as any).businessname, e);
            }
        }

        const trToImport = (traders as []).filter((t: TraderProfile) => t.completenessIndex > 30 && !t.storeType.handwerk);

        console.log('all    : ' + traders.length + '  \nimport : ' + trToImport.length);

        for(const ti of trToImport) {
            (ti as TraderProfile).status = TraderProfileStatus.PUBLIC;
            await tradersRepo.import_osm(app, ti);
        }

        // const sortedTraders = (traders as []).sort((a: any, b: any) => a.completenessIndex - b.completenessIndex);
        // sortedTraders.forEach((t:any) => {
        //        console.log(t.completenessIndex);
        //         // console.log(t);
        // });

        // await tradersRepo.upsert(app, sortedTraders.reverse()[0]);        

        console.log('items: ' + trToImport.length)
    }
}

export async function putItemToCache(item: any, app: admin.app.App) { 
    await tradersRepo.import_osmcache_item(item, adminApp);
}

export async function getItemFromCache(itemID: any, app: admin.app.App) { 
    return await tradersRepo.load_osmcache_item(itemID, adminApp);
}


function buildCompletenessIndex(trader:TraderProfile) {
    let currentIndex = 0;

    if (trader) {

        for(const key of Object.keys(trader)){
            const prop = (trader as any)[key];
            if (prop && WEIGHTS_OF_COMP_INDEX[key]) {
                if (Array.isArray(prop)) {
                    if ((prop as []).length > 0)
                        currentIndex += WEIGHTS_OF_COMP_INDEX[key];
                }
                else if (prop.toString().trim().length > 0)
                   currentIndex += WEIGHTS_OF_COMP_INDEX[key];
            }   
        }

        // calculates the ratio depends on the max possible score
        trader.completenessIndex = 100 / MAX_COMP_SCORE * currentIndex;
    }
}