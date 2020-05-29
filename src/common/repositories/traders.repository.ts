import { TraderEntity } from '../models/traderEntity';
import admin = require('firebase-admin');
import { v4 as uuid } from 'uuid';
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

    if (!trader.id)
        trader.id = uuid();

    await app.firestore()
             .collection('OSM')
             .doc(trader.id)
             .set(trader, { merge:true })
             .catch((e) => {
                console.log(e);
             });
}


async function importWikimediaImage(fileName: string) {
    const imgURL = wikimedia(fileName);
    console.log(imgURL);
}
