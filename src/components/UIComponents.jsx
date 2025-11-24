import React from 'react';
import { Briefcase, ExternalLink, Code2 } from 'lucide-react';
import { getThemeClasses } from '../utils/theme';

export const SectionHeader = ({ title, icon: Icon, isDark }) => {
  const theme = getThemeClasses(isDark);
  return (
    <div className={`flex items-center gap-3 mb-8 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-stone-300'}`}>
      <div className={`p-2 rounded-lg ${isDark ? 'text-indigo-400 bg-indigo-500/10' : 'text-indigo-700 bg-indigo-100'}`}>
        <Icon size={24} />
      </div>
      <h2 className={`text-3xl font-bold tracking-tight ${theme.textHeader}`}>{title}</h2>
    </div>
  );
};

export const SkillCard = ({ category, items, icon, isDark }) => {
  const theme = getThemeClasses(isDark);
  const IconComp = icon;
  return (
    <div className={`${theme.cardBg} p-5 rounded-xl border ${theme.cardBorder} ${theme.cardHoverBorder} transition-all duration-300 hover:shadow-md group`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`${theme.primaryText} group-hover:scale-110 transition-transform duration-300`}>
          {IconComp ? <IconComp size={20} /> : null}
        </div>
        <h3 className={`text-lg font-semibold ${theme.textHeader}`}>{category}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((skill, idx) => (
          <span key={idx} className={`px-2.5 py-1 rounded-md text-xs font-medium border ${theme.tagBg} ${theme.tagText}`}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export const TimelineItem = ({ role, company, period, description, isLast, isDark }) => {
  const theme = getThemeClasses(isDark);
  return (
    <div className="relative pl-8 pb-12 last:pb-0">
      {!isLast && (
        <div className={`absolute left-[7px] top-2 bottom-0 w-0.5 ${isDark ? 'bg-slate-800' : 'bg-stone-300'}`} />
      )}
      <div className={`absolute left-0 top-2 w-4 h-4 rounded-full ${isDark ? 'bg-indigo-500 ring-slate-950' : 'bg-indigo-600 ring-[#fdfbf7]'} ring-4`} />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <h3 className={`text-xl font-bold ${theme.textHeader}`}>{role}</h3>
        <span className={`text-sm font-mono ${theme.primaryText} ${theme.primaryBgLight} px-2 py-0.5 rounded w-fit mt-1 sm:mt-0 border ${isDark ? 'border-transparent' : 'border-indigo-100'}`}>
          {period}
        </span>
      </div>
      <div className={`${theme.textMuted} font-medium mb-3 flex items-center gap-2`}>
        <Briefcase size={14} /> {company}
      </div>
      <p className={`${theme.textMuted} text-sm leading-relaxed ${theme.cardBg} p-4 rounded-lg border ${theme.cardBorder} shadow-sm`}>
        {description}
      </p>
    </div>
  );
};

export const ProjectCard = ({ project, onSelect, isDark }) => {
  const theme = getThemeClasses(isDark);
  return (
    <div className={`group ${theme.cardBg} rounded-xl overflow-hidden border ${theme.cardBorder} shadow-sm ${theme.cardHoverBorder} transition-all hover:shadow-lg flex flex-col h-full`}>
      {/* <div className={`h-32 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-stone-100 border-stone-200'} flex items-center justify-center relative overflow-hidden border-b`}>
          <Code2 size={40} className={`${isDark ? 'text-slate-600' : 'text-stone-400'} group-hover:${theme.primaryText} group-hover:scale-110 transition-all duration-500`} />
      </div> */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-bold ${theme.textHeader} group-hover:${theme.primaryText} transition-colors text-center w-full`}>{project.title}</h3>
        </div>
        <p className={`text-xs ${theme.primaryText} mb-3 font-medium uppercase tracking-wider`}>{project.type}</p>
        <p className={`${theme.textMuted} text-sm mb-4 line-clamp-3 flex-1`}>{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0,3).map((tag, i) => (
            <span key={i} className={`text-[10px] font-mono ${theme.tagText} ${theme.tagBg} px-2 py-1 rounded border`}>
              {tag}
            </span>
          ))}
        </div>

        <button 
          onClick={() => onSelect(project)}
          className={`mt-auto w-full py-2 flex items-center justify-center gap-2 text-sm font-medium ${theme.primaryText} ${theme.primaryBgLight} hover:bg-opacity-80 rounded-lg transition-colors`}
        >
          View Details <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};

export const NavItem = ({ section, active, onClick, icon: Icon, label, isDark }) => {
  const theme = getThemeClasses(isDark);
  return (
    <button
      onClick={() => onClick(section)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 group ${
        active === section 
          ? `bg-indigo-600 text-white shadow-md ${isDark ? 'shadow-indigo-900/20' : ''}` 
          : `${theme.textMuted} ${isDark ? 'hover:bg-slate-800 hover:text-slate-100' : 'hover:bg-stone-200 hover:text-stone-900'}`
      }`}
    >
      <Icon size={18} className={active === section ? "text-white" : `${isDark ? 'text-slate-500' : 'text-stone-500'} group-hover:${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
      <span className="font-medium">{label}</span>
    </button>
  );
};

export const Footer = ({ isDark }) => {
  const theme = getThemeClasses(isDark);
  return (
    <footer className={`border-t ${theme.sidebarBorder} pt-8 mt-12 text-center ${theme.textMuted} text-sm transition-colors duration-300 pb-8`}>
      <p>Built with ❤️ by Mohit Bellwani</p>
      {/* <p>Using React & Tailwind CSS</p> */}
    </footer>
  );
};