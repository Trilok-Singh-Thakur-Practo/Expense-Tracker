package com.expensetracker.controller;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.dto.AuthResponse;
import com.expensetracker.dto.UserLoginRequest;
import com.expensetracker.dto.UserRegistrationRequest;
import com.expensetracker.model.User;
import com.expensetracker.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        try {
            User user = authService.registerUser(request);
            return new ResponseEntity<>(ApiResponse.success("User registered successfully", user), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginUser(@Valid @RequestBody UserLoginRequest request) {
        try {
            AuthResponse authResponse = authService.loginUser(request);
            return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.error("Invalid credentials"), HttpStatus.UNAUTHORIZED);
        }
    }
} 