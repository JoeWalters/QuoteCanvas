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
- **Font Size**: 24px to 120px with live preview
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

### Core Technologies
- **Pure JavaScript ES6+**: No frameworks required, modern class-based architecture
- **HTML5 Canvas API**: High-quality image generation with precise text rendering
- **CSS3**: Modern responsive design with Flexbox and CSS Grid
- **JSZip Library**: Efficient batch download as ZIP archives

### Memory Optimization
- **LRU Cache System**: Keeps only 10 background images in memory simultaneously
- **Lazy Loading**: Background images loaded on-demand during generation
- **Smart Thumbnails**: Compressed 100x100px previews for UI (JPEG, 70% quality)
- **Aggressive Cleanup**: Immediate canvas and object URL disposal after use
- **Memory Footprint**: ~100MB peak usage (vs 3GB+ without optimization)

### Performance Features
- **Single-Threaded Processing**: Avoids browser freezing with setTimeout yielding
- **Progressive Generation**: One image at a time with progress tracking
- **Garbage Collection Hints**: Explicit memory cleanup suggestions to browser
- **Error Recovery**: Continues processing even if individual images fail

### Browser Processing
- **Local Processing**: All operations happen in your browser
- **No Server Required**: Works completely offline once loaded
- **File API Integration**: Direct file handling without uploads
- **Canvas-to-Blob**: Efficient image export without quality loss

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

## ⚡ Performance Specifications

### Tested Scale
- **✅ 719 quotes + 132 HD backgrounds**: Processes smoothly without memory issues
- **✅ Memory Usage**: Peak ~100MB (down from 3GB+ in previous versions)
- **✅ Browser Stability**: No freezing or crashes during large batch processing
- **✅ Background Cycling**: Reliable distribution across all images

### Memory Requirements
- **Recommended RAM**: 8GB+ (application uses ~100MB peak)
- **Browser**: Modern browser with Canvas API support
- **Storage**: ~10MB per 100 generated HD images

## 🚀 Quick Examples

### Basic Usage (Small Scale)
1. Open `index.html` in your browser
2. Paste 10-20 quotes in the text area
3. Click "Generate All Images"
4. Download your styled quote images!

### Advanced Usage (Large Scale)
1. Upload a JSON file with 500+ quotes
2. Upload 50-100+ HD background images
3. Customize typography with drop shadows and effects
4. Preview quotes with different backgrounds
5. Generate all images (processes efficiently in background)
6. Download complete collection as ZIP file

### Memory-Efficient Workflow
1. **Upload backgrounds first**: Thumbnails are created automatically
2. **Select background**: Click thumbnail to preview with current quote
3. **Batch generate**: System automatically cycles through all backgrounds
4. **Monitor progress**: Real-time progress bar and console logging
5. **Memory cleanup**: Automatic cleanup prevents memory leaks

## 🎯 Perfect For

### Content Creation
- **Social media managers**: Generate hundreds of quote graphics
- **Motivational accounts**: Scale content creation with consistent branding
- **Educational content**: Create learning materials with custom backgrounds
- **Marketing campaigns**: Branded quote graphics for social media

### Large-Scale Projects
- **Book publishers**: Generate quote graphics from entire book collections
- **Quote databases**: Transform large quote collections into visual content
- **Motivational apps**: Backend content generation for mobile applications
- **Print materials**: High-resolution graphics for physical media

### Technical Use Cases
- **Batch processing**: Handle large datasets without manual intervention
- **Memory-constrained environments**: Process large collections on standard hardware
- **Offline processing**: Generate content without internet connectivity
- **Quality consistency**: Maintain uniform styling across hundreds of images

## 🔧 Troubleshooting

### Memory Issues
- **High RAM usage**: The app now uses <100MB peak (down from 3GB+)
- **Browser freezing**: Single-threaded processing prevents freezing
- **Background loss**: Smart caching ensures consistent background availability

### Performance Tips
- **Large collections**: Process in smaller batches if needed (though 700+ quotes work fine)
- **HD images**: App handles HD backgrounds efficiently with lazy loading
- **Progress monitoring**: Watch console logs for detailed processing information

### Browser Compatibility
- **Chrome 80+**: Full feature support with optimal performance
- **Firefox 75+**: Complete functionality with good performance
- **Safari 13+**: Works well, may be slightly slower on very large batches
- **Edge 80+**: Full compatibility and performance

---

Made with ❤️ for quote lovers everywhere!

**Scale your quote graphics from dozens to hundreds without compromise.**
