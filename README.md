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
