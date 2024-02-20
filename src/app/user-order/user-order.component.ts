import { Component } from '@angular/core';

import { Coin } from "../Models/Coin/Coin.model"
import { CoinService } from '../Services/coin.service'
import { UserService } from '../Services/user.service'
import { SharedService } from '../Services/shared.service';
import { DialogService } from '../Services/dialog.service';

import { MatDialog } from '@angular/material/dialog';
import { CoinDetailDialogComponent } from '../coin-detail-dialog/coin-detail-dialog.component';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';

import { User } from '../Models/User/User.model';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.scss']
})
export class UserOrderComponent {

  myCoinOrders?: Coin[]=[];
  myCheckOut?: Coin[];
  userSignedIn: boolean = false;
  currentUser?: User | null;
  orderIds: number[] = [];

  subtotal: number = 0;
  tax: number = 0;
  shippingFee: number = 0;
  total: number = 0;

  constructor(
    private coinService: CoinService, private userService: UserService, private dialogService: DialogService,
    public dialog: MatDialog,
    private sharedService: SharedService) {
    this.sharedService.UserSignedIn$.subscribe(newValue => { this.userSignedIn = newValue; });
    this.sharedService.CurrentUser$.subscribe(newValue => { this.currentUser = newValue; });

    this.sharedService.ValidateUserProfile();
  }

  ngOnInit(): void { this.getUserOrder(); }

  getUserOrder() {
    if (this.currentUser)
      this.userService.getUserOrders(this.currentUser.userId).subscribe((data) => {
        this.myCoinOrders = data;
        this.calculateCheckoutPrice();

        $("#divSpin").hide();
        $("#divOrder").show();
      });
  }

  calculateCheckoutPrice() {
    let needCheckoutCoins = this.myCoinOrders?.filter(function (f) { return f.coinOrder.needCheckOut; });

    this.subtotal = _.sumBy(needCheckoutCoins, function (o) { return o.coinOrder.purchasePrice; });
    this.tax = _.sumBy(needCheckoutCoins, function (o) { return o.coinOrder.tax; });
    this.shippingFee = _.sumBy(needCheckoutCoins, function (o) { return o.coinOrder.shippingFee; });
    this.total = this.subtotal + this.tax + this.shippingFee;
  }

  selectNeedCheckOutCoin(e: any, coin: any) {
    // let clickedCoin = this.myCoinOrders?.find(function (f) { return f.coinId == coin.coinId; });
    // if (clickedCoin && clickedCoin.coinOrder) {
    //   clickedCoin.coinOrder.needCheckOut = e.target.checked;
    // }
    coin.coinOrder.needCheckOut = !coin.coinOrder.needCheckOut;
    this.calculateCheckoutPrice();
  }

  async removeCoin(coin: any){

    const confirmed = await this.dialogService.openConfirmDialog();

    if (confirmed) {
      
      if (this.currentUser)
      this.userService.removeCoin(this.currentUser.userId, coin.coinId).subscribe((data) => {
        if (this.myCoinOrders) _.remove(this.myCoinOrders, (c)=>c.coinId == coin.coinId);
        this.calculateCheckoutPrice();
        this.sharedService.ValidateUserProfile();
        $("#divSpin").hide();
        $("#divOrder").show();
      });

    } else {
      // Cancelled
    }

  }

  checkOut() {
    if (this.currentUser) {
      //get coinIds
      let needCheckoutCoins = this.myCoinOrders?.filter(function (f) { return f.coinOrder.needCheckOut; });

      if (window.innerWidth <= 600) {
        const dialogRef = this.dialog.open(PaymentDialogComponent, { width: '100%', height: '100%',
          data: { UserId: this.currentUser.userId, Amount: this.total, CoinIds: _.map(needCheckoutCoins, 'coinId'), SubTotal: this.subtotal, ShippingFee: this.shippingFee, Tax: this.tax, UserCountryCode: this.currentUser.countryCode }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (this.currentUser)
            this.getUserOrder();
          this.sharedService.ValidateUserProfile();
        });
      } else {
        const dialogRef = this.dialog.open(PaymentDialogComponent, { width: '40%', height: '90%',
          data: { UserId: this.currentUser.userId, Amount: this.total, CoinIds: _.map(needCheckoutCoins, 'coinId'), SubTotal: this.subtotal, ShippingFee: this.shippingFee, Tax: this.tax, UserCountryCode: this.currentUser.countryCode }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (this.currentUser)
            this.getUserOrder();
          this.sharedService.ValidateUserProfile();
        });
      }


    }
  }

  openCoinDetail(coin: any): void {
    if (window.innerWidth <= 600) {
      const dialogRef = this.dialog.open(CoinDetailDialogComponent, { width: '100%', height: '80%', maxWidth: '100%', data: { View: coin } });
      dialogRef.afterClosed().subscribe(result => { if (this.currentUser) this.getUserOrder(); });
    } else {
      const dialogRef = this.dialog.open(CoinDetailDialogComponent, { width: '80%', height: '80%', data: { View: coin } });
      dialogRef.afterClosed().subscribe(result => { if (this.currentUser) this.getUserOrder(); });
    }
  }

}
