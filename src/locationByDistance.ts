import * as functions from 'firebase-functions';
import * as locations from './repositories/locations.repository';
import { LocationEntity } from './models/locationEntity';


interface LocationDistanceRequest {
  coordinates: number[];
  radius: number;
  desc: boolean;
  pageSize: number;
  pageIndex: number;
  categories: string[];
  countOnly: boolean;
}

class LocationDistanceResponse {
  paging:any = {};
  locations:LocationEntity[] = [];

  constructor(loctns: any[], totalItems: number, pageSize: number, pageIndex: number) {

    this.paging.totalItems = totalItems;
    this.paging.totalPages = Math.ceil(totalItems/pageSize);
    this.paging.pageIndex = pageIndex;
    this.paging.pageSize = pageSize;    

    this.locations = loctns;
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

  const out =  new LocationDistanceResponse(result, totalItems, request.pageSize, request.pageIndex);  

  // countOnly == true allows to get only the Counts without getting the results
  // this is often needed to get only the existence of locations on the client without the whole
  // to transfer data to the client via the network

  if (request.countOnly) 
    out.locations = [];

  return out;
});