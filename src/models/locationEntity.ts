export interface LocationEntity {

    id:string; 
    distance: number; 
    categories: string[];

    businessname: string;
    telephone: string;
    storeEmail: string;

    postcode: string;
    city: string;
    street: string;
    number: string;

    defaultImagePath: string;
    thumbnailURL: string;
    status: string;
}