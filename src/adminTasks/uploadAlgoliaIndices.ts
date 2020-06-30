import { callAsync, loadFunctionsConfig } from './adminStage';
import * as admin from 'firebase-admin';
import algoliasearch from 'algoliasearch';

/* 
   Admin task which creates indecies for existing and public traders
   Usage:    node uploadAlgoliaIdecies.ts stage
   Example:  node uploadAlgoliaIdecies.ts integration
*/

async function uploadAlgoliaIndecies() {
    const config: any = await loadFunctionsConfig();
    const ALGOLIA_ID = config.algolia.app_id;
    const ALGOLIA_ADMIN_KEY = config.algolia.api_key;
    const ALGOLIA_INDEX_NAME = config.algolia.index_name;

    const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    const traders = await admin.firestore().collection('Traders').get();
    traders.docs.forEach(async doc => {
        let trader: any;
        trader = doc.data();
        if (trader.hasOwnProperty('confirmedLocation')) {
            trader._geoloc = {
                'lat': Number(trader.confirmedLocation[0]),
                'lng': Number(trader.confirmedLocation[1])
            };
        }
        trader.objectID = doc.id;
        if (trader.status === 'PUBLIC') {
            index.saveObject(trader);
            console.log('Created index');
        }
        else {
            console.log('Tader not public');
        }
    });
}

callAsync(uploadAlgoliaIndecies);
