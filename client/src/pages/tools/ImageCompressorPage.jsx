import { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';

function ImageCompressorPage() {
  const [images, setImages] = useState([]);
  const [quality, setQuality] = useState(80);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleImageSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setIsCompressing(true);
    try {
      const compressedImages = await Promise.all(
        selectedFiles.map(async (file) => ({
          original: file,
          originalSize: file.size,
          compressed: null,
          compressedSize: 0,
          preview: URL.createObjectURL(file),
        }))
      );
      setImages([...images, ...compressedImages]);
      toast.success(`Added ${selectedFiles.length} image(s)`);
    } catch (error) {
      toast.error('Failed to process images');
    } finally {
      setIsCompressing(false);
    }
  };

  const compressImage = async (idx) => {
    try {
      const img = images[idx];
      const options = {
        maxSizeMB: (100 - quality) / 100,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressed = await imageCompression(img.original, options);
      const updated = [...images];
      updated[idx].compressed = compressed;
      updated[idx].compressedSize = compressed.size;
      setImages(updated);
      toast.success('Image compressed!');
    } catch (error) {
      toast.error('Failed to compress image');
    }
  };

  const downloadImage = (idx) => {
    const img = images[idx];
    const file = img.compressed || img.original;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = `compressed_${Date.now()}.jpg`;
    link.click();
    toast.success('Image downloaded!');
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Image Compressor</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Compress images without losing quality</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-12 text-center transition hover:border-primary hover:bg-blue-50 dark:hover:bg-slate-800">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Upload images to compress</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">JPG, PNG, WEBP supported</p>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>

          {images.length > 0 && (
            <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
              {images.map((img, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm font-medium dark:text-white">{img.original.name}</span>
                    <button
                      onClick={() => downloadImage(idx)}
                      className="rounded-full bg-primary hover:bg-secondary p-2 text-white"
                    >
                      <FiDownload className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Original: {(img.originalSize / 1024).toFixed(1)} KB</span>
                    {img.compressedSize > 0 && (
                      <span className="text-green-600 dark:text-green-400">Compressed: {(img.compressedSize / 1024).toFixed(1)} KB</span>
                    )}
                  </div>
                  {!img.compressed && (
                    <button
                      onClick={() => compressImage(idx)}
                      className="w-full rounded-lg bg-secondary hover:bg-primary px-3 py-2 text-sm font-semibold text-white"
                    >
                      Compress Image
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Quality</label>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full"
            />
            <p className="mt-2 text-center text-2xl font-bold text-primary">{quality}%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Lower = smaller file</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ImageCompressorPage;
