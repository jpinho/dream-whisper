
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isActionCard?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, onClick, disabled, isActionCard = false, className = '' }) => {
  const baseClasses = "bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all duration-300";
  const actionClasses = isActionCard ? "cursor-pointer hover:bg-slate-700/70 hover:border-indigo-500 hover:shadow-indigo-500/30 transform hover:-translate-y-1" : "";
  const disabledClasses = disabled ? "opacity-60 cursor-not-allowed" : "";

  return (
    <div
      className={`${baseClasses} ${actionClasses} ${disabledClasses} ${className}`}
      onClick={!disabled ? onClick : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
