import {Stage, loadApp } from './adminStage';

const app = loadApp(Stage.DEVELOPMENT);

/*
   this task is for administrative purposes only, to perform an initial update.
   updates all "locations" with categories from "Traders"
   storeType complextType will be transformed to simple string array: ['gastro', 'fashion']
   this is needed for the selection and filtering of locations (location based search with paging)
   replicates some properties, which are needed for the overview or for the map view
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

            await app.firestore()
               .collection('locations')
               .doc(id)
               .set({
                    d : value
                }, {merge:true});             
        });
    }
}

new Promise(async (res, rej) => {
    await updateLocations();
});



// async function getThumbnailURL(imagePath: string, size = '200x200'): Promise<string> {
//     const foldername = imagePath.substring(0, imagePath.lastIndexOf('/') + 1);
//     const filenameWithoutExt = imagePath.substring(
//         imagePath.lastIndexOf('/'),
//         imagePath.lastIndexOf('.')
//     );

//     const ext = imagePath.split('.').pop();
//     const thumbnailPath = foldername + 'thumbs' + filenameWithoutExt + '_' + size + '.' + ext;
   
//     const thumnbnailRef = await app.storage().bucket().file('').getSignedUrl({});
    
//     return {
//       url: await thumnbnailRef.getDownloadURL(),
//       size: (await thumnbnailRef.getMetadata()).size,
//       name: thumnbnailRef.name,
//       path: thumnbnailRef.fullPath,
//     };
//   }