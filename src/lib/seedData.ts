import {
  ProfileData,
  ResumeCategory,
  Publication,
  Project,
  Award,
  GalleryCategory,
  GalleryItem,
  SiteConfig,
  ContactMessage,
} from "@/types";

export const initialProfile: ProfileData = {
  name: "Farhan Labib",
  tagline: "Research Scholar | Power Electronics & Embedded Systems",
  titles: [
    "Research Scholar",
    "Founder & CTO: Edu-Explorer",
    "Graduate Student at RUET: ETE",
  ],
  bio: "I am a passionate researcher in power electronics and leader in robotics, web development, and hardware design, received a B.Sc. in ETE from RUET. As the Founder and CTO of Edu-Explorer, I develop cutting-edge educational technology, simultaneously contributing to STEMx365, Team Crack Platoon, and other organizations on innovative projects and social development. With numerous achievements, publications, along with a passion for singing, I strive to use my skills for positive global impact.",
  highlights: [
    {
      id: "hl-1",
      phrase: "power electronics",
      subItems: [
        { id: "sub-1", label: "DSP Processors", url: "https://scholar.google.com" },
        { id: "sub-2", label: "Multilevel Inverters", url: "https://scholar.google.com" },
        { id: "sub-3", label: "Modulation Techniques", url: "https://scholar.google.com" },
        { id: "sub-4", label: "Electrical Machines & Drives", url: "https://scholar.google.com" },
        { id: "sub-5", label: "Switched-Capacitor Converters", url: "https://scholar.google.com" },
      ],
    },
    {
      id: "hl-2",
      phrase: "robotics",
      subItems: [
        { id: "sub-6", label: "Autonomous Mobile Robots", url: "/projects" },
        { id: "sub-7", label: "WRO World Finalist", url: "/awards" },
        { id: "sub-8", label: "ROS & Micro-ROS Architecture", url: "/projects" },
      ],
    },
    {
      id: "hl-3",
      phrase: "web development",
      subItems: [
        { id: "sub-9", label: "Next.js & React Architectures", url: "/projects" },
        { id: "sub-10", label: "Cloud-Native Platforms", url: "/projects" },
        { id: "sub-11", label: "Edu-Tech Learning Portals", url: "/projects" },
      ],
    },
    {
      id: "hl-4",
      phrase: "hardware design",
      subItems: [
        { id: "sub-12", label: "High-Speed PCB Design", url: "/projects" },
        { id: "sub-13", label: "GaN/SiC Power Stages", url: "/projects" },
        { id: "sub-14", label: "Embedded DSP & FPGA", url: "/projects" },
      ],
    },
    {
      id: "hl-5",
      phrase: "Edu-Explorer",
      url: "https://edu-explorer.org",
      subItems: [
        { id: "sub-15", label: "CTO & Co-Founder", url: "https://edu-explorer.org" },
        { id: "sub-16", label: "STEM Kits for 10k+ Students", url: "https://edu-explorer.org" },
      ],
    },
    {
      id: "hl-6",
      phrase: "STEMx365",
      url: "https://stemx365.org",
      subItems: [
        { id: "sub-17", label: "Lead stemXpert", url: "https://stemx365.org" },
      ],
    },
    {
      id: "hl-7",
      phrase: "Team Crack Platoon",
      subItems: [
        { id: "sub-18", label: "Robotics Core Lead", url: "/awards" },
        { id: "sub-19", label: "Formula SAE Team Collaborator", url: "/awards" },
      ],
    },
    {
      id: "hl-8",
      phrase: "social development",
      subItems: [
        { id: "sub-20", label: "Underprivileged STEM Outreach", url: "/gallery" },
        { id: "sub-21", label: "Community Tech Mentorship", url: "/gallery" },
      ],
    },
    {
      id: "hl-9",
      phrase: "achievements",
      url: "/awards",
      subItems: [
        { id: "sub-22", label: "WRO Silver Medal 2025", url: "/awards" },
        { id: "sub-23", label: "IEEE Best Paper Recognition", url: "/publications" },
      ],
    },
    {
      id: "hl-10",
      phrase: "publications",
      url: "/publications",
      subItems: [
        { id: "sub-24", label: "IEEE Transactions on Industry Applications", url: "/publications" },
        { id: "sub-25", label: "300+ Current Citations", url: "/publications" },
      ],
    },
    {
      id: "hl-11",
      phrase: "singing",
      subItems: [
        { id: "sub-26", label: "Classical & Contemporary Vocalist", url: "/gallery" },
      ],
    },
  ],
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
  secondaryImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85",
  googleScholarUrl: "https://scholar.google.com",
  currentCitations: 300,
  stats: [
    { label: "Citations", value: "300+" },
    { label: "Publications", value: "15+" },
    { label: "Awards & Honors", value: "12" },
    { label: "Years Research", value: "3+" },
  ],
};

