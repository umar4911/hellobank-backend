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

