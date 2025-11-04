import { Project, Experience, Certification, CaseStudy, MediumArticle } from './types';

export const portfolioData = {
  name: 'Tanmay Kalbande',
  title: 'Data Scientist & AI Enthusiast',
  about: "I build AI systems and data solutions that solve real problems. Started as a Data Analyst Trainee, now working as a Software Engineer building multi-agent AI systems at Capgemini. With 1.8 years in the field, I've shipped predictive models, customer segmentation tools, AI-powered automation, and a bunch of side projects that scratch my own itches. I love the challenge of turning messy data into insights and building tools that actually make people's work easier.",
  readme: `
# Welcome to My Portfolio OS!

This is an interactive desktop experience I built to showcase my work in a fun way.

## Features:
- **Draggable Windows:** Move things around—just like a real desktop!
- **Snapping Desktop Icons:** Drag and drop icons; they'll snap to the grid.
- **App Dock:** Quick access to my main projects and tools.
- **AI Assistant:** Ask questions about my work and experience.
- **Terminal:** For those who like the command-line approach.
- **Customization:** Play with themes and wallpapers in Settings.

I built this because I wanted my portfolio to feel less like a resume and more like an experience. Hope you enjoy exploring!
`,
  stats: {
    experience: "1.8",
    projects: 11,
    certifications: 4,
  },
  technicalSummary: [
    "1.8 years building AI systems and data solutions—from service desk automation to predictive models.",
    "Strong in Python (NumPy, Pandas, Scikit-learn, Flask) with real production experience.",
    "Hands-on with SQL (SQL Server, Spark) for data pipelines and optimization.",
    "Machine learning: Random Forest, K-Means clustering, collaborative filtering, and multi-agent AI systems.",
    "Data Visualization: Tableau dashboards that people actually use, plus Matplotlib and Seaborn.",
    "Experience with Big Data tools: Hadoop, Spark.",
    "Genuinely care about building AI that's reliable and ethical."
  ],
  tools: {
    languages: ["Python", "SQL", "R", "C"],
    databases: ["SQL Server", "Spark"],
    ides: ["PyCharm", "VS Code", "Atom", "Jupyter Notebooks"],
    bi: ["Excel", "Tableau", "PowerBI"]
  },
  skills: ["Python", "R", "SQL", "Machine Learning", "Statistical Analysis", "Data Visualization"],
  interests: ["Artificial Intelligence", "Big Data", "Natural Language Processing", "Ethical AI", "Deep Learning", "TinyML"],
  contact: {
    email: "kalbandetanmay@gmail.com",
    phone: "737-838-1494",
    linkedin: "https://www.linkedin.com/in/tanmay-kalbande",
    github: "https://github.com/tanmay-kalbande",
    medium: "https://medium.com/@tanmaykalbande",
    whatsapp: "https://wa.me/7378381494"
  },
  experience: [
    {
      role: "Software Engineer",
      company: "Capgemini",
      duration: "Apr 2024 - Present",
      duties: [
        "Developed a multi-agent AI work note formatter using Flask and AI models, transforming messy service desk notes into structured knowledge base entries—cut resolution time by 35%.",
        "Built a real-time quality assurance pipeline with dual AI agents. Watching it catch errors before they hit production is still pretty cool. Improved knowledge base reliability by 60%.",
        "Designed a knowledge generation engine that made team documentation actually accessible. Increased knowledge accessibility by 45%."
      ]
    },
    {
      role: "Data Analyst Trainee",
      company: "Rubixe",
      duration: "Nov 2022 - Dec 2023",
      duties: [
        "Built predictive maintenance models using Random Forest. Seeing equipment downtime drop by 25% made all those late nights worth it.",
        "Developed a customer segmentation system using K-Means clustering—helped the marketing team finally understand their different customer groups.",
        "Created lead scoring models with 85% accuracy. Sales team efficiency jumped 20%, and they actually thanked me for it.",
        "Built a movie recommendation system using collaborative filtering. One of my favorite projects—got to play with user ratings data and see real patterns emerge.",
        "Designed interactive Tableau dashboards that turned complex data into insights people could actually act on."
      ]
    }
  ] as Experience[],
  projects: [
    {
      category: "AI Project",
      title: "Pustakam - The AI Book Writer",
      description: "I built this because I was terrible at sticking with scattered learning resources. Pustakam generates complete, structured books on any topic while maintaining context across chapters. It's local-first for privacy and supports multiple AI models.",
      links: {
        live: "https://pustakam-ai.vercel.app/"
      },
      icon: "📚"
    },
    {
      category: "AI Project",
      title: "Ai-Tutor - Your Personal AI Tutor",
      description: "My answer to chaotic study sessions. Built around Google's Gemma, it features different AI teaching personas, context-aware quizzes, and interactive learning flowcharts. Everything I wished existed when I was cramming for exams.",
      links: {
        live: "https://ai-tutor-test-it-out-here.vercel.app/"
      },
      icon: "🎓"
    },
    {
      category: "Work Project",
      title: "Web Traffic Analysis for Conversion Rate Improvement",
      description: "Analyzed website traffic patterns using Python and Google Analytics for Zoompare.",
      contributions: ["Performed web traffic analysis to identify bottlenecks", "Implemented A/B testing frameworks", "Collaborated with engineering to prioritize optimizations"],
      links: {},
      icon: "📈"
    },
    {
      category: "Work Project",
      title: "Customer Segmentation using Clustering Analysis",
      description: "Applied K-means clustering to customer data for Rubixe. The visualizations helped the marketing team actually understand their different customer groups.",
      contributions: ["Implemented K-means clustering algorithm", "Evaluated optimal cluster count and visualized distinct segments"],
      links: {},
      icon: "👥"
    },
    {
      category: "Work Project",
      title: "Lead Quality Prediction",
      description: "Built a model to predict lead quality for the sales team at Rubixe, helping them focus on the most promising prospects.",
      links: {},
      icon: "🎯"
    },
    {
      category: "Work Project",
      title: "Movie Recommendation System",
      description: "Developed a collaborative filtering-based recommendation system for Rubixe. A fun project that got me hooked on recommendation engines.",
      links: {},
      icon: "🎬"
    },
    {
      category: "Work Project",
      title: "Sentiment Analysis of Customer Reviews",
      description: "Analyzed sentiment in customer reviews using NLP techniques for Sentix. Learned a lot about the nuances of text processing.",
      links: {},
      icon: "💬"
    },
    {
      category: "Work Project",
      title: "Predictive Maintenance System",
      description: "Worked on developing a system to predict equipment failures for TechCorp, helping reduce downtime costs.",
      links: {},
      icon: "🛠️"
    },
    {
      category: "Fun Project",
      title: "Expense Tracker",
      description: "Built this for myself first. A simple web app for tracking expenses with visualizations and CSV import/export. Actually use it daily.",
      links: {
        live: "https://expense-tail.vercel.app/",
        github: "https://github.com/tanmay-kalbande/Expense-Tracker"
      },
      icon: "💸"
    },
    {
      category: "Fun Project",
      title: "Table Extractor",
      description: "A Flask web app that extracts tables from web pages. Created it after manually copy-pasting data one too many times.",
      links: {
        live: "https://table-extractor.onrender.com/",
        github: "https://github.com/tanmay-kalbande/table-extractor-app"
      },
      icon: "📋"
    },
    {
      category: "Fun Project",
      title: "Goal Tracker",
      description: "Because I needed something to help me stay consistent. Simple, effective, and actually helps me achieve goals one day at a time.",
      links: {
        live: "https://tanmay-kalbande.github.io/Goal-Tracker/",
        github: "https://github.com/tanmay-kalbande/Goal-Tracker"
      },
      icon: "🏁"
    },
    {
      category: "Fun Project",
      title: "The Scam Master Podcast",
      description: "Started this to help people recognize and avoid scams. Exposes common fraud tactics and provides practical guidance.",
      links: {
        website: "https://the-scam-master.vercel.app/",
        instagram: "https://www.instagram.com/the_scam_master/",
        github: "https://github.com/the-scam-master/podcast_webpage"
      },
      icon: "🎙️"
    },
    {
      category: "Fun Project",
      title: "Incident Tracker",
      description: "A straightforward tool to record and track incidents. Built it for a friend's team and ended up being pretty useful.",
      links: {
        live: "https://tanmay-kalbande.github.io/Incident-Tracker/",
        github: "https://github.com/tanmay-kalbande/Incident-Tracker"
      },
      icon: "🚨"
    },
    {
      category: "AI Project",
      title: "Bias & Fairness Checker [AI]",
      description: "An AI tool I built to detect potential biases in text and suggest more inclusive language. Part of my interest in ethical AI development.",
      links: {
        live: "https://bias-checker.onrender.com/",
        github: "https://github.com/tanmay-kalbande/bias-fairness-checker"
      },
      icon: "🤖"
    },
    {
      category: "AI Project",
      title: "AI Data Structurer [AI]",
      description: "Transforms unstructured data into organized formats using AI. Made my life easier, hopefully makes yours easier too.",
      links: {
        github: "https://github.com/tanmay-kalbande/ai-data-structurer"
      },
      icon: "✨"
    },
    {
      category: "Fun Project",
      title: "Enhanced macOS Notes",
      description: "I love macOS aesthetics, so I built a web-based note-taking app that mimics it. Dark mode included, obviously.",
      links: {
        live: "https://enhanced-mac-os-notes.vercel.app/",
        github: "https://github.com/tanmay-kalbande/Enhanced-macOS-Notes"
      },
      icon: "📝"
    },
    {
      category: "Fun Project",
      title: "Life Loops - Game Edition",
      description: "Gamified my habit tracking because regular trackers were boring. Retro-styled points system keeps it fun.",
      links: {
        live: "https://life-loops-game-edition.vercel.app/",
        github: "https://github.com/tanmay-kalbande/Life-Loops---Game-Edition"
      },
      icon: "🎮"
    },
    {
      category: "Fun Project",
      title: "Jawala Vyapar",
      description: "Online phone directory for local businesses. Built it to help people in my community find services easier.",
      links: {},
      icon: "📒"
    },
    {
      category: "Fun Project",
      title: "Mindfulness App",
      description: "A simple mindfulness web app with yoga and meditation guides. I use it when I need to step away from the screen.",
      links: {
        live: "https://breathewell.vercel.app/",
        github: "https://github.com/tanmay-kalbande/Mindfulness-App"
      },
      icon: "🧘"
    },
    {
      category: "AI Project",
      title: "Report Generator [AI]",
      description: "Built this to automate repetitive reporting tasks. Captures data and generates insights for business decisions using Python and AI.",
      links: {},
      icon: "📄"
    },
    {
      category: "BI Dashboard",
      title: "Power BI: Data Wave Metrics in India",
      description: "A dashboard exploring wireless data usage and ARPU metrics in India. Includes insights into quarterly revenue and consumption trends.",
      links: {},
      icon: "📊",
      appId: 'data_wave_dashboard'
    }
  ] as Project[],
  certifications: [
    { name: "AWS Cloud Technical Essentials", issuer: "AWS", date: "Dec 2024" },
    { name: "Foundations: Data, Data, Everywhere", issuer: "Google", date: "Apr 2024" },
    { name: "Technical Support Fundamentals", issuer: "Google", date: "Dec 2023" },
    { name: "Certified Data Scientist", issuer: "IABAC", date: "Sep 2023" },
    { name: "Data Science Foundation", issuer: "IABAC", date: "Aug 2023" },
    { name: "Certified Data Scientist Certification", issuer: "DataMites™", date: "Apr 2023" },
    { name: "100 Days of Code: The Complete Python Pro Bootcamp", issuer: "London App Brewery", date: "Ongoing" },
    { name: "The Data Science Course Complete Data Science Bootcamp", issuer: "365 Data Science", date: "Ongoing" }
  ] as Certification[],
};

