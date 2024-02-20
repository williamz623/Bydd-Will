import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Coin } from '../Models/Coin/Coin.model';
import { User } from '../Models/User/User.model';

import { SharedService } from '../Services/shared.service';
import { UserService } from '../Services/user.service';
import { CoinService } from '../Services/coin.service';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import * as $ from 'jquery';

export interface CoinDetailDialogComponentData { View?: Coin }

@Component({
  selector: 'app-coin-detail-dialog',
  templateUrl: './coin-detail-dialog.component.html',
  styleUrls: ['./coin-detail-dialog.component.scss']
})
export class CoinDetailDialogComponent {

  //#region variables
  public currentCoin: any;
  currentCoinImage: string = '';
  currentCoinImage_O: string = "assets/img/loading1000.jpg";
  currentCoinOfferPrice: number = 0;
  currentCoinNoticePrice: number = 0;
  currentUser?: User | null;
  coinInWatchList: boolean = false;
  userSignedIn: boolean = false;

  btnBuyNowTitle = "Buy Now";
  btnBuyNowDisabled = false;

  btnSendOfferTitle = "Send Offer";
  btnSendOfferDisabled = false;

  btnRetractOfferTitle = "Retract Offer";
  btnRetractOfferDisabled = false;

  btnNotifyMeTitle = "Notify Me";
  btnNotifyMeDisabled = false;

  btnCancelNotifyTitle = 'Cancel Notify';
  btnCancelNotifyDisabled = false;

  btnSendMessageTitle = 'Send Message';
  btnSendMessageDisabled = false;

  messageToSeller: string = "";
  //#endregion

  constructor(
    public dialogRef: MatDialogRef<CoinDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CoinDetailDialogComponentData,
    private sharedService: SharedService, private userService: UserService, private coinService: CoinService,
    private router: Router
  ) {
    this.sharedService.UserSignedIn$.subscribe(newValue => { this.userSignedIn = newValue; });

    this.currentCoin = data.View;
    if (!this.currentCoin.originalImageUrls) this.currentCoin.originalImageUrls = ['', '', '', '', '', ''];
    //get coin images
    this.currentCoin.imageUrls = ['', '', '', '', '', ''];
    this.coinService.getCoinImageById(this.currentCoin.coinId).subscribe((data) => {
      if (data.length > 0) {
        this.currentCoin.imageUrls[0] = data[0].image1;
        this.currentCoin.imageUrls[1] = data[0].image2;
        this.currentCoin.imageUrls[2] = data[0].image3;
        this.currentCoin.imageUrls[3] = data[0].image4;
        this.currentCoin.imageUrls[4] = data[0].image5;
        this.currentCoin.imageUrls[5] = data[0].image6;

        this.currentCoinImage = this.currentCoin.imageUrls[0];
        this.currentCoinImage_O = this.currentCoinImage;
      }
    });

    //get coin original images
    const appCurrentCoin = this.currentCoin;
    this.coinService.getCoinOriginalImageById(this.currentCoin.coinId).subscribe((data) => {
      if (data.length > 0) {
        if (data[0].image1 == '')
          this.currentCoin.originalImageUrls[0] = appCurrentCoin.imageUrls[0];
        else
          this.currentCoin.originalImageUrls[0] = data[0].image1;

        if (data[0].image1 == '')
          this.currentCoin.originalImageUrls[1] = appCurrentCoin.imageUrls[1];
        else
          this.currentCoin.originalImageUrls[1] = data[0].image2;

        if (data[0].image1 == '')
          this.currentCoin.originalImageUrls[2] = appCurrentCoin.imageUrls[2];
        else
          this.currentCoin.originalImageUrls[2] = data[0].image3;

        if (data[0].image1 == '')
          this.currentCoin.originalImageUrls[3] = appCurrentCoin.imageUrls[3];
        else
          this.currentCoin.originalImageUrls[3] = data[0].image4;

        if (data[0].image1 == '')
          this.currentCoin.originalImageUrls[4] = appCurrentCoin.imageUrls[4];
        else
          this.currentCoin.originalImageUrls[4] = data[0].image5;

        if (data[0].image1 == '')
          this.currentCoin.originalImageUrls[5] = appCurrentCoin.imageUrls[5];
        else
          this.currentCoin.originalImageUrls[5] = data[0].image6;
      } else
        appCurrentCoin.originalImageUrls = appCurrentCoin.imageUrls;

      this.currentCoinImage_O = appCurrentCoin.originalImageUrls[0].length == 0 ? appCurrentCoin.imageUrls[0] : appCurrentCoin.originalImageUrls[0];

    });
  }

