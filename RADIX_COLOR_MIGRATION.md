# Radix Color Migration Guide

This guide outlines the hybrid approach for integrating Radix Color with your existing DaisyUI design system.

## Overview

We've implemented a hybrid approach that:
- ✅ Keeps your existing DaisyUI components working
- ✅ Integrates Radix Color's excellent color science
- ✅ Maintains accessibility standards
- ✅ Provides seamless theme switching
- ✅ Offers both semantic tokens and direct color access

## What's Changed

### 1. Package Installation
```bash
pnpm add @radix-ui/colors
```

### 2. New Files Added
- `src/utils/radixColorMapping.ts` - Color mapping utilities
- `src/components/ui/radix-color-demo.tsx` - Demo component
- `src/app/radix-demo/page.tsx` - Demo page

### 3. Updated Files
- `src/app/globals.css` - Updated DaisyUI themes with Radix colors
- `src/contexts/ThemeContext.tsx` - Enhanced with Radix color support

## Color Mapping

### DaisyUI Semantic Tokens → Radix Color Scales

| DaisyUI Token | Radix Color (Dark) | Radix Color (Light) | Usage |
|---------------|-------------------|-------------------|-------|
| `--color-base-100` | `#1a1a1a` (gray2) | `#ffffff` (whiteA12) | Main background |
| `--color-base-200` | `#262626` (gray3) | `#f4f4f5` (gray2) | Secondary background |
| `--color-base-300` | `#404040` (gray4) | `#e4e4e7` (gray3) | Tertiary background |
| `--color-primary` | `#3b82f6` (blue9) | `#3b82f6` (blue9) | Brand color |
| `--color-secondary` | `#475569` (slate9) | `#f1f5f9` (slate2) | Secondary color |
| `--color-accent` | `#ea580c` (orange9) | `#ea580c` (orange9) | Accent color |
| `--color-info` | `#0891b2` (cyan9) | `#0891b2` (cyan9) | Info state |
| `--color-success` | `#16a34a` (green9) | `#16a34a` (green9) | Success state |
| `--color-warning` | `#eab308` (yellow9) | `#eab308` (yellow9) | Warning state |
| `--color-error` | `#dc2626` (red9) | `#dc2626` (red9) | Error state |

## Usage Patterns

### 1. Existing DaisyUI Classes (No Changes Required)
```tsx
// These continue to work exactly as before
<button className="btn btn-primary">Primary Button</button>
<div className="card bg-base-100 shadow-xl">Card Content</div>
<div className="alert alert-success">Success Message</div>
```

### 2. Direct Radix Color Access
```tsx
import { getRadixColor, getRadixColorAlpha } from '@/utils/radixColorMapping';
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <div 
      style={{ 
        backgroundColor: getRadixColor('primary', 'primary', theme),
        color: getRadixColor('primary', 'primary-content', theme)
      }}
    >
      Direct Radix Color Usage
    </div>
  );
}
```

### 3. Alpha Variants
```tsx
<div 
  style={{ 
    backgroundColor: getRadixColorAlpha('primary', 'primary', theme, 0.2)
  }}
>
  Semi-transparent background
</div>
```

### 4. Direct Scale Access
```tsx
import { radixColorScales } from '@/utils/radixColorMapping';

// Access any step of any scale
const blue500 = radixColorScales.blue.blue5;
const slate900 = radixColorScales.slate.slate9;
```

## Migration Strategy

### Phase 1: Foundation (Completed ✅)
- [x] Install Radix Color package
- [x] Create color mapping utilities
- [x] Update DaisyUI themes with Radix colors
- [x] Enhance ThemeContext with Radix support

### Phase 2: Gradual Migration (Recommended)
1. **Start with new components** - Use Radix Color directly
2. **Update existing components gradually** - Replace hardcoded colors
3. **Test thoroughly** - Ensure accessibility and consistency
4. **Document changes** - Update component documentation

### Phase 3: Advanced Features (Optional)
- [ ] Custom color scales for brand colors
- [ ] Dynamic theme generation
- [ ] Color contrast validation
- [ ] Design token export

## Benefits Achieved

### ✅ Accessibility
- WCAG contrast ratios built-in
- Consistent color relationships
- Better color perception

### ✅ Maintainability
- Centralized color management
- Type-safe color access
- Easy theme switching

### ✅ Flexibility
- Both semantic and direct color access
- Alpha variants for transparency
- 12-step color scales

### ✅ Performance
- CSS custom properties for runtime theming
- Minimal bundle size impact
- Efficient color calculations

## Testing the Integration

1. **Visit the demo page**: `/radix-demo`
2. **Test theme switching**: Toggle between light/dark modes
3. **Check accessibility**: Verify contrast ratios
4. **Test components**: Ensure existing components still work

## Common Patterns

### Custom Color Scales
```tsx
// Add your brand colors to radixColorMapping.ts
export const customBrandColors = {
  brand: {
    light: {
      'brand-primary': '#your-brand-color',
      'brand-secondary': '#your-secondary-color',
    },
    dark: {
      'brand-primary': '#your-brand-color-dark',
      'brand-secondary': '#your-secondary-color-dark',
    }
  }
};
```

### Dynamic Color Generation
```tsx
// Generate colors based on user preferences
const userTheme = generateRadixTheme(userPreferredTheme);
```

### Color Validation
```tsx
// Validate color contrast ratios
const isValidContrast = checkContrastRatio(
  getRadixColor('primary', 'primary', theme),
  getRadixColor('primary', 'primary-content', theme)
);
```

## Troubleshooting

### Issue: Colors not updating
**Solution**: Ensure ThemeContext is properly wrapping your app and theme state is updating.

### Issue: TypeScript errors
**Solution**: Import types from the mapping file and ensure proper type annotations.

### Issue: Performance concerns
**Solution**: Colors are cached in CSS custom properties, so performance impact is minimal.

## Next Steps

1. **Review the demo page** to see the integration in action
2. **Start migrating components** one by one
3. **Add custom brand colors** if needed
4. **Test across different themes** and devices
5. **Gather feedback** from your team

## Resources

- [Radix Color Documentation](https://www.radix-ui.com/colors)
- [DaisyUI Documentation](https://daisyui.com/)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

---

**Need help?** Check the demo component at `src/components/ui/radix-color-demo.tsx` for examples of all usage patterns.

