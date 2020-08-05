import { callAsync, loadFunctionsConfig } from './adminStage';
import { createIndex } from '../common/services/create.index';
import { TraderIndex } from '../common/models/traderIndex';
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
  const objects: Array<TraderIndex> = [];
  await traders.docs.map(async doc => {
    if (doc.data().status === 'PUBLIC') {
      await createIndex(doc).then(t =>
        objects.push(t)
      );
    }
  });
  console.log(objects);
  index.saveObjects(objects).catch((error) => {
    console.log(error);
  });
}

callAsync(uploadAlgoliaIndecies);
