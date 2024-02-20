import { Component, ViewChild, AfterViewInit, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { LocalStorageService } from '../Services/localStorage.service';
import { Stripe, StripeCardElement, StripeCardElementOptions, StripeElements, loadStripe } from '@stripe/stripe-js';
import { StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';

import { CoinService } from '../Services/coin.service';
import { WebApi } from '../Models/System/WebApi.model';
import { PayPalOrder } from '../Models/Coin/PayPalOrder.model';
import { PayPalPurchaseUnit } from '../Models/Coin/PayPalPurchaseUnit.model';

import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

import * as $ from 'jquery';

export interface PaymentDialogComponentData { 
  UserId: number, Amount: number, CoinIds: number[], SubTotal: number, 
  ShippingFee: number, Tax: number, UserCountryCode: string }

interface ApiResponse { error: string; }

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements AfterViewInit {

  stripe?: Stripe;

  @ViewChild('cardNumberElement') cardNumberElementRef: ElementRef;
  @ViewChild('cardExpiryElement') cardExpiryElementRef: ElementRef;
  @ViewChild('cardCvcElement') cardCvcElementRef: ElementRef;
  cardNumberElement: StripeCardNumberElement;
  cardExpiryElement: StripeCardExpiryElement;
  cardCvcElement: StripeCardCvcElement;

  paymentAmount: number;
  paymentServiceRate_CC: number = 0.03;
  paymentServiceRate_PP: number = 0.045;
  paymentServiceFee_CC: number = 0;
  paymentServiceFee_PP: number = 0;
  paymentTotal_CC: number = 0;
  paymentTotal_PP: number = 0;
  userId: number = 0;
  coinIds: number[] = [];
  subTotal: number = 0;
  shippingFee: number = 0;
  tax: number = 0;
  paymentSucceed: boolean = false;

  PayPalPurchaseUnit:any;
  public payPalConfig?: IPayPalConfig;

  constructor(
    private elementRef: ElementRef, private localStorageService: LocalStorageService,
    private http: HttpClient, private coinService: CoinService,
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentDialogComponentData,
  ) {
    if (data.UserCountryCode.toLowerCase()=='ca' || data.UserCountryCode.toLowerCase()=='us') this.paymentServiceRate_PP = 0.03;
    this.paymentAmount = data.Amount;
    this.paymentServiceFee_CC = this.paymentAmount * this.paymentServiceRate_CC;
    this.paymentServiceFee_PP = this.paymentAmount * this.paymentServiceRate_PP;
    this.paymentTotal_CC = this.paymentAmount + this.paymentServiceFee_CC;
    this.paymentTotal_PP = this.paymentAmount + this.paymentServiceFee_PP;
    this.userId = data.UserId;
    this.coinIds = data.CoinIds;

    this.subTotal = data.SubTotal;
    this.shippingFee = data.ShippingFee;
    this.tax = data.Tax;

    this.cardNumberElementRef = elementRef;
    this.cardExpiryElementRef = elementRef;
    this.cardCvcElementRef = elementRef;
    this.cardNumberElement = {} as StripeCardNumberElement;
    this.cardExpiryElement = {} as StripeCardExpiryElement;
    this.cardCvcElement = {} as StripeCardCvcElement;
  }

  async ngOnInit() { this.initConfig(); }

  async ngAfterViewInit() {
    this.stripe = await this.initializeStripe();
    if (this.stripe) {
      const elements = this.stripe.elements();

      const cardNumberElementOptions: StripeCardElementOptions = {
        style: { base: { fontSize: '16px', color: '#32325d', fontFamily: '"Helvetica Neue", Helvetica, sans-serif', '::placeholder': { color: '#aab7c4' } } }
      };
      this.cardNumberElement = elements.create('cardNumber', cardNumberElementOptions);
      this.cardNumberElement.mount(this.cardNumberElementRef.nativeElement);

      const cardExpiryElementOptions: StripeCardElementOptions = {
        style: { base: { fontSize: '16px', color: '#32325d', fontFamily: '"Helvetica Neue", Helvetica, sans-serif', '::placeholder': { color: '#aab7c4' } } }
      };
      this.cardExpiryElement = elements.create('cardExpiry', cardExpiryElementOptions);
      this.cardExpiryElement.mount(this.cardExpiryElementRef.nativeElement);


      const cardCvcElementOptions: StripeCardElementOptions = {
        style: { base: { fontSize: '16px', color: '#32325d', fontFamily: '"Helvetica Neue", Helvetica, sans-serif', '::placeholder': { color: '#aab7c4' } } }
      };
      this.cardCvcElement = elements.create('cardCvc', cardCvcElementOptions);
      this.cardCvcElement.mount(this.cardCvcElementRef.nativeElement);
    }
  }

  async initializeStripe(): Promise<any> {
    const stripe = await import('@stripe/stripe-js');
    const stripeApiKey = //'pk_live_51NJqgDLgI6S7ZMtJvjk0awjHSjRxMdZCaGxUIQevbTlWMEYXbRl59aXnUx8eccNIl6vRbMOZq0uyvD3SaS6VhXmP00DG8fY8sJ';
    'pk_test_51NJqgDLgI6S7ZMtJw1VxlxRWyz3oIwfyxb0Osu9E29jZlRYRNPWmOtNXblxqPp60XxyaLnHYA7DxezD8zGodsaap00W6IldHg3';
    return await stripe.loadStripe(stripeApiKey);
  }

  async makePayment() {
    if (this.stripe) {
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardNumberElement,
        billing_details: { name: 'BYDD Payment' }
      });

      if (error) {
        console.error('Error creating payment method:', error);
        if (error.message) this.showError(error.message);
      } else {
        this.showMessage("Certificated succeeded, continue processing...");

        // Process the payment with the paymentMethod.id and paymentAmount
        setTimeout(() => { this.processPayment(paymentMethod.id); }, 50);
      }
    }
  }

  showError(msg: string) {
    $("#spanMessage").hide();
    $("#spanError").show();
    $("#spanError").text(msg);
  }
  showMessage(msg: string) {
    $("#spanMessage").show();
    $("#spanError").hide();
    $("#spanMessage").text(msg);
  }

  processPayment(paymentMethodId: string) {
    const paymentData = {
      PaymentMethodId: paymentMethodId,
      Amount: Math.floor(this.paymentTotal_CC * 100),
      UserId: this.userId,
      CoinIds: this.coinIds,
      SubTotal: Math.floor(this.subTotal * 100),
      ShippingFee: Math.floor(this.shippingFee * 100),
      Tax: Math.floor(this.tax * 100)
    };

    // Send the paymentData to your server for further processing
    const url = WebApi.BYD_API + '/api/Payment';
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.localStorageService.getData('Token')}),
      responseType: 'text' as 'json'
    };
    this.http.post<ApiResponse>(url, paymentData, httpOptions).subscribe(
      (response) => {
        if (response && response.error){
          this.showError(response.error);
        } else {
          $("#spanMessage").hide();
          $("#spanError").hide();
          this.paymentSucceed = true;
        }
      },
      (error) => {
        console.error('Error processing payment:', error);
        if (error.message) this.showError(error.message);
      }
    );
  }

  private initConfig(): void {
    this.PayPalPurchaseUnit = {
      amount: {
        currency_code: 'USD', value: this.paymentTotal_PP.toFixed(2),
        breakdown: { item_total: { currency_code: 'USD', value: this.paymentTotal_PP.toFixed(2) } }
      },
      items: [{
        name: "Bydd Auction",
        quantity: '1',
        category: 'DIGITAL_GOODS',
        unit_amount: { currency_code: 'USD', value: this.paymentTotal_PP.toFixed(2) },
      }]
    };

    const appThis=this;
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AbaSulhakulRdUovHpn_6h6H7jla23dAaQ6T8d9T2llO54UmSNisZAFj2X3kWo1WxS7D4JEgKce1Unox',
      //'AbozU2W_zo3yfQH4jqYG3UjZpYNXJkwQnSnv8-tdVYrPhFFh6krsMcpQQw7eO7QJo_FJNdT50ZnIfh7s',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [ this.PayPalPurchaseUnit ]
      },
      advanced: { commit: 'true', extraQueryParams: [{ name: 'disable-funding', value: 'credit,card' }] },
      style: { label: 'paypal', layout: 'vertical' },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: PayPalOrder) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        if (data.status=="COMPLETED"){
          this.paymentSucceed = true;

          //continue process coin order
          const paymentData = {
            PaymentMethodId: "PayPal:"+data.id + "-" + data.create_time,
            Amount: Math.floor(this.paymentTotal_PP),
            UserId: this.userId,
            CoinIds: this.coinIds,
            SubTotal: Math.floor(this.subTotal),
            ShippingFee: Math.floor(this.shippingFee),
            Tax: Math.floor(this.tax)
          };
          this.coinService.userPaymentSucceed(paymentData).subscribe((data) => { });
        }
        else{
          this.showError("Failed. Please contact our Admin. Thanks.");
        }
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        //this.showCancel = true;
      },
      onError: err => {
        console.log('OnError', err);
        //this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        //this.resetStatus();
      }
    };
  }

  closeDialog(): void { this.dialogRef.close(); }
}
