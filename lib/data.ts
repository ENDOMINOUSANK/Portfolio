import { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'ankitsneh03@gmail.com',

    emailSubject: "Let's collaborate on an AI/ML project",
    emailBody: 'Hi Ankit, I am reaching out to you because...',

    linkedIn: 'https://www.linkedin.com/in/ankitsneh/',
    github: 'https://github.com/ankitsneh',
    linktree: 'https://linktr.ee/ankitsneh',
};

export const SOCIAL_LINKS = [
    { name: 'linkedin', url: 'https://www.linkedin.com/in/ankitsneh/' },
];

export const MY_STACK = {
    'AI/ML': [
        {
            name: 'Python',
            icon: '/logo/python.svg',
        },
        {
            name: 'TensorFlow',
            icon: '/logo/tensorflow.svg',
        },
        {
            name: 'PyTorch',
            icon: '/logo/pytorch.svg',
        },
        {
            name: 'LangChain',
            icon: '/logo/langchain.svg',
        },
        {
            name: 'PaddleOCR',
            icon: '/logo/paddleocr.svg',
        },
        {
            name: 'Computer Vision',
            icon: '/logo/opencv.svg',
        },
        {
            name: 'Speech Synthesis',
            icon: '/logo/speech.svg',
        },
        {
            name: 'Large Scale ML',
            icon: '/logo/distributed.svg',
        },
    ],
    'DevOps/Cloud': [
        {
            name: 'Docker',
            icon: '/logo/docker.svg',
        },
        {
            name: 'Kubernetes',
            icon: '/logo/kubernetes.svg',
        },
        {
            name: 'AWS',
            icon: '/logo/aws.png',
        },
        {
            name: 'GCP',
            icon: '/logo/gcp.svg',
        },
        {
            name: 'Linux',
            icon: '/logo/linux.svg',
        },
        {
            name: 'Terraform',
            icon: '/logo/terraform.svg',
        },
        {
            name: 'Helm',
            icon: '/logo/helm.svg',
        },
        {
            name: 'Git',
            icon: '/logo/git.png',
        },
    ],
    Backend: [
        {
            name: 'FastAPI',
            icon: '/logo/fastapi.svg',
        },
        {
            name: 'SQLAlchemy',
            icon: '/logo/sqlalchemy.svg',
        },
        {
            name: 'Node.js',
            icon: '/logo/node.svg',
        },
    ],
    Database: [
        {
            name: 'PostgreSQL',
            icon: '/logo/postgreSQL.png',
        },
        {
            name: 'MongoDB',
            icon: '/logo/mongodb.svg',
        },
        {
            name: 'MariaDB',
            icon: '/logo/mariadb.svg',
        },
        {
            name: 'TimescaleDB',
            icon: '/logo/timescaledb.svg',
        },
    ],
};

// export const PROJECTS: IProject[] = [
//     {
//         title: 'AI Industrial Pipeline',
//         slug: 'ai-industrial-pipeline',
//         liveUrl: '#',
//         year: 2025,
//         description: `
//       An integrated AI pipeline for industrial factory environments combining deep learning vision models, LLMs, and multimodal AI. <br/> <br/>
      
//       Key Features:<br/>
//       <ul>
//         <li>🤖 Multi-Model Integration: Deep learning vision, LLMs, SLMs, and multimodal AI</li>
//         <li>⚡ Real-Time Processing: Async-first architecture for high-throughput inference</li>
//         <li>📊 PaddleOCR Integration: Intelligent text extraction from industrial machines</li>
//         <li>🔄 LangChain Orchestration: Complex AI workflow management</li>
//         <li>📱 Streamlit Interfaces: Cross-team collaboration dashboards</li>
//       </ul><br/>
      
//       Technical Highlights:
//       <ul>
//         <li>Designed async-first architecture for real-time decision-making in production</li>
//         <li>Built robust preprocessing pipeline for diverse text formats</li>
//         <li>Developed interactive GUIs for ML model interaction and data visualization</li>
//         <li>Achieved reliable extraction under varying industrial conditions</li>
//       </ul>
//       `,
//         role: `
//       MLOps & Backend Developer <br/>
//       Owned the entire ML pipeline deployment:
//       <ul>
//         <li>✅ AI Integration: Combined vision models, LLMs, SLMs with LangChain</li>
//         <li>🏭 On-Site Deployment: Managed production deployment in factory environment</li>
//         <li>⚡ Performance: Designed async architecture for high-throughput inference</li>
//         <li>🖥️ Interfaces: Built Streamlit dashboards for cross-team collaboration</li>
//         <li>📝 OCR Pipeline: Integrated PaddleOCR for automated text extraction</li>
//       </ul>
//       `,
//         techStack: [
//             'Python',
//             'TensorFlow',
//             'LangChain',
//             'PaddleOCR',
//             'Streamlit',
//             'Docker',
//         ],
//         thumbnail: '/projects/thumbnail/ai-pipeline.webp',
//         longThumbnail: '/projects/long/ai-pipeline.webp',
//         images: [
//             '/projects/images/ai-pipeline-1.webp',
//             '/projects/images/ai-pipeline-2.webp',
//         ],
//     },
//     {
//         title: 'Workflow Management System',
//         slug: 'workflow-management',
//         techStack: [
//             'Python',
//             'Flask',
//             'SQLAlchemy',
//             'Socket.IO',
//             'PostgreSQL',
//             'Docker',
//         ],
//         thumbnail: '/projects/thumbnail/workflow-system.webp',
//         longThumbnail: '/projects/long/workflow-system.webp',
//         images: [
//             '/projects/images/workflow-1.webp',
//             '/projects/images/workflow-2.webp',
//         ],
//         liveUrl: '#',
//         year: 2024,
//         description: `A scalable workflow management system handling over 20,000 records monthly with event-driven asynchronous processing for real-time updates.<br/><br/>

