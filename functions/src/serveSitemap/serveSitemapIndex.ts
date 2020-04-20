import * as functions from 'firebase-functions';

const url = functions.config().app.url;

export const serveSitemapIndex = functions.https.onRequest(async (req, res) => {
  const string = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap>' +
    '<loc>' + url + '/sitemaps/base.txt' + '</loc>' +
    '</sitemap><sitemap>' +
    '<loc>' + url + '/sitemaps/trader.txt' + '</loc>' +
    '</sitemap></sitemapindex>'
  console.log(string);
  res.type('xml').status(200).send(string)
});
