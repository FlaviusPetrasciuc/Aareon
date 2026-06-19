# Aareon Recruiter Intake Agent

An AI-powered recruiter intake agent that helps hiring managers generate professional Job Descriptions and Hiring Kits through a structured interview process.

## Key Features

- **Generative Intake Wizard**: Sophic Brutalist UI for answering intake questions.
- **Multi-Provider Support**: Supports Anthropic (Claude), OpenAI (GPT), Google (Gemini), and OpenRouter.
- **Sophic Brutalism Design**: High-contrast, grid-based aesthetic with editorial typography.
- **Live Markdown Preview**: Real-time drafting of JDs and technical assessments.
- **Session Persistence**: Progress is automatically saved locally.

## Configuration

The agent dynamically detects your AI provider based on environment variables in `.env.local`.

### 1. Set up Environment Variables
Copy the template below into your `.env.local` file:

```bash
# --- ANTHROPIC (Claude) ---
# ANTHROPIC_API_KEY=your_key
# ANTHROPIC_MODEL=claude-3-5-sonnet-20240620

# --- OPENAI (GPT) ---
# OPENAI_API_KEY=your_key
# OPENAI_MODEL=gpt-4o

# --- GOOGLE (Gemini) ---
# GOOGLE_GENERATIVE_AI_API_KEY=your_key
# GOOGLE_MODEL=gemini-1.5-pro

# --- OPENROUTER (Universal) ---
# OPENROUTER_API_KEY=your_key
# OPENAI_MODEL=anthropic/claude-3.5-sonnet
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start an intake session.

## Design Language: Sophic Brutalism
This project implements a unique visual style characterized by:
- **Bold Black Borders**: Solid 2px-4px strokes on all containers.
- **Geometric Rigidity**: Square corners and strict grid alignment.
- **Editorial Typography**: A mix of Playfair Display (Serif/Italic) and IBM Plex Mono (Technical).
- **High Contrast**: Aareon Headline (#081326) on Sand (#F5F2ED).

## Project Structure
- `/app`: Next.js 14 App Router and API routes.
- `/components`: Sophic Brutalist UI components (Wizard, Preview, Cards).
- `/lib`: Session management and export logic.
- `/types`: TypeScript definitions for the intake flow.

## Developer Setup Guide (Develop Branch)
**Prerequisites**
- Node.js (v18 or higher)
- npm (comes with Node.js)
- A code editor (VS Code recommended)

## Clone & Install
git clone https://github.com/FlaviusPetrasciuc/Aareon.git
cd Aareon
npm install

## Authentication
This branch uses a simple email-based login — no password, no database, no Supabase required.

On the sign in page, the user enters their email address. The system checks it against a hardcoded list of allowed emails defined in lib/aareonAccess.ts. If the email matches, the user is granted access and redirected to the intake wizard. If it does not match, an error is shown.

## Adding or Removing Allowed Emails
Open lib/aareonAccess.ts and edit the ALLOWED_EMAILS array:
    const ALLOWED_EMAILS = [
    "niels.benjamins@aareon.nl",
    "roy.boelens@aareon.nl",
    "marcel.vrieling@aareon.nl",
    // add or remove emails here
    ];

All emails must end in @aareon.nl. After editing the file, save it — no restart required in development mode.

## Environment Variables
Create a .env.local file in the project root. No Supabase keys are needed for this branch — only the AI and email keys:
    # SMTP (for sending emails to recruiter)
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your-email@gmail.com
    SMTP_PASS=your-app-password

    # AI (for job description generation)
    ANTHROPIC_API_KEY=your-anthropic-key
    ANTHROPIC_MODEL=claude-sonnet-4-6

## No Database Required
This branch does not use a database. All session data (manager email, form inputs, AI-generated job description) is stored in the browser's localStorage. This means:
- Data persists across page refreshes within the same browser session
- Data is lost if the user clears their browser storage or switches browsers
- No backend setup is needed beyond running npm run dev

## Common Issues
**"Please enter a valid email address" on the login page**
→ The email is not in the ALLOWED_EMAILS list in lib/aareonAccess.ts. Add it there.

**Environment variables not loading**
→ Make sure .env.local is in the project root (same level as package.json) and restart the dev server.

**Form data lost after closing the browser**
→ This is expected — data is stored in localStorage and does not persist across browser sessions.