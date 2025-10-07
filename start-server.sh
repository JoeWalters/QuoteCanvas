#!/bin/bash

# QuoteCanvas Local Development Server
# Simple Python HTTP server for local development

echo "🎨 Starting QuoteCanvas Development Server..."
echo "📁 Serving files from current directory"
echo "🌐 Open your browser to: http://localhost:8000"
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m http.server 8000
else
    echo "❌ Python not found. Please install Python or open index.html directly in your browser."
    echo "💡 Alternatively, you can use any other local server like:"
    echo "   - npx serve"
    echo "   - php -S localhost:8000"
    echo "   - Live Server extension in VS Code"
fi