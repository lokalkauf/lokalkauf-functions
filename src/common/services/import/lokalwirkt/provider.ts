const axios = require('axios');
const osmtogeojson = require('osmtogeojson');
import { mapToTrader } from './mapping';
import * as categories from './categories';
import * as importService from '../import.service';
import admin = require('firebase-admin');

//    import * as fs from 'fs';
//    const FILE_BUFFER = '/tmp/lokalkauf/lokalwirkt.json';



export async function loadDetails(id: string) {
    let out:any;

    try {
        const response = await axios.get(' https://lokalwirkt.de/api/store/' + id);

        if (response && response.data) {
            out = response.data;
        }
    } catch(e) {
        console.log('error while loading details of: ' + id);
    }
    return out;
   
}

export async function loadData(options: any, app: admin.app.App) {
    const response = await axios.get('https://lokalwirkt.de/api/stores/geo?region-slug=' + options.region);
    const items: any[] = [];

    // const cache = await loadCache();    
    if (response && response.data && response.data.features &&  response.data.features.length > 0) {

        for(const d of response.data.features as any[]) {
            let data:any;

            const cachedItem = await importService.getItemFromCache(d.properties.id, app);
            
            if (cachedItem) {
                data = cachedItem;
            } else {
                data = await loadDetails(d.properties.id);    
                data.lw_id = d.properties.id;            
                await importService.putItemToCache(data, app);
                //await updateCache(d.properties.id, cache, data);
            }

            if (data) {

                // get original osm data...
                if ((!data.osm_original || data.osm_original.ERROR) && data.data.osm_id) {
                    data.osm_original = await loadOriginalOSM_Data(data.data.osm_id, data.data);
                    await importService.putItemToCache(data, app);                    
                    // await updateCache(d.properties.id, cache, data);
                }

                // fill addresses
                await fillAddresses(data);

                items.push(data.data);
            }
        }

        // if (!cache['categories']) {
            const arr = items.filter(i => i.category && i.category.length > 0)
            .map(i => (i.category as []).map((c:any) => c.slug).join(',')).join(',')
            .split(',');
            //cache['categories'] = arr.filter((n, i) => arr.indexOf(n) === i);

            const syncResult = categories.syncCategories(arr.filter((n, i) => arr.indexOf(n) === i));
            console.log('categories: ', syncResult);

            //fs.writeFileSync(FILE_BUFFER, JSON.stringify(cache), {encoding:'utf8'});
        // }

        return  mapToTrader(items);

    } else {
        console.log(`no data in region: '${options.region}' found`);
    }

    return [];    
}



// async function updateCache(itemID:string, cache: any, data: any) {


//     cache[itemID] = data;
//     fs.writeFileSync(FILE_BUFFER, JSON.stringify(cache), {encoding:'utf8'});
// }

// async function loadCache() {

// //    return await tradersRepo.load_osmcache();

//     if (!fs.existsSync(FILE_BUFFER)) {
//         fs.mkdirSync('/tmp/lokalkauf');
//         fs.writeFileSync(FILE_BUFFER, '{}', {encoding: 'utf8'});
//     }

//     const file_content = fs.readFileSync(FILE_BUFFER, {encoding:'utf8'});
//     return JSON.parse(file_content);    
// }

async function fillAddresses(data: any) {

    if (data && data.data ) {

        if (!data.data.housenumber && data.osm_original) { 
            
            if (data.osm_original?.features && 
                data.osm_original?.features.length > 0  && 
                data.osm_original?.features[0].properties && 
                data.osm_original.features[0].properties['addr:housenumber']) {
                    data.data.housenumber = data.osm_original.features[0].properties['addr:housenumber'];
                    data.data.address = data.osm_original.features[0].properties['addr:street'];
                }
        }

        if (!data.data.postalcode && data.osm_original) { 
            
            if (data.osm_original?.features && 
                data.osm_original?.features.length > 0  && 
                data.osm_original?.features[0].properties && 
                data.osm_original.features[0].properties['addr:postcode']) {
                    data.data.postalcode = data.osm_original.features[0].properties['addr:postcode'];
                }
        }        

        if (!data.data.locality && data.osm_original) { 
            
            if (data.osm_original?.features && 
                data.osm_original?.features.length > 0  && 
                data.osm_original?.features[0].properties && 
                data.osm_original.features[0].properties['addr:city']) {
                    data.data.locality = data.osm_original.features[0].properties['addr:city'];
                }
        }
    }
}

async function loadOriginalOSM_Data(osmID: string, data:any) {
    let result = await loadOSMData('node', osmID);

    if (!result)
        result = await loadOSMData('relation', osmID);

    if (!result)
        result = await loadOSMData('way', osmID);

    return result;
}

async function loadOSMData(type: string, osmID:string) {
    try {
        const response = await axios.get('https://www.openstreetmap.org/api/0.6/' + type + '/' + osmID);
        
        if (response && response.data) {
            console.log(response.data);
            return osmtogeojson(response.data);
        }

        return null;
    } catch(e) {       
        console.log('[' + type + '] error while loading original osm data.' + e, osmID);
        return null;
    }    
}

