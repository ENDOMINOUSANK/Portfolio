import { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'ankitsneh03@gmail.com',

    emailSubject: "Let's collaborate on an AI/ML project",
    emailBody: 'Hi Ankit, I am reaching out to you because...',

    linkedIn: 'https://www.linkedin.com/in/ankitsneh/',
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
            name: 'Streamlit',
            icon: '/logo/streamlit.svg',
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
            name: 'Git',
            icon: '/logo/git.png',
        },
    ],
    Backend: [
        {
            name: 'Flask',
            icon: '/logo/flask.svg',
        },
        {
            name: 'Socket.IO',
            icon: '/logo/socketio.svg',
        },
        {
            name: 'SQLAlchemy',
            icon: '/logo/sqlalchemy.svg',
        },
        {
            name: 'Node.js',
            icon: '/logo/node.png',
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
            name: 'MySQL',
            icon: '/logo/mysql.svg',
        },
    ],
};

export const PROJECTS: IProject[] = [
    {
        title: 'AI Industrial Pipeline',
        slug: 'ai-industrial-pipeline',
        liveUrl: '#',
        year: 2025,
        description: `
      An integrated AI pipeline for industrial factory environments combining deep learning vision models, LLMs, and multimodal AI. <br/> <br/>
      
      Key Features:<br/>
      <ul>
        <li>🤖 Multi-Model Integration: Deep learning vision, LLMs, SLMs, and multimodal AI</li>
        <li>⚡ Real-Time Processing: Async-first architecture for high-throughput inference</li>
        <li>📊 PaddleOCR Integration: Intelligent text extraction from industrial machines</li>
        <li>🔄 LangChain Orchestration: Complex AI workflow management</li>
        <li>📱 Streamlit Interfaces: Cross-team collaboration dashboards</li>
      </ul><br/>
      
      Technical Highlights:
      <ul>
        <li>Designed async-first architecture for real-time decision-making in production</li>
        <li>Built robust preprocessing pipeline for diverse text formats</li>
        <li>Developed interactive GUIs for ML model interaction and data visualization</li>
        <li>Achieved reliable extraction under varying industrial conditions</li>
      </ul>
      `,
        role: `
      MLOps & Backend Developer <br/>
      Owned the entire ML pipeline deployment:
      <ul>
        <li>✅ AI Integration: Combined vision models, LLMs, SLMs with LangChain</li>
        <li>🏭 On-Site Deployment: Managed production deployment in factory environment</li>
        <li>⚡ Performance: Designed async architecture for high-throughput inference</li>
        <li>🖥️ Interfaces: Built Streamlit dashboards for cross-team collaboration</li>
        <li>📝 OCR Pipeline: Integrated PaddleOCR for automated text extraction</li>
      </ul>
      `,
        techStack: [
            'Python',
            'TensorFlow',
            'LangChain',
            'PaddleOCR',
            'Streamlit',
            'Docker',
        ],
        thumbnail: '/projects/thumbnail/ai-pipeline.webp',
        longThumbnail: '/projects/long/ai-pipeline.webp',
        images: [
            '/projects/images/ai-pipeline-1.webp',
            '/projects/images/ai-pipeline-2.webp',
        ],
    },
    {
        title: 'Workflow Management System',
        slug: 'workflow-management',
        techStack: [
            'Python',
            'Flask',
            'SQLAlchemy',
            'Socket.IO',
            'PostgreSQL',
            'Docker',
        ],
        thumbnail: '/projects/thumbnail/workflow-system.webp',
        longThumbnail: '/projects/long/workflow-system.webp',
        images: [
            '/projects/images/workflow-1.webp',
            '/projects/images/workflow-2.webp',
        ],
        liveUrl: '#',
        year: 2024,
        description: `A scalable workflow management system handling over 20,000 records monthly with event-driven asynchronous processing for real-time updates.<br/><br/>

        Key Achievements:<br/>
        <ul>
          <li>📈 Scale: Handles 20,000+ records monthly</li>
          <li>⚡ Performance: 40% reduction in query overhead</li>
          <li>✅ Reliability: 99.9%+ data integrity maintained</li>
          <li>🔄 Real-Time: Event-driven async processing with Socket.IO</li>
        </ul>`,
        role: `As the Backend Developer, I:<br/>
        - Built the complete backend using Python, Flask, and SQLAlchemy<br/>
        - Implemented event-driven architecture with Socket.IO for real-time updates<br/>
        - Optimized database queries achieving 40% reduction in overhead<br/>
        - Ensured 99.9%+ data integrity across all operations`,
    },
    {
        title: 'Quantitative Research Platform',
        slug: 'quant-research',
        techStack: [
            'Python',
            'Data Analysis',
            'Statistical Modeling',
            'Machine Learning',
        ],
        thumbnail: '/projects/thumbnail/quant-research.webp',
        longThumbnail: '/projects/long/quant-research.webp',
        images: [
            '/projects/images/quant-1.webp',
            '/projects/images/quant-2.webp',
        ],
        liveUrl: '#',
        year: 2024,
        description: `Research and development of quantitative models and alpha signals for financial markets at WorldQuant.<br/><br/>

        Focus Areas:<br/>
        <ul>
          <li>📊 Statistical Analysis: Advanced data analysis and modeling</li>
          <li>🤖 Machine Learning: ML-based signal generation</li>
          <li>📈 Quantitative Research: Alpha discovery and validation</li>
        </ul>`,
        role: `As a Research Consultant, I:<br/>
        - Developed and validated quantitative trading signals<br/>
        - Applied machine learning techniques for alpha generation<br/>
        - Conducted statistical analysis on large financial datasets`,
    },
];

export const MY_EXPERIENCE = [
    {
        title: 'DevOps Intern',
        company: 'Battery Smart',
        duration: 'Dec 2025 - Present',
    },
    {
        title: 'Research Consultant',
        company: 'WorldQuant',
        duration: 'Apr 2024 - Present',
    },
    {
        title: 'MLOps | Backend Developer',
        company: 'BrandContext',
        duration: 'Sep 2024 - Jan 2026',
    },
];