export const secretProjects = [
    {
      icon: "🌌",
      title: "Project Nebula",
      description: "Experimenting with GANs to create cosmic visuals from text prompts. It's my way of exploring where AI creativity meets astronomy—still very much a work in progress."
    },
    {
      icon: "🎵",
      title: "AI Music Composer",
      description: "Training an RNN on classical music to compose short MIDI melodies. More of a fun learning project than anything groundbreaking, but it's fascinating to see what patterns it picks up."
    },
    {
      icon: "📈",
      title: "Real-time Stock Anomaly Detector",
      description: "A conceptual project using unsupervised learning (thinking Isolation Forest) to spot unusual trading patterns. Currently in the 'interesting idea' phase."
    },
    {
      icon: "🤖",
      title: "TinyML Keyword Spotting",
      description: "Trying to deploy a lightweight neural network on an Arduino to recognize custom keywords. TinyML fascinates me—bringing AI to tiny devices feels like the future."
    }
];

export const caseStudies: CaseStudy[] = [
    {
        id: 'pustakam-ai-book-writer',
        title: "I Built an AI (Pustakam) That Writes Entire Books",
        subtitle: "by Tanmay Kalbande",
        date: "September 11, 2025",
        project: "Pustakam",
        snippet: "I'll be honest—Pustakam exists because I'm terrible at following through on learning projects. Picture this: I'd get excited about learning something new, bookmark fifteen articles, queue up six tutorials, download two PDFs... and three weeks later? Three browser tabs still open, half-watched videos, and exactly zero understanding. Sound familiar?",
        content: `![Pustakam Analytics Dashboard](https://cdn.jsdelivr.net/gh/continentalstorage888-ops/didactic-meme@main/Screenshot%202025-10-30%20at%2021-57-41%20Pustakam%20AI%20Book%20Generation%20Engine.png)

### The Problem
I'm terrible at following through on learning projects. I'd get excited about a new topic, bookmark fifteen articles, queue up six tutorials, and download two PDFs. Three weeks later, I'd have scattered resources, half-watched videos, and zero actual understanding. The problem wasn't a lack of information—it was that everything was inconsistent, aimed at different audiences, and lacked cohesive structure. I needed a single, perfectly tailored book for what I wanted to learn.

### My Approach
I had a simple realization: what if I could make an AI write that book? Not just a single ChatGPT dump, but a structured, coherent book with chapters that build on each other, a logical table of contents, and consistency from start to finish. This led to Pustakam, an AI-powered book generation engine.

### Challenges Faced
My initial plan to "just ask GPT to write a book" failed spectacularly. The output was rambling and repetitive. The real challenge was maintaining context across multiple API calls. Generating a full book in one go overwhelmed the AI, but breaking it up meant losing the thread between chapters.

Managing UI state during a long generation process was another headache. The app needed to show progress, handle errors, and stay responsive for several minutes while generating a roadmap, 8+ chapters, and supplementary content. TypeScript saved me here.

### Solution Architecture
After many failed attempts, I developed a four-step process:
1.  **Define the Scope:** Users specify the topic, target audience, and assumed prior knowledge.
2.  **AI Proposes a Roadmap:** The AI generates a detailed outline first. Users can validate before committing to full generation.
3.  **Sequential Generation with Memory:** The breakthrough. When generating a chapter, the AI gets a summary of preceding chapters. This "memory" maintains context.
4.  **Final Polish:** The AI writes an introduction, conclusion, and glossary based on complete content, stitched into clean Markdown.

For tech stack, I prioritized privacy and flexibility. The app is **local-first**, with all data and API keys in browser storage. No servers, no privacy concerns. It supports **multiple AI models** (Gemini, Mistral, ZhipuAI), letting users choose what works best.

### Results & Impact
Pustakam transforms a prompt into a structured, downloadable book. Features I'm proud of:
-   **Analytics Dashboard:** Post-generation metrics like reading time, complexity score, and topic breakdown.
-   **Polished Reading Experience:** I spent way too much time on typography and spacing to make it feel like a real book.
-   **Clean Markdown Export:** Universal format. You own your book.

Won't replace expert literature, but it's a powerful tool for rapidly generating structured learning resources on specific topics—solving my original problem of scattered information.

Try it: [https://pustakam-ai.vercel.app/](https://pustakam-ai.vercel.app/)
`
    },
    {
        id: 'ai-tutor-gemma',
        title: "Why I Built My Own AI Tutor Instead of Using ChatGPT",
        subtitle: "by Tanmay Kalbande",
        date: "October 19, 2025",
        project: "Ai-Tutor",
        snippet: "Honestly? I built Ai-Tutor because I was already obsessed with Gemma and wanted an excuse to use it more. But also, my study sessions were chaos: one AI chat open for explanations, another tab for generating practice questions, my notes app buried somewhere...",
        content: `![Ai-Tutor Welcome Screen](https://cdn.jsdelivr.net/gh/continentalstorage888-ops/didactic-meme@main/ai-tutot-welcome-screen.png)

### The Problem
My study workflow was pure chaos. One AI chat for explanations, another for practice questions, my notes app buried somewhere, and a dozen tabs I'd opened days ago. By the end of a session, useful information was scattered everywhere with no structure. The tools were fine, but my process was a mess. I needed a single environment to chat, generate quizzes, take notes, and visualize my learning journey.

### My Approach
I decided to build a unified learning platform around Google's Gemma model, which I found exceptionally clear for tutoring. The goal: a clean interface where you pick an AI persona and have all your learning tools in one place. This became Ai-Tutor, built over four weeks of nights and weekends.

### Challenges Faced
The **learning flowchart** was brutal to implement. Initial idea: visualize conversations as a mind map. First attempts produced messy, unreadable diagrams. Second attempt: better prompts, but still resulted in static, non-interactive SVGs.

The breakthrough: the flowchart wasn't for documentation—it was for reflection. I rebuilt it from scratch. The AI now analyzes conversations and produces a structured map of key concepts and relationships. Added an interactive canvas with zoom and pan. Finally useful.

### Solution Architecture
Ai-Tutor's core features:
-   **Gemma-centric Design:** Built to leverage Gemma's strengths, with Mistral and ZhipuAI as alternatives.
-   **AI Personas:** Four distinct teaching styles (Friendly Mentor, Exam Coach, etc.). Match the AI to your mood—it matters more than you'd think.
-   **Context-Aware Quizzes:** Analyzes your conversation history to generate questions about concepts you've been learning and struggling with. Way better than generic quiz generators.
-   **Interactive Learning Flowchart:** Visualizes your conversation as an interactive knowledge map showing how concepts connect.
-   **Local-First Persistence:** Everything saved to browser storage. Private and instant loading.

### Results & Impact
Ai-Tutor consolidates scattered workflows into one cohesive app.
-   Persona system: genuinely useful, not just a gimmick.
-   Context-aware quizzes: much more effective for testing retention.
-   Interactive flowchart: despite challenges, offers a unique way to reflect on learning structure.

The project taught me that for AI apps, UX and workflow design are as important as the model. It's a Progressive Web App (PWA), so you can install it like a native app.

Check it out: [https://ai-tutor-test-it-out-here.vercel.app/](https://ai-tutor-test-it-out-here.vercel.app/)
`
    }
];

