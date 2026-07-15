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

    // Create a temporary element to run scanFile
    // html5-qrcode requires a DOM element or ID to initialize even for file scanning
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

  // useEffect handles the camera scanning lifecycle safely when container is guaranteed in the DOM
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
              // Vibrate device if supported
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

      // Delay slightly to ensure React has fully rendered the div
      const timer = setTimeout(initializeScanner, 100);
      return () => clearTimeout(timer);
    }

    return () => {
      if (activeScanner && activeScanner.isScanning) {
        activeScanner.stop().catch((err) => console.error('Error stopping scanner during cleanup:', err));
      }
    };
  }, [isScanning, activeMode]);

  // Clean up if we toggle modes
  useEffect(() => {
    stopScanning();
  }, [activeMode]);

  return (
    <section className="space-y-8 text-slate-800 dark:text-slate-100">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">QR Scanner</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Scan QR codes using your webcam/camera or upload an image file</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.8fr_1.2fr]">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-6 self-start">
            <button
              onClick={() => setActiveMode('camera')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition ${
                activeMode === 'camera'
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FiCamera className="h-4 w-4" />
              Use Camera
            </button>
            <button
              onClick={() => setActiveMode('file')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition ${
                activeMode === 'file'
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FiUpload className="h-4 w-4" />
              Upload Image
            </button>
          </div>

          {activeMode === 'camera' ? (
            <div className="flex-1 flex flex-col justify-between min-h-[350px]">
              {isScanning ? (
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-primary bg-black flex-1 flex items-center justify-center min-h-[300px]">
                    <div
                      id="qr-scanner-container"
                      className="w-full h-full max-w-md"
                    />
                    {/* Corner Reticles for scanning look & feel */}
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
                    className="w-full rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 px-6 py-3.5 font-semibold text-white transition shadow-lg shadow-red-500/10"
                  >
                    Stop Scanning
                  </button>
                </div>
              ) : (
                <div className="space-y-6 flex-1 flex flex-col justify-center items-center text-center p-8">
                  <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-2">
                    <FiCamera className="h-10 w-10 text-primary" />
                  </div>
                  <div className="max-w-sm">
                    <p className="text-xl font-bold text-slate-900 dark:text-white">Webcam QR Scanner</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Scan QR codes dynamically using your device camera.
                    </p>
                  </div>
                  {cameraError && (
                    <div className="rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-4 py-3 text-sm max-w-md">
                      {cameraError}
                    </div>
                  )}
                  <button
                    onClick={startScanning}
                    className="w-full max-w-sm rounded-2xl bg-primary hover:bg-secondary active:scale-95 px-6 py-3.5 font-semibold text-white transition shadow-lg shadow-primary/20"
                  >
                    Start Scanning
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950/20 min-h-[350px]">
              <div className="h-20 w-20 rounded-3xl bg-secondary/10 flex items-center justify-center mb-4">
                <FiUpload className="h-10 w-10 text-secondary" />
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">Scan from Image File</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">
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
                className="cursor-pointer rounded-2xl bg-secondary hover:bg-primary active:scale-95 px-6 py-3.5 font-semibold text-white transition shadow-lg shadow-secondary/20 block"
              >
                Choose Image File
              </label>
            </div>
          )}
        </div>

        {/* Results / History */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col h-[480px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              History
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-normal">
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

          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
            {scannedResults.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center text-slate-400 dark:text-slate-600">
                <p className="text-sm">No QR codes scanned yet.</p>
                <p className="text-xs mt-1">Successfully scanned values will appear here.</p>
              </div>
            ) : (
              scannedResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3.5 hover:border-slate-200 dark:hover:border-slate-700 transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      {result.timestamp}
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-all mt-1 font-mono">
                      {result.value}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => copyToClipboard(result.value)}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-xl transition"
                      title="Copy content"
                    >
                      <FiCopy className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => removeResult(result.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-400 hover:text-red-500 rounded-xl transition"
                      title="Remove result"
                    >
                      <FiX className="h-4.5 w-4.5" />
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
