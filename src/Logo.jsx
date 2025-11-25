import React from 'react';

const MBLogo = ({ isDark, size = 50 }) => {
  const bgColor = isDark ? 'rgba(71, 85, 105, 0.1)' : 'rgba(239, 239, 239, 0.1)'; // slate-700/10 or stone-200/10
  const textColor = isDark ? '#818cf8' : '#4f46e5'; // indigo-400 or indigo-600

  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="50" height="50" rx="8" fill={bgColor} style={{ transition: 'fill 0.3s ease' }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill={textColor} fontSize="24" fontFamily="Arial, sans-serif" fontWeight="bold" dy=".1em" style={{ transition: 'fill 0.3s ease' }}>
        MB
      </text>
    </svg>
  );
};

export default MBLogo;