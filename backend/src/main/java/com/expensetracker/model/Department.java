package com.expensetracker.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "department")
    @JsonManagedReference
    private List<User> users = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "manager_id")
    @JsonIgnore
    private User manager;

    @OneToMany(mappedBy = "department")
    @JsonManagedReference
    private List<Budget> budgets = new ArrayList<>();

    @OneToMany(mappedBy = "department")
    @JsonManagedReference
    private List<Expense> expenses = new ArrayList<>();
} 