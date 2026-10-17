import React from 'react';
import { Terminal, Layout, Database, Server, Smartphone, Shield, Cpu, Bot } from 'lucide-react';

export const INITIAL_RESUME_DATA = {
  profile: {
    name: "Mohit Bellwani",
    title: "Applied AI Engineer & Application Support",
    tagline: "Building AI-enabled applications, automating workflows, and delivering production support across financial and business systems.",
    bio: "Software professional with experience in AI-enabled application development, production support, and full-stack development. Skilled in Python, SQL, C#/.NET, and troubleshooting application issues across financial and business systems. Proven ability to automate workflows, improve operational efficiency, and deliver client-focused solutions, including cataloging and CRM applications.",
    email: "bellwanimohit@gmail.com",
    linkedin: "https://www.linkedin.com/in/mohit-bellwani/",
    github: "https://github.com/mohitbellwani",
    resume: "/assets/resume.pdf",
    phone: "+91 9552201705",
    location: "Mumbai, India"
  },
  skills: [
    {
      category: "Production Support",
      icon: Shield,
      items: ["Incident Management", "SLA", "RCA", "Log Analysis"]
    },
    {
      category: "Programming Languages",
      icon: Terminal,
      items: ["Python", "C#", "SQL", "JavaScript", "HTML5", "CSS3", "Java"]
    },
    {
      category: "Web Frameworks",
      icon: Layout,
      items: ["Blazor", "React (Basic)", "ASP.NET Core", "Django REST"]
    },
    {
      category: "Databases",
      icon: Database,
      items: ["MongoDB", "MySQL", "SQLite"]
    },
    {
      category: "Middleware & APIs",
      icon: Cpu,
      items: ["CodeIgniter 4", "Nginx", "Temporal"]
    },
    {
      category: "Tools & DevOps",
      icon: Server,
      items: ["Git/Bitbucket", "Jira", "AWS (Basics)", "Postman", "Liferay", "Zoho Expense", "Zoho Books"]
    },
    {
      category: "Mobile",
      icon: Smartphone,
      items: ["Ionic", "Android (Java/XML)"]
    },
    {
      category: "AI Tools",
      icon: Bot,
      items: ["Claude", "Codex", "LocalAI"]
    }
  ],
  experience: [
    {
      id: 1,
      role: "Applied AI Engineer",
      company: "SMB Catalyst",
      period: "Mar 2026 - Present",
      description: "Developed AI-enabled applications and solutions for client business workflows. Built a Smart Cataloging system that reduced client presentation prep time by 80% and soft quotation generation time by 90% by centralizing catalogue data. Integrated CRM functionality enabling clients to record leads and manage follow-ups more efficiently. Developed Android and iOS applications to extend catalog and CRM functionality to mobile users."
    },
    {
      id: 2,
      role: "Senior Executive Application Support",
      company: "Arkafincap",
      period: "Sep 2024 - Oct 2025",
      description: "Provided L1 and L2 application support for the Loan Origination System (LOS), troubleshooting production issues and coordinating resolutions. Automated MongoDB to Excel reporting via Python scripts consuming the Netcore Email API, improving reporting cadence by 50%. Cut incident resolution time by 20%, lowering MTTR from 8 to 6 hours through pod-level analysis using Kubernetes (kubectl, logs) and zgrep on production servers. Developed a custom Razorpay payment link generator using Google AppScript, reducing development time by 40%."
    },
    {
      id: 3,
      role: "Developer",
      company: "QloudX",
      period: "Aug 2023 - Apr 2024",
      description: "Contributed to Silverlight→Blazor .NET migration, delivering 15% components/pages across 25 sprints with on-time milestones. Built reusable Blazor components and integrated C#/.NET Core services, reducing duplicate UI effort by 20% and improving development times by 15%. Participated in 24 code reviews & resolved feedback within 4 hours median, lowering rework/defects by 15%."
    },
    {
      id: 4,
      role: "Software Support Technician",
      company: "Tata Consultancy Services",
      period: "Aug 2020 - Jan 2021",
      description: "Executed sanity testing of web applications and documented issues to support stable releases. Performed PHP/MySQL data corrections and coordinated with relevant teams to resolve production issues. Used TortoiseSVN for version control and participated in daily standups for task tracking."
    }
  ],
  freelance: [
    {
      id: 1,
      role: "Freelance Software Developer",
      company: "Self-Employed (Remote)",
      period: "Oct 2025 - Mar 2026",
      description: "Engineered a robust Tauri desktop application for a hardware store with SQLite for local data persistence and seamless offline operations, deployed cloud-synced web demo on Vercel/Render. Designed a full-stack personal portfolio with MongoDB Atlas for dynamic content management. Currently architecting a scalable e-commerce solution for a grocery business with AWS S3 image storage and optimized PL/SQL queries."
    }
  ],
  internships: [
    {
      id: 1,
      role: "Intern Software Developer",
      company: "43 APP MART",
      period: "Jan 2023 - Jun 2023",
      description: "Developed a campus placement management app (Angular + MySQL), delivering 2 core modules across 16 sprints. Implemented CRUD workflows and validations, reducing manual admin effort by 10% and lowering user-reported issues by 10%. Drove weekly demos & feedback cycles, cutting rework by 25% & hitting 60% on-time milestone delivery."
    },
    {
      id: 2,
      role: "Intern Consultant",
      company: "UGAM A MERKLE COMPANY",
      period: "Jan 2022 - May 2022",
      description: "Built Android data-scraping workflows using Python+Appium, extracting 5-7 data points/session with 80% success rate. Automated data acquisition with Python+SQL, reducing manual prep by 40% and increasing refresh frequency from daily to twice a day. Exposed Django REST APIs consumed by a React frontend. Operated in weekly sprints using Jira/Bitbucket, closing 3 story points/sprint."
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
      github: "https://github.com/mohitbellwani/SMS-GPS-location",
      screenshots: [
        "/assets/SMSGPS/screen2.jpg",
        "/assets/SMSGPS/screen3.jpg",
        "/assets/SMSGPS/screen4.jpg",
        "/assets/SMSGPS/screen5.jpg",
        "/assets/SMSGPS/screen6.jpg",
        "/assets/SMSGPS/screen7.jpg",
        "/assets/SMSGPS/screen8.jpg",
        "/assets/SMSGPS/screen9.jpg",
        "/assets/SMSGPS/screen10.jpg",
        "/assets/SMSGPS/screen11.jpg",
        "/assets/SMSGPS/screen12.jpg",
        "/assets/SMSGPS/screen14.jpg"
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
      github: "https://github.com/mohitbellwani/Adventures-of-the-lost-world",
      screenshots: [
        "/assets/AOTLW/1.jpeg",
        "/assets/AOTLW/2.jpeg",
        "/assets/AOTLW/3.jpeg",
        "/assets/AOTLW/4.jpeg",
        "/assets/AOTLW/5.jpeg",
        "/assets/AOTLW/6.jpeg",
      ],
      longDescription: "A 2D/3D hybrid educational game designed to teach basic history and science concepts. I used Ren'Py for the dialogue systems and Unity for the platforming sections. Character models were rigged using Mixamo."
    },
    {
      id: 3,
      title: "Inventory Pro",
      type: "Full Stack Web App",
      description: "A comprehensive inventory management system with real-time stock tracking, supplier management, transaction history, and audit logging. Features a responsive dashboard with analytics.",
      tags: ["React", "Vite", "Python", "FastAPI", "Supabase", "Tailwind CSS", "Tauri"],
      link: "#",
      liveDemo: "https://inventory-pro-eight.vercel.app/",
      github: null,
      githubLabel: "Code on Demand",
      screenshots: [],
      longDescription: "Inventory Pro is a production-grade inventory management system built with a React + Vite frontend and Python FastAPI backend, backed by Supabase (PostgreSQL). It features comprehensive CRUD operations for categories, items, and suppliers, real-time stock tracking with transaction history, an audit logging system with 60-day auto-archival, and a responsive analytics dashboard. The system also has a Tauri-based desktop application for offline use."
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
      degree: "Master of Computer Applications",
      school: "Bharatiya Vidya Bhavan's Sardar Patel Institute of Technology",
      year: "Dec 2022",
      detail: "Certificate of Merit Holder (3rd Rank)"
    },
    {
      degree: "Bachelor of Science - Computer Science",
      school: "Vivekanand Education Society's College of Arts, Science & Commerce",
      year: "Oct 2020",
      detail: "First Class"
    }
  ]
};