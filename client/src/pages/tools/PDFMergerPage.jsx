import { useState } from 'react';
import { FiDownload, FiX, FiMove } from 'react-icons/fi';
import { PDFDocument } from 'pdf-lib';
import toast from 'react-hot-toast';

function PDFMergerPage() {
  const [pdfs, setPdfs] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handlePdfSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const validPdfs = selectedFiles.filter((f) => f.type === 'application/pdf');
    if (validPdfs.length < selectedFiles.length) {
      toast.error('Only PDF files are supported');
    }

    const newPdfs = validPdfs.map((f) => ({
      id: Date.now() + Math.random(),
      file: f,
      name: f.name,
      size: f.size,
    }));

    setPdfs([...pdfs, ...newPdfs]);
    toast.success(`Added ${newPdfs.length} PDF(s)`);
  };

  const removePdf = (id) => {
    setPdfs((prev) => prev.filter((p) => p.id !== id));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newPdfs = [...pdfs];
    [newPdfs[index], newPdfs[index - 1]] = [newPdfs[index - 1], newPdfs[index]];
    setPdfs(newPdfs);
  };

  const moveDown = (index) => {
    if (index === pdfs.length - 1) return;
    const newPdfs = [...pdfs];
    [newPdfs[index], newPdfs[index + 1]] = [newPdfs[index + 1], newPdfs[index]];
    setPdfs(newPdfs);
  };

  const mergePdfs = async () => {
    if (pdfs.length < 2) {
      toast.error('Select at least 2 PDFs to merge');
      return;
    }

    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdf of pdfs) {
        const pdfBytes = await pdf.file.arrayBuffer();
        const loadedPdf = await PDFDocument.load(pdfBytes);
        const pages = await mergedPdf.copyPages(loadedPdf, loadedPdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `merged_${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('PDFs merged successfully!');
    } catch (error) {
      console.error('Merge error:', error);
      toast.error('Failed to merge PDFs');
    } finally {
      setIsMerging(false);
    }
  };

  const totalSize = pdfs.reduce((sum, p) => sum + p.size, 0);

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-8 shadow-card transition-colors duration-300">
        <h1 className="text-3xl font-serif font-bold text-foreground dark:text-white">PDF Merger</h1>
        <p className="mt-2 text-sm text-foreground-muted dark:text-slate-400">Merge multiple PDF files into one</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Upload & List */}
        <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card transition-colors duration-300">
          <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated/20 p-12 text-center transition hover:border-primary dark:hover:border-secondary hover:bg-primary-light/20 dark:hover:bg-surface-dark-elevated/40">
            <p className="text-lg font-serif font-semibold text-foreground dark:text-white">Upload PDFs to merge</p>
            <p className="mt-2 text-sm text-foreground-muted dark:text-slate-400">Drag & drop or click to browse</p>
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handlePdfSelect}
              className="hidden"
            />
          </label>

          {pdfs.length > 0 && (
            <div className="mt-6 space-y-2 max-h-96 overflow-y-auto pr-1 scrollbar-hide">
              {pdfs.map((pdf, idx) => (
                <div
                  key={pdf.id}
                  className="flex items-center justify-between rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated p-4 animate-fade-in-up"
                  onDragStart={() => setDraggedIndex(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedIndex !== null && draggedIndex !== idx) {
                      const newPdfs = [...pdfs];
                      [newPdfs[draggedIndex], newPdfs[idx]] = [
                        newPdfs[idx],
                        newPdfs[draggedIndex],
                      ];
                      setPdfs(newPdfs);
                      setDraggedIndex(null);
                    }
                  }}
                  draggable
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="truncate text-sm font-semibold text-foreground dark:text-white">
                      {idx + 1}. {pdf.name}
                    </p>
                    <p className="text-xs text-foreground-muted mt-0.5">
                      {(pdf.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-2 hover:bg-surface dark:hover:bg-surface-dark text-foreground-muted hover:text-primary dark:hover:text-secondary rounded-lg disabled:opacity-30 transition-all"
                      title="Move up"
                    >
                      <FiMove className="h-4 w-4 transform rotate-180" />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === pdfs.length - 1}
                      className="p-2 hover:bg-surface dark:hover:bg-surface-dark text-foreground-muted hover:text-primary dark:hover:text-secondary rounded-lg disabled:opacity-30 transition-all"
                      title="Move down"
                    >
                      <FiMove className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removePdf(pdf.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-650 hover:text-red-550 rounded-lg transition-all"
                      title="Remove"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info & Merge */}
        <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card space-y-6 transition-colors duration-300">
          <div>
            <p className="text-sm font-semibold text-foreground dark:text-slate-300 mb-2">
              Files Selected
            </p>
            <p className="text-3xl font-serif font-bold text-primary dark:text-secondary">{pdfs.length}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground dark:text-slate-300 mb-2">
              Total Size
            </p>
            <p className="text-3xl font-serif font-bold text-primary dark:text-secondary">
              {(totalSize / 1024).toFixed(1)} KB
            </p>
          </div>

          {pdfs.length >= 2 && (
            <div>
              <p className="text-sm font-semibold text-foreground dark:text-slate-300 mb-2">
                Order Preview
              </p>
              <div className="space-y-1.5 text-xs text-foreground-muted font-medium bg-background dark:bg-surface-dark-elevated p-3 rounded-lg border border-border dark:border-border-dark max-h-40 overflow-y-auto scrollbar-hide">
                {pdfs.map((pdf, idx) => (
                  <p key={pdf.id} className="truncate">
                    {idx + 1}. {pdf.name}
                  </p>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={mergePdfs}
            disabled={pdfs.length < 2 || isMerging}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover disabled:bg-border dark:disabled:bg-border-dark disabled:text-foreground-muted disabled:cursor-not-allowed py-3 font-semibold text-white transition-all duration-200 shadow-glow"
          >
            <FiDownload className="h-4 w-4" />
            {isMerging ? 'Merging...' : 'Merge PDFs'}
          </button>
        </div>
      </div>
    </section>
  );
}

export default PDFMergerPage;
