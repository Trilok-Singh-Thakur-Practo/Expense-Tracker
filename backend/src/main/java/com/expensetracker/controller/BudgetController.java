package com.expensetracker.controller;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.dto.BudgetRequest;
import com.expensetracker.model.Budget;
import com.expensetracker.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonProcessingException;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    @PreAuthorize("hasRole('FINANCE')")
    public ResponseEntity<ApiResponse<Object>> getAllBudgets() {
        try {
            List<Budget> budgets = budgetService.getAllBudgets();
            
            // Check if budgets were found
            if (budgets == null || budgets.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("No budgets found", new ArrayList<>()));
            }
            
            // Add departmentName field for frontend compatibility
            List<Map<String, Object>> enrichedBudgets = budgets.stream().map(budget -> {
                Map<String, Object> enriched = new HashMap<>();
                enriched.put("id", budget.getId());
                enriched.put("amount", budget.getAmount());
                enriched.put("remainingAmount", budget.getRemainingAmount());
                enriched.put("startDate", budget.getStartDate());
                enriched.put("endDate", budget.getEndDate());
                enriched.put("used", budget.getAmount().subtract(budget.getRemainingAmount()));
                enriched.put("usedAmount", budget.getAmount().subtract(budget.getRemainingAmount())); // For backward compatibility
                
                if (budget.getDepartment() != null) {
                    enriched.put("departmentId", budget.getDepartment().getId());
                    enriched.put("departmentName", budget.getDepartment().getName());
                    
                    // Create a simplified department object with just id and name
                    Map<String, Object> simpleDepartment = new HashMap<>();
                    simpleDepartment.put("id", budget.getDepartment().getId());
                    simpleDepartment.put("name", budget.getDepartment().getName());
                    enriched.put("department", simpleDepartment);
                } else {
                    enriched.put("departmentId", null);
                    enriched.put("departmentName", "Unknown");
                    enriched.put("department", null);
                }
                
                return enriched;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(ApiResponse.success("Budgets retrieved successfully", enrichedBudgets));
        } catch (Exception e) {
            // Log the full exception stack trace for debugging
            e.printStackTrace();
            
            // Provide a more specific error message
            String errorMessage = "Error retrieving budgets: " + e.getMessage();
            if (e instanceof JsonProcessingException) {
                errorMessage = "Error processing budget data for JSON serialization. Please check for circular references.";
            }
            
            return new ResponseEntity<>(ApiResponse.error(errorMessage), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('FINANCE', 'MANAGER')")
    public ResponseEntity<ApiResponse<Budget>> getBudgetById(@PathVariable Long id) {
        try {
            Budget budget = budgetService.getBudgetById(id);
            return ResponseEntity.ok(ApiResponse.success("Budget retrieved successfully", budget));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('FINANCE', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<Budget>>> getBudgetsByDepartment(@PathVariable Long departmentId) {
        try {
            List<Budget> budgets = budgetService.getBudgetsByDepartment(departmentId);
            return ResponseEntity.ok(ApiResponse.success("Budgets retrieved successfully", budgets));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/department/{departmentId}/current")
    @PreAuthorize("hasAnyRole('FINANCE', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<Budget>> getCurrentBudget(@PathVariable Long departmentId) {
        try {
            Budget budget = budgetService.getCurrentBudget(departmentId);
            return ResponseEntity.ok(ApiResponse.success("Current budget retrieved successfully", budget));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('FINANCE')")
    public ResponseEntity<ApiResponse<Budget>> createBudget(@Valid @RequestBody BudgetRequest request) {
        try {
            Budget budget = budgetService.createBudget(request);
            return new ResponseEntity<>(ApiResponse.success("Budget created successfully", budget), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
} 