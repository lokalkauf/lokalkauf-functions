import * as functions from 'firebase-functions';
import * as locations from './repositories/locations.repository';
import { LocationEntity } from './models/locationEntity';


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
  locations:LocationEntity[] = [];

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
  console.log(request);

  let result = await locations.loadLocationsByDistance(request.coordinates, request.radius, request.categories, request.desc);

  const totalItems = result.length;

  if (result && result.length > 0) {
    const start = request.pageIndex * request.pageSize;
    const end = start + request.pageSize ;

    result = result.slice(start, end);
  }

  return  new LocationDistanceResponse(result, totalItems, request.pageSize, request.pageIndex);  
});