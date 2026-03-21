package com.example.demo.dto;

public class RegisterRequest {
  public String fullName; // ✅ must match frontend
  public String email;
  public String phone; // ✅ add this
  public String password;
}