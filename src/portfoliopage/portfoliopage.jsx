import React, { useState } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  Database, 
  Terminal, 
  Cpu, 
  User, 
  Briefcase, 
  Award, 
  GraduationCap, 
  MapPin, 
  Menu, 
  X, 
  Smartphone, 
  Layout, 
  Server, 
  ArrowLeft, 
  Image as ImageIcon,
  Sun,
  Moon
} from 'lucide-react';

// --- DATA SOURCE ---
const INITIAL_RESUME_DATA = {
  profile: {
    name: "Mohit Bellwani",
    title: "Software Engineer & Application Support",
    tagline: "Automating workflows with Python, SQL, and Modern Web Tech.",
    bio: "I am an experienced engineer specializing in Application Support and Development. From automating MongoDB reporting at Arkafincap to migrating legacy Silverlight apps to Blazor at QloudX, I focus on reducing manual effort and improving system efficiency.",
    email: "bellwanimohit@gmail.com",
    linkedin: "https://www.linkedin.com/in/mohit-bellwani/",
    phone: "+91 9552201705",
    location: "Mumbai, India"
  },
  skills: [
    { 
      category: "Languages & Core", 
      icon: <Terminal size={20} />,
      items: ["Python", "C#", "SQL", "Java"] 
    },
    { 
      category: "Web Frameworks", 
      icon: <Layout size={20} />,
      items: ["Blazor", "Basic Angular", "ASP.NET Core", "Django REST"] 
    },
    { 
      category: "Databases", 
      icon: <Database size={20} />,
      items: ["MongoDB Atlas", "MySQL", "SQLite"] 
    },
    { 
      category: "Tools & DevOps", 
      icon: <Server size={20} />,
      items: ["Git/Bitbucket", "Jira", "AWS (Basic)", "Jenkins", "Linux (Ubuntu)"] 
    },
    { 
      category: "Mobile", 
      icon: <Smartphone size={20} />,
      items: ["Ionic", "Android (Java/XML)"] 
    }
  ],
  experience: [
    {
      id: 1,
      role: "Senior Executive Application Support",
      company: "Arkafincap",
      period: "Sep 2024 - Oct 2025",
      description: "Automated MongoDB Excel reporting via Python & .NET Core, improving reporting cadence by 50%. Enhanced Razorpay payment flows and reduced incident resolution time by 20% through expert log analysis."
    },
    {
      id: 2,
      role: "Developer",
      company: "QloudX",
      period: "Aug 2023 - Apr 2024",
      description: "Contributed to a Silverlight to Blazor .NET migration. Built reusable components that reduced UI effort by 20% and improved development times by 15%."
    },
    {
      id: 3,
      role: "Intern Software Developer",
      company: "43 APP MART",
      period: "Jan 2023 - Jun 2023",
      description: "Developed a campus placement management app (Angular + MySQL). Implemented CRUD workflows reducing manual admin effort by 10%."
    },
    {
      id: 4,
      role: "Intern Consultant",
      company: "UGAM A MERKLE COMPANY",
      period: "Jan 2022 - May 2022",
      description: "Built Android data-scraping workflows using Python+Appium. Automated data acquisition with Python+SQL, reducing manual prep by 40%."
    }
  ],
  projects: [
    {
      id: 1,
      title: "SMS GPS Location",
      type: "Android App",
      description: "An Android app that sends user location on-demand when a specific keyword is received via SMS from an authorized contact.",
      tags: ["Android Studio", "Java", "XML", "Google Maps API"],
      link: "#",
      github: "https://github.com/yourusername/sms-gps",
      screenshots: [
        "https://placehold.co/600x400/e2e8f0/475569?text=App+Interface+1", 
        "https://placehold.co/600x400/e2e8f0/475569?text=Map+View"
      ],
      longDescription: "This project was born out of a need for simple, text-based location tracking. It leverages Android's SMS BroadcastReceiver to listen for specific secure keywords. When triggered, it queries the device GPS and silently replies with coordinates. It features a robust permission handling system and Google Maps integration."
    },
    {
      id: 2,
      title: "Adventures Of The Lost World",
      type: "Educational Game",
      description: "Developed a video game to make education engaging for young students. Integrated fun gameplay with learning elements.",
      tags: ["Python", "Ren'Py", "Unity Engine", "Mixamo"],
      link: "#",
      github: "https://github.com/yourusername/lost-world-game",
      screenshots: [
        "https://placehold.co/600x400/e2e8f0/475569?text=Game+Menu",
        "https://placehold.co/600x400/e2e8f0/475569?text=Gameplay+Level+1"
      ],
      longDescription: "A 2D/3D hybrid educational game designed to teach basic history and science concepts. I used Ren'Py for the dialogue systems and Unity for the platforming sections. Character models were rigged using Mixamo."
    }
  ],
  certifications: [
    {
      name: "Oracle Cloud Foundations 2025 Certified Generative AI Professional",
      issuer: "Oracle",
      year: "2025"
    },
    {
      name: "Microsoft Certified: Azure Fundamentals (AZ900)",
      issuer: "Microsoft",
      year: "2022"
    }
  ],
  education: [
    {
      degree: "Masters of Computer Application (MCA)",
      school: "Bharatiya Vidya Bhavan's Sardar Patel Institute of Tech",
      year: "Dec 2022",
      detail: "Certificate of Merit Holder (3rd Rank)"
    },
    {
      degree: "B.Sc. Computer Science",
      school: "Vivekanand Education Society's College",
      year: "Oct 2020",
      detail: "First Class"
    }
  ]
};

