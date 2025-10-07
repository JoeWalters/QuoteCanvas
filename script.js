class QuoteCanvas {
    constructor() {
        this.quotes = [];
        this.backgroundImages = [];
        this.backgroundImageFiles = []; // Store file references instead of loaded images
        this.currentQuoteIndex = 0;
        this.currentBackgroundIndex = 0;
        this.generatedImages = [];
        this.imageCache = new Map(); // LRU cache for background images
        this.maxCacheSize = 10; // Keep only 10 images in memory at once
        
        this.initializeElements();
        this.bindEvents();
        this.setupCanvas();
    }

    initializeElements() {
        // File inputs
        this.textFileInput = document.getElementById('text-file');
        this.backgroundFilesInput = document.getElementById('background-files');
        this.manualTextInput = document.getElementById('manual-text');
        
        // File feedback elements
        this.textFileLabel = document.getElementById('text-file-label');
        this.textFileStatus = document.getElementById('text-file-status');
        this.textFileFeedback = document.getElementById('text-file-feedback');
        this.backgroundFilesLabel = document.getElementById('background-files-label');
        this.backgroundFilesStatus = document.getElementById('background-files-status');
        this.backgroundFilesFeedback = document.getElementById('background-files-feedback');
        
        // Controls
        this.imageWidthInput = document.getElementById('image-width');
        this.imageHeightInput = document.getElementById('image-height');
        this.fontFamilySelect = document.getElementById('font-family');
        this.fontSizeInput = document.getElementById('font-size');
        this.fontSizeValue = document.getElementById('font-size-value');
        this.fontWeightSelect = document.getElementById('font-weight');
        this.fontBoldBtn = document.getElementById('font-bold');
        this.fontItalicBtn = document.getElementById('font-italic');
        this.fontUnderlineBtn = document.getElementById('font-underline');
        this.textShadowSelect = document.getElementById('text-shadow');
        this.shadowColorInput = document.getElementById('shadow-color');
        this.shadowOpacityInput = document.getElementById('shadow-opacity');
        this.shadowOpacityValue = document.getElementById('shadow-opacity-value');
        this.lineHeightInput = document.getElementById('line-height');
        this.lineHeightValue = document.getElementById('line-height-value');
        this.textColorInput = document.getElementById('text-color');
        this.backgroundColorInput = document.getElementById('background-color');
        this.textAlignSelect = document.getElementById('text-align');
        this.paddingInput = document.getElementById('padding');
        this.paddingValue = document.getElementById('padding-value');
        this.overlayOpacityInput = document.getElementById('overlay-opacity');
        this.overlayOpacityValue = document.getElementById('overlay-opacity-value');
        
        // Preview
        this.previewCanvas = document.getElementById('preview-canvas');
        this.ctx = this.previewCanvas.getContext('2d');
        this.prevQuoteBtn = document.getElementById('prev-quote');
        this.nextQuoteBtn = document.getElementById('next-quote');
        this.quoteCounter = document.getElementById('quote-counter');
        
        // Generation
        this.generateAllBtn = document.getElementById('generate-all');
        this.generateCurrentBtn = document.getElementById('generate-current');
        this.progressContainer = document.getElementById('progress-container');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        
        // Results
        this.resultsSection = document.getElementById('results-section');
        this.resultsGrid = document.getElementById('results-grid');
        this.downloadAllBtn = document.getElementById('download-all');
        
        // Background preview
        this.backgroundPreview = document.getElementById('background-preview');
        this.backgroundControls = document.getElementById('background-controls');
        this.clearBackgroundsBtn = document.getElementById('clear-backgrounds');
    }

    bindEvents() {
        // File uploads
        this.textFileInput.addEventListener('change', (e) => this.handleTextFiles(e));
        this.backgroundFilesInput.addEventListener('change', (e) => this.handleBackgroundFiles(e));
        this.manualTextInput.addEventListener('input', (e) => this.handleManualText(e));
        
        // Controls
        this.imageWidthInput.addEventListener('input', () => this.updatePreview());
        this.imageHeightInput.addEventListener('input', () => this.updatePreview());
        this.fontFamilySelect.addEventListener('change', () => this.updatePreview());
        this.fontWeightSelect.addEventListener('change', () => this.updatePreview());
        this.fontSizeInput.addEventListener('input', (e) => {
            this.fontSizeValue.textContent = e.target.value + 'px';
            this.updatePreview();
        });
        this.textColorInput.addEventListener('input', () => this.updatePreview());
        this.backgroundColorInput.addEventListener('input', () => this.updatePreview());
        this.textAlignSelect.addEventListener('change', () => this.updatePreview());
        this.paddingInput.addEventListener('input', (e) => {
            this.paddingValue.textContent = e.target.value + 'px';
            this.updatePreview();
        });
        this.overlayOpacityInput.addEventListener('input', (e) => {
            this.overlayOpacityValue.textContent = e.target.value + '%';
            this.updatePreview();
        });
        this.textShadowSelect.addEventListener('change', () => this.updatePreview());
        this.shadowColorInput.addEventListener('input', () => this.updatePreview());
        this.shadowOpacityInput.addEventListener('input', (e) => {
            this.shadowOpacityValue.textContent = e.target.value + '%';
            this.updatePreview();
        });
        this.lineHeightInput.addEventListener('input', (e) => {
            this.lineHeightValue.textContent = (e.target.value / 100).toFixed(1);
            this.updatePreview();
        });
        
        // Font style buttons
        this.fontBoldBtn.addEventListener('click', () => this.toggleFontStyle('bold'));
        this.fontItalicBtn.addEventListener('click', () => this.toggleFontStyle('italic'));
        this.fontUnderlineBtn.addEventListener('click', () => this.toggleFontStyle('underline'));
        
        // Preview navigation
        this.prevQuoteBtn.addEventListener('click', () => this.previousQuote());
        this.nextQuoteBtn.addEventListener('click', () => this.nextQuote());
        
        // Generation
        this.generateAllBtn.addEventListener('click', () => this.generateAllImages());
        this.generateCurrentBtn.addEventListener('click', () => this.generateCurrentImage());
        this.downloadAllBtn.addEventListener('click', () => this.downloadAllImages());
        this.clearBackgroundsBtn.addEventListener('click', () => this.clearAllBackgrounds());
    }

    setupCanvas() {
        this.updateCanvasSize();
    }

    updateCanvasSize() {
        const width = parseInt(this.imageWidthInput.value);
        const height = parseInt(this.imageHeightInput.value);
        
        this.previewCanvas.width = width;
        this.previewCanvas.height = height;
        
        // Scale canvas for display while maintaining aspect ratio
        const maxDisplaySize = 500;
        const aspectRatio = width / height;
        
        let displayWidth, displayHeight;
        
        if (width > height) {
            // Landscape orientation
            displayWidth = Math.min(width, maxDisplaySize);
            displayHeight = displayWidth / aspectRatio;
        } else {
            // Portrait orientation
            displayHeight = Math.min(height, maxDisplaySize);
            displayWidth = displayHeight * aspectRatio;
        }
        
        this.previewCanvas.style.width = displayWidth + 'px';
        this.previewCanvas.style.height = displayHeight + 'px';
    }

    async handleTextFiles(event) {
        const files = Array.from(event.target.files);
        
        if (files.length === 0) {
            this.resetTextFileStatus();
            return;
        }
        
        this.showTextFileStatus('Processing files...', 'loading');
        
        const quotes = [];
        let errorCount = 0;
        
        for (const file of files) {
            try {
                const text = await this.readFile(file);
                if (file.name.toLowerCase().endsWith('.json')) {
                    const data = JSON.parse(text);
                    if (Array.isArray(data)) {
                        quotes.push(...data.map(item => typeof item === 'string' ? item : item.text || item.quote || JSON.stringify(item)));
                    } else if (data.quotes && Array.isArray(data.quotes)) {
                        quotes.push(...data.quotes.map(item => typeof item === 'string' ? item : item.text || item.quote || JSON.stringify(item)));
                    } else {
                        quotes.push(JSON.stringify(data));
                    }
                } else {
                    // Text file - split by lines and filter empty lines
                    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
                    quotes.push(...lines);
                }
            } catch (error) {
                console.error('Error reading file:', file.name, error);
                errorCount++;
            }
        }
        
        if (quotes.length > 0) {
            this.quotes = quotes;
            this.currentQuoteIndex = 0;
            this.updateQuoteDisplay();
            this.updatePreview();
            
            const fileText = files.length === 1 ? files[0].name : `${files.length} files`;
            const statusText = errorCount > 0 
                ? `${quotes.length} quotes loaded from ${fileText} (${errorCount} errors)`
                : `${quotes.length} quotes loaded from ${fileText}`;
            
            this.showTextFileStatus(statusText, 'success');
        } else {
            this.showTextFileStatus('No valid quotes found in uploaded files', 'error');
        }
    }

    handleManualText(event) {
        const text = event.target.value.trim();
        if (text) {
            this.quotes = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            this.currentQuoteIndex = 0;
            this.updateQuoteDisplay();
            this.updatePreview();
            this.resetTextFileStatus();
        } else {
            this.quotes = [];
            this.updateQuoteDisplay();
            this.clearCanvas();
        }
    }

    async handleBackgroundFiles(event) {
        const files = Array.from(event.target.files);
        
        if (files.length === 0) {
            this.resetBackgroundFileStatus();
            return;
        }
        
        this.showBackgroundFileStatus('Processing background images...', 'loading');
        
        // Store file references instead of loading all images into memory
        this.backgroundImageFiles = [];
        this.backgroundImages = []; // Keep for compatibility but will be populated on-demand
        this.backgroundPreview.innerHTML = '';
        this.imageCache.clear(); // Clear existing cache
        
        let errorCount = 0;
        
        for (const file of files) {
            try {
                // Validate it's an image file
                if (!file.type.startsWith('image/')) {
                    throw new Error('Not an image file');
                }
                
                // Store file reference
                this.backgroundImageFiles.push(file);
                
                // Create thumbnail with lazy loading
                await this.createBackgroundThumbnailLazy(file, this.backgroundImageFiles.length - 1);
            } catch (error) {
                console.error('Error processing background image:', file.name, error);
                errorCount++;
            }
        }
        
        if (this.backgroundImageFiles.length > 0) {
            this.currentBackgroundIndex = 0;
            
            // Load the first image for preview
            try {
                const firstImg = await this.loadImageFromFile(this.backgroundImageFiles[0]);
                this.backgroundImages = [firstImg]; // Store only one for preview
                this.updatePreview();
            } catch (error) {
                console.error('Error loading first background for preview:', error);
            }
            
            this.backgroundControls.style.display = 'block';
            
            const statusText = errorCount > 0 
                ? `${this.backgroundImageFiles.length} background images processed (${errorCount} errors)`
                : `${this.backgroundImageFiles.length} background images processed`;
            
            this.showBackgroundFileStatus(statusText, 'success');
        } else {
            this.showBackgroundFileStatus('Failed to process background images', 'error');
        }
    }

    async createBackgroundThumbnailLazy(file, index) {
        const container = document.createElement('div');
        container.className = 'background-thumbnail-container';
        
        const thumbnail = document.createElement('img');
        thumbnail.className = 'background-thumbnail';
        thumbnail.style.backgroundColor = '#f0f0f0';
        thumbnail.style.minHeight = '60px';
        thumbnail.style.display = 'flex';
        thumbnail.style.alignItems = 'center';
        thumbnail.style.justifyContent = 'center';
        
        // Create a small thumbnail (max 100x100) to reduce memory usage
        const thumbnailImg = await this.createThumbnail(file, 100, 100);
        thumbnail.src = thumbnailImg.src;
        
        thumbnail.addEventListener('click', async () => {
            // Remove selected class from all thumbnails
            document.querySelectorAll('.background-thumbnail').forEach(thumb => {
                thumb.classList.remove('selected');
            });
            // Add selected class to clicked thumbnail
            thumbnail.classList.add('selected');
            this.currentBackgroundIndex = index;
            
            // Load the full image for preview
            try {
                const fullImg = await this.loadImageFromCache(index);
                this.backgroundImages = [fullImg]; // Replace array with just current image
                this.updatePreview();
            } catch (error) {
                console.error('Error loading background for preview:', error);
            }
        });
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-background-btn';
        removeBtn.innerHTML = '×';
        removeBtn.title = 'Remove background';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeBackground(index);
        });
        
        if (index === 0) {
            thumbnail.classList.add('selected');
        }
        
        container.appendChild(thumbnail);
        container.appendChild(removeBtn);
        this.backgroundPreview.appendChild(container);
    }

    async createThumbnail(file, maxWidth, maxHeight) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculate thumbnail dimensions
                const aspectRatio = img.width / img.height;
                let thumbWidth, thumbHeight;
                
                if (aspectRatio > 1) {
                    thumbWidth = Math.min(maxWidth, img.width);
                    thumbHeight = thumbWidth / aspectRatio;
                } else {
                    thumbHeight = Math.min(maxHeight, img.height);
                    thumbWidth = thumbHeight * aspectRatio;
                }
                
                canvas.width = thumbWidth;
                canvas.height = thumbHeight;
                
                ctx.drawImage(img, 0, 0, thumbWidth, thumbHeight);
                
                const thumbnailImg = new Image();
                thumbnailImg.onload = () => resolve(thumbnailImg);
                thumbnailImg.onerror = reject;
                thumbnailImg.src = canvas.toDataURL('image/jpeg', 0.7); // Use JPEG with compression
                
                // Clean up
                canvas.width = 1;
                canvas.height = 1;
            };
            
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    loadImageFromFile(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(img.src); // Clean up object URL
                resolve(img);
            };
            img.onerror = () => {
                URL.revokeObjectURL(img.src);
                reject(new Error('Failed to load image'));
            };
            img.src = URL.createObjectURL(file);
        });
    }

    async loadImageFromCache(index) {
        // Check if image is in cache
        if (this.imageCache.has(index)) {
            const cached = this.imageCache.get(index);
            // Move to end (most recently used)
            this.imageCache.delete(index);
            this.imageCache.set(index, cached);
            return cached;
        }

        // Load image from file
        if (index >= this.backgroundImageFiles.length) {
            throw new Error('Invalid background index');
        }

        const img = await this.loadImageFromFile(this.backgroundImageFiles[index]);
        
        // Manage cache size
        if (this.imageCache.size >= this.maxCacheSize) {
            // Remove least recently used (first entry)
            const firstKey = this.imageCache.keys().next().value;
            this.imageCache.delete(firstKey);
        }
        
        this.imageCache.set(index, img);
        return img;
    }

    updateQuoteDisplay() {
        this.quoteCounter.textContent = `${this.currentQuoteIndex + 1} / ${this.quotes.length}`;
        this.prevQuoteBtn.disabled = this.currentQuoteIndex === 0 || this.quotes.length === 0;
        this.nextQuoteBtn.disabled = this.currentQuoteIndex >= this.quotes.length - 1 || this.quotes.length === 0;
        this.generateAllBtn.disabled = this.quotes.length === 0;
        this.generateCurrentBtn.disabled = this.quotes.length === 0;
    }

    previousQuote() {
        if (this.currentQuoteIndex > 0) {
            this.currentQuoteIndex--;
            this.updateQuoteDisplay();
            this.updatePreview();
        }
    }

    nextQuote() {
        if (this.currentQuoteIndex < this.quotes.length - 1) {
            this.currentQuoteIndex++;
            this.updateQuoteDisplay();
            this.updatePreview();
        }
    }

    updatePreview() {
        if (this.quotes.length === 0) {
            this.clearCanvas();
            return;
        }
        
        this.updateCanvasSize();
        this.drawQuoteImage(this.currentQuoteIndex);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
    }

    drawQuoteImage(quoteIndex, canvas = null, context = null) {
        const targetCanvas = canvas || this.previewCanvas;
        const targetCtx = context || this.ctx;
        
        const width = targetCanvas.width;
        const height = targetCanvas.height;
        const quote = this.quotes[quoteIndex];
        
        // Clear canvas
        targetCtx.clearRect(0, 0, width, height);
        
        // Draw background
        if (this.backgroundImages.length > 0 && this.currentBackgroundIndex < this.backgroundImages.length) {
            const bgImg = this.backgroundImages[this.currentBackgroundIndex];
            targetCtx.drawImage(bgImg, 0, 0, width, height);
            
            // Add overlay for text readability
            const overlayOpacity = parseInt(this.overlayOpacityInput.value) / 100;
            targetCtx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
            targetCtx.fillRect(0, 0, width, height);
        } else {
            // Solid background color
            targetCtx.fillStyle = this.backgroundColorInput.value;
            targetCtx.fillRect(0, 0, width, height);
        }
        
        // Draw text
        const fontSize = parseInt(this.fontSizeInput.value);
        const fontFamily = this.fontFamilySelect.value;
        const fontWeight = this.fontWeightSelect.value;
        const textColor = this.textColorInput.value;
        const textAlign = this.textAlignSelect.value;
        const padding = parseInt(this.paddingInput.value);
        const lineHeightMultiplier = parseInt(this.lineHeightInput.value) / 100;
        
        // Build font string with weight and style
        let fontStyle = '';
        if (this.fontItalicBtn.classList.contains('active')) {
            fontStyle += 'italic ';
        }
        
        targetCtx.fillStyle = textColor;
        targetCtx.font = `${fontStyle}${fontWeight} ${fontSize}px "${fontFamily}"`;
        targetCtx.textAlign = textAlign;
        targetCtx.textBaseline = 'middle';
        
        // Apply text shadow
        this.applyTextShadow(targetCtx);
        
        // Text wrapping
        const maxWidth = width - (padding * 2);
        const lines = this.wrapText(targetCtx, quote, maxWidth);
        const lineHeight = fontSize * lineHeightMultiplier;
        const totalTextHeight = lines.length * lineHeight;
        
        // Center text vertically
        let startY = (height - totalTextHeight) / 2 + lineHeight / 2;
        
        // Set x position based on alignment
        let x;
        switch (textAlign) {
            case 'left':
                x = padding;
                break;
            case 'right':
                x = width - padding;
                break;
            default: // center
                x = width / 2;
                break;
        }
        
        // Draw each line
        lines.forEach((line, index) => {
            const y = startY + (index * lineHeight);
            
            // Draw text outline if selected
            if (this.textShadowSelect.value === 'outline') {
                const shadowOpacity = parseInt(this.shadowOpacityInput.value) / 100;
                const shadowColor = this.shadowColorInput.value;
                
                targetCtx.save();
                targetCtx.strokeStyle = this.hexToRgba(shadowColor, shadowOpacity);
                targetCtx.lineWidth = Math.max(1, fontSize * 0.03);
                targetCtx.lineJoin = 'round';
                targetCtx.strokeText(line, x, y);
                targetCtx.restore();
            }
            
            // Draw underline if active
            if (this.fontUnderlineBtn.classList.contains('active')) {
                const textMetrics = targetCtx.measureText(line);
                const underlineY = y + fontSize * 0.1;
                const underlineThickness = Math.max(1, fontSize * 0.05);
                
                targetCtx.save();
                targetCtx.strokeStyle = textColor;
                targetCtx.lineWidth = underlineThickness;
                targetCtx.beginPath();
                
                let underlineX, underlineWidth;
                switch (textAlign) {
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
                
                targetCtx.moveTo(underlineX, underlineY);
                targetCtx.lineTo(underlineX + underlineWidth, underlineY);
                targetCtx.stroke();
                targetCtx.restore();
            }
            
            targetCtx.fillText(line, x, y);
        });
    }

    drawQuoteImageWithBackground(quoteIndex, canvas = null, context = null, backgroundIndex = null) {
        const targetCanvas = canvas || this.previewCanvas;
        const targetCtx = context || this.ctx;
        
        const width = targetCanvas.width;
        const height = targetCanvas.height;
        const quote = this.quotes[quoteIndex];
        
        // Use provided background index
        const bgIndex = backgroundIndex !== null ? backgroundIndex : this.currentBackgroundIndex;
        
        // Clear canvas
        targetCtx.clearRect(0, 0, width, height);
        
        // Draw background - ensure we have backgrounds and valid index
        if (this.backgroundImages.length > 0 && bgIndex >= 0 && bgIndex < this.backgroundImages.length) {
            console.log(`Drawing quote ${quoteIndex + 1} with background ${bgIndex + 1}/${this.backgroundImages.length}`);
            const bgImg = this.backgroundImages[bgIndex];
            targetCtx.drawImage(bgImg, 0, 0, width, height);
            
            // Add overlay for text readability
            const overlayOpacity = parseInt(this.overlayOpacityInput.value) / 100;
            targetCtx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
            targetCtx.fillRect(0, 0, width, height);
        } else {
            console.log(`Drawing quote ${quoteIndex + 1} with solid background (no backgrounds available or invalid index ${bgIndex})`);
            // Solid background color
            targetCtx.fillStyle = this.backgroundColorInput.value;
            targetCtx.fillRect(0, 0, width, height);
        }
        
        // Draw text (same as original method)
        const fontSize = parseInt(this.fontSizeInput.value);
        const fontFamily = this.fontFamilySelect.value;
        const fontWeight = this.fontWeightSelect.value;
        const textColor = this.textColorInput.value;
        const textAlign = this.textAlignSelect.value;
        const padding = parseInt(this.paddingInput.value);
        const lineHeightMultiplier = parseInt(this.lineHeightInput.value) / 100;
        
        // Build font string with weight and style
        let fontStyle = '';
        if (this.fontItalicBtn.classList.contains('active')) {
            fontStyle += 'italic ';
        }
        
        targetCtx.fillStyle = textColor;
        targetCtx.font = `${fontStyle}${fontWeight} ${fontSize}px "${fontFamily}"`;
        targetCtx.textAlign = textAlign;
        targetCtx.textBaseline = 'middle';
        
        // Apply text shadow
        this.applyTextShadow(targetCtx);
        
        // Text wrapping
        const maxWidth = width - (padding * 2);
        const lines = this.wrapText(targetCtx, quote, maxWidth);
        const lineHeight = fontSize * lineHeightMultiplier;
        const totalTextHeight = lines.length * lineHeight;
        
        // Center text vertically
        let startY = (height - totalTextHeight) / 2 + lineHeight / 2;
        
        // Set x position based on alignment
        let x;
        switch (textAlign) {
            case 'left':
                x = padding;
                break;
            case 'right':
                x = width - padding;
                break;
            default: // center
                x = width / 2;
                break;
        }
        
        // Draw each line
        lines.forEach((line, index) => {
            const y = startY + (index * lineHeight);
            
            // Draw text outline if selected
            if (this.textShadowSelect.value === 'outline') {
                const shadowOpacity = parseInt(this.shadowOpacityInput.value) / 100;
                const shadowColor = this.shadowColorInput.value;
                
                targetCtx.save();
                targetCtx.strokeStyle = this.hexToRgba(shadowColor, shadowOpacity);
                targetCtx.lineWidth = Math.max(1, fontSize * 0.03);
                targetCtx.lineJoin = 'round';
                targetCtx.strokeText(line, x, y);
                targetCtx.restore();
            }
            
            // Draw underline if active
            if (this.fontUnderlineBtn.classList.contains('active')) {
                const textMetrics = targetCtx.measureText(line);
                const underlineY = y + fontSize * 0.1;
                const underlineThickness = Math.max(1, fontSize * 0.05);
                
                targetCtx.save();
                targetCtx.strokeStyle = textColor;
                targetCtx.lineWidth = underlineThickness;
                targetCtx.beginPath();
                
                let underlineX, underlineWidth;
                switch (textAlign) {
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
                
                targetCtx.moveTo(underlineX, underlineY);
                targetCtx.lineTo(underlineX + underlineWidth, underlineY);
                targetCtx.stroke();
                targetCtx.restore();
            }
            
            targetCtx.fillText(line, x, y);
        });
    }

    async drawQuoteImageWithBackgroundSafe(quoteIndex, canvas, context, backgroundIndex, validatedBackgrounds) {
        const targetCanvas = canvas || this.previewCanvas;
        const targetCtx = context || this.ctx;
        
        const width = targetCanvas.width;
        const height = targetCanvas.height;
        const quote = this.quotes[quoteIndex];
        
        // Clear canvas
        targetCtx.clearRect(0, 0, width, height);
        
        // Draw background with extra validation
        if (backgroundIndex >= 0 && validatedBackgrounds && backgroundIndex < validatedBackgrounds.length) {
            const bgImg = validatedBackgrounds[backgroundIndex];
            
            try {
                // Additional safety check before drawing
                if (bgImg && bgImg.complete && bgImg.naturalWidth > 0 && bgImg.naturalHeight > 0) {
                    console.log(`Drawing quote ${quoteIndex + 1} with background ${backgroundIndex + 1}/${validatedBackgrounds.length}`);
                    
                    // Use a promise to handle potential drawing errors
                    await new Promise((resolve, reject) => {
                        try {
                            targetCtx.drawImage(bgImg, 0, 0, width, height);
                            resolve();
                        } catch (error) {
                            console.error(`Failed to draw background ${backgroundIndex} for quote ${quoteIndex + 1}:`, error);
                            reject(error);
                        }
                    });
                    
                    // Add overlay for text readability
                    const overlayOpacity = parseInt(this.overlayOpacityInput.value) / 100;
                    targetCtx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
                    targetCtx.fillRect(0, 0, width, height);
                } else {
                    throw new Error(`Background image ${backgroundIndex} is not valid`);
                }
            } catch (error) {
                console.warn(`Failed to draw background for quote ${quoteIndex + 1}, using solid color:`, error);
                // Fall back to solid background
                targetCtx.fillStyle = this.backgroundColorInput.value;
                targetCtx.fillRect(0, 0, width, height);
            }
        } else {
            console.log(`Drawing quote ${quoteIndex + 1} with solid background (no valid backgrounds or invalid index ${backgroundIndex})`);
            // Solid background color
            targetCtx.fillStyle = this.backgroundColorInput.value;
            targetCtx.fillRect(0, 0, width, height);
        }
        
        // Draw text (same as original method)
        const fontSize = parseInt(this.fontSizeInput.value);
        const fontFamily = this.fontFamilySelect.value;
        const fontWeight = this.fontWeightSelect.value;
        const textColor = this.textColorInput.value;
        const textAlign = this.textAlignSelect.value;
        const padding = parseInt(this.paddingInput.value);
        const lineHeightMultiplier = parseInt(this.lineHeightInput.value) / 100;
        
        // Build font string with weight and style
        let fontStyle = '';
        if (this.fontItalicBtn.classList.contains('active')) {
            fontStyle += 'italic ';
        }
        
        targetCtx.fillStyle = textColor;
        targetCtx.font = `${fontStyle}${fontWeight} ${fontSize}px "${fontFamily}"`;
        targetCtx.textAlign = textAlign;
        targetCtx.textBaseline = 'middle';
        
        // Apply text shadow
        this.applyTextShadow(targetCtx);
        
        // Text wrapping
        const maxWidth = width - (padding * 2);
        const lines = this.wrapText(targetCtx, quote, maxWidth);
        const lineHeight = fontSize * lineHeightMultiplier;
        const totalTextHeight = lines.length * lineHeight;
        
        // Center text vertically
        let startY = (height - totalTextHeight) / 2 + lineHeight / 2;
        
        // Set x position based on alignment
        let x;
        switch (textAlign) {
            case 'left':
                x = padding;
                break;
            case 'right':
                x = width - padding;
                break;
            default: // center
                x = width / 2;
                break;
        }
        
        // Draw each line
        lines.forEach((line, index) => {
            const y = startY + (index * lineHeight);
            
            // Draw text outline if selected
            if (this.textShadowSelect.value === 'outline') {
                const shadowOpacity = parseInt(this.shadowOpacityInput.value) / 100;
                const shadowColor = this.shadowColorInput.value;
                
                targetCtx.save();
                targetCtx.strokeStyle = this.hexToRgba(shadowColor, shadowOpacity);
                targetCtx.lineWidth = Math.max(1, fontSize * 0.03);
                targetCtx.lineJoin = 'round';
                targetCtx.strokeText(line, x, y);
                targetCtx.restore();
            }
            
            // Draw underline if active
            if (this.fontUnderlineBtn.classList.contains('active')) {
                const textMetrics = targetCtx.measureText(line);
                const underlineY = y + fontSize * 0.1;
                const underlineThickness = Math.max(1, fontSize * 0.05);
                
                targetCtx.save();
                targetCtx.strokeStyle = textColor;
                targetCtx.lineWidth = underlineThickness;
                targetCtx.beginPath();
                
                let underlineX, underlineWidth;
                switch (textAlign) {
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
                
                targetCtx.moveTo(underlineX, underlineY);
                targetCtx.lineTo(underlineX + underlineWidth, underlineY);
                targetCtx.stroke();
                targetCtx.restore();
            }
            
            targetCtx.fillText(line, x, y);
        });
    }

    async drawQuoteImageMemoryEfficient(quoteIndex, canvas, context, backgroundImg) {
        const targetCanvas = canvas || this.previewCanvas;
        const targetCtx = context || this.ctx;
        
        const width = targetCanvas.width;
        const height = targetCanvas.height;
        const quote = this.quotes[quoteIndex];
        
        // Clear canvas
        targetCtx.clearRect(0, 0, width, height);
        
        // Draw background with memory-efficient approach
        if (backgroundImg && backgroundImg.complete && backgroundImg.naturalWidth > 0) {
            try {
                targetCtx.drawImage(backgroundImg, 0, 0, width, height);
                
                // Add overlay for text readability
                const overlayOpacity = parseInt(this.overlayOpacityInput.value) / 100;
                targetCtx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
                targetCtx.fillRect(0, 0, width, height);
            } catch (error) {
                console.warn(`Failed to draw background for quote ${quoteIndex + 1}, using solid color:`, error);
                // Fall back to solid background
                targetCtx.fillStyle = this.backgroundColorInput.value;
                targetCtx.fillRect(0, 0, width, height);
            }
        } else {
            // Solid background color
            targetCtx.fillStyle = this.backgroundColorInput.value;
            targetCtx.fillRect(0, 0, width, height);
        }
        
        // Draw text (same as original method)
        const fontSize = parseInt(this.fontSizeInput.value);
        const fontFamily = this.fontFamilySelect.value;
        const fontWeight = this.fontWeightSelect.value;
        const textColor = this.textColorInput.value;
        const textAlign = this.textAlignSelect.value;
        const padding = parseInt(this.paddingInput.value);
        const lineHeightMultiplier = parseInt(this.lineHeightInput.value) / 100;
        
        // Build font string with weight and style
        let fontStyle = '';
        if (this.fontItalicBtn.classList.contains('active')) {
            fontStyle += 'italic ';
        }
        
        targetCtx.fillStyle = textColor;
        targetCtx.font = `${fontStyle}${fontWeight} ${fontSize}px "${fontFamily}"`;
        targetCtx.textAlign = textAlign;
        targetCtx.textBaseline = 'middle';
        
        // Apply text shadow
        this.applyTextShadow(targetCtx);
        
        // Text wrapping
        const maxWidth = width - (padding * 2);
        const lines = this.wrapText(targetCtx, quote, maxWidth);
        const lineHeight = fontSize * lineHeightMultiplier;
        const totalTextHeight = lines.length * lineHeight;
        
        // Center text vertically
        let startY = (height - totalTextHeight) / 2 + lineHeight / 2;
        
        // Set x position based on alignment
        let x;
        switch (textAlign) {
            case 'left':
                x = padding;
                break;
            case 'right':
                x = width - padding;
                break;
            default: // center
                x = width / 2;
                break;
        }
        
        // Draw each line
        lines.forEach((line, index) => {
            const y = startY + (index * lineHeight);
            
            // Draw text outline if selected
            if (this.textShadowSelect.value === 'outline') {
                const shadowOpacity = parseInt(this.shadowOpacityInput.value) / 100;
                const shadowColor = this.shadowColorInput.value;
                
                targetCtx.save();
                targetCtx.strokeStyle = this.hexToRgba(shadowColor, shadowOpacity);
                targetCtx.lineWidth = Math.max(1, fontSize * 0.03);
                targetCtx.lineJoin = 'round';
                targetCtx.strokeText(line, x, y);
                targetCtx.restore();
            }
            
            // Draw underline if active
            if (this.fontUnderlineBtn.classList.contains('active')) {
                const textMetrics = targetCtx.measureText(line);
                const underlineY = y + fontSize * 0.1;
                const underlineThickness = Math.max(1, fontSize * 0.05);
                
                targetCtx.save();
                targetCtx.strokeStyle = textColor;
                targetCtx.lineWidth = underlineThickness;
                targetCtx.beginPath();
                
                let underlineX, underlineWidth;
                switch (textAlign) {
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
                
                targetCtx.moveTo(underlineX, underlineY);
                targetCtx.lineTo(underlineX + underlineWidth, underlineY);
                targetCtx.stroke();
                targetCtx.restore();
            }
            
            targetCtx.fillText(line, x, y);
        });
    }

    wrapText(ctx, text, maxWidth) {
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

    async generateAllImages() {
        if (this.quotes.length === 0) return;
        
        this.progressContainer.style.display = 'block';
        this.generateAllBtn.disabled = true;
        this.generateCurrentBtn.disabled = true;
        this.generatedImages = [];
        
        // Use optimized single-threaded approach to prevent browser freezing
        await this.generateImagesSingleThreadedOptimized();
        
        this.displayResults();
        this.progressContainer.style.display = 'none';
        this.generateAllBtn.disabled = false;
        this.generateCurrentBtn.disabled = false;
    }

    async generateImagesSingleThreadedOptimized() {
        const width = parseInt(this.imageWidthInput.value);
        const height = parseInt(this.imageHeightInput.value);
        const batchSize = 1; // Process one image at a time to minimize memory usage
        
        console.log(`Generating ${this.quotes.length} images with ${this.backgroundImageFiles.length} background files`);
        console.log(`Memory optimization: Using LRU cache with ${this.maxCacheSize} images max`);
        
        for (let i = 0; i < this.quotes.length; i++) {
            try {
                // Create temporary canvas for generation
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                
                // Calculate which background to use for this specific image
                let backgroundImg = null;
                if (this.backgroundImageFiles.length > 0) {
                    const backgroundIndex = i % this.backgroundImageFiles.length;
                    
                    try {
                        // Load background image from cache or file
                        backgroundImg = await this.loadImageFromCache(backgroundIndex);
                        console.log(`Image ${i + 1}: Using background ${backgroundIndex + 1}/${this.backgroundImageFiles.length} (cache size: ${this.imageCache.size})`);
                    } catch (error) {
                        console.warn(`Failed to load background ${backgroundIndex} for image ${i + 1}:`, error);
                        backgroundImg = null;
                    }
                }
                
                await this.drawQuoteImageMemoryEfficient(i, canvas, ctx, backgroundImg);
                
                // Convert to blob
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.9));
                const imageData = {
                    blob: blob,
                    dataUrl: canvas.toDataURL('image/png', 0.9),
                    filename: `quote-${i + 1}.png`,
                    quote: this.quotes[i]
                };
                
                this.generatedImages.push(imageData);
                
                // Aggressive cleanup
                canvas.width = 1;
                canvas.height = 1;
                ctx.clearRect(0, 0, 1, 1);
                
                // Update progress
                const progress = ((i + 1) / this.quotes.length) * 100;
                this.progressFill.style.width = progress + '%';
                this.progressText.textContent = Math.round(progress) + '%';
                
                // Yield control more frequently and for longer
                if (i % 5 === 0) { // Every 5 images
                    await new Promise(resolve => setTimeout(resolve, 200));
                    
                    // Suggest garbage collection
                    if (window.gc) {
                        window.gc();
                    }
                }
                
            } catch (error) {
                console.error(`Error generating image ${i + 1}:`, error);
                // Continue with next image even if one fails
            }
        }
        
        console.log(`Generation complete. Final cache size: ${this.imageCache.size}`);
    }

    async generateCurrentImage() {
        if (this.quotes.length === 0) return;
        
        const width = parseInt(this.imageWidthInput.value);
        const height = parseInt(this.imageHeightInput.value);
        
        // Create temporary canvas for generation
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        this.drawQuoteImage(this.currentQuoteIndex, canvas, ctx);
        
        // Convert to blob and download
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `quote-${this.currentQuoteIndex + 1}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }

    displayResults() {
        this.resultsGrid.innerHTML = '';
        
        this.generatedImages.forEach((imageData, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            const img = document.createElement('img');
            img.src = imageData.dataUrl;
            img.alt = `Quote ${index + 1}`;
            
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.textContent = 'Download';
            downloadBtn.onclick = () => this.downloadImage(imageData);
            
            const quoteText = document.createElement('p');
            quoteText.textContent = imageData.quote.substring(0, 50) + (imageData.quote.length > 50 ? '...' : '');
            quoteText.style.fontSize = '12px';
            quoteText.style.color = '#666';
            quoteText.style.margin = '5px 0';
            
            resultItem.appendChild(img);
            resultItem.appendChild(quoteText);
            resultItem.appendChild(downloadBtn);
            this.resultsGrid.appendChild(resultItem);
        });
        
        this.resultsSection.style.display = 'block';
    }

    downloadImage(imageData) {
        const url = URL.createObjectURL(imageData.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = imageData.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async downloadAllImages() {
        if (this.generatedImages.length === 0) return;
        
        const zip = new JSZip();
        
        this.generatedImages.forEach(imageData => {
            zip.file(imageData.filename, imageData.blob);
        });
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quote-images.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showTextFileStatus(message, type) {
        this.textFileStatus.textContent = message;
        this.textFileFeedback.textContent = message;
        this.textFileFeedback.className = `file-status ${type}`;
        this.textFileFeedback.style.display = 'block';
        
        if (type === 'success') {
            this.textFileLabel.classList.add('file-uploaded');
        } else if (type === 'error') {
            this.textFileLabel.classList.remove('file-uploaded');
        }
        
        if (type === 'loading') {
            this.textFileFeedback.classList.add('loading');
        } else {
            this.textFileFeedback.classList.remove('loading');
        }
    }

    resetTextFileStatus() {
        this.textFileStatus.textContent = 'Upload Text/JSON File';
        this.textFileFeedback.style.display = 'none';
        this.textFileLabel.classList.remove('file-uploaded');
    }

    showBackgroundFileStatus(message, type) {
        this.backgroundFilesStatus.textContent = message;
        this.backgroundFilesFeedback.textContent = message;
        this.backgroundFilesFeedback.className = `file-status ${type}`;
        this.backgroundFilesFeedback.style.display = 'block';
        
        if (type === 'success') {
            this.backgroundFilesLabel.classList.add('file-uploaded');
        } else if (type === 'error') {
            this.backgroundFilesLabel.classList.remove('file-uploaded');
        }
        
        if (type === 'loading') {
            this.backgroundFilesFeedback.classList.add('loading');
        } else {
            this.backgroundFilesFeedback.classList.remove('loading');
        }
    }

    resetBackgroundFileStatus() {
        this.backgroundFilesStatus.textContent = 'Upload Background Images';
        this.backgroundFilesFeedback.style.display = 'none';
        this.backgroundFilesLabel.classList.remove('file-uploaded');
    }

    removeBackground(index) {
        // Remove from file array and cache
        this.backgroundImageFiles.splice(index, 1);
        this.imageCache.delete(index);
        
        // Update cache indices (shift down indices greater than removed index)
        const newCache = new Map();
        for (const [cacheIndex, img] of this.imageCache.entries()) {
            if (cacheIndex < index) {
                newCache.set(cacheIndex, img);
            } else if (cacheIndex > index) {
                newCache.set(cacheIndex - 1, img);
            }
        }
        this.imageCache = newCache;
        
        // Update current index if necessary
        if (this.currentBackgroundIndex >= this.backgroundImageFiles.length) {
            this.currentBackgroundIndex = Math.max(0, this.backgroundImageFiles.length - 1);
        }
        
        // Refresh the thumbnail display
        this.refreshBackgroundThumbnails();
        
        // Update preview
        this.updatePreview();
        
        // Hide controls if no backgrounds left
        if (this.backgroundImageFiles.length === 0) {
            this.backgroundControls.style.display = 'none';
            this.resetBackgroundFileStatus();
            this.backgroundImages = [];
        }
    }

    clearAllBackgrounds() {
        this.backgroundImages = [];
        this.backgroundImageFiles = [];
        this.imageCache.clear();
        this.currentBackgroundIndex = 0;
        this.backgroundPreview.innerHTML = '';
        this.backgroundControls.style.display = 'none';
        this.updatePreview();
        this.resetBackgroundFileStatus();
        
        // Clear the file input
        this.backgroundFilesInput.value = '';
    }

    async refreshBackgroundThumbnails() {
        this.backgroundPreview.innerHTML = '';
        
        for (let i = 0; i < this.backgroundImageFiles.length; i++) {
            await this.createBackgroundThumbnailLazy(this.backgroundImageFiles[i], i);
        }
        
        // Set the current background as selected
        if (this.backgroundImageFiles.length > 0) {
            const thumbnails = document.querySelectorAll('.background-thumbnail');
            if (thumbnails[this.currentBackgroundIndex]) {
                thumbnails[this.currentBackgroundIndex].classList.add('selected');
            }
        }
    }

    toggleFontStyle(style) {
        const btn = style === 'bold' ? this.fontBoldBtn : 
                   style === 'italic' ? this.fontItalicBtn : 
                   this.fontUnderlineBtn;
        
        btn.classList.toggle('active');
        
        // Handle bold button - sync with font weight
        if (style === 'bold') {
            if (btn.classList.contains('active')) {
                this.fontWeightSelect.value = '700';
            } else {
                this.fontWeightSelect.value = '400';
            }
        }
        
        this.updatePreview();
    }

    applyTextShadow(ctx) {
        const shadowType = this.textShadowSelect.value;
        const shadowColor = this.shadowColorInput.value;
        const shadowOpacity = parseInt(this.shadowOpacityInput.value) / 100;
        
        // Convert hex color to rgba
        const hexToRgba = (hex, alpha) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };
        
        switch (shadowType) {
            case 'subtle':
                ctx.shadowColor = hexToRgba(shadowColor, shadowOpacity * 0.6);
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.shadowBlur = 1;
                break;
            case 'soft':
                ctx.shadowColor = hexToRgba(shadowColor, shadowOpacity);
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.shadowBlur = 4;
                break;
            case 'hard':
                ctx.shadowColor = hexToRgba(shadowColor, shadowOpacity);
                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 3;
                ctx.shadowBlur = 0;
                break;
            case 'long':
                ctx.shadowColor = hexToRgba(shadowColor, shadowOpacity * 0.8);
                ctx.shadowOffsetX = 6;
                ctx.shadowOffsetY = 6;
                ctx.shadowBlur = 2;
                break;
            case 'glow':
                ctx.shadowColor = this.textColorInput.value;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 8;
                break;
            case 'outline':
                // Text outline effect - we'll handle this differently
                ctx.shadowColor = 'transparent';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 0;
                break;
            default: // none
                ctx.shadowColor = 'transparent';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 0;
                break;
        }
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuoteCanvas();
});