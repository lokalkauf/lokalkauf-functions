import * as admin from 'firebase-admin';
import * as moment from 'moment';
import * as traderRepository from '../repositories/traders.repository';
import { TradersInsights } from '../models/insights/traders.insights';
import { TraderEntity } from '../models/traderEntity';
import * as quickchart from './quickchart.provider';
import * as slack from './slack.provider';

export async function traders(app: admin.app.App) : Promise<TradersInsights> {

    try {
        console.log('generate traders insights...');
        const all: TraderEntity[] = await traderRepository.loadTraders(app);

        const result =  {
            total : all.length,
            active : all.filter((t:TraderEntity) => t.status === 'PUBLIC').length,
            inactive : all.filter((t:TraderEntity) => t.status !== 'PUBLIC').length,
            last24h : all.filter((t: TraderEntity) => moment(t.createdAt).diff(Date.now(), 'days') > -1).length,
        };

        const dataCumulative:number[] = [];
        const dataCumulative24h:number[] = [];
        const labelsCummulative: string[] = [];

        for(let x=0; x < 50; x++) {
            const itms = all.filter((t: TraderEntity) => moment(t.createdAt).diff(Date.now(), 'days') < (x*-1)).length;
            dataCumulative.push(itms);

            const itms24h = (x > 0)? (itms - dataCumulative[x-1])*-1 : 0;
            dataCumulative24h.push(itms24h);

            labelsCummulative.push(moment().subtract(x,'days').format('DD.MM'));
        }

        const data = {
            labels: labelsCummulative.reverse(),
            datasets: [
                {
                    label: 'total',
                    data: dataCumulative.reverse(),
                    backgroundColor: '#78DCF4'
                },
                {
                    label: '24h',
                    data: dataCumulative24h.reverse(),
                    backgroundColor: '#22B003'
                }
            ]
        }

        const data2 = {
            labels: ['active', 'inactive', 'last 24h +'],
            data: [result.active, result.inactive, result.last24h]
        };

        const tradersLast50days = await quickchart.createStackedBarsUrl('Traders', data.labels, data.datasets);
        const tradersChartURL = await quickchart.createDoughnutUrl('curent Traders', result.total, data2.labels, data2.data);


        const someTraders = all.filter((t: TraderEntity) => moment(t.createdAt).diff(Date.now(), 'days') > -100)
                               .sort((a,b) => a.createdAt - b.createdAt).reverse().filter(t => t.soMeShare && t.soMeShare === true)
                               .map(t => `<https://lokalkauf.org/trader-detail/${t.id}> ${t.postcode} ${t.city} - ${t.businessname}  (created: ${moment(t.createdAt).fromNow()})`).join('\n');


        await slack.sendMessage(app, "traders SoMe allowed: \n\n" + someTraders);
        await slack.sendMessage(app, "traders system update: ", tradersChartURL);
        await slack.sendMessage(app, "traders registration last 50 days: ", tradersLast50days);

        return result;

    } catch(err) {
        console.error(err);
        throw new Error('calculating traders insights failed!');
    }
}
