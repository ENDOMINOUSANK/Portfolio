# Ankit Sneh - Portfolio

A modern, interactive portfolio website built with cutting-edge web technologies featuring AI-powered hand gesture controls, smooth animations, and a stunning visual experience.

![Next.js](https://img.shields.io/badge/Next.js-15.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22-FF6F00?logo=tensorflow)
![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greensock)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)

## ✨ Features

### 🤖 AI Mode - Hand Gesture Control
Control the entire website with hand gestures using your webcam! Powered by TensorFlow.js and the Handpose model.

| Gesture | Action |
|---------|--------|
| ☝️ Point Up | Scroll Up |
| 👇 Point Down | Scroll Down |
| ✋ Open Palm | Pause |
| 👌 Pinch | Click |
| 🤟 3 Fingers | Go Back / Close Modal |
| ✌️ Peace Sign | Exit AI Mode |

### 🎨 Visual Effects
- **Particle Background** - Dynamic starfield with twinkling animations (white, violet, gold stars)
- **Custom Cursor** - Smooth, animated pointer cursor with GSAP interpolation
- **Preloader** - Animated name reveal with gradient strips
- **Page Transitions** - Smooth slide transitions between pages
- **Scroll Progress Indicator** - Visual scroll position tracker

### 📱 Sections
- **Hero Banner** - Animated intro with stats
- **About Me** - Personal introduction
- **Skills** - Categorized tech stack (AI/ML, DevOps/Cloud, Backend)
- **Experience** - Professional journey
- **Projects** - Detailed project showcases with dynamic routing

### 🛠️ Technical Highlights
- Server-side rendering with Next.js App Router
- Smooth scrolling with Lenis
- SEO optimized with dynamic metadata & sitemap
- Google Analytics & Hotjar integration
- Fully responsive design
- Custom SVG icons with SVGR

## 🚀 Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.2.8 | React framework with App Router |
| React | 19.0.0-rc | UI library |
| TypeScript | 5.x | Type safety |

### Styling & UI
| Technology | Purpose |
|------------|---------|
| Tailwind CSS | Utility-first styling |
| tailwindcss-animate | Animation utilities |
| class-variance-authority | Component variants |
| clsx + tailwind-merge | Class name utilities |
| Lucide React | Icon library |

### Animations
| Technology | Purpose |
|------------|---------|
| GSAP | High-performance animations |
| @gsap/react | React integration for GSAP |
| Lenis | Smooth scroll library |

### AI / Machine Learning
| Technology | Purpose |
|------------|---------|
| TensorFlow.js | ML runtime in browser |
| @tensorflow-models/handpose | Hand tracking model |

### Analytics & Tracking
| Technology | Purpose |
|------------|---------|
| Google Analytics | Traffic analytics |
| Hotjar | User behavior tracking |

### Development
| Tool | Purpose |
|------|---------|
| SVGR | SVG to React component conversion |
| ESLint | Code linting |
| Turbopack | Fast development builds |

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── _components/          # Page-specific components
│   │   ├── AboutMe.tsx
│   │   ├── Banner.tsx
│   │   ├── Experiences.tsx
│   │   ├── Project.tsx
│   │   ├── ProjectList.tsx
│   │   ├── Skills.tsx
│   │   └── StickyEmail.tsx
│   ├── projects/
│   │   └── [slug]/           # Dynamic project pages
│   ├── globals.css
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── sitemap.ts            # SEO sitemap
│   └── template.tsx          # Page transition wrapper
├── components/
│   ├── AIMode/               # Hand gesture control system
│   │   ├── AIToggleButton.tsx
│   │   ├── CameraPermissionModal.tsx
│   │   ├── GestureOverlay.tsx
│   │   ├── HandGestureController.tsx
│   │   └── index.tsx
│   ├── icons/                # Custom SVG icons
│   ├── ArrowAnimation.tsx
│   ├── Button.tsx
│   ├── ConnectModal.tsx
│   ├── CustomCursor.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── ParticleBackground.tsx
│   ├── Preloader.tsx
│   ├── ScrollProgressIndicator.tsx
│   ├── SectionTitle.tsx
│   └── TransitionLink.tsx
├── contexts/
│   └── AIModeContext.tsx     # AI Mode state management
├── lib/
│   ├── data.ts               # Static content & projects
│   ├── sleep.ts              # Utility functions
│   └── utils.ts              # Helper functions
├── public/
│   ├── logo/                 # Tech stack logos
│   └── projects/             # Project images
└── types/
    └── index.ts              # TypeScript interfaces
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/ankitsneh/portfolio.git
cd portfolio

# Install dependencies
pnpm install

# Start development server (with Turbopack)
pnpm dev
```

### Build for Production

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

## 🌐 Deployment

This project is optimized for deployment on **Vercel**:

1. Push your code to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Vercel auto-detects Next.js and deploys

### Custom Domain Setup
Add your domain in Vercel Dashboard → Settings → Domains

## 📊 Performance Features

- **Turbopack** - Lightning-fast development builds
- **Static Generation** - Pre-rendered project pages with `generateStaticParams`
- **Image Optimization** - Next.js automatic image optimization
- **Font Optimization** - Google Fonts (Anton, Roboto Flex) with `next/font`
- **Tree Shaking** - Only load what's needed
- **GPU-Accelerated Animations** - GSAP with hardware acceleration

## 🎯 Key Implementation Details

### AI Mode Hand Tracking
The hand gesture system uses:
- TensorFlow.js Handpose model loaded once and cached
- Exponential Moving Average (EMA) smoothing for cursor stability
- 10-frame gesture confirmation to prevent false positives
- Debounced click actions to prevent double-clicks

### Smooth Animations
- GSAP ScrollTrigger for scroll-linked animations
- Lenis for buttery smooth scrolling (lerp: 0.1, duration: 1.4)
- CSS `will-change` hints for GPU optimization
- Request Animation Frame for hand tracking loop

### Page Transitions
Custom transition system using:
- Next.js `template.tsx` for layout persistence
- GSAP timeline for coordinated animations
- TransitionLink component for navigation interception

## 📝 Scripts

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm svgr:icons   # Convert SVGs to React components
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Ankit Sneh**
- Website: [ankitsneh.tech](https://ankitsneh.tech)
- LinkedIn: [@ankitsneh](https://www.linkedin.com/in/ankitsneh/)
- GitHub: [@ankitsneh](https://github.com/ankitsneh)
- Email: ankitsneh03@gmail.com

---

<p align="center">
  Built with ❤️ using Next.js, GSAP, and TensorFlow.js
</p>
