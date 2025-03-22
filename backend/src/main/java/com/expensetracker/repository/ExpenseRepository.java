package com.expensetracker.repository;

import com.expensetracker.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser(User user);
    List<Expense> findByDepartment(Department department);
    List<Expense> findByStatus(ExpenseStatus status);
    List<Expense> findByDepartmentAndStatus(Department department, ExpenseStatus status);
} 