export const initialResumeCategories: ResumeCategory[] = [
  {
    id: "cat-1",
    name: "Experience",
    slug: "experience",
    order: 1,
    subtitle: "Research & Professional Track Record",
    summary:
      "I have a robust 3-year research background (Power Electronics), and also specialize in robotics, and web development, with substantial expertise in hardware design and software simulation. As the Founder and CTO of Edu-Explorer and lead stemXpert at STEMx365, I specialize in developing STEM based educational platforms. Additionally, I have gained valuable experience through multiple industrial trainee positions.",
    items: [
      {
        id: "exp-1",
        title: "Research Assistant",
        organization: "RUET - SPB Research Group",
        period: "2022 - Present",
        location: "Rajshahi, Bangladesh",
        description:
          "Conducting advanced research on transformerless multilevel inverters, switched-capacitor converters, and grid-tied solar photovoltaic interfacing. Leading hardware-in-the-loop (HIL) testing and DSP controller implementation.",
        tags: ["Power Electronics", "MATLAB/Simulink", "DSP TMS320F28379D", "PV Systems"],
        link: "https://scholar.google.com",
      },
      {
        id: "exp-2",
        title: "Founder & Chief Technology Officer (CTO)",
        organization: "Edu-Explorer",
        period: "2021 - Present",
        location: "Dhaka, Bangladesh",
        description:
          "Architected digital STEM education platforms and interactive hardware learning toolkits reaching 10,000+ students nationwide. Directed engineering teams across embedded firmware and cloud platforms.",
        tags: ["EdTech", "Hardware Architecture", "Full-Stack Development", "Leadership"],
        link: "https://edu-explorer.org",
      },
      {
        id: "exp-3",
        title: "Lead stemXpert & Robotics Mentor",
        organization: "STEMx365",
        period: "2022 - 2024",
        location: "Dhaka, Bangladesh",
        description:
          "Mentored elite student robotics teams for international competitions, including coaching the Bangladesh national team for World Robot Olympiad (WRO) Singapore.",
        tags: ["Robotics", "Micro-ROS", "WRO Coach", "STEM Outreach"],
      },
      {
        id: "exp-4",
        title: "Industrial Trainee Engineer",
        organization: "Atomic Energy Research Establishment (AERE)",
        period: "2023",
        location: "Savar, Dhaka",
        description:
          "Completed comprehensive industrial training on high-voltage power distribution, industrial instrumentation, and automated telemetry systems.",
        tags: ["Industrial Automation", "SCADA", "Power Distribution"],
      },
    ],
  },
  {
    id: "cat-2",
    name: "Education",
    slug: "education",
    order: 2,
    subtitle: "Academic Degrees & Foundations",
    summary: "Academic training grounded in Electronics and Telecommunication Engineering with strong mathematical and computational rigor.",
    items: [
      {
        id: "edu-1",
        title: "B.Sc. in Electronics & Telecommunication Engineering (ETE)",
        organization: "Rajshahi University of Engineering & Technology (RUET)",
        period: "2019 - 2024",
        location: "Rajshahi, Bangladesh",
        description:
          "Graduated with Distinction. Major focus in Power Electronics, Embedded Systems, Signal Processing, and Control Engineering. Undergraduate Thesis: Design & Hardware Verification of High-Efficiency Switched-Capacitor Multilevel Inverters.",
        tags: ["Power Systems", "Signal Processing", "FPGA & DSP", "Control Systems"],
      },
      {
        id: "edu-2",
        title: "Higher Secondary Certificate (HSC) - Science",
        organization: "Notre Dame College, Dhaka",
        period: "2016 - 2018",
        location: "Dhaka, Bangladesh",
        description: "GPA 5.00/5.00. Active member of Notre Dame Science Club and International Mathematical Olympiad training circle.",
        tags: ["Physics", "Higher Mathematics", "Chemistry"],
      },
    ],
  },
  {
    id: "cat-3",
    name: "Skills",
    slug: "skills",
    order: 3,
    subtitle: "Technical & Engineering Toolset",
    summary: "Multidisciplinary proficiency bridging theoretical converter design, rapid PCB prototyping, firmware, and modern web software.",
    items: [
      {
        id: "skl-1",
        title: "Power Electronics & Hardware Design",
        organization: "Core Competency",
        period: "Extensive",
        description:
          "Multilevel Inverters (MLI), Switched-Capacitor Converters, DC-DC Boost, Single-Carrier & Multi-Carrier PWM, Altium Designer, KiCAD, High-Speed PCB Layout, Thermal Management, GaN/SiC FET Gate Drivers.",
        tags: ["Altium Designer", "KiCAD", "MATLAB / Simulink", "PLECS", "LTspice"],
      },
      {
        id: "skl-2",
        title: "Embedded Systems & DSP Controllers",
        organization: "Hardware & Firmware",
        period: "Extensive",
        description:
          "TI C2000 DSPs (TMS320F28379D, F280049C), STM32 ARM Cortex-M4/M7, ESP32, FreeRTOS, Embedded C/C++, SPI/I2C/CAN bus protocols, HIL Simulation.",
        tags: ["TI C2000", "STM32", "Embedded C++", "CAN Bus", "FreeRTOS"],
      },
      {
        id: "skl-3",
        title: "Software & Web Engineering",
        organization: "Full-Stack Development",
        period: "Extensive",
        description:
          "Next.js, React, TypeScript, Node.js, Python, Tailwind CSS, MongoDB, RESTful APIs, Git, Docker, Linux systems administration.",
        tags: ["Next.js", "TypeScript", "Python", "Tailwind CSS", "MongoDB"],
      },
    ],
  },
  {
    id: "cat-4",
    name: "Reviewer",
    slug: "reviewer",
    order: 4,
    subtitle: "Peer Review & Scholarly Contributions",
    summary: "Serving the global academic community through rigorous peer review for premier IEEE journals and international conferences.",
    items: [
      {
        id: "rev-1",
        title: "Manuscript Reviewer",
        organization: "IEEE Transactions on Industry Applications (TIA)",
        period: "2024 - Present",
        description: "Reviewed papers on multilevel inverter topologies, grid synchronization, and modulation methods.",
        tags: ["IEEE TIA", "Peer Review"],
      },
      {
        id: "rev-2",
        title: "Technical Reviewer",
        organization: "IEEE International Conference on Power Electronics (ICPE)",
        period: "2023 - Present",
        description: "Evaluated conference submissions on renewable energy conversion and distributed generation.",
        tags: ["Conference Reviewer", "IEEE"],
      },
    ],
  },
  {
    id: "cat-5",
    name: "Volunteering",
    slug: "volunteering",
    order: 5,
    subtitle: "Social Impact & Community Leadership",
    summary: "Empowering underrepresented youths through hands-on technology workshops, open science education, and community mentoring.",
    items: [
      {
        id: "vol-1",
        title: "Volunteer Mentor & Workshop Lead",
        organization: "National STEM Outreach Initiative",
        period: "2022 - Present",
        description:
          "Organized free robotics and science camps for over 2,000 rural students, introducing basic electronics, microcontrollers, and scientific inquiry.",
        tags: ["STEM For All", "Community Outreach", "Youth Mentorship"],
      },
      {
        id: "vol-2",
        title: "Technical Coordinator",
        organization: "IEEE RUET Student Branch",
        period: "2021 - 2023",
        description:
          "Chaired technical symposiums, hackathons, and research webinars connecting undergraduates with international faculty.",
        tags: ["IEEE Student Branch", "Event Leadership"],
      },
    ],
  },
  {
    id: "cat-6",
    name: "Research Interest",
    slug: "research-interest",
    order: 6,
    subtitle: "Core Research Domains & Future Directions",
    summary: "Investigating next-generation power electronics architectures for decarbonized energy systems, electric mobility, and grid intelligence.",
    items: [
      {
        id: "ri-1",
        title: "Switched-Capacitor Multilevel Inverters (SC-MLI)",
        organization: "Topology & Modulation",
        period: "Ongoing",
        description:
          "Developing self-balanced switched-capacitor structures with high voltage gain, reduced component counts, and low Total Harmonic Distortion (THD) for transformerless photovoltaic systems.",
        tags: ["Transformerless Inverters", "Capacitor Voltage Balancing", "High Efficiency"],
      },
      {
        id: "ri-2",
        title: "Wide Bandgap (GaN/SiC) Power Conversion",
        organization: "Advanced Semiconductors",
        period: "Ongoing",
        description:
          "Exploring ultra-high switching frequency converters utilizing Gallium Nitride and Silicon Carbide devices for extreme power density in electric vehicle onboard chargers.",
        tags: ["GaN FETs", "SiC MOSFETs", "Power Density"],
      },
      {
        id: "ri-3",
        title: "Grid-Tied Renewable Interfacing & Microgrids",
        organization: "Renewable Integration",
        period: "Ongoing",
        description:
          "Research on Phase-Locked Loops (PLL), low-voltage ride-through (LVRT) controls, and reactive power injection for grid stability during transient faults.",
        tags: ["Microgrids", "PLL", "Grid Synchronization"],
      },
    ],
  },
  {
    id: "cat-7",
    name: "Membership & Licenses",
    slug: "membership-licenses",
    order: 7,
    subtitle: "Professional Affiliations",
    summary: "Active member of leading engineering bodies and technical societies.",
    items: [
      {
        id: "mem-1",
        title: "Graduate Student Member",
        organization: "IEEE (Institute of Electrical and Electronics Engineers)",
        period: "2020 - Present",
        description: "Member of IEEE Power Electronics Society (PELS) and IEEE Industrial Electronics Society (IES).",
        tags: ["IEEE Member", "IEEE PELS", "IEEE IES"],
      },
      {
        id: "mem-2",
        title: "Associate Member",
        organization: "Institution of Engineers, Bangladesh (IEB)",
        period: "2024 - Present",
        description: "Accredited professional engineering affiliation.",
        tags: ["IEB Bangladesh"],
      },
    ],
  },
  {
    id: "cat-8",
    name: "About Me",
    slug: "about-me",
    order: 8,
    subtitle: "Philosophy & Personal Interests",
    summary: "Beyond engineering labs and circuit simulators, I am deeply inspired by music, storytelling, and humanitarian engineering.",
    items: [
      {
        id: "ab-1",
        title: "Vocalist & Musical Journey",
        organization: "Passion & Arts",
        period: "Lifelong",
        description:
          "Trained in classical and semi-classical Indian music. Regular performer at cultural festivals, finding harmony and creative rejuvenation through musical expression.",
        tags: ["Music", "Vocals", "Creativity"],
      },
      {
        id: "ab-2",
        title: "Tech Evangelism & Writing",
        organization: "Science Communication",
        period: "2021 - Present",
        description:
          "Writing accessible technical articles and breakdown guides on power electronics, motor control, and embedded programming for aspiring engineers.",
        tags: ["Blogging", "Science Communication", "Open Source"],
      },
    ],
  },
];

