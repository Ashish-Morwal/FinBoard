# FinBoard - Finance Dashboard

## Overview

FinBoard is a customizable finance dashboard application built with React and TypeScript. It allows users to create, configure, and arrange widgets to display real-time financial data from various APIs. The application features a modern dark-themed interface with drag-and-drop functionality, persistent configuration storage, and integration with financial data providers like Alpha Vantage and Finnhub.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **State Management**: Redux Toolkit for global state management with separate slices for dashboard and settings
- **UI Components**: Shadcn/ui component library with Radix UI primitives for consistent, accessible interface components
- **Styling**: Tailwind CSS with CSS variables for theming support (dark/light mode toggle)
- **Routing**: Wouter for lightweight client-side routing

### Component Structure
- **Widget System**: Modular widget architecture supporting different types (cards, tables, charts, watchlists)
- **Drag and Drop**: Configurable widget positioning and rearrangement
- **Theme Provider**: Centralized theme management with dark mode as default
- **Modal System**: Dialog-based configuration interfaces for widget and settings management

### Data Management
- **Local Storage**: Browser localStorage for persisting dashboard configurations, API keys, and user preferences
- **Real-time Updates**: Configurable refresh intervals (minimum 30 seconds) for widget data
- **Data Validation**: Zod schemas for runtime type checking and validation of configurations

### API Integration
- **Multi-Provider Support**: Designed to work with Alpha Vantage (primary) and Finnhub (fallback)
- **Dynamic Field Selection**: JSON field picker allowing users to select which data points to display
- **API Key Management**: Secure storage and configuration of API credentials
- **Error Handling**: Comprehensive error states and loading indicators for API calls

### Backend Architecture
- **Server**: Express.js server with TypeScript
- **Database**: Drizzle ORM configured for PostgreSQL with Neon serverless database
- **API Routes**: RESTful API structure with `/api` prefix for backend endpoints
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: Hot reload and development middleware with Vite integration

### Build and Deployment
- **Development**: Vite dev server with HMR and TypeScript checking
- **Production**: Optimized build process with ESBuild for server bundling
- **Static Assets**: Separate client and server build outputs for deployment flexibility

## External Dependencies

### Database and ORM
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database operations with migration support
- **Connect-pg-simple**: PostgreSQL session store for Express sessions

### Financial Data APIs
- **Alpha Vantage**: Primary financial data provider for stock prices, market data
- **Finnhub**: Alternative financial data provider for redundancy
- **API Configuration**: User-configurable API keys stored securely in localStorage

### UI and Design System
- **Shadcn/ui**: Complete component library built on Radix UI primitives
- **Radix UI**: Unstyled, accessible UI components for complex interactions
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide Icons**: Consistent icon library for interface elements

### Development and Build Tools
- **Vite**: Fast build tool with React plugin and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment optimization for Replit platform

### State and Data Management
- **Redux Toolkit**: Simplified Redux setup with RTK Query for API state management
- **React Query**: Server state management and caching for API requests
- **React Hook Form**: Form state management with Zod validation integration
- **Wouter**: Lightweight routing solution for single-page application navigation