//         Key Achievements:<br/>
//         <ul>
//           <li>📈 Scale: Handles 20,000+ records monthly</li>
//           <li>⚡ Performance: 40% reduction in query overhead</li>
//           <li>✅ Reliability: 99.9%+ data integrity maintained</li>
//           <li>🔄 Real-Time: Event-driven async processing with Socket.IO</li>
//         </ul>`,
//         role: `As the Backend Developer, I:<br/>
//         - Built the complete backend using Python, Flask, and SQLAlchemy<br/>
//         - Implemented event-driven architecture with Socket.IO for real-time updates<br/>
//         - Optimized database queries achieving 40% reduction in overhead<br/>
//         - Ensured 99.9%+ data integrity across all operations`,
//     },
//     {
//         title: 'Quantitative Research Platform',
//         slug: 'quant-research',
//         techStack: [
//             'Python',
//             'Data Analysis',
//             'Statistical Modeling',
//             'Machine Learning',
//         ],
//         thumbnail: '/projects/thumbnail/quant-research.webp',
//         longThumbnail: '/projects/long/quant-research.webp',
//         images: [
//             '/projects/images/quant-1.webp',
//             '/projects/images/quant-2.webp',
//         ],
//         liveUrl: '#',
//         year: 2024,
//         description: `Research and development of quantitative models and alpha signals for financial markets at WorldQuant.<br/><br/>

//         Focus Areas:<br/>
//         <ul>
//           <li>📊 Statistical Analysis: Advanced data analysis and modeling</li>
//           <li>🤖 Machine Learning: ML-based signal generation</li>
//           <li>📈 Quantitative Research: Alpha discovery and validation</li>
//         </ul>`,
//         role: `As a Research Consultant, I:<br/>
//         - Developed and validated quantitative trading signals<br/>
//         - Applied machine learning techniques for alpha generation<br/>
//         - Conducted statistical analysis on large financial datasets`,
//     },
// ];

