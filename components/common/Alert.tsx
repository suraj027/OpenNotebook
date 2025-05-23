import React from 'react';

interface AlertProps {
  message: string;
  type: 'error' | 'success' | 'info';
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const baseClasses = "p-4 rounded-md flex items-start";
  const typeClasses = {
    error: "bg-red-100 text-red-700",
    success: "bg-green-100 text-green-700",
    info: "bg-blue-100 text-blue-700",
  };

  const Icon: React.FC<{ type: AlertProps['type'] }> = ({ type }) => {
    if (type === 'error') return <span role="img" aria-label="Error">❌</span>;
    if (type === 'success') return <span role="img" aria-label="Success">✅</span>;
    if (type === 'info') return <span role="img" aria-label="Info">ℹ️</span>;
    return null;
  };


  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <Icon type={type} />
      <p className="flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="ml-4 p-1 -m-1 text-current hover:opacity-75">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
