const axios = require('axios');
const osmtogeojson = require('osmtogeojson');
import * as fs from 'fs';
import { mapToTrader } from './mapping';
import * as categories from './categories';

const FILE_BUFFER = '/tmp/lokalkauf/lokalwirkt.json';

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

export async function loadData(options: any) {
    const response = await axios.get('https://lokalwirkt.de/api/stores/geo?region-slug=' + options.region);
    const items: any[] = [];

    if (!fs.existsSync(FILE_BUFFER)) {
        fs.writeFileSync(FILE_BUFFER, '{}', {encoding: 'utf8'});
    }

    const file_content = fs.readFileSync(FILE_BUFFER, {encoding:'utf8'});
    const cache = JSON.parse(file_content);
    
    if (response && response.data && response.data.features &&  response.data.features.length > 0) {

        for(const d of response.data.features as any[]) {
            let data:any;

            console.log(d.properties.id);

            if (cache[d.properties.id]) {
                data = cache[d.properties.id];
            } else {
                data = await loadDetails(d.properties.id);
                await updateCache(d.properties.id, cache, data);
            }

            if (data) {

                // get original osm data...
                if ((!data.osm_original || data.osm_original.ERROR) && data.data.osm_id) {
                    data.osm_original = await loadOriginalOSM_Data(data.data.osm_id, data.data);
                    await updateCache(d.properties.id, cache, data);
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



async function updateCache(itemID:string, cache: any, data: any) {
    cache[itemID] = data;
    fs.writeFileSync(FILE_BUFFER, JSON.stringify(cache), {encoding:'utf8'});
}

async function fillAddresses(data: any) {

    if (data && data.data ) {

        if (!data.data.housenumber && 
            data.osm_original?.features?.properties && 
            data.osm_original.features.properties['addr:housenumber']) {

            data.data.housenumber = data.osm_original.features.properties['addr:housenumber'];
        
        }

        // if (!data.data.address || !data.data.postalcode || !data.data.locality) {

        // }

        // if (data.osm_original) {
        //     data.data.address = data.data.address = 
        // }
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

