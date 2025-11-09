# 🍌 Thumbnail Builder SAAS - Powered by Gemini AI

A professional SAAS platform for creating stunning thumbnails and cover images using Google's Gemini 2.5 Flash Image AI. Upload your images, describe your vision, and watch AI create perfect visuals for YouTube, blogs, social media, and more.

## ✨ Features

### 🤖 **AI-Powered Image Generation**
- **Gemini 2.5 Flash Image**: Uses Google's most advanced image generation model
- **Face Preservation**: Upload photos and AI preserves faces while enhancing the image
- **Smart Prompt Enhancement**: AI automatically improves your prompts for better results
- **Multiple Aspect Ratios**: Support for 16:9, 1:1, 4:3, 9:16, 21:9

### 🎨 **Professional Design Tools**
- **Drag & Drop Interface**: Easy image upload with visual feedback
- **Real-time Preview**: See your images before and after AI processing
- **Style Options**: Realistic, artistic, minimalist, vibrant, professional
- **Quality Control**: Standard and high-quality output options

### 🚀 **SAAS Features**
- **User Authentication**: Secure signup and login system
- **Dashboard**: Manage your generated images and projects
- **API Integration**: RESTful API for developers
- **Responsive Design**: Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd thumbnail-builder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   GOOGLE_API_KEY=your-gemini-api-key-here
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Go to `http://localhost:3000`

## 🎯 How to Use

### 1. **Get Started**
- Visit the homepage to learn about features
- Click "Start Creating" to begin
- Sign up for a free account

### 2. **Create Thumbnails**
- **Upload Images**: Drag and drop images or click to browse
- **Write Prompts**: Describe how you want to modify the image
- **Choose Settings**: Select style, aspect ratio, and quality
- **Generate**: Click "Generate Thumbnail" and watch AI work its magic

### 3. **Example Prompts**
- "Make this look like a movie poster"
- "Add a dramatic sunset background"
- "Transform into a watercolor painting"
- "Create a cyberpunk aesthetic"
- "Make it look like a vintage photograph"

## 🔧 Technical Architecture

### **Frontend**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons

### **Backend**
- **Next.js API Routes**: Serverless API endpoints
- **Google Gemini API**: AI image generation
- **FormData Handling**: File upload processing
- **Base64 Encoding**: Image data transmission

### **AI Integration**
- **Model**: `gemini-2.5-flash-image`
- **Features**: Image-to-image editing, face preservation
- **Aspect Ratios**: Full support for all standard ratios
- **Error Handling**: Graceful fallbacks and user feedback

## 📁 Project Structure

```
thumbnail-builder/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/
│   │   │   │   ├── image/route.ts          # Main image generation API
│   │   │   │   └── face-preservation/route.ts  # Face preservation API
│   │   │   └── enhance-prompt/route.ts     # AI prompt enhancement
│   │   ├── generate/page.tsx               # Main generation interface
│   │   ├── dashboard/page.tsx              # User dashboard
│   │   ├── auth/                           # Authentication pages
│   │   └── page.tsx                        # Homepage
│   ├── lib/
│   │   └── gemini.ts                       # Gemini AI integration
│   └── components/                         # Reusable components
├── examples/
│   └── vanilla-js-editor/                  # Standalone vanilla JS example
├── public/                                 # Static assets
└── prisma/                                 # Database schema
```

## 🔌 API Endpoints

### **Image Generation**
```http
POST /api/generate/image
Content-Type: multipart/form-data

Parameters:
- prompt: string (required)
- style: 'realistic' | 'artistic' | 'minimalist' | 'vibrant' | 'professional'
- aspectRatio: '16:9' | '1:1' | '4:3' | '9:16' | '21:9'
- size: 'small' | 'medium' | 'large'
- quality: 'standard' | 'high'
- images: File[] (optional)
```

### **Face Preservation**
```http
POST /api/generate/face-preservation
Content-Type: multipart/form-data

Same parameters as above, with enhanced face preservation processing
```

### **Prompt Enhancement**
```http
POST /api/enhance-prompt
Content-Type: application/json

{
  "prompt": "your prompt here",
  "style": "professional",
  "aspectRatio": "16:9"
}
```

## 🎨 Examples

### **Vanilla JavaScript Editor**
A standalone example is available in `examples/vanilla-js-editor/`:
- Pure JavaScript implementation
- No framework dependencies
- Direct Gemini API integration
- Perfect for learning and testing

## 🔒 Security & Privacy

- **API Keys**: Stored securely in environment variables
- **User Data**: No personal data stored on servers
- **Image Processing**: Images processed directly by Google's API
- **HTTPS**: Secure transmission in production

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### **Other Platforms**
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **DigitalOcean**: VPS deployment

## 🐛 Troubleshooting

### **Common Issues**

1. **"API request failed"**: 
   - Check your Google Gemini API key
   - Ensure image generation permissions are enabled

2. **"No image data found"**: 
   - Gemini image generation might not be available in your region
   - Check API key permissions

3. **CORS errors**: 
   - Ensure you're running the development server
   - Check API endpoint configurations

4. **Payment Issues - "payment_session_id is not present or is invalid"**:
   - See [START_HERE.md](START_HERE.md) for complete payment debugging guide
   - Run `node verify-env.js` to check local setup
   - Visit `/api/cashfree/diagnose` on deployed site to test configuration
   - Refer to [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for step-by-step deployment

### **Getting Help**
- Check the browser console (F12) for detailed errors
- Review the API documentation
- Check your environment variables

### **Payment Debugging Resources**
- 📖 [START_HERE.md](START_HERE.md) - Quick start guide for fixing payment issues
- ✅ [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Deployment checklist
- 🔍 [PAYMENT_DEBUG_GUIDE.md](PAYMENT_DEBUG_GUIDE.md) - Detailed troubleshooting
- 📝 [PAYMENT_FIX_SUMMARY.md](PAYMENT_FIX_SUMMARY.md) - Summary of changes made
- 🛠️ `verify-env.js` - Local environment verification script

## 📚 Documentation

- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs/image-generation)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Google Gemini Team**: For the amazing AI image generation technology
- **Next.js Team**: For the excellent React framework
- **Tailwind CSS**: For the utility-first CSS framework

---

**Ready to create amazing thumbnails?** [Get started now](http://localhost:3000) 🚀