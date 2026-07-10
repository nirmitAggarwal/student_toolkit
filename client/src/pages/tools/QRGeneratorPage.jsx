import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FiDownload, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';

function QRGeneratorPage() {
  const [qrType, setQrType] = useState('url');
  const [qrValue, setQrValue] = useState('https://studenttoolkit.example.com');

  const downloadQR = (format) => {
    const qrElement = document.querySelector('svg');
    if (!qrElement) {
      toast.error('QR code not found');
      return;
    }
    
    if (format === 'svg') {
      const svgString = new XMLSerializer().serializeToString(qrElement);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qrcode.svg';
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // For PNG, convert SVG to canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgString = new XMLSerializer().serializeToString(qrElement);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'qrcode.png';
          link.click();
          URL.revokeObjectURL(url);
        }, 'image/png');
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
    toast.success(`QR code downloaded as ${format.toUpperCase()}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrValue);
    toast.success('Copied to clipboard');
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">QR Code Generator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Generate QR codes for links, text, WiFi, and more</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">QR Code Type</label>
            <select
              value={qrType}
              onChange={(e) => setQrType(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white px-4 py-2 outline-none focus:border-primary"
            >
              <option value="url">URL</option>
              <option value="text">Text</option>
              <option value="wifi">WiFi</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Value</label>
            <textarea
              value={qrValue}
              onChange={(e) => setQrValue(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white px-4 py-2 outline-none focus:border-primary font-mono text-sm"
              rows="4"
            />
          </div>

          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center gap-2 rounded-full bg-secondary hover:bg-primary px-4 py-2 font-semibold text-white w-full transition"
          >
            <FiCopy className="h-4 w-4" />
            Copy Value
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm flex flex-col items-center justify-center space-y-6">
          <div className="rounded-3xl border-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
            <QRCodeSVG value={qrValue} size={280} level="H" includeMargin={true} />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => downloadQR('png')}
              className="flex items-center gap-2 rounded-full bg-primary hover:bg-secondary px-4 py-2 font-semibold text-white transition"
            >
              <FiDownload className="h-4 w-4" />
              PNG
            </button>
            <button
              onClick={() => downloadQR('svg')}
              className="flex items-center gap-2 rounded-full bg-accent hover:bg-secondary px-4 py-2 font-semibold text-white transition"
            >
              <FiDownload className="h-4 w-4" />
              SVG
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QRGeneratorPage;
