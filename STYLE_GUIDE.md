# 🎨 ThumbnailAI Style Guide

A comprehensive guide to the design system, colors, typography, and components.

---

## 🌈 Color Palette

### Primary Colors (Sky Blue)
```
50:  #f0f9ff  Light background
100: #e0f2fe  Subtle highlights
200: #bae6fd  Borders & dividers
300: #7dd3fc  Hover states
400: #38bdf8  Interactive elements
500: #0ea5e9  Brand primary
600: #0284c7  Main buttons (most used)
700: #0369a1  Pressed states
800: #075985  Dark accents
900: #0c4a6e  Text on light backgrounds
```

### Secondary Colors (Fuchsia/Purple)
```
50:  #fdf4ff  Light background
100: #fae8ff  Subtle highlights
200: #f5d0fe  Borders & dividers
300: #f0abfc  Hover states
400: #e879f9  Interactive elements
500: #d946ef  Brand secondary
600: #c026d3  Main buttons (most used)
700: #a21caf  Pressed states
800: #86198f  Dark accents
900: #701a75  Text on light backgrounds
```

### Accent Colors (Orange)
```
50:  #fff7ed  Light background
100: #ffedd5  Subtle highlights
200: #fed7aa  Borders & dividers
300: #fdba74  Hover states
400: #fb923c  Interactive elements
500: #f97316  Brand accent
600: #ea580c  Main buttons (most used)
700: #c2410c  Pressed states
800: #9a3412  Dark accents
900: #7c2d12  Text on light backgrounds
```

### Neutral Colors
```
Gray scale for text and backgrounds
50:  #f9fafb
100: #f3f4f6
200: #e5e7eb
300: #d1d5db
400: #9ca3af
500: #6b7280
600: #4b5563
700: #374151
800: #1f2937
900: #111827
```

---

## 🎨 Gradient Combinations

### Primary Gradients
```css
/* Blue to Purple */
.bg-gradient-to-r.from-primary-600.to-secondary-600

/* Purple to Orange */
.bg-gradient-to-r.from-secondary-600.to-accent-600

/* Blue to Purple to Orange (Mesh) */
.bg-gradient-mesh
```

### Usage Examples
```tsx
// Button with gradient
<button className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
  Click Me
</button>

// Gradient text
<h1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600">
  Gradient Title
</h1>

// Card with gradient background
<div className="bg-gradient-to-br from-white to-primary-50/30">
  Content
</div>
```

---

## 📝 Typography

### Font Families
```css
/* Primary font (body text) */
font-family: Inter, system-ui, -apple-system, sans-serif

/* Display font (headings) */
font-family: Cal Sans, Inter, sans-serif

/* Monospace (code) */
font-family: JetBrains Mono, monospace
```

### Font Sizes & Weights

#### Headings
```tsx
// H1 - Hero headline
<h1 className="text-5xl md:text-7xl font-extrabold">

// H2 - Section headline
<h2 className="text-4xl md:text-5xl font-bold">

// H3 - Card/component title
<h3 className="text-2xl font-bold">

// H4 - Small heading
<h4 className="text-xl font-semibold">
```

#### Body Text
```tsx
// Large body
<p className="text-xl text-gray-600">

// Regular body
<p className="text-base text-gray-600">

// Small text
<p className="text-sm text-gray-500">

// Extra small (labels)
<span className="text-xs text-gray-400">
```

#### Font Weights
```
font-normal     : 400 (body text)
font-medium     : 500 (emphasis)
font-semibold   : 600 (labels, buttons)
font-bold       : 700 (headings)
font-extrabold  : 800 (hero text)
```

---

## 🔘 Buttons

### Primary Button
```tsx
<button className="btn btn-primary btn-lg">
  <Sparkles className="mr-2 h-5 w-5" />
  Get Started
</button>
```
- Gradient background (blue to purple)
- White text
- Hover: scale up + shadow
- Active: scale down

### Secondary Button
```tsx
<button className="btn btn-secondary btn-md">
  Learn More
</button>
```
- Gradient background (purple to orange)
- White text
- Similar animations to primary

### Outline Button
```tsx
<button className="btn btn-outline btn-md">
  Cancel
</button>
```
- 2px border
- Transparent background
- Hover: border changes to primary color

### Ghost Button
```tsx
<button className="btn btn-ghost btn-sm">
  Skip
</button>
```
- No border
- Transparent background
- Hover: subtle background color

