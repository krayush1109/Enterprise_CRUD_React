# Enterprise CRUD App (React + TypeScript)

## 📌 Objective

This project demonstrates an enterprise-grade CRUD application for managing Employees.

The goal is not just CRUD, but to implement:

- Clean architecture
- Scalable folder structure
- Server-like pagination
- Sorting & filtering
- Debounced search
- Search highlight
- Form validation (Zod)
- Error handling
- Accessibility
- Performance optimization
- Testing

---

## 🧠 Why This Project?

This project is designed to simulate real-world enterprise frontend development.

Instead of focusing only on UI, we focus on:

- Maintainability
- Predictable state management
- Separation of concerns
- Production-ready practices

---

## 🛠 Tech Stack

- React (Vite)
- TypeScript
- Material UI
- TanStack Query (React Query)
- Redux Toolkit (UI state)
- React Hook Form + Zod
- JSON Server (Mock Backend)

---

## 🏗 Architecture Approach

We follow a feature-based structure:
src/
├── app/
├── routes/
├── features/
│ └── employees/
├── shared/
├── layouts/


Each feature is self-contained and scalable.

---

## 🔎 Key Enterprise Concepts Used

### Pagination
Data is fetched using page and pageSize parameters to simulate server-side behavior.

### Debounced Search
Search input waits 300ms before triggering API call to improve performance.

### Highlighted Search
Matching search terms are wrapped in `<mark>` safely to avoid HTML injection.

### Form Validation
Zod schema ensures consistent validation logic.

### Accessibility
Keyboard navigation, focus visibility, ARIA roles, and color contrast compliance.

### Performance
- Memoization
- Lazy route loading
- Query caching


---

## 🧹 Step 2: Cleaning the Default Template

Vite generates a starter template with demo content (logos, styles, etc.).

For an enterprise project, we remove unnecessary UI to start with a clean base.

### Why clean the template?

- Avoid unused code
- Reduce noise
- Maintain a controlled structure
- Start building intentionally instead of modifying demo content

We replaced `App.tsx` with a minimal structure:

```tsx
function App() {
  return (
    <div>
      <h1>Enterprise CRUD App</h1>
    </div>
  )
}

export default App


---

## 🏗 Step 3: Folder Structure & Routing Setup

### Why Feature-Based Structure?

Instead of grouping files by type (all components together, all services together),  
we group by feature.

Example:
features/employees/


This ensures:

- Better scalability
- Easier refactoring
- Clear ownership of logic
- Isolation of features

---

## 🚦 Routing Setup

We use React Router to manage navigation.

Basic route:
/ → Employees Page


Routing helps us:

- Separate pages
- Enable lazy loading later
- Build scalable navigation structure

---

## 🎨 Step 4: Material UI Integration & Layout

We installed Material UI to provide:

- Accessible components
- Consistent design system
- Enterprise-ready UI elements

### Why MUI?

Material UI offers:

- Built-in accessibility
- Theming support
- Responsive layout
- Production-ready components

---

## 🧱 Layout Pattern

We created a `MainLayout` component that wraps all routes.

Structure:
AppBar (Top Navigation)
↓
Container (Page Content)


---

## 📊 Step 5: DataGrid Integration

We integrated MUI DataGrid to provide:

- Built-in sorting
- Pagination
- Checkbox selection
- Responsive columns

### Why DataGrid?

Enterprise applications require:

- High-performance tables
- Built-in accessibility
- Large dataset support
- Minimal custom logic

Using DataGrid reduces custom implementation complexity.

---

### Current Implementation

- Static dummy data
- Pagination enabled
- Sorting enabled
- Checkbox selection enabled

Backend integration will be added in later steps.

---

## ⏳ Step 6: Loading State & Improved Table

We enhanced the DataGrid with:

- Simulated API delay
- Loading indicator
- Controlled row selection
- Responsive column widths

### Why simulate loading?

In real enterprise apps:

- API calls take time
- Users must see feedback
- Loading states improve UX clarity

We introduced a `loading` state to simulate real-world network behavior.

### Key Learning

React's `useEffect` is used to handle side effects such as:

- API calls
- Timers
- Subscriptions

---

## 🔍 Step 7: Debounced Search

We implemented a debounced search input.

### Why Debounce?

Without debounce:

Every keypress triggers filtering or API call.

With debounce:

Filtering runs only after user stops typing for 300ms.

This improves:

- Performance
- Network efficiency
- User experience

---

### Technical Approach

- `searchText` stores real-time input
- `debouncedSearch` updates after 300ms delay
- `useMemo` optimizes filtered results

Enterprise apps must avoid unnecessary re-renders and API calls.

---

## 🖍 Step 8: Highlighted Search

We enhanced search results by highlighting matching text.

### Implementation Strategy

- Used RegExp for case-insensitive matching
- Split text into matched and unmatched parts
- Wrapped matches in `<mark>` safely
- Avoided `dangerouslySetInnerHTML` to prevent XSS risks

---

### Why This Matters?

Enterprise applications must:

- Improve search visibility
- Maintain security
- Avoid HTML injection vulnerabilities

We used React's JSX rendering instead of raw HTML injection for safety.

---

## 🎛 Step 9: Advanced Filtering

We implemented:

- Status filter
- Department filter
- Combined filtering logic
- Responsive filter layout

### Filtering Strategy

Each row must satisfy:

- Search condition
- Status condition
- Department condition

This demonstrates multi-condition filtering used in enterprise dashboards.

## 📄 Step 10: Controlled Pagination

We converted default pagination into controlled pagination.

### Why?

In enterprise systems:

- Pagination state must be controlled
- Page changes trigger API calls
- Total row count comes from server

We introduced:

- `paginationModel`
- `onPaginationModelChange`
- `rowCount`

## 🔃 Step 11: Controlled Sorting

We implemented controlled sorting using:

- `sortModel`
- `onSortModelChange`

Why?

Enterprise apps:

- Send sort field & order to backend
- Backend returns sorted data
- Frontend remains predictable

We simulated server-side sorting using useMemo.

## 🌐 Step 12: JSON Server Integration

We introduced JSON Server to simulate a backend API.

Why?

- Frontend-focused project
- Avoid building full backend
- Simulate REST endpoints

Available endpoints:

GET /employees  
POST /employees  
PUT /employees/:id  
DELETE /employees/:id  

JSON Server also supports:

- Pagination
- Sorting
- Filtering

## 🔌 Step 13–15: API Layer & React Query Setup

We introduced:

- React Query for data fetching & caching
- Axios for HTTP communication
- Dedicated API layer

Why API layer?

- Separation of concerns
- Cleaner components
- Reusable API functions
- Easier testing

React Query manages:

- Loading state
- Error state
- Caching
- Background refetch