  ngOnInit(): void {
    this.sharedService.CurrentUser$.subscribe(newValue => { this.currentUser = newValue; });
    if (this.currentUser) {
      this.coinInWatchList = _.some(this.currentUser.coinWatchList, (item) => item == this.currentCoin.coinId);

      this.coinService.checkUserCoinOffer(this.currentCoin.coinId, this.currentUser.userId).subscribe((data) => {
        if (data > 0) {
          this.currentCoin.hasOffer = true;
          this.currentCoin.offerPrice = data;
        }
      });
    }
  }

  addCoinToWatchlist() {
    if (this.currentUser) {
      let watchItem = { CoinId: this.currentCoin.coinId, UserId: this.currentUser.userId };
      this.userService.addCoinToWatchlist(watchItem).subscribe((result) => {
        this.coinInWatchList = true;
      });
    } else
      alert("Please sign in first.");
  }

  buyCoin() {
    if (this.currentUser) {

      this.btnBuyNowTitle = "Process...";
      this.btnBuyNowDisabled = true;

      let coinItem = { CoinId: this.currentCoin.coinId, UserId: this.currentUser.userId };
      this.userService.buyCoin(coinItem).subscribe((result) => {
        this.btnBuyNowTitle = "Buy Now";
        this.btnBuyNowDisabled = false;
        this.dialogRef.close('CoinList^' + this.currentCoin.coinId);
      });
    } else
      alert("Please sign in first.");
  }

  removeCoinFromWatchlist() {
    if (this.currentUser) {
      let watchItem = { CoinId: this.currentCoin.coinId, UserId: this.currentUser.userId };

      this.userService.removeCoinFromWatchlist(watchItem).subscribe((result) => {
        this.coinInWatchList = false;
      });
    }
  }

  showImage(imageIndex: number) {
    if (this.currentCoin.imageUrls[imageIndex] != '') {
      this.currentCoinImage = this.currentCoin.imageUrls[imageIndex];
      this.currentCoinImage_O = this.currentCoin.originalImageUrls[imageIndex].length == 0 ? this.currentCoinImage : this.currentCoin.originalImageUrls[imageIndex];
    }
  }

  imageZoomIn() {
    var h = parseInt($("#divZoomOut").css("height").replace("px", "")) - 40;
    $("#divZoomIn").css("height", h + "px");

    $("#divZoomIn").show();
    $("#divZoomOut").hide();
    $("#divZoomOutButton").hide();
  }

  imageZoomOut() {
    $("#divZoomIn").hide();
    $("#divZoomOut").show();
    $("#divZoomOutButton").show();
  }

  sendOffer() {
    if (this.currentCoinOfferPrice > 0) {
      if (this.currentCoinOfferPrice > this.currentCoin.currentPrice) {
        alert("You could click [Buy Now] button when your offer price is great than the current price.");
      } else {
        if (this.currentUser) {
          this.btnSendOfferTitle = 'Processing...';
          this.btnSendOfferDisabled = true;
          //send offer
          let coinOffer = {
            CoinId: this.currentCoin.coinId,
            CoinName: this.currentCoin.name,
            UserId: this.currentUser.userId,
            OfferPrice: this.currentCoinOfferPrice,
            OfferStatusCode: 'CT',
            UserName: (!this.currentUser.displayName ? '' : this.currentUser.displayName)
          };
          this.userService.sendOffer(coinOffer).subscribe((result) => {
            alert("Your offer was sent successfully. Thanks.");

            this.btnSendOfferTitle = 'Send Offer';
            this.btnSendOfferDisabled = false;

            this.currentCoin.hasOffer = true;
            this.currentCoin.offerPrice = this.currentCoinOfferPrice;
          });
        }
      }
    } else {
      alert("Please input your offer price.");
    }
  }

