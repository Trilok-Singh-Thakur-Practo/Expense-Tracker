package com.expensetracker.repository;

import com.expensetracker.model.Budget;
import com.expensetracker.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByDepartment(Department department);
    Optional<Budget> findByDepartmentAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Department department, LocalDate date, LocalDate sameDate);
} 