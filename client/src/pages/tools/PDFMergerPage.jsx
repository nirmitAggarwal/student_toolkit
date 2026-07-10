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
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">PDF Merger</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Merge multiple PDF files into one</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Upload & List */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
          <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-12 text-center transition hover:border-primary hover:bg-blue-50 dark:hover:bg-slate-800">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Upload PDFs to merge</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Drag & drop or click to browse</p>
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handlePdfSelect}
              className="hidden"
            />
          </label>

          {pdfs.length > 0 && (
            <div className="mt-6 space-y-2 max-h-96 overflow-y-auto">
              {pdfs.map((pdf, idx) => (
                <div
                  key={pdf.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-4"
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
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                      {idx + 1}. {pdf.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(pdf.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50 transition"
                      title="Move up"
                    >
                      <FiMove className="h-4 w-4 text-slate-600 dark:text-slate-400 transform rotate-180" />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === pdfs.length - 1}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50 transition"
                      title="Move down"
                    >
                      <FiMove className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </button>
                    <button
                      onClick={() => removePdf(pdf.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition"
                      title="Remove"
                    >
                      <FiX className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info & Merge */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm space-y-6">
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Files Selected
            </p>
            <p className="text-3xl font-bold text-primary">{pdfs.length}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Total Size
            </p>
            <p className="text-3xl font-bold text-secondary">
              {(totalSize / 1024).toFixed(1)} KB
            </p>
          </div>

          {pdfs.length >= 2 && (
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Order Preview
              </p>
              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
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
            className="w-full flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-secondary disabled:opacity-50 px-6 py-3 font-semibold text-white transition"
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
