# Expense Tracker API

This repository contains a RESTful API designed to manage personal financial records. It provides secure user authentication and comprehensive expense management features with time-based filtering.

![Project Diagram](https://assets.roadmap.sh/guest/expense-tracker-api-m72p5.png)

## Technical Overview
The API implements JWT-based authentication to ensure data privacy for each user. It follows a standard CRUD pattern for managing expenses across various predefined categories.

## Functional Requirements

### User Authentication
Users must be registered and authenticated to access the endpoints.
- Sign up for a new account.
- Authenticate and receive a JWT for session management.
- Validation of JWT for all protected expense routes.

### Expense Management
Authenticated users can manage their own data:
- Create, Read, Update, and Delete (CRUD) expense records.
- Each record includes amount, date, description, and category.

### Data Filtering
The API supports listing expenses with specific time-range filters:
- Past week
- Past month
- Last 3 months
- Custom date range (start date and end date)

### Expense Categories
The application supports the following categories: Groceries, Leisure, Electronics, Utilities, Clothing, Health, and Others.

## API Endpoints (Draft)

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Expenses
- GET /api/expenses (Supports query params: filter, start_date, end_date)
- POST /api/expenses
- PUT /api/expenses/:id
- DELETE /api/expenses/:id

## Implementation Constraints
- JWT must be used for identification and protection.
- Data must be persisted in a database of choice.
- Each user may only access their own data.
