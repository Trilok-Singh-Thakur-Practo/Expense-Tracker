package com.expensetracker.controller;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.model.Department;
import com.expensetracker.repository.DepartmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public/departments")
public class DepartmentController {

    private static final Logger logger = LoggerFactory.getLogger(DepartmentController.class);

    @Autowired
    private DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Department>>> getAllDepartments() {
        logger.info("Getting all departments");
        List<Department> departments = departmentRepository.findAll();
        logger.info("Found {} departments", departments.size());
        return ResponseEntity.ok(ApiResponse.success("Departments retrieved successfully", departments));
    }

    @PostMapping("/initialize")
    public ResponseEntity<ApiResponse<List<Department>>> initializeDepartments() {
        logger.info("Initializing departments");
        if (departmentRepository.count() > 0) {
            logger.info("Departments already exist, count: {}", departmentRepository.count());
            return ResponseEntity.ok(ApiResponse.success("Departments already initialized", departmentRepository.findAll()));
        }

        logger.info("Creating default departments");
        List<Department> departments = new ArrayList<>();
        departments.add(createDepartment("Engineering"));
        departments.add(createDepartment("Marketing"));
        departments.add(createDepartment("Finance"));
        departments.add(createDepartment("Human Resources"));
        
        logger.info("Created {} departments", departments.size());
        return ResponseEntity.ok(ApiResponse.success("Departments initialized successfully", departments));
    }
    
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Department>> createSingleDepartment(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        logger.info("Creating single department with name: {}", name);
        
        if (name == null || name.isEmpty()) {
            logger.warn("Department name is required but was empty");
            return ResponseEntity.badRequest().body(ApiResponse.error("Department name is required"));
        }
        
        // Check if department already exists with this name
        if (departmentRepository.findByName(name).isPresent()) {
            logger.info("Department with name '{}' already exists", name);
            return ResponseEntity.ok(ApiResponse.success("Department already exists", 
                    departmentRepository.findByName(name).get()));
        }
        
        logger.info("Creating new department with name: {}", name);
        Department department = createDepartment(name);
        logger.info("Department created with ID: {}", department.getId());
        return ResponseEntity.ok(ApiResponse.success("Department created successfully", department));
    }

    private Department createDepartment(String name) {
        Department department = new Department();
        department.setName(name);
        department.setUsers(new ArrayList<>());
        department.setBudgets(new ArrayList<>());
        department.setExpenses(new ArrayList<>());
        department.setManager(null);
        return departmentRepository.save(department);
    }
} 