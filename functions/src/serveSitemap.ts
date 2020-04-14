import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const url = functions.config().app.url;
const bucket = admin.storage().bucket();

export const serveSitemapIndex = functions.https.onRequest(async (_req, res) => {
  const string = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap>' +
    '<loc>' + url + '/sitemaps/base.txt' + '</loc>' +
    '</sitemap><sitemap>' +
    '<loc>' + url + '/sitemaps/trader.txt' + '</loc>' +
    '</sitemap></sitemapindex>'
  res.status(200).send(string);
});

export const serveTraderSitemap = functions.https.onRequest(async (req, res) => {
  const file = bucket.file('Data/trader.txt');
  return file;
});
