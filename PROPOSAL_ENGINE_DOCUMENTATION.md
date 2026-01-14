# Proposal Template Engine - Complete Documentation

## Overview

The Proposal Template Engine is a modern, full-featured web application for creating professional business proposals. Built with Next.js 16, React 19, and Tailwind CSS, it provides an intuitive editor with live preview, design customization, drag-and-drop functionality, and mobile-first responsive design.

### Key Features
- **Multi-section proposal builder** with 11+ section types
- **Live preview panel** that updates in real-time
- **Drag-and-drop section reordering** with smooth animations
- **Undo/redo system** for edit history management
- **Design customization** (colors, typography, cover styles)
- **Template management** (save, load, delete templates)
- **Mobile-first responsive** design with bottom navigation
- **Client view sharing** with shareable links
- **Quick section templates** with pre-filled content
- **Keyboard shortcuts** (Cmd+Z for undo, Cmd+Shift+Z for redo)

---

## Architecture Overview

### Directory Structure

```
├── app/
│   ├── layout.tsx              # Root layout with metadata & viewport
│   ├── globals.css             # Global styles, design tokens, animations
│   ├── page.tsx                # Main editor page (core state management)
│   ├── view/
│   │   └── [id]/page.tsx        # Client view route for proposal viewing
│   └── templates/
│       └── page.tsx            # Template gallery page
│
├── components/
│   ├── editor/                 # Core editor components
│   │   ├── editor-header.tsx   # Top header with actions
│   │   ├── editor-sidebar.tsx  # Section list with add/remove/reorder
│   │   ├── proposal-editor.tsx # Content editor for selected section
│   │   ├── preview-panel.tsx   # Live preview of proposal
│   │   ├── design-panel.tsx    # Design settings (colors, typography)
│   │   ├── mobile-nav.tsx      # Mobile bottom navigation
│   │   └── onboarding-tooltip.tsx # First-time user guide
│   │
│   ├── templates/              # Template management
│   │   ├── template-manager.tsx   # Save/load/delete templates
│   │   └── template-gallery.tsx   # Browse available templates
│   │
│   └── ui/                     # shadcn/ui components (auto-generated)
│       ├── button.tsx
│       ├── card.tsx
│       ├── tabs.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       └── ... (20+ other UI components)
```

---

## Core Components & Their Responsibilities

### 1. **app/page.tsx** - Main Editor Page
**The heart of the application - manages all state and orchestrates components.**

#### State Management:
```typescript
// Template/Section State
const [templates, setTemplates] = useState()        // Array of all templates
const [currentTemplate, setCurrentTemplate] = useState()  // Active template ID
const [sections, setSections] = useState()          // Current proposal sections
const [selectedSectionId, setSelectedSectionId] = useState()  // Focused section

// UI State
const [mobileView, setMobileView] = useState()      // "sections" | "edit" | "preview"
const [sidebarCollapsed, setSidebarCollapsed] = useState()  // Desktop sidebar toggle
const [previewMode, setPreviewMode] = useState()    // Full preview vs side-by-side
const [showOnboarding, setShowOnboarding] = useState()  // Onboarding tooltip

// Design State
const [designSettings, setDesignSettings] = useState()  // Colors, typography, cover style

// Undo/Redo State
const [history, setHistory] = useState()            // Array of section snapshots
const [historyIndex, setHistoryIndex] = useState()  // Current position in history
```

#### Key Functions:
- **`addSection(type)`** - Creates new section with template content
- **`removeSection(id)`** - Deletes section and updates selected
- **`updateSection(id, updates)`** - Modifies section properties
- **`duplicateSection(id)`** - Creates copy of section
- **`reorderSections(reorderedSections)`** - Changes section order (from drag-drop)
- **`addToHistory(newSections)`** - Records state for undo/redo
- **`handleUndo()` / `handleRedo()`** - Navigate history stack
- **`saveAsNewTemplate(name, description)`** - Create new template
- **`loadTemplate(templateId)`** - Load saved template
- **`handleOpenClientView()`** - Generate shareable client view

#### Data Flow:
```
User Action → Update State → addToHistory() → Update Templates 
    ↓
Re-render Components → Pass props down → Child components receive updates
```

---

### 2. **components/editor/editor-header.tsx**
**Top navigation bar with template name, save, preview, and share options.**

