package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name="orders")
public class Order {

 @Id @GeneratedValue
 private Long id;

 @ManyToOne
 private User user;

 @ManyToOne
 private Address address;

 @OneToMany(mappedBy="order")
 private List<OrderItem> items;
}