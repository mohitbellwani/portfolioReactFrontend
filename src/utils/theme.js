export const getThemeClasses = (isDark) => ({
    bg: isDark ? 'bg-slate-950' : 'bg-[#fdfbf7]',
    text: isDark ? 'text-slate-200' : 'text-stone-800',
    textMuted: isDark ? 'text-slate-400' : 'text-stone-600',
    textHeader: isDark ? 'text-slate-100' : 'text-stone-900',
    cardBg: isDark ? 'bg-slate-900' : 'bg-white',
    cardBorder: isDark ? 'border-slate-800' : 'border-stone-200',
    cardHoverBorder: isDark ? 'hover:border-indigo-500' : 'hover:border-indigo-400',
    primaryText: isDark ? 'text-indigo-400' : 'text-indigo-600',
    primaryBgLight: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50',
    sidebarBg: isDark ? 'bg-slate-900/50' : 'bg-white/50',
    sidebarBorder: isDark ? 'border-slate-800' : 'border-stone-200',
    iconBg: isDark ? 'bg-indigo-500/20' : 'bg-indigo-100',
    tagBg: isDark ? 'bg-slate-800 border-slate-700' : 'bg-stone-100 border-stone-200',
    tagText: isDark ? 'text-slate-300' : 'text-stone-600',
    buttonBg: isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-stone-200 hover:bg-stone-300'
  });