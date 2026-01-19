# AGENTS.md - PlanÉtude Backend

## Project Overview

Backend API for PlanÉtude study management app. Stack: Node.js 22+, TypeScript 5, Express 4, MongoDB/Mongoose, Jest 30, Zod.

## Commands

```bash
# Install dependencies
pnpm install

# Development with hot reload
pnpm dev

# Build for production
pnpm run build

# Linting
pnpm lint

# Run all tests
pnpm test

# Run single test file
pnpm test -- tests/utils.test.ts

# Run test with name pattern
pnpm test -- --testNamePattern="should hash password"

# Run with coverage
pnpm test -- --coverage
```

## Code Style

### TypeScript
- **NEVER use `any`** - Define explicit types
- Use interfaces for complex objects, types for primitives/unions
- Enable strict mode (`noImplicitAny`, `strictNullChecks`)

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
}

async function getUser(id: string): Promise<User | null> {
  // Return null instead of throwing for not found
}
```

### Imports Order
1. Node.js core modules
2. Third-party libraries (express, mongoose, etc.)
3. Absolute imports (middleware/, shared/, core/)
4. Relative imports (../, ./)

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { protect } from 'middleware/authMiddleware';
import { User } from 'shared/types';
import UserModel from '../models/User.model';
```

### Naming Conventions
- **Files**: camelCase for `.ts`, PascalCase for React components
- **Classes/Interfaces**: PascalCase
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces**: No `I` prefix (modern style)

```typescript
const API_BASE_URL = 'https://api.example.com';
interface UserProfile { ... }
class UserService { ... }
const getUserById = async () => { ... };
```

### Formatting
- 2 spaces for indentation
- Semicolons required
- Single quotes for strings
- Max 100 characters per line

```typescript
const user = {
  name: 'John',
  age: 30,
};

const createUser = async (
  data: CreateUserDto
): Promise<User> => {
  // ...
};
```

## Architecture (DDD)

```
src/
├── core/           # Infrastructure (config, database, logging, validation)
├── modules/        # Business domains (auth, planning, progress, subjects, themes, lofi, admin)
│   └── [module]/
│       ├── domain/       # Entities & Repository interfaces
│       ├── application/  # Services (business logic)
│       ├── infrastructure/ # MongoDB repositories
│       └── presentation/ # Controllers, DTOs, routes
├── shared/         # Shared types, errors, utils, constants
└── middleware/     # Express middleware
```

### Module Structure Pattern
```typescript
// domain/Entity.ts
export class Entity {
  constructor(id: string, ...) { ... }
  toPersistence(): any { ... }
  static fromPersistence(data: any): Entity { ... }
}

// application/Service.ts
export class EntityService {
  constructor(private repository: IEntityRepository) { }
  async create(data: any): Promise<Entity> { ... }
}

// infrastructure/MongoRepository.ts
export class MongoEntityRepository implements IEntityRepository {
  constructor(private model: Model<any>) { }
}

// presentation/Controller.ts & routes.ts
export class EntityController {
  create = async (req: Request, res: Response, next: NextFunction) => { ... }
}
```

## Error Handling

Use custom error classes from `shared/errors/CustomErrors.ts`:

```typescript
import { NotFoundError, ValidationError, AuthorizationError } from 'shared/errors/CustomErrors';

throw new NotFoundError('Utilisateur');
throw new ValidationError('Email invalide');
throw new AuthorizationError('Accès refusé');
```

Always use `try/catch` and pass errors to `next()`:

```typescript
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
```

## API Response Format

```typescript
// Success
res.json({ success: true, data: result });

// Error (handled by errorHandler middleware)
res.status(404).json({ success: false, message: 'Not found' });
```

## Security

- Validate all inputs with Zod schemas (`core/validation/schemas.ts`)
- Use JWT authentication middleware (`middleware/authMiddleware.ts`)
- Use admin middleware for protected routes (`middleware/adminMiddleware.ts`)
- Never log sensitive data (passwords, tokens)

## Testing

- Unit tests in `tests/*.test.ts`
- Integration tests in `tests/api.integration.test.ts.skip` (requires MongoDB)
- Use descriptive test names: `it('should return 401 for invalid token')`

## Environment Variables

Required in `.env`:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `GEMINI_API_KEY` - AI integration
- `PORT` - Server port (default 3001)
