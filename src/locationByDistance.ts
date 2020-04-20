import * as functions from 'firebase-functions';
import { firestore } from 'firebase';
import { GeoFirestore, GeoQuery } from 'geofirestore';
import * as admin from 'firebase-admin';


const database = admin.firestore()
const geoFire = new GeoFirestore(database)



// Cloud Function to get a list of nearby traders where are public
export const locationByDistance = functions.https.onCall(async (data, context) => {
  
  const traders = await getTraders(data.radius, data.coords)
  console.log("Starting locationByDistance")
  return traders
 

});

/////////////////////////////////////
async function getTraders(radius: number, coords: Array<number>, /** resultsPerPage: number, pageNumber: number */){
  
  const query: GeoQuery = geoFire.collection('locations').near({
    center: new firestore.GeoPoint(coords[0], coords[1]),
    radius,
  });
  const publicTraderIds = await getPublicTraders(query)
  console.log("Starting getTraders")
  const allTraders = await query.get()
  const tradersNearby: { id: string; distance: number; }[] = []

  publicTraderIds.forEach(element => {
    const traderId = String(allTraders.docs.filter(trader => trader.id === element).map((traders) => traders.id))
    const traderDistance = Number(allTraders.docs.filter(trader => trader.id === element).map((traders) => traders.distance))
    tradersNearby.push({id: traderId, distance: traderDistance })
  });

  return tradersNearby
 
}


/////////////////////////////////////
async function getPublicTraders(allTraders: GeoQuery){
  
  const traderIds = await getTraderIds(allTraders)
  console.log("Starting getPublicTraders")

  var chunkedTraders = []
  var chunSize = 10
  for (var i=0; i<traderIds.length; i+=chunSize) {
    chunkedTraders.push(traderIds.slice(i,i+chunSize))
  }

  const publicTraders = await Promise.all(
    chunkedTraders.map((chunk) =>
      database.collection('Traders')
      .where(admin.firestore.FieldPath.documentId(), 'in', chunk)
      .where('status', '==', 'PUBLIC')
      .get()
    )
  )

  const publicTraderIds: string[] = []
  publicTraders.forEach((dataOuter) => 
    dataOuter.forEach((dataInner) =>
      publicTraderIds.push(dataInner.id)
    )
  )
  return publicTraderIds
}



/////////////////////////////////////
async function getTraderIds(allTraders: GeoQuery){
  
  const shopIds = await new Promise<Array<String>>((resolve) => 
    allTraders.onSnapshot((snapshot) => {
      const Ids = snapshot.docs.map((traders) => traders.id)
      resolve(Ids)
    })
  )
  console.log("Starting getTraderIds")
  
  return shopIds
}


