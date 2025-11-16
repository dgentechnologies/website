
# DGEN Technologies - Smart City & IoT Solutions Website

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Active-orange?logo=firebase)](https://firebase.google.com/)
[![Genkit AI](https://img.shields.io/badge/Genkit_AI-Enabled-brightgreen?logo=google-gemini)](https://firebase.google.com/docs/genkit)

This repository contains the official website for **DGEN Technologies**, a forward-thinking technology company specializing in B2B smart city solutions and an expanding line of B2C smart home products. This Next.js application is built to showcase our brand, products, and insights, featuring a dynamic, AI-powered blog.

## ✨ Key Features

- **Modern Frontend**: Built with **Next.js 15** and the **App Router** for a fast, server-first architecture.
- **Responsive Design**: A beautiful and responsive user interface crafted with **Tailwind CSS** and **ShadCN UI**.
- **AI-Powered Blog**: A fully-featured blog where new content can be generated on-demand using **Google's Gemini model** via **Genkit**.
- **Dynamic Image Generation**: Blog post hero images are dynamically fetched from **Unsplash** based on AI-generated hints, ensuring fresh and relevant visuals.
- **Firebase Integration**: Utilizes **Firebase Firestore** for scalable, real-time data storage for blog posts and **Firebase Authentication**.
- **SEO Optimized**: Configured for search engine indexing with dynamic sitemaps and metadata.
- **Admin Dashboard**: Internal routes for creating, editing, and managing blog content.

## 🚀 Technology Stack

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
    ```bash
    git clone https://github.com/your-repo/dgen-technologies.git
    cd dgen-technologies
    ```

2.  **Install dependencies:**
    ```bash
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
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

## 🤖 AI-Powered Content Generation

This project uses **Genkit** to connect to Google's Gemini AI models. The core AI functionalities are:

- **Suggesting Blog Topics**: The admin dashboard can suggest new, trending blog topics based on existing content.
- **Generating Blog Posts**: From a given topic and author persona, the AI can generate a complete, well-structured blog post, including title, content, tags, and image hints.
- **Dynamic Image Hints**: The AI generates multiple search hints, which are used to find a relevant hero image via the Unsplash API, ensuring visual variety.

The relevant AI flows are located in `src/ai/flows/`.

## 🔥 Firebase Integration

The application is tightly integrated with Firebase for its backend services:

- **Firestore**: All blog posts created (whether by AI or manually) are stored in a `blogPosts` collection in Firestore. This allows for real-time updates and scalable data storage.
- **Security Rules**: The `firestore.rules` file is configured to allow public read access for blog content while securing write access.
- **Client-Side SDK**: The app uses the Firebase client-side SDK for all interactions, with initialization managed in `src/firebase/client.ts`.

## 🌐 Deployment

This application is optimized for deployment on serverless platforms like **Firebase App Hosting** or **Vercel**.

- The `apphosting.yaml` file provides basic configuration for Firebase App Hosting.
- To deploy, simply connect your Git repository to your chosen hosting provider and ensure all environment variables from your `.env.local` file are configured in the deployment settings.

---

Thank you for exploring the DGEN Technologies website project. We are committed to innovating and building the future of smart technology.
