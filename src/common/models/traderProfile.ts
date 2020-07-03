export interface TraderProfile {
    id?: string;
    businessname: string;
    ownerFirstname: string;
    ownerLastname: string;
    postcode: string;
    city: string;
    street: string;
    number: number;
    description: string;
    pickup: boolean;
    delivery: boolean;
    email: string;
    telephone: string;
    defaultImagePath?: string;
    storeEmail: string;
    homepage: string;
    status: TraderProfileStatus;
    soMeShare: boolean;
    confirmedLocation?: number[];
    completenessIndex: number;
    openingTime: any[];
    osm_id: string;
    osm_category: any;
    osm_modified: number;
    import_date: number;
    licence: string;
    storeType: {
      gastronomie: boolean;
      lebensmittel: boolean;
      fashion: boolean;
      buchhandlung: boolean;
      homedecor: boolean;
      blumengarten: boolean;
      handwerk: boolean;
      sonstiges: boolean;
    };
  }
  
  export enum TraderProfileStatus {
    CREATED = 'CREATED',
    IMPORTED = 'IMPORTED',
    VERIFIED = 'VERFIED',
    PUBLIC = 'PUBLIC',
    DELETED = 'DELETED',
  }  