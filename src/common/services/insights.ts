import * as admin from 'firebase-admin';
import * as tmp from 'tmp';
import * as fs  from 'fs';
import * as moment from 'moment';
import * as traderRepository from '../repositories/traders.repository';
import { TradersInsights } from '../models/insights/traders.insights';
import { TraderEntity } from '../models/traderEntity';

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


        const D3Node = require('d3-node')
        const d3n = new D3Node({styles:'.test {fill:#000;}'})      // initializes D3 with container element
        d3n.createSVG(10,20).append('g') // create SVG w/ 'g' tag and width/height
        console.log(d3n.svgString());

        const svgFile = tmp.fileSync({prefix:'lk-isights', postfix:'.svg'});
        console.log(svgFile);
        fs.writeFileSync(svgFile.name, d3n.svgString());

        console.log(result);

        return result;

    } catch(err) {
        console.error(err);
        throw new Error('calculating traders insights failed!');        
    }
}