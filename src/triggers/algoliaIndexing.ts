import * as functions from 'firebase-functions';
import algoliasearch from 'algoliasearch';

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
// const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;
const ALGOLIA_INDEX_NAME = 'traders_st';

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

export const createAlgoliaIndex = functions.firestore
    .document('/Traders/{traderId}')
    .onCreate(async (snap, _) => {
        const trader = snap.data();
        if (trader) {
            // Add an 'objectID' field which Algolia requires
            trader.objectID = snap.id;
            return index.saveObject(trader);
        }
        else {
            console.log('Undefined trader');
            return null;
        }
    });

export const updateAlgoliaIndex = functions.firestore
    .document('/Traders/{traderId}')
    .onUpdate(async (snap, _) => {
        const trader = snap.after.data();
        if (trader) {
            // Add an 'objectID' field which Algolia requires
            trader.objectID = snap.after.id;
            return index.saveObject(trader);
        }
        else {
            console.log('Undefined trader');
            return null;
        }
    });

export const deleteAlgoliaIndex = functions.firestore
    .document('/Traders/{traderId}')
    .onDelete(async (snap, _) => index.deleteObject(snap.id));
