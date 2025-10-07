# QuoteCanvas 🎨

Transform your quotes into stunning, professional images with QuoteCanvas - a comprehensive web application featuring advanced design tools, background effects, and efficient batch processing.

## ✨ Features

### 🎯 Streamlined 4-Step Workflow
- **Step 1 - Content**: Upload quotes via text/JSON files or direct input with custom naming schemes
- **Step 2 - Design**: Professional typography controls with 6+ font families and full styling options  
- **Step 3 - Effects**: Advanced background effects, filters, and visual enhancements
- **Step 4 - Generate & Export**: Live preview, batch generation, and multiple export formats

### 🎨 Advanced Design System
- **Background Image Effects & Filters**: Blur, brightness, contrast, sepia, grayscale, and more
- **Professional Typography**: Inter, Playfair Display, Roboto, and system fonts with full weight control
- **Text Effects**: Drop shadows, outlines, glow effects with customizable colors and opacity
- **Visual Effects**: Overlay opacity, background color fallbacks, and real-time preview

### 📁 Flexible Content Management  
- **Multiple Input Methods**: Text files, JSON files, or direct text input
- **Smart Photo Naming**: Customizable filename schemes with quote text, numbers, and timestamps
- **Drag & Drop Support**: Intuitive file handling for quotes and background images
- **Content Organization**: Accordion-style controls for advanced options

### 🚀 Enhanced Export & Generation
- **Multiple Export Formats**: PNG, JPEG, WebP with quality controls
- **ZIP Compression**: Configurable compression levels (1-9) for batch downloads
- **Live Preview System**: Zoom controls (25%-200%), fullscreen mode, and navigation
- **Pause/Resume Generation**: Full control over batch processing with progress tracking

### 🌟 Modern User Experience
- **Dark Mode Theme**: Professional dark theme with smooth transitions and eye-friendly colors
- **Touch-Friendly Interface**: Optimized controls for mobile and tablet devices (enabled by default)
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Settings Persistence**: Automatic saving of preferences with export/import functionality
- **Performance Monitoring**: Real-time memory usage tracking and generation statistics

### ⚡ Performance & Technical Features
- **Memory-Efficient Processing**: Handle hundreds of HD backgrounds with smart caching (LRU system)
- **Background Effects Processing**: Real-time CSS filter effects with live preview
- **Drag & Drop Enhancements**: Visual feedback and multi-file support
- **Quick Actions**: Random quote navigation, settings duplication, and effect resets

## 🚀 Getting Started

### Using Pre-built Docker Image

The easiest way to run QuoteCanvas is using our pre-built Docker image from Docker Hub:

```bash
# Run the latest version
docker run -p 8000:8000 joewalters/quotecanvas:latest

# Or run in detached mode
docker run -d -p 8000:8000 --name quotecanvas joewalters/quotecanvas:latest

# Run a specific timestamped version
docker run -p 8000:8000 joewalters/quotecanvas:251007143022
```

**Available Tags:**
- `latest` - Most recent stable version
- `YYMMDDHHmmss` - Timestamped versions (e.g., `251007143022` for Oct 7, 2025 at 14:30:22)

### 💻 Local Development

**Prerequisites:**
- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- No installation required - runs entirely in your browser!
- Recommended: 8GB+ RAM for large collections (app uses ~100MB peak)

### Quick Start Guide

1. **Launch the Application**
   ```bash
   # Option 1: Direct browser access
   open index.html
   
   # Option 2: Local server (recommended)
   python -m http.server 8000
   # or
   ./start-server.sh
   ```

2. **Follow the 4-Step Workflow**
   - **📄 Content**: Upload your quotes and configure naming scheme
   - **🎨 Design**: Select fonts, colors, dimensions, and styling
   - **✨ Effects**: Apply background effects, filters, and visual enhancements  
   - **🎯 Generate & Export**: Preview, generate, and download your images

3. **Advanced Features**
   - Enable dark mode with the 🌙 button
   - Access settings with ⚙️ for persistence and touch mode
   - Monitor performance with 📊 for memory and speed tracking
   - Use pause/resume during generation for full control

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

## 🎨 Comprehensive Customization

### 📐 Image & Layout Settings
- **Flexible Dimensions**: 400x400 to 2000x2000 pixels with preset options (Instagram, Facebook, Twitter, 4K)
- **Smart Background Management**: Upload unlimited HD images with intelligent caching and memory optimization
- **Background Effects**: Blur, brightness, contrast, saturation, sepia, grayscale, hue rotation, and invert filters
- **Overlay System**: Adjustable dark overlay (0-100%) for optimal text readability
- **Background Cycling**: Automatic distribution of backgrounds across large quote collections

### ✍️ Advanced Typography System
- **Premium Font Collection**: Inter, Playfair Display, Roboto, Arial, Georgia, Times New Roman
- **Complete Weight Range**: 300 (Light) to 900 (Black) with visual weight selection
- **Font Size Control**: 24px to 120px with real-time preview scaling
- **Style Controls**: Bold, Italic, Underline toggles with live preview
- **Text Alignment**: Left, Center, Right with intelligent positioning
- **Line Height**: 100%-200% spacing control for optimal readability
- **Padding System**: 20px to 100px margins with visual feedback

