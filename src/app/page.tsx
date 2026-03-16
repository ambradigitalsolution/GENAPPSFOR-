"use client";

import { useState, FormEvent, useEffect } from "react";
import { Sparkles, Terminal, Copy, Check, Wand2, Plus, X, Server, Palette, Rocket, Layers, Loader2, ChevronDown, Download, ShieldAlert, Zap, Wand } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompletion } from "@ai-sdk/react";
import { Toaster, toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";
import { Eye, Code as CodeIcon, Monitor, Smartphone, Tablet } from "lucide-react";


const QUICK_PRESETS = [
  {
    label: "E-Commerce System",
    category: "Business",
    name: "ElectroShop E-Commerce",
    purpose: "A full-featured e-commerce platform with product listings, shopping cart, user checkout, and admin dashboard for inventory management.",
    tech: ["Next.js 14", "Tailwind CSS", "TypeScript", "PostgreSQL", "Prisma"],
    features: ["User Authentication (NextAuth)", "Shopping Cart", "Payment Gateway Integration", "Admin Dashboard"]
  },
  {
    label: "Admin Dashboard",
    category: "Business",
    name: "Nexus Admin Panel",
    purpose: "A comprehensive admin dashboard to manage users, view analytics, and control application settings.",
    tech: ["React", "Tailwind CSS", "TypeScript", "Supabase"],
    features: ["Role-based Access Control", "Data Visualization & Charts", "User Management Table", "Settings Page"]
  },
  {
    label: "Social Media App",
    category: "Content",
    name: "Pulse Social",
    purpose: "A social networking platform where users can post updates, follow others, and like/comment on posts.",
    tech: ["Next.js 14", "Tailwind CSS", "TypeScript", "MongoDB", "Firebase"],
    features: ["User Profiles", "Real-time Feed", "Like & Comment System", "Image Upload"]
  },
  {
    label: "SaaS Platform",
    category: "Business",
    name: "Vision SaaS",
    purpose: "A subscription-based web application with tiered pricing, multi-tenant architecture, and a user dashboard.",
    tech: ["Next.js 14", "Tailwind CSS", "TypeScript", "Supabase", "Stripe"],
    features: ["Subscription Management (Stripe)", "Multi-tenant Architecture", "User Dashboard", "API Rate Limiting"]
  },
  {
    label: "WordPress Plugin",
    category: "Content",
    name: "WP Super Tools",
    purpose: "A custom WordPress plugin that adds specific features to the admin panel and shortcodes for the frontend.",
    tech: ["PHP", "WordPress API", "JavaScript", "HTML/CSS"],
    features: ["Custom Post Types", "Admin Settings Page", "Frontend Shortcodes", "Database Migration Hooks"]
  },
  {
    label: "CRM System",
    category: "Business",
    name: "Connect CRM",
    purpose: "A customer relationship management tool to track leads, manage contacts, and view sales pipelines.",
    tech: ["Next.js 14", "Tailwind CSS", "TypeScript", "PostgreSQL", "Prisma"],
    features: ["Contact Management", "Sales Pipeline Kanban", "Client Reporting", "Activity Scheduling"]
  },
  {
    label: "Task Management",
    category: "Modern",
    name: "AgileBoard",
    purpose: "A project management tool featuring Kanban boards, task assignments, and team collaboration.",
    tech: ["React", "Tailwind CSS", "TypeScript", "Node.js", "MongoDB"],
    features: ["Drag-and-Drop Kanban", "Team Workspaces", "To-Do Lists & Due Dates", "Real-time Updates"]
  },
  {
    label: "POS & Inventory",
    category: "Business",
    name: "RetailPOS",
    purpose: "A point of sale system for local stores to manage daily transactions, print receipts, and track inventory.",
    tech: ["Next.js 14", "Tailwind CSS", "TypeScript", "Supabase"],
    features: ["Cashier Interface", "Barcode Scanning Support", "Inventory Tracking", "Daily Sales Reports"]
  },
  {
    label: "LMS Platform",
    category: "Content",
    name: "EduLearn Academy",
    purpose: "An online learning management system where instructors can upload courses and students can track progress.",
    tech: ["Next.js 14", "Tailwind CSS", "TypeScript", "PostgreSQL", "AWS S3"],
    features: ["Video Module Management", "Interactive Quizzes", "Student Progress Tracking", "Certificate Generation"]
  },
  {
    label: "Modern Blog / CMS",
    category: "Content",
    name: "StoryContent CMS",
    purpose: "A modern, SEO-optimized content management system and blogging platform with a block-based editor.",
    tech: ["Next.js 14", "Tailwind CSS", "TypeScript", "Sanity.io"],
    features: ["Rich Text Block Editor", "Dynamic SEO Meta Tags", "Comment System", "Content Drafts & Publishing"]
  },
  {
    label: "Real-time Chat App",
    category: "Modern",
    name: "ChatWave",
    purpose: "A messaging application supporting direct and group conversations with real-time updates.",
    tech: ["React", "Tailwind CSS", "TypeScript", "Node.js", "Socket.io"],
    features: ["Real-time Messaging (WebSocket)", "Group Channels", "Read Receipts", "File Sharing"]
  },
  {
    label: "Landing Page",
    category: "Marketing",
    name: "LaunchPad One",
    purpose: "A high-converting, heavily animated product landing page designed to maximize user signups and engagement.",
    tech: ["Next.js 14", "Tailwind CSS", "TypeScript", "Framer Motion"],
    features: ["Scroll Animation Triggers", "Responsive Hero Section", "Pricing Pricing Tiers", "Newsletter Capture"]
  },
  {
    label: "Creative Portfolio",
    category: "Marketing",
    name: "DevFolio 3D",
    purpose: "A visually striking personal portfolio for a developer or designer featuring modern dark-mode aesthetics and subtle 3D interactions.",
    tech: ["Next.js 14", "Tailwind CSS", "TypeScript", "Three.js", "Framer Motion"],
    features: ["Dark Mode Default", "3D Interactive Elements", "Project Showcase Grid", "Contact Form"]
  },
  {
    label: "AI Wrapper Tool",
    category: "Modern",
    name: "PromptGenie AI",
    purpose: "An intelligent web application that interfaces directly with LLMs to provide specialized text generation tools.",
    tech: ["Next.js 14", "Tailwind CSS", "TypeScript", "OpenAI API", "Vercel AI SDK"],
    features: ["Prompt Input & Optimization", "Streaming Text Responses", "Chat History", "Markdown Rendering"]
  },
  {
    label: "Booking Marketplace",
    category: "Business",
    name: "StayBooker",
    purpose: "A double-sided marketplace platform for users to list properties and for guests to make reservations.",
    tech: ["Next.js 14", "Tailwind CSS", "TypeScript", "PostgreSQL", "Prisma"],
    features: ["Complex Search Filters", "Interactive Booking Calendar", "Host & Guest Dashboards", "User Review System"]
  },
  {
    label: "Marketing Website",
    category: "Marketing",
    name: "GrowthWeb Pro",
    purpose: "A high-performance company profile and marketing website optimized for lead generation, SEO, and fast load times.",
    tech: ["Next.js 14", "Tailwind CSS", "TypeScript", "Framer Motion"],
    features: ["SEO Meta Tags", "Lead Capture Forms", "Scroll Animations", "Services Showcase"]
  },
  {
    label: "App/Web Clone",
    category: "Business",
    name: "SaaS App Clone",
    purpose: "A functional clone of a popular existing web application, replicating its core business features and UI logic.",
    tech: ["Next.js 14", "Tailwind CSS", "TypeScript", "PostgreSQL", "Supabase"],
    features: ["Authentication System", "Core Domain Logic Loop", "Responsive UI Replication", "Database Sync"]
  },
  {
    label: "Google Lead Scraper",
    category: "Marketing",
    name: "MapScrap Automator",
    purpose: "A data extraction tool to scrape business listings, contact info, and reviews from Google Maps for marketing leads.",
    tech: ["Node.js", "TypeScript", "Puppeteer", "Cheerio", "Express"],
    features: ["Automated Web Scraping", "Data Export (CSV/JSON)", "Proxy Rotation Support", "Rate Limiting Bypass"]
  },
  {
    label: "Laba Rugi Coretax",
    category: "Business",
    name: "Coretax Profit Calc",
    purpose: "A dedicated accounting and tax application tailored for Indonesian businesses to calculate profit/loss (Laba Rugi) matching the new Coretax system formatting.",
    tech: ["Next.js 14", "Tailwind CSS", "TypeScript", "PostgreSQL", "Prisma"],
    features: ["Laba Rugi Generator", "Coretax CSV/Excel Export", "Tax Deduction Engine", "Expense Tracking"]
  }
];

const MOCK_UI_SAMPLES = {
  "Business": (
    <div className="w-full h-full bg-[#050505] p-6 text-white font-sans overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Rocket className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">NEXUS<span className="text-blue-500">PRO</span></span>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700" />
          <div className="w-24 h-8 rounded-lg bg-zinc-800/50 border border-zinc-700" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-6 rounded-2xl bg-[#111] border border-zinc-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-12 h-12 text-blue-500" />
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</p>
            <h3 className="text-2xl font-bold font-mono">$12,450.00</h3>
            <p className="text-green-500 text-[10px] mt-2 flex items-center gap-1">↑ 12% from last month</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-[#111] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Order Analytics</h4>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-zinc-800 rounded-md text-[10px] text-zinc-400">Monthly</div>
            <div className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-md text-[10px] font-bold border border-blue-500/20">Real-time</div>
          </div>
        </div>
        <div className="h-40 flex items-end gap-2 px-2 pb-2">
          {[40, 70, 45, 90, 65, 80, 50, 85, 45, 100, 75, 60, 40, 80].map((h, idx) => (
            <motion.div 
              key={idx}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: idx * 0.05, duration: 0.8, ease: "easeOut" }}
              className={`flex-1 rounded-t-sm ${idx === 9 ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-zinc-800 hover:bg-zinc-700'} transition-colors cursor-pointer`}
            />
          ))}
        </div>
      </div>
    </div>
  ),
  "Marketing": (
    <div className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center text-white overflow-y-auto">
       <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
       </div>
       
       <motion.div 
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         className="relative z-10 space-y-6"
       >
         <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-purple-400 mb-2">
           Next Generation Design
         </div>
         <h1 className="text-5xl font-black leading-tight tracking-tighter">
           Design the future <br /> 
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
             without limits.
           </span>
         </h1>
         <p className="text-zinc-400 max-w-sm mx-auto text-sm leading-relaxed">
           The modular component system that helps you ship product interfaces faster than ever before.
         </p>
         
         <div className="flex items-center justify-center gap-4 pt-4">
           <button className="px-8 py-3 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-transform">
             Get Started
           </button>
           <button className="px-8 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-full font-bold text-sm hover:bg-zinc-800 transition-colors">
             Watch Demo
           </button>
         </div>

         <div className="pt-12 grid grid-cols-4 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
           {['LOGO', 'SaaS', 'Web3', 'AI Tool'].map(l => (
             <div key={l} className="text-xs font-bold tracking-widest">{l}</div>
           ))}
         </div>
       </motion.div>
    </div>
  ),
  "Modern": (
    <div className="w-full h-full bg-[#0d0d0d] p-0 font-sans text-zinc-300">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-16 border-r border-zinc-800 flex flex-col items-center py-6 gap-8 bg-[#0a0a0a]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600" />
          <div className="flex flex-col gap-6">
            {[Layers, Monitor, Palette, Terminal, Zap].map((Icon, i) => (
              <Icon key={i} className={`w-5 h-5 ${i === 0 ? 'text-white' : 'text-zinc-600'} hover:text-white cursor-pointer transition-colors`} />
            ))}
          </div>
          <div className="mt-auto">
            <ShieldAlert className="w-5 h-5 text-zinc-600" />
          </div>
        </div>
        
        {/* Main */}
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#0a0a0a]/50 backdrop-blur-xl">
            <h2 className="text-sm font-bold tracking-wider uppercase text-white">Project Workspaces</h2>
            <button className="p-2 bg-blue-600/10 border border-blue-500/20 rounded-lg text-blue-500 hover:bg-blue-600/20 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </header>
          
          <div className="p-8 grid grid-cols-2 gap-6 overflow-y-auto max-h-[460px]">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {i % 2 === 0 ? <Wand2 className="w-5 h-5 text-indigo-400" /> : <Layers className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div className="p-1 rounded bg-green-500/10 text-green-500 text-[8px] font-bold">ACTIVE</div>
                </div>
                <h4 className="text-white text-sm font-bold mb-1">Modern Component {i}</h4>
                <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">System architecture and dynamic asset loading for production environments.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};


const PRESET_CATEGORIES = ["All", ...Array.from(new Set(QUICK_PRESETS.map((p) => p.category)))];

const AVAILABLE_TECH = [
  "Next.js 14", "React", "Vue", "Svelte",
  "Tailwind CSS", "Supabase", "Firebase",
  "Node.js", "TypeScript", "Prisma", "MongoDB", "PostgreSQL",
  "PHP", "WordPress API", "Stripe", "Socket.io", "OpenAI API",
  "Framer Motion", "Three.js", "Sanity.io", "AWS S3", "Vercel AI SDK",
  "Puppeteer", "Cheerio"
];

const SUGGESTED_FEATURES = [
  { id: "User Authentication", label: "Login & Register", description: "Bikin sistem keamanan biar user bisa daftar, login, dan punya akun sendiri." },
  { id: "Admin Dashboard", label: "Admin Dashboard", description: "Halaman khusus buat admin (pemilik) mengatur data, melihat statistik, dan memantau aplikasi." },
  { id: "Payment Integration", label: "Sistem Pembayaran", description: "Menyambungkan aplikasi dengan payment gateway (contoh: Midtrans, Stripe) biar bisa terima duit otomatis." },
  { id: "Role-based Access Control", label: "Hak Akses (Role)", description: "Membedakan mana user biasa, mana admin, dan menentukan halaman mana yang boleh mereka buka." },
  { id: "Database/CRUD", label: "Database CRUD", description: "Fungsi dasar untuk (C)reate, (R)ead, (U)pdate, dan (D)elete data di aplikasi." },
  { id: "Search & Filters", label: "Pencarian & Filter", description: "Biar user gampang nyari data spesifik di dalam aplikasi pakai kolom search dan opsi filter." },
  { id: "File/Image Uploads", label: "Upload File/Foto", description: "Mengatur tempat penyimpanan biar user bisa nge-upload pas foto, dokumen, atau gambar produk." },
  { id: "Real-time Chat", label: "Chatting Realtime", description: "Fitur ngobrol langsung antar user tanpa perlu nge-refresh halaman kayak WhatsApp." },
  { id: "Analytics & Charts", label: "Grafik & Laporan", description: "Bikin diagram yang keren dan gampang dibaca untuk nampilin data statistik atau laporan bulan-bulanan." },
  { id: "User Profile System", label: "Profil Pengguna", description: "Halaman khusus buat user ganti foto profil, mengedit biodata, dan ganti password." },
  { id: "Settings Page", label: "Halaman Setting", description: "Tempat buat ngatur preferensi aplikasi, notifikasi, dan pengaturan akun secara umum." }
];

const CONSTRAINT_OPTIONS = [
  {
    id: "strict_ts",
    label: "Tipe Data Ketat (TypeScript)",
    description: "AI akan dipaksa menggunakan tipe data yang ketat. Biar nggak gampang error pas jalanin kodenya nanti.",
    prompt: "Use strict TypeScript. Avoid 'any' type. Ensure all types are properly defined."
  },
  {
    id: "clean_folders",
    label: "Struktur Folder Rapi",
    description: "Menyuruh AI mengatur file berdasarkan fitur biar file-nya nggak berantakan, jadi aplikasinya gampang di-upgrade besok-besok.",
    prompt: "Organize the project using a feature-based structure. Group components and logic by feature."
  },
  {
    id: "responsive",
    label: "Prioritas HP (Responsive)",
    description: "Memastikan tampilan aplikasi terlihat keren dan sempurna di layar HP sebelum fokus ke tampilan layar Komputer/Desktop.",
    prompt: "Prioritize a mobile-first responsive design. Ensure perfect UI on small screens."
  },
  {
    id: "no_placeholder",
    label: "Anti Kode Setengah Matang",
    description: "Wajib! Memaksa AI menulis kode sampai tuntas, bukan cuma ngasih komentar 'isi sendiri nanti ujungnya'. Biar kode langsung bisa dites!",
    prompt: "Do not use placeholders like // logic goes here or comments for implementation. Write the complete, working code for every single function."
  },
  {
    id: "no_chatter",
    label: "Fokus Kode Saja",
    description: "AI dilarang banyak bicara, basa-basi, atau ngejelasin panjang lebar. Langsung dikasih kodenya aja biar gampang dicopas.",
    prompt: "Provide only the necessary code and file structures. Do not add conversational, explanatory, or introductory text."
  },
  {
    id: "dummy_data",
    label: "Sertakan Data Bohongan",
    description: "Menyuruh AI bikin data bohongan (dummy) untuk aplikasi. Jadi tampilannya bisa langsung kelihatan cantik tanpa perlu mikirin database dulu.",
    prompt: "Always provide realistic mock/dummy data arrays for components so the UI can be tested immediately without a live backend connection."
  },
  {
    id: "dark_mode",
    label: "Wajib Mode Gelap",
    description: "Mewajibkan AI untuk sekalian ngoding warna dan tema untuk 'Mode Gelap' (Dark Mode) karena semua aplikasi keren jaman sekarang wajib punya ini.",
    prompt: "Ensure all UI components and styling classes explicitly account for high-quality dark-mode support by default."
  }
];

const FRONTEND_SPECIAL_OPTIONS = [
  {
    id: "visual_polish",
    label: "Visual Polish (Glassmorphism)",
    description: "AI akan menambahkan efek blur, shadow, dan gradasi modern agar UI terlihat mewah seperti produk Apple atau SaaS premium.",
    prompt: "Apply a 'Glassmorphism' aesthetic: use backdrop-filters (blur), subtle border-strokes, and high-fidelity box shadows. Use a sophisticated color palette with smooth gradients."
  },
  {
    id: "interactive_animations",
    label: "Interactive Animations",
    description: "AI akan menyertakan kode Framer Motion untuk animasi hover, scroll, dan transisi halaman agar aplikasi terasa hidup.",
    prompt: "Use Framer Motion for all interactive elements. Implement hover scales, page entry transitions, and scroll-triggered animations to ensure the UX feels 'alive' and responsive."
  },
  {
    id: "responsive_scaling",
    label: "Responsive Perfect Scaling",
    description: "AI akan memastikan tipografi dan layout membesar/mengecil dengan proporsional di HP, Tablet, dan Desktop tanpa pecah.",
    prompt: "Ensure meticulous responsive design. Use fluid typography (clamp) and layout-containers that scale perfectly across mobile, tablet, and wide-desktop views."
  }
];


export default function Home() {
  const [copied, setCopied] = useState(false);

  // Form States
  const [appName, setAppName] = useState("");
  const [appPurpose, setAppPurpose] = useState("");
  const [techStack, setTechStack] = useState<string[]>(["Next.js 14", "Tailwind CSS", "TypeScript"]);
  const [designVibe, setDesignVibe] = useState("");
  const [features, setFeatures] = useState(["User Authentication", "Database Integration"]);
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([]);
  const [selectedFrontendOptions, setSelectedFrontendOptions] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const [viewMode, setViewMode] = useState<"visual" | "code">("visual");
  const [deviceFrame, setDeviceFrame] = useState<"monitor" | "tablet" | "smartphone">("monitor");
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentMockId, setCurrentMockId] = useState<string>("Modern");
  const [useAi, setUseAi] = useState(false);
  const [localCompletion, setLocalCompletion] = useState("");



  // Load from LocalStorage
  useEffect(() => {
    const savedState = localStorage.getItem("promptmaster_state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.appName) setAppName(parsed.appName);
        if (parsed.appPurpose) setAppPurpose(parsed.appPurpose);
        if (parsed.techStack) setTechStack(parsed.techStack);
        if (parsed.designVibe) setDesignVibe(parsed.designVibe);
        if (parsed.features) setFeatures(parsed.features);
        if (parsed.selectedConstraints) setSelectedConstraints(parsed.selectedConstraints);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    const stateToSave = {
      appName, appPurpose, techStack, designVibe, features, selectedConstraints
    };
    localStorage.setItem("promptmaster_state", JSON.stringify(stateToSave));
  }, [appName, appPurpose, techStack, designVibe, features, selectedConstraints]);

  // Quick Preset Handler
  const handleApplyPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setAppName(preset.name);
    setAppPurpose(preset.purpose);
    setTechStack(preset.tech);
    setFeatures(preset.features);
    setDesignVibe("minimalist");
    toast.success(`${preset.label} preset applied!`, { icon: '🚀' });
  };

  // Vercel AI SDK
  const { completion, complete, isLoading } = useCompletion({
    api: "/api/generate",
    streamProtocol: "text",
    onError: (err: any) => {
      console.error(err);
      toast.error("Failed to generate prompt. Have you set your API keys in .env?");
    }
  });

  // Vercel AI SDK - Enhance Idea
  const enhanceTask = useCompletion({
    api: "/api/enhance",
    id: "enhance_idea",
    onFinish: (_, result) => {
      setAppPurpose(result);
      toast.success("Idea completely enhanced! 🪄", { icon: "✨" });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to enhance idea.");
    }
  });

  const handleEnhanceIdea = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!appName.trim() && !appPurpose.trim()) {
      toast.error("Please provide at least an app name or a short purpose to enhance.");
      return;
    }
    const promptContext = `App Name: ${appName}\nInitial Concept: ${appPurpose}`;
    enhanceTask.complete(promptContext);
  };

  const handleCopy = () => {
    const textToCopy = completion || localCompletion;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Copied to clipboard!", { icon: '📋' });
    setTimeout(() => setCopied(false), 2000);
  };


  const handleDownload = () => {
    const textToDownload = completion || localCompletion;
    if (!textToDownload) return;
    const blob = new Blob([textToDownload], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName.toLowerCase().replace(/\s+/g, '-') || 'master'}-prompt.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  const toggleTech = (tech: string) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter(t => t !== tech));
    } else {
      setTechStack([...techStack, tech]);
    }
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const toggleSuggestedFeature = (featureName: string) => {
    if (features.includes(featureName)) {
      setFeatures(features.filter(f => f !== featureName));
    } else {
      // Hapus yang kosong, masukkan yang baru di paling bawah.
      const cleaned = features.filter(f => f.trim() !== "");
      setFeatures([...cleaned, featureName]);
    }
  };

  const handleGenerate = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!appName.trim() || !appPurpose.trim()) {
      toast.error("Please enter App Name and Purpose!");
      return;
    }

    const compiledConstraints = CONSTRAINT_OPTIONS
      .filter(opt => selectedConstraints.includes(opt.id))
      .map(opt => `- ${opt.prompt}`)
      .join('\n');

    const compiledFrontend = FRONTEND_SPECIAL_OPTIONS
      .filter(opt => selectedFrontendOptions.includes(opt.id))
      .map(opt => `- ${opt.prompt}`)
      .join('\n');

    const compiledPrompt = `
# SYSTEM ROLE
You are a world-class Prompt Engineer specializing in AI-assisted coding.
Your task is to generate a comprehensive "Master System Prompt" for ${appName}.

# PROJECT CONTEXT
- App Name: ${appName}
- Core Purpose: ${appPurpose}
- Target Tech Stack: ${techStack.join(', ')}
- Design Vibe: ${designVibe || "Modern & Professional"}

# VISUAL & FRONTEND PRIORITIES
${compiledFrontend.trim() !== "" ? compiledFrontend : "- Prioritize premium UI/UX, clean spacing, and modern typography."}

# CORE FEATURES TO IMPLEMENT
${features.filter(f => f.trim() !== "").map((f, i) => `${i + 1}. ${f}`).join('\n')}


${compiledConstraints.trim() !== "" ? `# ARCHITECTURAL RULES & CONSTRAINTS\n${compiledConstraints}\n` : ""}

# FINAL INSTRUCTIONS FOR THE CODER AI
1. Think step-by-step about the architecture before writing code.
2. Initialize the project structure using the requested tech stack.
3. Implement core features with clean, documented code.
4. Ensure the UI matches the "${designVibe}" vibe.
`;

    // Reset view to visual first
    setViewMode("visual");

    if (useAi) {
      complete(compiledPrompt);
    } else {
      // Simulation / Local Mode
      setIsSimulating(true);
      setLocalCompletion(compiledPrompt);
      
      // Select mock
      const categories = ["Business", "Marketing", "Modern"];
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      const selectedCat = (activeCategory !== "All" && MOCK_UI_SAMPLES[activeCategory as keyof typeof MOCK_UI_SAMPLES]) 
        ? activeCategory 
        : randomCat;
      
      setCurrentMockId(selectedCat);

      setTimeout(() => {
        setIsSimulating(false);
        toast.success("Master Prompt Compiled Locally!", { icon: "📝" });
      }, 1500);
    }
  };



  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-4 sm:p-8 lg:p-12 relative">
      <Toaster position="bottom-center" toastOptions={{
        style: {
          background: '#111',
          color: '#fff',
          border: '1px solid #333'
        }
      }} />
      {/* Background is now clean black */}

      {/* Header */}
      <div className="w-full max-w-7xl mb-8 flex justify-between items-center z-10 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white italic">PROMPTMASTER <span className="text-blue-500">AI</span></h1>
        </div>
        <div className="text-xs font-bold text-zinc-400 tracking-widest uppercase bg-zinc-900 px-4 py-2 rounded-md border border-zinc-800">
          SYSTEM v1.0.0
        </div>
      </div>

      {/* Main Content: Split Screen */}
      <main className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 z-10 flex-1">

        {/* Left Side: Dynamic Form */}
        <div className="flex-1 bg-[#111111] border border-[#333333] rounded-2xl p-6 sm:p-8 flex flex-col gap-6 relative shadow-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-3xl opacity-50" />

          <div>
            <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              Project Details
            </h2>
            <p className="text-zinc-300 text-sm">Fill in the details to generate your master prompt.</p>
          </div>

          <div className="flex flex-col gap-5">
            {/* Quick Presets */}
            <div className="space-y-3 mb-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Quick Presets
                </label>
                
                {/* Category Filter Tabs */}
                <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                  {PRESET_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${
                        activeCategory === cat
                          ? "bg-blue-600/80 text-white shadow-sm"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar pb-2 pr-2">
                {QUICK_PRESETS
                  .filter(p => activeCategory === "All" || p.category === activeCategory)
                  .map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleApplyPreset(preset)}
                    className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-xs font-medium text-zinc-300 flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* App Name/Idea */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">App Name / Core Idea</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="e.g. PromptMaster AI"
                className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none hover:bg-white/5 focus:bg-white/5 transition-colors"
              />
            </div>

            {/* App Purpose */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-zinc-300">App Purpose</label>
                <button
                  type="button"
                  onClick={handleEnhanceIdea}
                  disabled={enhanceTask.isLoading || (!appName && !appPurpose)}
                  className="text-[11px] font-medium text-purple-400 flex items-center gap-1 bg-purple-500/10 hover:bg-purple-500/20 px-2 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500/20"
                >
                  {enhanceTask.isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand className="w-3 h-3" />}
                  {enhanceTask.isLoading ? "Enhancing..." : "Auto-Enhance"}
                </button>
              </div>
              <TextareaAutosize
                minRows={3}
                value={enhanceTask.isLoading ? enhanceTask.completion : appPurpose}
                onChange={(e) => {
                  if (!enhanceTask.isLoading) {
                    setAppPurpose(e.target.value);
                  }
                }}
                disabled={enhanceTask.isLoading}
                placeholder="What does this app do? Who is it for?"
                className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none resize-none transition-all hover:bg-white/5 focus:bg-white/5 disabled:opacity-70"
              />
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Server className="w-4 h-4 text-zinc-400" />
                Desired Tech Stack
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TECH.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={`px-3 py-1.5 rounded-md border text-xs font-bold transition-all ${techStack.includes(tech)
                      ? "bg-blue-600 border-blue-400 text-white"
                      : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-white"
                      }`}
                  >
                    {tech.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone/Vibe */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Palette className="w-4 h-4 text-zinc-400" />
                Design Vibe
              </label>
              <div className="relative">
                <select
                  value={designVibe}
                  onChange={(e) => setDesignVibe(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm text-zinc-300 outline-none appearance-none bg-[#111] cursor-pointer transition-all hover:bg-white/10"
                >
                  <option value="" className="bg-[#111] text-zinc-300">Select a design style...</option>
                  <option value="minimalist" className="bg-[#111] text-zinc-300">Minimalist & Clean</option>
                  <option value="premium_dark" className="bg-[#111] text-zinc-300">Premium Dark Mode</option>
                  <option value="playful" className="bg-[#111] text-zinc-300">Playful & Colorful</option>
                  <option value="corporate" className="bg-[#111] text-zinc-300">Corporate & Professional</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Constraints & Rules */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-zinc-400" />
                Aturan & Batasan Tambahan (Opsional)
              </label>

              <div className="flex flex-wrap gap-2">
                {CONSTRAINT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (selectedConstraints.includes(opt.id)) {
                        setSelectedConstraints(selectedConstraints.filter(id => id !== opt.id));
                      } else {
                        setSelectedConstraints([...selectedConstraints, opt.id]);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-2 ${selectedConstraints.includes(opt.id)
                        ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                        : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700"
                      }`}
                  >
                    {selectedConstraints.includes(opt.id) && <Check className="w-3 h-3" />}
                    {opt.label.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Descriptions of selected constraints */}
              <AnimatePresence>
                {selectedConstraints.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 space-y-4 my-2">
                      <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-[0.2em]">Penjelasan Aturan:</p>
                      {CONSTRAINT_OPTIONS.filter(opt => selectedConstraints.includes(opt.id)).map(opt => (
                        <div key={opt.id} className="flex gap-3">
                          <div className="mt-1 w-1 h-3 rounded-full bg-blue-500 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-zinc-200 mb-0.5">{opt.label}</p>
                            <p className="text-[11px] text-zinc-400 leading-relaxed italic">{opt.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Frontend Visual Options */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-400" />
                Frontend & UI Polish (Premium)
              </label>

              <div className="grid grid-cols-1 gap-2">
                {FRONTEND_SPECIAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (selectedFrontendOptions.includes(opt.id)) {
                        setSelectedFrontendOptions(selectedFrontendOptions.filter(id => id !== opt.id));
                      } else {
                        setSelectedFrontendOptions([...selectedFrontendOptions, opt.id]);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                      selectedFrontendOptions.includes(opt.id)
                        ? "bg-blue-600/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                        : "border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${selectedFrontendOptions.includes(opt.id) ? "text-blue-400" : "text-zinc-200"}`}>
                        {opt.label.toUpperCase()}
                      </span>
                      {selectedFrontendOptions.includes(opt.id) && <Check className="w-4 h-4 text-blue-400" />}
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">{opt.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}

            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-zinc-400" />
                Key Features
              </label>

              {/* Suggested Features Shortcuts */}
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_FEATURES.map((feat) => (
                  <button
                    key={feat.id}
                    onClick={() => toggleSuggestedFeature(feat.id)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all flex items-center gap-1.5 ${features.includes(feat.id)
                      ? "bg-purple-600 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                      : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                      }`}
                  >
                    {features.includes(feat.id) && <Check className="w-3 h-3" />}
                    {feat.label.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Descriptions of selected features */}
              <AnimatePresence>
                {SUGGESTED_FEATURES.some(f => features.includes(f.id)) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 space-y-4 my-2">
                      <p className="text-[10px] font-bold text-purple-400/60 uppercase tracking-[0.2em]">Penjelasan Fitur Terpilih:</p>
                      {SUGGESTED_FEATURES.filter(feat => features.includes(feat.id)).map(feat => (
                        <div key={feat.id} className="flex gap-3">
                          <div className="mt-1 w-1 h-3 rounded-full bg-purple-500 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-zinc-200 mb-0.5">{feat.label}</p>
                            <p className="text-[11px] text-zinc-400 leading-relaxed italic">{feat.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2 mt-2">
                <AnimatePresence>
                  {features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(idx, e.target.value)}
                        placeholder="e.g. User Authentication"
                        className="flex-1 glass-input rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none"
                      />
                      <button
                        onClick={() => removeFeature(idx)}
                        className="p-2.5 rounded-xl border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors text-zinc-400 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <button
                onClick={addFeature}
                className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-sm font-bold text-zinc-100 hover:bg-white/5 hover:border-white/40 transition-all flex items-center justify-center gap-2 bg-transparent mt-2"
              >
                <Plus className="w-5 h-5 text-blue-400" />
                Add Feature
              </button>
            </div>
          </div>

          <div className="pt-4 mt-auto space-y-3">
            <div className="flex items-center justify-between px-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Server className="w-3 h-3" />
                Processing Mode
              </label>
              <button 
                onClick={() => setUseAi(!useAi)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all text-[10px] font-black ${
                  useAi 
                  ? "bg-purple-600/20 border-purple-500 text-purple-400" 
                  : "bg-zinc-800/50 border-zinc-700 text-zinc-500"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${useAi ? 'bg-purple-400 animate-pulse' : 'bg-zinc-600'}`} />
                {useAi ? "CLOUD AI (QUOTA)" : "LOCAL ENGINE (FREE)"}
              </button>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || isSimulating}
              className="w-full relative group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="relative w-full bg-blue-600 rounded-xl px-4 py-4 flex items-center justify-center gap-2 text-white font-bold transition-all shadow-lg hover:bg-blue-500 active:scale-[0.98] border border-blue-400/30">
                {(isLoading || isSimulating) ? (
                  <>
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                    <span className="tracking-wide uppercase">Processing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 text-white" />
                    <span className="tracking-wide text-base">Generate Master Prompt</span>
                  </>
                )}
              </div>
            </button>
          </div>

        </div>

        {/* Right Side: Generated Output / UI Preview */}
        <div className="flex-1 bg-[#0a0a0a] rounded-3xl overflow-hidden flex flex-col border border-zinc-800 relative shadow-2xl min-h-[600px]">
          {/* Output Header / Controls */}
          <div className="bg-[#111]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-4">
              <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setViewMode("visual")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "visual" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-400"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  VISUAL DESIGN
                </button>
                <button
                  onClick={() => setViewMode("code")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "code" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-400"
                  }`}
                >
                  <CodeIcon className="w-3.5 h-3.5" />
                  MASTER PROMPT
                </button>
              </div>
              
              {viewMode === "visual" && (
                <div className="hidden sm:flex items-center gap-1 ml-2 bg-zinc-900/50 p-1 rounded-lg border border-white/5">
                  <button onClick={() => setDeviceFrame("monitor")} className={`p-1.5 rounded ${deviceFrame === 'monitor' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-600'}`}>
                    <Monitor className="w-3 h-3" />
                  </button>
                  <button onClick={() => setDeviceFrame("tablet")} className={`p-1.5 rounded ${deviceFrame === 'tablet' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-600'}`}>
                    <Tablet className="w-3 h-3" />
                  </button>
                  <button onClick={() => setDeviceFrame("smartphone")} className={`p-1.5 rounded ${deviceFrame === 'smartphone' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-600'}`}>
                    <Smartphone className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={(!completion && !localCompletion) || isLoading || isSimulating}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium text-zinc-300"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
              <button
                onClick={handleCopy}
                disabled={(!completion && !localCompletion) || isLoading || isSimulating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium text-zinc-300"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
              </button>

            </div>
          </div>

          {/* Canvas Content Area */}
          <div className="flex-1 relative flex flex-col bg-zinc-950 overflow-hidden">
            <AnimatePresence mode="wait">
              {isSimulating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
                >
                  <div className="relative w-24 h-24 mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute inset-0 border-t-2 border-r-2 border-blue-500 rounded-full"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className="absolute inset-2 border-b-2 border-l-2 border-purple-500 rounded-full opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-widest mb-2">ARCHITECTING UI</h3>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                      />
                    ))}
                  </div>
                </motion.div>
              ) : null}

              {viewMode === "visual" ? (
                <motion.div
                  key="visual"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="flex-1 p-4 flex items-center justify-center overflow-hidden"
                >
                  <div 
                    className={`transition-all duration-700 bg-black rounded-[2rem] border-[8px] border-zinc-900 shadow-2xl relative overflow-hidden flex flex-col
                      ${deviceFrame === 'monitor' ? 'w-full h-full max-w-[95%] max-h-[90%]' : ''}
                      ${deviceFrame === 'tablet' ? 'w-[75%] h-[85%] max-w-[600px]' : ''}
                      ${deviceFrame === 'smartphone' ? 'w-[45%] h-[80%] max-w-[320px]' : ''}
                    `}
                  >
                    {/* Status Bar for mobile */}
                    {deviceFrame !== 'monitor' && (
                      <div className="h-6 bg-zinc-900 w-full flex justify-between px-6 pt-1">
                        <div className="text-[8px] font-bold text-zinc-500">9:41</div>
                        <div className="flex gap-1 items-center">
                           <div className="w-2 h-2 rounded-full bg-zinc-700" />
                           <div className="w-3 h-2 bg-zinc-700 rounded-sm" />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {MOCK_UI_SAMPLES[currentMockId as keyof typeof MOCK_UI_SAMPLES] || MOCK_UI_SAMPLES["Modern"]}
                    </div>
                    
                    {/* Home Indicator for mobile */}
                    {deviceFrame !== 'monitor' && (
                      <div className="h-4 bg-zinc-900 w-full flex justify-center items-center">
                        <div className="w-16 h-1 bg-zinc-700 rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Aesthetic Background Accents */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-20">
                    <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-blue-600/30 blur-[100px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-purple-600/30 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 p-6 font-mono text-sm leading-relaxed text-zinc-400 whitespace-pre-wrap overflow-y-auto bg-[#050505]"
                >
                  {(completion || localCompletion) ? (
                    <div className="prose prose-invert max-w-none prose-sm sm:prose-base focus:outline-none">
                      <ReactMarkdown>{completion || localCompletion}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-30 text-center gap-4">
                      <Terminal className="w-12 h-12 mb-2" />
                      <p className="max-w-[200px]">Prompt engineering logs will appear here after generation.</p>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Bottom Banner */}
          <div className="px-6 py-3 bg-blue-600/5 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Live Prototype Engine</span>
             </div>
             <span className="text-[10px] text-zinc-600 font-mono">RENDER_STATUS: 200 OK</span>
          </div>
        </div>

      </main>
    </div>
  );
}
