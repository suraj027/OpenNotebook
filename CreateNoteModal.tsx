import React, { useState, useCallback, useRef } from 'react';
import { APP_LOGO_ICON, CLOSE_ICON_SVG, APP_UPLOAD_ICON } from './constants';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ isOpen, onClose, onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileSelect(event.target.files[0]);
    }
  };

  const handleDrag = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(event.type === "dragenter" || event.type === "dragover");
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onFileSelect(event.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-note-modal-title"
    >
      <div 
        className="bg-slate-900 text-slate-100 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 border border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            {APP_LOGO_ICON}
            <h2 id="create-note-modal-title" className="text-xl font-semibold text-slate-100">
              Add PDF Source
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-2 rounded-full hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            {CLOSE_ICON_SVG}
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-300 mb-6">
            OpenNotebook uses the content of your PDF to provide summaries, answer questions, and generate podcast scripts.
          </p>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                      ${dragActive 
                        ? "border-primary-500 bg-primary-500/10" 
                        : "border-slate-700 hover:border-primary-500/50 bg-slate-800/50 hover:bg-slate-800"}`}
            onClick={openFileDialog}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openFileDialog()}
            aria-label="Upload area: Click or drag and drop a PDF file"
          >
            <div className="text-center">
              {React.cloneElement(APP_UPLOAD_ICON, {className: "w-16 h-16 text-slate-500 mb-4"})}
              <p className="text-lg font-semibold text-slate-200 mb-2">Upload PDF</p>
              <p className="text-sm text-slate-400">
                Drag and drop or <span className="text-primary-400 hover:text-primary-300">choose file</span> to upload
              </p>
            </div>
            <input
              ref={inputRef}
              id="modal-pdf-upload"
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
            Supported file types: PDF
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateNoteModal;