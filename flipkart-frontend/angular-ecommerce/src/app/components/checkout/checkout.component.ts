import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupName,
  Validators,
} from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
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
    private flipkartShopFormService: FipkartShopFormService
  ) {}

  ngOnInit(): void {
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

  copyShippingAddressToBullingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shipingAddress'].value
      );
      this.billingAddress = this.shipingAddress;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddress = [];
    }
  }

  onSubmit() {
    console.log('Handeling the submit the button');
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(
      'The email address is ' +
        this.checkoutFormGroup.get('customer')?.value.email
    );
    console.log(
      'The shiping address country is ' +
        this.checkoutFormGroup.get('shipingAddress')?.value.country.name
    );
    console.log(
      'The shiping address states is ' +
        this.checkoutFormGroup.get('shipingAddress')?.value.state.name
    );
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