export const mediumArticles: MediumArticle[] = [
    {
        title: "Life as a CTF Challenge: How to Hack Your Personal Growth",
        snippet: "In cybersecurity, Capture the Flag (CTF) competitions train experts to uncover hidden vulnerabilities in code—flaws that could cripple…",
        date: "January 28, 2024",
        link: "https://medium.com/@tanmaykalbande/life-as-a-ctf-challenge-how-to-hack-your-personal-growth-bc0b73069dd5"
    },
    {
        title: "The Silent Urge: Why We're All Secretly Chasing Belonging",
        snippet: "We like to pretend we don't care. We claim independence, declaring, \"I don't need anyone!\" But deep down, even the most rebellious souls…",
        date: "January 27, 2024",
        link: "https://medium.com/@tanmaykalbande/the-silent-urge-why-were-all-secretly-chasing-belonging-d6e57e0e22fe"
    },
    {
        title: "Living Fully in a World Where Time Only Moves Forward",
        snippet: "Republic Day, like all days, slips away quietly. Once gone, it becomes a memory untouchable, unchangeable. This truth about time can haunt…",
        date: "January 26, 2024",
        link: "https://medium.com/@tanmaykalbande/living-fully-in-a-world-where-time-only-moves-forward-37b128bd0e96"
    },
    {
        title: "The Power of Life's Loops: Understanding Our Daily Patterns",
        snippet: "Life is a series of repetitions. When we hear the word \"loop,\" we instantly think of actions or patterns that repeat themselves in our…",
        date: "January 21, 2024",
        link: "https://medium.com/@tanmaykalbande/the-power-of-lifes-loops-understanding-our-daily-patterns-1191b0fa19d0"
    }
];

