# Healthcare Access App - README.md

## Overview

A secure, scalable, and intelligent healthcare platform that allows users to:

* Locate nearby hospitals, clinics, and general practitioners.
* Make in-app appointments.
* Request home consultations.
* Consult doctors via telemedicine (video/chat).
* Access AI-assisted diagnosis.
* Store and control access to their medical records securely via cloud or blockchain.

## Technology Stack

### Core Technologies

| Layer     | Technology                                                         |
| --------- | ------------------------------------------------------------------ |
| Frontend  | React Native (TypeScript)                                          |
| Backend   | Express.js (TypeScript)                                            |
| AI Engine | Python (Flask for symptom checker)                                 |
| Database  | MongoDB                                                            |
| Auth      | JWT                                                                |
| Cloud     | AWS (EC2, S3) or GCP                                               |
| Optional  | Blockchain (Hyperledger Fabric or Polygon for permissioned access) |

## MVP Architecture

**1. Frontend (React Native)**

* User Authentication
* Map-based health provider listing
* Appointment interface
* Teleconsultation module

**2. Backend (Express.js API)**

* RESTful API Endpoints
* User & Role Management
* Appointment Scheduler
* Prescription Management
* Medical Profile Management
* Consultation Management

**3. AI Service (Python)**

* Rule-based symptom checking engine (expandable to ML model)

**4. Database (MongoDB)**

* Document-based schema (Users, MedicalProfiles, Prescriptions, Appointments, Consultations, Facilities)

**5. Optional Blockchain Layer**

* Smart contracts for record access permission
* Audit trail for patient data access

## Proof of Concept

**Use Case**: Sipho, a user in Johannesburg, logs in, locates nearby clinics, books an appointment, and consults via chat. After consultation, AI provides follow-up advice. His medical record is stored and encrypted. If built with blockchain, every data access requires Sipho's approval.

### MVP Functionality

* Sign up / Login
* Find health provider via GPS
* Book appointment
* Conduct chat/video consultation
* Generate & store visit record
* View health record history

## Business Model

* **Freemium Access**: Free basic appointments + AI insights, premium for doctor video consultations.
* **Subscription**: Monthly or annual plans.
* **B2B Model**: Partner with clinics, hospitals, insurers for integration.
* **Data Security Plan**: Monetize premium data sovereignty with blockchain.

## Deployment

* Deploy backend to AWS EC2
* Use MongoDB Atlas or AWS DocumentDB for MongoDB
* Host frontend on App Store / Google Play
* Optional: Integrate IPFS or Hyperledger nodes

## Roadmap

| Phase | Timeline     | Key Features                              |
| ----- | ------------ | ----------------------------------------- |
| 1     | 0-6 Months   | MVP - Appointments, AI, Cloud Records     |
| 2     | 6-12 Months  | Payments, Subscriptions, Insurance APIs   |
| 3     | 12-18 Months | Blockchain, Smart Contracts, Intl Scaling |

## Scalability Plan

* Use microservices in NestJS for modularity
* Containerize using Docker
* Scale with Kubernetes (EKS or GKE)
* Implement caching via Redis for speed

## Security

* OAuth 2.0 + JWT
* HIPAA + POPIA compliance
* HTTPS & end-to-end encryption
* Optional blockchain layer for decentralization

## Target Markets

* South Africa (initial launch)
* Nigeria, Kenya, Ghana, Egypt, Morocco (next)
* Value proposition: reduce waiting times, empower patients, digitize health access

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- Yarn (v1.22 or higher)
- MongoDB (v5.0 or higher, local or Atlas)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/phela.git
   cd phela
   ```

2. Install dependencies using Yarn
   ```bash
   yarn install
   ```

3. Set up environment variables
   ```bash
   yarn prepare-env
   # Edit .env with your configuration
   ```

4. For development:
   ```bash
   # Start the development server with hot reloading
   yarn dev
   ```

5. For production:
   ```bash
   # Build the TypeScript code
   yarn build

   # Start the production server
   yarn start
   ```

### Project Structure

```
phela/
├── dist/                   # Compiled TypeScript output
├── src/                    # Source code
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── index.ts            # Application entry point
│   └── server.ts           # Express app setup
├── .env                    # Environment variables
├── .env.example            # Example environment variables
├── server.js               # Production server entry point
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

