import * as functions from 'firebase-functions';
import { firestore } from 'firebase';
import { GeoFirestore } from 'geofirestore';
import * as admin from 'firebase-admin';


const database = admin.firestore()
const geoFire = new GeoFirestore(database)


class LocationDistanceRequest {
  coordinates: number[] = [];
  radius: number = 20;
  desc: boolean = false;
  pageSize: number = 10;
  pageIndex: number = 0;
  categories: string[] = [];
}

class LocationDistanceResponse {
  paging:any = {};
  locations:any[] = [];

  constructor(locations: any[], totalItems: number, pageSize: number, pageIndex: number) {

    this.paging.totalItems = totalItems;
    this.paging.totalPages = totalItems/pageSize;
    this.paging.pageIndex = pageIndex;
    this.paging.pageSize = pageSize;    

    this.locations = locations;
  }
}


// Cloud Function to get a list of nearby traders where are public, 
// includes server side filtering and paging logic
export const locationByDistance = functions.https.onCall(async (request: LocationDistanceRequest, context: any) => {
  
  const locations = await geoFire.collection('locations')
                    .where('categories', 'array-contains-any', request.categories )
                    .near({
                      center: new firestore.GeoPoint(request.coordinates[0], request.coordinates[1]),
                      radius: request.radius
                    }).get();

  let result = locations.docs.map((d) =>  { 
                              return { 
                                id: d.id, 
                                distance: d.distance, 
                                categories: d.data().categories 
                            }})
                            .sort((a, b) => {
                              return (request.desc === true)? 
                                b.distance - a.distance : a.distance - b.distance
                            });

  const totalItems = result.length;

  if (result && result.length > 0) {
    const start = request.pageIndex * request.pageSize;
    const end = start + request.pageSize ;

    result = result.slice(start, end);
  }

  return  new LocationDistanceResponse(result, totalItems, request.pageSize, request.pageIndex);  
});
