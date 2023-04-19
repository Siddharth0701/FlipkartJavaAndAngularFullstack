import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  constructor() {}
  addToCart(theCartItem: CartItem) {
    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem!: CartItem;
    if (this.cartItems.length > 0) {
      //find the item in the cart based on item id
      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === theCartItem.id) {
          existingCartItem = tempCartItem;
          break;
        }
      }
      // existingCartItem=this.cartItems.find(tempCartItem=>tempCartItem.id ===theCartItem.id);

      //check if we found it
      alreadyExistsInCart = existingCartItem != undefined;
    }
    if (alreadyExistsInCart) {
      //increment the qunatity
      existingCartItem.qunatity++;
    } else {
      //just add the item to the array
      this.cartItems.push(theCartItem);
    }
    //compare  cart total price and total qunatity
    this.computeCartTotal();
  }
  computeCartTotal() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.qunatity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.qunatity;
    }
    //publish  the new value ... all subscriber will review  the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    //log cart data for debugging
    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Content of cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.qunatity * tempCartItem.unitPrice;
      console.log(
        `name:${tempCartItem.name},quantity=${tempCartItem.qunatity},unitPrice=${tempCartItem.unitPrice},subTotalPrice=${subTotalPrice}`
      );
    }
    console.log(
      `totalPrice:${totalPriceValue.toFixed(
        2
      )},totalQuantity:${totalQuantityValue}`
    );
    console.log('--------------------------');
  }
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.qunatity--;

    if (theCartItem.qunatity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotal();
    }
  }

  remove(theCartItem: CartItem) {
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(
      (tempCartItem) => tempCartItem.id === theCartItem.id
    );

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotal();
    }
  }
}
