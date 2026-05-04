# Chatly API - Project Context & Guidelines

## Project Overview
Chatly API is a NestJS-based backend for a modern chat application. It provides robust features for real-time communication, user management, and secure authentication.

### Main Technologies
- **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Authentication:** 
  - JWT-based authentication (Passport.js)
  - Google OAuth2 integration
  - Two-Factor Authentication (2FA) via Speakeasy & QR Codes
  - OTP (One-Time Password) via Nodemailer
- **Caching:** [Redis](https://redis.io/) using `cache-manager` and `cache-manager-redis-store`
- **Real-time:** WebSockets using [Socket.io](https://socket.io/)
- **API Documentation:** [Swagger](https://swagger.io/) (available at `/api/docs`)
- **Utilities:** Bcrypt for hashing, class-validator for DTO validation, compression for response optimization.

### Architecture
The project follows the standard NestJS modular architecture:
- `src/main.ts`: Application entry point.
- `src/app.ts`: Root module orchestrating global configurations and features.
- `src/modules/`: Feature-specific modules (Auth, Users, etc.).
- `src/common/`: Shared decorators, guards, filters, interceptors, and utilities.
- `src/config/`: Environment-based configurations using `@nestjs/config`.
- `src/prisma/`: Prisma service and module.
- `prisma/`: Database schema and migrations.

---

## Building and Running

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL
- Redis

### Installation
```bash
npm install
```

### Database Setup
1. Configure `DATABASE_URL` in `.env`.
2. Run migrations:
```bash
npx prisma migrate dev
```

### Running the App
```bash
# Development (with watch mode)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### API Documentation
Swagger UI is accessible at `http://<host>:<port>/api/docs`.
- **Note:** The documentation is protected by basic authentication (credentials defined in `APP_CONFIG`).

---

## Development Conventions

### Coding Style & Linting
- Follow standard NestJS and TypeScript best practices.
- Use `npm run lint` for linting (ESLint) and `npm run format` for formatting (Prettier).
- **Import Ordering:** Organized imports are enforced (likely via `@trivago/prettier-plugin-sort-imports`).

### Authentication & Authorization
- **Global Auth:** A global `AuthGuard` is typically active.
- **Public Routes:** Use the `@Public()` decorator to bypass authentication.
- **User Data:** Use the `@CurrentUser()` decorator in controllers to access the authenticated user's payload.

### Error Handling
- Use `ServiceExceptions.handle(error, className, methodName)` within service catch blocks for consistent error logging and propagation.
- DTOs should use `class-validator` decorators for input validation.

### Database Interactions
- All database operations should go through `PrismaService`.
- Prisma schema is located in `prisma/schema.prisma`. Always run `npx prisma generate` after schema changes.

### Naming Conventions
- **Files:** Kebab-case (e.g., `user-profile.service.ts`).
- **Classes:** PascalCase (e.g., `UsersService`).
- **Variables/Methods:** camelCase (e.g., `getUserById`).
- **Enums/Types:** PascalCase.

### Versioning
- The API uses URI-based versioning (e.g., `/api/v1/...`).
- Default version is set to `1`.
