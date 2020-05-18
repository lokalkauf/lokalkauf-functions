import { callAsync } from './adminStage';
import * as admin from 'firebase-admin';
import * as resizeService from '../common/services/resize.image';

/*
  Admin task to generate new thumbnails of existing images
  Usage:   node resizeImages.js stage max_width max_height
  Example: node resizeImages.js development 123 123
*/

async function resizeImages() {
    const max_width = Number(process.argv[3]);
    const max_height = Number(process.argv[4]);
    console.log(max_width, max_height);
    const traders = await admin.firestore().collection('Traders').get();
    const bucket = admin.storage().bucket()
    traders.docs.forEach(async doc => {
        try {
            const files = await bucket.getFiles({
                prefix: 'Traders/' + doc.id
            });
            files[0].forEach(async file => {
                if (file.name.includes('/thumbs/') || file.name.includes('thumb_')) {
                    console.log('Already a thumb')
                }
                else {
                    console.log('Generate new thumbnail')
                    resizeService.resize(max_width, max_height,
                        { 'name': file.name, 'bucket': file.bucket.name });
                }
            });
        }
        catch (Error) {
            console.log('No file');
        }
    });



}

callAsync(resizeImages);
