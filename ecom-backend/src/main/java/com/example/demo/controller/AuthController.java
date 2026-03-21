package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.*;
import com.example.demo.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService service;

  public AuthController(AuthService s) {
    this.service = s;
  }

  @PostMapping("/register")
  public ApiResponse register(@RequestBody RegisterRequest r) {
    return service.register(r);
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest r) {
    try {
      String token = service.login(r);
      return ResponseEntity.ok(token);
    } catch (RuntimeException e) {
      return ResponseEntity
          .status(401)
          .body(e.getMessage()); // ✅ send error message
    }
  }

  @PostMapping("/forgot")
  public ResponseEntity<String> forgot(@RequestBody ForgotRequest r) {
    try {
      return ResponseEntity.ok(service.forgot(r));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    }
  }

  @PostMapping("/reset")
  public String reset(@RequestBody ResetRequest r) {
    return service.reset(r);
  }
}