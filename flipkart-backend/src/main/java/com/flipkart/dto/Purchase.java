package com.flipkart.dto;

import java.util.Set;

import com.flipkart.entity.Address;
import com.flipkart.entity.Customer;
import com.flipkart.entity.Order;
import com.flipkart.entity.OrderItem;

import lombok.Data;

@Data
public class Purchase {
    private Customer customer;
    private Address shipingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
