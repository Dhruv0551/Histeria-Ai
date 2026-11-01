import React from 'react';

export function NeoButton({
  children,
  onClick,
  variant = 'yellow',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  icon: Icon = null,
}) {
  const bgStyles = {
    yellow: 'bg-[#ffee00] text-black hover:bg-[#ffe500]',
    pink: 'bg-[#ff5277] text-white hover:bg-[#ff3b65]',
    cyan: 'bg-[#00f0ff] text-black hover:bg-[#00d6e6]',
    lime: 'bg-[#10e060] text-black hover:bg-[#0fd059]',
    white: 'bg-white text-black hover:bg-[#f3f0e6]',
    black: 'bg-black text-[#00ff66] hover:bg-[#1a1a1a]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-bold gap-1.5',
    md: 'px-4 py-2 text-sm font-extrabold gap-2',
    lg: 'px-6 py-3 text-base font-black gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        border-[3px] border-black
        shadow-[4px_4px_0px_#0d0d0d]
        active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0d0d0d]
        transition-all duration-75 uppercase tracking-wider select-none cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[2px_2px_0px_#0d0d0d]
        ${bgStyles[variant] || bgStyles.yellow}
        ${sizeStyles[size] || sizeStyles.md}
        ${className}
      `}
    >
      {Icon && <Icon className="w-4 h-4 stroke-[2.5]" />}
      {children}
    </button>
  );
}

export function NeoBadge({ children, variant = 'yellow', className = '' }) {
  const bgMap = {
    yellow: 'bg-[#ffee00] text-black',
    pink: 'bg-[#ff5277] text-white',
    cyan: 'bg-[#00f0ff] text-black',
    lime: 'bg-[#10e060] text-black',
    purple: 'bg-[#9b51e0] text-white',
    white: 'bg-white text-black',
    black: 'bg-black text-white',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-black
        border-2 border-black uppercase tracking-wider
        shadow-[2px_2px_0px_#0d0d0d]
        ${bgMap[variant] || bgMap.yellow}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export function NeoCard({
  children,
  className = '',
  bg = 'bg-white',
  title,
  action,
  tag,
}) {
  return (
    <div
      className={`
        border-[3px] border-black
        shadow-[6px_6px_0px_#0d0d0d]
        ${bg}
        ${className}
      `}
    >
      {(title || tag || action) && (
        <div className="border-b-[3px] border-black bg-[#ffee00] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-black bg-[#ff5277]" />
            <span className="w-3 h-3 rounded-full border-2 border-black bg-[#ffee00]" />
            <span className="w-3 h-3 rounded-full border-2 border-black bg-[#10e060]" />
            {title && (
              <span className="font-black text-xs md:text-sm uppercase tracking-wider ml-2 text-black">
                {title}
              </span>
            )}
            {tag && (
              <NeoBadge variant="black" className="ml-2 text-[10px] py-0 px-1.5">
                {tag}
              </NeoBadge>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-4 md:p-6">{children}</div>
    </div>
  );
}
