import React from 'react';
import { Briefcase, ExternalLink, Code2 } from 'lucide-react';
import { getThemeClasses } from '../utils/theme';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';

export const SectionHeader = ({ title, label, isDark }) => {
  const theme = getThemeClasses(isDark);
  return (
    <div className="mb-14">
      <div className={`font-mono-brand text-xs ${theme.accent} tracking-[4px] uppercase mb-2`}>
        {label || `// ${title.toLowerCase()}`}
      </div>
      <h2 className={`text-4xl font-bold tracking-tight ${theme.textHeader}`}>{title}</h2>
      <div
        className={`w-12 h-[3px] ${theme.dividerGradient} rounded-sm mt-4 ${theme.accentGlow}`}
      />
    </div>
  );
};

export const SkillCard = ({ category, items, icon, isDark, index }) => {
  const theme = getThemeClasses(isDark);
  const IconComp = icon;
  return (
    <motion.div
      variants={fadeIn("right", "spring", index * 0.1, 0.75)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${theme.cardBg} p-7 rounded-xl border ${theme.cardBorder} ${theme.cardHoverBorder} transition-all duration-300 group`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-lg ${theme.accentBgLight} border ${theme.borderAccent} flex items-center justify-center ${theme.accentLight} text-sm group-hover:scale-110 transition-transform duration-300`}>
          {IconComp ? <IconComp size={16} /> : null}
        </div>
        <h3 className={`text-lg font-semibold ${theme.textHeader}`}>{category}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((skill, idx) => (
          <span
            key={idx}
            className={`px-4 py-1.5 rounded-md text-xs font-medium border ${theme.tagBg} ${theme.tagText} ${theme.tagHover} transition-all duration-300 cursor-default`}
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export const TimelineItem = ({ role, company, period, description, isLast, isDark, index }) => {
  const theme = getThemeClasses(isDark);
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeIn("left", "spring", index * 0.2, 0.75)}
      className="relative pl-8 pb-12 last:pb-0"
    >
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ originY: 0 }}
          className={`absolute left-[7px] top-2 bottom-0 w-0.5 ${isDark ? 'bg-gradient-to-b from-[#00b4ff] via-[#3b82f6] to-transparent' : 'bg-gradient-to-b from-[#f59e0b] via-[#d97706] to-transparent'}`}
        />
      )}

      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`absolute left-0 top-2 w-4 h-4 rounded-full z-10 flex items-center justify-center ${isDark ? 'bg-[#00b4ff]' : 'bg-[#f59e0b]'}`}
        style={{ boxShadow: isDark ? '0 0 12px #00b4ff, 0 0 0 4px #060614' : '0 0 12px #f59e0b, 0 0 0 4px #f5f0e8' }}
      >
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute w-full h-full rounded-full ${isDark ? 'bg-[#00b4ff]' : 'bg-[#f59e0b]'} -z-10`}
        />
      </motion.div>

      <div className={`${theme.cardBg} p-6 rounded-xl border ${theme.cardBorder} ${theme.cardHoverBorder} transition-all duration-300 hover:translate-x-1`}
        style={{ boxShadow: 'none' }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = isDark ? '0 4px 24px rgba(0,0,0,0.2), 0 0 16px rgba(59,130,246,0.18)' : '0 4px 24px rgba(0,0,0,0.08), 0 0 16px rgba(245,158,11,0.18)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <h3 className={`text-lg font-bold ${theme.textHeader}`}>{role}</h3>
          <span className={`font-mono-brand text-xs ${theme.accentLight} ${theme.accentBgLight} px-3 py-1 rounded-md w-fit mt-1 sm:mt-0 border ${theme.borderAccent}`}>
            {period}
          </span>
        </div>
        <div className={`${theme.textMuted} font-medium mb-3 flex items-center gap-2 text-sm`}>
          <Briefcase size={14} /> {company}
        </div>
        <p className={`${theme.textSecondary} text-sm leading-relaxed`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export const ProjectCard = ({ project, onSelect, isDark, index }) => {
  const theme = getThemeClasses(isDark);
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      className={`group ${theme.cardBg} rounded-2xl overflow-hidden border ${theme.cardBorder} ${theme.cardHoverBorder} transition-all duration-400 flex flex-col h-full relative`}
      style={{ boxShadow: 'none' }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = isDark ? '0 16px 48px rgba(0,0,0,0.3), 0 0 24px rgba(59,130,246,0.18)' : '0 16px 48px rgba(0,0,0,0.08), 0 0 24px rgba(245,158,11,0.18)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[rgba(59,130,246,0.08)] to-transparent' : 'bg-gradient-to-br from-[rgba(245,158,11,0.06)] to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none`} />

      <div className="p-8 flex flex-col flex-1 relative z-[1]">
        <div className={`font-mono-brand text-[11px] uppercase tracking-[2px] ${theme.accentNeon} mb-2`}>
          {project.type}
        </div>
        <h3 className={`text-xl font-bold ${theme.textHeader} mb-3`}>{project.title}</h3>
        <p className={`${theme.textSecondary} text-sm mb-5 line-clamp-3 flex-1 leading-relaxed`}>{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.slice(0, 4).map((tag, i) => (
            <span key={i} className={`font-mono-brand text-[11px] px-3 py-1 rounded border ${theme.tagBg} ${theme.tagText}`}>
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => onSelect(project)}
          className={`mt-auto w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold ${theme.accentLight} border ${theme.borderAccent} hover:${theme.accentBg} hover:text-white rounded-lg transition-all duration-300`}
        >
          View Details <ExternalLink size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export const NavLink = ({ section, active, onClick, label, isDark }) => {
  const theme = getThemeClasses(isDark);
  const isActive = active === section;
  return (
    <button
      onClick={() => onClick(section)}
      className={`text-sm font-medium uppercase tracking-wider transition-all duration-300 ${isActive
        ? `${theme.accentLight}`
        : `${theme.textMuted} hover:${isDark ? 'text-[#60a5fa]' : 'text-[#d97706]'}`
        }`}
      style={isActive ? { textShadow: isDark ? '0 0 12px rgba(59,130,246,0.4)' : '0 0 12px rgba(245,158,11,0.4)' } : {}}
    >
      {label}
    </button>
  );
};

export const MobileNavItem = ({ section, active, onClick, icon: Icon, label, isDark }) => {
  const theme = getThemeClasses(isDark);
  const isActive = active === section;
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(section)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${isActive
        ? `${theme.accentBg} text-white shadow-md`
        : `${theme.textMuted} ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-black/[0.04]'} hover:${isDark ? 'text-[#60a5fa]' : 'text-[#d97706]'}`
        }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </motion.button>
  );
};

export const Footer = ({ isDark }) => {
  const theme = getThemeClasses(isDark);
  return (
    <footer className={`border-t ${theme.border} pt-8 mt-12 text-center ${theme.textMuted} text-sm transition-colors duration-300 pb-8 relative z-[1]`}>
      <p>Designed & built by <span className={theme.accentLight}>Mohit Bellwani</span> </p>
    </footer>
  );
};