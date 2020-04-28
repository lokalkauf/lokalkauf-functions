import {Stage, loadApp } from './adminStage';

const app = loadApp(Stage.DEVELOPMENT);

/*
   this task is for administrative purposes only, to perform an initial update.
   updates all "locations" with categories from "Traders"
   storeType complextType will be transformed to simple string array: ['gastro', 'fashion']
   this is needed for the selection and filtering of locations (location based search with paging)
*/

async function updateLocations() {
    const result = await app.firestore().collection('Traders').get();
    console.log("tradeers loaded... " + result.docs.length);

    if (result && result.docs && result.docs.length > 0) {
        result.docs.forEach(async doc => {
            const id = doc.id;
            const categories = doc.data().storeType;

            let usedCategories:string[] = [];
            if (categories) {
                console.log(`${id} : ${categories} `);

                usedCategories = Object.keys(categories).filter(k => categories[k] === true);
            }

            console.log(`update categoriees of location: ${usedCategories}`);

            await app.firestore()
               .collection('locations')
               .doc(id)
               .set({
                    d : {
                        categories: usedCategories
                    }
                }, {merge:true});             
        });
    }
}

new Promise(async (res, rej) => {
    await updateLocations();
});