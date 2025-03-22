package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.model.*;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public List<Expense> getExpensesByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return expenseRepository.findByUser(user);
    }

    public List<Expense> getExpensesByDepartment(Long departmentId) {
        Department department = new Department();
        department.setId(departmentId);
        return expenseRepository.findByDepartment(department);
    }

    public List<Expense> getExpensesByStatus(ExpenseStatus status) {
        return expenseRepository.findByStatus(status);
    }

    @Transactional
    public Expense createExpense(ExpenseRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Department department = user.getDepartment();

        // Check if there's an active budget for the department
        Budget budget = budgetRepository.findByDepartmentAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        department, LocalDate.now(), LocalDate.now())
                .orElseThrow(() -> new IllegalArgumentException("No active budget found for the department"));

        // Check if the budget has enough remaining amount
        if (budget.getRemainingAmount().compareTo(request.getAmount()) < 0) {
            throw new IllegalArgumentException("Budget limit exceeded. Remaining budget: " + budget.getRemainingAmount());
        }

        Expense expense = new Expense();
        expense.setName(request.getName());
        expense.setAmount(request.getAmount());
        expense.setType(request.getType());
        expense.setDate(request.getDate());
        expense.setReceiptUrl(request.getReceiptUrl());
        expense.setStatus(ExpenseStatus.PENDING);
        expense.setUser(user);
        expense.setDepartment(department);

        return expenseRepository.save(expense);
    }

    @Transactional
    public Expense updateExpenseStatus(Long expenseId, ExpenseStatus status) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));

        // If expense is changing to PAID status, update the budget
        if (status == ExpenseStatus.PAID && expense.getStatus() != ExpenseStatus.PAID) {
            Budget budget = budgetRepository.findByDepartmentAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                            expense.getDepartment(), LocalDate.now(), LocalDate.now())
                    .orElseThrow(() -> new IllegalArgumentException("No active budget found for the department"));

            BigDecimal remainingAmount = budget.getRemainingAmount().subtract(expense.getAmount());
            budget.setRemainingAmount(remainingAmount);
            budgetRepository.save(budget);
        }

        expense.setStatus(status);
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long expenseId, Long userId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));

        if (!expense.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own expenses");
        }

        if (expense.getStatus() != ExpenseStatus.PENDING) {
            throw new IllegalArgumentException("You can only delete expenses with PENDING status");
        }

        expenseRepository.delete(expense);
    }
} 