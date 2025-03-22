# Expense Tracker Backend Implementation Guide

This document outlines the planned backend implementation for the Expense Tracker application using Spring Boot.

## Technology Stack

- **Java 17+**
- **Spring Boot 3.x**
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database access
- **PostgreSQL** for relational database
- **Maven** for dependency management and building

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── expensetracker/
│   │   │           ├── ExpenseTrackerApplication.java
│   │   │           ├── config/
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   └── JwtConfig.java
│   │   │           ├── controllers/
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── ExpenseController.java
│   │   │           │   ├── BudgetController.java
│   │   │           │   └── DepartmentController.java
│   │   │           ├── models/
│   │   │           │   ├── User.java
│   │   │           │   ├── Department.java
│   │   │           │   ├── Expense.java
│   │   │           │   └── Budget.java
│   │   │           ├── repositories/
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── DepartmentRepository.java
│   │   │           │   ├── ExpenseRepository.java
│   │   │           │   └── BudgetRepository.java
│   │   │           ├── services/
│   │   │           │   ├── UserService.java
│   │   │           │   ├── DepartmentService.java
│   │   │           │   ├── ExpenseService.java
│   │   │           │   └── BudgetService.java
│   │   │           ├── security/
│   │   │           │   ├── JwtTokenProvider.java
│   │   │           │   └── UserDetailsServiceImpl.java
│   │   │           ├── dto/
│   │   │           │   ├── UserDto.java
│   │   │           │   ├── ExpenseDto.java
│   │   │           │   └── BudgetDto.java
│   │   │           └── exceptions/
│   │   │               ├── ResourceNotFoundException.java
│   │   │               └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql
│   └── test/
│       └── java/
│           └── com/
│               └── expensetracker/
│                   ├── controllers/
│                   ├── services/
│                   └── repositories/
└── pom.xml
```

## Database Schema

### User Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    department_id INT REFERENCES departments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Department Table
```sql
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Expense Table
```sql
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    receipt_url VARCHAR(255),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    employee_id INT REFERENCES users(id),
    department_id INT REFERENCES departments(id),
    approver_id INT REFERENCES users(id),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Budget Table
```sql
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    department_id INT REFERENCES departments(id),
    amount DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication

#### Register a new user
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@company.com",
  "password": "password123",
  "role": "EMPLOYEE",
  "departmentId": 1
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@company.com",
    "role": "EMPLOYEE"
  }
}
```

#### Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john.doe@company.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@company.com",
    "role": "EMPLOYEE",
    "departmentId": 1
  }
}
```

### Expenses

#### Get all expenses (filtered by role)
```
GET /api/expenses
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Office Supplies",
      "amount": 150.00,
      "type": "ESSENTIAL",
      "date": "2023-07-15",
      "receiptUrl": "https://example.com/receipts/1.pdf",
      "notes": "Purchased pens, notebooks, and paper",
      "status": "APPROVED",
      "employeeId": 1,
      "employeeName": "John Doe",
      "departmentId": 1,
      "departmentName": "Engineering",
      "approverId": 2,
      "approverName": "Jane Smith",
      "createdAt": "2023-07-15T10:30:00Z"
    }
  ]
}
```

#### Create a new expense
```
POST /api/expenses
```

**Request Body:**
```json
{
  "name": "Team Lunch",
  "amount": 120.50,
  "type": "DISCRETIONARY",
  "date": "2023-07-20",
  "receiptUrl": "https://example.com/receipts/2.pdf",
  "notes": "Monthly team lunch",
  "employeeId": 1,
  "departmentId": 1
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Expense created successfully",
  "data": {
    "id": 2,
    "name": "Team Lunch",
    "amount": 120.50,
    "status": "PENDING"
  }
}
```

#### Update expense status
```
PUT /api/expenses/{id}/status
```

**Request Body:**
```json
{
  "status": "APPROVED",
  "approverId": 2,
  "rejectionReason": null
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Expense status updated successfully",
  "data": {
    "id": 2,
    "status": "APPROVED"
  }
}
```

### Budgets

#### Get all budgets
```
GET /api/budgets
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "departmentId": 1,
      "departmentName": "Engineering",
      "amount": 10000.00,
      "usedAmount": 2500.00,
      "startDate": "2023-07-01",
      "endDate": "2023-07-31",
      "description": "July 2023 budget"
    }
  ]
}
```

#### Create a new budget
```
POST /api/budgets
```

**Request Body:**
```json
{
  "departmentId": 1,
  "amount": 12000.00,
  "startDate": "2023-08-01",
  "endDate": "2023-08-31",
  "description": "August 2023 budget"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Budget created successfully",
  "data": {
    "id": 2,
    "departmentId": 1,
    "departmentName": "Engineering",
    "amount": 12000.00
  }
}
```

## Security Implementation

### JWT Authentication Flow

1. The client sends authentication credentials (email/password) to the server
2. The server validates the credentials and generates a JWT token
3. The server sends the token back to the client
4. The client stores the token and includes it in the Authorization header for subsequent requests
5. The server validates the token for each protected request

### User Roles and Permissions

- **EMPLOYEE**:
  - Can create, view, and delete own expenses
  - Can view own department budget usage

- **MANAGER**:
  - Can create, view, and delete own expenses
  - Can view, approve, or reject expenses from their department
  - Can view department budget usage

- **FINANCE**:
  - Can view all expenses across departments
  - Can mark expenses as paid
  - Can create and manage budgets for all departments
  - Can view budget usage reports

## Setup and Installation

1. Clone the repository
2. Navigate to the `backend` directory
3. Configure the database connection in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/expense_tracker
   spring.datasource.username=postgres
   spring.datasource.password=password
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   
   # JWT Configuration
   app.jwt.secret=your-secret-key
   app.jwt.expiration=86400000
   ```
4. Run `mvn clean install` to build the project
5. Run `mvn spring-boot:run` to start the server
6. The API will be available at `http://localhost:8080`

## Testing

The backend includes unit tests and integration tests for controllers, services, and repositories. Run the tests using:

```bash
mvn test
```

## Deployment

For production deployment, consider:

1. Using a production-grade database instance
2. Configuring proper CORS settings
3. Setting up proper logging
4. Using HTTPS
5. Setting a strong JWT secret key
6. Adjusting token expiration time
7. Implementing rate limiting
8. Setting up CI/CD pipeline

## Future Backend Enhancements

- Email notifications for expense status changes
- Integration with accounting software via APIs
- Advanced analytics and reporting
- Document upload for receipts
- OCR for receipt data extraction
- Automated budget planning 