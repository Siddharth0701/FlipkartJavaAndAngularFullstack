package com.flipkart.service;

import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flipkart.dao.CustomerRepository;
import com.flipkart.dto.Purchase;
import com.flipkart.dto.PurchaseResponse;
import com.flipkart.entity.Customer;
import com.flipkart.entity.Order;
import com.flipkart.entity.OrderItem;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        // reterive the order info to dto
        Order order = purchase.getOrder();
        // generate tracking number
        String orderTracingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTracingNumber);
        // populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));
        // populate order with billingAddress and shiping Address
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getBillingAddress());
        // populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);
        // save the database
        customerRepository.save(customer);
        // return a response

        return new PurchaseResponse(orderTracingNumber);
    }

    private String generateOrderTrackingNumber() {
        // generate a random UUID number (UUID version-4)
        return UUID.randomUUID().toString();
    }

}
