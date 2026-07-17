import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FiCopy, FiX, FiCamera, FiUpload, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

function QRScannerPage() {
  const [activeMode, setActiveMode] = useState('camera'); // 'camera' or 'file'
  const [scannedResults, setScannedResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  
  const qrCodeInstanceRef = useRef(null);
  const fileInputRef = useRef(null);

  const startScanning = () => {
    setCameraError('');
    setIsScanning(true);
  };

  const stopScanning = async () => {
    if (qrCodeInstanceRef.current) {
      try {
        if (qrCodeInstanceRef.current.isScanning) {
          await qrCodeInstanceRef.current.stop();
        }
      } catch (err) {
        console.error('Error stopping camera:', err);
      } finally {
        qrCodeInstanceRef.current = null;
        setIsScanning(false);
      }
    } else {
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempId = 'temp-file-scanner-container';
    let tempDiv = document.getElementById(tempId);
    if (!tempDiv) {
      tempDiv = document.createElement('div');
      tempDiv.id = tempId;
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);
    }

    const html5QrCode = new Html5Qrcode(tempId);
    const loadingToast = toast.loading('Reading QR code from image...');

    try {
      const decodedText = await html5QrCode.scanFile(file, false);
      const timestamp = new Date().toLocaleString();
      setScannedResults((prev) => [
        { value: decodedText, timestamp, id: Date.now() },
        ...prev,
      ]);
      toast.success('QR Code scanned successfully!', { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error('No valid QR code found in this image.', { id: loadingToast });
    } finally {
      html5QrCode.clear();
      if (tempDiv.parentNode) {
        tempDiv.parentNode.removeChild(tempDiv);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const removeResult = (id) => {
    setScannedResults((prev) => prev.filter((r) => r.id !== id));
  };

  const clearAll = () => {
    setScannedResults([]);
    toast.success('History cleared');
  };

  useEffect(() => {
    let activeScanner = null;

    if (isScanning && activeMode === 'camera') {
      const initializeScanner = async () => {
        try {
          const html5QrCode = new Html5Qrcode('qr-scanner-container');
          qrCodeInstanceRef.current = html5QrCode;
          activeScanner = html5QrCode;

          await html5QrCode.start(
            { facingMode: 'environment' },
            {
              fps: 15,
              qrbox: (width, height) => {
                const size = Math.min(width, height) * 0.7;
                return { width: size, height: size };
              },
            },
            (decodedText) => {
              const timestamp = new Date().toLocaleString();
              setScannedResults((prev) => [
                { value: decodedText, timestamp, id: Date.now() },
                ...prev,
              ]);
              toast.success('QR Code scanned!');
              if (navigator.vibrate) {
                navigator.vibrate(200);
              }
            },
            () => {
              // Verbose frame scans, ignore
            }
          );
        } catch (err) {
          console.error('Failed to start scanner:', err);
          setCameraError(
            'Could not access camera. Please make sure you have given camera permissions and no other application is using it.'
          );
          setIsScanning(false);
          qrCodeInstanceRef.current = null;
        }
      };

      const timer = setTimeout(initializeScanner, 100);
      return () => clearTimeout(timer);
    }

    return () => {
      if (activeScanner && activeScanner.isScanning) {
        activeScanner.stop().catch((err) => console.error('Error stopping scanner during cleanup:', err));
      }
    };
  }, [isScanning, activeMode]);

  useEffect(() => {
    stopScanning();
  }, [activeMode]);

  return (
    <section className="space-y-8 text-foreground dark:text-slate-100">
      <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-8 shadow-card transition-colors duration-300">
        <h1 className="text-3xl font-serif font-bold text-foreground dark:text-white">QR Scanner</h1>
        <p className="mt-2 text-sm text-foreground-muted dark:text-slate-400">Scan QR codes using your webcam/camera or upload an image file</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.8fr_1.2fr]">
        <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card flex flex-col transition-colors duration-300">
          {/* Mode Switcher */}
          <div className="flex bg-background dark:bg-background-dark p-1.5 rounded-xl mb-6 self-start">
            <button
              onClick={() => setActiveMode('camera')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                activeMode === 'camera'
                  ? 'bg-surface dark:bg-surface-dark text-primary dark:text-secondary shadow-sm border border-border dark:border-border-dark'
                  : 'text-foreground-muted hover:text-foreground dark:hover:text-white'
              }`}
            >
              <FiCamera className="h-4 w-4" />
              Use Camera
            </button>
            <button
              onClick={() => setActiveMode('file')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                activeMode === 'file'
                  ? 'bg-surface dark:bg-surface-dark text-primary dark:text-secondary shadow-sm border border-border dark:border-border-dark'
                  : 'text-foreground-muted hover:text-foreground dark:hover:text-white'
              }`}
            >
              <FiUpload className="h-4 w-4" />
              Upload Image
            </button>
          </div>

          {activeMode === 'camera' ? (
            <div className="flex-1 flex flex-col justify-between min-h-[350px]">
              {isScanning ? (
                <div className="space-y-4 flex-1 flex flex-col animate-fade-in-up">
                  <div className="relative rounded-xl overflow-hidden border-2 border-primary bg-black flex-1 flex items-center justify-center min-h-[300px]">
                    <div
                      id="qr-scanner-container"
                      className="w-full h-full max-w-md"
                    />
                    <div className="absolute inset-0 pointer-events-none border-[16px] border-black/40 flex items-center justify-center">
                      <div className="w-64 h-64 border-2 border-white/60 relative animate-pulse">
                        <span className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary -mt-1 -ml-1"></span>
                        <span className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary -mt-1 -mr-1"></span>
                        <span className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary -mb-1 -ml-1"></span>
                        <span className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary -mb-1 -mr-1"></span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={stopScanning}
                    className="w-full rounded-full bg-red-500 hover:bg-red-600 active:scale-95 px-6 py-3.5 font-semibold text-white transition-all shadow-lg"
                  >
                    Stop Scanning
                  </button>
                </div>
              ) : (
                <div className="space-y-6 flex-1 flex flex-col justify-center items-center text-center p-8">
                  <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-2 text-primary dark:text-secondary">
                    <FiCamera className="h-10 w-10" />
                  </div>
                  <div className="max-w-sm">
                    <p className="text-xl font-serif font-bold text-foreground dark:text-white">Webcam QR Scanner</p>
                    <p className="mt-2 text-sm text-foreground-muted dark:text-slate-400">
                      Scan QR codes dynamically using your device camera.
                    </p>
                  </div>
                  {cameraError && (
                    <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 text-sm max-w-md">
                      {cameraError}
                    </div>
                  )}
                  <button
                    onClick={startScanning}
                    className="w-full max-w-sm rounded-full bg-primary hover:bg-primary-hover active:scale-98 px-6 py-3.5 font-semibold text-white transition-all shadow-glow"
                  >
                    Start Scanning
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center p-12 border-2 border-dashed border-border dark:border-border-dark rounded-xl bg-background dark:bg-surface-dark-elevated/20 min-h-[350px]">
              <div className="h-20 w-20 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4 text-secondary">
                <FiUpload className="h-10 w-10" />
              </div>
              <p className="text-xl font-serif font-bold text-foreground dark:text-white">Scan from Image File</p>
              <p className="mt-2 text-sm text-foreground-muted dark:text-slate-400 max-w-xs mb-6">
                Upload a JPEG, PNG, or WebP image containing a QR code to decode it.
              </p>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="qr-image-upload"
              />
              <label
                htmlFor="qr-image-upload"
                className="cursor-pointer rounded-full bg-secondary hover:bg-secondary-hover px-6 py-3.5 font-semibold text-white transition-all shadow-sm block"
              >
                Choose Image File
              </label>
            </div>
          )}
        </div>

        {/* Results / History */}
        <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card flex flex-col h-[480px] transition-colors duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-border dark:border-border-dark">
            <h3 className="text-lg font-serif font-bold text-foreground dark:text-white flex items-center gap-2">
              History
              <span className="text-xs bg-primary/10 dark:bg-secondary/15 text-primary dark:text-secondary px-2 py-0.5 rounded-full font-semibold">
                {scannedResults.length}
              </span>
            </h3>
            {scannedResults.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 font-semibold transition"
                title="Clear all history"
              >
                <FiTrash2 className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 scrollbar-hide">
            {scannedResults.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center text-foreground-muted">
                <p className="text-sm">No QR codes scanned yet.</p>
                <p className="text-xs mt-1">Successfully scanned values will appear here.</p>
              </div>
            ) : (
              scannedResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-start gap-3 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated/40 p-3.5 hover:border-primary dark:hover:border-secondary transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono text-foreground-muted">
                      {result.timestamp}
                    </p>
                    <p className="text-sm font-semibold text-foreground dark:text-slate-200 break-all mt-1 font-mono">
                      {result.value}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => copyToClipboard(result.value)}
                      className="p-2 hover:bg-background dark:hover:bg-surface-dark text-foreground-muted hover:text-primary dark:hover:text-secondary rounded-lg transition-all"
                      title="Copy content"
                    >
                      <FiCopy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeResult(result.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-foreground-muted hover:text-red-500 rounded-lg transition-all"
                      title="Remove result"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default QRScannerPage;
