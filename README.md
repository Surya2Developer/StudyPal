# [Studypal](https://studypalai.vercel.app/) &middot; [![Author Magesh](https://img.shields.io/badge/Author-Magesh-%3C%3E)]
[![GitHub](https://img.shields.io/badge/GitHub-%3C%3E)](https://github.com/Surya2Developer)  
[![Next.js](https://img.shields.io/badge/Next.js-%3C%3E)](https://nextjs.org/)  
[![React](https://img.shields.io/badge/React-%3C%3E)](https://react.dev/)  
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%3C%3E)](https://tailwindcss.com/)  
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-%3C%3E)](https://orm.drizzle.team/)

## 📝 Project Description

Studypal is an AI-powered study companion platform built with Next.js that revolutionizes the way students create and consume educational content. The application leverages Google's Gemini AI to automatically generate comprehensive study materials including notes, flashcards, quizzes, and Q&A sessions from any topic. With integrated YouTube recommendations, a marketplace for sharing study materials, and a credit-based premium system powered by Stripe, StudyPal provides a complete learning ecosystem for students and educators.

## ⚙️ Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **Authentication**: Clerk
- **AI Integration**: Google Gemini AI
- **Payment Processing**: Stripe
- **Background Jobs**: Inngest
- **External APIs**: YouTube Data API v3
- **UI Components**: Radix UI, Lucide React
- **Deployment**: Vercel

## 🔋 Features

👉 **AI-Powered Study Material Generation**: Automatically create comprehensive study materials using Google Gemini AI, including detailed notes, interactive flashcards, quizzes, and Q&A sessions from any topic or content you provide.

👉 **Smart Course Creation**: Input any topic and difficulty level to generate structured courses with chapters, topics, and organized learning paths.

👉 **Interactive Study Modes**: 
- **Notes**: AI-generated comprehensive notes for each chapter
- **Flashcards**: Interactive flip cards for quick review and memorization
- **Quiz**: Multiple-choice questions with instant feedback
- **Q&A**: Question-answer pairs for deeper understanding

👉 **YouTube Integration**: Smart YouTube video recommendations based on course content using advanced embedding similarity matching for relevant educational videos.

👉 **Marketplace System**: 
- Share your study materials publicly with the community
- Discover and learn from materials created by other users
- Upvote and favorite system for quality content
- Public course pages with SEO-friendly URLs

👉 **Credit-Based System**: 
- Free tier with 2 credits for new users
- Premium subscription for unlimited access
- Secure Stripe payment integration

👉 **User Dashboard**: 
- Track all your created courses
- Monitor study progress
- Manage favorites and created content
- Credit usage analytics

👉 **Background Processing**: Inngest-powered background jobs for AI content generation, ensuring responsive user experience while processing intensive AI requests.

👉 **Responsive Design**: Modern, dark/light theme-compatible UI that works seamlessly across desktop, tablet, and mobile devices.

👉 **Authentication & Security**: Secure authentication with Clerk, including social login options and user management.

## 🛠️ System Architecture

### Core Workflows

1. **Course Creation Flow**:
   - User inputs topic and difficulty level
   - AI generates course outline with chapters and topics
   - Background job processes detailed content generation
   - Content is progressively made available as it's generated

2. **Study Material Processing**:
   - Inngest background jobs handle AI content generation
   - Multiple AI models for different content types (notes, quiz, Q&A)
   - Parallel processing for optimal performance

3. **YouTube Recommendations**:
   - Course topics are converted to embeddings using Gemini
   - YouTube search results are matched using cosine similarity
   - Recommendations are cached for performance

4. **Marketplace System**:
   - Users can publish courses publicly
   - SEO-friendly public URLs with course slugs
   - Upvoting and favoriting system

## 🚀 Quick Start

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (version 18.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)


### Installation

Install dependencies using npm or use pnpm:

```bash
npm install
```
or

```bash
pnpm install
```


### Environment Setup

1. Create a `.env` file in the root directory by copying from `.env.example`:

```bash
cp .env.example .env
```

2. Fill in all the required environment variables in your `.env` file. See the [Environment Variables](#environment-variables) section below for detailed instructions on obtaining each key.

### Database Setup

1. **Set up PostgreSQL Database**:
   - Create a free PostgreSQL database on [Neon](https://neon.tech/)
   - Copy the connection string to your `.env` file

2. **Run Database Migrations**:

```bash
npx drizzle-kit push
```

### Required External Services Setup

#### 1. Authentication (Clerk)
- Sign up at [Clerk](https://clerk.com/)
- Create a new application
- Copy the publishable key and secret key to your `.env` file
- Set up webhooks for user management (optional but recommended)

#### 2. AI Integration (Google Gemini)
- Go to [Google AI Studio](https://aistudio.google.com/)
- Create a new API key for Gemini
- Add the API key to your `.env` file
- Consider setting up multiple API keys for rate limiting

#### 3. Payment Processing (Stripe)
- Create account at [Stripe](https://stripe.com/)
- Get your secret key from the dashboard
- Create a product and price for monthly subscription
- Copy the price ID to your `.env` file

#### 4. YouTube Integration
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Enable YouTube Data API v3
- Create credentials and get API key
- Add to your `.env` file

#### 5. Background Jobs (Inngest)
- Sign up at [Inngest](https://inngest.com/)
- Create a new app and get signing key
- Add to your `.env` file

### Running the Application

1. **Start the development server**:

```bash
npm run dev
```

2. **Start Inngest background job processor** (in a separate terminal):

```bash
npx inngest-cli@latest dev
```

**Important**: Both commands must be running simultaneously for the application to work properly. The Inngest CLI handles background job processing for AI content generation.

3. Open your browser and navigate to `http://localhost:3000`

## 🔐 Environment Variables

All required environment variables with descriptions:

### Authentication (Clerk)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key  
- `CLERK_WEBHOOK_SECRET`: Webhook secret for Clerk events (optional)

### Database
- `NEXT_PUBLIC_DATABASE_CONNECTION_STRING`: PostgreSQL connection string from Neon

### AI Integration (Google Gemini)
- `NEXT_PUBLIC_GEMINI_API_KEY`: Primary Gemini API key
- `2ndNEXT_PUBLIC_GEMINI_API_KEY`: Secondary API key for rate limiting
- `3rdNEXT_PUBLIC_GEMINI_API_KEY`: Tertiary API key for rate limiting

### Payment Processing (Stripe)
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY`: Price ID for monthly subscription

### External APIs
- `YOUTUBE_API_KEY`: YouTube Data API v3 key

### Background Jobs
- `INNGEST_SIGNING_KEY`: Inngest signing key for background job processing

### Application
- `HOST_URL`: Your application URL (use `http://localhost:3000/` for development)

## 🎯 Usage Guide

### Creating Your First Course

1. **Sign up/Login**: Use the authentication system powered by Clerk
2. **Access Dashboard**: Navigate to your personal dashboard
3. **Create Course**: Click "Create New Course"
4. **Input Details**: 
   - Enter your topic (be specific for better results)
   - Select difficulty level (Easy, Medium, Hard)
5. **Wait for Generation**: AI will create your course structure
6. **Study**: Access notes, flashcards, quiz, and Q&A sections

### Study Modes Explained

- **📝 Notes**: Comprehensive, AI-generated study notes for each chapter
- **🔄 Flashcards**: Interactive cards with front/back content for memorization
- **❓ Quiz**: Multiple-choice questions with instant feedback
- **💬 Q&A**: Question-answer pairs for deeper understanding

### Marketplace Features

- **Publish**: Make your courses available to the community
- **Discover**: Browse courses created by other users
- **Engage**: Upvote helpful content and save favorites
- **Share**: Each public course gets a unique, SEO-friendly URL

## 🏗️ Project Structure

```
studdy-buddy/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── courses/              # Course management
│   │   ├── generate-course-outline/ # AI course generation
│   │   ├── payment/              # Stripe integration
│   │   ├── youtube-recommendations/ # YouTube API
│   │   └── ...
│   ├── dashboard/                # Authenticated user area
│   │   ├── course/[courseId]/    # Individual course pages
│   │   ├── create/               # Course creation
│   │   ├── marketplace/          # Course discovery
│   │   └── upgrade/              # Payment pages
│   ├── public/[slug]/            # Public course pages
│   └── _context/                 # React context
├── components/                   # Reusable UI components
│   └── ui/                       # Shadcn/ui components
├── configs/                      # Configuration files
│   ├── AiModel.js               # AI model configurations
│   ├── db.js                    # Database connection
│   └── schema.js                # Database schema
├── inngest/                     # Background job functions
├── lib/                         # Utility functions
└── public/                      # Static assets
```

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start Inngest background jobs (separate terminal)
npx inngest-cli@latest dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Database operations
npx drizzle-kit push          # Push schema changes
npx drizzle-kit studio        # Open database studio
```

## 🔄 Background Jobs

The application uses Inngest for reliable background job processing:

- **Course Generation**: AI content creation happens in background
- **Content Processing**: Notes, flashcards, quizzes generated asynchronously  
- **Error Handling**: Automatic retries and error recovery
- **Status Updates**: Real-time status updates for users

**Important**: Always run `npx inngest-cli@latest dev` in a separate terminal during development.

## 🎨 UI/UX Features

- **Modern Design**: Clean, minimalist interface with focus on readability
- **Dark/Light Theme**: Automatic theme switching with user preference
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: User-friendly error messages and retry mechanisms
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 📊 Credit System

- **Free Tier**: 2 credits for new users
- **Credit Usage**: 1 credit per course generation
- **Premium Plan**: Unlimited credits with monthly subscription
- **Credit Tracking**: Real-time credit balance in dashboard

## 🔒 Security Features

- **Authentication**: Secure authentication with Clerk
- **API Protection**: Route protection for authenticated endpoints
- **Environment Variables**: Sensitive data stored securely
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Input Validation**: Server-side validation for all user inputs

## 🚦 Troubleshooting

### Common Issues

1. **Inngest not working**: Ensure `npx inngest-cli@latest dev` is running
2. **AI generation fails**: Check Gemini API key and quota limits
3. **YouTube recommendations not loading**: Verify YouTube API key
4. **Payment issues**: Confirm Stripe configuration
5. **Database errors**: Check PostgreSQL connection string

### Performance Tips

- Use multiple Gemini API keys for better rate limiting
- Monitor credit usage to avoid hitting API limits
- Cache YouTube recommendations to reduce API calls
- Optimize database queries for better performance

### Applcation core features

Home Page

Acts as the entry point, showing key highlights, featured courses, and quick access to major sections of the app.

Dashboard

Displays personalized progress, enrolled courses, stats, and shortcuts to learning tools and content creation features.

Marketplace

A browsing hub where users can explore, search, and purchase courses created by others.

Upgrade Page

Presents subscription options, premium benefits, and plan comparisons for unlocking advanced features.

Create Course Page

A workspace for building full courses—add modules, lessons, notes, flashcards, quizzes, and publish everything in one place.

Course Page

Central spot for navigating through a course’s materials, tracking progress, and accessing all embedded learning tools.

Notes View

Provides an organized place to write, edit, and review course notes with a clean, structured editor.

Flashcards View

Shows study flashcards for quick memorization, practice, and spaced-repetition-style review.

Q&A View

A question-and-answer section where users can create, review, and practice concept-checking questions.

Quiz View

Interactive quizzes that evaluate understanding through timed questions and show score breakdowns afterward.

Public Course Page

A public-facing course preview that showcases content, curriculum, ratings, and purchase/enrollment options for visitors.


# Demo Video: 

click the below link to view

https://drive.google.com/file/d/1zPSpcE3bP-7gOV84DopTOdkd0aKhEE8u/view?usp=sharing


Developed by Magesh Ambikapathi
