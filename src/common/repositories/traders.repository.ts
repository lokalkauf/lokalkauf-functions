import { TraderEntity } from '../models/traderEntity';
import admin = require('firebase-admin');
import { TraderProfile } from '../models/traderProfile';


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
}