### 🎭 Professional Text Effects
- **Shadow Styles**: None, Subtle, Soft, Hard, Long, Glow, Outline effects
- **Color System**: Independent text, background, and shadow color controls
- **Opacity Controls**: Fine-tuned transparency for shadows and overlays (0-100%)
- **Effect Combinations**: Layer multiple effects for unique visual styles
- **Real-time Preview**: Instant visual feedback for all effect adjustments

### 📱 Export & Format Options
- **Multiple Formats**: PNG (lossless), JPEG (adjustable quality), WebP (modern efficiency)
- **Quality Controls**: JPEG quality 10%-100%, WebP quality optimization
- **ZIP Compression**: 9 compression levels for efficient batch downloads
- **Filename Schemes**: Custom naming with quote text, numbers, timestamps, and custom prefixes
- **Resolution Presets**: Social media optimized dimensions (Instagram Square/Story, Facebook Post, Twitter Card)

## 🛠️ Technical Architecture

### 🏗️ Modern Web Technologies
- **Pure JavaScript ES6+**: Class-based architecture with async/await patterns, no external frameworks
- **HTML5 Canvas API**: High-fidelity image generation with pixel-perfect text rendering
- **CSS3 Advanced Features**: CSS Grid, Flexbox, CSS Variables, and CSS Filters for background effects
- **Web APIs**: File API, localStorage, performance.memory, and Drag & Drop API integration
- **JSZip Library**: Efficient ZIP archive creation with configurable compression

### ⚡ Performance Engineering
- **LRU Cache System**: Intelligent background image caching (10-image memory limit)
- **Lazy Loading Architecture**: On-demand resource loading with smart prefetching
- **Memory Management**: Peak usage ~100MB (down from 3GB+ in earlier versions)
- **Canvas Optimization**: Immediate disposal and cleanup to prevent memory leaks
- **Progressive Processing**: Non-blocking generation with yielding to prevent UI freezing

### 🎨 Advanced Rendering Pipeline
- **Background Effects Engine**: Real-time CSS filter processing with hardware acceleration
- **Text Rendering System**: Multi-layer text effects with shadows, outlines, and glows
- **Quality Optimization**: Multiple export formats with format-specific quality controls
- **Preview System**: Live preview with zoom, fullscreen, and comparison modes
- **Effect Compositing**: Layered effect system for complex visual combinations

### 💾 Data Management & Persistence
- **Settings Persistence**: localStorage integration with export/import functionality
- **Theme System**: Dynamic theme switching with CSS custom properties
- **Touch Detection**: Adaptive UI with touch-friendly controls
- **Performance Monitoring**: Real-time memory usage and generation speed tracking
- **Error Recovery**: Graceful degradation and continuation on individual failures

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

## ⚡ Performance & Scale

### 📊 Proven Performance Metrics
- **✅ Large Scale Tested**: 719 quotes + 132 HD backgrounds processed smoothly
- **✅ Memory Efficiency**: Peak usage ~100MB (optimized from 3GB+ in earlier versions)  
- **✅ Browser Stability**: Zero freezing or crashes during extended batch processing
- **✅ Background Distribution**: Intelligent cycling ensures even distribution across collections
- **✅ Touch Performance**: Optimized touch controls with hardware acceleration
- **✅ Dark Mode Performance**: Efficient theme switching with CSS custom properties

### 💻 System Requirements
- **Recommended RAM**: 8GB+ system memory (application uses ~100MB peak)
- **Browser Support**: Modern browsers with Canvas API and ES6+ support
- **Storage Estimate**: ~10MB per 100 generated HD images (varies by format and quality)
- **Network**: No internet required after initial load (fully offline capable)

### 🔧 Performance Features
- **Pause/Resume Generation**: Full control over batch processing with memory-efficient state management
- **Real-time Monitoring**: Live memory usage tracking and generation speed metrics
- **Progressive Enhancement**: Graceful degradation on older devices
- **Lazy Loading**: Background images loaded only when needed
- **Smart Caching**: LRU cache prevents memory overflow on large collections

## 🚀 Usage Examples

### 🎯 Quick Start (Beginners)
```bash
# 1. Launch the application
./start-server.sh  # or open index.html directly

# 2. Follow the 4-step workflow
📄 Content  → Add 10-20 quotes via text input
🎨 Design   → Choose Inter font, white text, centered
✨ Effects  → Add subtle shadow and background blur
🎯 Generate → Preview, then "Generate All Images"
```

### 🏢 Professional Workflow (Content Creators)
```bash
# 1. Prepare content
Upload quotes.json (100-500 quotes)
Upload backgrounds/ folder (20-50 HD images)

# 2. Configure branding
Set custom dimensions (1080x1080 for Instagram)
Apply brand colors and premium fonts
Configure filename scheme: "quote_{number}_{date}"

# 3. Apply effects
Background blur (20%) + overlay (30%)
Text shadow (soft) + custom brand colors
Preview with zoom controls and fullscreen

# 4. Batch process
Generate all with pause/resume control
Monitor progress and memory usage
Download as WebP with high compression
```

