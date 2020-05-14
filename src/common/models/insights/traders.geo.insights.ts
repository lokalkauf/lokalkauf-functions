export interface TradersGeoRegion { 
    name: string,
    total: number,
    last24h: number
}

export interface TradersGeoInsights {
    states: TradersGeoRegion[],
    counties: TradersGeoRegion[]
}