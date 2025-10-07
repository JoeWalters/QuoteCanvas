// Web Worker for generating quote images
self.onmessage = async function(e) {
    const { quotes, settings, startIndex, endIndex, backgroundImages } = e.data;
    
    console.log(`Worker received: ${quotes.length} quotes, ${backgroundImages ? backgroundImages.length : 0} backgrounds`);
    
    // Create an offscreen canvas
    const canvas = new OffscreenCanvas(settings.width, settings.height);
    const ctx = canvas.getContext('2d');
    
    const results = [];
    
    try {
        // Process the assigned range of quotes
        for (let i = startIndex; i < endIndex; i++) {
            const quote = quotes[i - startIndex]; // Adjust index for the slice
            const actualIndex = i; // Keep original index for background cycling
            
            // Draw the quote image
            drawQuoteImage(ctx, canvas, quote, settings, backgroundImages, actualIndex);
            
            // Convert to blob
            const blob = await canvas.convertToBlob({ type: 'image/png' });
            
            results.push({
                index: actualIndex,
                blob: blob,
                quote: quote,
                filename: `quote-${actualIndex + 1}.png`
            });
            
            // Send progress update
            self.postMessage({
                type: 'progress',
                completed: results.length,
                total: endIndex - startIndex
            });
        }
        
        // Send complete results
        self.postMessage({
            type: 'complete',
            results: results
        });
        
    } catch (error) {
        self.postMessage({
            type: 'error',
            error: error.message
        });
    }
};

function drawQuoteImage(ctx, canvas, quote, settings, backgroundImages, quoteIndex) {
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    if (backgroundImages && backgroundImages.length > 0) {
        // Select background image for this quote
        const bgIndex = quoteIndex % backgroundImages.length;
        const bgImageData = backgroundImages[bgIndex];
        
        // Create image from ImageData
        const bgCanvas = new OffscreenCanvas(bgImageData.width, bgImageData.height);
        const bgCtx = bgCanvas.getContext('2d');
        bgCtx.putImageData(bgImageData, 0, 0);
        
        ctx.drawImage(bgCanvas, 0, 0, width, height);
        
        // Add overlay for text readability
        const overlayOpacity = settings.overlayOpacity / 100;
        ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
        ctx.fillRect(0, 0, width, height);
    } else {
        // Solid background color
        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, width, height);
    }
    
    // Apply text shadow
    applyTextShadow(ctx, settings);
    
    // Set up text properties
    let fontStyle = '';
    if (settings.italic) {
        fontStyle += 'italic ';
    }
    
    ctx.fillStyle = settings.textColor;
    ctx.font = `${fontStyle}${settings.fontWeight} ${settings.fontSize}px "${settings.fontFamily}"`;
    ctx.textAlign = settings.textAlign;
    ctx.textBaseline = 'middle';
    
    // Text wrapping
    const maxWidth = width - (settings.padding * 2);
    const lines = wrapText(ctx, quote, maxWidth);
    const lineHeight = settings.fontSize * settings.lineHeightMultiplier;
    const totalTextHeight = lines.length * lineHeight;
    
    // Center text vertically
    let startY = (height - totalTextHeight) / 2 + lineHeight / 2;
    
    // Set x position based on alignment
    let x;
    switch (settings.textAlign) {
        case 'left':
            x = settings.padding;
            break;
        case 'right':
            x = width - settings.padding;
            break;
        default: // center
            x = width / 2;
            break;
    }
    
    // Draw each line
    lines.forEach((line, index) => {
        const y = startY + (index * lineHeight);
        
        // Draw text outline if selected
        if (settings.textShadow === 'outline') {
            ctx.save();
            ctx.strokeStyle = settings.shadowColorRgba;
            ctx.lineWidth = Math.max(1, settings.fontSize * 0.03);
            ctx.lineJoin = 'round';
            ctx.strokeText(line, x, y);
            ctx.restore();
        }
        
        // Draw underline if active
        if (settings.underline) {
            const textMetrics = ctx.measureText(line);
            const underlineY = y + settings.fontSize * 0.1;
            const underlineThickness = Math.max(1, settings.fontSize * 0.05);
            
            ctx.save();
            ctx.strokeStyle = settings.textColor;
            ctx.lineWidth = underlineThickness;
            ctx.beginPath();
            
            let underlineX, underlineWidth;
            switch (settings.textAlign) {
                case 'left':
                    underlineX = x;
                    underlineWidth = textMetrics.width;
                    break;
                case 'right':
                    underlineX = x - textMetrics.width;
                    underlineWidth = textMetrics.width;
                    break;
                default: // center
                    underlineX = x - textMetrics.width / 2;
                    underlineWidth = textMetrics.width;
                    break;
            }
            
            ctx.moveTo(underlineX, underlineY);
            ctx.lineTo(underlineX + underlineWidth, underlineY);
            ctx.stroke();
            ctx.restore();
        }
        
        ctx.fillText(line, x, y);
    });
}

function applyTextShadow(ctx, settings) {
    const shadowType = settings.textShadow;
    
    switch (shadowType) {
        case 'subtle':
            ctx.shadowColor = settings.shadowColorRgba.replace(/[\d.]+\)$/g, (settings.shadowOpacity * 0.6 / 100) + ')');
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowBlur = 1;
            break;
        case 'soft':
            ctx.shadowColor = settings.shadowColorRgba;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 4;
            break;
        case 'hard':
            ctx.shadowColor = settings.shadowColorRgba;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            ctx.shadowBlur = 0;
            break;
        case 'long':
            ctx.shadowColor = settings.shadowColorRgba.replace(/[\d.]+\)$/g, (settings.shadowOpacity * 0.8 / 100) + ')');
            ctx.shadowOffsetX = 6;
            ctx.shadowOffsetY = 6;
            ctx.shadowBlur = 2;
            break;
        case 'glow':
            ctx.shadowColor = settings.textColor;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 8;
            break;
        case 'outline':
        default: // none
            ctx.shadowColor = 'transparent';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
            break;
    }
}

function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && i > 0) {
            lines.push(currentLine.trim());
            currentLine = words[i] + ' ';
        } else {
            currentLine = testLine;
        }
    }
    
    if (currentLine.trim().length > 0) {
        lines.push(currentLine.trim());
    }
    
    return lines;
}