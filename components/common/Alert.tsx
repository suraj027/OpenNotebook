import React from 'react';

interface AlertProps {
  message: string;
  type: 'error' | 'success' | 'info';
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const baseClasses = "p-4 rounded-lg flex items-start shadow-lg border backdrop-blur-sm";
  const typeClasses = {
    error: "bg-red-500/10 border-red-500/20 text-red-400",
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    info: "bg-primary-500/10 border-primary-500/20 text-primary-400",
  };

  const Icon: React.FC<{ type: AlertProps['type'] }> = ({ type }) => {
    if (type === 'error') return <span role="img" aria-label="Error" className="text-lg">⚠️</span>;
    if (type === 'success') return <span role="img" aria-label="Success" className="text-lg">✨</span>;
    if (type === 'info') return <span role="img" aria-label="Info" className="text-lg">💡</span>;
    return null;
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <Icon type={type} />
      <p className="flex-1 ml-3 text-sm">{message}</p>
      {onClose && (
        <button 
          onClick={onClose} 
          className="ml-4 p-1 -m-1 hover:opacity-75 transition-opacity"
          aria-label="Close alert"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;