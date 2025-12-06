# TanStack AI Chat Template

A modern, full-stack AI chat application built with TanStack Start, featuring multi-provider AI support, real-time streaming, and a beautiful UI.

## ✨ Features

- 🤖 **Multi-Provider AI Support** - OpenAI, Anthropic Claude, and Google Gemini
- 💬 **Real-time Streaming** - Natural typing animation for AI responses
- ✅ **Form Validation** - TanStack Form with built-in validators for robust input validation
- 🔍 **Full-Text Search** - Search across chat titles and message content (⌘K)
- 📱 **Responsive Design** - Mobile-first with collapsible sidebar
- 🌓 **Dark Mode** - System-aware theme with manual override
- 💾 **PostgreSQL Database** - Persistent chat history with Drizzle ORM
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS

## 🚀 Tech Stack

### Frontend
- **[TanStack Start](https://tanstack.com/start)** - Full-stack React framework
- **[TanStack Router](https://tanstack.com/router)** - Type-safe routing
- **[TanStack Query](https://tanstack.com/query)** - Data fetching and caching
- **[TanStack Form](https://tanstack.com/form)** - Powerful form validation
- **[React](https://react.dev)** - UI library
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com)** - Re-usable components

### Backend
- **[TanStack AI](https://tanstack.com/ai)** - AI integration layer
- **[Drizzle ORM](https://orm.drizzle.team)** - Type-safe database toolkit
- **[PostgreSQL](https://postgresql.org)** - Relational database
- **[Vinxi](https://vinxi.vercel.app)** - Full-stack framework

### AI Providers
- **OpenAI** - GPT-4o, GPT-4o Mini
- **Anthropic** - Claude 3.5 Sonnet, Claude 3.5 Haiku
- **Google** - Gemini 1.5 Pro, Gemini 1.5 Flash

> **Note:** AI model availability depends on [@tanstack/ai](https://www.npmjs.com/package/@tanstack/ai) and its provider adapters. Check the [TanStack AI documentation](https://tanstack.com/ai) for the latest supported models and providers.

## 📋 Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** 14+
- API keys for at least one AI provider:
  - [OpenAI API key](https://platform.openai.com/api-keys)
  - [Anthropic API key](https://console.anthropic.com/)
  - [Google AI API key](https://aistudio.google.com/app/apikey)

## 🛠️ Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd tanstack-ai-demo
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb chatapp
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chatapp

# AI Provider API Keys (at least one required)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...
```

### 4. Run Database Migrations

```bash
npm run db:push
```

This will create the necessary tables in your PostgreSQL database.

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Chat.tsx         # Main chat interface
│   ├── ChatInput.tsx    # Floating message input
│   ├── ChatLayout.tsx   # Layout with sidebar
│   ├── ChatSidebar.tsx  # Chat list sidebar
│   ├── ChatSearchDialog.tsx  # Search modal (⌘K)
│   ├── MessageBubble.tsx     # Message display
│   ├── ModelSelector.tsx     # AI model picker
│   └── ThemeToggle.tsx       # Dark mode toggle
├── db/
│   ├── index.ts         # Database connection
│   └── schema.ts        # Drizzle schema
├── lib/
│   ├── chat-actions.ts  # Server functions
│   ├── store.ts         # Client state
│   └── utils.ts         # Utilities
├── routes/              # TanStack Router routes
├── types/               # TypeScript types
└── styles.css           # Global styles
```

## 🎯 Key Features

### Multi-Provider AI

Switch between different AI providers and models on the fly:
- OpenAI: GPT-4o Mini (fast), GPT-4o (advanced)
- Anthropic: Claude 3.5 Haiku (fast), Claude 3.5 Sonnet (advanced)
- Google: Gemini 1.5 Flash (fast), Gemini 1.5 Pro (advanced)

### Search

Press **⌘K** (Mac) or **Ctrl+K** (Windows/Linux) to open the search dialog. Search across:
- Chat titles
- Message content

### Responsive Design

- **Desktop**: Full sidebar with search and chat list
- **Tablet/Mobile**: Collapsible sidebar accessible via menu button
- **All screens**: Floating input with gradient backdrop

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## 🎨 Customization

### Adding New AI Providers

Edit `src/lib/store.ts`:

```typescript
export const AI_PROVIDERS = [
  // Add your provider here
  {
    id: 'your-provider',
    name: 'Your Provider',
    models: [
      { id: 'model-id', name: 'Model Name' }
    ]
  }
]
```

Then add adapter logic in `src/lib/chat-actions.ts`.

### Styling

- **Colors**: Edit `src/styles.css` for theme colors
- **Components**: Modify shadcn/ui components in `src/components/ui/`
- **Fonts**: Change Google Fonts link in `src/routes/__root.tsx`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **GitHub Repository**: [https://github.com/rs-4/tanstack-ai-demo](https://github.com/rs-4/tanstack-ai-demo)
- **TanStack Docs**: [https://tanstack.com](https://tanstack.com)
- **TanStack AI**: [https://tanstack.com/ai](https://tanstack.com/ai)

## 🙏 Acknowledgments

Built with:
- [TanStack](https://tanstack.com) - Amazing full-stack tooling
- [shadcn/ui](https://ui.shadcn.com) - Beautiful component library
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
