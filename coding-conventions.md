# Code Conventions

This document defines the coding conventions used in this repository to ensure the codebase stays consistent, readable, and maintainable.

---

# 1. General Principles

- Write clear and readable code.
- Follow consistent naming conventions.
- Group related files together.
- Keep frontend and backend structures organized.
- Use consistent formatting and brace styles.

---

# 2. Brace Style

Functions and methods follow this format:

```ts
methodName() {
}
```

This style should be used consistently across the project.

---

# 3. Naming Conventions

## 3.1 camelCase

Used for:
- variables
- methods
- functions

camelCase means:
- first word starts lowercase
- each next word starts with uppercase
- no spaces

Examples:

```ts
userName
setErrors
handleLogin
```

## 3.2 PascalCase

Used for:
- React components
- TSX file names

PascalCase means:
- every word starts with uppercase
- no spaces

Examples:

```
FieldLabel.tsx
Input.tsx
LoadingSpinner.tsx
```

## 3.3 kebab-case

Used for:
- CSS `className` values in React
- folder names which contain pages

kebab-case means:
- lowercase letters
- words separated by hyphens


# 4. Folder Structure

The application is separated into **Pages** and **Components**.

---

# 4.1 Pages

Inside the `app` folder, every page has its own folder.

Each page folder contains:

- the TSX file (which must ALWAYS be named `page.tsx`)

# 4.2 Components

All components must be stored in the `components` folder in the root directory.

Structure:

```
app/
├── api
├── approval/
│   └── page.tsx
├── approval-request/
│   └── page.tsx
│
├── components
│   └──basics/
│      └──FieldLabel.tsx

```

### Rules

Page folder names → **kebab-case**

```
approval-request
forward-to-recruiter
job-description
```

tsx file names → **PascalCase**

```
FieldLabel.tsx
SegmentedControl.tsx
```

Component folder → **kebab-case**

```
NavBar
Footer
ProjectCard
```

Component tsx file → **PascalCase**

```
FieldInput.tsx
SegmentedControl.tsx

```

# 6. React Component Example

Example of a correctly structured component:

```tsx
import "./navbar.css";

function NavBar(){
    return (
        <nav className="nav-bar">
            <div className="nav-links">
                <a href="/">Home</a>
                <a href="/about">About</a>
            </div>
        </nav>
    );
}

export default NavBar;


# 11. Final Rule

Always follow the conventions described above to keep the project consistent and easy to maintain.