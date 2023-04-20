package com.flipkart.service;

import com.flipkart.dto.Purchase;
import com.flipkart.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
    

    
}