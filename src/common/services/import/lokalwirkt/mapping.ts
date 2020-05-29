import { TraderProfile, TraderProfileStatus } from "../../../models/traderProfile";
import moment = require("moment");

const CATEGORIES: any = {
    "blumengarten" : ["florist", "garden_centre", "garden_furniture"],
    "gastronomie" : ["pub", "cafe", "restaurant", "fast_food", "bakery", "biergarten", "caterer", "bar"],
    "fashion" : ["clothes", "fashion_accessories", "bag"],
    "buchhandlung" : ["books"],
    "handwerk" : ["doityourself", "electrician", "carpenter", "metal_construction", "plumber"],
    "homedecor" : ["furniture", "interior_decoration", "garden_furniture", "carpet"],
    "lebensmittel" : ["beverages","supermarket", "confectionery"],
    "sonstiges" : ["baby_goods", "shoes", "car_parts", 
    "optician", "houseware", "jewelry", "tailor", 
    "antiques", "art", "mobile_phone", "hairdresser",
    "beauty", "electronics", "travel_agency", "gift", 
    "musical_instrument", "computer", "tobacco", "butcher", 
    "hunting", "perfumery", "alcohol", "erotic", "variety_store", "sports", 
    "seafood", "photo", "pet", "video_games", "atm", 
    "library", "dry_cleaning", "Wäscherei", "hearing_aids", 
    "massage", "charity", "kiosk", "copyshop", "kitchen", "outdoor", "frame",
    "internet_cafe", "tattoo", "tea", "trade",
    "dance", "paint", "bed", "second_hand", "bicycle", "e-cigarette", "nutrition_supplements", "tyres"]
};


export function mapToTrader(lokalwirktModel:any[]) { 

    const out: Partial<TraderProfile>[] = [];

    if (lokalwirktModel && lokalwirktModel.length > 0) {
        
        for(const lw of lokalwirktModel) {
            const trader:Partial<TraderProfile> = {
                businessname: lw.name,
                description: lw.description,
                ownerFirstname: lw.firstname,
                ownerLastname: lw.lastname,
                postcode: lw.postalcode,
                city: lw.locality,
                street: lw.address,
                telephone: lw.phone,
                email: lw.email,
                homepage: lw.website,
                openingTime: getOpeningTime(lw["opening-time"]),
                osm_id: lw.osm_id,
                osm_category: getOSMCategories(lw.category),
                osm_modified: moment(lw.modified).unix(),
                licence : lw.licence,
                confirmedLocation : [Number(lw.lat), Number(lw.lon)],
                storeType: mapToTraderCategory(lw.category),
                status: TraderProfileStatus.IMPORTED
            };

            if (lw.housenumber)
                trader.number = lw.housenumber;

            if (trader.storeType)
                out.push(trader);
        }
    }

    return out.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj["businessname"]).indexOf(obj["businessname"]) === pos;
    });
}

export function mapToTraderCategory(category: any) {
    let out:any = undefined;

    if (category && category.length > 0) {
        for(const cat of category) {

            for(const key in CATEGORIES) {
                if((CATEGORIES[key] as string[]).indexOf(cat.slug) > -1) {
                    if (!out) out = {};
                    out[key] = true;
                }
            }
        }        
    }

    return out;
}

function getOSMCategories (category: any) {
    if (category && category.length > 0) {
        return (category as []).map((c: any) => {
            return {
                slug: c.slug,
                name: c.name
            }
        })
    }

    return [];
}

function getOpeningTime(openingTime:any[]) {

    if (openingTime && openingTime.length > 0) {
        return openingTime.map(o => {
            return {
                weekday: o.weekday,
                open: o.open,
                close: o.close                
            }
        })
    }

    return [];
} 

