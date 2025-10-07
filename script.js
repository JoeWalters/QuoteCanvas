class QuoteCanvas {
    constructor() {
        this.quotes = [];
        this.backgroundImages = [];
        this.backgroundImageFiles = [];
        this.currentQuoteIndex = 0;
        this.currentBackgroundIndex = 0;
        this.generatedImages = [];
        this.failedImages = [];
        this.imageCache = new Map();
        this.maxCacheSize = 10;
        
        // New properties for enhanced features
        this.currentTab = 'content-tab';
        this.zoomLevel = 1;
        this.isDarkTheme = false;
        this.isTouchMode = false;
        this.isGenerating = false;
        this.isPaused = false;
        this.generationStats = {
            startTime: null,
            imagesGenerated: 0,
            totalImages: 0,
            speed: 0
        };
        
        // Settings persistence
        this.settings = {
            autoSave: true,
            previewQuality: 'medium',
            touchMode: true,
            theme: 'light'
        };
        
        this.initializeElements();
        this.loadSettings();
        this.bindEvents();
        this.setupCanvas();
        this.setupDragAndDrop();
        this.updateNamingPreview();
        this.startPerformanceMonitoring();
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
        
        // Naming scheme controls
        this.namingPatternInput = document.getElementById('naming-pattern');
        this.indexStartInput = document.getElementById('index-start');
        this.indexPaddingInput = document.getElementById('index-padding');
        this.quoteMaxLengthInput = document.getElementById('quote-max-length');
        this.dateFormatSelect = document.getElementById('date-format');
        this.timeFormatSelect = document.getElementById('time-format');
        this.namingPreviewText = document.getElementById('naming-preview-text');
        
        // Accordion controls
        this.namingHeader = document.getElementById('naming-header');
        this.namingContent = document.getElementById('naming-content');
        
        // New UI elements
        this.themeToggle = document.getElementById('theme-toggle');
        this.settingsToggle = document.getElementById('settings-toggle');
        this.performanceToggle = document.getElementById('performance-toggle');
        this.settingsPanel = document.getElementById('settings-panel');
        this.performancePanel = document.getElementById('performance-panel');
        
        // Tab navigation
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Enhanced preview controls
        this.zoomInBtn = document.getElementById('zoom-in');
        this.zoomOutBtn = document.getElementById('zoom-out');
        this.zoomLevel = document.getElementById('zoom-level');
        this.fullscreenBtn = document.getElementById('fullscreen-preview');
        this.comparisonBtn = document.getElementById('comparison-mode');
        this.comparisonCanvas = document.getElementById('comparison-canvas');
        this.currentQuoteText = document.getElementById('current-quote-text');
        
        // Background effects controls
        this.bgBlur = document.getElementById('bg-blur');
        this.bgBlurValue = document.getElementById('bg-blur-value');
        this.bgBrightness = document.getElementById('bg-brightness');
        this.bgBrightnessValue = document.getElementById('bg-brightness-value');
        this.bgContrast = document.getElementById('bg-contrast');
        this.bgContrastValue = document.getElementById('bg-contrast-value');
        this.bgSaturation = document.getElementById('bg-saturation');
        this.bgSaturationValue = document.getElementById('bg-saturation-value');
        this.bgFilter = document.getElementById('bg-filter');
        this.vignetteStrength = document.getElementById('vignette-strength');
        this.vignetteValue = document.getElementById('vignette-value');
        this.gradientOverlay = document.getElementById('gradient-overlay');
        this.gradientColor1 = document.getElementById('gradient-color1');
        this.gradientColor2 = document.getElementById('gradient-color2');
        
        // Export format controls
        this.exportFormat = document.getElementById('export-format');
        this.jpegQuality = document.getElementById('jpeg-quality');
        this.jpegQualityValue = document.getElementById('jpeg-quality-value');
        this.exportResolution = document.getElementById('export-resolution');
        this.zipCompression = document.getElementById('zip-compression');
        
        // Batch processing controls removed
        
        // Enhanced generation controls
        this.pauseGenerationBtn = document.getElementById('pause-generation');
        this.cancelGenerationBtn = document.getElementById('cancel-generation');
        this.progressDetails = document.getElementById('progress-details');
        this.downloadSelectedBtn = document.getElementById('download-selected');
        this.regenerateFailedBtn = document.getElementById('regenerate-failed');
        
        // Quick actions
        this.randomQuoteBtn = document.getElementById('random-quote');
        this.duplicateSettingsBtn = document.getElementById('duplicate-settings');
        this.resetEffectsBtn = document.getElementById('reset-effects');
        
        // Settings controls
        this.autoSaveSettings = document.getElementById('auto-save-settings');
        this.previewQuality = document.getElementById('preview-quality');
        this.touchMode = document.getElementById('touch-mode');
        this.saveSettingsBtn = document.getElementById('save-settings-btn');
        this.resetSettingsBtn = document.getElementById('reset-settings-btn');
        
        // Performance monitoring elements
        this.memoryUsage = document.getElementById('memory-usage');
        this.cacheSize = document.getElementById('cache-size');
        this.generationSpeed = document.getElementById('generation-speed');
        this.imagesGenerated = document.getElementById('images-generated');
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
        
        // Naming scheme controls
        this.namingPatternInput.addEventListener('input', () => this.updateNamingPreview());
        this.indexStartInput.addEventListener('input', () => this.updateNamingPreview());
        this.indexPaddingInput.addEventListener('input', () => this.updateNamingPreview());
        this.quoteMaxLengthInput.addEventListener('input', () => this.updateNamingPreview());
        this.dateFormatSelect.addEventListener('change', () => this.updateNamingPreview());
        this.timeFormatSelect.addEventListener('change', () => this.updateNamingPreview());
        
        // Accordion toggles
        this.namingHeader.addEventListener('click', () => this.toggleAccordion('naming'));
        
        // Theme and settings
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.settingsToggle.addEventListener('click', () => this.togglePanel('settings'));
        this.performanceToggle.addEventListener('click', () => this.togglePanel('performance'));
        
        // Tab navigation
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Enhanced preview controls
        this.zoomInBtn.addEventListener('click', () => this.adjustZoom(0.1));
        this.zoomOutBtn.addEventListener('click', () => this.adjustZoom(-0.1));
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.comparisonBtn.addEventListener('click', () => this.toggleComparison());
        
        // Background effects
        this.bgBlur.addEventListener('input', (e) => {
            this.bgBlurValue.textContent = e.target.value + 'px';
            this.updatePreview();
        });
        this.bgBrightness.addEventListener('input', (e) => {
            this.bgBrightnessValue.textContent = e.target.value + '%';
            this.updatePreview();
        });
        this.bgContrast.addEventListener('input', (e) => {
            this.bgContrastValue.textContent = e.target.value + '%';
            this.updatePreview();
        });
        this.bgSaturation.addEventListener('input', (e) => {
            this.bgSaturationValue.textContent = e.target.value + '%';
            this.updatePreview();
        });
        this.bgFilter.addEventListener('change', () => this.updatePreview());
        this.vignetteStrength.addEventListener('input', (e) => {
            this.vignetteValue.textContent = e.target.value + '%';
            this.updatePreview();
        });
        this.gradientOverlay.addEventListener('change', () => {
            this.toggleGradientControls();
            this.updatePreview();
        });
        this.gradientColor1.addEventListener('input', () => this.updatePreview());
        this.gradientColor2.addEventListener('input', () => this.updatePreview());
        
        // Export format controls
        this.exportFormat.addEventListener('change', () => this.toggleFormatControls());
        this.jpegQuality.addEventListener('input', (e) => {
            this.jpegQualityValue.textContent = e.target.value + '%';
        });
        this.exportResolution.addEventListener('change', () => this.applyResolutionPreset());
        
        // Batch processing controls removed
        this.pauseGenerationBtn.addEventListener('click', () => this.pauseGeneration());
        this.cancelGenerationBtn.addEventListener('click', () => this.cancelGeneration());
        
        // Enhanced results
        this.downloadSelectedBtn.addEventListener('click', () => this.downloadSelected());
        this.regenerateFailedBtn.addEventListener('click', () => this.regenerateFailed());
        
        // Quick actions
        this.randomQuoteBtn.addEventListener('click', () => this.goToRandomQuote());
        this.duplicateSettingsBtn.addEventListener('click', () => this.duplicateSettings());
        this.resetEffectsBtn.addEventListener('click', () => this.resetEffects());
        
        // Settings
        this.touchMode.addEventListener('change', () => this.toggleTouchMode());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.resetSettingsBtn.addEventListener('click', () => this.resetSettings());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
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

    // Naming scheme functionality
    updateNamingPreview() {
        const sampleQuote = this.quotes.length > 0 ? this.quotes[this.currentQuoteIndex] : "This is a sample quote";
        const index = this.quotes.length > 0 ? this.currentQuoteIndex : 0;
        const filename = this.generateFilename(index, sampleQuote);
        this.namingPreviewText.textContent = filename;
    }

    generateFilename(index, quote) {
        const pattern = this.namingPatternInput.value || 'quote-{index}';
        const indexStart = parseInt(this.indexStartInput.value) || 1;
        const indexPadding = parseInt(this.indexPaddingInput.value) || 0;
        const quoteMaxLength = parseInt(this.quoteMaxLengthInput.value) || 30;
        const dateFormat = this.dateFormatSelect.value;
        const timeFormat = this.timeFormatSelect.value;

        const now = new Date();
        const actualIndex = index + indexStart;
        
        // Pad index with zeros if requested
        const paddedIndex = indexPadding > 0 ? 
            actualIndex.toString().padStart(indexPadding, '0') : 
            actualIndex.toString();

        // Clean quote text for filename
        const cleanQuote = this.sanitizeForFilename(quote)
            .substring(0, quoteMaxLength)
            .trim();

        // Format date
        const formattedDate = this.formatDate(now, dateFormat);
        
        // Format time
        const formattedTime = this.formatTime(now, timeFormat);
        
        // Unix timestamp
        const timestamp = Math.floor(now.getTime() / 1000);

        // Replace variables in pattern
        let filename = pattern
            .replace(/\{index\}/g, paddedIndex)
            .replace(/\{quote\}/g, cleanQuote)
            .replace(/\{date\}/g, formattedDate)
            .replace(/\{time\}/g, formattedTime)
            .replace(/\{timestamp\}/g, timestamp.toString());

        // Clean filename
        filename = this.sanitizeForFilename(filename);
        
        return filename + '.png';
    }

    sanitizeForFilename(text) {
        // Remove or replace characters that are invalid in filenames
        return text
            .replace(/[<>:"/\\|?*\x00-\x1f]/g, '') // Remove invalid chars
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/[^\w\-_.]/g, '') // Keep only alphanumeric, hyphens, underscores, and dots
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    }

    formatDate(date, format) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        switch (format) {
            case 'MM-DD-YYYY':
                return `${month}-${day}-${year}`;
            case 'DD-MM-YYYY':
                return `${day}-${month}-${year}`;
            case 'YYYYMMDD':
                return `${year}${month}${day}`;
            case 'YYYY-MM-DD':
            default:
                return `${year}-${month}-${day}`;
        }
    }

    formatTime(date, format) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        switch (format) {
            case 'HH-MM':
                return `${hours}-${minutes}`;
            case 'HHMMSS':
                return `${hours}${minutes}${seconds}`;
            case 'HHMM':
                return `${hours}${minutes}`;
            case 'HH-MM-SS':
            default:
                return `${hours}-${minutes}-${seconds}`;
        }
    }

    // Enhanced accordion functionality
    toggleAccordion(type) {
        if (type === 'naming') {
            const isActive = this.namingContent.classList.contains('active');
            
            if (isActive) {
                this.namingContent.classList.remove('active');
                this.namingHeader.classList.remove('active');
            } else {
                this.namingContent.classList.add('active');
                this.namingHeader.classList.add('active');
            }
        }
    }
    
    // Theme management
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
        this.themeToggle.textContent = this.isDarkTheme ? '☀️' : '🌙';
        this.settings.theme = this.isDarkTheme ? 'dark' : 'light';
        if (this.settings.autoSave) this.saveSettings();
    }
    
    // Panel management
    togglePanel(type) {
        const panel = type === 'settings' ? this.settingsPanel : this.performancePanel;
        const otherPanel = type === 'settings' ? this.performancePanel : this.settingsPanel;
        
        // Close other panel
        otherPanel.style.display = 'none';
        
        // Toggle current panel
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    }
    
    // Tab navigation
    switchTab(tabId) {
        // Update buttons
        this.tabBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        
        // Update content
        this.tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        
        this.currentTab = tabId;
        
        // Update preview if switching to export tab
        if (tabId === 'export-tab') {
            setTimeout(() => this.updatePreview(), 100);
        }
        
        // Update progress indicator
        this.updateProgressIndicator(tabId);
    }
    
    updateProgressIndicator(activeTabId) {
        const tabStepMap = {
            'content-tab': 1,
            'design-tab': 2,
            'effects-tab': 3,
            'export-tab': 4
        };
        
        const currentStep = tabStepMap[activeTabId] || 1;
        
        // Update active step
        document.querySelectorAll('.step-item').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else if (index + 1 < currentStep) {
                step.classList.add('completed');
            }
        });
        
        // Update progress line
        const progressWidth = ((currentStep - 1) / 3) * 100;
        document.querySelector('.progress-line').style.setProperty('--progress-width', progressWidth + '%');
    }
    
    // Enhanced preview controls
    adjustZoom(delta) {
        this.zoomLevel = Math.max(0.5, Math.min(3, this.zoomLevel + delta));
        this.zoomLevel.textContent = Math.round(this.zoomLevel * 100) + '%';
        this.applyZoom();
    }
    
    applyZoom() {
        const canvas = this.previewCanvas;
        canvas.style.transform = `scale(${this.zoomLevel})`;
        canvas.style.transformOrigin = 'center center';
    }
    
    toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            const overlay = document.createElement('div');
            overlay.className = 'fullscreen-overlay';
            
            const canvas = this.previewCanvas.cloneNode();
            canvas.className = 'fullscreen-canvas';
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'fullscreen-close';
            closeBtn.textContent = '×';
            closeBtn.onclick = () => document.body.removeChild(overlay);
            
            overlay.appendChild(canvas);
            overlay.appendChild(closeBtn);
            document.body.appendChild(overlay);
            
            // Copy current canvas content
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this.previewCanvas, 0, 0);
        }
    }
    
    toggleComparison() {
        const comparison = this.comparisonCanvas.parentElement;
        const isVisible = comparison.style.display !== 'none';
        
        comparison.style.display = isVisible ? 'none' : 'block';
        this.comparisonBtn.textContent = isVisible ? '👁️‍🗨️' : '👁️';
        
        if (!isVisible) {
            // Draw comparison with different background or settings
            this.drawComparisonPreview();
        }
    }
    
    drawComparisonPreview() {
        // This would show the same quote with different background or settings
        const canvas = this.comparisonCanvas;
        const ctx = canvas.getContext('2d');
        
        canvas.width = this.previewCanvas.width;
        canvas.height = this.previewCanvas.height;
        
        // Draw with no background effects for comparison
        this.drawQuoteImageWithEffects(this.currentQuoteIndex, canvas, ctx, true);
    }
    
    // Touch mode
    toggleTouchMode() {
        this.isTouchMode = this.touchMode.checked;
        document.body.classList.toggle('touch-mode', this.isTouchMode);
        this.settings.touchMode = this.isTouchMode;
        if (this.settings.autoSave) this.saveSettings();
    }
    
    // Settings persistence
    loadSettings() {
        try {
            const saved = localStorage.getItem('quotecanvas-settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
                this.applySettings();
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('quotecanvas-settings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }
    
    applySettings() {
        // Apply theme
        if (this.settings.theme === 'dark') {
            this.isDarkTheme = true;
            document.body.classList.add('dark-theme');
            this.themeToggle.textContent = '☀️';
        }
        
        // Apply touch mode
        if (this.settings.touchMode) {
            this.isTouchMode = true;
            this.touchMode.checked = true;
            document.body.classList.add('touch-mode');
        }
        
        // Apply other settings
        this.autoSaveSettings.checked = this.settings.autoSave;
        this.previewQuality.value = this.settings.previewQuality;
    }
    
    resetSettings() {
        this.settings = {
            autoSave: true,
            previewQuality: 'medium',
            touchMode: true,
            theme: 'light'
        };
        localStorage.removeItem('quotecanvas-settings');
        location.reload(); // Refresh to apply reset
    }
    
    // Drag and drop enhancements
    setupDragAndDrop() {
        const dropZones = [
            this.textFileLabel,
            this.backgroundFilesLabel,
            document.querySelector('.text-input'),
            this.previewCanvas
        ];
        
        dropZones.forEach(zone => {
            if (!zone) return;
            
            zone.classList.add('drag-zone');
            
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                zone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                zone.addEventListener(eventName, () => {
                    zone.classList.add('drag-over');
                });
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                zone.addEventListener(eventName, () => {
                    zone.classList.remove('drag-over');
                });
            });
            
            zone.addEventListener('drop', (e) => {
                const files = Array.from(e.dataTransfer.files);
                this.handleDroppedFiles(files, zone);
            });
        });
    }
    
    handleDroppedFiles(files, zone) {
        const textFiles = files.filter(f => f.type === 'text/plain' || f.name.endsWith('.json'));
        const imageFiles = files.filter(f => f.type.startsWith('image/'));
        
        if (zone === this.textFileLabel || zone === document.querySelector('.text-input')) {
            if (textFiles.length > 0) {
                // Simulate file input
                const dt = new DataTransfer();
                textFiles.forEach(file => dt.items.add(file));
                this.textFileInput.files = dt.files;
                this.handleTextFiles({ target: this.textFileInput });
            }
        } else if (zone === this.backgroundFilesLabel) {
            if (imageFiles.length > 0) {
                const dt = new DataTransfer();
                imageFiles.forEach(file => dt.items.add(file));
                this.backgroundFilesInput.files = dt.files;
                this.handleBackgroundFiles({ target: this.backgroundFilesInput });
            }
        }
    }
    
    // Performance monitoring
    startPerformanceMonitoring() {
        setInterval(() => {
            this.updatePerformanceStats();
        }, 2000);
    }
    
    updatePerformanceStats() {
        // Memory usage (approximate)
        const memoryInfo = performance.memory;
        if (memoryInfo) {
            const used = Math.round(memoryInfo.usedJSHeapSize / 1048576);
            this.memoryUsage.textContent = `${used} MB`;
        }
        
        // Cache size
        this.cacheSize.textContent = `${this.imageCache.size}/${this.maxCacheSize}`;
        
        // Generation speed
        if (this.generationStats.speed > 0) {
            this.generationSpeed.textContent = `${this.generationStats.speed.toFixed(1)} img/min`;
        }
        
        // Images generated
        this.imagesGenerated.textContent = this.generationStats.imagesGenerated.toString();
    }
    
    // Keyboard shortcuts
    handleKeyboardShortcuts(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (e.shiftKey) {
                    this.previousQuote();
                } else {
                    this.nextQuote();
                }
                break;
            case 'Enter':
                e.preventDefault();
                if (e.ctrlKey) {
                    this.generateAllImages();
                } else {
                    this.generateCurrentImage();
                }
                break;
            case 'KeyF':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.toggleFullscreen();
                }
                break;
            case 'KeyR':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.goToRandomQuote();
                }
                break;
        }
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
        
        this.updateNamingPreview();
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
        this.drawQuoteImageWithEffects(this.currentQuoteIndex);
        this.updateCurrentQuoteText();
    }
    
    updateCurrentQuoteText() {
        if (this.currentQuoteText && this.quotes.length > 0) {
            const quote = this.quotes[this.currentQuoteIndex];
            this.currentQuoteText.textContent = quote.length > 100 ? 
                quote.substring(0, 100) + '...' : quote;
        }
    }
    
    // Enhanced drawing with effects
    drawQuoteImageWithEffects(quoteIndex, canvas = null, context = null, skipEffects = false) {
        const targetCanvas = canvas || this.previewCanvas;
        const targetCtx = context || this.ctx;
        
        const width = targetCanvas.width;
        const height = targetCanvas.height;
        const quote = this.quotes[quoteIndex];
        
        // Clear canvas
        targetCtx.clearRect(0, 0, width, height);
        
        // Draw background with effects
        this.drawBackgroundWithEffects(targetCtx, width, height, skipEffects);
        
        // Draw text
        this.drawQuoteText(targetCtx, quote, width, height);
    }
    
    drawBackgroundWithEffects(ctx, width, height, skipEffects = false) {
        // Draw background image or solid color
        if (this.backgroundImages.length > 0 && this.currentBackgroundIndex < this.backgroundImages.length) {
            const bgImg = this.backgroundImages[this.currentBackgroundIndex];
            
            if (!skipEffects) {
                // Apply filters
                const filters = this.buildFilterString();
                ctx.filter = filters;
            }
            
            ctx.drawImage(bgImg, 0, 0, width, height);
            ctx.filter = 'none'; // Reset filter
            
            if (!skipEffects) {
                // Apply additional effects
                this.applyVignette(ctx, width, height);
                this.applyGradientOverlay(ctx, width, height);
            }
            
            // Add overlay for text readability
            const overlayOpacity = parseInt(this.overlayOpacityInput.value) / 100;
            ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
            ctx.fillRect(0, 0, width, height);
        } else {
            // Solid background color
            ctx.fillStyle = this.backgroundColorInput.value;
            ctx.fillRect(0, 0, width, height);
        }
    }
    
    buildFilterString() {
        const blur = parseInt(this.bgBlur.value);
        const brightness = parseInt(this.bgBrightness.value);
        const contrast = parseInt(this.bgContrast.value);
        const saturation = parseInt(this.bgSaturation.value);
        const filter = this.bgFilter.value;
        
        let filters = [];
        
        if (blur > 0) filters.push(`blur(${blur}px)`);
        if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
        if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
        if (saturation !== 100) filters.push(`saturate(${saturation}%)`);
        
        switch (filter) {
            case 'grayscale':
                filters.push('grayscale(100%)');
                break;
            case 'sepia':
                filters.push('sepia(100%)');
                break;
            case 'vintage':
                filters.push('sepia(50%) contrast(120%) brightness(90%)');
                break;
            case 'cool':
                filters.push('hue-rotate(180deg) saturate(120%)');
                break;
            case 'warm':
                filters.push('hue-rotate(30deg) saturate(110%) brightness(110%)');
                break;
        }
        
        return filters.join(' ');
    }
    
    applyVignette(ctx, width, height) {
        const strength = parseInt(this.vignetteStrength.value) / 100;
        if (strength === 0) return;
        
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.max(width, height) * 0.7;
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
        gradient.addColorStop(1, `rgba(0, 0, 0, ${strength})`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    applyGradientOverlay(ctx, width, height) {
        const overlayType = this.gradientOverlay.value;
        if (overlayType === 'none') return;
        
        let gradient;
        const color1 = this.gradientColor1.value;
        const color2 = this.gradientColor2.value;
        
        switch (overlayType) {
            case 'dark-bottom':
                gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
                break;
            case 'dark-top':
                gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                break;
            case 'dark-center':
                gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
                break;
            case 'custom':
                gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, this.hexToRgba(color1, 0.7));
                gradient.addColorStop(1, this.hexToRgba(color2, 0.7));
                break;
        }
        
        if (gradient) {
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }
    }
    
    drawQuoteText(ctx, quote, width, height) {
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
        
        ctx.fillStyle = textColor;
        ctx.font = `${fontStyle}${fontWeight} ${fontSize}px "${fontFamily}"`;
        ctx.textAlign = textAlign;
        ctx.textBaseline = 'middle';
        
        // Apply text shadow
        this.applyTextShadow(ctx);
        
        // Text wrapping
        const maxWidth = width - (padding * 2);
        const lines = this.wrapText(ctx, quote, maxWidth);
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
                
                ctx.save();
                ctx.strokeStyle = this.hexToRgba(shadowColor, shadowOpacity);
                ctx.lineWidth = Math.max(1, fontSize * 0.03);
                ctx.lineJoin = 'round';
                ctx.strokeText(line, x, y);
                ctx.restore();
            }
            
            // Draw underline if active
            if (this.fontUnderlineBtn.classList.contains('active')) {
                const textMetrics = ctx.measureText(line);
                const underlineY = y + fontSize * 0.1;
                const underlineThickness = Math.max(1, fontSize * 0.05);
                
                ctx.save();
                ctx.strokeStyle = textColor;
                ctx.lineWidth = underlineThickness;
                ctx.beginPath();
                
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
                
                ctx.moveTo(underlineX, underlineY);
                ctx.lineTo(underlineX + underlineWidth, underlineY);
                ctx.stroke();
                ctx.restore();
            }
            
            ctx.fillText(line, x, y);
        });
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
    }

    // Legacy method - now redirects to enhanced version
    drawQuoteImage(quoteIndex, canvas = null, context = null) {
        this.drawQuoteImageWithEffects(quoteIndex, canvas, context);
    }

    // Removed - functionality merged into drawQuoteImageWithEffects

    // Removed - functionality merged into drawQuoteImageForGeneration

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
        await this.generateImages();
    }
    
    // generateRange method removed - batch processing functionality removed
    
    async generateImages() {
        if (this.isGenerating) return;
        
        this.isGenerating = true;
        this.isPaused = false;
        this.failedImages = [];
        
        const totalQuotes = this.quotes.length;
        const quotesToGenerate = this.quotes;
        
        this.generationStats = {
            startTime: Date.now(),
            imagesGenerated: 0,
            totalImages: totalQuotes,
            speed: 0
        };
        
        this.showGenerationUI(true);
        this.generatedImages = [];
        
        try {
            await this.generateImagesBatch(quotesToGenerate);
            this.displayResults();
        } catch (error) {
            console.error('Generation failed:', error);
            this.progressDetails.textContent = 'Generation failed: ' + error.message;
        } finally {
            this.showGenerationUI(false);
            this.isGenerating = false;
        }
    }
    
    showGenerationUI(show) {
        this.progressContainer.style.display = show ? 'block' : 'none';
        this.generateAllBtn.disabled = show;
        this.generateCurrentBtn.disabled = show;
    }
    
    async generateImagesBatch(quotes) {
        const width = parseInt(this.imageWidthInput.value);
        const height = parseInt(this.imageHeightInput.value);
        
        for (let i = 0; i < quotes.length; i++) {
            if (!this.isGenerating) break; // Cancelled
            
            while (this.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            try {
                const actualIndex = i;
                const quote = quotes[i];
                
                // Update progress
                this.updateGenerationProgress(i + 1, quotes.length, quote);
                
                // Create temporary canvas for generation
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                
                // Calculate which background to use
                let backgroundImg = null;
                if (this.backgroundImageFiles.length > 0) {
                    const backgroundIndex = actualIndex % this.backgroundImageFiles.length;
                    try {
                        backgroundImg = await this.loadImageFromCache(backgroundIndex);
                    } catch (error) {
                        console.warn(`Failed to load background ${backgroundIndex}:`, error);
                    }
                }
                
                await this.drawQuoteImageForGeneration(actualIndex, canvas, ctx, backgroundImg);
                
                // Convert to blob with selected format
                const blob = await this.canvasToBlob(canvas);
                const imageData = {
                    blob: blob,
                    dataUrl: canvas.toDataURL(this.getImageFormat(), this.getImageQuality()),
                    filename: this.generateFilename(actualIndex, quote),
                    quote: quote,
                    index: actualIndex,
                    success: true
                };
                
                this.generatedImages.push(imageData);
                this.generationStats.imagesGenerated++;
                
                // Cleanup
                canvas.width = 1;
                canvas.height = 1;
                ctx.clearRect(0, 0, 1, 1);
                
                // Yield control periodically
                if (i % 3 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
                
            } catch (error) {
                console.error(`Error generating image ${i + 1}:`, error);
                this.failedImages.push({
                    index: startIndex + i,
                    quote: quotes[i],
                    error: error.message
                });
            }
        }
        
        // Update final stats
        this.updateGenerationStats();
        
        // Show regenerate button if there were failures
        if (this.failedImages.length > 0) {
            this.regenerateFailedBtn.style.display = 'block';
        }
    }
    
    updateGenerationProgress(current, total, currentQuote) {
        const progress = (current / total) * 100;
        this.progressFill.style.width = progress + '%';
        this.progressText.textContent = Math.round(progress) + '%';
        
        const truncatedQuote = currentQuote.length > 50 ? 
            currentQuote.substring(0, 50) + '...' : currentQuote;
        this.progressDetails.textContent = `Processing: "${truncatedQuote}" (${current}/${total})`;
    }
    
    updateGenerationStats() {
        if (this.generationStats.startTime) {
            const elapsed = (Date.now() - this.generationStats.startTime) / 1000 / 60; // minutes
            this.generationStats.speed = this.generationStats.imagesGenerated / elapsed;
        }
    }
    
    pauseGeneration() {
        this.isPaused = !this.isPaused;
        this.pauseGenerationBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
        this.progressDetails.textContent = this.isPaused ? 'Generation paused...' : 'Resuming generation...';
    }
    
    cancelGeneration() {
        this.isGenerating = false;
        this.isPaused = false;
        this.progressDetails.textContent = 'Generation cancelled';
        this.pauseGenerationBtn.textContent = 'Pause';
    }
    
    async drawQuoteImageForGeneration(quoteIndex, canvas, ctx, backgroundImg) {
        const width = canvas.width;
        const height = canvas.height;
        const quote = this.quotes[quoteIndex];
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background with effects
        if (backgroundImg && backgroundImg.complete && backgroundImg.naturalWidth > 0) {
            try {
                // Apply filters
                const filters = this.buildFilterString();
                ctx.filter = filters;
                ctx.drawImage(backgroundImg, 0, 0, width, height);
                ctx.filter = 'none';
                
                // Apply additional effects
                this.applyVignette(ctx, width, height);
                this.applyGradientOverlay(ctx, width, height);
                
                // Add overlay for text readability
                const overlayOpacity = parseInt(this.overlayOpacityInput.value) / 100;
                ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
                ctx.fillRect(0, 0, width, height);
            } catch (error) {
                console.warn(`Failed to draw background for quote ${quoteIndex + 1}:`, error);
                // Fall back to solid background
                ctx.fillStyle = this.backgroundColorInput.value;
                ctx.fillRect(0, 0, width, height);
            }
        } else {
            // Solid background color
            ctx.fillStyle = this.backgroundColorInput.value;
            ctx.fillRect(0, 0, width, height);
        }
        
        // Draw text
        this.drawQuoteText(ctx, quote, width, height);
    }
    
    async canvasToBlob(canvas) {
        const format = this.getImageFormat();
        const quality = this.getImageQuality();
        
        return new Promise(resolve => {
            canvas.toBlob(resolve, format, quality);
        });
    }
    
    getImageFormat() {
        const format = this.exportFormat.value;
        switch (format) {
            case 'jpeg': return 'image/jpeg';
            case 'webp': return 'image/webp';
            default: return 'image/png';
        }
    }
    
    getImageQuality() {
        if (this.exportFormat.value === 'jpeg') {
            return parseInt(this.jpegQuality.value) / 100;
        }
        return 0.92; // Default quality for PNG/WebP
    }
    
    // Quick action methods
    goToRandomQuote() {
        if (this.quotes.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        this.currentQuoteIndex = randomIndex;
        this.updateQuoteDisplay();
        this.updatePreview();
    }
    
    duplicateSettings() {
        const settings = this.exportCurrentSettings();
        navigator.clipboard.writeText(JSON.stringify(settings, null, 2)).then(() => {
            alert('Settings copied to clipboard!');
        }).catch(() => {
            // Fallback: show settings in a dialog
            prompt('Copy these settings:', JSON.stringify(settings, null, 2));
        });
    }
    
    exportCurrentSettings() {
        return {
            dimensions: {
                width: this.imageWidthInput.value,
                height: this.imageHeightInput.value
            },
            typography: {
                fontFamily: this.fontFamilySelect.value,
                fontSize: this.fontSizeInput.value,
                fontWeight: this.fontWeightSelect.value,
                textColor: this.textColorInput.value,
                textAlign: this.textAlignSelect.value,
                lineHeight: this.lineHeightInput.value
            },
            effects: {
                blur: this.bgBlur.value,
                brightness: this.bgBrightness.value,
                contrast: this.bgContrast.value,
                saturation: this.bgSaturation.value,
                filter: this.bgFilter.value,
                vignette: this.vignetteStrength.value,
                gradientOverlay: this.gradientOverlay.value
            },
            export: {
                format: this.exportFormat.value,
                quality: this.jpegQuality.value
            }
        };
    }
    
    resetEffects() {
        // Reset all effect controls to defaults
        this.bgBlur.value = 0;
        this.bgBlurValue.textContent = '0px';
        this.bgBrightness.value = 100;
        this.bgBrightnessValue.textContent = '100%';
        this.bgContrast.value = 100;
        this.bgContrastValue.textContent = '100%';
        this.bgSaturation.value = 100;
        this.bgSaturationValue.textContent = '100%';
        this.bgFilter.value = 'none';
        this.vignetteStrength.value = 0;
        this.vignetteValue.textContent = '0%';
        this.gradientOverlay.value = 'none';
        
        this.updatePreview();
    }
    
    // UI control methods
    toggleFormatControls() {
        const format = this.exportFormat.value;
        const jpegGroup = document.getElementById('jpeg-quality-group');
        jpegGroup.style.display = format === 'jpeg' ? 'block' : 'none';
    }
    
    toggleGradientControls() {
        const overlay = this.gradientOverlay.value;
        const color1Group = document.getElementById('gradient-colors');
        const color2Group = document.getElementById('gradient-colors2');
        
        const show = overlay === 'custom';
        color1Group.style.display = show ? 'block' : 'none';
        color2Group.style.display = show ? 'block' : 'none';
    }
    
    // toggleRangeControls method removed - batch processing functionality removed
    
    applyResolutionPreset() {
        const preset = this.exportResolution.value;
        
        const presets = {
            'instagram-square': [1080, 1080],
            'instagram-story': [1080, 1920],
            'facebook-post': [1200, 630],
            'twitter-card': [1200, 675],
            '4k': [3840, 2160],
            'hd': [1920, 1080]
        };
        
        if (presets[preset]) {
            const [width, height] = presets[preset];
            this.imageWidthInput.value = width;
            this.imageHeightInput.value = height;
            this.updatePreview();
        }
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
                    filename: this.generateFilename(i, this.quotes[i]),
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
        
        // Load background if available
        let backgroundImg = null;
        if (this.backgroundImageFiles.length > 0) {
            try {
                backgroundImg = await this.loadImageFromCache(this.currentBackgroundIndex);
            } catch (error) {
                console.warn('Failed to load background for current image:', error);
            }
        }
        
        await this.drawQuoteImageForGeneration(this.currentQuoteIndex, canvas, ctx, backgroundImg);
        
        // Convert to blob and download
        const blob = await this.canvasToBlob(canvas);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.generateFilename(this.currentQuoteIndex, this.quotes[this.currentQuoteIndex]);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    displayResults() {
        this.resultsGrid.innerHTML = '';
        
        this.generatedImages.forEach((imageData, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            // Selection checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.index = index;
            checkbox.addEventListener('change', () => this.updateSelectionButtons());
            
            const img = document.createElement('img');
            img.src = imageData.dataUrl;
            img.alt = `Quote ${imageData.index + 1}`;
            img.addEventListener('click', () => this.previewImage(imageData));
            img.style.cursor = 'pointer';
            
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.textContent = 'Download';
            downloadBtn.onclick = () => this.downloadImage(imageData);
            
            const quoteText = document.createElement('p');
            quoteText.textContent = imageData.quote.substring(0, 50) + (imageData.quote.length > 50 ? '...' : '');
            quoteText.style.fontSize = '12px';
            quoteText.style.color = '#666';
            quoteText.style.margin = '5px 0';
            
            const filename = document.createElement('small');
            filename.textContent = imageData.filename;
            filename.style.color = '#999';
            filename.style.display = 'block';
            filename.style.marginTop = '5px';
            
            const controls = document.createElement('div');
            controls.style.display = 'flex';
            controls.style.gap = '5px';
            controls.style.alignItems = 'center';
            controls.style.marginTop = '10px';
            
            controls.appendChild(checkbox);
            controls.appendChild(downloadBtn);
            
            resultItem.appendChild(img);
            resultItem.appendChild(quoteText);
            resultItem.appendChild(filename);
            resultItem.appendChild(controls);
            this.resultsGrid.appendChild(resultItem);
        });
        
        // Show results section and update UI
        this.resultsSection.style.display = 'block';
        this.updateSelectionButtons();
        
        // Switch to export tab to show results
        this.switchTab('export-tab');
        
        // Show summary
        this.showGenerationSummary();
    }
    
    updateSelectionButtons() {
        const selected = this.getSelectedImages();
        this.downloadSelectedBtn.disabled = selected.length === 0;
        this.downloadSelectedBtn.textContent = `Download Selected (${selected.length})`;
    }
    
    previewImage(imageData) {
        // Create a fullscreen preview
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        
        const img = document.createElement('img');
        img.src = imageData.dataUrl;
        img.className = 'fullscreen-canvas';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'fullscreen-close';
        closeBtn.textContent = '×';
        closeBtn.onclick = () => document.body.removeChild(overlay);
        
        const info = document.createElement('div');
        info.style.position = 'absolute';
        info.style.bottom = '20px';
        info.style.left = '20px';
        info.style.color = 'white';
        info.style.background = 'rgba(0,0,0,0.7)';
        info.style.padding = '10px';
        info.style.borderRadius = '5px';
        info.innerHTML = `
            <strong>${imageData.filename}</strong><br>
            <em>${imageData.quote.substring(0, 100)}${imageData.quote.length > 100 ? '...' : ''}</em>
        `;
        
        overlay.appendChild(img);
        overlay.appendChild(closeBtn);
        overlay.appendChild(info);
        document.body.appendChild(overlay);
        
        // Close on click outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }
    
    showGenerationSummary() {
        const total = this.generatedImages.length;
        const failed = this.failedImages.length;
        const success = total;
        const elapsed = this.generationStats.startTime ? 
            ((Date.now() - this.generationStats.startTime) / 1000).toFixed(1) : 0;
        
        let message = `✅ Generated ${success} images successfully`;
        if (failed > 0) {
            message += ` (${failed} failed)`;
        }
        message += ` in ${elapsed}s`;
        
        this.progressDetails.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (this.progressContainer.style.display === 'block') {
                this.progressContainer.style.display = 'none';
            }
        }, 5000);
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
        await this.downloadImagesAsZip(this.generatedImages);
    }
    
    async downloadSelected() {
        const selected = this.getSelectedImages();
        if (selected.length === 0) {
            alert('Please select images to download');
            return;
        }
        await this.downloadImagesAsZip(selected);
    }
    
    async downloadImagesAsZip(images) {
        const zip = new JSZip();
        const compression = this.zipCompression.value;
        
        const compressionSettings = {
            fast: { level: 1 },
            balanced: { level: 6 },
            best: { level: 9 }
        };
        
        images.forEach(imageData => {
            zip.file(imageData.filename, imageData.blob);
        });
        
        const zipBlob = await zip.generateAsync({ 
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: compressionSettings[compression]
        });
        
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quote-images-${images.length}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    getSelectedImages() {
        const checkboxes = document.querySelectorAll('.result-item input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => {
            const index = parseInt(cb.dataset.index);
            return this.generatedImages[index];
        }).filter(Boolean);
    }
    
    async regenerateFailed() {
        if (this.failedImages.length === 0) return;
        
        const failedQuotes = this.failedImages.map(f => f.quote);
        const failedIndices = this.failedImages.map(f => f.index);
        
        this.failedImages = []; // Reset failed list
        
        try {
            await this.generateImagesBatch(failedQuotes, Math.min(...failedIndices));
            this.displayResults();
        } catch (error) {
            console.error('Failed to regenerate images:', error);
        }
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