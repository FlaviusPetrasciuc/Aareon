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


## Developer Setup Guide (Prototype)
Tech Stack
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Auth & Database: Supabase (cloud-hosted)
- Email: Nodemailer (Gmail SMTP)
- AI Generation: Anthropic API

## Prerequisites
Make sure you have the following installed:
- Node.js (v18 or higher)
- npm (comes with Node.js)
- A code editor (VS Code recommended)

## Clone & Install
```bash
git clone https://github.com/FlaviusPetrasciuc/Aareon.git
cd Aareon
npm install
```

## Supabase Setup
The project uses a shared cloud Supabase project. You do not need to run Supabase locally or use Docker.

## Get Access
Ask a team member to invite you to the Supabase project at supabase.com. You will receive an email invitation — accept it and log in.

## Get Your API Keys
Once you have access:
1. Open the Supabase dashboard and select the project
2. Go to Project Settings (gear icon in the left sidebar)
3. Click API
4. Copy the following values:
    - URL → NEXT_PUBLIC_SUPABASE_URL
    - anon public key → NEXT_PUBLIC_SUPABASE_ANON_KEY
    - service_role key (click Reveal) → SUPABASE_SERVICE_ROLE_KEY

## Environment Variables
Create a .env.local file in the project root:
    NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

    # SMTP (for sending emails to recruiter)
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your-email@gmail.com
    SMTP_PASS=your-app-password

    # AI (for job description generation)
    ANTHROPIC_API_KEY=your-anthropic-key
    ANTHROPIC_MODEL=claude-sonnet-4-6

(Note: Never commit .env.local to Git. It is already in .gitignore.)

## Adding Users (Managers and Directors)
Only users whose email addresses are in the allowed_users table in Supabase can register and log in.

1. How to Add a New User
    - Open the Supabase dashboard
    - Go to SQL Editor
    - Run the following query:
    INSERT INTO allowed_users (email, role) VALUES
  ('firstname.lastname@aareon.nl', 'manager');
    Use 'manager' or 'director' as the role value.

    **How Roles Work**
    manager -> /manager-dashboard
    director -> /director-dashboard

    Managers cannot access the director dashboard and vice versa — enforced by the middleware.

2. Registering an Account
Once an email is in allowed_users, the user can:
- Go to /register
- Enter their email and create a password (minimum 8 characters)
- Check their email for a confirmation link from Supabase
- After confirming, go to / (login page) and sign in

**Database Tables**
allowed_users -> Predefined list of emails and their roles
profiles -> Linked to Supabase Auth users — stores role and email
approval_requests -> Tracks job posting approval requests
job_postings -> Stores submitted job postings

## Common Issues
**"This email is not authorised to register"**
→ The email has not been added to the allowed_users table. Add it via SQL Editor (see above).

**"Invalid login credentials"**
→ The user has not registered yet, or the password is incorrect.

**Environment variables not loading**
→ Make sure .env.local is in the project root (same level as package.json) and restart the dev server.

**Page keeps redirecting to login**
→ The Supabase session may have expired. Log in again at localhost:3000.