### Recent Updates

The following improvements have been made to the project:

1. **Package Versions**: Updated all dependencies to their latest stable versions.

2. **MongoDB Connection**: Improved MongoDB connection handling with better error messages.

3. **Server Structure**: Restructured the server initialization to separate the Express app setup (server.ts) from the entry point (index.ts).

4. **Production Deployment**: Updated the server.js file to properly import the compiled TypeScript code for production deployment.

5. **Environment Setup**: Added a new script `prepare-env` to help developers set up their environment variables.

6. **Build Process Improvement**: Added a `clean:src` script to remove compiled JavaScript files from the source directories. This script is automatically run before the build process via the `prebuild` hook to ensure that only TypeScript files exist in the source directories and compiled JavaScript files are only in the dist directory.

7. **Documentation**: Updated the README.md to accurately reflect the current implementation and technology stack.

### Build Process

To ensure a clean build process:

1. The `clean:src` script removes all compiled JavaScript files from the source directories:
   ```bash
   yarn clean:src
   ```

2. The `build` script compiles TypeScript files to JavaScript in the dist directory:
   ```bash
   yarn build
   ```

3. For convenience, the `prebuild` hook automatically runs `clean:src` before building:
   ```bash
   yarn prebuild
   ```

This ensures that there are no stale or duplicate JavaScript files in the source directories, preventing potential confusion and issues during development.

### TypeScript Migration

The project has been migrated from JavaScript to TypeScript to provide:

- Static type checking
- Better IDE support with autocompletion
- Improved code documentation
- Enhanced refactoring capabilities
- Better scalability for larger codebases

### Yarn vs npm

This project uses Yarn as the package manager instead of npm for:

- Faster installation times
- More reliable dependency resolution
- Better security features
- Improved caching
- Workspace support for monorepos (future scalability)

## NestJS Consideration

### Benefits of Migrating to NestJS

NestJS is a progressive Node.js framework that would provide several advantages for this project:

1. **Architecture**: NestJS enforces a modular architecture based on Angular's design patterns, making the codebase more maintainable and scalable.

2. **TypeScript Integration**: NestJS is built with TypeScript from the ground up, providing superior type safety and developer experience.

3. **Dependency Injection**: Built-in DI system makes testing and component management easier.

4. **Decorators & Metadata**: Reduces boilerplate code through decorators for routes, validation, and more.

5. **Middleware & Interceptors**: Powerful middleware system with request/response interceptors.

6. **Built-in Validation**: Integrated with class-validator for automatic DTO validation.

7. **Microservices Support**: First-class support for microservices architecture when scaling becomes necessary.

8. **GraphQL Integration**: Easy to add GraphQL alongside REST APIs.

9. **WebSockets Support**: Built-in support for real-time communication.

10. **Documentation**: Automatic API documentation generation with Swagger.

### Migration Path

To migrate this Express.js application to NestJS:

1. Install NestJS CLI: `yarn global add @nestjs/cli`
2. Create a new NestJS project: `nest new phela-nest`
3. Migrate models to NestJS entities
4. Convert controllers and routes to NestJS controllers and providers
5. Implement NestJS modules for each domain area
6. Set up authentication with NestJS Passport integration
7. Migrate middleware to NestJS guards and interceptors

### Recommendation

Given the project's requirements for scalability, maintainability, and the planned features like real-time communication and microservices, migrating to NestJS is highly recommended. The initial investment in migration will be offset by the long-term benefits in development speed, code quality, and maintainability.

## License

MIT License

---

For contributors, deployment scripts and detailed schema migrations are included in the `/docs/devops` and `/migrations` folders.

> "Your health, your control. Anytime, anywhere."
