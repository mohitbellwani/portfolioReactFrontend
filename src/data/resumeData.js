import React from 'react';
import { Terminal, Layout, Database, Server, Smartphone } from 'lucide-react';

export const INITIAL_RESUME_DATA = {
  profile: {
    name: "Mohit Bellwani",
    title: "Software Engineer & Application Support",
    tagline: "Automating workflows with Python, MongoDB, and Modern Web Tech.",
    bio: "I am an experienced engineer specializing in Application Support and Development. From automating MongoDB reporting at Arkafincap to migrating legacy Silverlight apps to Blazor at QloudX, I focus on reducing manual effort and improving system efficiency.",
    email: "bellwanimohit@gmail.com",
    linkedin: "https://www.linkedin.com/in/mohit-bellwani/",
    github: "https://github.com/mohitbellwani",
    resume: "/assets/Mohit_Bellwani_Resume_V9.pdf",
    phone: "+91 9552201705",
    location: "Mumbai, India"
  },
  skills: [
    { 
      category: "Languages & Core", 
      icon: Terminal,
      items: ["Python", "C#", "SQL", "MongoDB", "JavaScript", "HTML5", "CSS3", "Java"] 
    },
    { 
      category: "Web Frameworks", 
      icon: Layout,
      items: ["Blazor", "Basic Angular", "ASP.NET Core", "Django REST"] 
    },
    { 
      category: "Databases", 
      icon: Database,
      items: ["MongoDB Atlas", "MySQL", "SQLite"] 
    },
    { 
      category: "Tools & DevOps", 
      icon: Server,
      items: ["Git/Bitbucket", "Jira", "AWS (Basic)", "Postman", "Linux (Ubuntu)"] 
    },
    { 
      category: "Mobile", 
      icon: Smartphone,
      items: ["Ionic", "Android (Java/XML)"] 
    }
  ],
  experience: [
    {
      id: 1,
      role: "Senior Executive Application Support",
      company: "Arkafincap",
      period: "Sep 2024 - Oct 2025",
      description: "Automated MongoDB Excel reporting via Python & MongoDB, improving reporting cadence by 50%. Enhanced Razorpay payment flows using razorpay integration with Google's Appscript and reduced incident resolution time by 20% through expert log analysis."
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
    },
    {
      id: 5,
      role: "Graduate Trainee",
      company: "Tata Consultancy Services",
      period: "Aug 2020 - Jan 2021",
      description: "Foundation in software quality assurance and support: Performed sanity testing for web applications, resolved production issues with PHP/MySQL data corrections, and utilized TortoiseSVN for version control in an agile environment."
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
      degree: "Masters of Computer Application (M.C.A.)",
      school: "Bharatiya Vidya Bhavan's Sardar Patel Institute of Tech",
      year: "Dec 2022",
      detail: "Certificate of Merit Holder (3rd Rank)"
    },
    {
      degree: "Bacthlor of Science(B.Sc.) - Computer Science ",
      school: "Vivekanand Education Society's College of Arts, Science and Commerce",
      year: "Oct 2020",
      detail: "First Class"
    }
  ]
};