SUJETO A CAMBIOS (CAMBIAR)
# FWD Marketplace

A freelance project marketplace designed to connect FWD graduates with companies offering short-term professional opportunities. The platform provides a trusted environment where junior talent can gain real-world experience while businesses can discover and hire verified emerging professionals.

## Overview

FWD Marketplace bridges the gap between education and employment by enabling companies to publish freelance projects and allowing FWD graduates to apply for opportunities that match their skills and career goals.

The platform is designed around three user roles:

- **Juniors** – Browse projects, submit applications, and track their progress.
- **Companies** – Publish projects, review candidates, and manage applications.
- **Administrators** – Moderate content, approve organizations, and maintain marketplace quality.

## Features

### Junior Experience
- Google Authentication
- Browse available projects
- Advanced project filtering
- Project details page
- Submit applications with portfolio/CV
- Track application status

### Company Experience
- Company onboarding
- Project creation and management
- Candidate review dashboard
- Application management workflow

### Admin Experience
- Platform analytics dashboard
- Company approval workflow
- Project moderation tools

## Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript (Strict Mode)
- Tailwind CSS v4
- shadcn/ui
- next-intl

### Backend
- Supabase
  - PostgreSQL
  - Authentication
  - Row Level Security (RLS)
  - Storage

### Validation & Testing
- Zod
- Vitest
- Playwright (Optional)

### Deployment
- Vercel

## Project Structure

```text
src/
├── app/
│   ├── (public)/
│   ├── (app)/
│   ├── marketplace/
│   ├── applications/
│   └── (admin)/
│
├── components/
│   ├── ui/
│   ├── features/
│   ├── auth/
│   └── layout/
│
├── lib/
│   ├── supabase/
│   ├── marketplace/
│   ├── i18n/
│   ├── constants/
│   └── utils/
│
├── types/
│
└── messages/
    ├── en.json
    └── es.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Supabase account
- Vercel account

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/fwd-marketplace.git
```

Navigate to the project folder:

```bash
cd fwd-marketplace
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production build locally.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run typecheck
```

Runs TypeScript checks.

```bash
npm run test
```

Runs unit tests.

## Design Principles

The project follows the FWD Talent design system and maintains consistency with the broader FWD ecosystem:

- Mobile-first approach
- Accessibility-focused UI
- Bilingual support (English & Spanish)
- Warm and approachable language
- Consistent design tokens and branding
- Responsive user experience

## Future Enhancements

- Intelligent project matching
- Real-time notifications
- Dark mode
- Achievement badges
- Candidate ratings
- Enhanced search and recommendations

## Contributing

Contributions should follow:

- TypeScript strict mode
- Conventional Commits
- ESLint and Prettier standards
- Component-driven architecture
- Internationalization requirements

## Team

Developed as part of the Fundación Forward Costa Rica Graduation Project and Hackathon Program.

## License

This project is intended for educational and demonstration purposes as part of the FWD Talent ecosystem.
