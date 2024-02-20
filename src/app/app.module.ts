import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';

import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { UploadModule } from '@progress/kendo-angular-upload';
import { ProgressBarModule } from '@progress/kendo-angular-progressbar';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from "@progress/kendo-angular-grid";


import { CarouselModule } from 'ngx-owl-carousel-o';

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

import { SignalrService } from './signalr.service';

import { HttpClientModule } from '@angular/common/http';

import { NgxPayPalModule } from 'ngx-paypal';

import { HomePageComponent } from './home-page/home-page.component';
import { NewCoinPageComponent } from './new-coin-page/new-coin-page.component';
import { CoinListPageComponent } from './coin-list-page/coin-list-page.component';
import { CoinDetailDialogComponent } from './coin-detail-dialog/coin-detail-dialog.component';
import { DateFormatPipe } from './date-format.pipe';
import { UserRegisterDialogComponent } from './user-register-dialog/user-register-dialog.component';
import { LoginComponent } from './login/login.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { WatchListComponent } from './watch-list/watch-list.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MyOfferComponent } from './my-offer/my-offer.component';
import { UserOrderComponent } from './user-order/user-order.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CoinModifyDialogComponent } from './coin-modify-dialog/coin-modify-dialog.component';
import { SellComponent } from './sell/sell.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TrackingNumberInputDialogComponent } from './tracking-number-input-dialog/tracking-number-input-dialog.component';
import { CompanyCoinListComponent } from './company-coin-list/company-coin-list.component';
import { CoinImageDisplayDialogComponent } from './coin-image-display-dialog/coin-image-display-dialog.component';
import { BuySucceedDialogComponent } from './buy-succeed-dialog/buy-succeed-dialog.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { UserPurchaseComponent } from './user-purchase/user-purchase.component';
import { UserAgreementComponent } from './user-agreement/user-agreement.component';
import { HelpContactComponent } from './help-contact/help-contact.component';
import { RegisterSucceedDialogComponent } from './register-succeed-dialog/register-succeed-dialog.component';
import { SignInDialogComponent } from './sign-in-dialog/sign-in-dialog.component';
import { UserNotificationsComponent } from './user-notifications/user-notifications.component';
import { HowByddWorksComponent } from './how-bydd-works/how-bydd-works.component';
import { TransactionalPoliciesComponent } from './transactional-policies/transactional-policies.component';
import { SellingPoliciesandFeesComponent } from './selling-policiesand-fees/selling-policiesand-fees.component';
import { UserMessageDialogComponent } from './user-message-dialog/user-message-dialog.component';
import { QuestionAndAnswerComponent } from './question-and-answer/question-and-answer.component';
import { UserInvoiceComponent } from './user-invoice/user-invoice.component';
import { HeaderComponent } from './header/header.component';
import { RandomCoinComponent } from './random-coin/random-coin.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NewCoinPageComponent,
    CoinListPageComponent,
    CoinDetailDialogComponent,
    DateFormatPipe,
    UserRegisterDialogComponent,
    LoginComponent,
    DashBoardComponent,
    WatchListComponent,
    ResetPasswordComponent,
    MyOfferComponent,
    UserOrderComponent,
    PaymentDialogComponent,
    ConfirmDialogComponent,
    CoinModifyDialogComponent,
    SellComponent,
    UserProfileComponent,
    TrackingNumberInputDialogComponent,
    CompanyCoinListComponent,
    CoinImageDisplayDialogComponent,
    BuySucceedDialogComponent,
    AboutUsComponent,
    UserPurchaseComponent,
    UserAgreementComponent,
    HelpContactComponent,
    RegisterSucceedDialogComponent,
    SignInDialogComponent,
    UserNotificationsComponent,
    HowByddWorksComponent,
    TransactionalPoliciesComponent,
    SellingPoliciesandFeesComponent,
    UserMessageDialogComponent,
    QuestionAndAnswerComponent,
    UserInvoiceComponent,
    HeaderComponent,
    RandomCoinComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    SocialLoginModule, GoogleSigninButtonModule, NgxPayPalModule,

    FlexLayoutModule,

    MatIconModule, MatMenuModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatCheckboxModule, MatBadgeModule, MatSelectModule,

    FormsModule, ReactiveFormsModule, ProgressBarModule, ButtonsModule, InputsModule, LabelModule, UploadModule, DateInputsModule, DropDownListModule, GridModule,

    CarouselModule, HttpClientModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '667901470479-o6cdurp8g7lsl9ss867qtpdjjrh6rti5.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
