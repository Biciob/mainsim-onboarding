import React from 'react';

interface InputGroupProps {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, description, error, children }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label}
      </label>
      {description && (
        <p className="text-xs text-slate-500 mb-2">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1 animate-pulse">{error}</p>
      )}
    </div>
  );
};