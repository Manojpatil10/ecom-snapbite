package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "role", unique = true)
  private String role; // ✅ rename from name → role

  // ✅ getters & setters
  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }
}