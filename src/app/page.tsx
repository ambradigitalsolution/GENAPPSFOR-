"use client";

import { useState, FormEvent, useEffect } from "react";
import { Sparkles, Terminal, Copy, Check, Wand2, Plus, X, Server, Palette, Rocket, Layers, Loader2, ChevronDown, Download, ShieldAlert, Zap, Wand } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompletion } from "@ai-sdk/react";
import { Toaster, toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";

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

export default function Home() {
  const [copied, setCopied] = useState(false);

  // Form States
  const [appName, setAppName] = useState("");
  const [appPurpose, setAppPurpose] = useState("");
  const [techStack, setTechStack] = useState<string[]>(["Next.js 14", "Tailwind CSS", "TypeScript"]);
  const [designVibe, setDesignVibe] = useState("");
  const [features, setFeatures] = useState(["User Authentication", "Database Integration"]);
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

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
    if (!completion) return;
    navigator.clipboard.writeText(completion);
    setCopied(true);
    toast.success("Copied to clipboard!", { icon: '📋' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!completion) return;
    const blob = new Blob([completion], { type: 'text/markdown' });
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

    const compiledPrompt = `
You are a world-class Prompt Engineer specializing in AI-assisted coding (for Cursor, Copilot, ChatGPT).
Your task is to generate a comprehensive, highly-structured "Master System Prompt". The user will copy-paste your output directly into their AI coding tool to build an application.

# APP CONTEXT
- Name: ${appName}
- Purpose: ${appPurpose}
- UI/UX Vibe: ${designVibe || "Clean & Minimalist"}

# TECH STACK REQUIRED
${techStack.map(t => `- ${t}`).join('\n')}

# CORE FEATURES
${features.filter(f => f.trim() !== "").map((f, i) => `${i + 1}. ${f}`).join('\n')}

${compiledConstraints.trim() !== "" ? `# CONSTRAINTS & RULES\n${compiledConstraints}\n` : ""}
INSTRUCTIONS FOR GENERATING THE MASTER PROMPT:
1. Format the output using structured sections ([CONTEXT], [TECH STACK], [RULES], [FILE STRUCTURE], [CORE TASKS]).
2. Include strict rules in the output prompt to prevent the AI from using deprecated packages or writing buggy placeholder code.
3. Instruct the AI coder to think step-by-step: design architecture first, code second.
4. If there are database requirements implied by the features, explicitly design the data models.
5. ONLY output the master prompt itself using markdown. Do not add conversational filler before or after your block.
`;

    complete(compiledPrompt);
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

          <div className="pt-4 mt-auto">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full relative group disabled:opacity-70 disabled:cursor-not-allowed"
            >

              <div className="relative w-full bg-blue-600 rounded-xl px-4 py-4 flex items-center justify-center gap-2 text-white font-bold transition-all shadow-lg hover:bg-blue-500 active:scale-[0.98] border border-blue-400/30">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                    <span className="tracking-wide">GENERATING...</span>
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

        {/* Right Side: Generated Output Terminal */}
        <div className="flex-1 bg-black rounded-3xl overflow-hidden flex flex-col border border-zinc-800 relative shadow-2xl">
          {/* Terminal Header */}
          <div className="bg-[#111111]/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-2 text-zinc-300 text-sm font-medium ml-2">
                <Terminal className="w-4 h-4" />
                <span>output.prompt</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={!completion || isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium text-zinc-300"
              >
                <Download className="w-3.5 h-3.5" />
                Export .md
              </button>
              <button
                onClick={handleCopy}
                disabled={!completion || isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium text-zinc-300"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="flex-1 p-6 relative overflow-y-auto font-mono text-sm leading-relaxed text-zinc-300 bg-[#0a0a0a]/50 whitespace-pre-wrap">
            <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[#0a0a0a]/50 to-transparent pointer-events-none z-10" />

            {isLoading && !completion ? (
              <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                <p className="animate-pulse">Crafting your master prompt...</p>
              </div>
            ) : completion ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <div className="prose prose-invert max-w-none prose-sm sm:prose-base focus:outline-none">
                  <ReactMarkdown>{completion}</ReactMarkdown>
                </div>
                {isLoading && <span className="inline-block w-2 h-4 bg-zinc-300 ml-1 animate-pulse mt-2" />}
              </motion.div>
            ) : (
              <>
                <p className="opacity-50 italic mb-4">
                  {"// Waiting for input... Press 'Generate Master Prompt' to start."}
                </p>

                <div className="space-y-4 opacity-50 select-none">
                  <p>
                    <span className="text-purple-400"># ROLE:</span> Expert Fullstack Developer & Architect
                  </p>
                  <p>
                    <span className="text-blue-400"># CONTEXT:</span> I am conceptualizing a new application called `[APP_NAME]`.
                    Its primary purpose is to `[APP_PURPOSE]`.
                  </p>
                  <p>
                    <span className="text-green-400"># TECH STACK:</span> The required technologies are:
                    <br />- `[TECH_1]`
                    <br />- `[TECH_2]`
                  </p>
                  <p>
                    <span className="text-yellow-400"># FEATURES MINIMUM VIABLE PRODUCT:</span>
                    <br />1. `[FEATURE_1]`
                    <br />2. `[FEATURE_2]`
                  </p>
                  <p className="text-zinc-500 mt-8">
                    Generate the skeleton code... █
                  </p>
                </div>
              </>
            )}
          </div>

          {completion && !isLoading && (
            <div className="absolute bottom-6 right-6 flex gap-3 z-20">
              <button
                onClick={() => handleGenerate()}
                className="px-4 py-2 rounded-xl border border-white/10 bg-[#111] hover:bg-[#222] transition-colors text-sm text-zinc-300 flex items-center gap-2 shadow-lg glass"
              >
                Regenerate
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
