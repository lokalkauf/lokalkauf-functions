import * as admin from 'firebase-admin';
import * as os from "os";
const mkdirp = require("mkdirp");
const path = require('path');
const sharp = require('sharp');


export async function resize(max_width: number, max_height: number, object: any) {
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    //    const contentType = object.contentType; // File content type.
    // Download file from bucket.
    const bucket = admin.storage().bucket(fileBucket)
    const originalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(originalFile);
    await mkdirp(tempLocalDir);
    const remoteFile = bucket.file(filePath);
    await remoteFile.download({ destination: originalFile });

    // Exit if this is triggered on a file that is not an image.
    // if (!contentType.startsWith('image/')) {
    //     console.log('This is not an image.');
    //     return null;
    // }

    // Get the file name.
    const fileName = path.basename(filePath);
    // Exit if the image is already a thumbnail.
    if (fileName.startsWith('thumb_')) {
        console.log('Already a Thumbnail.');
        return null;
    }

    const metadata = {
        contentType: 'image/jpg',
    };
    // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
    const thumbFileName = `thumb_${max_width}x${max_height}_${fileName}.jpg`;
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
    // Create write stream for uploading thumbnail
    const thumbnailUploadStream = bucket.file(thumbFilePath).createWriteStream({ metadata });

    const imageDimension = await sharp(originalFile)
        .metadata()
        .then((m: any) => { return { 'w': m.width, 'h': m.height } });
    // Create Sharp pipeline for resizing the image and use pipe to read from bucket read stream
    const transformer = sharp()
        .resize({
            width: imageDimension.w >= imageDimension.h ? undefined : 224,
            height: imageDimension.w < imageDimension.h ? undefined : 224,
            fit: sharp.fit.inside,
            position: sharp.strategy.entropy
        })
        .flatten({ background: '#FFFFFF' })
        .jpeg({
            quality: 90
        });
    bucket.file(filePath).createReadStream()
        .pipe(transformer)
        .pipe(thumbnailUploadStream);

    return new Promise((resolve, reject) =>
        thumbnailUploadStream.on('finish', resolve).on('error', reject));
}