export const initialPublications: Publication[] = [
  {
    id: "pub-1",
    title:
      "A Compact Generalized Switched-Capacitor MLI with a Modified Single-Carrier PWM Scheme for Transformerless PV Interfacing",
    authors: "F. Labib, S. P. Biswas, M. R. Islam, R. Shah and K. M. Muttaqi",
    publishedIn: "IEEE Transactions on Industry Applications",
    year: 2025,
    doi: "10.1109/TIA.2025.3609732",
    url: "https://doi.org/10.1109/TIA.2025.3609732",
    citationCount: 45,
    abstract:
      "This paper proposes a novel compact generalized switched-capacitor multilevel inverter (SC-MLI) topology tailored for transformerless photovoltaic systems. The architecture achieves inherent capacitor self-balancing while substantially reducing switch count, total standing voltage (TSV), and leakage currents. A modified single-carrier PWM scheme is derived to minimize switching losses and ensure seamless grid integration with reactive power compensation.",
    featured: true,
    figures: [
      {
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
        caption: "Fig. 1. Generalized circuit topology and switching cell configuration of the proposed SC-MLI.",
      },
      {
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85",
        caption: "Fig. 2. Hardware prototype test bench with DSP TMS320F28379D and isolated gate drivers.",
      },
      {
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85",
        caption: "Fig. 3. Steady-state experimental output voltage and grid current waveforms at 1.2 kW output power.",
      },
      {
        url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=85",
        caption: "Fig. 4. Power loss breakdown and comparative thermal distribution analysis across operating power stages.",
      },
    ],
  },
  {
    id: "pub-2",
    title:
      "Experimental Validation of a High-Gain Multi-Level Inverter for Distributed Solar Energy Harvesting",
    authors: "F. Labib, S. P. Biswas, A. K. Das",
    publishedIn: "IEEE Journal of Emerging and Selected Topics in Power Electronics (JESTPE)",
    year: 2024,
    doi: "10.1109/JESTPE.2024.3129841",
    url: "https://doi.org",
    citationCount: 38,
    abstract:
      "A high-gain transformerless inverter topology capable of boosting low input DC voltage to peak grid requirements without auxiliary magnetic components. Complete mathematical modeling, loss analysis, and experimental confirmation on a 1.0 kW prototype are presented.",
    featured: true,
    figures: [
      {
        url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=85",
        caption: "Fig. 1. Laboratory experimental setup with 3-phase induction motor load and digital power analyzer.",
      },
    ],
  },
  {
    id: "pub-3",
    title:
      "Fault-Tolerant Control and Redundant Switching in Switched-Capacitor Based Power Converters",
    authors: "F. Labib, R. Hasan, S. P. Biswas",
    publishedIn: "IEEE Transactions on Power Electronics",
    year: 2024,
    doi: "10.1109/TPEL.2024.3411092",
    url: "https://doi.org",
    citationCount: 62,
    abstract:
      "Investigates fault diagnostic techniques and seamless reconfigurable modulation strategies during open-circuit and short-circuit switch failures in switched-capacitor converters.",
    featured: false,
    figures: [
      {
        url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=85",
        caption: "Fig. 1. Fault transition dynamics and automated state reconfiguration oscilloscope captures.",
      },
    ],
  },
];

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "High-Efficiency 13-Level Switched-Capacitor Inverter Prototype",
    slug: "13-level-sc-inverter",
    subtitle: "Complete Hardware & DSP Control System for Transformerless PV Systems",
    summary:
      "Engineered a fully functional 13-level switched capacitor power inverter featuring hardware-level capacitor self-balancing, custom gate driver boards, and TMS320F28379D DSP real-time modulation.",
    thumbnail:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85",
    category: "Power Electronics",
    tags: ["Power Electronics", "PCB Design", "DSP TMS320F28379D", "Altium", "PV Systems"],
    demoUrl: "https://scholar.google.com",
    githubUrl: "https://github.com",
    featured: true,
    createdAt: "2024-11-15",
    blocks: [
      {
        id: "b-1",
        type: "title",
        content: "Project Overview & Hardware Architecture",
        highlight: true,
      },
      {
        id: "b-2",
        type: "text",
        content:
          "This project tackles the critical efficiency and cost bottlenecks of conventional transformerless solar photovoltaic converters. By integrating switched-capacitor charging loops directly into the H-bridge output stage, the inverter generates 13 distinct voltage levels from a single 48V DC bus while boosting the output voltage 6x without heavy magnetic transformers.",
      },
      {
        id: "b-3",
        type: "image",
        content:
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85",
        caption:
          "Custom 4-layer power stage PCB with GaN power transistors, isolated optical drivers, and current sensing telemetry.",
      },
      {
        id: "b-4",
        type: "subtitle",
        content: "Experimental Bench & Motor Drive Testing",
        highlight: false,
      },
      {
        id: "b-5",
        type: "text",
        content:
          "The converter was rigorously tested in the RUET Power Electronics Laboratory under varied inductive, resistive, and dynamic motor loads. Total Harmonic Distortion (THD) measured under 1.8% at full rated power.",
      },
      {
        id: "b-6",
        type: "video",
        content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        caption: "Live hardware demonstration of output voltage switching and load step-response.",
      },
    ],
  },
  {
    id: "proj-2",
    title: "Edu-Explorer STEM Learning Platform & Smart Hardware Kits",
    slug: "edu-explorer-stem",
    subtitle: "Cloud-Connected STEM Portal & Microcontroller Hardware for 10k+ Students",
    summary:
      "Designed and deployed a full-stack educational ecosystem combining interactive drag-and-drop programming with custom-designed hardware boards for K-12 robotics education.",
    thumbnail:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85",
    category: "Full Stack & IoT",
    tags: ["Next.js", "ESP32", "EdTech", "IoT", "Embedded C++"],
    demoUrl: "https://edu-explorer.org",
    githubUrl: "https://github.com",
    featured: true,
    createdAt: "2024-08-20",
    blocks: [
      {
        id: "b-201",
        type: "title",
        content: "Empowering Next-Gen Innovators",
        highlight: true,
      },
      {
        id: "b-202",
        type: "text",
        content:
          "Edu-Explorer bridges the digital-physical divide in STEM learning. As CTO, I led the development of both the web-based simulation platform and our plug-and-play STEM microcontroller boards with integrated sensors and wireless Bluetooth/WiFi communication.",
      },
      {
        id: "b-203",
        type: "image",
        content:
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85",
        caption: "Students conducting hands-on programming workshops with Edu-Explorer hardware kits.",
      },
    ],
  },
  {
    id: "proj-3",
    title: "Autonomous Navigation Robot for World Robot Olympiad",
    slug: "wro-autonomous-robot",
    subtitle: "Computer Vision & LiDAR-Equipped Mobile Platform",
    summary:
      "Built a high-precision autonomous rover utilizing LiDAR, OpenCV vision pipeline, and custom kinematic controllers, earning the Silver Medal at WRO Singapore.",
    thumbnail:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=85",
    category: "Robotics",
    tags: ["Robotics", "ROS", "Computer Vision", "LiDAR", "Embedded C++"],
    demoUrl: "/awards",
    featured: true,
    createdAt: "2024-05-10",
    blocks: [
      {
        id: "b-301",
        type: "title",
        content: "Real-Time Sensor Fusion & Path Planning",
        highlight: true,
      },
      {
        id: "b-302",
        type: "text",
        content:
          "Integrated 2D LiDAR with stereo depth cameras to compute real-time obstacle avoidance and sub-centimeter waypoint navigation on resource-constrained microcontrollers.",
      },
      {
        id: "b-303",
        type: "image",
        content:
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=85",
        caption: "Autonomous robot chassis during competition field trials.",
      },
    ],
  },
];

