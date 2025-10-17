# DeepFlow

A modern productivity application for deep work sessions, built with Next.js and Electron. Track your focus time, manage tasks, and maintain productivity streaks with a beautiful, distraction-free interface.

## Features

- 🎯 **Focus Sessions**: Time-boxed, open, and Pomodoro session types
- 📊 **Analytics**: Detailed insights into your productivity patterns
- 📝 **Notes**: Rich text editor with markdown support
- ✅ **Tasks**: Kanban-style task management
- 🏷️ **Tags**: Organize sessions and tasks with custom tags
- 📈 **Streaks**: Track your daily focus habits
- 🎨 **Themes**: Dark and light mode support
- 🔄 **Sync**: Cloud synchronization with Supabase
- 🖥️ **Cross-platform**: Web app and desktop app (Electron)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Desktop**: Electron
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel (Web), Electron Builder (Desktop)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/deepflow.git
   cd deepflow
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_VERSION=1.0.0-beta
   ```

4. **Set up Supabase**

   - Create a new Supabase project
   - Run the database migrations (see Database Setup below)
   - Update your environment variables with the project URL and anon key

### Development

#### Web Development

```bash
pnpm dev
```

Open [http://localhost:3010](http://localhost:3010) to view the application.

#### Desktop Development

```bash
pnpm dev:electron
```

This will start both the Next.js dev server and the Electron app.

### Database Setup

1. **Create the required tables in Supabase**:

   ```sql
   -- Sessions table
   CREATE TABLE sessions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     goal TEXT NOT NULL,
     session_type TEXT NOT NULL CHECK (session_type IN ('time-boxed', 'open', 'pomodoro')),
     tags TEXT[] DEFAULT '{}',
     notes TEXT,
     planned_duration_minutes INTEGER,
     start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     expected_end_time TIMESTAMPTZ,
     end_time TIMESTAMPTZ,
     elapsed_seconds INTEGER DEFAULT 0,
     status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'stopped')),
     completion_type TEXT CHECK (completion_type IN ('completed', 'premature', 'overtime')),
     deep_work_quality INTEGER CHECK (deep_work_quality >= 1 AND deep_work_quality <= 10),
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Tasks table
   CREATE TABLE tasks (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     description TEXT,
     due_date DATE,
     project TEXT,
     completed BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Notes table
   CREATE TABLE notes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     content TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Feedback table
   CREATE TABLE feedback (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
     message TEXT NOT NULL,
     category TEXT NOT NULL CHECK (category IN ('bug', 'idea', 'other')),
     contact TEXT,
     rating INTEGER CHECK (rating >= 1 AND rating <= 5),
     app_version TEXT,
     page_url TEXT,
     metadata JSONB,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
   ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
   ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

   -- Create RLS policies
   CREATE POLICY "Users can view their own sessions" ON sessions
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own sessions" ON sessions
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own sessions" ON sessions
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own sessions" ON sessions
     FOR DELETE USING (auth.uid() = user_id);

   -- Similar policies for tasks, notes, and feedback...
   ```

2. **Set up authentication**:
   - Enable email/password authentication in Supabase
   - Configure OAuth providers (Google, GitHub) if desired
   - Set up redirect URLs for your domain

### Building for Production

#### Web Application

```bash
# Build the Next.js application
pnpm build

# Start the production server
pnpm start
```

#### Desktop Application

```bash
# Build both web and desktop app
pnpm build:electron

# The built app will be in the dist/ folder
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## Deployment

### Web Deployment (Vercel)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_VERSION`
3. **Deploy** - Vercel will automatically build and deploy

### Desktop Deployment

The desktop app can be distributed through:

- **Windows**: NSIS installer
- **macOS**: DMG package
- **Linux**: AppImage

Build artifacts are created in the `dist/` folder after running `pnpm build:electron`.

## Configuration

### Environment Variables

| Variable                        | Description               | Required                |
| ------------------------------- | ------------------------- | ----------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL | Yes                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key    | Yes                     |
| `NEXT_PUBLIC_APP_VERSION`       | Application version       | No (defaults to "beta") |

### Customization

- **Themes**: Modify `src/contexts/ThemeContext.tsx`
- **UI Components**: Located in `src/components/ui/`
- **API Routes**: Located in `src/app/api/`
- **Database Schema**: Modify the SQL migrations above

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/deepflow/issues) page
2. Create a new issue with detailed information
3. Contact support at support@deepflow.app

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Advanced analytics and reporting
- [ ] Integration with calendar apps
- [ ] Offline mode support
- [ ] Plugin system for extensions

---

Built with ❤️ using Next.js, React, and Supabase.
