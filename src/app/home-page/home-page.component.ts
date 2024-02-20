import { Component } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CoinService } from '../Services/coin.service'
import { SharedService } from '../Services/shared.service';
import { LocalStorageService } from '../Services/localStorage.service';
import { UserService } from '../Services/user.service';

import { WebApi } from '../Models/System/WebApi.model';

import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserRegisterDialogComponent } from '../user-register-dialog/user-register-dialog.component';
import { CoinDetailDialogComponent } from '../coin-detail-dialog/coin-detail-dialog.component';

import { User } from '../Models/User/User.model';

import * as _ from 'lodash';
import * as $ from 'jquery';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  limit: number = 10; // <==== Edit this number to limit API results
  carouselOptions: OwlOptions = {
    loop: true, mouseDrag: false, touchDrag: false, pullDrag: false, dots: true,
    navSpeed: 600, autoplay: false, center: true, nav: false,
    navText: ["<span class='material-icons'>arrow_back_ios</span>", "<span class='material-icons'>arrow_forward_ios</span>"],
    responsive: {
      0: { items: 1, },
      600: { items: 1, },
      1000: { items: 1, }
    }
  };

  items = [
    { id: "1", imgUrl: 'assets/img/banner1.png', caption: 'Slide 1' },
    { id: "2", imgUrl: 'assets/img/banner2.png', caption: 'Slide 2' },
    { id: "3", imgUrl: 'assets/img/banner3.png', caption: 'Slide 3' }
  ];

  public initPrice: number = 10000;
  private hubConnection!: HubConnection;

  coins: any;
  referCoins: any[] = [];
  categoryCoins: any;
  news: any;
  userSignedIn: boolean = false;
  currentUser?: User | null;

  constructor(
    private userService: UserService, private coinService: CoinService,
    private sharedService: SharedService, private localStorageService: LocalStorageService,
    public dialog: MatDialog, private router: Router
  ) {

    //check local storage to confirm if need user login
    if (this.localStorageService.getData('CurrentUser')) {
      this.sharedService.UpdateUserSignedIn(true);
      this.sharedService.UpdateCurrentUser(this.localStorageService.getData('CurrentUser'));
      this.router.navigate(['/Dashboard']);
    }
    else {
      this.sharedService.UpdateUserSignedIn(false);
    };

    //connect signalR 
    this.hubConnection = new HubConnectionBuilder().withUrl(WebApi.BYD_API + '/signalRServiceHub').build();
    this.hubConnection.start().then(() => { console.log('Hub connection started'); });
    this.hubConnection.on('ReceiveMessage', (message: string) => {
      console.log('Received message:', message);

      if (message.indexOf("CoinId") > -1) {
        let coinInfo = JSON.parse(message);
        let spanCoinPrice = $("#spanCurrentPrice" + coinInfo.CoinId);
        let currentPrice = (coinInfo.CurrentPrice * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        spanCoinPrice.text(currentPrice);
      }
    });
  }

  ngOnInit(): void {
    //get refer coins
    this.coinService.getCoinsInHomePage().subscribe((data) => {
      // this.coins = data;
      this.referCoins = data;
      _.each(this.referCoins, (coin) => { this.getCoinImageByIndex(this.referCoins, coin.coinId, 0); });
    });

    //get category coins
    this.coinService.getCategoryCoins().subscribe((data) => {
      this.categoryCoins = data;
      _.each(this.categoryCoins, (coin) => { this.getCoinImageByIndex(this.categoryCoins, coin.coinId, 1); });
    });

    setTimeout(() => { $("#divMainSearchBox").show(); }, 200);
  }

  getCoinImage(coinId: number) {
    const allCoins = this.referCoins;
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

  getCoinImageByIndex(allCoins: any[], coinId: number, imageIndex: number) {
    this.coinService.getCoinIndexImageById(coinId, imageIndex).subscribe((data) => {
      if (data.length > 0) {
        let coinImages: any[] = [];
        coinImages.push(data[0].image1);
        // coinImages.push(data[0].image2);
        // coinImages.push(data[0].image3);
        // coinImages.push(data[0].image4);
        // coinImages.push(data[0].image5);
        // coinImages.push(data[0].image6);
        let coin = _.find(allCoins, (c) => c.coinId == data[0].coinId);
        if (coin) {
          coin.imageUrls[imageIndex] = coinImages[0];
        }
      }
    });
  }

  loopPrev(){ const firstItem = this.referCoins.shift(); this.referCoins.push(firstItem); }

  loopNext(){ const lastItem = this.referCoins.pop(); this.referCoins.unshift(lastItem); }

  scrollDownImage(e:any){ 
    $("[name='ShopNowCoin']").removeClass('byd-right-scroll-selected').addClass('byd-right-scroll');
    const lastItem = this.referCoins.pop(); 
    this.referCoins.unshift(lastItem); 
    $(e.target).removeClass('byd-right-scroll').addClass('byd-right-scroll-selected');
  }

  gotoRouter(routerName: string) { this.router.navigate(['/' + routerName]); }

  sendMessage() { this.hubConnection.invoke('SendMessage', 'Hello from Angular!'); }

  addCoinToWatchlist() { alert("Please sign in first."); }

  gotoCategoryCoins(categoryId: number) {
    const navigationExtras: NavigationExtras = { queryParams: { sw: categoryId + "^" } };
    this.router.navigate(['/CoinList'], navigationExtras);
  }

  openCoinDetail(coinId: number): void {
    const dialogRef = this.dialog.open(CoinDetailDialogComponent, {
      width: '80%',
      height: '80%',
      data: { View: _.find(this.referCoins, (item) => item.coinId == coinId) }
    });
  }

  register() {
    if (window.innerWidth <= 600) {
      const dialogRef = this.dialog.open(UserRegisterDialogComponent, { width: '100%', height: '80%', maxWidth: '100%' });
    } else {
      const dialogRef = this.dialog.open(UserRegisterDialogComponent, { width: '50%', height: '80%' });
    }
  }
}
