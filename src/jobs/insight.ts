import * as functions from 'firebase-functions';

export const insights = functions.pubsub
.schedule('every day 00:00')
.onRun(async (_context) => {
    // curl -X POST -H ‘Content-type: application/json’ --data ‘{“text”:“Are you up for a Turing test?“}’ https://hooks.slack.com/servis/T012VSHP56G/B012R99AECW/NERijpOJFFx9E0IhfifaFRO8
    console.log('not implemented');
 })