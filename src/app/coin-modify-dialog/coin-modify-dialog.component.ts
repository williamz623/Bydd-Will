import { Component, Inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Coin } from '../Models/Coin/Coin.model';
import { User } from '../Models/User/User.model';

import { CoinService } from '../Services/coin.service'
import { Router } from '@angular/router';
import { SharedService } from '../Services/shared.service';
import { LocalStorageService } from '../Services/localStorage.service';
import { UserService } from '../Services/user.service';

import * as _ from 'lodash';
import * as $ from 'jquery';
import * as moment from 'moment';

export interface CoinModifyDialogComponentData { Coin: Coin }

@Component({
  selector: 'app-coin-modify-dialog',
  templateUrl: './coin-modify-dialog.component.html',
  styleUrls: ['./coin-modify-dialog.component.scss']
})
export class CoinModifyDialogComponent {

  public currentCoin: Coin = new Coin();

  userSignedIn: boolean = false;
  currentUser?: User | null;

  public saveUrl = 'https://10.0.0.120/bydwebapi/api/Coin/upload'; //'https://localhost:7084/api/Coin/upload';
  public removeUrl = 'https://demos.telerik.com/kendo-ui/service-v4/upload/remove';
  public imageUrl: string = '';

  public restrictions = { allowedExtensions: ['.jpg', '.png'] };
  public validation = { allowed: true, maxFileSize: 10485760 };


  startDateTime: Date = moment().add(1, 'day').startOf('day').toDate();
  endDateTime: Date = moment().add(1, 'month').startOf('day').add(1, 'day').add(-1, 'second').toDate();

  public format = "MM/dd/yyyy HH:mm";

  carriers = ['', 'Canada Post', 'UPS', 'Fedex', 'DHL', 'USPS', 'Asendia', 'Others'];

  interval = { value: "2", text: "2 days" };
  intervals = [
    { value: "0.25", text: "6 hours" }, { value: "0.5", text: "12 hours" },
    { value: "1", text: "1 day" }, { value: "2", text: "2 days" }, { value: "3", text: "3 days" }, { value: "7", text: "1 week" }];

  currentImage:string='';

  btnSubmitTitle='Submit';
  btnSubmitDisabled=true;


  constructor(
    public dialogRef: MatDialogRef<CoinModifyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CoinModifyDialogComponentData,
    private sharedService: SharedService, private userService: UserService, private coinService: CoinService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    data.Coin.categoryId += "";
    this.currentCoin = _.cloneDeep(data.Coin);
    this.currentCoin.originalImageUrls = ['', '', '', '', '', ''];
    if (!this.currentCoin.imageUrls) this.currentCoin.imageUrls = ['', '', '', '', '', ''];
    this.getCoinImage();

    this.EmptyImageIndex = _.findIndex(this.currentCoin.imageUrls, (i) => i == "");

    this.sharedService.UserSignedIn$.subscribe(newValue => { this.userSignedIn = newValue; });
    this.sharedService.CurrentUser$.subscribe(newValue => { this.currentUser = newValue; });

    if (this.localStorageService.getData('Token')) {
      //get user profile
      this.userService.getUserProfile().pipe(
        catchError((error) => {
          if (error.status === 401) {
            console.log('Unauthorized access. Redirecting to login page...');
            this.router.navigate(['/Login']);
          }
          throw error;
        })
      ).subscribe((user) => {
        if (user == -1) {
          alert("Sorry, not found email or password was wrong. Please try again.");
        } else {
          this.sharedService.UpdateCurrentUser(user);
          this.sharedService.UpdateUserSignedIn(true);

          //save current user to local storage
          this.localStorageService.saveData('CurrentUser', user);
        }
      });
    } else {
      //go to login page
      this.router.navigate(['/Login']);
    };
  }

  ngAfterViewInit() { this.setUploaderControl(); }

  getCoinImage() {
    const appThis = this;
    this.coinService.getCoinImageById(this.currentCoin.coinId).subscribe((data) => {
      if (data.length > 0) {
        appThis.currentCoin.imageUrls[0] = data[0].image1;
        appThis.currentCoin.imageUrls[1] = data[0].image2;
        appThis.currentCoin.imageUrls[2] = data[0].image3;
        appThis.currentCoin.imageUrls[3] = data[0].image4;
        appThis.currentCoin.imageUrls[4] = data[0].image5;
        appThis.currentCoin.imageUrls[5] = data[0].image6;
      }
      appThis.btnSubmitDisabled=false;
      appThis.MaxImagesCount = _.filter(appThis.currentCoin.imageUrls, (img)=>img.length==0).length;
      appThis.EmptyImageIndex = 6 - appThis.MaxImagesCount;
    });
  }

