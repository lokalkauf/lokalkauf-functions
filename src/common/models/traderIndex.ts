export interface TraderIndex {
  objectID: string;
  businessname: string;
  status?: string;
  storeType: any;
  _geoloc?: any;
  description: string;
  pickup: boolean;
  delivery: boolean;
  defaultImagePath?: string;
  postcode: string;
  city: string;
  street: string;
  licence?: string;
  number?: number;
}
