
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "px-6 py-3 font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-full";
  
  const variantClasses = {
    primary: 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 focus:ring-yellow-300/50 shadow-lg hover:shadow-yellow-500/40',
    secondary: 'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-400/50'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