  public setUploaderControl() {
    //set upload button
    setTimeout(() => {
      const spans = $("#divImages .k-upload-button-wrap button span.k-button-text");
      $.each(spans, function (index, item) {
        if (item.style.display != 'none') {
          $(item).css("display", "none");
          $("<span class='material-icons byd-add-image-icon' style='font-size: 30px; color: black;'>add</span>").insertAfter($(item));
        }
      });
    }, 100);
  }

  public removeImage(imageIndex: number) {
    this.currentCoin.imageUrls.splice(imageIndex,1);
    this.currentCoin.imageUrls.push('');
    this.MaxImagesCount = this.MaxImagesCount + 1;
    this.EmptyImageIndex = this.EmptyImageIndex - 1;

    this.setUploaderControl();
  }

  public MaxImagesCount: number = 6;
  public EmptyImageIndex = 0;
  public onSelect(event: any) {
    const files = event.files;
    let filesCount = files.length > this.MaxImagesCount ? this.MaxImagesCount : files.length;

    for (let i = 0; i < filesCount; i++) {

      const file = files[i].rawFile;

      //compress image file content
      const compressImage = async (file: any) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = URL.createObjectURL(file);

          img.onload = () => {
            // save original image
            const canvas_O = document.createElement('canvas');
            const ctx_O = canvas_O.getContext('2d');
            if (!ctx_O) { console.error('Failed to get the canvas context'); return; }

            const maxWidth_O = 1500;
            const maxHeight_O = 650;
            const ratio_O = Math.min(maxWidth_O / img.width, maxHeight_O / img.height);
            canvas_O.width = img.width * ratio_O;
            canvas_O.height = img.height * ratio_O;

            ctx_O.drawImage(img, 0, 0, canvas_O.width, canvas_O.height);
            this.currentCoin.originalImageUrls[this.EmptyImageIndex + i] = canvas_O.toDataURL('image/jpeg', 1);

            // save showing image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) { console.error('Failed to get the canvas context'); return; }

            // Set the canvas dimensions to the desired dimensions
            const maxWidth = 600;
            const maxHeight = 300;
            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;

            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            let compressRatio = 1;
            if (file.size / 1000000 > 10) compressRatio = 0.5;
            this.currentCoin.imageUrls[this.EmptyImageIndex + i] = canvas.toDataURL('image/jpeg', compressRatio);
            this.MaxImagesCount = this.MaxImagesCount - 1;
            if (i === files.length - 1)
              this.EmptyImageIndex = this.EmptyImageIndex + filesCount;
          };
        });
      };
      const compressedDataUrl = compressImage(file);
    }
  }

  showImage(imageIndex:number){
    this.currentImage = this.currentCoin.imageUrls[imageIndex];
    $("#divModify").hide();
    $("#divImage").show();
  }

  back(){
    $("#divModify").show();
    $("#divImage").hide();
  }

  close() { this.dialogRef.close(); }

  //submit
  public submit() {

    if (this.currentCoin.name.trim() == '') {
      alert("[Coin Title] was not allowed empty.");
    } else {
      this.btnSubmitTitle='Processing...';
      this.btnSubmitDisabled=true;

      this.currentCoin.enteredDate = moment(this.currentCoin.enteredDate).toDate();

      this.currentCoin.CoinNumber='';
      this.currentCoin.intervalString='';
      this.currentCoin.SellerCountry='';
      this.currentCoin.SellerName='';
      this.currentCoin.SellerProvince='';

      this.currentCoin.startDateTime = this.startDateTime;
      this.currentCoin.endDateTime = this.endDateTime;
      this.currentCoin.interval = this.interval.value;
      this.currentCoin.coinOffer = { UserId: 0, CoinId: 0, CoinName: '', UserName:'', OfferPrice: 0, OfferDate: "2023-06-27T10:30:00", OfferStatusCode: "CT" };
      this.currentCoin.coinOrder = { OrderStatusCode: "CT" };
      this.currentCoin.CertificationId = "";
      this.currentCoin.Country = "";
      this.currentCoin.CountryCode = "";
      this.currentCoin.Condition = "";
      this.currentCoin.FaceValue = "";
      this.currentCoin.LeftTime = "";
      this.currentCoin.SellerEmail='';
      this.currentCoin.SellerFirstName='';
      this.currentCoin.SellerLastName='';

      if (this.currentUser) this.currentCoin.userId = this.currentUser.userId;
      if (!this.currentCoin.carrierNameDomestic) this.currentCoin.carrierNameDomestic="";
      if (!this.currentCoin.serviceTypeDomestic) this.currentCoin.serviceTypeDomestic="";
      if (!this.currentCoin.carrierNameInternational) this.currentCoin.carrierNameInternational="";
      if (!this.currentCoin.serviceTypeInternational) this.currentCoin.serviceTypeInternational="";

      this.coinService.modifyCoin(this.currentCoin).subscribe((data) => {
        const result = data;
        alert("Submit succeeded.");
        this.dialogRef.close(this.currentCoin);
      });
    }

  }

}