// --- UI HELPER CLASSES ---
// We use function helpers or props to toggle styles for guaranteed compatibility
const getThemeClasses = (isDark) => ({
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
  tagText: isDark ? 'text-slate-300' : 'text-stone-600'
});

// --- UI COMPONENTS ---

const SectionHeader = ({ title, icon: Icon, isDark }) => {
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

const SkillCard = ({ category, items, icon, isDark }) => {
  const theme = getThemeClasses(isDark);
  return (
    <div className={`${theme.cardBg} p-5 rounded-xl border ${theme.cardBorder} ${theme.cardHoverBorder} transition-all duration-300 hover:shadow-md group`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`${theme.primaryText} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
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

const TimelineItem = ({ role, company, period, description, isLast, isDark }) => {
  const theme = getThemeClasses(isDark);
  return (
    <div className="relative pl-8 pb-12 last:pb-0">
      {/* Timeline Line */}
      {!isLast && (
        <div className={`absolute left-[7px] top-2 bottom-0 w-0.5 ${isDark ? 'bg-slate-800' : 'bg-stone-300'}`} />
      )}
      {/* Timeline Dot */}
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

const ProjectCard = ({ project, onSelect, isDark }) => {
  const theme = getThemeClasses(isDark);
  return (
    <div className={`group ${theme.cardBg} rounded-xl overflow-hidden border ${theme.cardBorder} shadow-sm ${theme.cardHoverBorder} transition-all hover:shadow-lg flex flex-col h-full`}>
      <div className={`h-32 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-stone-100 border-stone-200'} flex items-center justify-center relative overflow-hidden border-b`}>
          <Code2 size={40} className={`${isDark ? 'text-slate-600' : 'text-stone-400'} group-hover:${theme.primaryText} group-hover:scale-110 transition-all duration-500`} />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-bold ${theme.textHeader} group-hover:${theme.primaryText} transition-colors`}>{project.title}</h3>
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

const NavItem = ({ section, active, onClick, icon: Icon, label, isDark }) => {
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
                <div className={`h-48 ${isDark ? 'bg-slate-800' : 'bg-stone-100'} border-b ${theme.cardBorder} flex items-center justify-center`}>
                   <Code2 size={64} className={isDark ? "text-slate-600" : "text-stone-300"} />
                </div>
                
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
                            <a href={project.link} target="_blank" rel="noreferrer" className={`flex items-center gap-2 px-4 py-2 border ${theme.cardBorder} ${theme.text} rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-stone-50'} transition-colors`}>
                                <ExternalLink size={18} /> Live Demo
                            </a>
                        </div>
                    </div>

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

                    {project.screenshots && project.screenshots.length > 0 && (
                        <div>
                            <h3 className={`text-lg font-bold ${theme.textHeader} mb-4 flex items-center gap-2`}>
                                <ImageIcon size={20} /> Screenshots
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {project.screenshots.map((shot, idx) => (
                                    <img 
                                        key={idx} 
                                        src={shot} 
                                        alt={`Screenshot ${idx + 1}`} 
                                        className={`rounded-lg border ${theme.cardBorder} shadow-sm hover:shadow-md transition-shadow w-full h-auto object-cover`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

export default function PortfolioPage() {
  const [data, setData] = useState(INITIAL_RESUME_DATA);
  const [activeSection, setActiveSection] = useState('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // THEME STATE: Default is false (Light Mode)
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  const theme = getThemeClasses(isDark);

  const scrollToSection = (id) => {
    if (selectedProject) setSelectedProject(null); 
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans flex flex-col lg:flex-row transition-colors duration-300`}>
      
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
          <NavItem section="about" active={activeSection} onClick={scrollToSection} icon={User} label="Profile" isDark={isDark} />
          <NavItem section="experience" active={activeSection} onClick={scrollToSection} icon={Briefcase} label="Experience" isDark={isDark} />
          <NavItem section="skills" active={activeSection} onClick={scrollToSection} icon={Cpu} label="Tech Stack" isDark={isDark} />
          <NavItem section="projects" active={activeSection} onClick={scrollToSection} icon={Code2} label="Projects" isDark={isDark} />
          <NavItem section="education" active={activeSection} onClick={scrollToSection} icon={GraduationCap} label="Education" isDark={isDark} />
        </nav>

        <div className={`mt-auto pt-6 border-t ${theme.sidebarBorder} px-2`}>
          <div className="flex gap-4 justify-center">
            <a href={data.profile.linkedin} target="_blank" rel="noreferrer" className={`${theme.textMuted} hover:text-indigo-600 hover:scale-110 transition-all`}><Linkedin size={20} /></a>
            <a href={`mailto:${data.profile.email}`} className={`${theme.textMuted} hover:text-indigo-600 hover:scale-110 transition-all`}><Mail size={20} /></a>
          </div>
          <p className={`text-center ${theme.textMuted} text-[10px] mt-4`}>© 2025 Mohit Bellwani</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-16 lg:pt-16 pt-24 max-w-5xl mx-auto w-full">
        
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
                
                {/* Footer */}
                <footer className={`border-t ${theme.sidebarBorder} pt-8 text-center ${theme.textMuted} text-sm transition-colors duration-300`}>
                <p>Built with React & Tailwind CSS</p>
                </footer>
            </>
        )}

      </main>
    </div>
  );
}