### Button Sizes
```tsx
// Small
<button className="btn btn-sm">Small</button>    // h-9 px-4

// Medium
<button className="btn btn-md">Medium</button>   // h-11 px-6

// Large
<button className="btn btn-lg">Large</button>    // h-14 px-8
```

---

## 📦 Cards

### Standard Card
```tsx
<div className="card p-6">
  <h3 className="text-xl font-bold mb-4">Card Title</h3>
  <p className="text-gray-600">Card content goes here</p>
</div>
```
- Rounded corners (rounded-2xl)
- White background with 80% opacity
- Backdrop blur
- Border and shadow
- Hover: increased shadow

### Gradient Card
```tsx
<div className="card-gradient p-8">
  <h3 className="text-2xl font-bold mb-3">Premium Card</h3>
  <p className="text-gray-600">Enhanced card with gradient</p>
</div>
```
- Gradient background (white to primary-50)
- Border with primary color
- Stronger shadow

---

## 📥 Form Elements

### Input Field
```tsx
<div className="space-y-2">
  <label className="label">Email Address</label>
  <input 
    type="email" 
    placeholder="you@example.com"
    className="input"
  />
</div>
```

### Textarea
```tsx
<textarea 
  className="input min-h-[120px] resize-none"
  placeholder="Enter your message..."
  rows={5}
/>
```

### Select Dropdown
```tsx
<select className="input">
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</select>
```

### Toggle Switch
```tsx
<button
  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
    enabled ? 'bg-primary-600' : 'bg-gray-300'
  }`}
>
  <span
    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
      enabled ? 'translate-x-6' : 'translate-x-1'
    }`}
  />
</button>
```

---

## 🎭 Icons

Using **Lucide React** icons:

### Common Icons
```tsx
import { 
  Sparkles,      // Brand/magic
  Zap,           // Speed/power
  ImageIcon,     // Images
  User,          // Profile
  Settings,      // Settings
  Download,      // Download
  Upload,        // Upload
  Trash2,        // Delete
  Copy,          // Clone
  CheckCircle2,  // Success
  Clock,         // Time
  Calendar,      // Dates
  Eye,           // View
  Heart,         // Favorite
  TrendingUp,    // Growth
  ArrowRight,    // Navigation
} from 'lucide-react'
```

### Icon Sizes
```tsx
// Small
<Icon className="h-4 w-4" />

// Medium (default)
<Icon className="h-5 w-5" />

// Large
<Icon className="h-6 w-6" />

// Extra large
<Icon className="h-8 w-8" />
```

---

## ✨ Animations

### Entrance Animations
```tsx
// Fade in
<div className="animate-fade-in">Content</div>

// Slide up
<div className="animate-slide-up">Content</div>

// Slide down
<div className="animate-slide-down">Content</div>

// Slide in from right
<div className="animate-slide-in-right">Content</div>
```

### Continuous Animations
```tsx
// Floating element
<div className="animate-float">Floating</div>

// Gentle bounce
<div className="animate-bounce-gentle">Bouncing</div>

// Slow pulse
<div className="animate-pulse-slow">Pulsing</div>

// Spinning
<RefreshCw className="animate-spin" />
```

### Gradient Animations
```tsx
// Horizontal gradient animation
<div className="bg-gradient-to-r from-primary-500 to-secondary-500 animate-gradient-x">

// Vertical gradient animation
<div className="bg-gradient-to-b from-primary-500 to-secondary-500 animate-gradient-y">

// Multi-directional
<div className="bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 animate-gradient-xy">
```

### Hover Animations
```tsx
// Scale up
<div className="hover:scale-105 transition-transform">

// Translate
<div className="hover:-translate-y-2 transition-all">

// Shadow
<div className="hover:shadow-2xl transition-shadow">

// Combined
<div className="hover:scale-105 hover:shadow-xl transition-all duration-300">
```

---

## 🎯 Spacing System

### Padding & Margin
```
p-2  : 8px
p-4  : 16px
p-6  : 24px
p-8  : 32px
p-12 : 48px
```

### Gap (for Flexbox/Grid)
```
gap-2 : 8px
gap-4 : 16px
gap-6 : 24px
gap-8 : 32px
```

### Standard Component Spacing
```tsx
// Card padding
<div className="card p-6">  // or p-8 for larger cards

// Section padding
<section className="py-20 md:py-32">

// Container spacing
<div className="space-y-6">  // vertical spacing between children
<div className="space-x-4">  // horizontal spacing between children
```

