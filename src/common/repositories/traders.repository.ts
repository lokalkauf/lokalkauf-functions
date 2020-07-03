import { TraderEntity } from '../models/traderEntity';
import admin = require('firebase-admin');
// import { v4 as uuid } from 'uuid';
import { TraderProfile } from '../models/traderProfile';
const wikimedia = require("wikimedia-commons-file-path");


export async function loadTraders(app: admin.app.App = admin.app()) : Promise<TraderEntity[]> { 
    const traders = await app.firestore().collection('Traders').get();

    return traders.docs.map(d =>  {
        const data = d.data();
        data.id = d.id;
        data.createdAt = d.createTime.toDate().getTime();
        return data as TraderEntity;
    });
}

export async function upsert(app: admin.app.App = admin.app(), trader: Partial<TraderProfile>) { 
    await app.firestore()
             .collection('Traders')
             .add(trader);


    // import image from wikimedia
    if ((trader as any)?.wikimedia_img)
        await importWikimediaImage((trader as any).wikimedia_img);
}

export async function import_osm(app: admin.app.App = admin.app(), trader: Partial<TraderProfile>) { 
    if (!trader.osm_id) return;

    const col = app.firestore().collection('Traders');

    const items = await col.where('osm_id', '==', trader.osm_id)
                           .get();

    if(items.docs && items.docs.length > 0) {
        // process update
        for(const d of items.docs){
            await col.doc(d.id)
                     .set(trader, { merge:true })
                     .catch((e) => {
                            console.log(e);
                     });
        }
    }
    else
    {
        // process insert

        await col.doc()
                .set(trader)
                .catch((e) => {
                    console.log(e);
                });
    }
}

export async function import_osmcache_item(item: any, app: admin.app.App = admin.app()) { 
    if (!item || !item.lw_id) return;

    await app.firestore()
             .collection('OSM_CACHE')
             .doc(item.lw_id + "")
             .set(item, { merge:true })
             .catch((e) => {
                console.log(e);
             });
}

export async function load_osmcache(app: admin.app.App = admin.app()) : Promise<any[]> { 
    const traders = await app.firestore().collection('OSM_CACHE').get();

    return traders.docs.map(d =>  {
        const data = d.data();
        data.id = d.id;
        return data;
    });
}

export async function load_osmcache_item(id: string, app: admin.app.App = admin.app()) : Promise<any> { 

    let x = "0";
    x=x;

    const doc = await app.firestore()
                             .collection('OSM_CACHE')                             
                             .doc(id + "")
                             .get();

    return (doc)? doc.data() : null;
}


async function importWikimediaImage(fileName: string) {
    const imgURL = wikimedia(fileName);
    console.log(imgURL);
}
