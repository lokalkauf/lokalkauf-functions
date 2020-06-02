const axios = require('axios');
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
                cache[d.properties.id] = data;
                fs.writeFileSync(FILE_BUFFER, JSON.stringify(cache), {encoding:'utf8'});
            }

            if (data) {

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
