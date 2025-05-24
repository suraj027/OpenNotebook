import React, { useCallback, useState } from 'react';
import { UPLOAD_ICON } from '../constants';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileSelect(event.target.files[0]);
    }
  };

  const handleDrag = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(event.type === "dragenter" || event.type === "dragover");
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onFileSelect(event.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full p-6 bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
      <label
        htmlFor="pdf-upload"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                    ${dragActive 
                      ? "border-primary-500 bg-primary-500/10" 
                      : "border-slate-600 hover:border-primary-500/50 bg-slate-800/50 hover:bg-slate-800"}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <div className="w-12 h-12 mb-4 text-slate-400">
            {UPLOAD_ICON}
          </div>
          <p className="mb-2 text-sm text-slate-300">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500">PDF files only (max 10MB recommended)</p>
        </div>
        <input
          id="pdf-upload"
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </label>
      {isLoading && (
        <p className="text-sm text-primary-400 mt-3 text-center animate-pulse">
          Processing PDF...
        </p>
      )}
    </div>
  );
};

export default FileUpload;