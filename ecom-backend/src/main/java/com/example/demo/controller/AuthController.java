// package com.example.demo.controller;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import com.example.demo.dto.*;
// import com.example.demo.service.AuthService;

// @RestController
// @RequestMapping("/api/auth")
// public class AuthController {

//   private final AuthService service;

//   public AuthController(AuthService s) {
//     this.service = s;
//   }

//   @PostMapping("/register")
//   public ApiResponse register(@RequestBody RegisterRequest r) {
//     return service.register(r);
//   }

//   @PostMapping("/login")
//   public ResponseEntity<?> login(@RequestBody LoginRequest r) {
//     try {
//       String token = service.login(r);
//       return ResponseEntity.ok(token);
//     } catch (RuntimeException e) {
//       return ResponseEntity
//           .status(401)
//           .body(e.getMessage()); // ✅ send error message
//     }
//   }

//   @PostMapping("/forgot")
//   public ResponseEntity<String> forgot(@RequestBody ForgotRequest r) {
//     try {
//       return ResponseEntity.ok(service.forgot(r));
//     } catch (RuntimeException e) {
//       return ResponseEntity.status(404).body(e.getMessage());
//     }
//   }

//   @PostMapping("/reset")
//   public String reset(@RequestBody ResetRequest r) {
//     return service.reset(r);
//   }
// }

package com.example.demo.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
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
      AuthResponse response = service.login(r);

      String refreshToken = service.getStoredRefreshToken(r.email);

      ResponseCookie cookie = ResponseCookie.from("snapbite_refreshToken", refreshToken)
          .httpOnly(true)
          .secure(false) // true in production HTTPS
          .sameSite("Lax")
          .path("/api/auth")
          .maxAge(7 * 24 * 60 * 60)
          .build();

      return ResponseEntity.ok()
          .header(HttpHeaders.SET_COOKIE, cookie.toString())
          .body(response);

    } catch (RuntimeException e) {
      return ResponseEntity.status(401).body(e.getMessage());
    }
  }

  @PostMapping("/refresh")
  public ResponseEntity<?> refresh(
      @CookieValue(name = "snapbite_refreshToken", required = false) String refreshToken) {
    try {
      AuthResponse response = service.refreshAccessToken(refreshToken);

      String email = extractEmailFromToken(refreshToken); // or expose a helper from service/jwtUtil
      String newRefreshToken = service.getStoredRefreshToken(email);

      ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefreshToken)
          .httpOnly(true)
          .secure(false) // true in production HTTPS
          .sameSite("Lax")
          .path("/api/auth")
          .maxAge(7 * 24 * 60 * 60)
          .build();

      return ResponseEntity.ok()
          .header(HttpHeaders.SET_COOKIE, cookie.toString())
          .body(response);

    } catch (RuntimeException e) {
      return ResponseEntity.status(401).body(e.getMessage());
    }
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(
      @CookieValue(name = "snapbite_refreshToken", required = false) String refreshToken) {

    service.logout(refreshToken);

    ResponseCookie cookie = ResponseCookie.from("snapbite_refreshToken", "")
        .httpOnly(true)
        .secure(false) // true in production HTTPS
        .sameSite("Lax")
        .path("/api/auth")
        .maxAge(0)
        .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body("Logged out successfully");
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

  private String extractEmailFromToken(String token) {
    // better: move this to service/jwtUtil call instead of keeping here
    return io.jsonwebtoken.Jwts.parserBuilder().build().parseClaimsJws(token).getBody().getSubject();
  }
}