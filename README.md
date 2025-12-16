# Matripuntos

Matripuntos is a gamified relationship app that helps couples earn points for thoughtful actions and redeem them for special moments together.

## Features

- 🔐 **Email Authentication** - Secure login via Supabase Auth
- 💑 **Couple Linking** - Generate a unique code to connect with your partner
- 🎯 **Point System** - Earn points for caring actions and thoughtful gestures
- 🎁 **30 Pre-loaded Rewards** - Catalog of rewards to redeem with your points
- 📊 **Real-time Sync** - Updates appear instantly for both partners
- 📱 **PWA Ready** - Install on mobile devices for native app experience
- 📈 **Activity History** - Track all point gains and redemptions
- 👤 **User Profiles** - View stats and manage your account

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Authentication**: Supabase Auth (Email/Password)
- **Routing**: React Router v7
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A Supabase account

### Setup Instructions

1. **Clone and install dependencies**

```bash
npm install
```

2. **Configure Supabase**

The database schema has already been set up with the following tables:
- `users` - User profiles
- `couples` - Couple data with point balance
- `rewards` - Reward catalog
- `history` - Transaction history

Email authentication is enabled by default in Supabase, so no additional configuration is needed.

3. **Start the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## How It Works

1. **Sign Up**: Both partners create accounts with their email and password
2. **Link Couple**: One partner creates a 6-character code, the other joins with that code
3. **Earn Points**: Add points for thoughtful actions (making breakfast, doing chores, etc.)
4. **Redeem Rewards**: Browse the catalog and redeem rewards when you have enough points
5. **Track Progress**: View your activity history and personal statistics

## Included Rewards

The app comes pre-loaded with 30 rewards including:
- Breakfast in bed (12 pts)
- Movie night (15 pts)
- Romantic dinner cooked by partner (20 pts)
- 30-minute massage (25 pts)
- 3-hour free time (30 pts)
- Day without chores (40 pts)
- Weekend without kids (60 pts)
- Professional spa visit (100 pts)
...and many more!

## Security Features

- Row Level Security (RLS) enabled on all tables with optimized performance
- Users can only access their couple's data
- Authenticated access required for all operations
- Secure password authentication via Supabase Auth
- Passwords are hashed and never stored in plain text
- All foreign keys properly indexed for optimal query performance
- RLS policies optimized to prevent unnecessary re-evaluations
- Database performance tuned for scale

## PWA Features

- Install as mobile app
- Offline-ready manifest
- Optimized icons for all devices
- Native app experience

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks (auth, etc.)
├── lib/            # Utilities (Supabase client, seed data)
├── pages/          # Route pages
└── types/          # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Deployment

Build the project and deploy the `dist` folder to any static hosting service:

```bash
npm run build
```

Recommended hosting platforms:
- Vercel
- Netlify
- Firebase Hosting
- Cloudflare Pages

## Contributing

This is a personal project, but feel free to fork and customize for your own use!

## License

MIT

## Notes

- **Icons**: The project includes placeholder icon files. For production, generate proper PWA icons using tools like [RealFaviconGenerator](https://realfavicongenerator.net/)
- **Customization**: The reward catalog can be customized by modifying `src/lib/seedRewards.ts`
- **Real-time Updates**: Changes made by one partner appear instantly for the other thanks to Supabase real-time subscriptions

---

Built with ❤️ for couples who want to gamify their relationship
