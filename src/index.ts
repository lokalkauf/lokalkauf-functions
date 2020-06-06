import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

const sendGrid = require('./api/sendGrid');
const traderDetail = require('./api/traderDetail');
const serveSitemapIndex = require('./api/serveSitemap/serveSitemapIndex');
const serveTraderSitemap = require('./api/serveSitemap/serveTraderSitemap');
const serveBaseSitemap = require('./api/serveSitemap/serveBaseSitemap');
const locationByDistance = require('./api/locationByDistance');


const sendCustomVerifyMail = require('./triggers/sendCustomVerifyMail');
const deleteThumbnailsTriggeredByImageDeletion = require('./triggers/deleteThumbnailsTriggeredByImageDeletion');
const deleteUser = require('./triggers/deleteUser');
const syncLocationsOnTradersChange = require('./triggers/syncLocationsOnTradersChange');


const backupFirestoreDatabaseToStorage = require('./jobs/backupFirestoreDatabaseToStorage');
const uploadImage = require('./triggers/uploadImage')

exports.sendGrid = sendGrid.sendGrid;
exports.sendCustomVerifyMail = sendCustomVerifyMail.sendCustomVerifyMail;
exports.deleteThumbnailsTriggeredByImageDeletion = deleteThumbnailsTriggeredByImageDeletion.deleteThumbnailsTriggeredByImageDeletion;
exports.deleteUser = deleteUser.deleteUser;
exports.backupFirestoreDatabaseToStorage = backupFirestoreDatabaseToStorage.backupFirestoreDatabaseToStorage;
exports.traderDetail = traderDetail.traderDetail;
exports.serveSitemapIndex = serveSitemapIndex.serveSitemapIndex;
exports.serveTraderSitemap = serveTraderSitemap.serveTraderSitemap;
exports.serveBaseSitemap = serveBaseSitemap.serveBaseSitemap;
exports.locationByDistance = locationByDistance.locationByDistance;
exports.syncLocationsOnTradersChange = syncLocationsOnTradersChange.syncLocationsOnTradersChange;
exports.uploadImage = uploadImage.resizeImage
