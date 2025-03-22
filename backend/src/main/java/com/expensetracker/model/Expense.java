package com.expensetracker.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExpenseType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExpenseStatus status = ExpenseStatus.PENDING;

    @Column(nullable = false)
    private LocalDate date;

    @Column
    private String receiptUrl;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference(value = "user-expense")
    private User user;

    @ManyToOne
    @JoinColumn(name = "department_id")
    @JsonBackReference(value = "department-expense")
    private Department department;
} 