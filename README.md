# SIBOM (시봄)

> 50대 이후, 새로운 인연을 만나보세요.
> A senior-friendly social platform for finding new connections after 50.

## 📋 Project Overview

SIBOM is a monorepo project designed to provide a tailored social experience for the senior demographic. It combines a modern web frontend wrapped as a mobile application with a robust backend API.

## 🏗️ Architecture

This project is managed as a monorepo using **TurboRepo**.

### 📂 Directory Structure

- **apps/web**: Next.js frontend application (Mobile conversion via Capacitor).
- **apps/api**: NestJS backend server.
- **packages/shared**: Shared utilities and types used across applications.

---

## 🚀 Technology Stack

### Frontend (apps/web)
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Mobile Runtime**: [Capacitor 8](https://capacitorjs.com/) (Android)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Animations**: Framer Motion, React Spring
- **Key Features**: Tinder-style card swiping, PWA support.

### Backend (apps/api)
- **Framework**: [NestJS 11](https://nestjs.com/)
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/)
- **AI**: Google Generative AI (Gemini)
- **Storage**: AWS S3 SDK (Cloudflare R2)
- **Documentation**: Swagger API

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- pnpm (v9+)
- Java JDK & Android Studio (for mobile development)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

Run the development server for all apps simultaneously:

```bash
pnpm dev
```

- **Web**: http://localhost:3000
- **API**: http://localhost:3001 (default NestJS port, check configuration)

### Build

```bash
pnpm build
```

---

## 📱 Mobile Development (Android)

To deploy the web application to an Android device or emulator:

1.  Navigate to the web app directory:
    ```bash
    cd apps/web
    ```

2.  Run the deployment script:
    ```bash
    pnpm run deploy:android
    ```
    This command will build the Next.js app, sync assets to the Android project, and open Android Studio.

---

## 📄 Scripts

- `pnpm dev`: Start development servers.
- `pnpm build`: Build all applications.
- `pnpm lint`: Run linting across the monorepo.
- `pnpm format`: Format code using Prettier.
