import React, { useState, useEffect, useRef } from 'react';
import {
  Linkedin, Mail, Github, User, Briefcase,
  Cpu, Code2, GraduationCap, Award, MapPin,
  Sun, Moon, Menu, X, Terminal, Phone,
  FileDownIcon
} from 'lucide-react';

import MBLogo from '../Logo';
import { INITIAL_RESUME_DATA } from '../data/resumeData';
import { getThemeClasses } from '../utils/theme';
import ProjectDetailView from '../components/ProjectDetail';
import ConstellationCanvas from '../components/ConstellationCanvas';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeIn, slideIn, staggerContainer, textVariant } from '../utils/motion';
import {
  SectionHeader, SkillCard, TimelineItem,
  ProjectCard, NavLink, MobileNavItem, Footer
} from '../components/UIComponents';

export default function PortfolioPage() {
  const [data, setData] = useState(INITIAL_RESUME_DATA);
  const [activeSection, setActiveSection] = useState('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDark, setIsDark] = useState(true); // Default to dark mode for V2

  const toggleTheme = () => setIsDark(!isDark);

  // Synchronize Body Background
  useEffect(() => {
    if (isDark) {
      document.body.style.backgroundColor = '#060614';
      document.body.style.color = '#e4e4f0';
    } else {
      document.body.style.backgroundColor = '#f5f0e8';
      document.body.style.color = '#1a1a2e';
    }
  }, [isDark]);

  // Dynamically update favicon based on theme
  useEffect(() => {
    const favicon = document.getElementById('favicon');
    if (favicon) {
      const bgColor = isDark ? '#111133' : '#ede7db';
      const textColor = isDark ? '#60a5fa' : '#d97706';

      const svgString = `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="16" fill="${bgColor}" />
          <text x="50" y="50" dominant-baseline="central" text-anchor="middle" fill="${textColor}" font-size="50" font-family="Arial, sans-serif" font-weight="bold" dy="2">
            MB
          </text>
        </svg>
      `;
      const encodedSvg = encodeURIComponent(svgString);
      favicon.href = `data:image/svg+xml,${encodedSvg}`;
    }
  }, [isDark]);

  // SCROLL SPY
  useEffect(() => {
    if (selectedProject) return;

    const handleScroll = () => {
      const sections = ['about', 'experience', 'skills', 'projects', 'education', 'contact'];
      let currentSection = activeSection;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
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

  // Typewriter effect
  const [typeText, setTypeText] = useState('');
  const typeRef = useRef({ idx: 0, charIdx: 0, deleting: false });
  const titles = ["Software Engineer", "Application Support Specialist", "Full Stack Developer", "Python Automation Expert"];

  useEffect(() => {
    const typeLoop = () => {
      const { idx, charIdx, deleting } = typeRef.current;
      const cur = titles[idx];

      if (!deleting) {
        setTypeText(cur.substring(0, charIdx + 1));
        typeRef.current.charIdx++;
        if (typeRef.current.charIdx === cur.length) {
          typeRef.current.deleting = true;
          return setTimeout(typeLoop, 2200);
        }
        return setTimeout(typeLoop, 70);
      } else {
        setTypeText(cur.substring(0, charIdx - 1));
        typeRef.current.charIdx--;
        if (typeRef.current.charIdx === 0) {
          typeRef.current.deleting = false;
          typeRef.current.idx = (idx + 1) % titles.length;
          return setTimeout(typeLoop, 400);
        }
        return setTimeout(typeLoop, 35);
      }
    };

    const timer = setTimeout(typeLoop, 500);
    return () => clearTimeout(timer);
  }, []);

  const navSections = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className={`w-full ${theme.bg} ${theme.text} transition-colors duration-500`} style={{ fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* Constellation Background */}
      <ConstellationCanvas isDark={isDark} />

      {/* ═════ Fixed Top Nav ═════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${theme.navBg} backdrop-blur-xl border-b ${theme.border} transition-all duration-500`}>
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 no-underline" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <MBLogo isDark={isDark} size={40} />
            <span className={`font-semibold text-[17px] tracking-wide ${theme.textHeader}`}>
              Mohit Bellwani
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navSections.map((s) => (
              <NavLink
                key={s.id}
                section={s.id}
                active={!selectedProject ? activeSection : ''}
                onClick={scrollToSection}
                label={s.label}
                isDark={isDark}
              />
            ))}
          </div>

          {/* Right: Theme Toggle + Socials + Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`w-11 h-11 rounded-xl border ${theme.border} ${theme.cardBg} flex items-center justify-center cursor-pointer text-lg transition-all duration-300 ${theme.accent} hover:border-current`}
              title="Toggle theme"
              style={{ boxShadow: 'none' }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = isDark ? '0 0 16px rgba(59,130,246,0.18)' : '0 0 16px rgba(245,158,11,0.18)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden lg:flex gap-3">
              <a href={data.profile.github} target="_blank" rel="noreferrer"
                className={`w-9 h-9 flex items-center justify-center rounded-lg border ${theme.border} ${theme.textMuted} no-underline text-sm transition-all duration-300 ${theme.cardHoverBorder}`}
                style={{ boxShadow: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = isDark ? '0 0 16px rgba(59,130,246,0.18)' : '0 0 16px rgba(245,158,11,0.18)'; }}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <Github size={16} />
              </a>
              <a href={data.profile.linkedin} target="_blank" rel="noreferrer"
                className={`w-9 h-9 flex items-center justify-center rounded-lg border ${theme.border} ${theme.textMuted} no-underline text-sm transition-all duration-300 ${theme.cardHoverBorder}`}
                style={{ boxShadow: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = isDark ? '0 0 16px rgba(59,130,246,0.18)' : '0 0 16px rgba(245,158,11,0.18)'; }}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <Linkedin size={16} />
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 ${theme.textMuted}`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-40 ${theme.bg} pt-24 px-6 lg:hidden flex flex-col`}
            style={{ backdropFilter: 'blur(20px)' }}
          >
            <div className="flex flex-col gap-2">
              <MobileNavItem section="about" active={activeSection} onClick={scrollToSection} icon={User} label="About" isDark={isDark} />
              <MobileNavItem section="experience" active={activeSection} onClick={scrollToSection} icon={Briefcase} label="Experience" isDark={isDark} />
              <MobileNavItem section="skills" active={activeSection} onClick={scrollToSection} icon={Cpu} label="Tech Stack" isDark={isDark} />
              <MobileNavItem section="projects" active={activeSection} onClick={scrollToSection} icon={Code2} label="Projects" isDark={isDark} />
              <MobileNavItem section="education" active={activeSection} onClick={scrollToSection} icon={GraduationCap} label="Education" isDark={isDark} />
              <MobileNavItem section="contact" active={activeSection} onClick={scrollToSection} icon={Mail} label="Contact" isDark={isDark} />
            </div>

            <div className={`mt-auto mb-8 pt-6 border-t ${theme.border}`}>
              <div className="flex gap-6 justify-center">
                <a href={data.profile.linkedin} target="_blank" rel="noreferrer" className={`${theme.textMuted} transition-all hover:scale-110`}><Linkedin size={24} /></a>
                <a href={`mailto:${data.profile.email}`} className={`${theme.textMuted} transition-all hover:scale-110`}><Mail size={24} /></a>
                <a href={data.profile.github} target="_blank" rel="noreferrer" className={`${theme.textMuted} transition-all hover:scale-110`}><Github size={24} /></a>
                <a href={data.profile.resume} target="_blank" rel="noreferrer" className={`${theme.textMuted} transition-all hover:scale-110`}><FileDownIcon size={24} /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═════ Main Content ═════ */}
      <main className="relative z-[1]">

        {selectedProject ? (
          <div className="max-w-[1100px] mx-auto px-6 pt-24">
            <ProjectDetailView project={selectedProject} onBack={() => setSelectedProject(null)} isDark={isDark} />
          </div>
        ) : (
          <>
            {/* ═════ Hero Section ═════ */}
            <section className="min-h-screen flex items-center pt-20">
              <div className="max-w-[1100px] mx-auto px-6 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  >
                    <div className={`font-mono-brand text-xs ${theme.accentLight} tracking-[3px] uppercase mb-4 flex items-center gap-2`}>
                      <span className={theme.accent}>—</span> Hello World
                    </div>
                    <h1 className={`text-5xl lg:text-[60px] font-bold leading-[1.05] mb-5 tracking-tight ${theme.textHeader}`}>
                      I'm<br />
                      <span className={`${theme.nameGradient} bg-clip-text text-transparent`} style={{ backgroundSize: '200% 200%', animation: 'gradientShift 4s ease-in-out infinite' }}>
                        Mohit Bellwani
                      </span>
                    </h1>
                    <p className={`text-xl ${theme.textSecondary} mb-3`}>
                      <span className={theme.accentLight}>{typeText}</span>
                      <span className={`${theme.accentNeon} animate-pulse`}>|</span>
                    </p>
                    <p className={`text-base ${theme.textMuted} max-w-[500px] mb-9 leading-relaxed`}>
                      {data.profile.tagline}
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <a
                        href="#projects"
                        onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}
                        className={`px-7 py-3.5 rounded-xl font-semibold text-sm text-white no-underline inline-flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 ${theme.btnPrimaryGradient}`}
                        style={{ boxShadow: isDark ? '0 0 28px rgba(59,130,246,0.18), 0 4px 12px rgba(0,0,0,0.2)' : '0 0 28px rgba(245,158,11,0.18), 0 4px 12px rgba(0,0,0,0.1)' }}
                      >
                        View Projects →
                      </a>
                      <a href={data.profile.github} target="_blank" rel="noreferrer"
                        className={`px-7 py-3.5 rounded-xl font-semibold text-sm no-underline inline-flex items-center gap-2 border ${theme.border} ${theme.textSecondary} transition-all duration-300 hover:-translate-y-0.5 ${theme.cardHoverBorder}`}
                      >
                        <Github size={16} /> GitHub
                      </a>
                      <a href="#contact"
                        onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
                        className={`px-7 py-3.5 rounded-xl font-semibold text-sm no-underline inline-flex items-center gap-2 border ${theme.border} ${theme.textSecondary} transition-all duration-300 hover:-translate-y-0.5 ${theme.cardHoverBorder}`}
                      >
                        Contact
                      </a>
                    </div>
                  </motion.div>

                  {/* Orbital Logo */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className="flex items-center justify-center order-first lg:order-last"
                  >
                    <div className="relative w-[220px] h-[220px] lg:w-[280px] lg:h-[280px]">
                      {/* Outer ring */}
                      <div
                        className={`absolute inset-0 rounded-full border-2 ${theme.borderAccent}`}
                        style={{ animation: 'hexRotate 20s linear infinite' }}
                      >
                        <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full`}
                          style={{ background: isDark ? '#00b4ff' : '#f59e0b', boxShadow: isDark ? '0 0 16px #00b4ff' : '0 0 16px #f59e0b' }}
                        />
                        <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full`}
                          style={{ background: isDark ? '#00b4ff' : '#f59e0b', boxShadow: isDark ? '0 0 16px #00b4ff' : '0 0 16px #f59e0b' }}
                        />
                      </div>
                      {/* Inner dashed ring */}
                      <div
                        className={`absolute inset-5 rounded-full border border-dashed ${theme.borderAccent} opacity-40`}
                        style={{ animation: 'hexRotate 30s linear infinite reverse' }}
                      />
                      {/* Core */}
                      <div
                        className={`absolute inset-[50px] lg:inset-[50px] rounded-full ${theme.cardBg} border ${theme.borderAccent} flex items-center justify-center`}
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        <span className={`text-4xl lg:text-5xl font-bold ${theme.accentLight}`}
                          style={{ textShadow: isDark ? '0 0 30px rgba(59,130,246,0.3)' : '0 0 30px rgba(245,158,11,0.3)', letterSpacing: 4 }}
                        >
                          MB
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* ═════ About ═════ */}
            <motion.section
              id="about"
              className="py-24 scroll-mt-20"
              variants={staggerContainer()}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              <div className="max-w-[1100px] mx-auto px-6">
                <SectionHeader title="Who I Am" label="// about" isDark={isDark} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                  <motion.div variants={fadeIn("up", "tween", 0.2, 1)}>
                    <p className={`text-base ${theme.textSecondary} leading-relaxed mb-4`}>
                      {data.profile.bio}
                    </p>
                    <div className={`flex flex-wrap gap-4 mt-6 text-sm font-medium ${theme.textMuted}`}>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={16} className={theme.accent} /> {data.profile.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail size={16} className={theme.accent} /> {data.profile.email}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div variants={fadeIn("up", "tween", 0.4, 1)} className="grid grid-cols-2 gap-4">
                    {[
                      { num: '2+', label: 'Years Experience' },
                      { num: '5+', label: 'Projects' },
                      { num: '3', label: 'Companies' },
                      { num: '2', label: 'Certifications' },
                    ].map((stat, i) => (
                      <div key={i}
                        className={`p-7 ${theme.cardBg} border ${theme.cardBorder} rounded-xl text-center transition-all duration-300 relative overflow-hidden group cursor-default ${theme.cardHoverBorder}`}
                        style={{ boxShadow: 'none' }}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = isDark ? '0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(59,130,246,0.18)' : '0 8px 32px rgba(0,0,0,0.06), 0 0 20px rgba(245,158,11,0.18)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        <div className={`absolute top-0 left-0 right-0 h-0.5 ${theme.dividerGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        <div className={`text-4xl font-bold font-mono-brand ${theme.accentLight}`}
                          style={{ textShadow: isDark ? '0 0 12px rgba(59,130,246,0.18)' : '0 0 12px rgba(245,158,11,0.18)' }}
                        >
                          {stat.num}
                        </div>
                        <div className={`text-xs ${theme.textMuted} mt-1 font-medium`}>{stat.label}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.section>

            {/* ═════ Experience ═════ */}
            <motion.section
              id="experience"
              className="py-24 scroll-mt-20"
              variants={staggerContainer()}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="max-w-[1100px] mx-auto px-6">
                <SectionHeader title="Where I've Worked" label="// experience" isDark={isDark} />
                <div className="relative pl-2">
                  {data.experience.map((exp, index) => (
                    <TimelineItem
                      key={exp.id}
                      {...exp}
                      isLast={index === data.experience.length - 1}
                      isDark={isDark}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </motion.section>

            {/* ═════ Skills ═════ */}
            <motion.section
              id="skills"
              className="py-24 scroll-mt-20"
              variants={staggerContainer()}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="max-w-[1100px] mx-auto px-6">
                <SectionHeader title="Tools I Work With" label="// tech stack" isDark={isDark} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {data.skills.map((skillGroup, idx) => (
                    <SkillCard key={idx} {...skillGroup} isDark={isDark} index={idx} />
                  ))}
                </div>
              </div>
            </motion.section>

            {/* ═════ Projects ═════ */}
            <motion.section
              id="projects"
              className="py-24 scroll-mt-20"
              variants={staggerContainer()}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="max-w-[1100px] mx-auto px-6">
                <SectionHeader title="Things I've Built" label="// projects" isDark={isDark} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.projects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} onSelect={handleProjectSelect} isDark={isDark} index={index} />
                  ))}
                </div>
              </div>
            </motion.section>

            {/* ═════ Education & Certifications ═════ */}
            <motion.section
              id="education"
              className="py-24 scroll-mt-20"
              variants={staggerContainer()}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="max-w-[1100px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Education */}
                  <motion.div variants={fadeIn("up", "tween", 0.2, 1)}>
                    <SectionHeader title="Academic Background" label="// education" isDark={isDark} />
                    <div className="space-y-5">
                      {data.education.map((edu, idx) => (
                        <div key={idx}
                          className={`${theme.cardBg} p-7 rounded-xl border ${theme.cardBorder} ${theme.cardHoverBorder} transition-all duration-300`}
                          style={{ boxShadow: 'none' }}
                          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = isDark ? '0 0 16px rgba(59,130,246,0.12)' : '0 0 16px rgba(245,158,11,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                          <h3 className={`text-lg font-semibold ${theme.textHeader} mb-1`}>{edu.degree}</h3>
                          <p className={`text-sm ${theme.textMuted} mb-2`}>{edu.school}</p>
                          <div className="flex justify-between items-center">
                            <span className={`font-mono-brand text-xs ${theme.accentLight}`}>{edu.year}</span>
                            <span className={`text-xs ${theme.textSecondary} ${theme.accentBgLight} px-3 py-1 rounded`}>{edu.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Certifications */}
                  <motion.div variants={fadeIn("up", "tween", 0.4, 1)}>
                    <SectionHeader title="Certifications" label="// certifications" isDark={isDark} />
                    <div className="space-y-4">
                      {data.certifications.map((cert, idx) => (
                        <div key={idx}
                          className={`flex gap-4 items-start p-5 rounded-xl ${theme.cardBg} border ${theme.cardBorder} ${theme.cardHoverBorder} transition-all duration-300`}
                        >
                          <div className={`mt-1 p-2 ${theme.accentBgLight} rounded-full ${theme.accentLight}`}>
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
                  </motion.div>
                </div>
              </div>
            </motion.section>

            {/* ═════ Contact ═════ */}
            <motion.section
              id="contact"
              className="py-24 scroll-mt-20"
              variants={staggerContainer()}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="max-w-[1100px] mx-auto px-6">
                <SectionHeader title="Let's Connect" label="// contact" isDark={isDark} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[700px]">
                  {[
                    { icon: Mail, label: 'Email', value: data.profile.email, href: `mailto:${data.profile.email}` },
                    { icon: Phone, label: 'Phone', value: data.profile.phone || '+91 9552201705', href: null },
                    { icon: Linkedin, label: 'LinkedIn', value: 'mohit-bellwani', href: data.profile.linkedin },
                    { icon: Github, label: 'GitHub', value: 'mohitbellwani', href: data.profile.github },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      variants={fadeIn("up", "tween", 0.1 * i, 0.75)}
                      className={`p-6 ${theme.cardBg} border ${theme.cardBorder} rounded-xl flex items-center gap-4 transition-all duration-300 ${theme.cardHoverBorder}`}
                      style={{ boxShadow: 'none' }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = isDark ? '0 0 16px rgba(59,130,246,0.12)' : '0 0 16px rgba(245,158,11,0.12)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateX(0)'; }}
                    >
                      <div className={`w-11 h-11 rounded-xl ${theme.accentBgLight} border ${theme.borderAccent} flex items-center justify-center text-lg flex-shrink-0`}>
                        <item.icon size={18} className={theme.accentLight} />
                      </div>
                      <div>
                        <div className={`text-[11px] ${theme.textMuted} uppercase tracking-[1.5px] font-semibold mb-0.5`}>{item.label}</div>
                        <div className={`text-[15px] font-medium`}>
                          {item.href ? (
                            <a href={item.href} target={item.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" className={`${theme.textHeader} no-underline transition-colors duration-300`}
                              onMouseEnter={(e) => e.currentTarget.className = `${theme.accentLight} no-underline transition-colors duration-300`}
                              onMouseLeave={(e) => e.currentTarget.className = `${theme.textHeader} no-underline transition-colors duration-300`}
                            >
                              {item.value}
                            </a>
                          ) : item.value}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Open to Work Badge */}
                <motion.div
                  variants={fadeIn("up", "tween", 0.5, 0.75)}
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl ${theme.accentBgLight} border ${theme.borderAccent} ${theme.accentLight} font-semibold text-sm mt-10`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: isDark ? '#00b4ff' : '#f59e0b',
                      boxShadow: isDark ? '0 0 10px #00b4ff' : '0 0 10px #f59e0b',
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  />
                  Open to Work — Full-time / Remote / On-site
                </motion.div>
              </div>
            </motion.section>
          </>
        )}

        {/* Footer */}
        <div className="max-w-[1100px] mx-auto px-6">
          <Footer isDark={isDark} />
        </div>
      </main>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes hexRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}