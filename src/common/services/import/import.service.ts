import * as tradersRepo from '../../repositories/traders.repository';
import admin = require('firebase-admin');
import { TraderProfile } from '../../models/traderProfile';





const WEIGHTS_OF_COMP_INDEX: any =  {
    businessname:  10,
    ownerFirstname: 10,
    ownerLastname: 10,
    postcode: 10,
    city: 10,
    street: 10,
    number: 10,
    description: 10,
    pickup: 5,
    delivery: 5,
    openingTime: 20,
    email: 25,
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

    const provider = getServiceProvider(source); 
    const traders = await provider.loadData(options);

    if (traders && traders.length > 0) {

        for(const trader of traders) {
            try {
                // console.log(trader);
                buildCompletenessIndex(trader);
                // console.log(trader.completenessIndex);
                // await traders.upsert(app, trader);
            } catch(e) {
                console.log('errow while importing', trader);
            }
        }

        const sortedTraders = (traders as []).sort((a: any, b: any) => a.completenessIndex - b.completenessIndex);
        sortedTraders.forEach((t:any) => {
               // console.log(t.completenessIndex);
                // console.log(t);
        });

        await tradersRepo.upsert(app, sortedTraders.reverse()[0]);        

        console.log('items: ' + traders.length)
    }
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