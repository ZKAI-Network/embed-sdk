# React Package Optimization Rules

## 1. Security & Authentication
### Browser Security
- **NEVER** expose secret keys in browser code (they're visible in DevTools)
- **ALWAYS** use session tokens or JWTs scoped to current user
- **AVOID** storing secrets in environment variables (they get bundled)

## 2. Bundle Size Optimization
### Use Subpath Exports
- **NEVER** use barrel exports (`export * from`) - they prevent tree-shaking
- **ALWAYS** configure package.json exports field for direct imports:
  ```json
  {
    "exports": {
      "./hooks/useUser": "./dist/hooks/useUser.js",
      "./ui/Button": "./dist/ui/Button.js"
    }
  }
  ```
- **PREFER** specific imports for better tree-shaking:
  ```typescript
  // ✅ Good - only imports what's needed
  import { Button } from "@myapp/react/ui/Button"
  
  // ❌ Bad - may import entire library
  import { Button } from "@myapp/react"
  ```

### Package.json Requirements
```json
{
  "sideEffects": false,
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "README.md"]
}
```

## 3. React Hook Patterns
### GET Operations as Hooks
- **ALWAYS** expose data fetching as hooks, not Promises:
  ```typescript
  // ✅ Good - React-friendly
  const { data, loading, error } = useUser()
  
  // ❌ Bad - requires boilerplate
  const [user, setUser] = useState()
  useEffect(() => { getUser().then(setUser) }, [])
  ```

### Reactive Mutations
- **MUST** update all hooks when data changes
- **PREFER** eager refresh (update immediately with response)
- **USE** optimistic updates for better UX:
  ```typescript
  const { user, updateUser } = useUser()
  
  const handleUpdate = async (changes) => {
    // Optimistic update
    updateUser(user.id, changes)
    try {
      await api.updateUser(user.id, changes)
    } catch (error) {
      // Revert on failure
      refetch()
    }
  }
  ```

## 4. Developer Ergonomics
### Progressive Disclosure
```typescript
// ✅ Simple by default
const { user } = useUser()

// ✅ Powerful when needed
const { user } = useUser({
  select: ['id', 'name'],
  realtime: true,
  suspense: true,
  staleTime: 5 * 60 * 1000
})
```

### Consistent API Patterns
- **USE** predictable naming: `useUser()`, `useUsers()`, `useUser(id)`
- **RETURN** consistent shape: `{ data, loading, error, refetch }`
- **INCLUDE** mutations with hooks: `{ user, updateUser, deleteUser }`

## 5. Dependency Management
### Minimize Bundle Impact
- **AVOID** heavy dependencies:
  ```typescript
  // ❌ Bad
  import _ from 'lodash' // 70KB
  
  // ✅ Good
  import debounce from 'lodash/debounce' // 2KB
  
  // ✅✅ Better
  const debounce = (fn, ms) => {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => fn(...args), ms)
    }
  }
  ```

### Lightweight Alternatives
- moment.js (67KB) → date-fns functions (~2KB each)
- axios (27KB) → native fetch or redaxios (2KB)
- uuid (11KB) → nanoid (3KB)

## 6. Build Configuration
### TypeScript & Tree-Shaking
```javascript
// vite.config.js
export default {
  build: {
    lib: {
      entry: {
        index: './src/index.ts',
        'hooks/index': './src/hooks/index.ts'
      }
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        preserveModules: true,
        exports: 'named'
      }
    }
  }
}
```

### Performance Features
- **SUPPORT** React Suspense and concurrent features
- **IMPLEMENT** proper error boundaries
- **PROVIDE** development-only debug utilities
- **LAZY LOAD** heavy features:
  ```typescript
  const [parser, setParser] = useState(null)
  useEffect(() => {
    import('heavy-parser').then(m => setParser(() => m.parse))
  }, [])
  ```

## 7. Quality Checklist
### Before Publishing
- [ ] No secrets or API keys in code
- [ ] Tree-shaking verified with bundler
- [ ] TypeScript types properly exported
- [ ] Suspense-compatible hooks included
- [ ] Error messages are actionable
- [ ] Bundle size analyzed and optimized
- [ ] Works with Next.js, Vite, and CRA

### Developer Experience
- [ ] Zero-config setup works
- [ ] TypeScript autocomplete functions
- [ ] Errors suggest solutions
- [ ] Migration guide for breaking changes
- [ ] Examples for common use cases

## 8. UI Component Guidelines
### Customization First
- **ALWAYS** support className and style props:
  ```typescript
  // ✅ Good - fully customizable
  interface ButtonProps {
    className?: string
    style?: React.CSSProperties
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    asChild?: boolean // For Radix-style composition
    children: React.ReactNode
  }
  ```

### Styling Flexibility
- **PREFER** CSS variables for theming:
  ```typescript
  // Component uses CSS variables
  const Button = ({ className, ...props }) => (
    <button 
      className={cn(
        "bg-[var(--button-bg)] text-[var(--button-text)]",
        "hover:bg-[var(--button-hover)]",
        className
      )}
      {...props}
    />
  )
  ```
- **AVOID** hardcoded styles that can't be overridden
- **SUPPORT** both controlled and uncontrolled modes
- **EXPOSE** component parts for composition:
  ```typescript
  // ✅ Composable card
  export const Card = ({ className, ...props }) => (
    <div className={cn("rounded-lg border", className)} {...props} />
  )
  export const CardHeader = ({ className, ...props }) => (
    <div className={cn("p-6", className)} {...props} />
  )
  export const CardContent = ({ className, ...props }) => (
    <div className={cn("p-6 pt-0", className)} {...props} />
  )
  ```

### Accessibility & Flexibility
- **MUST** forward refs for DOM access:
  ```typescript
  const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, ...props }, ref) => (
      <button ref={ref} className={className} {...props} />
    )
  )
  ```
- **MUST** spread remaining props for extensibility
- **SUPPORT** polymorphic components when appropriate:
  ```typescript
  interface ButtonProps<T = 'button'> {
    as?: T
    // ... other props
  }
  ```

### Zero-Style Option
- **PROVIDE** unstyled/headless variants:
  ```typescript
  // Headless hook for maximum control
  export function useButton(props) {
    return {
      buttonProps: {
        role: 'button',
        tabIndex: 0,
        'aria-pressed': props.pressed,
        onClick: props.onClick
      }
    }
  }
  
  // Styled component using the hook
  export const Button = (props) => {
    const { buttonProps } = useButton(props)
    return <button {...buttonProps} className={props.className} />
  }
  ```

### Icon & Asset Handling
- **ACCEPT** icons as props, don't bundle them:
  ```typescript
  // ✅ Good - user provides icons
  <Button icon={<ChevronRight />}>Next</Button>
  
  // ❌ Bad - bundled icons increase size
  <Button iconName="chevron-right">Next</Button>
  ```
- **SUPPORT** both leading and trailing positions
- **ALLOW** custom rendering via render props when needed

## 9. Testing Support
```typescript
// Provide test utilities
export function createMockProvider(initialData = {}) {
  return function MockProvider({ children }) {
    return <SDKContext.Provider value={mockData}>
      {children}
    </SDKContext.Provider>
  }
}

// Component testing helpers
export const renderWithProvider = (ui, options) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <SDKProvider {...options}>{children}</SDKProvider>
    )
  })
}
```

## 10. Component Export Strategy
### Granular Imports
```json
{
  "exports": {
    "./ui/Button": "./dist/ui/Button.js",
    "./ui/Card": "./dist/ui/Card.js",
    "./ui/Card/Header": "./dist/ui/Card/Header.js",
    "./ui/unstyled": "./dist/ui/unstyled/index.js"
  }
}
```

### Usage Examples
```typescript
// Maximum tree-shaking
import { Button } from '@myapp/react/ui/Button'
import { Card, CardHeader } from '@myapp/react/ui/Card'

// Headless/unstyled option
import { useButton } from '@myapp/react/ui/unstyled'

// With custom styling system
<Button 
  className="my-custom-class" 
  style={{ '--button-bg': '#007bff' }}
  asChild
>
  <Link href="/home">Go Home</Link>
</Button>
```

Following these rules ensures your React SDK is secure, performant, tree-shakeable, highly customizable, and provides an excellent developer experience for both hooks and UI components.
