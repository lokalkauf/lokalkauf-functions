//import { firestore } from 'firebase';
//import * as admin from 'firebase-admin';
import { TraderEntity } from '../models/traderEntity';

//const database = admin.firestore();


export async function loadTraders(traderIds: Array<string>) : Promise<TraderEntity[]> { 
    throw new Error('NOT IMPLEMENTED');

//    const chunks = getChunks(traderIds, 10);

    // const snapshots = await Promise.all(
    //   chunks.map((chunk) =>
    //     database.collection('Traders')
    //             .where(firestore.FieldPath.documentId(), 'in', chunk)
    //             .get()
    //   )
    // );


    // const docs = snapshots.reduce(
    //   (combined, snapshot) => combined.concat(snapshot.docs),
    //   [] as firestore.QueryDocumentSnapshot<firestore.DocumentData>[]
    // );

    // return docs.map((doc) => ({
    //   ...(doc.data() as Omit<TraderEntity, 'id'>),
    //   id: doc.id,
    // })) as TraderEntity[];
}

// function getChunks<T>(arr: T[], size: number): T[][] {
//     return arr.reduce((acc: any[], _, i) => {
//         if (i % size === 0) {
//             acc.push(arr.slice(i, i + size));
//         }
//         return acc;
//     }, []);
// }