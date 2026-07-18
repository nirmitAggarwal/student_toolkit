import { useState, useRef } from 'react';
import { 
  FiDownload, 
  FiUploadCloud, 
  FiTrash2, 
  FiSliders, 
  FiEye, 
  FiCheckCircle, 
  FiRefreshCw, 
  FiX, 
  FiSettings,
  FiInfo
} from 'react-icons/fi';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';

function ImageCompressorPage() {
  const [images, setImages] = useState([]);
  const [quality, setQuality] = useState(80);
  const [mode, setMode] = useState('balanced'); // 'high-quality' | 'balanced' | 'low-size' | 'lossless' | 'custom'
  const [format, setFormat] = useState('original'); // 'original' | 'webp' | 'jpeg' | 'png'
  const [alwaysKeepResolution, setAlwaysKeepResolution] = useState(true);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(1920);
  const [isCompressingAll, setIsCompressingAll] = useState(false);
  const [activeComparisonId, setActiveComparisonId] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Helper: Format byte size to human readable
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Helper: Get image width & height dimensions
  const getImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const dims = { width: img.naturalWidth, height: img.naturalHeight };
        URL.revokeObjectURL(img.src);
        resolve(dims);
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle preset mode select
  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === 'high-quality') {
      setQuality(90);
      setAlwaysKeepResolution(true);
    } else if (selectedMode === 'balanced') {
      setQuality(75);
      setAlwaysKeepResolution(false);
      setMaxWidthOrHeight(1920);
    } else if (selectedMode === 'low-size') {
      setQuality(55);
      setAlwaysKeepResolution(false);
      setMaxWidthOrHeight(1280);
    } else if (selectedMode === 'lossless') {
      setQuality(100);
      setAlwaysKeepResolution(true);
    }
  };

  // Process files after drops or file dialog selections
  const handleFiles = async (filesList) => {
    const selectedFiles = Array.from(filesList).filter(file => 
      file.type.startsWith('image/')
    );

    if (selectedFiles.length === 0) {
      toast.error('Please upload valid image files (JPG, PNG, WEBP)');
      return;
    }

    const newImages = await Promise.all(
      selectedFiles.map(async (file) => {
        const dimensions = await getImageDimensions(file);
        return {
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          original: file,
          originalSize: file.size,
          originalWidth: dimensions.width,
          originalHeight: dimensions.height,
          originalPreview: URL.createObjectURL(file),
          compressed: null,
          compressedSize: 0,
          compressedWidth: 0,
          compressedHeight: 0,
          compressedPreview: null,
          status: 'pending',
          progress: 0,
          errorMsg: null,
        };
      })
    );

    setImages((prev) => [...prev, ...newImages]);
    toast.success(`Added ${newImages.length} image(s)`);
  };

  const handleImageSelect = (e) => {
    handleFiles(e.target.files);
    if (e.target) e.target.value = '';
  };

  // Drag-and-drop event handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Compress a single image by ID
  const compressImage = async (id) => {
    const imgIndex = images.findIndex((img) => img.id === id);
    if (imgIndex === -1) return;

    setImages((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'compressing', progress: 10 } : item
      )
    );

    const img = images[imgIndex];

    try {
      const originalSizeMB = img.originalSize / (1024 * 1024);
      let targetMaxSizeMB = originalSizeMB;

      if (mode === 'lossless') {
        targetMaxSizeMB = originalSizeMB * 1.5; 
      } else {
        targetMaxSizeMB = Math.max(0.02, originalSizeMB * (quality / 100) * 0.95);
      }

      const options = {
        maxSizeMB: targetMaxSizeMB,
        maxWidthOrHeight: alwaysKeepResolution ? undefined : Number(maxWidthOrHeight),
        useWebWorker: true,
        initialQuality: quality / 100,
        alwaysKeepResolution: alwaysKeepResolution,
        onProgress: (p) => {
          setImages((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, progress: Math.min(95, Math.max(10, p)) } : item
            )
          );
        },
      };

      if (format !== 'original') {
        options.fileType = `image/${format}`;
      }

      const compressedFile = await imageCompression(img.original, options);
      const compressedDims = await getImageDimensions(compressedFile);

      setImages((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                compressed: compressedFile,
                compressedSize: compressedFile.size,
                compressedWidth: compressedDims.width || item.originalWidth,
                compressedHeight: compressedDims.height || item.originalHeight,
                compressedPreview: URL.createObjectURL(compressedFile),
                status: 'success',
                progress: 100,
              }
            : item
        )
      );

      toast.success(`${img.original.name.substring(0, 15)}... compressed!`);
    } catch (error) {
      console.error(error);
      setImages((prev) =>
        prev.map((item) =>
          item.id === id 
            ? { 
                ...item, 
                status: 'error', 
                errorMsg: error.message || 'Compression failed', 
                progress: 0 
              } 
            : item
        )
      );
      toast.error(`Failed to compress ${img.original.name}`);
    }
  };

  // Compress all pending / failed images in queue
  const compressAll = async () => {
    const pendingImages = images.filter((img) => img.status === 'pending' || img.status === 'error');
    if (pendingImages.length === 0) {
      toast.error('No pending images to compress');
      return;
    }

    setIsCompressingAll(true);
    for (const img of pendingImages) {
      await compressImage(img.id);
    }
    setIsCompressingAll(false);
    toast.success('Finished processing all images!');
  };

  // Download a single compressed image
  const downloadImage = (id) => {
    const img = images.find((i) => i.id === id);
    if (!img || !img.compressed) return;

    const link = document.createElement('a');
    link.href = img.compressedPreview;
    
    let extension = img.original.name.split('.').pop();
    if (format !== 'original') {
      extension = format;
    }
    
    const originalBaseName = img.original.name.substring(0, img.original.name.lastIndexOf('.'));
    link.download = `${originalBaseName}_compressed.${extension}`;
    link.click();
  };

  // Download all successfully compressed images
  const downloadAll = () => {
    const compressedImages = images.filter((img) => img.status === 'success');
    if (compressedImages.length === 0) return;

    compressedImages.forEach((img) => {
      downloadImage(img.id);
    });
    toast.success('Downloading compressed images...');
  };

  // Remove single image item
  const removeImage = (id) => {
    const img = images.find((i) => i.id === id);
    if (img) {
      if (img.originalPreview) URL.revokeObjectURL(img.originalPreview);
      if (img.compressedPreview) URL.revokeObjectURL(img.compressedPreview);
    }
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  // Clear all images in queue
  const clearAll = () => {
    images.forEach((img) => {
      if (img.originalPreview) URL.revokeObjectURL(img.originalPreview);
      if (img.compressedPreview) URL.revokeObjectURL(img.compressedPreview);
    });
    setImages([]);
    toast.success('Image list cleared');
  };

  const comparisonImage = images.find((img) => img.id === activeComparisonId);

  return (
    <section className="space-y-6 max-w-[1400px] mx-auto">
      {/* Title Header Section */}
      <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 sm:p-8 shadow-card transition-colors duration-300">
        <h1 className="text-3xl font-serif font-bold text-foreground dark:text-white flex items-center gap-3">
          <span className="p-2 rounded-xl bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary">
            <FiSliders className="h-6 w-6" />
          </span>
          Image Compressor
        </h1>
        <p className="mt-2 text-foreground-muted dark:text-slate-400 max-w-2xl text-sm sm:text-base leading-relaxed">
          Compress images instantly using multi-threaded web workers directly in your browser. Files are processed locally on your machine — never uploaded to any server.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-[1.8fr_1.2fr]">
        
        {/* Left Column: Drag & Drop Dropzone + File List */}
        <div className="space-y-6">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center min-h-[220px] ${
              isDragging 
                ? 'border-primary bg-primary-light/50 dark:bg-primary/10 scale-[0.99] shadow-inner' 
                : 'border-border bg-surface hover:border-primary hover:bg-primary-light/20 dark:border-border-dark dark:bg-surface-dark dark:hover:border-secondary dark:hover:bg-surface-dark-elevated/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <div className="p-4 rounded-full bg-background dark:bg-surface-dark-elevated text-primary dark:text-secondary mb-4 transition-transform hover:scale-110">
              <FiUploadCloud className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-serif font-semibold text-foreground dark:text-white">
              Drag & Drop your images here
            </h3>
            <p className="mt-1 text-sm text-foreground-muted dark:text-slate-450">
              or click to browse from files
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-background px-3.5 py-1 text-xs font-semibold text-foreground dark:bg-surface-dark-elevated dark:text-slate-300">
              Supports JPEG, PNG, and WebP
            </span>
          </div>

          {/* Files List Panel */}
          {images.length > 0 && (
            <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card space-y-4 transition-colors duration-300">
              <div className="flex items-center justify-between border-b border-border dark:border-border-dark pb-4">
                <div>
                  <h2 className="text-lg font-serif font-semibold text-foreground dark:text-white">Uploaded Queue</h2>
                  <p className="text-xs text-foreground-muted">{images.length} file(s) loaded</p>
                </div>
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 rounded-full border border-red-200 text-red-650 hover:bg-red-50 px-4 py-1.5 text-xs font-semibold dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/30 transition duration-200"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                  Clear All
                </button>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-hide">
                {images.map((img) => {
                  const hasSavings = img.compressedSize > 0;
                  const savingsPct = hasSavings 
                    ? Math.round((1 - img.compressedSize / img.originalSize) * 100) 
                    : 0;

                  return (
                    <div 
                      key={img.id} 
                      className={`group relative rounded-xl border p-4 transition-all duration-200 ${
                        img.status === 'success' 
                          ? 'border-emerald-100 bg-emerald-50/10 dark:border-emerald-950/20 dark:bg-emerald-950/5' 
                          : img.status === 'error'
                          ? 'border-red-100 bg-red-50/10 dark:border-red-950/20 dark:bg-red-950/5'
                          : 'border-border bg-background/50 dark:border-border-dark dark:bg-surface-dark-elevated/40'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        {/* Left: Thumbnail and Filename details */}
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated">
                            <img
                              src={img.originalPreview}
                              alt="preview"
                              className="h-full w-full object-cover"
                            />
                            {img.status === 'success' && (
                              <div className="absolute right-0 bottom-0 bg-emerald-550 dark:bg-emerald-600 p-0.5 rounded-tl-lg text-white">
                                <FiCheckCircle className="h-3.5 w-3.5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground dark:text-slate-200" title={img.original.name}>
                              {img.original.name}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-foreground-muted dark:text-slate-400 font-medium">
                              <span>{formatSize(img.originalSize)}</span>
                              {img.originalWidth > 0 && (
                                <span className="opacity-60">• {img.originalWidth}x{img.originalHeight} px</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Status metrics and action buttons */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                          {img.status === 'success' && (
                            <div className="text-right">
                              <span className="inline-flex items-center rounded-full bg-emerald-105/10 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-450 border border-emerald-200/20">
                                -{savingsPct}% Saved
                              </span>
                              <p className="mt-1 text-xs font-medium text-foreground-muted dark:text-slate-400">
                                {formatSize(img.compressedSize)} ({img.compressedWidth}x{img.compressedHeight})
                              </p>
                            </div>
                          )}

                          {img.status === 'compressing' && (
                            <div className="w-28 space-y-1">
                              <div className="flex justify-between text-xs font-medium text-foreground-muted">
                                <span>Compressing...</span>
                                <span>{Math.round(img.progress)}%</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-background dark:bg-background-dark overflow-hidden">
                                <div 
                                  className="h-full bg-primary dark:bg-secondary transition-all duration-150"
                                  style={{ width: `${img.progress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {img.status === 'error' && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-950 dark:text-red-400" title={img.errorMsg}>
                              Error
                            </span>
                          )}

                          {/* Action triggers */}
                          <div className="flex items-center gap-1.5">
                            {img.status === 'success' && (
                              <button
                                onClick={() => {
                                  setActiveComparisonId(img.id);
                                  setSliderPosition(50);
                                }}
                                className="rounded-xl p-2 text-foreground-muted hover:text-primary dark:hover:text-secondary hover:bg-background dark:hover:bg-surface-dark-elevated transition-all"
                                title="Compare visual output before and after"
                              >
                                <FiEye className="h-4 w-4" />
                              </button>
                            )}

                            {img.status === 'pending' && (
                              <button
                                onClick={() => compressImage(img.id)}
                                className="rounded-full bg-primary hover:bg-primary-hover px-4 py-1.5 text-xs font-bold text-white transition-all shadow-sm"
                              >
                                Compress
                              </button>
                            )}

                            {img.status === 'error' && (
                              <button
                                onClick={() => compressImage(img.id)}
                                className="rounded-xl border border-border dark:border-border-dark p-2 text-foreground-muted hover:text-primary dark:hover:text-secondary hover:bg-background dark:hover:bg-surface-dark-elevated transition-all"
                                title="Retry compression"
                              >
                                <FiRefreshCw className="h-4 w-4" />
                              </button>
                            )}

                            {img.status === 'success' && (
                              <button
                                onClick={() => downloadImage(img.id)}
                                className="rounded-xl border border-border dark:border-border-dark bg-background hover:bg-primary-light/50 dark:bg-surface-dark-elevated dark:hover:bg-surface-dark p-2 text-foreground dark:text-white transition-all"
                                title="Download compressed file"
                              >
                                <FiDownload className="h-4 w-4" />
                              </button>
                            )}

                            <button
                              onClick={() => removeImage(img.id)}
                              className="rounded-xl p-2 text-foreground-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                              title="Remove item"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Compression Settings */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card space-y-6 transition-colors duration-300">
            
            {/* Compression Presets Mode Selector */}
            <div>
              <h3 className="text-sm font-semibold text-foreground dark:text-white flex items-center gap-2 mb-3">
                <FiSettings className="h-4 w-4 text-primary dark:text-secondary" />
                Compression Mode
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'high-quality', label: 'High Quality', desc: 'Visual lossless' },
                  { id: 'balanced', label: 'Balanced', desc: 'Good size reduction' },
                  { id: 'low-size', label: 'Low Size', desc: 'Heavy compression' },
                  { id: 'lossless', label: 'Lossless', desc: 'Format optimization' },
                  { id: 'custom', label: 'Custom Settings', desc: 'Configure manually' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleModeChange(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      mode === item.id 
                        ? 'border-primary bg-primary-light/40 dark:bg-primary/10 dark:border-secondary text-primary dark:text-secondary font-semibold shadow-sm animate-pulse-subtle'
                        : 'border-border hover:border-primary bg-background dark:border-border-dark dark:bg-surface-dark-elevated dark:hover:bg-surface-dark dark:hover:border-secondary'
                    } ${item.id === 'custom' ? 'col-span-2' : ''}`}
                  >
                    <p className="text-xs sm:text-sm">{item.label}</p>
                    <span className="text-[10px] text-foreground-muted dark:text-slate-500 font-normal leading-normal">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Output Format Converter */}
            <div>
              <h3 className="text-sm font-semibold text-foreground dark:text-white flex items-center gap-2 mb-3 font-serif">
                Convert Format
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'original', label: 'Keep Original' },
                  { id: 'webp', label: 'WEBP (Recommended)' },
                  { id: 'jpeg', label: 'JPEG' },
                  { id: 'png', label: 'PNG' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-200 ${
                      format === f.id
                        ? 'bg-primary border-primary text-white dark:bg-secondary dark:border-secondary'
                        : 'border-border hover:border-primary bg-surface dark:border-border-dark dark:bg-surface-dark-elevated dark:hover:border-secondary dark:text-slate-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-foreground-muted flex items-center gap-1">
                <FiInfo className="h-3 w-3 shrink-0 text-primary dark:text-secondary" />
                WebP files offer the best visual preservation and size reduction.
              </p>
            </div>

            {/* Custom settings controls */}
            <div className={`space-y-4 pt-4 border-t border-border dark:border-border-dark transition-all duration-300 ${
              mode !== 'custom' ? 'opacity-40 pointer-events-none select-none' : ''
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-foreground-muted">Custom Configuration</span>
                {mode !== 'custom' && (
                  <span className="text-[10px] text-foreground-muted/70 italic">Locked in preset</span>
                )}
              </div>

              {/* Quality Slider (Ignored for lossless mode) */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-foreground dark:text-slate-300 mb-1">
                  <label>Quality Target</label>
                  <span className="font-bold text-primary dark:text-secondary">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  disabled={mode !== 'custom'}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-1.5 bg-background dark:bg-background-dark rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Aspect Resize Toggle */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    disabled={mode !== 'custom'}
                    checked={alwaysKeepResolution}
                    onChange={(e) => setAlwaysKeepResolution(e.target.checked)}
                    className="rounded text-primary border-border focus:ring-primary dark:border-border-dark h-4 w-4"
                  />
                  <span className="text-xs font-medium text-foreground dark:text-slate-300">
                    Always preserve original dimensions (no scaling)
                  </span>
                </label>
              </div>

              {/* Resizing Max Width or Height */}
              {!alwaysKeepResolution && (
                <div className="space-y-2 pl-6 transition-all">
                  <div className="flex justify-between text-xs font-semibold text-foreground dark:text-slate-350">
                    <label>Max Width or Height</label>
                    <span className="font-bold">{maxWidthOrHeight} px</span>
                  </div>
                  <input
                    type="range"
                    min="480"
                    max="3840"
                    step="80"
                    disabled={mode !== 'custom'}
                    value={maxWidthOrHeight}
                    onChange={(e) => setMaxWidthOrHeight(Number(e.target.value))}
                    className="w-full h-1.5 bg-background dark:bg-background-dark rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              )}
            </div>

            {/* Global Actions Block */}
            <div className="pt-6 border-t border-border dark:border-border-dark space-y-3">
              <button
                onClick={compressAll}
                disabled={images.filter(img => img.status === 'pending' || img.status === 'error').length === 0 || isCompressingAll}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover disabled:bg-border dark:disabled:bg-border-dark disabled:text-foreground-muted disabled:cursor-not-allowed py-3 font-semibold text-white transition-all duration-200 shadow-glow"
              >
                {isCompressingAll ? (
                  <>
                    <FiRefreshCw className="h-4 w-4 animate-spin" />
                    Processing Queue...
                  </>
                ) : (
                  <>
                    Compress All Images
                  </>
                )}
              </button>

              <button
                onClick={downloadAll}
                disabled={images.filter(img => img.status === 'success').length === 0}
                className="w-full flex items-center justify-center gap-2 rounded-full border border-border hover:border-primary bg-surface hover:bg-primary-light/20 dark:border-border-dark dark:bg-surface-dark-elevated dark:hover:bg-surface-dark dark:hover:border-secondary disabled:opacity-40 disabled:cursor-not-allowed py-3 font-semibold text-foreground dark:text-slate-100 transition-all duration-250"
              >
                <FiDownload className="h-4 w-4" />
                Download All Compressed
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Before / After Comparison Split Lightbox Modal */}
      {comparisonImage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fadeIn">
          <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-border dark:border-border-dark flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-foreground dark:text-white truncate max-w-md sm:max-w-xl" title={comparisonImage.original.name}>
                  Comparing: {comparisonImage.original.name}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-foreground-muted font-medium">
                  <span>Original: {formatSize(comparisonImage.originalSize)} ({comparisonImage.originalWidth}x{comparisonImage.originalHeight})</span>
                  <span className="text-emerald-600 dark:text-emerald-450">Compressed: {formatSize(comparisonImage.compressedSize)} ({comparisonImage.compressedWidth}x{comparisonImage.compressedHeight})</span>
                  <span className="text-primary dark:text-secondary font-bold">
                    -{Math.round((1 - comparisonImage.compressedSize / comparisonImage.originalSize) * 100)}% Size Reduced
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveComparisonId(null)}
                className="rounded-full bg-background hover:bg-primary-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark p-2 text-foreground-muted hover:text-primary dark:hover:text-secondary transition-all"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Slider container: matches dimensions and clips dynamically */}
            <div className="flex-1 bg-background dark:bg-background-dark relative flex items-center justify-center p-4 overflow-hidden min-h-[300px] sm:min-h-[400px]">
              <div className="relative w-full h-full max-h-[55vh] aspect-video flex items-center justify-center overflow-hidden">
                
                {/* Underlay Image: Original */}
                <img
                  src={comparisonImage.originalPreview}
                  alt="Original visual"
                  className="absolute max-h-full max-w-full object-contain pointer-events-none select-none"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white z-10 font-semibold select-none border border-white/10">
                  Original (Before)
                </div>

                {/* Overlay Image: Compressed (Clipped dynamically by width %) */}
                <img
                  src={comparisonImage.compressedPreview}
                  alt="Compressed visual"
                  className="absolute max-h-full max-w-full object-contain pointer-events-none select-none"
                  style={{
                    clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                  }}
                />
                <div className="absolute top-4 right-4 bg-emerald-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white z-10 font-semibold select-none border border-white/10">
                  Compressed (After)
                </div>

                {/* Draggable boundary divider line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white text-slate-800 rounded-full flex items-center justify-center shadow-lg border border-slate-200 pointer-events-none select-none">
                    <FiSliders className="h-4 w-4 rotate-90" />
                  </div>
                </div>

                {/* Cover input range that intercepts touch and mouse drags natively */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                />
              </div>
            </div>

            {/* Modal Footer actions */}
            <div className="p-4 sm:p-6 border-t border-border dark:border-border-dark bg-background/50 dark:bg-surface-dark-elevated/55 flex items-center justify-between flex-wrap gap-4">
              <p className="text-xs text-foreground-muted font-medium">
                💡 Drag the slider left/right to compare compression details.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => downloadImage(comparisonImage.id)}
                  className="flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-glow"
                >
                  <FiDownload className="h-4 w-4" />
                  Download Compressed
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}

export default ImageCompressorPage;
