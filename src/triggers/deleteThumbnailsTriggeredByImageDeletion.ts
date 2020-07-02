import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

exports.deleteThumbnailsTriggeredByImageDeletion = functions.storage
    .object()
    .onDelete(async (snapshot, _context) => {
        //console.log('#######');
        //console.log('#######' + snapshot.name);
        let imagePath = "";
        if (snapshot.name && snapshot.name.indexOf('/BusinessImages/') > -1) {
            imagePath = snapshot.name.substring(0, snapshot.name.indexOf('/BusinessImages/')) + '/BusinessImages/';
        }
        else if (snapshot.name && snapshot.name.indexOf('/ProductImages/') > -1) {
            const productID = snapshot.name.split('/ProductImages/')[1].split('/')[0];
            imagePath = snapshot.name.substring(0, snapshot.name.indexOf('/ProductImages/')) + "/ProductImages/" + productID + "/";
        }

        if (
            snapshot.name &&
            snapshot.name.indexOf('thumb_224x224_') < 0 &&
            snapshot.name.indexOf('/BusinessImages/thumbs') < 0 &&
            (snapshot.name.indexOf('/BusinessImages/') > -1 ||
                snapshot.name.indexOf('/ProductImages/') > -1)
        ) {

            console.log(`delete thumbnail of ${snapshot.name}`);

            let thumbnail: string;

            try {
                let name = snapshot.name.split('/')[snapshot.name.split('/').length - 1];
                name = 'thumb_224x224_' + name + '.jpg';

                thumbnail = imagePath + name;

                admin
                    .storage()
                    .bucket()
                    .deleteFiles({ prefix: thumbnail }, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`${thumbnail} successfull deleted`);
                        }
                    });
            } catch (e) {
                console.log(e);
            }
        }
    });
