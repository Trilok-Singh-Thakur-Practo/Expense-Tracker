package com.expensetracker.service;

import com.expensetracker.dto.BudgetRequest;
import com.expensetracker.model.Budget;
import com.expensetracker.model.Department;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    public Budget getBudgetById(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));
    }

    public List<Budget> getBudgetsByDepartment(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("Department not found"));
        return budgetRepository.findByDepartment(department);
    }

    public Budget createBudget(BudgetRequest request) {
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found"));

        // Check for overlapping budget periods
        boolean hasOverlap = budgetRepository.findByDepartment(department).stream()
                .anyMatch(b -> 
                        (request.getStartDate().isEqual(b.getStartDate()) || request.getStartDate().isAfter(b.getStartDate())) && 
                        (request.getStartDate().isEqual(b.getEndDate()) || request.getStartDate().isBefore(b.getEndDate())) ||
                        (request.getEndDate().isEqual(b.getStartDate()) || request.getEndDate().isAfter(b.getStartDate())) && 
                        (request.getEndDate().isEqual(b.getEndDate()) || request.getEndDate().isBefore(b.getEndDate())) ||
                        (request.getStartDate().isBefore(b.getStartDate()) && request.getEndDate().isAfter(b.getEndDate()))
                );

        if (hasOverlap) {
            throw new IllegalArgumentException("Budget period overlaps with an existing budget for this department");
        }

        Budget budget = new Budget();
        budget.setAmount(request.getAmount());
        budget.setRemainingAmount(request.getAmount());
        budget.setStartDate(request.getStartDate());
        budget.setEndDate(request.getEndDate());
        budget.setDepartment(department);

        return budgetRepository.save(budget);
    }

    public Budget getCurrentBudget(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("Department not found"));

        return budgetRepository.findByDepartmentAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        department, LocalDate.now(), LocalDate.now())
                .orElseThrow(() -> new IllegalArgumentException("No active budget found for the department"));
    }
} 