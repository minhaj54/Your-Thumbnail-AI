# 🚀 Installation Guide

This guide will help you set up the Thumbnail Builder SAAS application on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)
- **PostgreSQL** database (optional for full functionality)

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd thumbnail-builder
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# Google Gemini API (Required)
GOOGLE_API_KEY="your-gemini-api-key"

# Database (Optional for MVP)
DATABASE_URL="postgresql://username:password@localhost:5432/thumbnail_builder"

# NextAuth.js (Optional for MVP)
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (Optional for MVP)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Cloudinary (Optional for MVP)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 4. Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and add it to your `.env.local` file

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 MVP Features Available

The current MVP includes:

- ✅ **Homepage** - Landing page with features and pricing
- ✅ **Image Generation** - AI-powered thumbnail creation
- ✅ **Demo Page** - Interactive demonstration
- ✅ **Authentication UI** - Sign up and sign in pages
- ✅ **Dashboard** - User dashboard with image gallery
- ✅ **API Integration** - Google Gemini API integration
- ✅ **Responsive Design** - Mobile-friendly interface

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📁 Project Structure

```
thumbnail-builder/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── generate/          # Image generation
│   │   ├── demo/              # Demo page
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   ├── lib/                   # Utility functions
│   │   └── gemini.ts          # Gemini API client
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # State management
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── prisma/                    # Database schema
├── .env.local                 # Environment variables
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔍 Troubleshooting

### Common Issues

**1. Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. Environment variables not loading**
- Make sure your `.env.local` file is in the root directory
- Restart your development server after adding new variables
- Check that variable names match exactly

**3. API key issues**
- Verify your Google Gemini API key is correct
- Check that the API key has the necessary permissions
- Ensure you're not exceeding API rate limits

**4. Build errors**
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint
```

### Getting Help

- Check the [README.md](./README.md) for detailed documentation
- Review the [Next.js documentation](https://nextjs.org/docs)
- Check [Google Gemini API documentation](https://ai.google.dev/docs)

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/app/globals.css` for global styles
- Use Tailwind classes for component styling

### Features
- Add new pages in `src/app/`
- Create components in `src/components/`
- Add API routes in `src/app/api/`

### Database
- Update `prisma/schema.prisma` for database schema
- Run `npx prisma generate` after schema changes
- Use `npx prisma studio` to view data

## 📈 Next Steps

After setting up the MVP, consider implementing:

1. **Database Integration** - Add Prisma and PostgreSQL
2. **User Authentication** - Implement NextAuth.js
3. **Payment Processing** - Add Stripe integration
4. **Image Storage** - Integrate Cloudinary
5. **Advanced Features** - Batch processing, templates, etc.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy coding! 🎉**
