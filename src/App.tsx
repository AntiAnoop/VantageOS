import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import { 
  Diamond, 
  ArrowRight, 
  Play, 
  Receipt, 
  Shield, 
  BarChart3, 
  Brain, 
  Check, 
  X, 
  ChevronDown, 
  Menu,
  ShieldCheck,
  Zap,
  ClipboardList,
  Mail,
  Linkedin,
  MessageSquare
} from 'lucide-react';
import { cn } from './lib/utils';
import { useInView as useInViewObserver } from 'react-intersection-observer';

// --- Components ---

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'ghost' | 'largeCTA' | 'outline' | 'darkSecondary',
  size?: 'sm' | 'md' | 'lg' 
}) => {
  const variants = {
    primary: "bg-brand-accent text-white hover:bg-brand-accent-dark shadow-sm",
    secondary: "bg-white border border-brand-border-medium text-brand-text shadow-sm hover:bg-brand-subtle",
    ghost: "bg-transparent text-brand-accent hover:underline",
    largeCTA: "bg-brand-accent text-white text-lg hover:bg-brand-accent-dark shadow-md px-8 py-3",
    outline: "bg-transparent border border-white text-white hover:bg-white/10",
    darkSecondary: "bg-white text-brand-dark hover:bg-brand-subtle shadow-lg px-8 py-3 text-lg"
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6",
    lg: "h-12 px-8"
  };

  return (
    <motion.button
      whileHover={{ y: -1, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-sans font-semibold transition-all duration-200 cursor-pointer",
        variants[variant],
        variant !== 'largeCTA' && variant !== 'darkSecondary' && sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn(
    "inline-flex items-center bg-brand-accent-light text-brand-accent-dark px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider",
    className
  )}>
    {children}
  </div>
);

const CountUp = ({ end, duration = 2, prefix = "", suffix = "" }: { end: number, duration?: number, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInViewObserver({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const SectionHeader = ({ badge, title, sub, centered = false }: { badge: string, title: string, sub?: string, centered?: boolean }) => (
  <div className={cn("mb-16", centered && "text-center max-w-2xl mx-auto")}>
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="mb-4"
    >
      <Badge>{badge}</Badge>
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-2xl md:text-4xl font-serif font-bold text-brand-text mb-6 leading-[1.2] tracking-tight"
    >
      {title}
    </motion.h2>
    {sub && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-lg text-brand-secondary leading-relaxed"
      >
        {sub}
      </motion.p>
    )}
  </div>
);

// --- Sections ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Product', href: '#' },
    { name: 'Agents', href: '#agents' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Docs', href: '#' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent",
      scrolled && "backdrop-blur-xl bg-brand-bg/90 border-brand-border-light py-3",
      !scrolled && "py-5"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-brand-accent p-1.5 rounded-lg text-white">
            <Diamond size={20} />
          </div>
          <span className="text-2xl font-serif font-bold text-brand-text tracking-tight transition-colors group-hover:text-brand-accent">
            Vantage OS
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-brand-text/80 hover:text-brand-accent transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost">Log in</Button>
          <Button size="sm">Start Free Trial <ArrowRight size={16} className="ml-2" /></Button>
        </div>

        <button 
          className="md:hidden text-brand-text p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-brand-border-light overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-lg font-medium text-brand-text"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <hr className="border-brand-border-light" />
              <Button size="lg" className="w-full">Start Free Trial</Button>
              <Button variant="secondary" className="w-full">Log in</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-brand-bg flex flex-col items-center">
      {/* Subtle radial gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-brand-accent-light/50 blur-[120px] -z-10" />

      <div className="container max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Badge className="mb-8">⚡ Autonomous Growth Officer for D2C Brands</Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-4xl md:text-6xl font-serif font-extrabold text-brand-text leading-[1.15] tracking-tight max-w-[820px] mx-auto mb-8"
        >
          Your Brand is Leaking Money.<br />
          <span className="text-brand-accent">Here's the Proof.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="text-lg md:text-xl text-brand-secondary max-w-[580px] mx-auto mb-10 leading-relaxed font-sans"
        >
          Vantage OS is a private multi-agent operating system that audits your
          marketplace payouts, locks down inventory losses, and scales your ad
          spend — fully autonomously. No cloud. No data leaks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <Button variant="largeCTA" className="w-full sm:w-auto">
            Start Free Trial — 14 Days Free <ArrowRight size={18} className="ml-2" />
          </Button>
          <Button variant="secondary" className="w-full sm:w-auto px-8 py-3 h-auto text-lg flex gap-2">
            Watch a 2-min Demo <Play size={16} className="fill-brand-text" />
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-sm text-brand-muted mb-16"
        >
          No credit card required · Setup in under 20 minutes · Cancel anytime
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="relative max-w-[940px] mx-auto"
        >
          <div className="bg-brand-card rounded-[12px] border border-brand-border-light shadow-brand-hover overflow-hidden">
             {/* Header Mockup */}
             <div className="bg-brand-subtle/50 px-4 py-3 border-b border-brand-border-light flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-border-medium" />
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-border-medium" />
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-border-medium" />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">Vantage Control Hub</div>
                <div className="w-8" />
             </div>
             
             {/* Content Mockup */}
             <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4 md:space-y-6">
                  <div className="h-40 md:h-48 bg-brand-accent/5 rounded-xl border border-brand-accent/10 p-4 md:p-6 flex flex-col justify-end">
                    <div className="text-brand-muted text-[10px] font-mono mb-1 uppercase tracking-tight">Recovered in Payouts</div>
                    <div className="text-2xl md:text-4xl font-serif font-bold text-brand-accent">Rs. 4,20,530</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="bg-brand-subtle rounded-lg p-3 md:p-5">
                      <div className="text-[9px] md:text-[10px] uppercase font-bold text-brand-muted mb-1 md:mb-2">Orders Audited</div>
                      <div className="text-lg md:text-xl font-bold">2,842</div>
                    </div>
                    <div className="bg-brand-subtle rounded-lg p-3 md:p-5">
                      <div className="text-[9px] md:text-[10px] uppercase font-bold text-brand-muted mb-1 md:mb-2">Accuracy</div>
                      <div className="text-lg md:text-xl font-bold">99.94%</div>
                    </div>
                  </div>
                </div>
                <div className="bg-brand-dark p-4 md:p-6 rounded-xl font-mono text-[10px] md:text-[11px] text-white/50 leading-loose">
                  <div className="text-white/80 mb-4 border-b border-white/10 pb-2 flex justify-between">
                    <span>AGENT_STATUS</span>
                    <span className="text-emerald-400">ACTIVE</span>
                  </div>
                  <div className="space-y-3">
                    <p><span className="text-orange-400">[AUDITOR]</span> Reconciling bank reports... DONE</p>
                    <p><span className="text-blue-400">[SENTINEL]</span> Tracking 42 RTO events... OK</p>
                    <p><span className="text-emerald-400">[ARCHITECT]</span> Syncing Meta ROAS... OK</p>
                    <p className="border-l border-brand-accent/30 pl-2 ml-1 italic">⚠ DISCREPANCY DETECTED: Order #44182 filed for claim.</p>
                    <div className="flex gap-2 pt-2">
                       <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                       <span className="animate-pulse opacity-50">Listening for signals...</span>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SocialProof = () => {
  const partners = [
    "Amazon Seller Central",
    "Flipkart Seller Hub",
    "Shopify Plus",
    "Meta Ads Manager",
    "Google Ads",
    "Shiprocket",
    "Delhivery",
    "Ecom Express"
  ];

  return (
    <div className="bg-brand-subtle py-24 border-y border-brand-border-light overflow-hidden">
      <div className="container max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="shrink-0 text-center lg:text-left">
             <span className="text-[11px] font-black text-brand-muted uppercase tracking-[0.2em] block mb-2">Institutional Trust</span>
             <h3 className="text-xl font-serif font-bold text-brand-text">Trusted by Scale Brands on</h3>
          </div>

          <div className="h-px lg:h-12 w-full lg:w-px bg-brand-border-medium/50" />

          <div className="grid grid-cols-2 lg:flex lg:justify-around flex-grow gap-8 w-full">
            <div className="text-center col-span-1">
              <div className="text-2xl md:text-3xl font-serif font-bold text-brand-text mb-1">
                <CountUp end={4.2} duration={1.5} suffix=" Cr" prefix="Rs." />
              </div>
              <div className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Recovered</div>
            </div>
            <div className="text-center col-span-1">
              <div className="text-2xl md:text-3xl font-serif font-bold text-brand-text mb-1">
                <CountUp end={2800} duration={1.5} suffix="+" />
              </div>
              <div className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Audited Daily</div>
            </div>
            <div className="text-center col-span-2 lg:col-span-1 border-t lg:border-t-0 pt-6 lg:pt-0 border-brand-border-medium/30">
              <div className="text-2xl md:text-3xl font-serif font-bold text-brand-text mb-1">
                <CountUp end={99.4} duration={1.5} suffix="%" />
              </div>
              <div className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative flex overflow-hidden group">
        <div className="flex animate-marquee py-4">
          {[...partners, ...partners].map((partner, i) => (
            <div key={i} className="flex items-center justify-center px-12 shrink-0">
               <span className="text-lg md:text-xl font-serif font-bold text-brand-text/30 hover:text-brand-accent/60 transition-colors cursor-default whitespace-nowrap tracking-tight italic">
                 {partner}
               </span>
            </div>
          ))}
        </div>
        
        {/* Gradient overlays for smooth fade */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-brand-subtle to-transparent z-10" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-brand-subtle to-transparent z-10" />
      </div>
    </div>
  );
};

const ProblemStatement = () => {
  const problems = [
    { title: "Payout Discrepancies", desc: "Marketplaces underpay or overcharge fees.", loss: "Rs.18,000–Rs.80,000/month" },
    { title: "Inventory Shrinkage", desc: "Units lost between warehouse and customer.", loss: "2–6% of shipped volume" },
    { title: "Misallocated Ad Spend", desc: "Budget going to low-margin, high-return SKUs.", loss: "20–35% of ad budget" },
  ];

  return (
    <section className="py-24 bg-brand-bg">
      <div className="container max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <SectionHeader 
            badge="The Problem"
            title="Most Brands Don't Fail from Low Sales. They Fail from Invisible Losses."
          />
          <div className="space-y-6 text-brand-secondary text-lg leading-relaxed">
            <p>Marketplaces like Amazon and Flipkart silently underpay you. Returned packages vanish before they reach your warehouse. Your ad budget burns on products that have no margin left.</p>
            <p>For most D2C brands doing Rs.50L+/month, the "Gray Zone" quietly erases <span className="font-bold text-brand-text underline decoration-brand-accent/30 decoration-4 underline-offset-4">8–15% of true profit</span>.</p>
            <p>Vantage OS was built to find every rupee in that gray zone — and bring it back.</p>
          </div>
        </div>

        <div className="bg-brand-card rounded-2xl p-8 shadow-brand-card border border-brand-border-light relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-agent-auditor/10 blur-[60px]" />
          <h3 className="text-xl font-semibold mb-8 border-b border-brand-border-light pb-4">Gray Zone Breakdown</h3>
          <div className="space-y-8">
            {problems.map((p, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-agent-auditor">
                 <div className="flex items-center gap-2 mb-1">
                   <div className="font-sans font-bold text-[15px]">{p.title}</div>
                 </div>
                 <p className="text-[13px] text-brand-secondary mb-1">{p.desc}</p>
                 <div className="text-[12px] font-bold text-agent-auditor">Avg. loss: {p.loss}</div>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-agent-auditor/5 rounded-lg p-4 border border-agent-auditor/10">
            <p className="text-[12px] text-center font-medium italic text-brand-secondary">
               "Hidden fees are costing Indian sellers over Rs. 4,000 Cr yearly."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const AgentCard = ({ agent, index }: { agent: any, index: number, key?: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08 }}
    whileHover={{ y: -4, backgroundColor: `rgba(${agent.colorRgb}, 0.03)` }}
    className={cn(
      "bg-brand-card rounded-xl border border-brand-border-light p-8 shadow-brand-card transition-all duration-300",
      "hover:shadow-brand-hover"
    )}
    style={{ borderLeft: `6px solid ${agent.color}` }}
  >
    <div className="flex items-start justify-between mb-6">
      <div className="p-3 rounded-lg" style={{ backgroundColor: `${agent.color}15`, color: agent.color }}>
        <agent.icon size={24} />
      </div>
      <div className="bg-brand-subtle px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-brand-muted border border-brand-border-light">
        {agent.tag}
      </div>
    </div>
    <h3 className="text-xl font-bold mb-3">{agent.name}</h3>
    <p className="text-sm text-brand-secondary leading-relaxed mb-6 h-12">
      {agent.desc}
    </p>
    <ul className="space-y-3">
      {agent.bullets.map((bullet: string, i: number) => (
        <li key={i} className="flex gap-3 text-[13px] text-brand-text">
          <Check size={14} className="shrink-0 mt-0.5" style={{ color: agent.color }} />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const AgentsShowcase = () => {
  const agents = [
    {
      name: "The Auditor",
      tag: "Finance Agent",
      color: "#E8590C",
      colorRgb: "232, 89, 12",
      icon: Receipt,
      desc: "Reconciles every rupee between your marketplace payouts and actual bank settlements.",
      bullets: [
        "Compares Shopify/Amazon/Flipkart orders vs bank settlements",
        "Detects short-payments, excess fees, missing credits",
        "Auto-drafts dispute claims with proof attached",
        "Daily payout report delivered at 7 AM"
      ]
    },
    {
      name: "The Sentinel",
      tag: "Logistics Agent",
      color: "#1A6BFF",
      colorRgb: "26, 107, 255",
      icon: Shield,
      desc: "Tracks every unit from warehouse to customer and back — flags anything that disappears.",
      bullets: [
        "Monitors Return-to-Origin (RTO) packages in real time",
        "Confirms returned units are scanned back into inventory",
        "Flags units lost in transit as formal loss events",
        "Syncs with Shiprocket, Delhivery, Ecom Express"
      ]
    },
    {
      name: "The Architect",
      tag: "Marketing Agent",
      color: "#0D9467",
      colorRgb: "13, 148, 103",
      icon: BarChart3,
      desc: "Manages your Meta and Google ad spend based on real margin data — not just ROAS.",
      bullets: [
        "Pulls live data from Meta Ads, Google Ads, Shopify",
        "Calculates True ROAS (after returns, fees, COD losses)",
        "Reallocates budget toward high-LTV, low-return products",
        "Pauses or scales campaigns based on stock levels"
      ]
    },
    {
      name: "The Strategist",
      tag: "Pricing & Sales Agent",
      color: "#7C3AED",
      colorRgb: "124, 58, 237",
      icon: Brain,
      desc: "Adjusts prices and bundles dynamically based on inventory levels and margin targets.",
      bullets: [
        "Monitors live stock levels across all SKUs",
        "Triggers smart bundles when inventory is high",
        "Raises prices automatically when stock is low",
        "Protects minimum margin thresholds you define"
      ]
    }
  ];

  return (
    <section id="agents" className="py-24 bg-brand-subtle">
      <div className="container max-w-7xl mx-auto px-6">
        <SectionHeader 
          badge="The Workforce"
          title="Four Agents. One Operating System. Working 24/7 So You Don't Have To."
          sub="Each agent has a specific job, a specific data source, and a specific outcome it owns. They talk to each other in real time."
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent, i) => <AgentCard key={i} agent={agent} index={i} />)}
        </div>
      </div>
    </section>
  );
};

const CommandLogTerminal = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [lineIndex, setLineIndex] = useState(0);

  const rawLogs = [
    "[09:14:31] SYSTEM      →  Good morning. Starting daily audit sweep...",
    "[09:14:32] AUDITOR     →  Pulling Amazon settlement report for Sep 13...",
    "[09:14:33] AUDITOR     →  ⚠ SHORT-PAYMENT  Order #AMZ-441829 — Rs.2,340 underpaid",
    "[09:14:34] AUDITOR     →  ⚠ SHORT-PAYMENT  Order #AMZ-441901 — Rs.890 underpaid",
    "[09:14:35] AUDITOR     →  Drafting dispute claims. Attaching proof of delivery.",
    "[09:14:36] SENTINEL    →  Cross-referencing RTO log for flagged orders...",
    "[09:14:37] SENTINEL    →  ✗ LOSS EVENT  Unit for #AMZ-441829 not scanned at warehouse",
    "[09:14:38] SENTINEL    →  Filing loss report. Updating inventory count.",
    "[09:14:39] STRATEGIST  →  Adjusting Q3 margin forecast. Net impact: −Rs.3,230 today",
    "[09:14:40] ARCHITECT   →  Checking Meta campaign performance vs updated margins...",
    "[09:14:41] ARCHITECT   →  Pausing Campaign #14 \"Diwali Restocks\" — True ROAS: 1.2×",
    "[09:14:42] STRATEGIST  →  SKU-884 stock: 6 units remaining. Raising price by 12%.",
    "[09:14:43] SYSTEM      →  ✓ Morning sweep complete. 2 disputes filed. 1 campaign paused."
  ];

  useEffect(() => {
    if (lineIndex < rawLogs.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, rawLogs[lineIndex]]);
        setLineIndex(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const resetTimer = setTimeout(() => {
        setLogs([]);
        setLineIndex(0);
      }, 3000);
      return () => clearTimeout(resetTimer);
    }
  }, [lineIndex]);

  const renderLogContent = (log: string) => {
    const timestampMatch = log.match(/^\[(.*?)\]/);
    const timestamp = timestampMatch ? timestampMatch[0] : "";
    const rest = log.replace(timestamp, "").trim();
    
    let colorClass = "text-white/50";
    if (rest.startsWith("SYSTEM")) colorClass = "text-white/40";
    if (rest.startsWith("AUDITOR")) colorClass = "text-agent-auditor";
    if (rest.startsWith("SENTINEL")) colorClass = "text-agent-sentinel font-bold";
    if (rest.startsWith("ARCHITECT")) colorClass = "text-agent-architect";
    if (rest.startsWith("STRATEGIST")) colorClass = "text-agent-strategist";

    const content = rest.split("→")[1] || "";
    const agent = rest.split("→")[0] || "";

    return (
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mb-2 sm:mb-0">
        <div className="flex items-center gap-3">
          <span className="text-white/20 text-[10px] sm:text-[13px] whitespace-nowrap">{timestamp}</span>
          <span className={cn("shrink-0 tracking-tight text-[11px] sm:text-[13px]", colorClass)}>{agent}</span>
        </div>
        <span className={cn(
          "text-white/80 text-[12px] sm:text-[13px]",
          content.includes("⚠") && "text-yellow-400",
          content.includes("✗") && "text-red-400",
          content.includes("✓") && "text-emerald-400"
        )}>
          {content}
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-[840px] mx-auto bg-[#0A0D11] rounded-2xl overflow-hidden shadow-brand-modal border border-white/10 mx-4 sm:mx-auto">
      <div className="bg-[#1A1D24] px-4 sm:px-5 py-3 sm:py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex gap-1.5 sm:gap-2">
          <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="text-[10px] sm:text-[12px] font-mono uppercase tracking-[0.1em] sm:tracking-[0.2em] text-white/30 font-semibold truncate px-2">Vantage OS — Command Feed</div>
        <div className="w-6 sm:w-10" />
      </div>
      <div className="p-4 sm:p-8 font-mono text-[13px] leading-relaxed min-h-[400px] sm:min-h-[480px]">
        <div className="space-y-4 sm:space-y-2">
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderLogContent(log)}
            </motion.div>
          ))}
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-2 h-4 bg-white/40 ml-[160px] inline-block mt-1"
          />
        </div>
      </div>
    </div>
  );
};

const LiveDemo = () => {
  return (
    <section className="py-24 bg-brand-dark text-white">
      <div className="container max-w-7xl mx-auto px-6 mb-16 text-center">
        <motion.div
           initial={{ opacity: 0, x: -12 }}
           whileInView={{ opacity: 1, x: 0 }}
           className="mb-4"
        >
          <Badge className="bg-brand-accent/20 text-brand-accent border border-brand-accent/30">Live Reasoning Feed</Badge>
        </motion.div>
        <motion.h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 tracking-tight">
          Watch Your Agents Think Out Loud.
        </motion.h2>
        <motion.p className="text-lg text-white/60 max-w-xl mx-auto">
          This isn't a chart. This is a live reasoning feed — your agents communicating, cross-referencing, and taking action in real time.
        </motion.p>
      </div>

      <CommandLogTerminal />

      <div className="container max-w-7xl mx-auto px-6 mt-16 flex flex-wrap justify-center gap-4">
        {[
          { icon: ShieldCheck, label: "Zero-Trust Private Infrastructure" },
          { icon: Zap, label: "Real-Time Agent Coordination" },
          { icon: ClipboardList, label: "Full Audit Trail" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[12px] text-white/70">
            <item.icon size={14} className="text-brand-accent" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const Infrastructure = () => {
  const comparison = [
    { feature: "Data Storage", saas: "Their cloud", vantage: "Your VPS", vantageOk: true },
    { feature: "Model Training", saas: "Uses ur data", vantage: "Never", vantageOk: true },
    { feature: "Data Breach Risk", saas: "High", vantage: "Near-zero", vantageOk: true },
    { feature: "Pricing Model", saas: "% of revenue", vantage: "Flat monthly", vantageOk: true },
    { feature: "Customization", saas: "Limited", vantage: "Full control", vantageOk: true },
    { feature: "Agent Logic Ownership", saas: "Black box", vantage: "You own it", vantageOk: true },
  ];

  return (
    <section className="py-24 bg-brand-bg">
      <div className="container max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <SectionHeader 
            badge="The Sovereign Difference"
            title="Your Business Secrets Stay Your Secrets."
            sub="Most AI tools are SaaS products. Your margins, supplier costs, and actual profit numbers train their models. It's visible to their team. It can be breached."
          />
          <div className="space-y-6 text-brand-secondary text-lg leading-relaxed">
            <p>Vantage OS deploys on your own private VPS. It uses local LLMs or private API gateways. Your data never leaves your infrastructure.</p>
            <p className="font-bold text-brand-text">The brain of your business belongs to you.</p>
            <Button variant="ghost" className="p-0 h-auto text-lg flex items-center gap-2">
               Learn about Sovereign Infrastructure <ArrowRight size={20} />
            </Button>
          </div>
        </div>

        <div className="bg-brand-card rounded-2xl shadow-brand-card border border-brand-border-light overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[480px]">
              <div className="grid grid-cols-[1.5fr_1fr_1.2fr] border-b border-brand-border-light divide-x divide-brand-border-light">
                <div className="p-4 sm:p-5 font-bold text-[10px] sm:text-xs uppercase text-brand-muted tracking-widest">Feature</div>
                <div className="p-4 sm:p-5 font-bold text-[10px] sm:text-xs uppercase text-brand-muted tracking-widest text-center">Typical SaaS</div>
                <div className="p-4 sm:p-5 font-bold text-[10px] sm:text-xs uppercase text-brand-accent tracking-widest text-center">Vantage OS</div>
              </div>
              <div className="divide-y divide-brand-border-light">
                {comparison.map((row, i) => (
                  <div key={i} className="grid grid-cols-[1.5fr_1fr_1.2fr] divide-x divide-brand-border-light group">
                    <div className="p-4 sm:p-5 text-xs sm:text-sm font-medium text-brand-text group-hover:bg-brand-subtle/50 transition-colors">{row.feature}</div>
                    <div className="p-4 sm:p-5 text-xs sm:text-sm text-brand-muted text-center flex items-center justify-center gap-2 group-hover:bg-brand-subtle/50 transition-colors">
                      <X size={14} className="text-red-500 shrink-0" />
                      {row.saas}
                    </div>
                    <div className="p-4 sm:p-5 text-xs sm:text-sm text-brand-accent font-semibold text-center flex items-center justify-center gap-2 bg-brand-accent/5 group-hover:bg-brand-accent/10 transition-colors">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      {row.vantage}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-6 bg-brand-subtle/30 text-center text-[10px] sm:text-xs text-brand-muted">
            100% Data Sovereignty Guaranteed
          </div>
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      name: "Starter",
      description: "For brands up to Rs.50L/month",
      price: billing === 'annual' ? "14,999" : "18,999",
      period: "/month",
      cta: "Start Free Trial",
      billing: "billed annually",
      features: [
        { text: "The Auditor (Payout Reconciliation)", included: true },
        { text: "The Sentinel (Logistics & RTO)", included: true },
        { text: "Up to 2 marketplace integrations", included: true },
        { text: "Daily email reports", included: true },
        { text: "1 VPS deployment", included: true },
        { text: "The Architect (Marketing Agent)", included: false },
        { text: "The Strategist (Pricing Agent)", included: false },
      ]
    },
    {
      name: "Growth",
      popular: true,
      description: "For brands doing up to Rs. 2Cr/month",
      price: billing === 'annual' ? "29,999" : "36,999",
      period: "/month",
      cta: "Start Free Trial",
      billing: "billed annually",
      features: [
        { text: "Everything in Starter", included: true },
        { text: "The Architect (Marketing Agent)", included: true },
        { text: "The Strategist (Pricing Agent)", included: true },
        { text: "Up to 5 integrations", included: true },
        { text: "Live Command Log access", included: true },
        { text: "Slack + WhatsApp alerts", included: true },
        { text: "Priority onboarding (2-day)", included: true },
      ]
    },
    {
      name: "Sovereign",
      description: "For brands doing Rs.2Cr+/month",
      price: "Custom",
      period: "",
      cta: "Book a Call",
      billing: "custom deployment",
      features: [
        { text: "Everything in Growth", included: true },
        { text: "Custom agent workflows", included: true },
        { text: "Dedicated n8n environment", included: true },
        { text: "White-glove onboarding", included: true },
        { text: "Direct Slack with founders", included: true },
        { text: "NDA + Private Audit", included: true },
        { text: "SLA-guaranteed uptime", included: true },
      ]
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-brand-subtle">
      <div className="container max-w-7xl mx-auto px-6">
        <SectionHeader 
          badge="Pricing"
          title="Simple Pricing. No % of Revenue. Ever."
          sub="Flat monthly fee. Cancel anytime. We don't take a cut of what we recover for you."
          centered
        />

        <div className="flex flex-col items-center mb-12">
          <div className="bg-brand-card p-1.5 rounded-[12px] border border-brand-border-medium flex items-center shadow-brand-card">
            <button 
              className={cn("px-6 py-2 text-sm font-semibold rounded-lg transition-all", billing === 'monthly' ? "bg-brand-accent text-white" : "text-brand-muted hover:text-brand-text")}
              onClick={() => setBilling('monthly')}
            >
              Monthly
            </button>
            <button 
              className={cn("px-6 py-2 text-sm font-semibold rounded-lg transition-all relative flex items-center gap-2", billing === 'annual' ? "bg-brand-accent text-white" : "text-brand-muted hover:text-brand-text")}
              onClick={() => setBilling('annual')}
            >
              Annual
              <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded uppercase font-black">Save 15%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={cn(
                "bg-brand-card rounded-2xl border p-10 flex flex-col transition-all duration-300",
                plan.popular ? "border-brand-accent shadow-brand-hover ring-1 ring-brand-accent ring-inset" : "border-brand-border-light shadow-brand-card hover:shadow-brand-hover"
              )}
            >
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold font-serif">{plan.name}</h3>
                  {plan.popular && <Badge className="bg-brand-accent text-white border-0 py-1">Most Popular</Badge>}
                </div>
                <div className="mb-2">
                   {plan.price !== "Custom" && <span className="text-sm text-brand-muted font-bold mr-1 align-top mt-2">Rs.</span>}
                   <span className="text-5xl font-black font-serif tracking-tight">{plan.price}</span>
                   <span className="text-brand-muted text-sm font-medium">{plan.period}</span>
                </div>
                <div className="text-[11px] text-brand-muted font-bold uppercase tracking-wider">{plan.billing}</div>
                <p className="mt-4 text-sm text-brand-secondary h-5">{plan.description}</p>
              </div>

              <div className="mb-10 grow">
                <ul className="space-y-4">
                   {plan.features.map((f, j) => (
                     <li key={j} className={cn("flex gap-3 text-sm", !f.included && "text-brand-muted")}>
                        {f.included ? <Check size={16} className="text-brand-accent shrink-0 mt-0.5" /> : <X size={16} className="text-brand-muted/50 shrink-0 mt-0.5" />}
                        <span className={!f.included ? "line-through opacity-50" : "font-medium"}>{f.text}</span>
                     </li>
                   ))}
                </ul>
              </div>

              <Button 
                variant={plan.popular ? "primary" : "secondary"} 
                className="w-full h-12 text-sm uppercase tracking-widest font-black"
              >
                {plan.cta} {plan.cta.includes('Trial') && <ArrowRight size={16} className="ml-2" />}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-brand-muted text-sm space-y-2">
          <p>🔒 14-day free trial · No credit card required · Cancel anytime</p>
          <p>All plans include: Private VPS deployment · Zero data sharing · Full audit trail</p>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    { q: "Do I need a server to run Vantage OS?", a: "Yes — Vantage OS runs on a private VPS you control. We recommend any cloud VPS with 8GB+ RAM (DigitalOcean, Hetzner, or AWS Lightsail). During onboarding, we deploy onto your server or help you set one up. Extra cost: typically Rs.1,500–Rs.3,000/month." },
    { q: "Will Vantage OS access my bank account?", a: "No. The Auditor reads your bank settlement reports (CSV/PDF exports) and marketplace payout reports. It never has login access to your bank. All data stays on your VPS." },
    { q: "Which platforms does it integrate with?", a: "Currently supported: Amazon Seller Central, Flipkart Seller Hub, Shopify, Meta Ads, Google Ads, Shiprocket, Delhivery, and Ecom Express. More integrations are added monthly." },
    { q: "How long does setup take?", a: "Starter plan: self-setup in ~20 minutes with our docs. Growth plan: 2-day assisted onboarding. Sovereign plan: fully done-for-you in 5–7 business days." },
    { q: "What if an agent makes a wrong decision?", a: "Agents flag and recommend — they don't take irreversible action without your approval by default. You set \"autonomous mode\" for low-risk actions and \"approval required\" for high-stakes ones." },
    { q: "What is OpenClaw?", a: "OpenClaw is the multi-agent coordination framework Vantage OS is built on. It allows agents to share context, hand off tasks, and reason together — rather than running in isolated silos like traditional automation tools." }
  ];

  return (
    <section className="py-24 bg-brand-bg">
      <div className="container max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <SectionHeader 
             badge="Frequently Asked"
             title="Everything You Want to Know Before You Buy."
          />
        </div>
        <div className="space-y-4">
           {faqs.map((faq, i) => (
             <div key={i} className={cn(
               "border-b border-brand-border-light transition-all duration-300",
               openIndex === i && "bg-brand-subtle/30 rounded-xl px-2"
             )}>
                <button 
                  className="w-full py-6 flex items-center justify-between text-left group"
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                >
                   <span className="font-semibold text-brand-text group-hover:text-brand-accent transition-colors">{faq.q}</span>
                   <motion.div 
                     animate={{ rotate: openIndex === i ? 180 : 0 }}
                     className="text-brand-muted"
                   >
                     <ChevronDown size={20} />
                   </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                       <p className="pb-6 text-brand-secondary leading-relaxed text-sm">
                         {faq.a}
                       </p>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-24 bg-brand-dark overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-accent/5 blur-[120px]" />
      <div className="container max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-serif font-bold text-white mb-8 leading-[1.2] tracking-tight"
        >
          Stop Auditing Spreadsheets at Midnight.<br />
          <span className="text-brand-accent">Let Your Agents Do It.</span>
        </motion.h2>
        <motion.p className="text-xl text-white/50 mb-12 max-w-xl mx-auto">
          Start your 14-day free trial. No credit card needed. See how much Vantage OS recovers in your first week.
        </motion.p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
           <Button variant="darkSecondary">Start Free Trial — 14 Days Free <ArrowRight size={20} className="ml-2" /></Button>
           <Button variant="outline" size="lg" className="px-8 h-[52px] flex gap-2">Talk to a Founder <MessageSquare size={18} /></Button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 text-[13px] text-white/30 uppercase tracking-[0.2em] font-bold">
           <span>🔒 Private Infrastructure</span>
           <span>⚡ Live in 20 Minutes</span>
           <span>✓ Cancel Anytime</span>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-brand-bg pt-20 border-t border-brand-border-light">
      <div className="container max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-brand-accent p-1.5 rounded-lg text-white">
                <Diamond size={20} />
              </div>
              <span className="text-2xl font-serif font-bold text-brand-text">Vantage OS</span>
            </div>
            <p className="text-brand-secondary text-sm leading-relaxed max-w-xs">
              The Autonomous Growth Officer for D2C brands. Built for the modern marketplace founder.
            </p>
            <div className="flex gap-4">
               <a href="#" className="p-2 bg-brand-subtle rounded-lg text-brand-muted hover:text-brand-accent transition-colors">
                  <Linkedin size={20} />
               </a>
               <a href="#" className="p-2 bg-brand-subtle rounded-lg text-brand-muted hover:text-brand-accent transition-colors">
                  <Mail size={20} />
               </a>
            </div>
          </div>

          <div>
             <h4 className="font-bold text-brand-text uppercase text-[11px] tracking-[0.2em] mb-6">Product</h4>
             <ul className="space-y-4 text-[14px] text-brand-secondary">
               <li><a href="#" className="hover:text-brand-accent transition-colors">Agents</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">Pricing</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">Integrations</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">Changelog</a></li>
             </ul>
          </div>

          <div>
             <h4 className="font-bold text-brand-text uppercase text-[11px] tracking-[0.2em] mb-6">Company</h4>
             <ul className="space-y-4 text-[14px] text-brand-secondary">
               <li><a href="#" className="hover:text-brand-accent transition-colors">About</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">Blog</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">Contact</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">Career</a></li>
             </ul>
          </div>

          <div>
             <h4 className="font-bold text-brand-text uppercase text-[11px] tracking-[0.2em] mb-6">Get Started</h4>
             <ul className="space-y-4 text-[14px] text-brand-secondary">
               <li><a href="#" className="font-bold text-brand-accent">Start Free Trial →</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">Book a Demo</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">Talk to Sales</a></li>
               <li className="pt-2 text-[12px] opacity-60">Status: <span className="text-emerald-500 font-bold">ALL SYSTEMS GO</span></li>
             </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-brand-border-light py-8 px-6">
        <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-brand-muted">
           <p>© 2025 Vantage OS. All rights reserved.</p>
           <div className="flex gap-8">
             <a href="#" className="hover:text-brand-accent transition-colors">Privacy</a>
             <a href="#" className="hover:text-brand-accent transition-colors">Terms</a>
             <a href="#" className="hover:text-brand-accent transition-colors">Contact</a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="bg-brand-bg min-h-screen">
      <Navbar />
      <Hero />
      <SocialProof />
      <LiveDemo />
      <ProblemStatement />
      <AgentsShowcase />
      <Infrastructure />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}
