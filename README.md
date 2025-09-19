# MindBloom AI 🌸

MindBloom AI is an empathetic AI companion for mental wellness, built with Next.js and Firebase. It's designed to provide a safe, supportive, and non-judgmental space for users to express their thoughts and feelings. The AI, named Bloom, is more than just a passive listener; it's a proactive partner in your mental wellness journey.

## ✨ Key Features

- **Empathetic AI Chat:** Have natural and supportive conversations with Bloom, an AI fine-tuned for empathy and encouragement.
- **Persistent Chat History:** Conversations are securely stored in Firestore, so you can pick up right where you left off.
- **User Authentication:** A simple and secure authentication system allows users to sign up and log in to their personal accounts.
- **Customizable Themes:** Switch between light, dark, and system themes to personalize your experience.
- **Refreshing Activities:** Access a suite of tools to help you relax and reflect, including:
    - Guided Breathing Exercises
    - A Mood Journal to record your thoughts
    - A history log of your past conversations for reflection.
- **AI-Powered Crisis Detection:** The chat system intelligently detects keywords related to self-harm and immediately provides resources for help.
- **Proactive Safety Net:** Optionally configure the app to notify trusted contacts if you've been inactive for a specified period.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **AI:** Google's Gemini models via [Genkit](https://firebase.google.com/docs/genkit)
- **Database & Backend:** [Firebase](https://firebase.google.com/) (Firestore for data storage)
- **UI:** [ShadCN UI](https://ui.shadcn.com/) & [Tailwind CSS](https://tailwindcss.com/)
- **Theme Management:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Schema Validation:** [Zod](https://zod.dev/)

## 🚀 Getting Started

This is a Next.js project bootstrapped with `create-next-app`.

### Prerequisites

- Node.js (v18 or later)
- An active Firebase project.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of your project and add your Firebase project credentials. You will need a Firebase service account key for the backend services.

    ```
    FIREBASE_SERVICE_ACCOUNT_KEY=<your-firebase-service-account-json>
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can start editing the main page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

You can also visit my app which is been deployed over vercel for now.
I am facing issues with the database so no featue involving that works.
Click Here to visit 
https://mindbloom-ai-three.vercel.app/
