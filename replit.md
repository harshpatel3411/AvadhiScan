# Expiry Tracker Application

## Overview

Expiry Tracker is a full-stack web application designed to help users manage and track expiration dates of various items including groceries, medicines, cosmetics, and household products. The application provides comprehensive item management with intelligent expiry notifications, barcode scanning capabilities, and a modern responsive interface. Built with React and Express.js, it features JWT-based authentication, PostgreSQL database integration, and email notification services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with **React** and **TypeScript**, utilizing modern React patterns including hooks and functional components. The UI framework is **shadcn/ui** with **Tailwind CSS** for styling, providing a consistent and responsive design system. State management is handled through **TanStack Query** for server state synchronization and caching. The application uses **Wouter** for lightweight client-side routing and includes a comprehensive theme system supporting light/dark modes.

### Backend Architecture
The server follows a **REST API** pattern built on **Express.js** with TypeScript. The architecture uses a layered approach with separate concerns for routing, middleware, storage, and external services. Authentication is implemented using **JWT tokens** with bcrypt for password hashing. The storage layer abstracts database operations through an interface pattern, currently implementing an in-memory storage solution with the architecture ready for PostgreSQL integration via **Drizzle ORM**.

### Data Storage Solution
The application is configured to use **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations. The schema defines two main entities: users (with authentication credentials and notification preferences) and items (with comprehensive tracking information including expiry dates, categories, and optional barcode data). The database structure supports cascading deletes and includes proper indexing for performance.

### Authentication & Authorization
Security is implemented through **JWT-based authentication** with secure token storage in localStorage. The system includes middleware for protecting API routes and an authentication guard component for client-side route protection. Password security uses bcrypt with appropriate salt rounds, and the system includes comprehensive user session management.

### External Service Integrations
The application integrates with multiple external services: **barcode lookup APIs** for product information retrieval, **email services** (configured for SMTP) for expiry notifications, and **Vite development server** integration for hot module replacement during development. The architecture supports extensible notification systems including future SMS and push notification capabilities.

## External Dependencies

- **Database**: PostgreSQL with Neon Database serverless connection
- **Email Service**: SMTP-based email notifications (configurable providers)
- **Barcode API**: UPC Item Database API for product information lookup
- **Frontend Libraries**: React, TypeScript, Tailwind CSS, shadcn/ui components, TanStack Query
- **Backend Libraries**: Express.js, Drizzle ORM, JWT authentication, bcryptjs, nodemailer
- **Development Tools**: Vite build system, TypeScript compiler, PostCSS, Autoprefixer
- **UI Components**: Radix UI primitives for accessible component foundation
- **Date Handling**: date-fns library for date calculations and formatting
- **Form Management**: React Hook Form with Zod validation schemas