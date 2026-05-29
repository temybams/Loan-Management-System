# Loan Management System API

A TypeScript backend API for managing loan applications, approvals, repayments, repayment schedules, users, roles, and notifications.

The system supports borrower loan applications, admin loan review, repayment processing, outstanding balance tracking, and queued notifications using Redis and BullMQ.

## Features

- User registration and login
- JWT authentication
- Role-based access control for borrowers and admins
- Borrower loan application
- Loan limit checks based on outstanding balance
- Automatic repayment schedule generation
- Admin loan status updates
- Borrower loan history, details, summaries, and schedules
- Repayment processing with partial and full schedule updates
- Payment records
- Notification queue using BullMQ and Redis
- Email notification support with Nodemailer
- SMS service structure with Twilio
- Request validation with Zod
- Prisma ORM with PostgreSQL
- Global rate limiting
- Bull Board dashboard for queue monitoring

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma
- JWT
- Bcrypt
- Zod
- Redis
- BullMQ
- Bull Board
- Nodemailer
- Twilio

## Getting Started

### 1. Install dependencies

```bash
cd server
yarn install
yarn build
yarn dev
yarn worker
## start redis server