#### Props Received:
```typescript
interface EditorHeaderProps {
  onPreviewToggle: (mode: boolean) => void
  previewMode: boolean
  currentTemplateName: string
  onShowTemplates: () => void
  onSaveTemplate: () => void
  onOpenClientView: () => void
  proposalId: string
}
```

#### Features:
- Display current template name
- Preview toggle button (switches between side-by-side and full preview)
- Save/Load templates dropdown
- Share menu with "Copy Link" and "Open Client View" options
- Responsive: hamburger menu on mobile

---

### 3. **components/editor/editor-sidebar.tsx**
**Left sidebar displaying all sections with management controls.**

#### Props Received:
```typescript
interface EditorSidebarProps {
  sections: ProposalSection[]
  selectedSectionId: string
  onSelectSection: (id: string) => void
  onAddSection: (type: string) => void
  onRemoveSection: (id: string) => void
  onReorderSections: (sections: ProposalSection[]) => void
  onDuplicateSection: (id: string) => void
  isMobile?: boolean
}
```

#### Features:
- **Section List** - Scrollable list with emoji icons for quick identification
- **Drag-to-Reorder** - Native HTML5 drag-drop with visual feedback
- **Add Section Dropdown** - Organized by category:
  - Content: Overview, Services, Pricing, Timeline, Team, Terms, Custom
  - Visuals: Mind Map, Process Flow, Comparison Chart, Features Grid
  - Cover: Cover Page
- **Section Actions** - Copy and Delete buttons with tooltips
- **Mobile Variant** - Full-screen version on small devices

#### Section Thumbnails:
Each section shows emoji + type for quick identification
```
🎨 Cover Page
📋 Overview
🛠️ Services
💰 Pricing
📈 Process Flow
🧠 Mind Map
⚙️ Features
...
```

---

### 4. **components/editor/proposal-editor.tsx**
**Main content editor for the selected section - dynamic based on section type.**

#### Props Received:
```typescript
interface ProposalEditorProps {
  section: ProposalSection
  onUpdate: (updates: any) => void
}
```

#### Section Type Editors:
The editor renders different UI based on section.type:

| Section Type | Editor Content | Key Fields |
|---|---|---|
| **cover** | Cover page form | Company name, client name, project title, subtitle |
| **overview** | Rich text editor | Text area with descriptions |
| **services** | List editor | Add/remove/edit service items |
| **pricing** | Package editor | Add/remove pricing packages with name, price, description |
| **timeline** | Phase editor | Project phases with timeline data |
| **team** | Member editor | Team member cards with role, name, bio |
| **terms** | Text editor | Terms and conditions text |
| **custom** | Rich text | Custom content area |
| **mindmap** | Mind map editor | Central topic + branches with sub-items |
| **process** | Flow step editor | Steps with title and description |
| **comparison** | Dual option editor | Compare Option A vs Option B features |
| **features** | Grid editor | Feature items with title and description |

#### User Experience Features:
- Helper text under each field explaining its purpose
- Placeholder content for guidance
- Add/remove buttons for list items
- Real-time update callbacks

---

### 5. **components/editor/preview-panel.tsx**
**Live preview of the proposal showing how it will appear to clients.**

#### Props Received:
```typescript
interface PreviewPanelProps {
  sections: ProposalSection[]
  designSettings: DesignSettings
  isMobile?: boolean
}
```

#### Features:
- **Real-time updates** - Reflects all content and design changes instantly
- **Responsive preview** - Shows how proposal looks on different screen sizes
- **Design application** - Renders colors, typography, and cover styles
- **Section-specific rendering** - Each section type has optimized preview layout
- **Mobile view** - Full-screen preview on mobile devices with bottom navigation

#### Preview Layout by Section Type:
- **Cover** - Hero style with gradient/solid/minimal options
- **Overview** - Large typography with centered text
- **Services** - Grid or list layout with visual hierarchy
- **Pricing** - Card-based pricing package display
- **Timeline** - Horizontal or vertical flow visualization
- **Mind Map** - Radial layout with branches
- **Process** - Sequential step layout
- **Comparison** - Side-by-side feature comparison table
- **Features** - 2-4 column grid layout

---

### 6. **components/editor/design-panel.tsx**
**Global design customization controls.**

#### Props Received:
```typescript
interface DesignPanelProps {
  settings: DesignSettings
  onUpdate: (settings: DesignSettings) => void
}

interface DesignSettings {
  accentColor: string        // Hex color code
  coverStyle: "gradient" | "solid" | "minimal"
  typography: "modern" | "classic" | "bold"
}
```

