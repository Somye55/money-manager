# UI System Documentation

Welcome to the Money Manager UI System documentation. This comprehensive guide covers everything you need to know about building and maintaining the application's user interface.

## 📚 Documentation Structure

### [UI System Documentation](./UI_SYSTEM_DOCUMENTATION.md)

Main overview and quick start guide for the UI system.

### [Component API Reference](./COMPONENT_API_REFERENCE.md)

Complete API documentation for all UI components with TypeScript interfaces and prop descriptions.

**Includes:**

- Button, Input, Card components
- Dialog, Select, Checkbox, Switch components
- Tabs, Tooltip, Alert, Badge components
- Skeleton, Progress components
- Utility functions (cn, useMobile)

### [Component Usage Examples](./COMPONENT_USAGE_EXAMPLES.md)

Practical examples showing how to use each component in real-world scenarios.

**Includes:**

- Basic usage examples
- Advanced patterns
- Form integration
- State management
- Loading and error states

### [Best Practices](./UI_BEST_PRACTICES.md)

Guidelines for adding new components and modifying existing styles.

**Covers:**

- Adding new components
- Modifying styles
- Component design principles
- Performance best practices
- Testing best practices
- Code organization
- Common pitfalls to avoid

### [Common Patterns](./UI_COMMON_PATTERNS.md)

Reusable UI patterns used throughout the application.

**Includes:**

- Glassmorphism effects
- Gradient patterns
- Animation patterns
- Layout patterns
- Form patterns
- Card patterns
- List patterns
- Empty state patterns
- Loading state patterns
- Error state patterns
- Modal patterns
- Navigation patterns

### [Tailwind v4 Configuration](./TAILWIND_V4_CONFIGURATION.md)

Guide to Tailwind CSS v4's CSS-based configuration approach.

**Covers:**

- Setup and migration from v3
- Color configuration with OKLCH
- Typography configuration
- Spacing and layout
- Custom animations
- Dark mode implementation
- Gradient utilities
- Best practices

### [Troubleshooting Guide](./UI_TROUBLESHOOTING.md)

Solutions to common issues and debugging tips.

**Includes:**

- Styling issues
- Component issues
- Layout issues
- Animation issues
- Accessibility issues
- Performance issues
- Icon issues
- Form issues
- Chart issues
- Build issues
- Debugging tips

## 🚀 Quick Start

### For New Developers

1. Start with [UI System Documentation](./UI_SYSTEM_DOCUMENTATION.md) for an overview
2. Review [Component API Reference](./COMPONENT_API_REFERENCE.md) to understand available components
3. Check [Component Usage Examples](./COMPONENT_USAGE_EXAMPLES.md) for implementation patterns
4. Read [Best Practices](./UI_BEST_PRACTICES.md) before making changes

### For Adding Components

