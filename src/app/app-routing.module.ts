import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

import { HomePageComponent } from './home-page/home-page.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { WatchListComponent } from './watch-list/watch-list.component';
import { MyOfferComponent } from './my-offer/my-offer.component';
import { UserNotificationsComponent } from './user-notifications/user-notifications.component'
import { UserOrderComponent } from './user-order/user-order.component'
import { UserPurchaseComponent } from './user-purchase/user-purchase.component'
import { CoinListPageComponent } from './coin-list-page/coin-list-page.component';
import { CompanyCoinListComponent } from './company-coin-list/company-coin-list.component';
import { NewCoinPageComponent } from './new-coin-page/new-coin-page.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SellComponent } from './sell/sell.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { UserAgreementComponent } from './user-agreement/user-agreement.component';
import { HelpContactComponent } from './help-contact/help-contact.component'
import { HowByddWorksComponent } from './how-bydd-works/how-bydd-works.component'
import { TransactionalPoliciesComponent } from './transactional-policies/transactional-policies.component'
import { SellingPoliciesandFeesComponent } from './selling-policiesand-fees/selling-policiesand-fees.component'
import { QuestionAndAnswerComponent } from './question-and-answer/question-and-answer.component'
import { UserInvoiceComponent } from './user-invoice/user-invoice.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'Home', component: HomePageComponent },
  { path: 'Dashboard', component: DashBoardComponent },
  { path: 'CoinList', component: CoinListPageComponent },
  { path: 'CoinList/:sw', component: CoinListPageComponent },
  { path: 'CompanyCoinList', component: CompanyCoinListComponent },
  { path: 'CompanyCoinList/:id', component: CompanyCoinListComponent },
  { path: 'NewCoin', component: NewCoinPageComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'WatchList', component: WatchListComponent},
  { path: 'MyOffer', component: MyOfferComponent},
  { path: 'UserNotifications', component: UserNotificationsComponent },
  { path: 'UserOrder', component: UserOrderComponent},
  { path: 'UserPurchase', component: UserPurchaseComponent},
  { path: 'UserInvoice', component: UserInvoiceComponent},
  { path: 'ResetPassword', component: ResetPasswordComponent},
  { path: 'ResetPassword/:guid', component: ResetPasswordComponent },
  { path: 'Sell', component: SellComponent },
  { path: 'Sell/:sw', component: SellComponent },
  { path: 'UserProfile', component: UserProfileComponent },
  { path: 'AboutUs', component: AboutUsComponent },
  { path: 'UserAgreement', component: UserAgreementComponent },
  { path: 'HelpContact', component: HelpContactComponent },
  { path: 'HowByddWorks', component: HowByddWorksComponent },
  { path: 'TransactionalPolicies', component: TransactionalPoliciesComponent },
  { path: 'SellingPolicies', component: SellingPoliciesandFeesComponent },
  { path: 'QuestionAnswer', component: QuestionAndAnswerComponent}
];

const routerOptions: ExtraOptions = {
  urlUpdateStrategy: 'eager',
  paramsInheritanceStrategy: 'always'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
