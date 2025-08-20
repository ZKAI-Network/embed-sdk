# CONTRIBUTING

React component library for Embed AI with tree-shakeable subpath exports and Radix UI foundation.

## Architecture Overview

```
@embed-ai/react
├── /ui          - Base components (Button, Card, Dialog, Input)
├── /feed        - Feed components (FeedCard, FeedGrid, FeedHeader)  
├── /media       - Media components (VideoPlayer, ImageGallery, UrlEmbed)
└── /utils       - Utilities (cn, classname merging)
```

**Component Flow**: Radix primitives → Tailwind styling → forwardRef + className → subpath exports

## What are you doing?

### Adding base UI component
- Component file → `src/components/[name].tsx`
- Export → `src/ui/index.ts` 
- Package export → `package.json` exports field
- Types → forwardRef + proper TypeScript interfaces

### Adding feed-specific component  
- Component file → `src/components/[Name].tsx`
- Export → `src/feed/index.ts`
- Package export → `package.json` exports field (if new)
- Import feed types from `@embed-ai/types`

### Adding media/embed component
- Component file → `src/components/[Name].tsx` 
- Export → `src/media/index.ts`
- Package export → `package.json` exports field (if new)
- Handle loading states and error boundaries

### Adding utility function
- Function → `src/lib/utils.ts`
- Export → direct export from utils file
- Package export → `/utils` already configured

## Development Workflow

### 1. Component Creation
```bash
# Create component with proper patterns
cat > src/components/MyComponent.tsx << 'EOF'
import * as React from "react"
import { cn } from "../lib/utils.js"

interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary"
  size?: "sm" | "md" | "lg"
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-styles",
          variant === "secondary" && "secondary-styles", 
          size === "sm" && "small-styles",
          className
        )}
        {...props}
      />
    )
  }
)
MyComponent.displayName = "MyComponent"

export { MyComponent, type MyComponentProps }
EOF
```

### 2. Export Configuration
```bash
# Add to appropriate index file
echo "export * from \"../components/MyComponent.js\"" >> src/ui/index.ts

# For new export paths, update package.json:
vim package.json  # Add exports entry if needed
```

### 3. Validation
```bash
# TypeScript validation
bun run check

# Lint validation  
bun run lint

# Build verification
bun run build
```

## Code Standards

### Component Structure
```typescript
// ✅ Correct pattern
interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "secondary"
  size?: "sm" | "md" | "lg"
  asChild?: boolean  // For composition
}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn("base-classes", variantClasses[variant], className)}
        {...props}
      />
    )
  }
)
Component.displayName = "Component"
```

### Styling Approach
```typescript
// ✅ CSS variables for theming
const buttonVariants = {
  default: "bg-[var(--button-bg)] text-[var(--button-text)]",
  secondary: "bg-[var(--button-secondary-bg)]"
}

// ✅ Composable with cn utility
className={cn(baseStyles, variantStyles, className)}
```

### Export Pattern
```typescript
// ✅ Named exports with types
export { Button, type ButtonProps }
export { Card, CardContent, CardHeader, type CardProps }

// ❌ Default exports (breaks tree-shaking)
export default Button
```

### Tree-Shaking Requirements
```javascript
// ✅ Direct subpath imports (tree-shakeable)
import { Button } from "@embed-ai/react/ui"
import { FeedCard } from "@embed-ai/react/feed" 

// ❌ Barrel imports (imports entire library)
import { Button } from "@embed-ai/react"
```

## Quality Gates

### Required Validations
```bash
# Component compilation
bun run check

# Code standards
bun run lint  

# Build output verification
bun run build && ls dist/
```

### Pre-submission Checklist
- [ ] Component uses forwardRef pattern
- [ ] Props spread with `{...props}` for extensibility
- [ ] className properly merged with cn()
- [ ] TypeScript interface extends appropriate HTML element
- [ ] Added to correct subpath export
- [ ] Build produces expected output files

## Dependencies

### Core Dependencies
- **Radix UI**: Accessibility primitives (@radix-ui/*)  
- **Tailwind**: Utility classes (class-variance-authority, clsx, tailwind-merge)
- **Icons**: @tabler/icons-react

### Peer Dependencies  
- **React**: ^19.1.0 (React 19+ required)
- **React DOM**: ^19.1.0

### Development
- **Types**: @embed-ai/types (workspace dependency for feed types)

## Component Guidelines

### Accessibility First
```typescript
// ✅ Proper ARIA and semantic HTML
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="button"
      {...props}
    >
      {children}
    </button>
  )
)
```

### Customization Support
```typescript
// ✅ Full styling control
<Button 
  className="custom-styles"
  style={{ "--button-bg": "#custom" }}
  variant="secondary"
  size="lg"
  asChild
>
  <Link href="/custom">Custom Button</Link>
</Button>
```

### Performance Considerations
- Use React.memo() for expensive components
- Lazy load heavy dependencies within useEffect
- Support React Suspense boundaries for async operations
- Optimize bundle size with granular exports

Package modifications require build verification and peer dependency compatibility checks across consuming applications.