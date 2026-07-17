import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FiDownload, FiCopy, FiLink, FiFileText, FiWifi, FiMail, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';

function QRGeneratorPage() {
  const [qrType, setQrType] = useState('url');
  
  // Dynamic fields state
  const [url, setUrl] = useState('https://ieeemsit.vercel.app');
  const [text, setText] = useState('Hello World');
  const [wifi, setWifi] = useState({ ssid: '', password: '', security: 'WPA' });
  const [email, setEmail] = useState({ to: '', subject: '', body: '' });
  const [phone, setPhone] = useState('');

  const [qrValue, setQrValue] = useState('');

  // Dynamically compile the QR value based on selected type and inputs
  useEffect(() => {
    switch (qrType) {
      case 'url':
        setQrValue(url || 'https://ieeemsit.vercel.app');
        break;
      case 'text':
        setQrValue(text || 'Hello World');
        break;
      case 'wifi':
        if (!wifi.ssid) {
          setQrValue('WIFI:S:ExampleNetwork;T:WPA;P:password;;');
        } else {
          setQrValue(`WIFI:S:${wifi.ssid};T:${wifi.security};P:${wifi.password};;`);
        }
        break;
      case 'email':
        if (!email.to) {
          setQrValue('mailto:support@example.com');
        } else {
          const subjectParam = email.subject ? `?subject=${encodeURIComponent(email.subject)}` : '';
          const bodyParam = email.body ? `${subjectParam ? '&' : '?' }body=${encodeURIComponent(email.body)}` : '';
          setQrValue(`mailto:${email.to}${subjectParam}${bodyParam}`);
        }
        break;
      case 'phone':
        setQrValue(phone ? `tel:${phone}` : 'tel:1234567890');
        break;
      default:
        setQrValue('');
    }
  }, [qrType, url, text, wifi, email, phone]);

  const downloadQR = (format) => {
    const container = document.getElementById('qr-code-svg-container');
    const qrElement = container ? container.querySelector('svg') : null;

    if (!qrElement) {
      toast.error('QR code element not found');
      return;
    }
    
    if (format === 'svg') {
      const svgString = new XMLSerializer().serializeToString(qrElement);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode_${qrType}.svg`;
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
        const padding = 20;
        canvas.width = img.width + padding * 2;
        canvas.height = img.height + padding * 2;
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(img, padding, padding);
        canvas.toBlob((blob) => {
          if (!blob) {
            toast.error('Failed to generate PNG image');
            return;
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `qrcode_${qrType}.png`;
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
    toast.success('Formatted code value copied to clipboard!');
  };

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-8 shadow-card transition-colors duration-300">
        <h1 className="text-3xl font-serif font-bold text-foreground dark:text-white">QR Code Generator</h1>
        <p className="mt-2 text-sm text-foreground-muted dark:text-slate-400">Generate high-quality custom QR codes dynamically for various applications</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Dynamic Inputs Form */}
        <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card flex flex-col justify-between space-y-6 transition-colors duration-300">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground dark:text-slate-300 mb-2">QR Code Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-background dark:bg-background-dark p-1.5 rounded-xl">
                {[
                  { id: 'url', label: 'Link', icon: FiLink },
                  { id: 'text', label: 'Text', icon: FiFileText },
                  { id: 'wifi', label: 'WiFi', icon: FiWifi },
                  { id: 'email', label: 'Email', icon: FiMail },
                  { id: 'phone', label: 'Phone', icon: FiPhone },
                ].map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setQrType(type.id)}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        qrType === type.id
                          ? 'bg-surface dark:bg-surface-dark text-primary dark:text-secondary shadow-sm border border-border dark:border-border-dark'
                          : 'text-foreground-muted hover:text-foreground dark:hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Render Form based on QR type */}
            <div className="pt-2">
              {qrType === 'url' && (
                <div className="space-y-1 animate-fade-in-up">
                  <label className="block text-xs font-bold text-foreground-muted dark:text-slate-400 uppercase tracking-wider mb-1">Website URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white px-4 py-2.5 outline-none focus:border-primary dark:focus:border-secondary transition-all text-sm"
                  />
                </div>
              )}

              {qrType === 'text' && (
                <div className="space-y-1 animate-fade-in-up">
                  <label className="block text-xs font-bold text-foreground-muted dark:text-slate-400 uppercase tracking-wider mb-1">Plain Text</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste your text here..."
                    className="w-full rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white px-4 py-2.5 outline-none focus:border-primary dark:focus:border-secondary transition-all text-sm font-mono"
                    rows="4"
                  />
                </div>
              )}

              {qrType === 'wifi' && (
                <div className="space-y-3 animate-fade-in-up">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-foreground-muted dark:text-slate-400 uppercase tracking-wider mb-1">Network SSID (Name)</label>
                    <input
                      type="text"
                      value={wifi.ssid}
                      onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                      placeholder="My Home WiFi"
                      className="w-full rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white px-4 py-2.5 outline-none focus:border-primary dark:focus:border-secondary transition-all text-sm"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-foreground-muted dark:text-slate-400 uppercase tracking-wider mb-1">Password</label>
                      <input
                        type="password"
                        value={wifi.password}
                        onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white px-4 py-2.5 outline-none focus:border-primary dark:focus:border-secondary transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-foreground-muted dark:text-slate-400 uppercase tracking-wider mb-1">Security Type</label>
                      <select
                        value={wifi.security}
                        onChange={(e) => setWifi({ ...wifi, security: e.target.value })}
                        className="w-full rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white px-4 py-2.5 outline-none focus:border-primary dark:focus:border-secondary transition-all cursor-pointer text-sm"
                      >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">None (Open)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {qrType === 'email' && (
                <div className="space-y-3 animate-fade-in-up">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-foreground-muted dark:text-slate-400 uppercase tracking-wider mb-1">Recipient Email</label>
                    <input
                      type="email"
                      value={email.to}
                      onChange={(e) => setEmail({ ...email, to: e.target.value })}
                      placeholder="hello@example.com"
                      className="w-full rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white px-4 py-2.5 outline-none focus:border-primary dark:focus:border-secondary transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-foreground-muted dark:text-slate-400 uppercase tracking-wider mb-1">Subject</label>
                    <input
                      type="text"
                      value={email.subject}
                      onChange={(e) => setEmail({ ...email, subject: e.target.value })}
                      placeholder="Feedback"
                      className="w-full rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white px-4 py-2.5 outline-none focus:border-primary dark:focus:border-secondary transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-foreground-muted dark:text-slate-400 uppercase tracking-wider mb-1">Message Body</label>
                    <textarea
                      value={email.body}
                      onChange={(e) => setEmail({ ...email, body: e.target.value })}
                      placeholder="Write message contents here..."
                      className="w-full rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white px-4 py-2.5 outline-none focus:border-primary dark:focus:border-secondary transition-all text-sm"
                      rows="3"
                    />
                  </div>
                </div>
              )}

              {qrType === 'phone' && (
                <div className="space-y-1 animate-fade-in-up">
                  <label className="block text-xs font-bold text-foreground-muted dark:text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white px-4 py-2.5 outline-none focus:border-primary dark:focus:border-secondary transition-all text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border dark:border-border-dark">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block mb-1">Raw Encoded Value</span>
              <p className="text-xs font-mono text-foreground-muted dark:text-slate-400 break-all bg-background dark:bg-background-dark px-3 py-2.5 rounded-xl border border-border dark:border-border-dark">
                {qrValue}
              </p>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 rounded-full border border-border dark:border-border-dark bg-surface hover:bg-background dark:bg-surface-dark-elevated dark:hover:bg-surface-dark px-4 py-2.5 font-semibold text-foreground dark:text-slate-200 w-full transition duration-200 active:scale-98"
            >
              <FiCopy className="h-4 w-4" />
              Copy Encoded Value
            </button>
          </div>
        </div>

        {/* QR Preview & Download */}
        <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card flex flex-col items-center justify-center space-y-6 transition-colors duration-300">
          <div className="text-center">
            <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider block mb-2 font-serif">QR Code Preview</span>
            <div
              id="qr-code-svg-container"
              className="rounded-2xl border-4 border-background dark:border-surface-dark-elevated bg-white p-6 shadow-md transition"
            >
              <QRCodeSVG
                value={qrValue}
                size={220}
                level="H"
                includeMargin={false}
                fgColor="#00508F" // IEEE Brand Blue for optimal styling and scanning contrast
                bgColor="#ffffff"
              />
            </div>
          </div>

          <div className="flex gap-3 w-full max-w-[280px]">
            <button
              onClick={() => downloadQR('png')}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover py-3 font-semibold text-white transition-all duration-200 shadow-glow"
            >
              <FiDownload className="h-4 w-4" />
              PNG
            </button>
            <button
              onClick={() => downloadQR('svg')}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-secondary hover:bg-secondary-hover py-3 font-semibold text-white transition-all duration-200 shadow-sm"
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
