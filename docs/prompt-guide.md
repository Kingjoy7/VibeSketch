# VibeSketch — Prompt Writing Guide

## ✦ The Anatomy of a Great Prompt

A good VibeSketch prompt has 3 parts:

```
[What to build] + [Key components] + [Visual style]
```

**Example:**
```
Create a login page [WHAT]
with email field, password field, and a sign in button [COMPONENTS]
using a dark background and pink gradient button [STYLE]
```

---

## 🟢 STARTER PROMPTS (Copy & Use)

### Login / Auth
```
Create a beautiful login page with email and password fields,
a "Sign In" button with a gradient, a "Forgot Password" link,
and social login buttons for Google and GitHub.
Use a dark background with subtle animated blobs.
```

### Dashboard
```
Build an analytics dashboard with a dark sidebar navigation,
4 stat cards showing revenue, users, orders, and rating,
a bar chart section, and a recent orders table.
Use a dark theme with colorful gradient accents.
```

### Landing Page
```
Design a SaaS landing page with a sticky navigation bar,
a large hero section with headline and CTA buttons,
a 6-feature grid with icons and descriptions,
and a footer. Use a dark background with gradient text.
```

### Pricing Table
```
Create a pricing page with 3 plans: Free ($0), Pro ($29), Enterprise ($99).
Each card should have a list of 5-6 features, a CTA button, and
a "Most Popular" badge on the middle plan.
Use glass morphism card style on dark background.
```

### E-Commerce Product Card
```
Make a product card component with an image placeholder,
product name, price, star rating (4.5/5), color swatches,
size selector, and "Add to Cart" button with quantity selector.
```

### Music Player
```
Build a dark-themed music player UI with album art placeholder,
song title and artist name, a progress bar with timestamps,
and playback controls (previous, play/pause, next, shuffle, repeat).
Add a volume slider and a playlist sidebar.
```

### Settings Page
```
Create a settings page with a sidebar showing: Profile, Account,
Notifications, Privacy, Billing, and Help sections.
The main area should show a profile settings form with
avatar upload, name, email, and bio fields.
Use a clean dark theme.
```

### Contact Form
```
Design a contact form page with fields for name, email,
subject (dropdown), message (textarea), and a submit button.
Include a left side panel with company contact info, address,
phone, and social media icons. Use card-style layout.
```

---

## 🔄 REFINEMENT PROMPTS (After First Generation)

### Layout Changes
- `"Add a sticky navigation bar at the top"`
- `"Move the sidebar to the left side"`
- `"Make it a two-column layout"`
- `"Add a mobile hamburger menu"`

### Style Changes
- `"Change the theme to completely dark"`
- `"Make it light/white theme instead"`
- `"Use a purple and blue gradient color scheme"`
- `"Make all buttons pill-shaped (fully rounded)"`
- `"Add glassmorphism effect to the cards"`

### Component Additions
- `"Add a success toast notification at the top right"`
- `"Add a loading spinner animation"`
- `"Include a search bar in the header"`
- `"Add pagination at the bottom of the table"`

### Typography & Spacing
- `"Make the heading much larger and bolder"`
- `"Add more whitespace between sections"`
- `"Increase the font size throughout"`
- `"Make the body text slightly lighter grey"`

### Interactivity
- `"Add hover animations to all cards"`
- `"Make the form validate email format on submit"`
- `"Add a password strength indicator"`
- `"Make the navigation links scroll to sections"`

---

## ⚠️ PROMPT TIPS & TRICKS

| ✅ DO | ❌ DON'T |
|-------|---------|
| Be specific about components | Say just "make a nice UI" |
| Mention colors and theme | Assume AI knows your preference |
| List each section separately | Write one long unstructured sentence |
| Say "dark theme" or "light theme" | Leave style completely unspecified |
| Mention interactions you want | Expect AI to add complex backend |

---

## 💡 ADVANCED TECHNIQUE: Layered Prompting

Start simple, then add complexity:

**Round 1:**
```
Create a dashboard with a sidebar and stats cards
```

**Round 2 (Refine):**
```
Add a bar chart below the stats cards showing monthly revenue
```

**Round 3 (Refine):**
```
Make the sidebar collapsible with a toggle button,
and add a dark/light mode toggle in the header
```

**Round 4 (Refine):**
```
Add a notification bell icon in the header with a dropdown
showing 3 recent notifications with read/unread states
```

This layered approach gives you much more control than trying to describe everything at once.

---

*VibeSketch Prompt Guide · 2025*
