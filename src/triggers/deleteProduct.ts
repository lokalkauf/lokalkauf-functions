import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";


export const deleteProduct = functions.firestore
    .document('/Traders/{traderId}/Products/{productId}')
    .onDelete(async (snap, context) => {
        const productId = context.params.productId;
        const traderId = context.params.traderId;

        console.log(`Delete Files: ${productId}`);
        return admin
            .storage()
            .bucket()
            .deleteFiles({
                prefix: `Traders/${traderId}/ProductImages/${productId}`
            });
    });

