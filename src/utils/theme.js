export const getThemeClasses = (isDark) => ({
  // Backgrounds
  bg: isDark ? 'bg-[#060614]' : 'bg-[#f5f0e8]',
  bgSurface: isDark ? 'bg-[#0c0c24]' : 'bg-[#ede7db]',
  cardBg: isDark ? 'bg-[#111133]' : 'bg-white',
  cardBgHover: isDark ? 'bg-[#161650]' : 'bg-[#fff8ed]',

  // Text
  text: isDark ? 'text-[#e4e4f0]' : 'text-[#1a1a2e]',
  textHeader: isDark ? 'text-[#e4e4f0]' : 'text-[#1a1a2e]',
  textMuted: isDark ? 'text-[#5e5e80]' : 'text-[#7a7a96]',
  textSecondary: isDark ? 'text-[#9898b8]' : 'text-[#4a4a6a]',

  // Accent (blue for dark, amber for light)
  accent: isDark ? 'text-[#3b82f6]' : 'text-[#d97706]',
  accentLight: isDark ? 'text-[#60a5fa]' : 'text-[#f59e0b]',
  accentBg: isDark ? 'bg-[#3b82f6]' : 'bg-[#d97706]',
  accentBgLight: isDark ? 'bg-[#3b82f6]/10' : 'bg-[#d97706]/10',
  accentNeon: isDark ? 'text-[#00b4ff]' : 'text-[#f59e0b]',
  accentGlow: isDark ? 'shadow-[0_0_20px_rgba(59,130,246,0.18)]' : 'shadow-[0_0_20px_rgba(245,158,11,0.18)]',

  // Borders
  border: isDark ? 'border-white/[0.06]' : 'border-black/[0.08]',
  borderAccent: isDark ? 'border-[#3b82f6]/30' : 'border-[#d97706]/30',
  cardBorder: isDark ? 'border-white/[0.06]' : 'border-black/[0.08]',
  cardHoverBorder: isDark ? 'hover:border-[#3b82f6]/30' : 'hover:border-[#d97706]/30',

  // Navigation
  navBg: isDark ? 'bg-[#060614]/82' : 'bg-[#f5f0e8]/85',
  sidebarBg: isDark ? 'bg-[#0c0c24]/50' : 'bg-white/50',
  sidebarBorder: isDark ? 'border-white/[0.06]' : 'border-black/[0.08]',

  // Tags & Pills
  tagBg: isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.03] border-black/[0.08]',
  tagText: isDark ? 'text-[#9898b8]' : 'text-[#4a4a6a]',
  tagHover: isDark ? 'hover:border-[#00b4ff] hover:text-[#60a5fa] hover:bg-[#3b82f6]/10' : 'hover:border-[#f59e0b] hover:text-[#d97706] hover:bg-[#d97706]/10',

  // Buttons
  primaryText: isDark ? 'text-[#60a5fa]' : 'text-[#d97706]',
  primaryBgLight: isDark ? 'bg-[#3b82f6]/10' : 'bg-[#d97706]/10',
  buttonBg: isDark ? 'bg-[#111133] hover:bg-[#161650]' : 'bg-[#ede7db] hover:bg-[#e5ddd0]',

  // Grid overlay
  gridColor: isDark ? 'rgba(59,130,246,0.02)' : 'rgba(217,119,6,0.03)',

  // Gradient for name accent
  nameGradient: isDark
    ? 'bg-gradient-to-r from-[#00b4ff] via-[#3b82f6] to-[#818cf8]'
    : 'bg-gradient-to-r from-[#f59e0b] via-[#d97706] to-[#ea580c]',

  // Section divider
  dividerGradient: isDark
    ? 'bg-gradient-to-r from-[#00b4ff] to-[#3b82f6]'
    : 'bg-gradient-to-r from-[#f59e0b] to-[#d97706]',

  // Button gradients
  btnPrimaryGradient: isDark
    ? 'bg-gradient-to-r from-[#3b82f6] to-[#818cf8]'
    : 'bg-gradient-to-r from-[#d97706] to-[#ea580c]',
});

// Particle color configs for ConstellationCanvas
export const getParticleColors = (isDark) => isDark
  ? { r: 59, g: 130, b: 246, nr: 0, ng: 180, nb: 255 }   // blue / neon cyan
  : { r: 217, g: 119, b: 6, nr: 245, ng: 158, nb: 11 };   // amber / gold