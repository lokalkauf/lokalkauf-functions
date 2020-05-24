import { TraderEntity } from '../models/traderEntity';
import admin = require('firebase-admin');
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



async function importWikimediaImage(fileName: string) {
    const imgURL = wikimedia(fileName);
    console.log(imgURL);
}
