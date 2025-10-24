# 🍌 Gemini Image Editor - Nano Banana

A barebones vanilla JavaScript app that allows users to drag and drop an image file onto a web page and use Gemini's new Nano Banana image model (Gemini 2.5 Flash Image Preview) to modify that image based on a user prompt.

## ✨ Features

- **Drag & Drop Interface**: Simply drag an image onto the web page
- **AI Image Modification**: Use Gemini's 2.5 Flash Image model to modify images
- **Multiple Aspect Ratios**: Support for 16:9, 1:1, 4:3, 9:16, and 21:9
- **Real-time Preview**: See your uploaded image before modification
- **Vanilla JavaScript**: No frameworks, just pure JavaScript
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

1. **Get a Google Gemini API Key**:
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Create a new API key
   - Copy the key for use in the app

2. **Run the App**:
   ```bash
   npm start
   ```
   Or simply:
   ```bash
   node server.js
   ```

3. **Open Your Browser**:
   - Go to `http://localhost:8080`
   - Enter your Gemini API key
   - Upload an image by dragging and dropping
   - Enter a modification prompt
   - Click "Generate Modified Image"

## 🎯 How to Use

1. **Enter API Key**: Paste your Google Gemini API key in the input field
2. **Upload Image**: Drag and drop an image file onto the upload area
3. **Write Prompt**: Describe how you want to modify the image (e.g., "Make it look like a painting", "Add a sunset background")
4. **Select Aspect Ratio**: Choose the desired output aspect ratio
5. **Generate**: Click the "Generate Modified Image" button
6. **View Result**: The modified image will appear below

## 🔧 Technical Details

### API Integration
- Uses the [Gemini 2.5 Flash Image API](https://ai.google.dev/gemini-api/docs/image-generation)
- Supports image-to-image editing with text prompts
- Handles base64 image encoding automatically
- Includes proper error handling and loading states

### Supported Features
- **Image Formats**: PNG, JPEG, GIF, WebP
- **Aspect Ratios**: 16:9, 1:1, 4:3, 9:16, 21:9
- **File Size**: Up to 10MB per image
- **Browser Support**: Modern browsers with ES6+ support

### API Endpoint
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent
```

## 📝 Example Prompts

- "Make this image look like a watercolor painting"
- "Add a dramatic sunset background"
- "Change the colors to blue and green"
- "Make it look like a vintage photograph"
- "Add a cyberpunk aesthetic"
- "Transform this into a cartoon style"
- "Add a neon glow effect"
- "Make it look like a movie poster"

## 🛠️ Development

### File Structure
```
├── index.html          # Main HTML file with embedded CSS and JavaScript
├── server.js           # Simple HTTP server
├── package.json        # Node.js dependencies
└── README.md          # This file
```

### Customization
- Modify the CSS in the `<style>` section of `index.html`
- Update the JavaScript in the `<script>` section
- Change the server port in `server.js`

## 🔒 Security Notes

- API keys are stored locally in the browser (not sent to any server)
- Images are processed directly by Google's Gemini API
- No data is stored on the local server
- Use HTTPS in production for secure API key transmission

## 🐛 Troubleshooting

### Common Issues

1. **"API request failed"**: Check your API key and ensure it has image generation permissions
2. **"No image data found"**: The Gemini API might not be available in your region
3. **CORS errors**: Make sure you're running the local server (not opening the HTML file directly)
4. **File upload issues**: Ensure you're uploading a valid image file

### Browser Console
Check the browser console (F12) for detailed error messages.

## 📚 API Documentation

For more information about the Gemini API, visit:
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs/image-generation)
- [Google AI Studio](https://aistudio.google.com/)

## 🎨 Screenshots

The app features:
- Clean, modern interface with gradient backgrounds
- Drag-and-drop upload area with visual feedback
- Real-time image preview
- Loading states and error handling
- Responsive design for all screen sizes

## 📄 License

MIT License - feel free to use and modify as needed.

---

**Note**: This app requires a valid Google Gemini API key with image generation permissions. The API key is used directly in the browser and is not stored on any server.