import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { Coin } from "../Models/Coin/Coin.model";
import { User } from "../Models/User/User.model";
import { CoinService } from '../Services/coin.service';
import { DialogService } from '../Services/dialog.service';
import { SharedService } from '../Services/shared.service';
import { LocalStorageService } from '../Services/localStorage.service';

import { MatDialog } from '@angular/material/dialog';
import { CoinDetailDialogComponent } from '../coin-detail-dialog/coin-detail-dialog.component';
import { CoinModifyDialogComponent } from '../coin-modify-dialog/coin-modify-dialog.component';
import { BuySucceedDialogComponent } from '../buy-succeed-dialog/buy-succeed-dialog.component';

import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'app-company-coin-list',
  templateUrl: './company-coin-list.component.html',
  styleUrls: ['./company-coin-list.component.scss']
})
export class CompanyCoinListComponent {

  @ViewChild('divCoinListContainer') divCoinListContainer!: ElementRef;
  coins: any[] = [];

  skip: number = 0;
  pageSize: number = 5;

  sellerId: number = 0;
  searchWord: string = "";
  currentUser?: User | null;

  sortBy = [
    { value: "1", text: "Best Match" },
    { value: "2", text: "Price(low to high)" },
    { value: "3", text: "Price(high to low)" },
    { value: "4", text: "Increment(highest descending)" },
    { value: "5", text: "Date added(new)" }
  ];
  currentSortBy = { value: "1", text: "Best Match" };

  filter = [
    { value: "0", text: "All" },
    { value: "1", text: "0 - $500" },
    { value: "2", text: "$501 - $1000" },
    { value: "3", text: "$1001 - $2500" },
    { value: "4", text: "above $2500" }
  ];
  currentFilter = { value: "0", text: "All" };

  constructor(
    private coinService: CoinService,
    private dialogService: DialogService,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private router: Router, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {

    this.sharedService.CurrentUser$.subscribe(newValue => { this.currentUser = newValue; });

    //check local storage to confirm if need user login
    if (this.localStorageService.getData('CurrentUser')) {
      this.sharedService.UpdateUserSignedIn(true);
      this.sharedService.UpdateCurrentUser(this.localStorageService.getData('CurrentUser'));
    }
    else {
      this.sharedService.UpdateUserSignedIn(false);
    };
  }

  ngOnInit(): void {
    //get sw from query string from other page
    // this.activatedRoute.params.subscribe(params => {
    //   this.skip=0;
    //   this.sellerId = +params['id']; 
    //   this.getCoinsByPage(false);  
    // });

    this.activatedRoute.queryParams.subscribe(params => {
      this.skip = 0;
      this.sellerId = params['id'];
      this.getCoinsByPage(false);
    });
  }

  getCoinsByPage(needConcat: boolean) {
    this.coinService.getCompanyCoinsByPage({ UserId: this.sellerId, Skip: this.skip, PageSize: this.pageSize, CoinId: 0, ParaString: this.searchWord, Filter: this.currentFilter.value, Sort: this.currentSortBy.value }).subscribe((data) => {
      $("#divSpin").hide();
      if (needConcat)
        this.coins = this.coins.concat(data);
      else
        this.coins = data;

      _.each(data, (c) => { this.getCoinImage(c.coinId); });
    });
  }

  filterChange(value: any): void { 
    if (this.divCoinListContainer) {
      const topOffset = 0;
      this.divCoinListContainer.nativeElement.scrollTo({ top: topOffset, behavior: 'auto' });
    }

    this.skip = 0; 
    this.coins = []; 
    setTimeout(() => { this.getCoinsByPage(false); }, 50);
  }

  sortChange(value: any): void {
    if (this.divCoinListContainer) {
      const topOffset = 0;
      this.divCoinListContainer.nativeElement.scrollTo({ top: topOffset, behavior: 'auto' });
    }

    this.skip = 0;
    this.coins = [];

    setTimeout(() => { this.getCoinsByPage(false); }, 10);
  }

  getCoinImage(coinId: number) {
    const allCoins = this.coins;
    this.coinService.getCoinImageById(coinId).subscribe((data) => {
      if (data.length > 0) {
        let coin = _.find(allCoins, (c) => c.coinId == data[0].coinId);
        if (coin) {
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

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const div = this.divCoinListContainer.nativeElement;
    if (div.scrollTop > 0) {
      if (div.scrollTop + div.offsetHeight >= div.scrollHeight - 50) {
        this.skip = this.skip + this.pageSize;
        this.getCoinsByPage(true);
      }
    }
  }

  public addNewCoin() {
    window.location.href = window.location.href.replace("CoinList", "NewCoin");
  }

  openCoinDetail(coin: any): void {
    if (window.innerWidth <= 600){
      const dialogRef = this.dialog.open(CoinDetailDialogComponent, { width: '100%', height: '80%', maxWidth:'100%', data: { View: coin } });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
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
        }
      });
    } else {
      const dialogRef = this.dialog.open(CoinDetailDialogComponent, { width: '80%', height: '80%', data: { View: coin } });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
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
        }
      });
    } 
  }

  modifyCoin(coin: Coin) {
    const dialogRef = this.dialog.open(CoinModifyDialogComponent, { width: '60%', height: '80%', data: { Coin: coin } });

    dialogRef.afterClosed().subscribe(result => {
      if (result.coinId) {
        let coinIndex = _.findIndex(this.coins, (c) => c.coinId == result.coinId);
        if (coinIndex > -1) this.coins[coinIndex] = result;
      }
    });
  }

  async removeCoin(coinId: number) {
    const confirmed = await this.dialogService.openConfirmDialog();

    if (confirmed) {
      let userId = 0;
      if (this.currentUser) userId = this.currentUser?.userId;
      this.coinService.removeCoin(coinId, userId).subscribe((data) => {
        if (data == 1) {
          _.remove(this.coins, (c: any) => c.coinId == coinId);
        }
      });
    } else {
      // Cancelled
    }

  }

}
