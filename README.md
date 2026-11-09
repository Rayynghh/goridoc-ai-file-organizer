# 🦍 GoriDoc — AI-Powered Intelligent File Organizer

**Automated File Organization in a Single Click.**

GoriDoc is an AI-powered web application designed to eliminate digital clutter through intelligent file classification and automated organization.

Instead of manually sorting files one by one, users can simply drag and drop multiple files, click **AI Sort**, and let the system analyze, classify, and organize their documents into structured directories.

With seamless ZIP export and direct Google Drive integration, GoriDoc transforms file management into a faster, smarter, and more efficient experience.

---

## 🎯 The Problem

Managing scattered digital files can be frustrating and time-consuming. Users frequently waste productivity manually identifying documents, creating folders, and organizing files into appropriate locations.

Traditional file management relies heavily on repetitive human intervention, resulting in digital clutter and misplaced documents.

## 💡 The Solution

GoriDoc introduces an intelligent file organization workflow that automates the entire sorting process.

Users simply upload their files, trigger **AI Sort**, and let the application handle the classification and organization process.

### 🧠 AI Engineering & Intelligent Classification

The core of GoriDoc lies in its AI-driven file classification system.

Rather than relying solely on basic file extensions, GoriDoc is designed to analyze file characteristics and contextual information to determine the most appropriate categories.

The classification pipeline consists of:

1. **File Analysis** — Analyzing uploaded files and extracting relevant information.
2. **Intelligent Classification** — Applying AI-driven analysis to assign files to appropriate categories.
3. **Category Mapping** — Translating classification results into a structured directory hierarchy.
4. **Automated Organization** — Grouping files into their corresponding directories.
5. **Archive Generation** — Packaging the organized directory structure into a downloadable ZIP archive.

This approach demonstrates how AI engineering can be integrated into practical software development to solve everyday productivity challenges.

## ⚡ Key Features

| Feature                         | Description                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| AI-Powered Classification       | Analyzes and categorizes uploaded files intelligently.                                       |
| Drag & Drop Upload              | Upload multiple files through an intuitive interface.                                        |
| Smart Categorization            | Groups files according to their assigned categories.                                         |
| Automated Directory Structuring | Generates organized folder hierarchies automatically.                                        |
| ZIP Export                      | Downloads all organized folders in a single archive.                                         |
| Google Drive Integration        | Saves the organized ZIP archive directly to Google Drive without requiring a local download. |

## 🚀 What Makes GoriDoc Different?

GoriDoc provides two flexible export methods tailored to user convenience:

- **Instant Local Download:** Export the complete organized directory structure as a ZIP archive directly to your device.
- **1-Click Cloud Save:** Send the organized ZIP archive directly to Google Drive without downloading it locally first.

By combining AI-driven classification, automated file processing, and cloud integration, GoriDoc goes beyond conventional file management applications.

---

## 🛠️ Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Development Environment:** Node.js
- **AI Integration:** AI-powered file analysis and classification
- **Cloud Integration:** Google Drive API
- **Package Manager:** npm / yarn / pnpm / bun

---

## 🏁 Getting Started

This project was bootstrapped with [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm, yarn, pnpm, or bun
- A Google Cloud project with the Google Drive API configured (if using cloud export).

### Installation

First, clone the repository:

```bash
git clone <your-repository-url>
```

Navigate into the project directory:

```bash
cd goridoc
```

Install the dependencies:

```bash
npm install
```

### Environment Variables

Configure your environment variables in a `.env.local` file at the root of the project.

Add the required API credentials and configuration for your AI integration and Google Drive connection.

```env
# AI Configuration
AI_API_KEY=your_ai_api_key

# Google Drive Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

_Note: Replace these placeholders with the actual environment variable names and credentials required by your implementation. Never commit API keys or secrets to GitHub._

### Run the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

You can start editing the page by modifying `app/page.tsx`. The page automatically updates as you edit the file.

---

## 📚 Learn More

To learn more about the technologies used in this project, explore the following resources:

- [Next.js Documentation](https://nextjs.org/docs) — Learn about Next.js features and APIs.
- [Learn Next.js](https://nextjs.org/learn) — An interactive Next.js tutorial.
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) — Learn more about TypeScript.
- [Google Drive API Documentation](https://developers.google.com/workspace/drive/api/guides/about-sdk) — Explore Google Drive integration.

You can also check out the [Next.js GitHub Repository](https://github.com/vercel/next.js).

---

## 🌐 Deployment

The easiest way to deploy GoriDoc is through the [Vercel Platform](https://vercel.com/new).

Before deploying:

1. Configure the required environment variables in your deployment settings.
2. Ensure your AI service credentials are configured correctly.
3. Configure Google Drive API credentials and authorized redirect URLs.
4. Test file classification and ZIP export functionality.
5. Deploy your application.

For more information, check the [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

## 🌟 Project Vision

GoriDoc explores how AI engineering can transform repetitive digital tasks into intelligent, automated workflows.

Our goal is simple:

**Less manual sorting. More intelligent organization. Better productivity.**