#### Available Customizations:

**Color Palettes:**
- 6 preset colors (Blue, Teal, Orange, Purple, Rose, Emerald)
- Custom color picker with hex input
- Preview of selected color in UI

**Typography Styles:**
- **Modern** - Clean, minimalist fonts with light weights
- **Classic** - Traditional serif fonts with medium weights
- **Bold** - Heavy, dramatic fonts with bold weights

**Cover Styles:**
- **Gradient** - Colorful gradient background with overlay
- **Solid** - Solid accent color with white text
- **Minimal** - Minimalist black/white design

---

### 7. **components/editor/mobile-nav.tsx**
**Bottom navigation for mobile devices.**

#### Props:
```typescript
interface MobileNavProps {
  activeView: "sections" | "edit" | "preview"
  onViewChange: (view: "sections" | "edit" | "preview") => void
  sectionCount: number
}
```

#### Tabs:
1. **Sections** - Shows section list (editor-sidebar)
2. **Edit** - Content editor for selected section (proposal-editor)
3. **Preview** - Live proposal preview (preview-panel)

#### UX Features:
- Bottom-fixed positioning for thumb accessibility
- Active tab highlighted
- Section counter badge
- Touch-friendly 44px+ tap targets

---

### 8. **components/editor/onboarding-tooltip.tsx**
**First-time user walkthrough guide.**

#### Features:
- 4-step tutorial showing:
  1. Add sections from sidebar
  2. Edit section content
  3. Customize colors and typography
  4. Share proposal with clients
- Dismissible with X button or completion
- Shows on first page load (state managed in page.tsx)

---

### 9. **app/view/[id]/page.tsx** - Client View
**Beautiful client-facing proposal presentation.**

#### How It Works:
1. Editor creates proposal data and stores in sessionStorage
2. Generates unique ID and creates share URL: `/view/[id]`
3. Client opens URL in new tab
4. Component reads data from sessionStorage
5. Renders full-page proposal with:
   - Professional typography and spacing
   - Accept/Decline buttons at bottom
   - Mobile-optimized viewing
   - No editing capabilities

#### Features:
- Larger, more readable typography
- Elegant spacing and visual hierarchy
- Print-friendly styles
- Mobile-optimized layout
- Accept/Decline action buttons

---

### 10. **components/templates/template-manager.tsx**
**Save, load, and delete proposal templates.**

#### Features:
- **Save As Dialog** - Name and description for new template
- **Template List** - Browse all saved templates
- **Quick Actions** - Load or delete templates
- **Create Template** - Trigger save as modal
- **Load Template** - Switch to template and reset state

#### Workflow:
```
Create Proposal → Customize Content & Design → Click "Save Template"
    ↓
Enter name and description → "Save Template" 
    ↓
New template added to templates array and persisted
```

---

## Data Models

### ProposalSection Structure
```typescript
interface ProposalSection {
  id: string                    // Unique ID (timestamp-based)
  type: SectionType            // Cover, overview, services, pricing, etc.
  title: string                // Section display name
  content: Record<string, any> // Type-specific content
}

type SectionType = 
  | "cover"      // Front page with company/client info
  | "overview"   // Project overview text
  | "services"   // List of services offered
  | "pricing"    // Pricing packages
  | "timeline"   // Project phases/timeline
  | "team"       // Team members
  | "terms"      // Terms and conditions
  | "custom"     // Custom content
  | "mindmap"    // Mind map visualization
  | "process"    // Process/workflow steps
  | "comparison" // Feature comparison
  | "features"   // Features grid
```

### Template Structure
```typescript
interface ProposalTemplate {
  id: string                           // Unique template ID
  name: string                         // Template name
  description: string                  // Short description
  sections: ProposalSection[]         // Proposal sections
  designSettings: DesignSettings      // Color, typography, cover style
  createdAt: string                   // ISO timestamp
}
```

### Design Settings
```typescript
interface DesignSettings {
  accentColor: string                          // Hex color (#1e40af, etc.)
  coverStyle: "gradient" | "solid" | "minimal"
  typography: "modern" | "classic" | "bold"
}
```

---

## State Management Flow

