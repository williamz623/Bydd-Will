import { CoinOffer } from '../Coin/CoinOffer.model'
export class User {
    userId:number = 0;
    email:string = '';
    password:string='';
    passwordOld:string='';
    RePassword:string='';
    firstName:string='';
    lastName:string = '';
    displayName: string = '';
    IsActive:boolean = true;
    EnteredDate:Date|undefined;
    EnteredUserId:number = 0;
    UpdatedDate:Date|undefined;
    UpdatedUserId:number = 0;
    phone:string = '';
    mobile:string = '';
    address1:string = '';
    address2:string = '';
    city:string = '';
    province:string = '';
    postalCode:string = '';
    country:string = '';
    countryCode:string = '';
    coinWatchList:any;
    coinOffer:CoinOffer[]=[];
    coinOrder:any[]=[];
}