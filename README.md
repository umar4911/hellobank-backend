# Hello Bank Backend

This repository contains the **backend service** for **HelloBank**, a fully digital online banking system.  
The backend provides REST APIs for user authentication, account management, transactions, card services, beneficiary handling, ticketing, and admin operations.

## Features

### Authentication & Users

- Client account creation
- Login for clients and admins
- JWT-based authentication
- Password hashing

### Client Account Management

- Retrieve account details
- View account balance
- Update personal information
- Account deletion (admin-controlled)

### Card Management (Admin)

- Issue cards
- Block cards

### Beneficiaries

- Add beneficiary
- Edit beneficiary
- Delete beneficiary

### Transactions

- Make transfers to valid accounts
- Balance validation
- Transaction logging

### Account Statement

- Full transaction history retrieval

### Ticket System

- Client can create support tickets
- Admin can respond to tickets

### Product Purchases

- Clients can buy discounted bank products based on card type

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT
- Bcrypt
- Middleware-based route protection

## Project Structure

```bash
.
├── Errorlog.json
├── README.md
├── config.js
├── index.js
├── package.json
├── package-lock.json
├── node_modules/
├── config/
│   ├── database.js      # MongoDB connection / DB setup
│   ├── error.js         # Centralized error configuration/mapping
│   └── server.js        # Express app & server configuration
└── src/
    ├── api/             # Route definitions
    │   ├── AuthRoute.js           # /auth endpoints
    │   ├── BeneficiaryRoute.js    # /beneficiary endpoints
    │   ├── TicketRoute.js         # /ticket endpoints
    │   ├── TransactionRoute.js    # /transaction endpoints
    │   └── UserRoute.js           # /user endpoints
    │   └── ProductRoute.js           # /product endpoints
    │
    ├── constants/       # Static JSON configs/constants
    │   ├── Admins.json  # Admin database
    │   └── Status.json
    │
    ├── controllers/     # Request handlers
    │   ├── AuthController.js
    │   ├── BeneficiaryController.js
    │   ├── TicketController.js
    │   ├── ProductController.js
    │   ├── TransactionController.js
    │   └── UserController.js
    │
    ├── cors/
    │   └── Middleware.js # Auth middlewares
    │
    ├── models/          # Mongoose models / schemas
    │   ├── Beneficiary.js
    │   ├── Card.js
    │   ├── Ticket.js
    │   ├── Transaction.js
    │   └── User.js
    │
    ├── services/        # DB abstraction layer (talks to models)
    │   ├── BeneficiaryService.js
    │   ├── CardService.js
    │   ├── DBService.js          # Aggregates all services in one export
    │   ├── TicketService.js
    │   ├── TransactionService.js
    │   └── UserService.js
    │
    └── utils/           # Helper utilities
        ├── Logger.js    # Logging wrapper
        └── utils.js     # Common helpers
```
