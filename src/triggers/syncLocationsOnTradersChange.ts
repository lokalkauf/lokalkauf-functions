/*

syncLocationsOnTradersChange

The task of this function is the synchronization of the trader information.
A relevant subset of the data is taken from the 'Traders' collection in 
the collection 'locations'. This is recommended for a high-performance 
radius search and the selection of the trader information in the overview.

It is common to work with redundant data in a document-based DB or in a No-Sql DB,
instead of using references to other tables. Don't overdo it, 
but this passage is predestined for it.

The function is called by an event trigger, which is triggered every time a write access to a
document is triggered in the 'Traders' collection.

*/


import * as functions from 'firebase-functions';
import * as locations from '../common/repositories/locations.repository';
import { LocationEntity } from '../common/models/locationEntity';


export const syncLocationsOnTradersChange = functions.firestore
    .document('Traders/{traderID}')
    .onWrite(async (snapshot, context) => {
        console.log('synchronize trader with location');

        const previousData = snapshot.before.data();
        const data = snapshot.after.data();

        // sync only if confirmedLocation coordinates exists...
        if (data && !data.confirmedLocation) {
            console.log('no coordinates. exit sync locations.');
            return;
        };


        if (data) {
            const values: Partial<LocationEntity> = { };

            if (data.businessname) values.businessname = data.businessname;
            if (data.postcode) values.postcode = data.postcode;
            if (data.city) values.city = data.city;
            if (data.street) values.street = data.street;
            if (data.number) values.number = data.number;
            if (data.storeEmail) values.storeEmail = data.storeEmail;
            if (data.telephone) values.telephone = data.telephone;           
            if (data.defaultImagePath) values.defaultImagePath = data.defaultImagePath;
            if (data.thumbnailURL) values.thumbnailURL = data.thumbnailURL;
            if (data.status) values.status = data.status;      
            if (data.storeType) values.categories = Object.keys(data.storeType).filter(k => data.storeType[k] === true);

            await locations.upsertLocation(context.params.traderID, data.confirmedLocation, values);
        }   
        else if (previousData) {
            // deletet is only triggered if the after === undefined and
            // the before is !undefined.

            await locations.deleteLocation(context.params.traderID);
        }
});
  