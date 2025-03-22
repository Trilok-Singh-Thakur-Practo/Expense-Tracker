# Expense Tracker Application

A web-based application for managing and tracking organizational expenses with role-based access control and approval workflow.

## Project Overview

The Expense Tracker is designed to streamline the expense management process within an organization. It provides a centralized platform for employees to submit expenses, managers to review and approve/reject expenses, and the finance team to manage payments and budgets.

## Key Features

- **User Authentication**: Secure login and registration with role-based access
- **Role-Based Access Control**: Different interfaces and permissions for employees, managers, and finance personnel
- **Expense Submission**: Easy-to-use form for submitting expenses with receipt attachments
- **Approval Workflow**: Multi-stage approval process for expense requests
- **Budget Management**: Setting and tracking of department budgets by finance team
- **Expense Categorization**: Classification of expenses (Essential, Discretionary, Hybrid)
- **Reporting**: Detailed reporting and analytics for expense tracking
- **Notifications**: In-app alerts for expense status changes and approvals

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Responsive design with custom CSS framework

### Backend (Planned)
- Java with Spring Boot
- RESTful API architecture
- JWT authentication

### Database (Planned)
- PostgreSQL or MySQL
- Relational database for structured expense data

## Project Structure

```
expense-tracker/
│
├── frontend/
│   ├── index.html               # Main HTML file
│   └── src/
│       ├── app.js               # Main application script
│       ├── assets/
│       │   └── css/
│       │       └── styles.css   # Main stylesheet
│       ├── pages/
│       │   ├── login.js         # Login page
│       │   ├── register.js      # Registration page
│       │   ├── employee/        # Employee-specific pages
│       │   ├── manager/         # Manager-specific pages
│       │   ├── finance/         # Finance team-specific pages
│       │   ├── expense/         # Expense-related pages
│       │   └── budget/          # Budget-related pages
│       └── utils/
│           ├── api.js           # API utilities
│           ├── auth.js          # Authentication utilities
│           └── router.js        # Client-side routing
│
├── backend/                    # (Planned)
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/
│       │   │       └── expensetracker/
│       │   │           ├── controllers/
│       │   │           ├── models/
│       │   │           ├── repositories/
│       │   │           └── services/
│       │   └── resources/
│       │       └── application.properties
│       └── test/
│
└── README.md                  # This file
```

## User Roles

### Employee
- Submit new expenses
- View personal expense history
- Track expense approval status

### Manager
- Review and approve/reject expenses from their department
- Submit personal expenses
- Monitor department budget utilization
- Generate departmental expense reports

### Finance Team
- Process approved expenses for payment
- Manage department budgets
- Generate organization-wide expense reports
- Configure expense categories and policies

## Expense Types

- **Essential**: Critical expenses necessary for core business operations
- **Discretionary**: Non-critical expenses that may provide value but aren't essential
- **Hybrid**: Expenses that have aspects of both essential and discretionary categories

## Setup and Installation

### Frontend (Current Implementation)
1. Clone the repository
2. Navigate to the project directory
3. Open `frontend/index.html` in your web browser

### Backend (Planned)
1. Install Java JDK 11+ and Maven
2. Navigate to the `backend` directory
3. Run `mvn clean install` to build the project
4. Run `mvn spring-boot:run` to start the server
5. The API will be available at `http://localhost:8080`

## API Endpoints (Planned)

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user and receive a token

### Expenses
- `GET /api/expenses` - Get all expenses (filtered by user role)
- `GET /api/expenses/{id}` - Get a specific expense
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/{id}` - Update an expense
- `PUT /api/expenses/{id}/status` - Update expense status (approve/reject)
- `DELETE /api/expenses/{id}` - Delete an expense

### Budgets
- `GET /api/budgets` - Get all budgets
- `GET /api/budgets/department/{id}` - Get budgets for a specific department
- `POST /api/budgets` - Create a new budget
- `PUT /api/budgets/{id}` - Update a budget
- `DELETE /api/budgets/{id}` - Delete a budget

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/{id}/employees` - Get employees in a department

## Future Enhancements

- Email notifications for expense status changes
- Mobile application for on-the-go expense submission
- Integration with accounting software
- OCR for receipt scanning and data extraction
- Advanced analytics and forecasting
- Expense policy compliance checking

## Contributors

This project is maintained by [your name or organization].

## License

[Specify your license here] 