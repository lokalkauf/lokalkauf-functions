import {Stage, loadApp } from './adminStage';
import * as admin from 'firebase-admin';




/*
   this task is for administrative purposes only, to perform an initial update.
   updates all "locations" with categories from "Traders"
   storeType complextType will be transformed to simple string array: ['gastro', 'fashion']
   this is needed for the selection and filtering of locations (location based search with paging)
   replicates some properties, which are needed for the overview or for the map view
*/

async function updateLocations() {
    const app = await loadApp(Stage.INTEGRATION);

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

            // user not undefined values only to update value
            const data = doc.data();
            const value: any = {
                categories: usedCategories,
            };

            if (data.businessname) value.businessname = data.businessname;
            if (data.telephone) value.telephone = data.telephone;
            if (data.storeEmail) value.storeEmail = data.storeEmail;
            if (data.postcode) value.postcode = data.postcode;
            if (data.city) value.city = data.city;
            if (data.street) value.street = data.street;
            if (data.number) value.number = data.number;
            if (data.status) value.status = data.status;
            if (data.defaultImagePath) value.defaultImagePath = data.defaultImagePath;

            console.log(value);

            try {

                await app.firestore()
                .collection('locations')
                .doc(id)
                .set({
                        d : value
                    }, {merge:true});     
            }catch(e) {
                console.log(`error while updating location: ${id} - ${e}`);
            }        
        });
    }
}

async function updateConfirmedCoordinatesInTraders() {
    const app = await loadApp(Stage.INTEGRATION);
    const result = await app.firestore().collection('locations').get();

    if (result && result.docs && result.docs.length > 0) {
        for(const location of result.docs) {
            const data: any = location.data(); 

            if(data.d.coordinates) {
                const coords = data.d.coordinates as admin.firestore.GeoPoint;
                const confirmedCoords = [coords.latitude, coords.longitude];

                console.log(confirmedCoords);

                await app.firestore()
                         .collection('Traders')
                         .doc(location.id)
                         .set({
                                confirmedLocation : confirmedCoords
                            }, {merge:true});  
            }
        }
    }
}

new Promise(async (res, rej) => {
    await updateConfirmedCoordinatesInTraders();
    await updateLocations();
});