// "community_centre", -
// "beverages", x
// "pub", x
// "baby_goods", x
// "shoes", x
// "doctors", -
// "car_repair", - 
// "car_parts", x
// "furniture", x 
// "pharmacy", -
// "optician", x
// "supermarket", x
// "cafe", x
// "houseware", x
// "jewelry", x
// "restaurant", x
// "fast_food", x
// "courthouse", - 
// "tailor", x
// "physiotherapist", -
// "insurance", -
// "studio", -
// "antiques", x
// "fuel", -
// "funeral_directors", -
// "art", x
// "mobile_phone", x
// "florist", x
// "garden_centre", x
// "kindergarten", -
// "hairdresser", x
// "bakery", x
// "beauty", x
// "doityourself", x
// "clothes", x
// "electronics", x
// "fire_station", - 
// "college", -
// "biergarten", x
// "convenience", - 
// "sports_centre", - 
// "car", -
// "interior_decoration", x
// "medical_supply", -
// "travel_agency", x
// "lawyer", - 
// "books", x
// "place_of_worship", - 
// "townhall", - 
// "stationery", - 
// "gift", x
// "university", -
// "car_rental", -
// "car_wash", -
// "caravan", -
// "musical_instrument", x
// "caterer", x 
// "stripclub", - 
// "social_facility", -
// "driving_school", -
// "bank", -
// "computer", X
// "roofer", - 
// "tobacco", x
// "butcher", x
// "post_office", -
// "chemist", -
// "hunting", x
// "perfumery", X
// "dentist", -
// "fireplace", -
// "alcohol", x
// "electrician", - 
// "school", -
// "erotic", x
// "variety_store", -
// "hospital", -
// "sports" - ,
// "cinema", -
// "seafood", x
// "photo", x
// "agrarian", -
// "swimming_pool", - 
// "theatre", -
// "pet", x
// "electrical", - 
// "video_games", x
// "hotel", -
// "atm", x
// "library", x
// "dry_cleaning", x
// "laundry", x
// "garden_furniture", x
// "hearing_aids", x
// "massage", x
// "farm", - 
// "carpenter", x
// "confectionery", x
// "fashion_accessories", x
// "metal_construction",  x
// "newsagent", -
// "department_store", - 
// "charity", x
// "kiosk", x
// "childcare", - 
// "bag", x
// "copyshop", x
// "kitchen", x
// "fabric", - 
// "dance", x
// "clinic", - 
// "nursing_home", -
// "paint", x
// "marketplace", - 
// "bed", x
// "second_hand", x
// "bicycle", x
// "bar", x
// "e-cigarette", x
// "police", -
// "nutrition_supplements", x
// "plumber", x
// "tyres", x
// "mall", - 
// "recycling", -
// "outdoor", x
// "frame", x
// "internet_cafe", x
// "tattoo", x
// "tea", x
// "carpet", - 
// "veterinary", - 
// "trade" x


// ORIGINAL RESPONSE:
//
// "data": {
//     "id": 59725,
//     "created": "2020-04-13T05:33:15",
//     "modified": "2020-04-23T13:56:19",
//     "name": "Rewe Engel",
//     "firstname": null,
//     "lastname": null,
//     "company": null,
//     "address": "Massener Hellweg 4",
//     "postalcode": "",
//     "locality": "Unna",
//     "country": "DE",
//     "lat": "51.538722",
//     "lon": "7.653606",
//     "website": null,
//     "email": null,
//     "phone": null,
//     "mobile": null,
//     "fax": null,
//     "description": null,
//     "website_crowdfunding": null,
//     "website_coupon": null,
//     "wheelchair": "yes",
//     "licence": "ODbL",
//     "brand": null,
//     "osm_id": 289664270,
//     "revisited_government": null,
//     "revisited_store": null,
//     "delivery": null,
//     "pickup": null,
//     "onlineshop": null,
//     "deleted": false,
//     "region_id": 5,
//     "opening-time": [
//         {
//             "id": 240987,
//             "created": "2020-04-23T13:56:19",
//             "modified": "2020-04-23T13:56:19",
//             "store_id": 59725,
//             "type": "all",
//             "weekday": 1,
//             "open": 25200,
//             "close": 72000
//         },
//         {
//             "id": 240988,
//             "created": "2020-04-23T13:56:19",
//             "modified": "2020-04-23T13:56:19",
//             "store_id": 59725,
//             "type": "all",
//             "weekday": 2,
//             "open": 25200,
//             "close": 72000
//         },
//         {
//             "id": 240989,
//             "created": "2020-04-23T13:56:19",
//             "modified": "2020-04-23T13:56:19",
//             "store_id": 59725,
//             "type": "all",
//             "weekday": 3,
//             "open": 25200,
//             "close": 72000
//         },
//         {
//             "id": 240990,
//             "created": "2020-04-23T13:56:19",
//             "modified": "2020-04-23T13:56:19",
//             "store_id": 59725,
//             "type": "all",
//             "weekday": 4,
//             "open": 25200,
//             "close": 72000
//         },
//         {
//             "id": 240991,
//             "created": "2020-04-23T13:56:19",
//             "modified": "2020-04-23T13:56:19",
//             "store_id": 59725,
//             "type": "all",
//             "weekday": 5,
//             "open": 25200,
//             "close": 72000
//         },
//         {
//             "id": 240992,
//             "created": "2020-04-23T13:56:19",
//             "modified": "2020-04-23T13:56:19",
//             "store_id": 59725,
//             "type": "all",
//             "weekday": 6,
//             "open": 25200,
//             "close": 72000
//         }
//     ],
//     "category": [
//         {
//             "id": 17,
//             "created": "2020-03-29T12:24:29",
//             "modified": "2020-04-01T06:24:23",
//             "slug": "supermarket",
//             "name": "Supermarkt, Einkaufszentrum",
//             "description": null
//         }
//     ],
//     "region": {
//         "id": 5,
//         "created": "2020-03-22T17:59:17",
//         "modified": "2020-04-23T14:02:12",
//         "name": "Unna",
//         "description": "",
//         "website": "",
//         "lat": "51.537950",
//         "lon": "7.689690",
//         "slug": "unna"
//     }
// }