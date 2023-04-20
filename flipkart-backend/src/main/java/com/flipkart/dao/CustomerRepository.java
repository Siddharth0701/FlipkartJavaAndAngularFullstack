package com.flipkart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flipkart.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer,Long> {
    
    
}