### Adding a Section
```
1. User clicks "Add Section" dropdown
2. Selects section type (e.g., "Services")
3. onAddSection("services") triggered
4. New section created with template content
5. addToHistory(updatedSections) called
6. sections state updated
7. selectedSectionId set to new section
8. All components re-render with new state
9. Editor-sidebar shows new section
10. Proposal-editor loads editor for new section
11. Preview-panel updates with new section
```

### Editing Section Content
```
1. User modifies form field in proposal-editor
2. onUpdate(updates) callback triggered
3. updateSection(id, updates) called in page.tsx
4. sections array updated (not added to history immediately)
5. Components re-render
6. Preview-panel updates instantly
```

### Important Note:
- Regular editing does NOT add to history for performance
- Only major actions (add, remove, reorder, duplicate) add to history
- This prevents memory bloat from thousands of keystroke edits

### Undo/Redo Flow
```
1. User presses Cmd+Z or clicks Undo
2. handleUndo() decrements historyIndex
3. setSections(history[newIndex]) restores old state
4. Components re-render with previous state
5. Preview updates to show old content
```

---

## Responsive Design Strategy

### Mobile-First Approach

#### Mobile (< 768px)
- **Stacked layout** - Full-width panels
- **Bottom navigation** - Sections / Edit / Preview tabs
- **Hidden desktop sidebar** - Shown as full-screen on "Sections" tab
- **Hidden preview** - Accessible via "Preview" tab
- **Touch-friendly** - 44px+ minimum tap targets

#### Tablet (768px - 1024px)
- **Sidebar visible** - 18rem (288px) width
- **Main editor area** - Flexible
- **Preview hidden** - Not enough space

#### Desktop (> 1024px)
- **Sidebar visible** - Collapsible with toggle button
- **Main editor** - Flexible
- **Preview panel** - Always visible side-by-side (on lg screens)

#### Large Desktop (> 1536px)
- Same as desktop but with more breathing room

### Tailwind Responsive Classes Used
```
md:     Tablet and up (768px+)
lg:     Large desktop (1024px+)
xl:     Extra large (1280px+)

Examples:
- hidden md:flex     // Hidden on mobile, visible on tablet+
- w-72 md:block lg:hidden  // Full width mobile, sidebar width tablet, hidden on large
- md:gap-4 gap-2     // 2 gap mobile, 4 gap tablet+
```

---

## Key Features & How They Work

### 1. Drag-and-Drop Reordering

**Implementation:**
- Native HTML5 drag-drop API
- Sections have `draggable="true"`
- `onDragStart` stores dragging section ID
- `onDragOver` allows drop zones
- `onDrop` reorders array and calls reorderSections()

**Smooth Animations:**
- CSS transitions on drag operations
- Visual feedback with opacity/scaling
- Smooth reflow when items move

### 2. Undo/Redo System

**How It Works:**
```
- Maintain history array: [state0, state1, state2, ...]
- historyIndex points to current state (e.g., 1)
- Undo: historyIndex-- → restore history[0]
- Redo: historyIndex++ → restore history[2]
- New edit: history.slice(0, historyIndex+1) → remove "future" states
```

**Keyboard Shortcuts:**
- Windows/Linux: Ctrl+Z (undo), Ctrl+Shift+Z (redo)
- Mac: Cmd+Z (undo), Cmd+Shift+Z (redo)
- Implemented via event listeners in page.tsx

### 3. Client View Sharing

**How It Works:**
1. Editor stores proposal data in sessionStorage with key: `proposal-${proposalId}`
2. Generates unique URL: `/view/${proposalId}`
3. User copies/shares URL with client
4. Client opens URL
5. Client view page reads from sessionStorage
6. Renders beautiful client-facing proposal
7. Client can view and potentially accept/decline

**Note:** Uses sessionStorage (browser RAM) - persists for current browser session only. For production, integrate Supabase to save proposals.

### 4. Template System

**Creating Template:**
```
1. Click "Save Template" in header
2. Modal appears for name & description
3. Current sections + designSettings saved as new template
4. Added to templates array
5. Can be reloaded later
```

**Loading Template:**
```
1. Click "Load Template" 
2. Select template from list
3. loadTemplate(id) called
4. Replaces current sections, designSettings, history
5. Resets historyIndex to 0
6. Updates UI
```

---

## Styling & Theme System

