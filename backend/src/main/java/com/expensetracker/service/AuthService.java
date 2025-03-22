package com.expensetracker.service;

import com.expensetracker.config.JwtTokenUtil;
import com.expensetracker.dto.AuthResponse;
import com.expensetracker.dto.UserLoginRequest;
import com.expensetracker.dto.UserRegistrationRequest;
import com.expensetracker.model.Department;
import com.expensetracker.model.User;
import com.expensetracker.repository.DepartmentRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(UserRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found"));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setDepartment(department);

        return userRepository.save(user);
    }

    public AuthResponse loginUser(UserLoginRequest request) {
        try {
            // Authentication check (no need to store the result)
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            String token = jwtTokenUtil.generateToken(user);
            
            // Debug the role value
            System.out.println("User role: " + user.getRole() + ", Role name: " + user.getRole().name());

            return AuthResponse.builder()
                    .token(token)
                    .email(user.getEmail())
                    .name(user.getName())
                    .role(user.getRole().name())
                    .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                    .build();
        } catch (Exception e) {
            System.err.println("Authentication error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
} 