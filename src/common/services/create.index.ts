import { TraderIndex } from '../models/traderIndex';

export async function createIndex(doc: FirebaseFirestore.DocumentData) {
  const data = doc.data()
  const trader: TraderIndex = {
    objectID: doc.id,
    businessname: data.businessname,
    storeType: data.storeType,
    description: data.description,
    pickup: data.pickup,
    delivery: data.delivery,
    defaultImagePath: data.defaultImagePath ? data.defaultImagePath : '',
    postcode: data.postcode,
    city: data.city,
    street: data.street,
    licence: data.licence ? data.licence : '',
    number: data.number ? data.number : '',
    status: data.status ? data.status : '',
  }
  if (data.hasOwnProperty('confirmedLocation')) {
    trader._geoloc = {
      'lat': Number(data.confirmedLocation[0]),
      'lng': Number(data.confirmedLocation[1])
    };
  }
  return trader;
}
