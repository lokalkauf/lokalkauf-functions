import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

const sendGrid = require('./sendGrid');
const sendCustomVerifyMail = require('./sendCustomVerifyMail');
const checkFileNumberLimit = require('./checkFileNumberLimit');
const deleteThumbnailsTriggeredByImageDeletion = require('./deleteThumbnailsTriggeredByImageDeletion');
const deleteUser = require('./deleteUser');
const backupFirestoreDatabaseToStorage = require('./backupFirestoreDatabaseToStorage');
const traderDetail = require('./traderDetail');

exports.sendGrid = sendGrid.sendGrid;
exports.sendCustomVerifyMail = sendCustomVerifyMail.sendCustomVerifyMail;
exports.checkFileNumberLimit = checkFileNumberLimit.checkFileNumberLimit;
exports.deleteThumbnailsTriggeredByImageDeletion = deleteThumbnailsTriggeredByImageDeletion.deleteThumbnailsTriggeredByImageDeletion;
exports.deleteUser = deleteUser.deleteUser;
exports.backupFirestoreDatabaseToStorage = backupFirestoreDatabaseToStorage.backupFirestoreDatabaseToStorage;
exports.traderDetail = traderDetail.traderDetail;