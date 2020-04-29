import { firestore } from 'firebase';
import { GeoFirestore } from 'geofirestore';
import * as admin from 'firebase-admin';
import { LocationEntity } from '../models/locationEntity';

const database = admin.firestore();
const geoFire = new GeoFirestore(database);

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