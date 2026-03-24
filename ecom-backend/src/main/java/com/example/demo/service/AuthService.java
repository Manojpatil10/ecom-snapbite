package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.security.JwtUtil;

import jakarta.annotation.PostConstruct;

@Service
public class AuthService {

  private final UserRepository userRepo;
  private final RoleRepository roleRepo;
  private final PasswordEncoder encoder;
  private final JwtUtil jwtUtil;
  private final EmailService emailService;

  public AuthService(UserRepository u, RoleRepository r, PasswordEncoder e, JwtUtil jwtUtil,
      EmailService emailService) {
    this.userRepo = u;
    this.roleRepo = r;
    this.encoder = e;
    this.jwtUtil = jwtUtil;
    this.emailService = emailService;
  }

  @PostConstruct
  public void createAdmin() {

    if (userRepo.findByEmail("admin@gmail.com").isEmpty()) {

      Role role = roleRepo.findByRole("ROLE_ADMIN")
          .orElseThrow();

      User admin = new User();
      admin.setFullName("Admin");
      admin.setEmail("admin@gmail.com");
      admin.setPassword(encoder.encode("Admin@123"));
      admin.setRole(role);

      userRepo.save(admin);
    }
  }

  public ApiResponse register(RegisterRequest req) {

    if (userRepo.findByEmail(req.email).isPresent())
      throw new RuntimeException("Email already exists");

    Role role = roleRepo.findByRole("ROLE_USER").orElseThrow();

    User u = new User();
    u.setFullName(req.fullName); // ✅ matches now
    u.setEmail(req.email);
    u.setPhone(req.phone); // ✅ NEW
    u.setPassword(encoder.encode(req.password));
    u.setRole(role);

    userRepo.save(u);

    return new ApiResponse("User registered successfully");
  }

  // public String login(LoginRequest req) {

  // User u = userRepo.findByEmail(req.email)
  // .orElseThrow(() -> new RuntimeException("User not found"));

  // if (!encoder.matches(req.password, u.getPassword()))
  // throw new RuntimeException("Invalid password");

  // return jwtUtil.generateToken(
  // u.getEmail(),
  // u.getRole().getRole());
  // }

  public AuthResponse login(LoginRequest req) {

    User u = userRepo.findByEmail(req.email)
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (!encoder.matches(req.password, u.getPassword())) {
      throw new RuntimeException("Invalid password");
    }

    String accessToken = jwtUtil.generateAccessToken(
        u.getEmail(),
        u.getRole().getRole());

    String refreshToken = jwtUtil.generateRefreshToken(u.getEmail());

    u.setRefreshToken(refreshToken);
    u.setRefreshTokenExpiry(LocalDateTime.now().plusDays(7));
    userRepo.save(u);

    return new AuthResponse(accessToken, u.getRole().getRole());
  }

  public AuthResponse refreshAccessToken(String refreshToken) {

    if (refreshToken == null || refreshToken.isBlank()) {
      throw new RuntimeException("Refresh token missing");
    }

    if (!jwtUtil.isTokenValid(refreshToken)) {
      throw new RuntimeException("Invalid refresh token");
    }

    if (!jwtUtil.isRefreshToken(refreshToken)) {
      throw new RuntimeException("Not a refresh token");
    }

    String email = jwtUtil.extractEmail(refreshToken);

    User u = userRepo.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (u.getRefreshToken() == null || !u.getRefreshToken().equals(refreshToken)) {
      throw new RuntimeException("Refresh token mismatch");
    }

    if (u.getRefreshTokenExpiry() == null || u.getRefreshTokenExpiry().isBefore(LocalDateTime.now())) {
      throw new RuntimeException("Refresh token expired");
    }

    // rotation
    String newAccessToken = jwtUtil.generateAccessToken(u.getEmail(), u.getRole().getRole());
    String newRefreshToken = jwtUtil.generateRefreshToken(u.getEmail());

    u.setRefreshToken(newRefreshToken);
    u.setRefreshTokenExpiry(LocalDateTime.now().plusDays(7));
    userRepo.save(u);

    return new AuthResponse(newAccessToken, u.getRole().getRole());
  }

  public String getStoredRefreshToken(String email) {
    return userRepo.findByEmail(email)
        .map(User::getRefreshToken)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  public void logout(String refreshToken) {
    if (refreshToken == null || refreshToken.isBlank())
      return;

    try {
      String email = jwtUtil.extractEmail(refreshToken);
      userRepo.findByEmail(email).ifPresent(u -> {
        u.setRefreshToken(null);
        u.setRefreshTokenExpiry(null);
        userRepo.save(u);
      });
    } catch (Exception ignored) {
    }
  }

  // forgot password
  public String forgot(ForgotRequest req) {

    User u = userRepo.findByEmail(req.email)
        .orElseThrow(() -> new RuntimeException("User not found"));

    String token = UUID.randomUUID().toString();

    u.setResetToken(token);
    u.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));

    userRepo.save(u);

    String resetLink = "https://snapbite.netlify.app//reset-password?token=" + token;

    emailService.send(
        u.getEmail(),
        "Password Reset Request",
        "Click the link to reset your password:\n" + resetLink);

    return "Reset link sent to email";
  }

  public String reset(ResetRequest req) {

    User u = userRepo.findByResetToken(req.getToken())
        .orElseThrow(() -> new RuntimeException("Invalid token"));

    if (u.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
      throw new RuntimeException("Token expired");
    }

    u.setPassword(encoder.encode(req.getPassword()));

    u.setResetToken(null);
    u.setResetTokenExpiry(null);

    userRepo.save(u);

    return "Password updated successfully";
  }
}