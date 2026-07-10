import { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { FiCopy, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

function QRScannerPage() {
  const [scannedResults, setScannedResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);

  const startScanning = () => {
    if (scannerInstanceRef.current) return;

    setIsScanning(true);
    const scanner = new Html5QrcodeScanner(
      'qr-scanner-container',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (result) => {
        const timestamp = new Date().toLocaleString();
        setScannedResults((prev) => [
          { value: result, timestamp, id: Date.now() },
          ...prev,
        ]);
        toast.success('QR Code scanned!');
      },
      (error) => {
        console.error('Scan error:', error);
      }
    );

    scannerInstanceRef.current = scanner;
  };

  const stopScanning = () => {
    if (scannerInstanceRef.current) {
      scannerInstanceRef.current.clear();
      scannerInstanceRef.current = null;
      setIsScanning(false);
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
    return () => {
      if (scannerInstanceRef.current) {
        stopScanning();
      }
    };
  }, []);

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">QR Scanner</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Scan QR codes using your camera</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Scanner */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
          {isScanning ? (
            <>
              <div
                id="qr-scanner-container"
                className="w-full rounded-2xl overflow-hidden mb-4"
              />
              <button
                onClick={stopScanning}
                className="w-full rounded-full bg-red-500 hover:bg-red-600 px-6 py-3 font-semibold text-white transition"
              >
                Stop Scanning
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-12 text-center">
                <p className="text-lg font-semibold text-slate-900 dark:text-white">Ready to scan?</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Point your camera at a QR code</p>
              </div>
              <button
                onClick={startScanning}
                className="w-full rounded-full bg-primary hover:bg-secondary px-6 py-3 font-semibold text-white transition"
              >
                Start Scanning
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              History ({scannedResults.length})
            </h3>
            {scannedResults.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {scannedResults.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                No scans yet
              </p>
            ) : (
              scannedResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {result.timestamp}
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white break-all mt-1">
                      {result.value}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(result.value)}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition"
                    title="Copy"
                  >
                    <FiCopy className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button
                    onClick={() => removeResult(result.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition"
                    title="Remove"
                  >
                    <FiX className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </button>
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
