import React from 'react';

const MBLogo = ({ isDark, size = 40 }) => {
  const borderColor = isDark ? '#3b82f6' : '#d97706';
  const textColor = isDark ? '#60a5fa' : '#f59e0b';
  const glowColor = isDark ? 'rgba(59,130,246,0.3)' : 'rgba(245,158,11,0.3)';

  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
        fontSize: size * 0.35,
        padding: `${size * 0.12}px ${size * 0.2}px`,
        border: `2px solid ${borderColor}`,
        borderRadius: 6,
        color: textColor,
        letterSpacing: 2,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textShadow: `0 0 8px ${glowColor}`,
        transition: 'all 0.4s ease',
        lineHeight: 1,
      }}
    >
      MB
      <div
        style={{
          position: 'absolute',
          inset: -4,
          borderRadius: 8,
          border: `1px solid ${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(217,119,6,0.2)'}`,
          pointerEvents: 'none',
          transition: 'border-color 0.4s',
        }}
      />
    </div>
  );
};

export default MBLogo;