export const initialAwards: Award[] = [
  {
    id: "award-1",
    title: "Silver Medal - World Robot Olympiad (WRO) 2025, Singapore",
    issuedDate: "Nov 2025",
    issuedBy: "World Robot Olympiad Association / Space Faculty Singapore",
    description:
      "Served as Team Coach for SORA Labs Bangladesh in the Future Innovators / Senior Category at the WRO International Final 2025 in Singapore, securing the Silver Medal among 90+ participating nations.",
    certificateUrl:
      "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&w=1200&q=85",
    thumbnail:
      "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&w=1200&q=85",
    badgeText: "WRO Silver Medalist",
    link: "https://wro-association.org",
  },
  {
    id: "award-2",
    title: "Best Paper Award - IEEE International Conference on Industrial Technology",
    issuedDate: "Aug 2024",
    issuedBy: "IEEE Industrial Electronics Society (IES)",
    description:
      "Awarded for exceptional research originality and experimental rigor on transformerless multi-carrier switched-capacitor converters.",
    certificateUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=85",
    thumbnail:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=85",
    badgeText: "IEEE Best Paper",
    link: "https://ieee.org",
  },
  {
    id: "award-3",
    title: "Champion - National Hackathon on Renewable Energy Solutions",
    issuedDate: "Mar 2023",
    issuedBy: "Ministry of Power, Energy and Mineral Resources & ICT Division",
    description:
      "Ranked 1st nationwide for presenting an intelligent decentralized micro-inverter monitoring system with predictive maintenance telemetry.",
    badgeText: "National Champion",
  },
  {
    id: "award-4",
    title: "Dean's Excellence Award",
    issuedDate: "Jan 2024",
    issuedBy: "Faculty of EEE, RUET",
    description: "Conferred for outstanding academic standing and undergraduate research leadership.",
    badgeText: "Academic Excellence",
  },
];

