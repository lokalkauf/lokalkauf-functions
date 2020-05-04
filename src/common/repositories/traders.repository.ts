import { TraderEntity } from '../models/traderEntity';
import admin = require('firebase-admin');


export async function loadTraders(app: admin.app.App = admin.app()) : Promise<TraderEntity[]> { 
    const traders = await app.firestore().collection('Traders').get();

    return traders.docs.map(d =>  {
        const data = d.data();
        data.createdAt = d.createTime.toDate().getTime();
        return data as TraderEntity;
    });
}