### 🎨 Advanced Creative Process
```bash
# 1. Design exploration
Use dark mode for extended editing sessions
Enable touch mode for tablet/mobile design
Apply multiple background effects (sepia + contrast)

# 2. Quality control
Live preview with comparison mode
Test different backgrounds with same quote
Fine-tune effects with real-time feedback

# 3. Export optimization
Compare PNG vs JPEG vs WebP quality
Adjust compression for file size balance
Export settings for future projects
```

## 🎯 Use Cases & Applications

### 📱 Social Media & Content Creation
- **Instagram Creators**: Generate story and post graphics with consistent branding
- **LinkedIn Professionals**: Create motivational and educational quote graphics
- **Twitter Content**: Optimized quote cards with brand colors and fonts
- **Facebook Pages**: Engaging visual content for increased social media reach
- **YouTube Thumbnails**: Quote-based thumbnails for motivational and educational content

### 🏢 Business & Professional Applications  
- **Marketing Agencies**: Batch creation of branded quote graphics for multiple clients
- **Corporate Communications**: Internal motivational content and company values graphics
- **Event Promotions**: Speaker quotes and testimonials for conferences and events
- **E-learning Platforms**: Educational quote graphics for course materials
- **Book Marketing**: Author quote graphics for book promotion and social media

### 🎨 Creative & Artistic Projects
- **Digital Artists**: Foundation graphics for further artistic enhancement
- **Print Design**: High-resolution graphics for posters, flyers, and merchandise  
- **Web Design**: Hero images and section backgrounds for websites
- **Presentation Graphics**: Professional quote slides for business presentations
- **Personal Projects**: Custom quote art for gifts, decorations, and personal branding

### ⚡ Technical & Development Use Cases
- **API Integration**: Generate quote graphics programmatically for applications
- **Batch Processing**: Handle large quote databases efficiently
- **Offline Processing**: Generate content without internet dependency
- **Memory Optimization**: Process large collections on standard hardware
- **Quality Consistency**: Maintain uniform styling across hundreds of images

## 🔧 Advanced Configuration & Troubleshooting

### ⚙️ Settings & Customization
- **Settings Persistence**: All preferences auto-saved to localStorage with export/import
- **Touch Mode**: Toggle touch-friendly interface (enabled by default)
- **Dark Mode**: Professional dark theme with system preference detection
- **Preview Quality**: Adjustable rendering quality (Low/Medium/High) for performance tuning
- **Performance Monitoring**: Real-time memory and speed tracking with detailed metrics

### 🐛 Common Issues & Solutions
- **Memory Optimization**: App uses <100MB peak (optimized from 3GB+), no manual intervention needed
- **Browser Performance**: Pause/resume functionality prevents freezing on large batches
- **Background Management**: Smart LRU caching ensures backgrounds remain available
- **Touch Responsiveness**: Hardware-accelerated touch controls with fallback support
- **Export Quality**: Format-specific optimization (PNG lossless, JPEG quality control, WebP efficiency)

### 🌐 Browser Compatibility Matrix
| Browser | Version | Features | Performance | Notes |
|---------|---------|----------|-------------|-------|
| **Chrome** | 80+ | ✅ Full | ⭐⭐⭐⭐⭐ | Optimal performance, all features |
| **Firefox** | 75+ | ✅ Full | ⭐⭐⭐⭐ | Complete functionality, good performance |
| **Safari** | 13+ | ✅ Full | ⭐⭐⭐ | All features, slightly slower on large batches |
| **Edge** | 80+ | ✅ Full | ⭐⭐⭐⭐⭐ | Full compatibility, excellent performance |

### 🚀 Performance Optimization Tips
- **Large Collections**: Use pause/resume for control over processing (700+ quotes tested successfully)
- **HD Backgrounds**: Lazy loading and smart caching handle HD images efficiently  
- **Effect Processing**: Real-time effects use hardware acceleration when available
- **Memory Monitoring**: Use performance panel (📊) to track usage and optimize workflows
- **Export Efficiency**: Choose appropriate format (WebP for web, PNG for quality, JPEG for compatibility)

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/QuoteCanvas.git
   cd QuoteCanvas
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex functionality
   - Test across different browsers

4. **Commit and push**
   ```bash
   git commit -m 'Add amazing new feature'
   git push origin feature/amazing-new-feature
   ```

5. **Open a Pull Request**
   - Describe your changes clearly
   - Include screenshots for UI changes
   - Reference any related issues

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for creators, marketers, and quote enthusiasts everywhere!**

### 🌟 Transform your quotes into professional graphics at scale 🌟

*From simple text to stunning visuals - QuoteCanvas makes it effortless.*

[![GitHub stars](https://img.shields.io/github/stars/yourusername/QuoteCanvas?style=social)](https://github.com/yourusername/QuoteCanvas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>
