import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { GridComponent } from '@progress/kendo-angular-grid'; // Import the GridComponent

import { User } from '../Models/User/User.model';
import { Coin } from "../Models/Coin/Coin.model";
import { CoinService } from '../Services/coin.service';
import { UserService } from '../Services/user.service';
import { DialogService } from '../Services/dialog.service';
import { SharedService } from '../Services/shared.service';

import { MatDialog, MatDialogConfig  } from '@angular/material/dialog';
import { CoinDetailDialogComponent } from '../coin-detail-dialog/coin-detail-dialog.component';
import { TrackingNumberInputDialogComponent } from '../tracking-number-input-dialog/tracking-number-input-dialog.component';
import { CoinModifyDialogComponent } from '../coin-modify-dialog/coin-modify-dialog.component';

import { Router, NavigationExtras } from '@angular/router';

import * as $ from 'jquery';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent {

  @ViewChild('grid', { static: false }) grid!: GridComponent;

  userSellSummary: any;
  userSignedIn: boolean = false;
  currentUser?: User | null;
  userAllCoins:Coin[]=[];
  userCoins:Coin[]=[];
  
  currentMode=1;

  userCoins_Activity:Coin[]=[];
  coinCount_Activity:number=0;
  coinTotal_Activity:number=0;

  userCoins_Sold:Coin[]=[];
  coinCount_Sold:number=0;
  coinTotal_Sold:number=0;

  userCoins_Shipped:Coin[]=[];
  coinCount_Shipped:number=0;
  coinTotal_Shipped:number=0;
  
  userCoins_UnSold:Coin[]=[];
  coinCount_UnSold:number=0;
  coinTotal_UnSold:number=0;

  constructor(
    private coinService: CoinService, private cdr: ChangeDetectorRef,
    private userService: UserService, private router: Router,
    private dialogService: DialogService, public dialog: MatDialog, 
    private sharedService: SharedService)  {
    this.sharedService.UserSignedIn$.subscribe(newValue => { this.userSignedIn = newValue; });
    this.sharedService.CurrentUser$.subscribe(newValue => { this.currentUser = newValue; });

    this.sharedService.ValidateUserProfile();
  }

  ngOnInit(): void { this.getUserCoins(); }

  openCoinDetail(coin: any): void {    
    if (window.innerWidth <= 600) {
      const dialogRef = this.dialog.open(CoinDetailDialogComponent, { width: '100%', height: '80%', maxWidth: '100%', data: { View: coin } });
      dialogRef.afterClosed().subscribe(result => {    });
    } else {
      const dialogRef = this.dialog.open(CoinDetailDialogComponent, { width: '80%', height: '80%', data: { View: coin } });
      dialogRef.afterClosed().subscribe(result => {    });
    }
  }

  getUserCoins(){
    if (this.currentUser)
    this.userService.getUserCoins(this.currentUser.userId).subscribe((data) => {
      _.each(data, (c)=>c.enteredDate=moment(c.enteredDate).format('YYYY-MM-D, h:mm:ss a'));

      this.userAllCoins = data;

      const today=moment().toDate();
      this.userCoins_Activity = _.filter(this.userAllCoins, (c)=> c.coinStatus == 'LT' && moment(c.endDateTime).diff(today, 'days')>=14);
      this.coinCount_Activity = this.userCoins_Activity.length;
      this.coinTotal_Activity = _.sumBy(this.userCoins_Activity, function (o) { return o.currentPrice; });
      if (this.currentMode==1) this.userCoins = this.userCoins_Activity;

      this.userCoins_Sold = _.filter(this.userAllCoins, (uc)=>uc.coinStatus=="CT" || uc.coinStatus=="PD" || uc.coinStatus=="SP");
      this.coinCount_Sold = this.userCoins_Sold.length;
      this.coinTotal_Sold = _.sumBy(this.userCoins_Sold, function (o) { return o.currentPrice; });
      if (this.currentMode==2) this.userCoins = this.userCoins_Sold;

      this.userCoins_Shipped = _.filter(this.userAllCoins, (uc)=>uc.coinStatus=="SP");
      this.coinCount_Shipped = this.userCoins_Shipped.length;
      this.coinTotal_Shipped = _.sumBy(this.userCoins_Shipped, function (o) { return o.currentPrice; });
      if (this.currentMode==3) this.userCoins = this.userCoins_Shipped;

      this.userCoins_UnSold = _.filter(this.userAllCoins, (c)=> c.currentPrice == c.lowestPrice && moment(c.endDateTime).diff(today, 'days')<=14);
      this.coinCount_UnSold = this.userCoins_UnSold.length;
      this.coinTotal_UnSold = _.sumBy(this.userCoins_UnSold, function (o) { return o.currentPrice; });
      if (this.currentMode==4) this.userCoins = this.userCoins_UnSold;

      $("#divSpin").hide();
    });
  }

  loadSellCoins(loadBy:number){
    this.currentMode=loadBy;
    if (loadBy==1)
      this.userCoins = _.cloneDeep(this.userCoins_Activity);
    if (loadBy==2)
      this.userCoins = _.cloneDeep(this.userCoins_Sold);
    if (loadBy==3)
      this.userCoins = _.cloneDeep(this.userCoins_Shipped);
    if (loadBy==4)
      this.userCoins = _.cloneDeep(this.userCoins_UnSold);
  }

  inputTrackingNumber(coin:Coin){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '50%';
    dialogConfig.data = { Coin: coin, UserId: this.currentUser?.userId };

    const dialogRef = this.dialog.open(TrackingNumberInputDialogComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.getUserCoins();
      this.loadSellCoins(2);
    });
  }

  public addNewCoin() {
    this.router.navigate(['/NewCoin']);
    //window.location.href = window.location.href.replace("CoinList", "NewCoin");
  }

  modifyCoin(coin: Coin) {
    if (window.innerWidth <= 600) {
      const dialogRef = this.dialog.open(CoinModifyDialogComponent, { width: '100%', height: '90%', maxWidth: '100%', data: { Coin: coin } });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.coinId) {
          let coinIndex = _.findIndex(this.userAllCoins, (c) => c.coinId == result.coinId);
          if (coinIndex > -1) this.userAllCoins[coinIndex] = result;
          let coinIndex1 = _.findIndex(this.userCoins, (c) => c.coinId == result.coinId);
          if (coinIndex1 > -1) this.userCoins[coinIndex1] = result;
        }
      });
    } else {
      const dialogRef = this.dialog.open(CoinModifyDialogComponent, { width: '70%', height: '95%', data: { Coin: coin } });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.coinId) {
          let coinIndex = _.findIndex(this.userAllCoins, (c) => c.coinId == result.coinId);
          if (coinIndex > -1) this.userAllCoins[coinIndex] = result;
          let coinIndex1 = _.findIndex(this.userCoins, (c) => c.coinId == result.coinId);
          if (coinIndex1 > -1) this.userCoins[coinIndex1] = result;
        }
      });
    }
  }

  async removeCoin(coinId: number) {
    const confirmed = await this.dialogService.openConfirmDialog();

    if (confirmed) {
      let userId = 0;
      if (this.currentUser) userId = this.currentUser?.userId;
      this.coinService.removeCoin(coinId, userId).subscribe((data) => {
        if (data == 1) {
          this.getUserCoins();
          this.loadSellCoins(1);
        }
      });
    } else {
      // Cancelled
    }

  }
}