export const initialGalleryCategories: GalleryCategory[] = [
  { id: "gal-cat-1", name: "All", slug: "all" },
  { id: "gal-cat-2", name: "Research & Lab", slug: "research" },
  { id: "gal-cat-3", name: "Robotics & WRO", slug: "robotics" },
  { id: "gal-cat-4", name: "STEM Outreach", slug: "outreach" },
  { id: "gal-cat-5", name: "Conferences & Awards", slug: "awards" },
  { id: "gal-cat-6", name: "Life & Music", slug: "life" },
];

export const initialGallery: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Hardware Inverter Lab Bench Testing",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85",
    caption:
      "Calibrating multi-channel digital oscilloscopes and current probes on our switched-capacitor inverter prototype at RUET Power Lab.",
    categories: ["research"],
    date: "2024-10-12",
  },
  {
    id: "gal-2",
    title: "WRO 2025 Singapore Silver Medal Podium",
    imageUrl:
      "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&w=1200&q=85",
    caption:
      "Celebrating on stage with Team SORA Labs Bangladesh after winning the Silver Medal at the World Robot Olympiad Finals.",
    categories: ["robotics", "awards"],
    date: "2025-11-20",
  },
  {
    id: "gal-3",
    title: "Rural High School STEM Workshop",
    imageUrl:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85",
    caption:
      "Guiding young students through their very first microcontroller sensor circuit during Edu-Explorer's rural outreach tour.",
    categories: ["outreach"],
    date: "2024-03-15",
  },
  {
    id: "gal-4",
    title: "Presenting at IEEE International Conference",
    imageUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=85",
    caption:
      "Delivering the technical paper presentation on single-carrier modulation techniques to international power engineering delegates.",
    categories: ["research", "awards"],
    date: "2024-08-05",
  },
  {
    id: "gal-5",
    title: "Autonomous Rover Field Navigation",
    imageUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=85",
    caption: "Debugging LiDAR SLAM maps and motor feedback loops during arena testing.",
    categories: ["robotics"],
    date: "2024-04-18",
  },
  {
    id: "gal-6",
    title: "Acoustic Music & Cultural Evening",
    imageUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85",
    caption: "Performing vocal music at the annual university cultural gala.",
    categories: ["life"],
    date: "2023-12-28",
  },
];

