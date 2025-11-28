
<p align="center">
    <img src="public/images/logo.png" alt="DGEN Technologies" height="60" />
</p>

<h1 align="center">DGEN Technologies — Smart City & IoT Website</h1>

<p align="center">
    <a href="https://opensource.org/licenses/MIT"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
    <a href="https://nextjs.org/"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-15.x-black?logo=next.js"></a>
    <a href="https://reactjs.org/"><img alt="React" src="https://img.shields.io/badge/React-18.x-61DAFB?logo=react"></a>
    <a href="https://firebase.google.com/"><img alt="Firebase" src="https://img.shields.io/badge/Firebase-Active-orange?logo=firebase"></a>
    <a href="https://firebase.google.com/docs/genkit"><img alt="Genkit" src="https://img.shields.io/badge/Genkit_AI-Enabled-brightgreen?logo=google-gemini"></a>
    <a href="#performance"><img alt="Web Vitals" src="https://img.shields.io/badge/Web_Vitals-Ready-4CAF50"></a>
</p>

<p align="center">
    A premium, performant Next.js app powering DGEN's brand, AI-driven blog, and smart city product showcase.
</p>

---

## Table of Contents

- Overview
- Features
- Architecture
- Getting Started
- AI Content
- Firebase
- Deployment
- Performance
- Additional Docs

---

## Overview

This repository contains the official website for **DGEN Technologies**, a forward-thinking technology company specializing in B2B smart city solutions and an expanding line of B2C smart home products. This Next.js application showcases our brand, products, and insights, featuring a dynamic, AI-powered blog.

## ✨ Features

- **Modern Frontend**: Next.js 15 (App Router) with server-first architecture.
- **Premium UI**: Tailwind CSS + ShadCN UI components with accessibility.
- **AI-Powered Blog**: Generate topics and posts via Genkit (Gemini).
- **Smart Images**: Unsplash integration using AI-generated image hints.
- **Firebase Backend**: Firestore + Auth with secure rules.
- **SEO & Sitemaps**: Dynamic metadata and sitemap generation.
- **Admin Dashboard**: Manage posts, messages, performance, and settings.

> [!TIP]
> Looking for details? See the full docs in `docs/`.

## 🚀 Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Framework**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Genkit (Google Gemini)](https://firebase.google.com/docs/genkit)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Deployment**: Firebase App Hosting (or Vercel, Netlify)

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```powershell
    git clone <your-repo-url>
    cd website
    ```

2.  **Install dependencies:**
    ```powershell
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your Firebase and Unsplash credentials. You can get your Firebase config from the Firebase console.

    ```env
    # Firebase Client SDK Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...

    # Unsplash API Key
    UNSPLASH_ACCESS_KEY=...
    ```

4.  **Run the development server:**
    ```powershell
    npm run dev
    ```
    App runs at `http://localhost:9002`.

> [!NOTE]
> For Windows PowerShell, you can run: `npm install; npm run dev`.

## 🤖 AI Content

This project uses **Genkit** to connect to Google's Gemini AI models. The core AI functionalities are:

- **Suggesting Blog Topics**: The admin dashboard can suggest new, trending blog topics based on existing content.
- **Generating Blog Posts**: From a given topic and author persona, the AI can generate a complete, well-structured blog post, including title, content, tags, and image hints.
- **Dynamic Image Hints**: The AI generates multiple search hints, which are used to find a relevant hero image via the Unsplash API, ensuring visual variety.

The relevant AI flows are located in `src/ai/flows/`.

See `docs/api.md` for flow signatures and payload examples.

See `docs/api.md` for detailed flow inputs/outputs and example payloads.

## 🔥 Firebase

The application is tightly integrated with Firebase for its backend services:

- **Firestore**: All blog posts created (whether by AI or manually) are stored in a `blogPosts` collection in Firestore. This allows for real-time updates and scalable data storage.
- **Security Rules**: The `firestore.rules` file is configured to allow public read access for blog content while securing write access.
- **Client-Side SDK**: Firebase client interactions initialized in `src/firebase/client.ts`.

> [!WARNING]
> Ensure `firestore.rules` enforce least-privilege writes; restrict admin-only mutations.

## 🌐 Deployment

This application is optimized for deployment on serverless platforms like **Firebase App Hosting** or **Vercel**.

- `apphosting.yaml` configures Firebase App Hosting.
- Connect the repo to hosting provider; mirror `.env.local` as secrets.

## 🧭 Architecture

The site uses a modular Next.js App Router structure with clear separation of public pages, admin routes, UI components, and AI flows.

```mermaid
flowchart LR
    A[Public Pages src/app] -->|reads| B[Firestore]
    A --> C[Unsplash API]
    D[Admin Dashboard src/app/(admin)] -->|CRUD| B
    D --> E[Genkit Flows src/ai/flows]
    E --> F[Google Gemini]
    subgraph UI
        G[ShadCN Components]
        H[Tailwind CSS]
    end
    A --> G
    D --> G
    G --> H
```

## 📚 Additional Docs

- `docs/architecture.md` — System architecture, sequences, ERD
- `docs/admin.md` — Admin UI usage and configuration
- `docs/api.md` — API routes and AI flows
- `docs/performance.md` — Performance guidance and integrations
- `CONTRIBUTING.md` — Contribution standards and workflow
 - `SECURITY.md` — Security policy and vulnerability reporting
 - `CODE_OF_CONDUCT.md` — Community standards and enforcement
 - `PRIVACY.md` — Data handling and retention notice

---

> [!NOTE]
> Need a quick tour? Start at `docs/README.md` for a navigable index.

---

Thank you for exploring the DGEN Technologies website project. We are committed to innovating and building the future of smart technology.
