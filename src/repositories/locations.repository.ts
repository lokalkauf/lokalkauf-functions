// manages the generic access to the locations collection in firebase

import { firestore } from 'firebase';
import { GeoFirestore } from 'geofirestore';
import * as admin from 'firebase-admin';
import { LocationEntity } from '../models/locationEntity';

const database = admin.firestore();
const geoFire = new GeoFirestore(database);
const _locations = geoFire.collection('locations');



export async function loadLocationsByDistance(coordinates: number[], radius: number, categories: string[], descOrder:boolean) : Promise<LocationEntity[]> {


    const ref = geoFire.collection('locations');
    const query = (categories && categories.length > 0)?
                            ref.where('categories', 'array-contains-any', categories) : 
                            ref;
  
    const locations = await query
                      .where('status', '==', 'PUBLIC')
                      .near({
                        center: new firestore.GeoPoint(coordinates[0], coordinates[1]),
                        radius: radius
                      }).get();
  
    return locations.docs.map((d) =>  { 
                                const loc = d.data();
                                loc.id = d.id;
                                loc.distance = d.distance;
                                delete loc.coordinates;
                                
                                return loc;
                              })
                              .sort((a, b) => {
                                return (descOrder === true)? 
                                  b.distance - a.distance : a.distance - b.distance
                              });
}

// deletes a location. if the ID is invalid or 
// the location is already deleted, then the following is ignored
export async function deleteLocation(locationID: string) {
  console.log('delete location: ' + locationID);

  await database.collection('locations').doc(locationID).delete();
}


// updates or inserts the location 
// geoPoint will also be updated if necessary
// there was some trouble with the GeoPoint because there are several types in 
// different packages that are not compatible. 
// it is important that the GeoPoint from admin.firestore.GeoPoint is used at this point!
export async function upsertLocation(locationID: string, coordinates: number[], values: Partial<LocationEntity>) {

  console.log('create location: ' + values);

  const data: any = values;
  data.coordinates = new admin.firestore.GeoPoint(coordinates[0], coordinates[1]);

  console.log(data);
  
  return _locations.doc(locationID)
                   .set(data, { merge:true })
                   .catch((e) => {
                      console.log(e);
                   });
}