import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../Services/localStorage.service';

import { WebApi } from '../Models/System/WebApi.model';
import { Coin } from "../Models/Coin/Coin.model"
import { CoinShipping } from "../Models/Coin/CoinShipping.model"

@Injectable({ providedIn: 'root' })
export class CoinService {

  // headers: HttpHeaders;
  http: HttpClient;

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) {
    this.http = httpClient;
  }

  public getNews() {
    const url = WebApi.BYD_API + '/api/Coin/getNews';
    return this.http.get<any>(url);
  }

  public getCoinsInHomePage() {
    const url = WebApi.BYD_API + '/api/Coin/getCoinsInHomePage';
    return this.http.get<any>(url);
  }

  public getCategoryCoins(){
    const url = WebApi.BYD_API + '/api/Coin/getCategoryCoins';
    return this.http.get<any>(url);
  }

  public getCompanyCoins(companyId: number) {
    const url = WebApi.BYD_API + '/api/Coin/getCompanyCoins?companyId=' + companyId;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.localStorageService.getData('Token') }) };
    return this.http.get<any>(url, httpOptions);
  }

  public getCoinsByPage(coinPara: any) {
    const url = WebApi.BYD_API + '/api/Coin/getCoinsByPage';
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(url, coinPara, httpOptions);
  }

  public getCompanyCoinsByPage(coinPara: any) {
    const url = WebApi.BYD_API + '/api/Coin/getCompanyCoinsByPage';
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.localStorageService.getData('Token') }) };
    return this.http.post<any>(url, coinPara, httpOptions);
  }

  public getCoinImageById(coinId:number){
    const url = WebApi.BYD_API + '/api/Coin/getCoinImageById?coinId=' + coinId;
    return this.http.get<any>(url);
  }

  public getCoinIndexImageById(coinId:number, imageIndex:number){
    const url = WebApi.BYD_API + '/api/Coin/getCoinIndexImageById?coinId=' + coinId+"&imageIndex="+imageIndex;
    return this.http.get<any>(url);
  }

  public getCoinUserMessage(coinId:number, userId:number){
    const url = WebApi.BYD_API + '/api/User/getCoinUserMessage?coinId=' + coinId+"&userId="+userId;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.localStorageService.getData('Token') })};
    return this.http.get<any>(url,httpOptions);
  }

  public setCoinUserMessageHadRead(coinId:number, userId:number){
    const url = WebApi.BYD_API + '/api/User/setCoinUserMessageHadRead?coinId=' + coinId+"&userId="+userId;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.localStorageService.getData('Token') }) };
    return this.http.get<any>(url,httpOptions);
  }

  public getCoinOriginalImageById(coinId:number){
    const url = WebApi.BYD_API + '/api/Coin/getCoinOriginalImageById?coinId=' + coinId;
    return this.http.get<any>(url);
  }

  public getMyWatchList(userId: number) {
    const url = WebApi.BYD_API + '/api/Coin/getMyWatchList?userId=' + userId;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.localStorageService.getData('Token') }) };
    return this.http.get<any>(url,httpOptions);
  }

  public addNewCoin(newCoin: Coin) {
    const url = WebApi.BYD_API + '/api/Coin/addNewCoin';
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.localStorageService.getData('Token') })};
    return this.http.post<any>(url, newCoin, httpOptions);
  }

  public modifyCoin(newCoin: Coin) {
    const url = WebApi.BYD_API + '/api/Coin/modifyCoin';
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.localStorageService.getData('Token')})};
    return this.http.post<any>(url, newCoin, httpOptions);
  }

  public removeCoin(coinId: number, userId:number){
    let coin = {CoinId: coinId, UserId:userId};
    const url = WebApi.BYD_API + '/api/Coin/removeCoin';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.localStorageService.getData('Token')
      })
    };
    return this.http.post<any>(url, coin, httpOptions);
  }

  public userPaymentSucceed(paymentData: any){
    const url = WebApi.BYD_API + '/api/Coin/userPaymentSucceed';
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.localStorageService.getData('Token')})};
    return this.http.post<any>(url, paymentData, httpOptions);
  }

  public updateTrackingNumber(coinShipping:CoinShipping){
    const url = WebApi.BYD_API + '/api/Coin/updateTrackingNumber';
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.localStorageService.getData('Token')})};
    return this.http.post<any>(url, coinShipping, httpOptions);
  }

  public checkUserCoinOffer(coinId: number, userId:number){
    const url = WebApi.BYD_API + '/api/Coin/checkUserCoinOffer';
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.localStorageService.getData('Token')})};
    return this.http.post<any>(url, {CoinId:coinId, UserId:userId}, httpOptions);
  }
}
