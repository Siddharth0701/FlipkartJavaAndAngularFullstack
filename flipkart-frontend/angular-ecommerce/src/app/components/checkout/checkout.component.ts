import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupName,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FipkartShopFormService } from 'src/app/services/fipkart-shop-form.service';
import { FlipkartShopValidator } from 'src/app/validators/flipkart-shop-validator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYear: number[] = [];
  creditCardMonth: number[] = [];
  countries: Country[] = [];
  shipingAddress: State[] = [];
  billingAddress: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private flipkartShopFormService: FipkartShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.reviewCartDetails();
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          FlipkartShopValidator.notOnlyWhitespace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          FlipkartShopValidator.notOnlyWhitespace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shipingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          FlipkartShopValidator.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          FlipkartShopValidator.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          FlipkartShopValidator.notOnlyWhitespace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          FlipkartShopValidator.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          FlipkartShopValidator.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          FlipkartShopValidator.notOnlyWhitespace,
        ]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          FlipkartShopValidator.notOnlyWhitespace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
          FlipkartShopValidator.notOnlyWhitespace,
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
          FlipkartShopValidator.notOnlyWhitespace,
        ]),
        expirationMonth: new FormControl('', [
          Validators.required,

          FlipkartShopValidator.notOnlyWhitespace,
        ]),
        expirationYear: new FormControl('', [
          Validators.required,
          FlipkartShopValidator.notOnlyWhitespace,
        ]),
      }),
    });
    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log('startMonth: ' + startMonth);

    this.flipkartShopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        this.creditCardMonth = data;
      });

    // populate credit card years

    this.flipkartShopFormService.getCreditCardYears().subscribe((data) => {
      console.log('Retrieved credit card years: ' + JSON.stringify(data));
      this.creditCardYear = data;
    });
    //populate countries
    this.flipkartShopFormService.getCountries().subscribe((data) => {
      console.log('Retrieved countires:' + JSON.stringify(data));
      this.countries = data;
    });
  }
  reviewCartDetails() {
    //subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      (totalQuantity) => (this.totalQuantity = totalQuantity)
    );
    //subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      (totalPrice) => (this.totalPrice = totalPrice)
    );
  }
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shipingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shipingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shipingAddress.state');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shipingAddress.zipCode');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shipingAddress.country');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  copyShippingAddressToBullingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue(
        this.checkoutFormGroup.controls.shipingAddress.value
      );
      // bug fix for states
      this.billingAddress = this.shipingAddress;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      // bug fix for states
      this.billingAddress = [];
    }
  }

  onSubmit() {
    console.log('Handeling the submit the button');
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
    //setup the order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    //get cart items
    const cartItem = this.cartService.cartItems;
    //create orderitem from cartItem
    //-long way
    // let orderItem:OrderItem[]=[];
    // for(let i=0;i<cartItem.length;i++){
    //   orderItem[i]=new OrderItem(cartItem[i]);
    // }
    //-sort way of doing the same way
    let orderItem: OrderItem[] = cartItem.map(
      (tempCartItem) => new OrderItem(tempCartItem)
    );

    // set up purchase
    let purchase = new Purchase();
    //populate purchase -customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase - shiping address
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shipingAddress'].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;
    //populate billing  -billing address
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;
    //populate purchase - order and orderItem
    purchase.order = order;
    purchase.orderItems = orderItem;
    // call rest api via the checkoutService
    this.checkoutService.placeOrder(purchase).subscribe({
      next: (response) => {
        alert(
          `Your order has been recived,\n Order Tracking number ${response.orderTrackingNumber}`
        );
        //reset cart
        this.resetCart();
      },
      error: (err) => {
        alert(`There was an error:${err.message}`);
      },
    });

    // console.log(this.checkoutFormGroup.get('customer')?.value);
    // console.log(
    //   'The email address is ' +
    //     this.checkoutFormGroup.get('customer')?.value.email
    // );
    // console.log(
    //   'The shiping address country is ' +
    //     this.checkoutFormGroup.get('shipingAddress')?.value.country.name
    // );
    // console.log(
    //   'The shiping address states is ' +
    //     this.checkoutFormGroup.get('shipingAddress')?.value.state.name
    // );
  }
  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    //reset the form
    this.checkoutFormGroup.reset();
    //navigate back to the product page
    this.route.navigateByUrl('/products');
  }
  handelMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectYear: number = Number(
      creditCardFormGroup?.value.expirationYear
    );
    //if current year equal to selected year, then start with the curent month
    let startMonth: number;
    if (currentYear === selectYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.flipkartShopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log('Retrived credit card months' + JSON.stringify(data));
        this.creditCardMonth = data;
      });
  }
  //populate states
  getStates(formGroupName: string) {
    const fromGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = fromGroup?.value.country.code;
    const countryName = fromGroup?.value.country.name;
    console.log(`${formGroupName} country code:${countryCode} `);
    console.log(`${formGroupName} country name:${countryName} `);
    this.flipkartShopFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shipingAddress') {
        this.shipingAddress = data;
      } else {
        this.billingAddress = data;
      }
      //select first item default
      fromGroup.get('state').setValue(data[0]);
    });
  }
}
