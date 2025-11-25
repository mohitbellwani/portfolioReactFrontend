import React from 'react';

const MBLogo = ({ isDark }) => {
  const bgColor = isDark ? '#1e293b' : '#e7e5e4'; // slate-800 or stone-200
  const textColor = isDark ? '#94a3b8' : '#57534e'; // slate-400 or stone-600

  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="50" height="50" rx="8" fill={bgColor} style={{ transition: 'fill 0.3s ease' }}/>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill={textColor} fontSize="24" fontFamily="Arial, sans-serif" fontWeight="bold" dy=".3em" style={{ transition: 'fill 0.3s ease' }}>
        MB
      </text>
    </svg>
  );
};

export default MBLogo;