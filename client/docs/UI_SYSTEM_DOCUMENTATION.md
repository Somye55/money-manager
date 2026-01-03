# UI System Documentation

## Overview

This documentation provides comprehensive guidance for working with the Money Manager UI system. The system is built on:

- **Tailwind CSS v4** with OKLCH color space
- **Radix UI** primitives for accessible components
- **CVA (Class Variance Authority)** for variant management
- **Lucide React** for icons
- **Recharts** for data visualization
- **next-themes** for theme management

## Table of Contents

1. [Component API Reference](./COMPONENT_API_REFERENCE.md)
2. [Usage Examples](./COMPONENT_USAGE_EXAMPLES.md)
3. [Best Practices](./UI_BEST_PRACTICES.md)
4. [Common Patterns](./UI_COMMON_PATTERNS.md)
5. [Tailwind v4 Configuration](./TAILWIND_V4_CONFIGURATION.md)
6. [Troubleshooting Guide](./UI_TROUBLESHOOTING.md)

## Quick Start

### Adding a New Component

1. Create component file in `src/components/ui/`
2. Use TypeScript for type safety
3. Follow existing component patterns
4. Add accessibility attributes
5. Document the component API
6. Create usage examples

### Modifying Styles

1. Use Tailwind utility classes over inline styles
2. Reference CSS variables for colors
3. Follow the established spacing scale
4. Maintain consistency with existing components
5. Test across light and dark themes

### Common Patterns

- **Glassmorphism**: `backdrop-blur-xl bg-white/80`
- **Gradients**: `bg-gradient-to-br from-indigo-500 to-purple-600`
- **Animations**: `animate-fadeIn` with staggered delays
- **Focus Rings**: `focus-visible:ring-ring/50 focus-visible:ring-[3px]`

## Architecture

```
client/src/
├── components/ui/          # Reusable UI components
│   ├── button.tsx         # Button with CVA variants
│   ├── input.tsx          # Styled input component
│   ├── card.tsx           # Card with sections
│   ├── dialog.tsx         # Radix Dialog
│   ├── select.tsx         # Radix Select
│   ├── utils.ts           # cn() utility
│   └── use-mobile.ts      # Mobile detection hook
├── index.css              # Tailwind imports & CSS variables
└── pages/                 # Application pages
```

## Getting Help

- Check the [Troubleshooting Guide](./UI_TROUBLESHOOTING.md) for common issues
- Review [Component Examples](./COMPONENT_USAGE_EXAMPLES.md) for usage patterns
- Consult [Best Practices](./UI_BEST_PRACTICES.md) for guidelines
