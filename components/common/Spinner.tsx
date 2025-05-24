import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'text-primary-500', text }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} ${color} animate-spin`}>
          <div className="absolute w-full h-full rounded-full border-2 border-t-transparent"></div>
          <div className="absolute w-full h-full rounded-full border-2 border-l-transparent border-r-transparent opacity-75"></div>
        </div>
      </div>
      {text && <p className="mt-3 text-sm text-slate-400">{text}</p>}
    </div>
  );
};

export default Spinner;