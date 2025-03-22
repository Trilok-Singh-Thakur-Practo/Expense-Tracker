package com.expensetracker.controller;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.model.Expense;
import com.expensetracker.model.ExpenseStatus;
import com.expensetracker.model.Role;
import com.expensetracker.model.User;
import com.expensetracker.service.ExpenseService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAllExpenses(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            List<Expense> expenses = expenseService.getAllExpenses();
            
            // Check if expenses were found
            if (expenses == null || expenses.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("No expenses found", new ArrayList<>()));
            }
            
            // Transform expenses to properly formatted objects for the frontend
            List<Map<String, Object>> enrichedExpenses = expenses.stream().map(expense -> {
                Map<String, Object> enriched = new HashMap<>();
                enriched.put("id", expense.getId());
                enriched.put("name", expense.getName());
                enriched.put("amount", expense.getAmount());
                enriched.put("type", expense.getType());
                enriched.put("status", expense.getStatus());
                
                // Format the date as a string instead of an array
                if (expense.getDate() != null) {
                    enriched.put("date", expense.getDate().toString());
                } else {
                    enriched.put("date", null);
                }
                
                enriched.put("receiptUrl", expense.getReceiptUrl());
                
                // Create employee object with department
                Map<String, Object> employee = new HashMap<>();
                if (expense.getUser() != null) {
                    employee.put("id", expense.getUser().getId());
                    employee.put("name", expense.getUser().getName());
                    employee.put("email", expense.getUser().getEmail());
                    
                    // Add department information
                    Map<String, Object> department = new HashMap<>();
                    if (expense.getUser().getDepartment() != null) {
                        department.put("id", expense.getUser().getDepartment().getId());
                        department.put("name", expense.getUser().getDepartment().getName());
                    } else if (expense.getDepartment() != null) {
                        // Fallback to expense's department if user's department is null
                        department.put("id", expense.getDepartment().getId());
                        department.put("name", expense.getDepartment().getName());
                    } else {
                        // Both are null, use default values
                        department.put("id", null);
                        department.put("name", "Unknown");
                    }
                    employee.put("department", department);
                } else {
                    // If user is null, create default employee with just the department from the expense
                    employee.put("id", null);
                    employee.put("name", "Unknown");
                    
                    Map<String, Object> department = new HashMap<>();
                    if (expense.getDepartment() != null) {
                        department.put("id", expense.getDepartment().getId());
                        department.put("name", expense.getDepartment().getName());
                    } else {
                        department.put("id", null);
                        department.put("name", "Unknown");
                    }
                    employee.put("department", department);
                }
                
                enriched.put("employee", employee);
                
                return enriched;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(ApiResponse.success("Expenses retrieved successfully", enrichedExpenses));
        } catch (Exception e) {
            // Log detailed error
            e.printStackTrace();
            String errorMessage = "Error retrieving expenses: " + e.getMessage();
            if (e instanceof JsonProcessingException) {
                errorMessage = "Error processing expense data for JSON serialization. Please check for circular references.";
            }
            return new ResponseEntity<>(ApiResponse.error(errorMessage), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Expense>>> getExpensesByUser(@PathVariable Long userId) {
        try {
            List<Expense> expenses = expenseService.getExpensesByUser(userId);
            return ResponseEntity.ok(ApiResponse.success("Expenses retrieved successfully", expenses));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<Expense>>> getExpensesByDepartment(@PathVariable Long departmentId) {
        try {
            List<Expense> expenses = expenseService.getExpensesByDepartment(departmentId);
            return ResponseEntity.ok(ApiResponse.success("Expenses retrieved successfully", expenses));
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<Expense>>> getExpensesByStatus(@PathVariable ExpenseStatus status) {
        try {
            List<Expense> expenses = expenseService.getExpensesByStatus(status);
            return ResponseEntity.ok(ApiResponse.success("Expenses retrieved successfully", expenses));
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Expense>> createExpense(@Valid @RequestBody ExpenseRequest request,
                                                             @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // In a real application, you would get the user ID from the authenticated user
            Long userId = 1L; // Placeholder

            Expense expense = expenseService.createExpense(request, userId);
            return new ResponseEntity<>(ApiResponse.success("Expense created successfully", expense), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{expenseId}/status/{status}")
    public ResponseEntity<ApiResponse<Expense>> updateExpenseStatus(@PathVariable Long expenseId,
                                                                   @PathVariable ExpenseStatus status,
                                                                   @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // In a real application, you would check the user's role to ensure they have permission
            Expense expense = expenseService.updateExpenseStatus(expenseId, status);
            return ResponseEntity.ok(ApiResponse.success("Expense status updated successfully", expense));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable Long expenseId,
                                                          @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // In a real application, you would get the user ID from the authenticated user
            Long userId = 1L; // Placeholder

            expenseService.deleteExpense(expenseId, userId);
            return ResponseEntity.ok(ApiResponse.success("Expense deleted successfully"));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
} 