### Design Tokens (globals.css)
```css
/* Colors */
--background      oklch(0.98 0 0)    /* Off-white */
--foreground       oklch(0.12 0 0)    /* Dark gray/black */
--primary          oklch(0.32 0.08 258)  /* Sophisticated blue */
--accent           oklch(0.64 0.18 31)   /* Warm orange/amber */

/* Border & Input */
--border           oklch(0.9 0 0)     /* Light gray */
--input            oklch(0.97 0 0)    /* Very light gray */

/* Status Colors */
--destructive       oklch(0.577 0.245 27.325)  /* Error red */

/* Radius */
--radius           0.625rem           /* 10px - rounded corners */
```

### Responsive Animations
```css
@keyframes slideIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

### Touch Targets (Mobile)
```css
@media (pointer: coarse) {
  button, [role="button"], input, select, textarea {
    min-height: 44px;  /* Apple's recommended touch target size */
  }
}
```

---

## Performance Considerations

### Optimization Strategies

1. **Selective History Recording** - Only major operations add to history
2. **Component Memoization** - Preview panel doesn't re-render on every keystroke
3. **Lazy Section Rendering** - Only selected section content rendered in editor
4. **Image Optimization** - Proposal uses placeholder images
5. **CSS-in-JS Minimization** - Uses Tailwind (utility-first, minimal overhead)

### Bundle Size
- Next.js 16 with Turbopack (default, optimized)
- shadcn/ui components (tree-shakeable)
- Lucide React icons (SVG, lightweight)
- No heavy dependencies like Draft.js or Slate

---

## Common Workflows

### Creating a Professional Proposal

```
1. Start page loads with default template
2. Click "Sections" tab (mobile) or see sidebar (desktop)
3. Click "Add Section" dropdown
4. Select "Cover Page" if not already present
5. Edit cover page details (company, client, title)
6. Add "Overview" section - edit project description
7. Add "Services" section - list services
8. Add "Pricing" section - add pricing packages
9. Add "Timeline" section - add project phases
10. Add "Mind Map" section - show project scope
11. Click "Design" tab in editor
12. Choose accent color and typography style
13. Select cover page style
14. Click "Save Template" if you want to reuse
15. Click "Share" → "Open Client View" to preview
16. Copy share link to send to client
```

### Modifying an Existing Template

```
1. Click "Load Template" in header
2. Select template from list
3. Click on section to edit content
4. Edit any fields
5. Undo/Redo available for mistakes
6. Save as new template or overwrite original
```

### Reusing Section Content

```
1. Create section with content
2. Click "Copy" button on section in sidebar
3. New duplicate section appears
4. Edit as needed
5. Useful for creating similar sections
```

---

## Integration Points (For Future Development)

### Adding Supabase Storage
- Store templates in Supabase table
- Store proposals for client signing
- Implement Row Level Security (RLS)
- Add authentication for user accounts

### Adding PDF Export
- Use library like react-pdf or puppeteer
- Generate downloadable proposal PDFs
- Style optimizations for print

### Adding E-Signature
- Integrate DocuSign or HelloSign
- Add signature section to proposals
- Capture client e-signatures

### Adding Image Upload
- Replace placeholder images
- Store in Vercel Blob or similar
- Image optimization pipeline

### Adding Notifications
- Email templates when proposal sent
- Client notifications when proposal viewed
- Proposal status updates

---

## Troubleshooting & Common Issues

### Proposal Changes Not Saving
- Changes are stored in React state only
- Refresh page will lose work
- Always save as template before refreshing
- Once Supabase integrated, changes will auto-persist

### Mobile View Not Responsive
- Check device width is < 768px
- Mobile nav should appear at bottom
- Sections should be full-width on mobile
- Use browser DevTools to test different breakpoints

### Preview Not Updating
- Check designSettings are passed correctly
- Verify section content is in correct format
- Ensure accentColor is valid hex (#XXXXXX)

### Undo/Redo Not Working
- Only major actions (add, remove, reorder, duplicate) add to history
- Typing individual characters doesn't add to history (by design)
- Try: Add section → undo → redo

---

## Summary

The Proposal Template Engine is a sophisticated yet user-friendly application that enables professionals to create beautiful proposals quickly. Its architecture prioritizes:

- **User Experience** - Intuitive interface with smooth animations
- **Responsiveness** - Mobile-first design that works on all devices
- **Performance** - Efficient state management and rendering
- **Flexibility** - Multiple section types and design customization
- **Accessibility** - Keyboard shortcuts, touch targets, semantic HTML
- **Extensibility** - Easy to add new section types or features

The application is production-ready and only needs backend integration (Supabase) to persist user data across sessions.