---

## 📐 Layouts

### Container
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  Centered content with responsive padding
</div>
```

### Grid Layouts
```tsx
// 3-column responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

// 12-column layout
<div className="grid lg:grid-cols-12 gap-8">
  <div className="lg:col-span-3">Sidebar</div>
  <div className="lg:col-span-9">Main</div>
</div>
```

### Flex Layouts
```tsx
// Centered
<div className="flex items-center justify-center">

// Space between
<div className="flex items-center justify-between">

// Column
<div className="flex flex-col gap-4">
```

---

## 🎨 Special Effects

### Glass Morphism
```tsx
<div className="bg-white/80 backdrop-blur-md border border-gray-200">
  Semi-transparent card with blur
</div>
```

### Gradient Text
```tsx
<span className="gradient-text">
  Text with gradient
</span>

// Or custom:
<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
  Custom gradient text
</span>
```

### Glow Effect
```tsx
<div className="animate-glow rounded-xl">
  Glowing container
</div>
```

### Shimmer Effect
```tsx
<div className="relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-shine animate-shimmer" />
  Content
</div>
```

---

## 📱 Responsive Breakpoints

### Mobile First Approach
```tsx
// Start with mobile, then add larger breakpoints
<div className="
  text-2xl           // Mobile (default)
  md:text-3xl        // Tablet (768px+)
  lg:text-4xl        // Desktop (1024px+)
  xl:text-5xl        // Large desktop (1280px+)
">
  Responsive text
</div>
```

### Hide/Show at Breakpoints
```tsx
// Show on mobile, hide on desktop
<div className="block md:hidden">Mobile only</div>

// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only</div>
```

---

## ♿ Accessibility

### Focus States
```tsx
// All interactive elements should have focus states
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
  Accessible Button
</button>
```

### Color Contrast
- Ensure text has at least 4.5:1 contrast ratio
- Use gray-600 or darker for body text
- Use gray-500 for secondary text
- White text requires dark backgrounds (600+ shade)

### Keyboard Navigation
- All interactive elements should be keyboard accessible
- Proper tab order
- Skip links for navigation

---

## 🎯 Best Practices

### Do's ✅
- Use semantic HTML elements
- Maintain consistent spacing
- Follow the color palette
- Add hover states to interactive elements
- Use animations sparingly
- Test on multiple devices
- Ensure proper contrast
- Add loading states

### Don'ts ❌
- Don't mix too many gradients
- Don't use animations longer than 500ms
- Don't ignore mobile breakpoints
- Don't forget focus states
- Don't use colors outside the palette
- Don't nest gradients excessively
- Don't skip accessibility features

---

## 🔍 Examples

### Feature Card
```tsx
<div className="card-gradient p-8 group hover:-translate-y-2 transition-all duration-300">
  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
    <Zap className="h-7 w-7 text-white" />
  </div>
  <h3 className="text-2xl font-bold text-gray-900 mb-3">Feature Title</h3>
  <p className="text-gray-600 leading-relaxed">
    Feature description goes here
  </p>
</div>
```

### Stat Card
```tsx
<div className="card-gradient p-6 group hover:-translate-y-1 transition-all">
  <div className="flex items-center justify-between mb-4">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
      <ImageIcon className="h-6 w-6 text-white" />
    </div>
  </div>
  <p className="text-sm font-medium text-gray-600 mb-1">Total Generated</p>
  <p className="text-3xl font-bold gradient-text">1,234</p>
</div>
```

### Hero Section
```tsx
<section className="relative overflow-hidden py-20 md:py-32">
  {/* Animated background */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 opacity-50" />
  
  {/* Floating orbs */}
  <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
  
  {/* Content */}
  <div className="relative max-w-7xl mx-auto px-4 text-center">
    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6">
      Your <span className="gradient-text">Amazing</span> Headline
    </h1>
    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
      Subheadline goes here
    </p>
    <button className="btn btn-primary btn-lg">
      Get Started
    </button>
  </div>
</section>
```

---

## 🎨 Design Tokens Summary

```javascript
// Copy this into your design tool or documentation

const tokens = {
  colors: {
    primary: '#0284c7',
    secondary: '#c026d3',
    accent: '#ea580c',
  },
  
  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
  },
  
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
    xl: '0 20px 25px rgba(0,0,0,0.15)',
  },
}
```

---

This style guide ensures consistency across the entire ThumbnailAI application. Refer to it when creating new components or pages!