export const PROJECTS: IProject[] = [
    {
        title: 'OCTANE: Digital Twin Platform',
        slug: 'octane-digital-twin',
        liveUrl: 'https://octane-simulator.vercel.app/',
        githubUrl: 'https://github.com/ankitsneh-battsmart/HackSmart-TEAM-RISE',
        year: 2026,
        description: `
      A comprehensive Full-Stack Digital Twin platform designed to simulate and optimize city-scale battery swapping networks for the Indian EV market.<br/><br/>
      
      <strong>⚠️ Note on Live Demo:</strong> The frontend is live, but I have spun down the AWS Backend (Fargate/RDS) to save costs after the hackathon/demo period. The architecture and code are fully viewable on GitHub.<br/><br/>

      Key Features:<br/>
      <ul>
        <li>🏙️ <strong>City-Scale Simulation:</strong> Event-driven SimPy engine modeling entire battery ecosystems.</li>
        <li>🧠 <strong>AI SOC Estimation:</strong> Ensemble ML (LightGBM, GRU) for precise State of Charge prediction.</li>
        <li>🌡️ <strong>Physics Engine:</strong> Models thermal dynamics and cooling constraints of batteries.</li>
        <li>💰 <strong>Greenfield Planner:</strong> AI-driven economic optimization for new station deployments.</li>
      </ul><br/>
      
      Technical Highlights:
      <ul>
        <li><strong>Architecture:</strong> Chose AWS Fargate over EKS for 60% lower ops overhead and 40% cost reduction.</li>
        <li><strong>Database:</strong> Implemented TimescaleDB for high-frequency time-series telemetry.</li>
        <li><strong>Optimization:</strong> Built a custom "Out-of-the-Box" discrete event simulation using SimPy that models Indian traffic and festival patterns.</li>
      </ul>
      `,
        role: `
      Backend Lead & Cloud Architect <br/>
      I architected the entire simulation engine and cloud infrastructure:
      <ul>
        <li>✅ <strong>Simulation Core:</strong> Built the SimPy-based discrete event engine handling thousands of swap events.</li>
        <li>☁️ <strong>AWS Architecture:</strong> Designed a serverless-first architecture using Fargate, reducing cold start times and costs.</li>
        <li>🔒 <strong>Security:</strong> Implemented multi-layer security with JWT, VPC isolation, and WAF.</li>
        <li>📊 <strong>Data Engineering:</strong> Managed the flow from raw telemetry to actionable ML inference.</li>
      </ul>
      `,
        techStack: [
            'Python',
            'FastAPI',
            'SimPy',
            'AWS Fargate',
            'TimescaleDB',
            'Docker',
            'React',
        ],
        thumbnail: '/projects/thumbnail/octane-dashboard.png',
        longThumbnail: '/projects/long/octane-dashboard.png',
        images: [
            '/projects/images/octane.png',
            '/projects/long/octane-dashboard.png',
        ],
    },
    {
        title: 'SpotAIfy: AI Music Companion',
        slug: 'spotaify',
        githubUrl: 'https://github.com/ENDOMINOUSANK/SpotAIfy',
        liveUrl: '#',
        year: 2025,
        description: `
      A next-gen Spotify wrapper that breaks you out of the algorithmic echo chamber. Unlike standard recommendations, SpotAIfy acts as an AI companion that curates music based on "vibe" and complex prompts rather than just listening history.<br/><br/>

      Key Features:<br/>
      <ul>
        <li>🎵 <strong>Out-of-Box Discovery:</strong> Finds hidden gems that the standard Spotify algorithm ignores.</li>
        <li>🤖 <strong>AI Companion:</strong> A conversational interface to discuss and discover music.</li>
        <li>🎨 <strong>Vibe Matching:</strong> Generates playlists based on abstract concepts (e.g., "3 AM coding session in Tokyo").</li>
      </ul>`,
        role: `Full Stack Developer<br/>
        - Reverse-engineered aspects of music discovery to prioritize novelty over popularity.<br/>
        - Integrated LLMs to understand complex user sentiments and translate them into sonic attributes.<br/>
        - Built a clean, responsive wrapper around the Spotify API.`,
        techStack: [
            'React',
            'Node.js',
            'Spotify API',
            'OpenAI API',
            'TailwindCSS',
        ],
        thumbnail: '/projects/thumbnail/spotaify-playlist.png',
        longThumbnail: '/projects/long/spotaify-dashboard.png',
        images: [
            '/projects/thumbnail/spotaify-playlist.png',
            '/projects/long/spotaify-dashboard.png',
        ],
    },
    {
        title: 'Ctrl-Hack: Sovereign Secure Chat',
        slug: 'ctrl-hack',
        githubUrl: 'https://github.com/ENDOMINOUSANK/ctrl-hack',
        liveUrl: '#',
        year: 2024,
        description: `
      A locally hosted, hyper-secure chatbot designed for privacy-critical environments. This project eliminates reliance on external APIs (like OpenAI), ensuring zero data leakage.<br/><br/>

      Key Features:<br/>
      <ul>
        <li>🔒 <strong>100% Local:</strong> Runs entirely offline with no external API calls.</li>
        <li>⚡ <strong>Low Latency:</strong> Optimized local inference for rapid response times.</li>
        <li>🗣️ <strong>Native Language Support:</strong> Fine-tuned for local dialects and languages often missed by big models.</li>
      </ul>`,
        role: `AI Security Engineer<br/>
        - Implemented local LLM inference engines to bypass third-party APIs.<br/>
        - Optimized model quantization to run efficiently on consumer hardware.<br/>
        - Focused on "Sovereign AI"—giving users complete control over their data and model weights.`,
        techStack: [
            'Python',
            'Local LLMs (Llama/Mistral)',
            'LangChain',
            'Cybersecurity',
            'Offline NLP',
        ],
        thumbnail: '/projects/thumbnail/ctrl-hack-bot.png',
        longThumbnail: '/projects/long/ctrl-hack-sec.png',
        images: [
            '/projects/images/ctrl-hack-arch.png',
            '/projects/long/ctrl-hack-sec.png',
            '/projects/thumbnail/ctrl-hack-bot.png',
        ],
    },
];

export const MY_EXPERIENCE = [
    {
        title: 'DevOps Intern',
        company: 'Battery Smart',
        duration: 'Dec 2025 - Present',
        remark : 'Chief YAML Wrangler(for Helm especially) & Server Restarter(non-prod)'
    },
    {
        title: 'Research Consultant',
        company: 'WorldQuant',
        duration: 'Apr 2024 - Present',
        remark: 'Torturing data until it confesses.'
    },
    {
        title: 'MLOps | Backend Developer',
        company: 'BrandContext',
        duration: 'Sep 2024 - Jan 2026',
        remark: 'Bridging the gap between "It works on my machine" and "It works on the cloud".'
    },
];
