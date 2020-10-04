import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const sendGrid = require('./api/sendGrid');
const traderDetail = require('./api/traderDetail');
const merklisteMetaPage = require('./api/merklisteMetaPage');
const serveSitemapIndex = require('./api/serveSitemap/serveSitemapIndex');
const serveTraderSitemap = require('./api/serveSitemap/serveTraderSitemap');
const serveBaseSitemap = require('./api/serveSitemap/serveBaseSitemap');
const locationByDistance = require('./api/locationByDistance');


const sendCustomVerifyMail = require('./triggers/sendCustomVerifyMail');
const deleteThumbnailsTriggeredByImageDeletion = require('./triggers/deleteThumbnailsTriggeredByImageDeletion');
const deleteUser = require('./triggers/deleteUser');
const deleteProduct = require('./triggers/deleteProduct');
const syncLocationsOnTradersChange = require('./triggers/syncLocationsOnTradersChange');


const backupFirestoreDatabaseToStorage = require('./jobs/backupFirestoreDatabaseToStorage');
const insightsBot = require('./jobs/insights');
const uploadImage = require('./triggers/uploadImage')
const algoliaIndexing = require('./triggers/algoliaIndexing');
const publicBookmark = require('./triggers/publicBookmark');

exports.sendGrid = sendGrid.sendGrid;
exports.sendCustomVerifyMail = sendCustomVerifyMail.sendCustomVerifyMail;
exports.deleteThumbnailsTriggeredByImageDeletion = deleteThumbnailsTriggeredByImageDeletion.deleteThumbnailsTriggeredByImageDeletion;
exports.deleteUser = deleteUser.deleteUser;
exports.deleteProduct = deleteProduct.deleteProduct;
exports.backupFirestoreDatabaseToStorage = backupFirestoreDatabaseToStorage.backupFirestoreDatabaseToStorage;
exports.traderDetail = traderDetail.traderDetail;
exports.merklisteMetaPage = merklisteMetaPage.merklisteMetaPage;
exports.serveSitemapIndex = serveSitemapIndex.serveSitemapIndex;
exports.serveTraderSitemap = serveTraderSitemap.serveTraderSitemap;
exports.serveBaseSitemap = serveBaseSitemap.serveBaseSitemap;
exports.locationByDistance = locationByDistance.locationByDistance;
exports.syncLocationsOnTradersChange = syncLocationsOnTradersChange.syncLocationsOnTradersChange;
exports.uploadImage = uploadImage.resizeImage;
exports.createAlgoliaIndex = algoliaIndexing.createAlgoliaIndex;
exports.updateAlgoliaIndex = algoliaIndexing.updateAlgoliaIndex;
exports.deleteAlgoliaIndex = algoliaIndexing.deleteAlgoliaIndex;
exports.insightsBot = insightsBot.insights;
exports.uploadImage = uploadImage.resizeImage;
exports.updatePublicBookmark = publicBookmark.updatePublicBookmark;
exports.deletePublicBookmark = publicBookmark.deletePublicBookmark;