// For Insight Engine App
export const SIMPLIFIED_DATASETS: Record<string, { name: string; data: string; description: string }> = {
    titanic: {
        name: 'Titanic Survival Data',
        description: 'A simplified dataset containing records of passengers on the Titanic, including their class, sex, age, and whether they survived.',
        data: `survived,pclass,sex,age,fare
0,3,male,22,7.25
1,1,female,38,71.28
1,3,female,26,7.92
1,1,female,35,53.1
0,3,male,35,8.05
0,3,male,,8.45
0,1,male,54,51.86
0,3,male,2,21.07
1,3,female,27,11.13
1,2,female,14,30.07
1,3,female,4,16.7
1,1,female,58,26.55
0,3,male,20,8.05
0,3,male,39,31.27
0,3,female,14,7.85
1,2,female,55,16.0
0,3,male,2,29.12
1,2,male,,13.0
0,3,female,31,18.0
1,3,female,,7.22`
    },
    indian_startups: {
        name: 'Indian Startup Funding',
        description: 'A simplified dataset of startup funding in India, including the industry, city, investment type, and funding amount in USD.',
        data: `Industry_Vertical,City,Investment_Type,Amount_in_USD
EdTech,Bangalore,Pre-series A,250000
Hygiene,Pune,Seed,100000
FinTech,Bangalore,Seed,420000
Transport,Bangalore,Seed,100000
AI,San Francisco,Series A,5000000
E-commerce,Bangalore,Seed,1500000
AI,Bangalore,Seed,1800000
Food & Beverage,Bangalore,Seed,100000
EdTech,Gurugram,Seed,150000
Food,Bangalore,Pre-series A,1000000
Consumer Internet,Gurugram,Seed,2800000
EdTech,Bangalore,Seed,500000
IT,Bangalore,Seed,100000
Logistics,Bangalore,Seed,100000
Healthcare,Bangalore,Pre-series A,2000000
EdTech,Bangalore,Pre-series A,1300000
FinTech,Mumbai,Seed,1000000
Logistics,Bangalore,Seed,2000000
E-commerce,Bangalore,Seed,500000
Consumer Goods,Gurugram,Seed,500000`
    }
};