export const initialSiteConfig: SiteConfig = {
  siteName: "Farhan Labib",
  primaryAccent: "#086972",
  googleScholarUrl: "https://scholar.google.com",
  emails: [
    "farhan.ete.ruet@gmail.com",
    "contact@farhanlabib.me",
    "cto@edu-explorer.org",
  ],
  phoneNumbers: [
    "+880 1700-000000",
    "+880 1800-000000",
  ],
  addresses: [
    "SPB Research Group, Dept. of ETE, RUET, Rajshahi-6204, Bangladesh",
    "Edu-Explorer Tech Hub, Mirpur-10, Dhaka-1216, Bangladesh",
  ],
  socialLinks: [
    {
      id: "soc-1",
      platform: "Google Scholar",
      url: "https://scholar.google.com",
      iconName: "GraduationCap",
      color: "#086972",
    },
    {
      id: "soc-2",
      platform: "GitHub",
      url: "https://github.com",
      iconName: "Github",
      color: "#68b6c4",
    },
    {
      id: "soc-3",
      platform: "LinkedIn",
      url: "https://linkedin.com",
      iconName: "Linkedin",
      color: "#086972",
    },
    {
      id: "soc-4",
      platform: "ResearchGate",
      url: "https://researchgate.net",
      iconName: "BookOpen",
      color: "#68b6c4",
    },
    {
      id: "soc-5",
      platform: "Facebook",
      url: "https://facebook.com",
      iconName: "Facebook",
      color: "#1877f2",
    },
    {
      id: "soc-6",
      platform: "X (Twitter)",
      url: "https://x.com",
      iconName: "Twitter",
      color: "#e2e8f0",
    },
    {
      id: "soc-7",
      platform: "YouTube",
      url: "https://youtube.com",
      iconName: "Youtube",
      color: "#ff0000",
    },
  ],
  footerText: "© 2026 Farhan Labib. Built with Next.js, TypeScript & Passion for Innovation.",
};

export const initialMessages: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Dr. Alexander Wright",
    email: "a.wright@stanford.edu",
    subject: "Collaboration Inquiry: Switched-Capacitor Inverter Research",
    message:
      "Dear Farhan, I read your latest IEEE Transactions publication on the modified single-carrier PWM scheme. Our power laboratory is very interested in discussing potential research collaboration.",
    read: false,
    createdAt: "2026-08-30T10:14:00Z",
  },
  {
    id: "msg-2",
    name: "Tanvir Ahmed",
    email: "tanvir@roboticsbd.com",
    subject: "WRO Mentorship Invitation",
    message:
      "Congratulations on the Silver Medal at WRO Singapore! We would love to invite you as a keynote guest speaker for the upcoming National Robotics Festival.",
    read: true,
    createdAt: "2026-08-25T16:20:00Z",
  },
];
