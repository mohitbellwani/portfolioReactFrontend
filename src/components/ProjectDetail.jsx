import React from 'react';
import { ArrowLeft, Github, ExternalLink, Code2 } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import { getThemeClasses } from '../utils/theme';
import { motion } from 'framer-motion';
import { slideIn } from '../utils/motion';

const ProjectDetailView = ({ project, onBack, isDark }) => {
    if (!project) return null;
    const theme = getThemeClasses(isDark);

    return (
        <motion.div
            variants={slideIn("right", "tween", 0, 0.5)}
            initial="hidden"
            animate="show"
        >
            <button
                onClick={onBack}
                className={`mb-6 flex items-center gap-2 ${theme.textMuted} transition-colors`}
                onMouseEnter={(e) => e.currentTarget.className = `mb-6 flex items-center gap-2 ${theme.accentLight} transition-colors`}
                onMouseLeave={(e) => e.currentTarget.className = `mb-6 flex items-center gap-2 ${theme.textMuted} transition-colors`}
            >
                <ArrowLeft size={20} /> Back to Projects
            </button>

            <div className={`${theme.cardBg} rounded-2xl border ${theme.cardBorder} overflow-hidden`}
                style={{ boxShadow: isDark ? '0 16px 48px rgba(0,0,0,0.3)' : '0 16px 48px rgba(0,0,0,0.08)' }}
            >
                <div className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                        <div>
                            <h1 className={`text-3xl font-bold ${theme.textHeader}`}>{project.title}</h1>
                            <span className={`${theme.accentLight} font-medium text-sm font-mono-brand uppercase tracking-wider`}>{project.type}</span>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {project.liveDemo && (
                                <a href={project.liveDemo} target="_blank" rel="noreferrer"
                                    className={`flex items-center gap-2 px-5 py-2.5 ${theme.accentBg} text-white rounded-lg transition-all duration-300 no-underline font-semibold text-sm hover:-translate-y-0.5`}
                                    style={{ boxShadow: isDark ? '0 0 20px rgba(59,130,246,0.18)' : '0 0 20px rgba(245,158,11,0.18)' }}
                                >
                                    <ExternalLink size={18} /> Live Demo
                                </a>
                            )}
                            {project.github && (
                                <a href={project.github} target="_blank" rel="noreferrer"
                                    className={`flex items-center gap-2 px-5 py-2.5 ${theme.accentBg} text-white rounded-lg transition-all duration-300 no-underline font-semibold text-sm hover:-translate-y-0.5`}
                                    style={{ boxShadow: isDark ? '0 0 20px rgba(59,130,246,0.18)' : '0 0 20px rgba(245,158,11,0.18)' }}
                                >
                                    <Github size={18} /> GitHub Repo
                                </a>
                            )}
                            {!project.github && project.githubLabel && (
                                <span
                                    className={`flex items-center gap-2 px-5 py-2.5 border ${theme.borderAccent} ${theme.accentLight} rounded-lg font-semibold text-sm font-mono-brand`}
                                >
                                    <Github size={18} /> {project.githubLabel}
                                </span>
                            )}
                        </div>
                    </div>

                    <p className={`${theme.textSecondary} leading-relaxed mb-8 text-lg`}>
                        {project.longDescription || project.description}
                    </p>

                    <div className="mb-8">
                        <h3 className={`text-lg font-bold ${theme.textHeader} mb-3`}>Technologies Used</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, i) => (
                                <span key={i} className={`px-3 py-1.5 ${theme.accentBgLight} ${theme.accentLight} rounded-md text-sm font-medium border ${theme.borderAccent} font-mono-brand`}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className={`text-lg font-bold ${theme.textHeader} mb-3`}>Screenshots</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.screenshots && project.screenshots.length > 0 && (
                                <ImageCarousel images={project.screenshots} isDark={isDark} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectDetailView;