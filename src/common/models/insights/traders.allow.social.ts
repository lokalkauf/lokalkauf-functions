export interface TradersAllowSocial { 
    shopName: string,
    personName: string,
    personLastName: string,
    city: number,
    images: string[]
}

export interface TradersAllowSocialSummary { 
    total: TradersAllowSocial[],
    last24h: TradersAllowSocial[]
}