  retractOffer() {
    if (this.currentUser) {
      this.btnRetractOfferTitle = 'Processing...';
      this.btnRetractOfferDisabled = true;
      //send offer
      let coinOffer = {
        CoinId: this.currentCoin.coinId,
        CoinName: this.currentCoin.name,
        UserId: this.currentUser.userId,
        OfferPrice: this.currentCoinOfferPrice,
        OfferStatusCode: 'CT',
        UserName: (!this.currentUser.displayName ? '' : this.currentUser.displayName)
      };
      this.userService.retractOffer(coinOffer).subscribe((result) => {
        alert("Your offer was retracted successfully. Thanks.");

        this.btnRetractOfferTitle = 'Retract Offer';
        this.btnRetractOfferDisabled = false;

        this.currentCoin.hasOffer = false;
        this.currentCoin.offerPrice = 0;
      });
    }
  }

  notifyMe() {
    if (this.currentCoinNoticePrice > 0) {
      if (this.currentCoinNoticePrice > this.currentCoin.currentPrice) {
        alert("Your notify me price is great than the current price.");
      } else {
        if (this.currentUser) {
          this.btnNotifyMeTitle = 'Processing...';
          this.btnNotifyMeDisabled = true;
          //send offer
          let coinOffer = { CoinId: this.currentCoin.coinId, UserId: this.currentUser.userId, NotifyPrice: this.currentCoinNoticePrice };
          this.userService.notifyMe(coinOffer).subscribe((result) => {
            alert("Your notify me was set successfully. Thanks.");

            this.btnNotifyMeTitle = 'Notify Me';
            this.btnNotifyMeDisabled = false;

            this.currentCoin.hasNotify = true;
            this.currentCoin.notifyPrice = this.currentCoinNoticePrice;
          });
        }
      }
    } else {
      alert("Please input your notify me price.");
    }
  }

  cancelNotify() {
    if (this.currentUser) {
      this.btnCancelNotifyTitle = 'Processing...';
      this.btnCancelNotifyDisabled = true;
      //send offer
      let coinOffer = { CoinId: this.currentCoin.coinId, UserId: this.currentUser.userId, NotifyPrice: this.currentCoinNoticePrice };
      this.userService.cancelNotify(coinOffer).subscribe((result) => {
        alert("Your notify was cancelled successfully. Thanks.");

        this.btnCancelNotifyTitle = 'Cancel Notify';
        this.btnCancelNotifyDisabled = false;

        this.currentCoin.hasNotify = false;
        this.currentCoinNoticePrice = 0;
        this.currentCoin.notifyPrice = this.currentCoinNoticePrice;
      });
    }
  }

  gotoCompanyCoinList(sellerId: number) { this.dialogRef.close('CompanyCoinList^' + sellerId); }

  sendMessage(sellerId: number) {

    if (this.currentUser) {
      this.btnSendMessageTitle = 'Processing...';
      this.btnSendMessageDisabled = true;
      //send offer
      let messageToSeller = {
        CoinId: this.currentCoin.coinId,
        CoinName: this.currentCoin.name,
        UserId: this.currentUser.userId, UserEmail:'',
        SellerId: sellerId,
        Message: this.messageToSeller, MessageIndicator:'S',
        SellerEmail: '', UserDisplayName: '', SellerDisplayName: ''
      };
      this.userService.sendMessage(messageToSeller).subscribe((result) => {
        alert("Your message was sent out successfully.");

        this.btnSendMessageTitle = 'Send Message';
        this.btnSendMessageDisabled = false;

        this.messageToSeller = '';
      });
    }

  }

  closeDialog(): void { this.dialogRef.close(); }
}
