# Business Analysis School Student Support Portal

A modern, responsive web application built for the Business Analysis School to provide student support through an AI-powered chat interface with escalation capabilities to human support agents.

## 🚀 Features

- **AI-Powered Chat Support**: Interactive chatbot to answer questions about programs, payments, and career outcomes
- **Real-Time Communication**: WebSocket-based real-time messaging for instant responses
- **Escalation System**: Seamless transition from AI to human support when needed
- **Admin Dashboard**: Comprehensive dashboard for managing support escalations and chat history
- **Responsive Design**: Mobile-first design that works across all devices
- **Modern UI**: Clean, professional interface using Shadcn/ui components

## 🏗️ Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Shadcn/ui component library
- **Routing**: React Router DOM
- **State Management**:
  - React Context for WebSocket state
  - TanStack Query for server state management
- **Real-Time**: WebSocket connection for live chat
- **API Layer**: Custom API client with error handling

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── Header.tsx      # App header
│   ├── Footer.tsx      # App footer
│   └── EscalationForm.tsx
├── pages/              # Route components
│   ├── Index.tsx       # Landing page
│   ├── Chat.tsx        # Chat interface
│   ├── Admin.tsx       # Admin dashboard
│   └── NotFound.tsx    # 404 page
├── context/            # React contexts
│   └── socketContext.tsx # WebSocket provider
├── lib/                # Utilities and services
│   ├── api/            # API layer
│   │   ├── apiClient.ts # HTTP client
│   │   └── service.ts   # API services
│   ├── types.ts        # TypeScript definitions
│   └── utils.ts        # Utility functions
├── hooks/              # Custom React hooks
└── assets/             # Static assets
```

## 🛠️ Technology Stack

### Core Technologies
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### UI & Components
- **Shadcn/ui** - Modern component library
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icon library

### State & Data
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Real-Time & Communication
- **WebSockets** - Real-time messaging
- **Fetch API** - HTTP requests

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd business-analysis-school
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_API_SOCKET_URL=localhost:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🎯 Key Features Explained

### AI Chat Interface
- Interactive chatbot powered by AI
- Context-aware responses about business analysis programs
- Typing indicators and smooth animations
- Message history with timestamps

### Escalation System
- Automatic detection when human intervention is needed
- User-friendly escalation form
- Seamless transition to human support
- Email notifications for support agents

### Admin Dashboard
- View all escalation requests
- Manage request statuses (open, in progress, closed)
- Access complete chat history
- Real-time updates via WebSocket

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized performance

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | Yes |
| `VITE_API_SOCKET_URL` | WebSocket server URL | Yes |

## 📱 Pages Overview

### Landing Page (`/`)
- Hero section with image carousel
- Feature highlights
- Quick access to popular questions
- Call-to-action for starting chat

### Chat Page (`/chat`)
- Real-time chat interface
- AI assistant responses
- Escalation form when needed
- Session management

### Admin Page (`/admin`)
- Escalation management table
- Status tracking
- Chat history viewer
- Support agent tools

## 🔄 API Integration

The application integrates with a backend API for:
- Sending and receiving chat messages
- Managing escalation requests
- Retrieving chat history
- Updating escalation statuses

### API Endpoints Used
- `POST /chat` - Send chat messages
- `POST /escalation` - Submit escalation requests
- `GET /escalation` - Fetch all escalations
- `GET /escalation/:sessionId` - Get escalation by session

## 🎨 Design System

- **Color Scheme**: Professional blue and purple gradients
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent spacing scale
- **Components**: Reusable, accessible UI components
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Serve the `dist` folder with any static server

3. Ensure environment variables are set in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary software developed for Business Analysis School.

## 👥 Support

For technical support or questions about this application, please contact the development team.

---

**Built with ❤️ for Business Analysis School**

## JET