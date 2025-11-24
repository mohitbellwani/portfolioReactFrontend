import React, { useState, useEffect } from 'react';
import { 
  Linkedin, Mail, Github, DownloadIcon, User, Briefcase, 
  Cpu, Code2, GraduationCap, Award, MapPin, 
  Sun, Moon, Menu, X, Terminal
} from 'lucide-react';

import { INITIAL_RESUME_DATA } from '../data/resumeData';
// import { getThemeClasses } from '../utils/theme';
// import ProjectDetailView from '../components/ProjectDetail';
import { 
  SectionHeader, SkillCard, TimelineItem, 
  ProjectCard, NavItem, Footer 
} from '../components/UIComponents';

export default function PortfolioPage() {
  const [data, setData] = useState(INITIAL_RESUME_DATA);
  const [activeSection, setActiveSection] = useState('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // THEME STATE: Default is false (Light Mode)
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  // Synchronize Body Background
  useEffect(() => {
    if (isDark) {
      document.body.style.backgroundColor = '#020617'; // slate-950
      document.body.style.color = '#e2e8f0'; // slate-200
    } else {
      document.body.style.backgroundColor = '#fdfbf7'; // beige paper
      document.body.style.color = '#292524'; // stone-800
    }
  }, [isDark]);

  // SCROLL SPY LOGIC
  useEffect(() => {
    // If we are in project detail view, we don't spy on scroll
    if (selectedProject) return;

    const handleScroll = () => {
      const sections = ['about', 'experience', 'skills', 'projects', 'education'];
      
      let currentSection = activeSection;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Logic: visible if top is near viewport top OR inside the element
          if (rect.top >= 0 && rect.top <= 300) {
            currentSection = section;
            break;
          } else if (rect.top < 0 && rect.bottom > 100) {
             currentSection = section;
          }
        }
      }

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, selectedProject]);

  const theme = getThemeClasses(isDark);

  const scrollToSection = (id) => {
    if (selectedProject) {
        setSelectedProject(null);
        // Wait for re-render before scrolling
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                setActiveSection(id);
            }
        }, 100);
    } else {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    }
    setIsMobileMenuOpen(false);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen w-full ${theme.bg} ${theme.text} font-sans flex flex-col lg:flex-row transition-colors duration-300 overflow-x-hidden`}>
      
      {/* Mobile Header */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 ${isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-[#fdfbf7]/90 border-stone-200'} backdrop-blur-md border-b z-50 flex items-center justify-between px-4 shadow-sm transition-colors duration-300`}>
        <span className={`text-lg font-bold ${theme.textHeader}`}>Mohit<span className="text-indigo-600">.Dev</span></span>
        <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className={`p-2 rounded-full ${isDark ? 'bg-slate-800 text-yellow-400' : 'bg-stone-200 text-stone-600'}`}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`${theme.textMuted} p-2`}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className={`fixed inset-0 z-40 ${theme.bg} pt-20 px-6 lg:hidden`}>
          <div className="flex flex-col gap-2">
            <NavItem section="about" active={activeSection} onClick={scrollToSection} icon={User} label="Profile" isDark={isDark} />
            <NavItem section="experience" active={activeSection} onClick={scrollToSection} icon={Briefcase} label="Experience" isDark={isDark} />
            <NavItem section="skills" active={activeSection} onClick={scrollToSection} icon={Cpu} label="Tech Stack" isDark={isDark} />
            <NavItem section="projects" active={activeSection} onClick={scrollToSection} icon={Code2} label="Projects" isDark={isDark} />
            <NavItem section="education" active={activeSection} onClick={scrollToSection} icon={GraduationCap} label="Education" isDark={isDark} />
          </div>
        </div>
      )}

      {/* Sidebar (Desktop) */}
      <aside className={`hidden lg:flex flex-col w-80 h-screen sticky top-0 p-6 border-r ${theme.sidebarBorder} ${theme.sidebarBg} backdrop-blur-sm transition-colors duration-300`}>
        <div className="mb-10 px-2 flex justify-between items-start">
            <div>
                <h1 className={`text-2xl font-bold ${theme.textHeader} tracking-tight`}>
                    Mohit <span className="text-indigo-600">Bellwani</span>
                </h1>
                <p className={`${theme.textMuted} text-xs mt-2 font-mono uppercase tracking-widest`}>Full Stack Engineer</p>
            </div>
            {/* Toggle Button Desktop */}
            <button 
                onClick={toggleTheme} 
                className={`p-2 rounded-full transition-all ${isDark ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
                title="Toggle Dark Mode"
            >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <NavItem section="about" active={!selectedProject && activeSection === 'about' ? 'about' : ''} onClick={scrollToSection} icon={User} label="Profile" isDark={isDark} />
          <NavItem section="experience" active={!selectedProject && activeSection === 'experience' ? 'experience' : ''} onClick={scrollToSection} icon={Briefcase} label="Experience" isDark={isDark} />
          <NavItem section="skills" active={!selectedProject && activeSection === 'skills' ? 'skills' : ''} onClick={scrollToSection} icon={Cpu} label="Tech Stack" isDark={isDark} />
          <NavItem section="projects" active={selectedProject || activeSection === 'projects' ? 'projects' : ''} onClick={scrollToSection} icon={Code2} label="Projects" isDark={isDark} />
          <NavItem section="education" active={!selectedProject && activeSection === 'education' ? 'education' : ''} onClick={scrollToSection} icon={GraduationCap} label="Education" isDark={isDark} />
        </nav>

        <div className={`mt-auto pt-6 border-t ${theme.sidebarBorder} px-2`}>
          <div className="flex gap-4 justify-center">
            <a href={data.profile.linkedin} target="_blank" rel="noreferrer" className={`${theme.textMuted} hover:text-indigo-600 hover:scale-110 transition-all`}><Linkedin size={20} /></a>
            <a href={`mailto:${data.profile.email}`} className={`${theme.textMuted} hover:text-indigo-600 hover:scale-110 transition-all`}><Mail size={20} /></a>
            <a href={data.profile.github} target="_blank" rel="noreferrer" className={`${theme.textMuted} hover:text-indigo-600 hover:scale-110 transition-all`}><Github size={20} /></a>
            <a href={data.profile.resume} target="_blank" rel="noreferrer" className={`${theme.textMuted} hover:text-indigo-600 hover:scale-110 transition-all`}><DownloadIcon size={20} /></a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-16 lg:pt-16 pt-24 max-w-5xl mx-auto w-full flex flex-col min-h-screen">
        
        <div className="flex-1">
            {selectedProject ? (
                <ProjectDetailView project={selectedProject} onBack={() => setSelectedProject(null)} isDark={isDark} />
            ) : (
                <>
                    {/* Hero / About Section */}
                    <section id="about" className="mb-24 scroll-mt-24">
                    <div className={`${theme.cardBg} p-8 rounded-2xl border ${theme.cardBorder} shadow-sm mb-10 transition-colors duration-300`}>
                        <h1 className={`text-4xl lg:text-5xl font-bold ${theme.textHeader} mb-4`}>
                        Hello, I'm <span className="text-indigo-600">Mohit</span>
                        </h1>
                        <p className={`text-xl ${theme.textMuted} max-w-2xl leading-relaxed`}>
                        {data.profile.tagline}
                        </p>
                        <div className={`flex flex-wrap gap-4 mt-6 text-sm font-medium ${theme.textMuted}`}>
                            <span className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-600"/> {data.profile.location}</span>
                            <span className="flex items-center gap-1.5"><Mail size={16} className="text-indigo-600"/> {data.profile.email}</span>
                        </div>
                    </div>
                    
                    <div className={`prose max-w-none ${theme.textMuted} leading-7 text-lg`}>
                        <p>{data.profile.bio}</p>
                    </div>
                    </section>

                    {/* Experience Section */}
                    <section id="experience" className="mb-24 scroll-mt-24">
                    <SectionHeader title="Work Experience" icon={Briefcase} isDark={isDark} />
                    <div className="space-y-2">
                        {data.experience.map((exp, index) => (
                        <TimelineItem 
                            key={exp.id} 
                            {...exp} 
                            isLast={index === data.experience.length - 1} 
                            isDark={isDark}
                        />
                        ))}
                    </div>
                    </section>

                    {/* Skills Section */}
                    <section id="skills" className="mb-24 scroll-mt-24">
                    <SectionHeader title="Technical Arsenal" icon={Terminal} isDark={isDark} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.skills.map((skillGroup, idx) => (
                        <SkillCard key={idx} {...skillGroup} isDark={isDark} />
                        ))}
                    </div>
                    </section>

                    {/* Projects Section */}
                    <section id="projects" className="mb-24 scroll-mt-24">
                    <SectionHeader title="Featured Projects" icon={Code2} isDark={isDark} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.projects.map((project) => (
                        <ProjectCard key={project.id} project={project} onSelect={handleProjectSelect} isDark={isDark} />
                        ))}
                    </div>
                    </section>

                    {/* Education & Certifications */}
                    <section id="education" className="mb-24 scroll-mt-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* Education Column */}
                        <div>
                        <SectionHeader title="Education" icon={GraduationCap} isDark={isDark} />
                        <div className="space-y-8">
                            {data.education.map((edu, idx) => (
                            <div key={idx} className={`${theme.cardBg} p-6 rounded-xl border ${theme.cardBorder} shadow-sm transition-colors duration-300`}>
                                <div className="flex justify-between items-start mb-2">
                                <h3 className={`text-lg font-bold ${theme.textHeader}`}>{edu.degree}</h3>
                                <span className={`text-xs font-mono ${theme.textMuted} border ${theme.cardBorder} ${theme.bg} px-2 py-1 rounded`}>{edu.year}</span>
                                </div>
                                <p className={`${theme.primaryText} text-sm mb-2`}>{edu.school}</p>
                                <p className={`${theme.textMuted} text-xs italic`}>{edu.detail}</p>
                            </div>
                            ))}
                        </div>
                        </div>

                        {/* Certifications Column */}
                        <div>
                        <SectionHeader title="Certifications" icon={Award} isDark={isDark} />
                        <div className="space-y-4">
                            {data.certifications.map((cert, idx) => (
                            <div key={idx} className={`flex gap-4 items-start p-4 rounded-xl ${theme.cardBg} border ${theme.cardBorder} ${theme.cardHoverBorder} transition-colors shadow-sm`}>
                                <div className={`mt-1 p-2 ${theme.primaryBgLight} rounded-full ${theme.primaryText}`}>
                                <Award size={16} />
                                </div>
                                <div>
                                <h4 className={`font-semibold ${theme.textHeader} text-sm`}>{cert.name}</h4>
                                <div className={`flex gap-2 mt-1 text-xs ${theme.textMuted}`}>
                                    <span>{cert.issuer}</span>
                                    <span>•</span>
                                    <span>{cert.year}</span>
                                </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>

                    </div>
                    </section>
                </>
            )}
        </div>
        
        {/* Footer */}
        <Footer isDark={isDark} />

      </main>
    </div>
  );
}