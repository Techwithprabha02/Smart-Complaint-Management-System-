import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

export default function MediaUploader({ files, onChange, maxFiles = 5 }) {
  const onDrop = useCallback(
    (accepted) => {
      const next = [...files, ...accepted].slice(0, maxFiles);
      onChange(next);
    },
    [files, onChange, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov'],
    },
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles,
  });

  const remove = (index) => onChange(files.filter((_, i) => i !== index));

  return (
    <section>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Photos / Videos (optional)
      </label>
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${
            isDragActive
              ? 'border-[#2563EB] bg-blue-50'
              : 'border-slate-300 hover:border-[#2563EB] hover:bg-slate-50'
          }`}
        >
          <input {...getInputProps()} />
          <FiUpload className="mx-auto mb-2 text-2xl text-slate-400" />
          <p className="text-sm text-slate-600">
            Drag & drop or click to upload (max {maxFiles} files)
          </p>
        </div>
      )}
      {files.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className="relative overflow-hidden rounded-lg border">
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="h-28 w-full object-cover"
                />
              ) : (
                <div className="flex h-28 items-center justify-center bg-slate-100">
                  <FiImage className="text-3xl text-slate-400" />
                  <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-xs text-white">
                    Video
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white shadow"
              >
                <FiX size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
