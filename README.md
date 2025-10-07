# QuoteCanvas 🎨

Transform your quotes into beautiful, shareable images with QuoteCanvas - a memory-efficient web application for generating stylish quote graphics at scale.

## ✨ Features

- **Multiple Input Methods**: Upload text files, JSON files, or paste quotes directly
- **Memory-Efficient Processing**: Handle hundreds of HD background images without performance issues
- **Smart Background Cycling**: Automatically cycles through backgrounds for large quote collections
- **Custom Background Images**: Upload your own HD background images with intelligent caching
- **Flexible Dimensions**: Choose custom image dimensions (400px - 2000px)
- **Advanced Typography Control**: 
  - Multiple font families and weights
  - Bold, italic, and underline styling
  - Drop shadows with customizable opacity and colors
  - Text outlines and glow effects
- **Real-time Preview**: See your changes instantly with live preview and background selection
- **Scalable Batch Generation**: Generate hundreds of images efficiently with progress tracking
- **Export Options**: Download individual images or all images as a ZIP file

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required - runs directly in your browser!

### Usage

1. **Open the Application**
   - Simply open `index.html` in your web browser
   - Or serve it from a local web server for best performance

2. **Add Your Quotes**
   - Upload a text file (one quote per line)
   - Upload a JSON file with quotes array
   - Or paste quotes directly into the text area

3. **Customize Your Design**
   - Set image dimensions
   - Choose fonts and colors
   - Upload background images (optional)
   - Adjust padding and alignment

4. **Generate Images**
   - Preview your design in real-time
   - Generate all images at once
   - Or create individual images
   - Download as PNG files or ZIP archive

## 📁 Supported File Formats

### Text Files (.txt)
```
This is my first quote
This is my second quote
This is my third quote
```

### JSON Files (.json)
```json
[
  "First quote as a string",
  "Second quote as a string"
]
```

Or with objects:
```json
{
  "quotes": [
    {"text": "First quote"},
    {"quote": "Second quote"},
    {"content": "Third quote"}
  ]
}
```

## 🎨 Customization Options

### Image Settings
- **Dimensions**: 400x400 to 2000x2000 pixels with real-time preview scaling
- **Backgrounds**: Upload unlimited HD images with smart memory management
- **Background Cycling**: Automatically distributes backgrounds across all quotes
- **Overlay Opacity**: Adjustable dark overlay for better text readability (0-100%)

### Typography Controls
- **Fonts**: Inter, Playfair Display, Roboto, Arial, Georgia, Times New Roman
- **Font Weights**: 100 (Thin) to 900 (Black)
- **Font Size**: 24px to 80px with live preview
- **Font Styles**: Bold, Italic, Underline toggles
- **Text Alignment**: Left, Center, Right
- **Line Height**: Adjustable spacing between lines (1.0x to 2.0x)
- **Padding**: 20px to 100px margins

### Text Effects
- **Drop Shadows**: Subtle, Soft, Hard, Long shadow styles
- **Text Glow**: Luminous glow effect using text color
- **Text Outline**: Customizable stroke around text
- **Shadow Colors**: Full color picker for shadow effects
- **Shadow Opacity**: 0-100% transparency control

### Colors
- **Text Color**: Full color picker with hex support
- **Background Color**: Solid color fallback option
- **Shadow Color**: Independent shadow color selection

## 🛠️ Technical Details

- **Pure JavaScript**: No frameworks required
- **HTML5 Canvas**: For image generation
- **Local Processing**: All processing happens in your browser
- **No Server Required**: Works offline once loaded
- **Modern CSS**: Responsive design with CSS Grid and Flexbox

## 📱 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Quick Examples

### Basic Usage
1. Open `index.html` in your browser
2. Paste some quotes in the text area
3. Click "Generate All Images"
4. Download your styled quote images!

### Advanced Usage
1. Upload a JSON file with your quotes
2. Upload background images
3. Customize fonts, colors, and dimensions
4. Preview each quote individually
5. Generate and download as ZIP

## 🎯 Perfect For

- Social media content creators
- Motivational quote accounts
- Book clubs and reading groups
- Educational content
- Marketing materials
- Personal projects

---

Made with ❤️ for quote lovers everywhere!
Create images with text overlay
