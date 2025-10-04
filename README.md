# 📑 Sommaire – AI Powered PDF Summarization Tool

Sommaire is an **AI-driven PDF summarization platform** built with **Next.js 15, TailwindCSS, Shadcn UI, and OpenAI**. It enables users to **upload PDFs, process them with AI, and get concise summaries instantly**, making research, learning, and reading faster and smarter.

🚀 Designed with modern full-stack practices, Sommaire integrates **authentication (Clerk), database (NeonDB), payments (Stripe), and AI (OpenAI/Gemini)** — all deployed seamlessly on Vercel.

## 🌟 Features

- 📄 **PDF Upload & Summarization** – Upload your PDF and get AI-generated summaries.
- 🔐 **Authentication with Clerk** – Secure login and sign-up with OAuth & Passkeys.
- 🗄️ **Neon Database Integration** – Store user data, summaries, and payments.
- 💳 **Stripe Payments** – Subscription and payment flow integrated with webhooks.
- 🎨 **Modern UI/UX** – Styled with TailwindCSS & Shadcn UI for responsive, elegant design.
- 🤖 **AI Integration** – OpenAI & Gemini APIs for intelligent, accurate summarization.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, Tailwind CSS, Shadcn UI
- **Authentication:** Clerk
- **Database:** NeonDB (Postgres)
- **Payments:** Stripe
- **AI:** OpenAI API, Gemini API
- **Deployment:** Vercel

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/darshangowdagl/Sommaire.git
cd sommaire
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 📦 Project Repositories

- ⭐️ [Source Code Repo](https://github.com/darshangowdagl/Sommaire.git)
- ⭐️ [Live Website](#)

## 📝 Editor Setup (VS Code)

Recommended extensions for smooth development:

- [Tailwind Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) ⭐
- [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) ⭐
- [ES7+ React/Redux Snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets) ⭐
- [Vscode Icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons) ⭐
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

## 🎨 TailwindCSS & Styling

- [Tailwind Docs](https://tailwindcss.com/docs)
- [Customizing Colors](https://tailwindcss.com/docs/customizing-colors)
- [Customizing Spacing](https://tailwindcss.com/docs/customizing-spacing)
- [Shadcn UI Installation](https://ui.shadcn.com/docs/installation)

Example `globals.css` configuration is included in `/app/globals.css`.

## 🔄 Routing in Next.js

- [Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing)
- [Pages & Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [File Conventions](https://nextjs.org/docs/app/api-reference/file-conventions)

## 🔐 Authentication with Clerk

- [Clerk Next.js Setup](https://clerk.com/docs/quickstarts/nextjs)
- [Passkeys Explained](https://clerk.com/docs/authentication/passkeys)
- [Bot Protection](https://clerk.com/docs/security/bot-protection)

## 🗄️ Database Schema (NeonDB)

Postgres schema used in Sommaire:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'inactive',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pdf_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    original_file_url TEXT NOT NULL,
    summary_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 💳 Stripe Payments

Steps to integrate:

1. Create Stripe account.
2. Setup payment links.
3. Copy **Webhook Key** and **Stripe Secret**.
4. Add `/api/payments` webhook endpoint.

[Stripe Docs](https://stripe.com/docs)

## 🤖 AI Integrations

### OpenAI

- [OpenAI Docs](https://platform.openai.com/docs)
- Example config:

```javascript
temperature: 0.7,
max_tokens: 1000,
model: "gemini-2.5-pro",
```

### Gemini

- [Gemini API Pricing](https://ai.google.dev/pricing)

## 📤 File Uploads

- [UploadThing Docs](https://docs.uploadthing.com)
- [React API Reference](https://docs.uploadthing.com/api-reference/react)

## 🚀 Deployment

- [Vercel Deployment](https://vercel.com/docs)
- [Bypass Body Size Limit Guide](https://vercel.com/docs/functions/serverless-functions/runtimes#request-body-size)

## 📸 Screenshots

![Home Page](/public/sommaire.png)

## 💬 Feedback

Have ideas, issues, or contributions?
👉 [Open an issue] or submit a pull request!
