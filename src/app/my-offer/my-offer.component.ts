import { Component } from '@angular/core';
import { User } from '../Models/User/User.model';
import { Coin } from "../Models/Coin/Coin.model";
import { CoinService } from '../Services/coin.service';
import { UserService } from '../Services/user.service';
import { SharedService } from '../Services/shared.service';

import { MatDialog } from '@angular/material/dialog';
import { CoinDetailDialogComponent } from '../coin-detail-dialog/coin-detail-dialog.component';



import * as $ from 'jquery';
import * as _ from 'lodash';


@Component({
  selector: 'app-my-offer',
  templateUrl: './my-offer.component.html',
  styleUrls: ['./my-offer.component.scss']
})
export class MyOfferComponent {

  myCoinOffers: any[]=[];
  userSignedIn: boolean = false;
  currentUser?: User | null;

  searchResultMessage:string = "Loading...";

  btnAcceptOfferTitle = "Accept Offer";
  btnAcceptOfferDisabled = false;

  btnRejectOfferTitle = "Reject Offer";
  btnRejectOfferDisabled = false;

  constructor(
    private coinService: CoinService,
    private userService: UserService, 
    public dialog: MatDialog, 
    private sharedService: SharedService) 
  {
    this.sharedService.UserSignedIn$.subscribe(newValue => { this.userSignedIn = newValue; });
    this.sharedService.CurrentUser$.subscribe(newValue => { this.currentUser = newValue; });

    this.sharedService.ValidateUserProfile();
  }

  ngOnInit(): void { this.getUserOffer(); }

  getUserOffer(){
    if (this.currentUser)
    this.userService.getUserOffer(this.currentUser.userId).subscribe((data) => {
      this.myCoinOffers = data;
      _.each(this.myCoinOffers, function(c){
        c.btnRejectOfferTitle='Reject Offer';
        c.btnRejectOfferDisabled=false;
        c.btnAcceptOfferTitle = "Accept Offer";
        c.btnAcceptOfferDisabled = false;
      });
      $("#divSpin").hide();
      this.searchResultMessage='No item found';
    });
  }

  acceptOffer(userId:number, coinId:number, coinName:string, coin:any){
    coin.btnAcceptOfferTitle="Processing...";
    coin.btnAcceptOfferDisabled=true;
    this.userService.acceptOffer(userId, coinId, coinName).subscribe((data) => {
      coin.btnAcceptOfferTitle="Accept Offer";
      coin.btnAcceptOfferDisabled=false;

      this.getUserOffer();
      this.sharedService.ValidateUserProfile();
    });
  }

  rejectOffer(userId:number, coinId:number, coinName:string, coin:any){
    coin.btnRejectOfferTitle = "Processing...";
    coin.btnRejectOfferDisabled = true;
    this.userService.rejectOffer(userId, coinId, coinName).subscribe((data) => {
      coin.btnRejectOfferTitle = "Reject Offer";
      coin.btnRejectOfferDisabled = false;
      this.getUserOffer();
      this.sharedService.ValidateUserProfile();
    });
  }

  openCoinDetail(coin: any): void {
    if (window.innerWidth <= 600) {
      const dialogRef = this.dialog.open(CoinDetailDialogComponent, { width: '100%', height: '80%', maxWidth: '100%', data: { View: coin } });
      dialogRef.afterClosed().subscribe(result => { if (this.currentUser) this.getUserOffer(); });
    } else {
      const dialogRef = this.dialog.open(CoinDetailDialogComponent, { width: '80%', height: '80%', data: { View: coin } });
      dialogRef.afterClosed().subscribe(result => { if (this.currentUser) this.getUserOffer(); });
    }
  }
}
