import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

exports.deleteThumbnailsTriggeredByImageDeletion = functions.storage
    .object()
    .onDelete(async (snapshot, _context) => {
        //console.log('#######');
        //console.log('#######' + snapshot.name);

        if (
            snapshot.name &&
            snapshot.name.indexOf('/BusinessImages/') > -1 &&
            snapshot.name.indexOf('/BusinessImages/thumbs') < 0
        ) {
            const a = snapshot.name.indexOf('/BusinessImages/');

            console.log(`delete thumbnail of ${snapshot.name}`);

            let thumbnail: string;

            try {
                let name = snapshot.name.substring(a + '/BusinessImages/'.length);

                name = 'thumb_224x224_' + name + '.jpg'

                thumbnail =
                    snapshot.name.substring(0, a) + '/BusinessImages/' + name;

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
