import React from 'react';
import { ArrowLeft, Github } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import { getThemeClasses } from '../utils/theme';

const ProjectDetailView = ({ project, onBack, isDark }) => {
    if (!project) return null;
    const theme = getThemeClasses(isDark);

    return (
        <div className="animate-in slide-in-from-right duration-300">
            <button 
                onClick={onBack}
                className={`mb-6 flex items-center gap-2 ${theme.textMuted} hover:${theme.primaryText} transition-colors`}
            >
                <ArrowLeft size={20} /> Back to Projects
            </button>

            <div className={`${theme.cardBg} rounded-2xl border ${theme.cardBorder} shadow-lg overflow-hidden`}>
                <div className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                        <div>
                            <h1 className={`text-3xl font-bold ${theme.textHeader}`}>{project.title}</h1>
                            <span className={`${theme.primaryText} font-medium`}>{project.type}</span>
                        </div>
                        <div className="flex gap-3">
                            {project.github && (
                                <a href={project.github} target="_blank" rel="noreferrer" className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-stone-900 hover:bg-stone-700'} text-white rounded-lg transition-colors`}>
                                    <Github size={18} /> GitHub Repo
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Image Carousel */}
                    {project.screenshots && project.screenshots.length > 0 && (
                       <ImageCarousel images={project.screenshots} isDark={isDark} />
                    )}

                    <p className={`${theme.textMuted} leading-relaxed mb-8 text-lg`}>
                        {project.longDescription || project.description}
                    </p>

                    <div className="mb-8">
                        <h3 className={`text-lg font-bold ${theme.textHeader} mb-3`}>Technologies Used</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, i) => (
                                <span key={i} className={`px-3 py-1.5 ${theme.primaryBgLight} ${theme.primaryText} rounded-md text-sm font-medium border ${isDark ? 'border-indigo-500/20' : 'border-indigo-100'}`}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailView;