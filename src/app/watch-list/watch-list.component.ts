import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { Coin } from "../Models/Coin/Coin.model"
import { CoinService } from '../Services/coin.service'
import { UserService } from '../Services/user.service'
import { SharedService } from '../Services/shared.service';

import { MatDialog } from '@angular/material/dialog';
import { CoinDetailDialogComponent } from '../coin-detail-dialog/coin-detail-dialog.component';
import { BuySucceedDialogComponent } from '../buy-succeed-dialog/buy-succeed-dialog.component';

import { User } from '../Models/User/User.model';

import * as _ from 'lodash';
import * as $ from 'jquery';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss']
})
export class WatchListComponent {

  coins: any;
  userSignedIn: boolean = false;
  currentUser?: User | null;

  constructor(
    private coinService: CoinService, public dialog: MatDialog,
    private router: Router, private activatedRoute: ActivatedRoute,
    private sharedService: SharedService, private userService:UserService) {
    this.sharedService.UserSignedIn$.subscribe(newValue => { this.userSignedIn = newValue; });
    this.sharedService.CurrentUser$.subscribe(newValue => { this.currentUser = newValue; });

    this.sharedService.ValidateUserProfile();
  }

  ngOnInit(): void {
    if (this.currentUser)
      this.coinService.getMyWatchList(this.currentUser.userId).subscribe((data) => {
        this.coins = data;
        $("#divSpin").hide();
        _.each(this.coins, (coin) => { coin.currentCoinImage = coin.imageUrls[0]; this.getCoinImage(coin.coinId); });
      });
  }

  getCoinImage(coinId: number) {
    const allCoins = this.coins;
    this.coinService.getCoinImageById(coinId).subscribe((data) => {
      if (data.length > 0) {
        let coin = _.find(allCoins, (c) => c.coinId == data[0].coinId);
        if (coin) {
          coin.currentCoinImage = data[0].image1;
          coin.imageUrls[0] = data[0].image1;
          coin.imageUrls[1] = data[0].image2;
          coin.imageUrls[2] = data[0].image3;
          coin.imageUrls[3] = data[0].image4;
          coin.imageUrls[4] = data[0].image5;
          coin.imageUrls[5] = data[0].image6;
        }
      }
    });
  }

  onSort(sortId: number) {
    switch (sortId) {
      case 1:
        this.coins = _.orderBy(this.coins, ['currentPrice'], ['asc']);
        break;
      case 2:
        this.coins = _.orderBy(this.coins, ['currentPrice'], ['desc']);
        break;
      case 3:
        this.coins = _.orderBy(this.coins, ['increment'], ['asc']);
        break;
      case 4:
        this.coins = _.orderBy(this.coins, ['increment'], ['desc']);
        break;
      case 5:
        this.coins = _.orderBy(this.coins, ['watchDate'], ['desc']);
        break;
      case 6:
        this.coins = _.orderBy(this.coins, ['watchDate'], ['asc']);
        break;
    }
  }

  removeCoinFromWatchlist(coinId:number) {
    if (this.currentUser) {
      let watchItem = { CoinId: coinId, UserId: this.currentUser.userId };

      this.userService.removeCoinFromWatchlist(watchItem).subscribe((result) => {
        _.remove(this.coins, (f:Coin)=>f.coinId == coinId);
      });
    }
  }

  showImage(imageIndex: number, currentCoin: any) {
    if (currentCoin.imageUrls[imageIndex] != '') {
      currentCoin.currentCoinImage = currentCoin.imageUrls[imageIndex];
    }
  }

  openCoinDetail(coin: any): void {
    if (window.innerWidth <= 600) {
      const dialogRef = this.dialog.open(CoinDetailDialogComponent, { width: '100%', height: '80%', maxWidth: '100%', data: { View: coin } });

      dialogRef.afterClosed().subscribe(result => {
        if (this.currentUser && result)
          if (result.split('^')[0] == 'CompanyCoinList') {
            const navigationExtras: NavigationExtras = { queryParams: { id: result.split('^')[1] } };
            this.router.navigate(['/CompanyCoinList'], navigationExtras);
          }

        if (result.split('^')[0] == 'CoinList') {
          const buyCoinId = result.split('^')[1];
          const dialogRef_buy = this.dialog.open(BuySucceedDialogComponent, { width: '50%', height: '40%' });

          dialogRef_buy.afterClosed().subscribe(result => {
            if (result == 0) {
              _.remove(this.coins, (c: any) => c.coinId == buyCoinId);
              this.sharedService.ValidateUserProfile();
            } else {
              this.router.navigate(['/UserOrder']);
            }
          });
        }

      });
    } else {
      const dialogRef = this.dialog.open(CoinDetailDialogComponent, { width: '80%', height: '80%', data: { View: coin } });

      dialogRef.afterClosed().subscribe(result => {
        if (this.currentUser && result)
          if (result.split('^')[0] == 'CompanyCoinList') {
            const navigationExtras: NavigationExtras = { queryParams: { id: result.split('^')[1] } };
            this.router.navigate(['/CompanyCoinList'], navigationExtras);
          }

        if (result.split('^')[0] == 'CoinList') {
          const buyCoinId = result.split('^')[1];
          const dialogRef_buy = this.dialog.open(BuySucceedDialogComponent, { width: '50%', height: '40%' });

          dialogRef_buy.afterClosed().subscribe(result => {
            if (result == 0) {
              _.remove(this.coins, (c: any) => c.coinId == buyCoinId);
              this.sharedService.ValidateUserProfile();
            } else {
              this.router.navigate(['/UserOrder']);
            }
          });
        }

      });
    }
  }
}
