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
const serveSitemapIndex = require('./serveSitemap/serveSitemapIndex');
const serveTraderSitemap = require('./serveSitemap/serveTraderSitemap');
const serveBaseSitemap = require('./serveSitemap/serveBaseSitemap');
const locationByDistance = require('./locationByDistance');
const syncLocationsOnTradersChange = require('./triggers/syncLocationsOnTradersChange');

exports.sendGrid = sendGrid.sendGrid;
exports.sendCustomVerifyMail = sendCustomVerifyMail.sendCustomVerifyMail;
exports.checkFileNumberLimit = checkFileNumberLimit.checkFileNumberLimit;
exports.deleteThumbnailsTriggeredByImageDeletion = deleteThumbnailsTriggeredByImageDeletion.deleteThumbnailsTriggeredByImageDeletion;
exports.deleteUser = deleteUser.deleteUser;
exports.backupFirestoreDatabaseToStorage = backupFirestoreDatabaseToStorage.backupFirestoreDatabaseToStorage;
exports.traderDetail = traderDetail.traderDetail;
exports.serveSitemapIndex = serveSitemapIndex.serveSitemapIndex;
exports.serveTraderSitemap = serveTraderSitemap.serveTraderSitemap;
exports.serveBaseSitemap = serveBaseSitemap.serveBaseSitemap;
exports.locationByDistance = locationByDistance.locationByDistance;
exports.syncLocationsOnTradersChange = syncLocationsOnTradersChange.syncLocationsOnTradersChange;