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
  selector: 'app-user-purchase',
  templateUrl: './user-purchase.component.html',
  styleUrls: ['./user-purchase.component.scss']
})
export class UserPurchaseComponent {

  @ViewChild('grid', { static: false }) grid!: GridComponent;

  userSignedIn: boolean = false;
  currentUser?: User | null;
  userPurchaseCoins:any[]=[];
  coinTotalPurchaseCount:number=0;
  coinTotalPurchaseAmount:number=0;

  constructor(
    private coinService: CoinService, private cdr: ChangeDetectorRef,
    private userService: UserService, private router: Router,
    private dialogService: DialogService, public dialog: MatDialog, 
    private sharedService: SharedService)  {
    this.sharedService.UserSignedIn$.subscribe(newValue => { this.userSignedIn = newValue; });
    this.sharedService.CurrentUser$.subscribe(newValue => { this.currentUser = newValue; });

    this.sharedService.ValidateUserProfile();
  }

  ngOnInit(): void { this.getUserPurchaseCoins(); }

  openCoinDetail(coin: any): void {
    
    if (window.innerWidth <= 600) {
      const dialogRef = this.dialog.open(CoinDetailDialogComponent, { width: '100%', height: '80%', maxWidth: '100%', data: { View: coin } });
      dialogRef.afterClosed().subscribe(result => {    });
    } else {
      const dialogRef = this.dialog.open(CoinDetailDialogComponent, { width: '80%', height: '80%', data: { View: coin } });
      dialogRef.afterClosed().subscribe(result => {    });
    }
  }

  getUserPurchaseCoins(){
    if (this.currentUser)
    this.userService.getUserPurchaseCoins(this.currentUser.userId).subscribe((data) => {
      _.each(data, (c)=> { 
        c.purchaseDate = moment(c.purchaseDate).format('YYYY-MM-D, h:mm:ss a');
        c.shippingDate = moment(c.shippingDate).format('YYYY-MM-D, h:mm:ss a');
        c.total = c.purchasePrice + c.shippingFee + c.tax + c.serviceFee;
    });

      this.userPurchaseCoins = data;

      this.coinTotalPurchaseCount = this.userPurchaseCoins.length;
      this.coinTotalPurchaseAmount = _.sumBy(this.userPurchaseCoins, function (o) { return o.total; });

      $("#divSpin").hide();
    });
  }


}