1. Review [Best Practices - Adding New Components](./UI_BEST_PRACTICES.md#adding-new-components)
2. Check [Common Patterns](./UI_COMMON_PATTERNS.md) for reusable patterns
3. Follow [Component API Reference](./COMPONENT_API_REFERENCE.md) structure
4. Add usage examples to [Component Usage Examples](./COMPONENT_USAGE_EXAMPLES.md)

### For Styling Changes

1. Read [Best Practices - Modifying Styles](./UI_BEST_PRACTICES.md#modifying-styles)
2. Understand [Tailwind v4 Configuration](./TAILWIND_V4_CONFIGURATION.md)
3. Use [Common Patterns](./UI_COMMON_PATTERNS.md) for consistency
4. Test across light and dark themes

### For Troubleshooting

1. Check [Troubleshooting Guide](./UI_TROUBLESHOOTING.md) for your specific issue
2. Review [Component API Reference](./COMPONENT_API_REFERENCE.md) for correct usage
3. Verify implementation against [Component Usage Examples](./COMPONENT_USAGE_EXAMPLES.md)
4. Follow debugging tips in the troubleshooting guide

## 🎨 Design System Overview

### Technology Stack

- **Tailwind CSS v4** - Utility-first CSS framework with OKLCH colors
- **Radix UI** - Accessible component primitives
- **CVA** - Class Variance Authority for variant management
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **next-themes** - Theme management

### Core Principles

1. **Mobile-First** - Design for mobile devices first, then scale up
2. **Accessibility** - WCAG 2.1 AA compliance for all components
3. **Consistency** - Use established patterns and components
4. **Performance** - GPU-accelerated animations, lazy loading
5. **Maintainability** - Clear documentation, TypeScript types

### Color System

- **OKLCH Color Space** - Better perceptual uniformity
- **Semantic Variables** - Theme-aware color tokens
- **Dark Mode** - Full dark mode support with CSS variables
- **Gradients** - Indigo/purple gradient palette

### Component Library

50+ reusable components organized by category:

- **Form Components** - Button, Input, Select, Checkbox, Switch
- **Layout Components** - Card, Container, Grid
- **Overlay Components** - Dialog, Modal, Tooltip
- **Navigation Components** - Tabs, Bottom Navigation
- **Display Components** - Alert, Badge, Skeleton, Progress

## 📖 Documentation Standards

### Component Documentation

Each component should have:

1. TypeScript interface definition
2. Props table with descriptions
3. Usage examples (basic and advanced)
4. Accessibility notes
5. Common patterns

### Code Examples

All code examples should:

- Be complete and runnable
- Include TypeScript types
- Follow best practices
- Show common use cases
- Include comments where helpful

### Maintenance

Documentation should be updated when:

- Adding new components
- Modifying existing components
- Changing design patterns
- Fixing common issues
- Adding new features

## 🔍 Finding Information

### By Task

- **Building a form** → [Form Patterns](./UI_COMMON_PATTERNS.md#form-patterns)
- **Adding a button** → [Button Component](./COMPONENT_API_REFERENCE.md#button-component)
- **Styling with gradients** → [Gradient Patterns](./UI_COMMON_PATTERNS.md#gradient-patterns)
- **Implementing dark mode** → [Tailwind v4 - Dark Mode](./TAILWIND_V4_CONFIGURATION.md#dark-mode)
- **Creating animations** → [Animation Patterns](./UI_COMMON_PATTERNS.md#animation-patterns)

### By Component

- **Button** → [API](./COMPONENT_API_REFERENCE.md#button-component) | [Examples](./COMPONENT_USAGE_EXAMPLES.md#button-examples)
- **Input** → [API](./COMPONENT_API_REFERENCE.md#input-component) | [Examples](./COMPONENT_USAGE_EXAMPLES.md#input-examples)
- **Card** → [API](./COMPONENT_API_REFERENCE.md#card-component) | [Examples](./COMPONENT_USAGE_EXAMPLES.md#card-examples)
- **Dialog** → [API](./COMPONENT_API_REFERENCE.md#dialog-component) | [Examples](./COMPONENT_USAGE_EXAMPLES.md#dialog-examples)

### By Issue

- **Styles not working** → [Troubleshooting - Styling Issues](./UI_TROUBLESHOOTING.md#styling-issues)
- **Dark mode broken** → [Troubleshooting - Dark Mode](./UI_TROUBLESHOOTING.md#issue-dark-mode-not-working)
- **Animations janky** → [Troubleshooting - Animations](./UI_TROUBLESHOOTING.md#issue-animations-janky-or-slow)
- **Component not rendering** → [Troubleshooting - Component Issues](./UI_TROUBLESHOOTING.md#component-issues)

## 🤝 Contributing

When contributing to the UI system:

1. **Follow Established Patterns** - Use existing components and patterns
2. **Document Changes** - Update relevant documentation
3. **Test Thoroughly** - Test across devices and themes
4. **Maintain Accessibility** - Ensure WCAG compliance
5. **Write Examples** - Add usage examples for new features

## 📝 Changelog

Track major changes to the UI system:

- **v1.0** - Initial UI system with Tailwind v4 and Radix UI
- Component library with 50+ components
- Comprehensive documentation
- Dark mode support
- Accessibility compliance

## 🔗 External Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives)
- [Lucide Icons](https://lucide.dev/)
- [Recharts Documentation](https://recharts.org/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OKLCH Color Picker](https://oklch.com/)

## 💡 Tips

- Use the search function (Ctrl/Cmd + F) to find specific topics
- Bookmark frequently referenced pages
- Keep documentation open while developing
- Refer to examples when implementing new features
- Check troubleshooting guide before asking for help

---

**Last Updated:** January 2026

**Maintained By:** Development Team

**Questions?** Check the [Troubleshooting Guide](./UI_TROUBLESHOOTING.md) or reach out to the team.
