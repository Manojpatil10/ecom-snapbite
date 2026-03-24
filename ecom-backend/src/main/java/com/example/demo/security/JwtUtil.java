// package com.example.demo.security;

// import io.jsonwebtoken.*;
// import io.jsonwebtoken.security.Keys;
// import org.springframework.stereotype.Component;

// import java.security.Key;
// import java.util.Date;

// @Component
// public class JwtUtil {

//   private final String SECRET = "mysecretkeymysecretkeymysecretkey123"; // min 32 chars
//   private final long EXPIRATION = 1000 * 60 * 60; // 1 hour

//   private Key getKey() {
//     return Keys.hmacShaKeyFor(SECRET.getBytes());
//   }

//   public String generateToken(String email, String role) {
//     return Jwts.builder()
//         .setSubject(email)
//         .claim("role", role) // ✅ role inside token
//         .setIssuedAt(new Date())
//         .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
//         .signWith(getKey(), SignatureAlgorithm.HS256)
//         .compact();
//   }

//   public String extractEmail(String token) {
//     return getClaims(token).getSubject();
//   }

//   public String extractRole(String token) {
//     return getClaims(token).get("role", String.class);
//   }

//   private Claims getClaims(String token) {
//     return Jwts.parserBuilder()
//         .setSigningKey(getKey())
//         .build()
//         .parseClaimsJws(token)
//         .getBody();
//   }
// }

package com.example.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

  // keep this in application.properties later
  private static final String SECRET = "mysecretkeymysecretkeymysecretkey123";

  // 15 minutes
  private static final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15;

  // 7 days
  private static final long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 7;

  private Key getKey() {
    return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
  }

  // =========================
  // ACCESS TOKEN
  // =========================
  public String generateAccessToken(String email, String role) {
    return Jwts.builder()
        .setSubject(email)
        .claim("role", role)
        .claim("type", "access")
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
        .signWith(getKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  // =========================
  // REFRESH TOKEN
  // =========================
  public String generateRefreshToken(String email) {
    return Jwts.builder()
        .setSubject(email)
        .claim("type", "refresh")
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
        .signWith(getKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  // =========================
  // EXTRACT METHODS
  // =========================
  public String extractEmail(String token) {
    return getClaims(token).getSubject();
  }

  public String extractRole(String token) {
    return getClaims(token).get("role", String.class);
  }

  public String extractTokenType(String token) {
    return getClaims(token).get("type", String.class);
  }

  public Date extractExpiration(String token) {
    return getClaims(token).getExpiration();
  }

  // =========================
  // VALIDATION METHODS
  // =========================
  public boolean isAccessToken(String token) {
    return "access".equals(extractTokenType(token));
  }

  public boolean isRefreshToken(String token) {
    return "refresh".equals(extractTokenType(token));
  }

  public boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  public boolean isTokenValid(String token) {
    try {
      Claims claims = getClaims(token);
      return claims.getExpiration().after(new Date());
    } catch (Exception e) {
      return false;
    }
  }

  public boolean validateAccessToken(String token, String email) {
    return isTokenValid(token)
        && isAccessToken(token)
        && extractEmail(token).equals(email);
  }

  public boolean validateRefreshToken(String token, String email) {
    return isTokenValid(token)
        && isRefreshToken(token)
        && extractEmail(token).equals(email);
  }

  // =========================
  // INTERNAL CLAIM PARSER
  // =========================
  private Claims getClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(getKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }
}