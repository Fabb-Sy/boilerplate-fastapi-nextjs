import React from "react";

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; subtitle?: string }> = ({
  children,
  className = "",
  title,
  subtitle,
}) => {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-base font-semibold text-zinc-100">{title}</h3>}
          {subtitle && <p className="text-xs text-zinc-400 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};
