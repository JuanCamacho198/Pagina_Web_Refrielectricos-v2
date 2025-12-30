# AGENTS.md - Development Guidelines for Refrielectricos E-Commerce

## Build/Lint/Test Commands

### Backend (NestJS)
```bash
# Development
pnpm -C backend run start:dev    # Start with hot reload
pnpm -C backend run build       # Build for production
pnpm -C backend run start       # Start production server

# Testing
pnpm -C backend run test        # Run all unit tests
pnpm -C backend run test:watch  # Run tests in watch mode
pnpm -C backend run test:cov    # Run tests with coverage
pnpm -C backend run test:e2e    # Run end-to-end tests

# Run single test file
cd backend && npx jest src/path/to/file.spec.ts

# Run single test by pattern
cd backend && npx jest -t "test name pattern"

# Quality
pnpm -C backend run lint        # Lint and auto-fix
pnpm -C backend run format      # Format with Prettier
```

### Frontend (Next.js)
```bash
# Development
pnpm -C frontend/refrielectricos run dev     # Start dev server
pnpm -C frontend/refrielectricos run build   # Build for production
pnpm -C frontend/refrielectricos run start   # Start production server

# Testing
pnpm -C frontend/refrielectricos run test        # Run unit tests
pnpm -C frontend/refrielectricos run test:watch  # Run tests in watch mode
pnpm -C frontend/refrielectricos run test:e2e    # Run E2E tests (Playwright)
pnpm -C frontend/refrielectricos run test:e2e:ui # Run E2E tests with UI

# Run single test file
cd frontend/refrielectricos && npx jest __tests__/component.test.tsx

# Run single test by pattern
cd frontend/refrielectricos && npx jest -t "component name"
```

### Monorepo Commands
```bash
# Install all dependencies
pnpm install

# Lint entire project
pnpm run lint

# Format entire project
pnpm run format
```

## Code Style Guidelines

### TypeScript & Typing
- **Strict typing required**: No `any` types except in exceptional cases with explicit comments
- **Interface definitions**: Use interfaces for API responses, component props, and complex objects
- **Type imports**: Prefer `import type` for type-only imports
- **Generic types**: Use generics for reusable components and utilities

### Imports & Organization
```typescript
// 1. React/Next.js imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. External libraries (alphabetical)
import axios from 'axios'
import { format } from 'date-fns'

// 3. Internal imports (relative paths, grouped by type)
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types/product'
```

### Naming Conventions
- **Components**: PascalCase (`ProductCard`, `UserProfile`)
- **Files**: kebab-case for components, camelCase for utilities (`product-card.tsx`, `formatCurrency.ts`)
- **Hooks**: camelCase with `use` prefix (`useAuth`, `useCart`)
- **Types/Interfaces**: PascalCase (`User`, `ApiResponse`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **Functions**: camelCase (`getUserData`, `formatPrice`)

### Error Handling
```typescript
// Backend (NestJS)
try {
  const result = await this.service.operation()
  return result
} catch (error) {
  this.logger.error('Operation failed', error)
  throw new HttpException('Operation failed', HttpStatus.INTERNAL_SERVER_ERROR)
}

// Frontend (React)
const [error, setError] = useState<string | null>(null)

try {
  const data = await api.get(endpoint)
  // handle success
} catch (err) {
  setError(err instanceof Error ? err.message : 'Unknown error')
}
```

### Component Patterns
```typescript
// Server Component (default)
export default function ProductPage({ params }: { params: { id: string } }) {
  return <div>Product content</div>
}

// Client Component (interactive)
'use client'

interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-md transition-colors',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700'
      )}
    >
      {children}
    </button>
  )
}
```

### Styling (Tailwind CSS)
- **Mobile-first**: Start with mobile styles, add `sm:`, `md:`, `lg:` prefixes
- **Dark mode**: Always include `dark:` variants for new components
- **Utility classes**: Prefer Tailwind utilities over custom CSS
- **Conditional styling**: Use `clsx` or `cn` utility for dynamic classes

```typescript
import { cn } from '@/lib/utils'

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn(
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4',
      className
    )}>
      {children}
    </div>
  )
}
```

### API Integration
```typescript
// Frontend API calls
export async function getProducts(params?: ProductFilters) {
  const response = await api.get<Product[]>('/products', { params })
  return response.data
}

// Backend API responses
@Post('products')
async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
  return this.productsService.create(createProductDto)
}
```

### File Structure
```
backend/src/
├── modules/          # Feature modules
├── common/           # Shared utilities
├── config/           # Configuration files
└── main.ts          # Application entry

frontend/
├── app/              # Next.js app router
├── components/       # Reusable components
├── lib/              # Utilities and API clients
├── hooks/            # Custom React hooks
├── types/            # TypeScript definitions
└── context/          # React context providers
```

### Testing Patterns
```typescript
// Unit test (Jest)
describe('ProductCard', () => {
  it('renders product name and price', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })
})

// E2E test (Playwright)
test('user can add product to cart', async ({ page }) => {
  await page.goto('/products')
  await page.click('[data-testid="add-to-cart"]')
  await expect(page.locator('[data-testid="cart-count"]')).toContainText('1')
})
```

### Git Workflow
- **Branch naming**: `feature/description`, `fix/issue-number`
- **Commit messages**: `feat: add user authentication`, `fix: resolve cart calculation bug`
- **Pre-commit hooks**: ESLint and Prettier auto-fix via lint-staged

### Performance Considerations
- **Images**: Always use `next/image` with appropriate sizes
- **API calls**: Implement proper loading states and error boundaries
- **Bundle size**: Lazy load components and routes when possible
- **Database queries**: Use Prisma includes/select to avoid N+1 problems

### Security
- **Input validation**: Use Zod schemas for frontend, class-validator for backend
- **Authentication**: JWT tokens stored securely (httpOnly cookies preferred)
- **API protection**: Guards and middleware for sensitive endpoints
- **Environment variables**: Never commit secrets, use Railway env vars

## Copilot Instructions
See `.github/copilot-instructions.md` for detailed AI assistant guidelines and project context.</content>
<parameter name="filePath">C:\Users\Juan Camacho\Documents\REFRIELECTRICOS\REFRI_V2\AGENTS.md