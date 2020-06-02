import * as csv from "csvtojson";
const axios = require('axios');
import { TraderProfile } from "../../../models/traderProfile";
import * as fs from 'fs';


export async function loadData(options:any) : Promise<Partial<TraderProfile>[]> {
   let csvValue: string = '';

   if (options.file) {
       csvValue = fs.readFileSync(options.file, 'utf8');
   } else if(options.url) {
      const response = await axios.get(options.url);
      csvValue = response.data;
   }

    return await loadDataFromCsvString(csvValue);
}

async function loadDataFromCsvString(csvValue: string) : Promise<Partial<TraderProfile>[]> {
    const traders: Partial<TraderProfile>[] = [];
    
    if (csvValue) {
        const jsonArray = await csv().fromString(csvValue);
        console.log(jsonArray);
    }
 
     return traders;
 }