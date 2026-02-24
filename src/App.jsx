import React, { useState } from 'react';
import { 
  FileText, 
  PenTool, 
  Check, 
  ArrowLeft, 
  Copy, 
  Zap, 
  User, 
  Menu, 
  X, 
  ChevronRight, 
  Globe, 
  Sparkles,
  RefreshCw,
  Type,
  Layout,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';

/**
 * AI ToolSphere - Premium UI Hub
 * Custom tailored for tools.buildbyalistar.com
 */

// --- Shared UI Components ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700',
    purple: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-500/20',
  };

  return (
    <button 
      className={`px-4 py-2.5 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = 'free' }) => {
  const styles = {
    free: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    pro: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    new: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- View: Dashboard ---

const Dashboard = ({ onSelectTool }) => {
  const categories = [
    {
      title: 'AI Writing Tools',
      icon: <PenTool className="w-5 h-5 text-indigo-400" />,
      items: [
        { id: 'bio-writer', name: 'Bio Writer', description: 'Craft a compelling professional bio in 10 seconds.', badge: 'Free' },
        { id: 'headline-gen', name: 'Headline Generator', description: 'Generate scroll-stopping headlines for any content.', badge: 'Free' },
        { id: 'content-repurposer', name: 'Content Repurposer', description: 'Turn one piece of content into many formats instantly.', badge: 'Pro' }
      ]
    },
    {
      title: 'PDF Tools',
      status: 'Coming Soon',
      icon: <FileText className="w-5 h-5 text-red-400" />,
      items: [
        { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDFs into one file.', badge: 'Free' },
        { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce PDF size without losing quality.', badge: 'Free' }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-zinc-500">
          <Globe className="w-3.5 h-3.5" />
          <span>At ToolSphere: tools.buildbyalistar.com</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          One platform.<br />
          <span className="text-zinc-500">Every tool you need.</span>
        </h1>
        <p className="text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
          PDF tools, AI image tools, and AI writing tools — all in one place. 
          No switching tabs. No subscriptions maze.
        </p>
        <div className="pt-4 flex flex-col items-center gap-4">
          <Button variant="purple" className="px-10 py-4 text-lg" onClick={() => document.getElementById('tools').scrollIntoView({ behavior: 'smooth' })}>
            <Zap className="w-5 h-5 fill-current" />
            Open your tools
          </Button>
          <div className="flex gap-6 text-[11px] text-zinc-600 uppercase font-bold tracking-widest">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> 10 free runs/mo</span>
          </div>
        </div>
      </section>

      {/* Tool Categories Grid */}
      <div id="tools" className="grid grid-cols-1 gap-16">
        {categories.map((cat, i) => (
          <div key={i} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">{cat.icon}</div>
              <h2 className="text-xl font-bold">{cat.title}</h2>
              {cat.status && <Badge variant="free">{cat.status}</Badge>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cat.items.map((tool) => (
                <div 
                  key={tool.id} 
                  onClick={() => !cat.status && onSelectTool(tool)}
                  className={`bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl transition-all group ${cat.status ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-zinc-600 hover:bg-zinc-900/60'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-lg bg-white/5 group-hover:text-indigo-400 transition-colors">{cat.icon}</div>
                    <Badge variant={tool.badge.toLowerCase()}>{tool.badge}</Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                  <p className="text-zinc-500 text-sm mb-6">{tool.description}</p>
                  <div className="text-[11px] font-bold text-zinc-600 uppercase flex items-center group-hover:text-indigo-400 transition-colors">
                    Open tool <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 border-t border-zinc-900">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Simple, honest pricing</h2>
          <p className="text-zinc-500">Transparent value for creators and teams.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: 'Free', price: '$0', features: ['10 tool runs / month', 'Basic AI Writing', '7-day History'] },
            { name: 'Pro', price: '$12', popular: true, features: ['Unlimited tool runs', 'Full AI Suite', 'PDF Tools', 'AI Image Tools', 'Priority Support'] },
            { name: 'Team', price: '$39', features: ['5 team seats', 'Shared workspace', 'API Access', 'Enterprise Security'] }
          ].map((plan, i) => (
            <div key={i} className={`p-8 rounded-3xl border ${plan.popular ? 'bg-zinc-900 border-purple-500/50 relative' : 'bg-zinc-950 border-zinc-800'}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-[10px] font-bold uppercase rounded-full">Most Popular</div>}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6 text-3xl font-bold">{plan.price}<span className="text-zinc-500 text-sm font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-zinc-400"><Check className="w-4 h-4 text-emerald-500" />{f}</li>
                ))}
              </ul>
              <Button variant={plan.popular ? 'purple' : 'secondary'} className="w-full">Get Started</Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- View: Bio Writer ---

const BioWriter = ({ onBack }) => {
  const [formData, setFormData] = useState({ name: '', role: '', highlights: '', tone: 'Professional' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setResult(`Highly accomplished ${formData.role || 'Professional'} ${formData.name ? `named ${formData.name}` : ''} recognized for ${formData.highlights || 'exceptional contributions'}. With a proven track record, I specialize in building scalable solutions and driving impactful innovation. My approach is characterized by a ${formData.tone.toLowerCase()} mindset focused on long-term growth.`);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to dashboard
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Bio Writer</h1>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-zinc-500">Full Name</label>
              <input type="text" placeholder="e.g. Alistar Brown" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-zinc-500">Role / Title</label>
              <input type="text" placeholder="e.g. Founder & Product Designer" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" onChange={e => setFormData({...formData, role: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-zinc-500">Key Highlights</label>
              <textarea placeholder="e.g. Built 3 products, 10M+ users..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 h-28" onChange={e => setFormData({...formData, highlights: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-zinc-500">Tone</label>
              <div className="flex flex-wrap gap-2">
                {['Professional', 'Casual', 'Bold', 'Creative'].map(t => (
                  <button key={t} onClick={() => setFormData({...formData, tone: t})} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${formData.tone === t ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-500'}`}>{t}</button>
                ))}
              </div>
            </div>
            <Button variant="purple" className="w-full py-4" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Zap className="w-4 h-4" /> Generate Bio</>}
            </Button>
          </div>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between min-h-[400px]">
          <div className="text-zinc-300 leading-relaxed italic">{result || 'Your professional bio will appear here...'}</div>
          {result && <Button variant="secondary" className="self-end text-xs" onClick={() => navigator.clipboard.writeText(result)}><Copy className="w-3 h-3" /> Copy Bio</Button>}
        </div>
      </div>
    </div>
  );
};

// --- View: Content Repurposer ---

const ContentRepurposer = ({ onBack }) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState(null);

  const handleRepurpose = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setResults({
        twitter: [
          "1/ Repurposing content is the ultimate leverage. 🧵",
          "2/ Turning one blog post into 5 social formats saves you 10+ hours a week.",
          "3/ Start with a core piece of long-form value. #ContentStrategy"
        ],
        linkedin: "I used to spend hours writing separate posts for every platform. Now, I use AI_ToolSphere to turn my newsletter into a full social engine in 30 seconds. Leverage is better than hard work.",
        newsletter: "Hi Team,\n\nIn today's edition, we talk about the power of content repurposing. Why work harder when you can work smarter? Check out the full breakdown below..."
      });
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to dashboard
      </button>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-indigo-600/10 text-indigo-500 border border-indigo-500/20"><RefreshCw className="w-8 h-8" /></div>
            <div>
              <h1 className="text-3xl font-bold">Content Repurposer</h1>
              <p className="text-zinc-500">Turn one piece of content into many formats instantly.</p>
            </div>
          </div>
          <Badge variant="pro">Pro Tool</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-zinc-500">Your Content</label>
              <textarea placeholder="Paste your blog post, video script, or newsletter here..." className="w-full h-80 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-white focus:border-indigo-500 resize-none" onChange={e => setContent(e.target.value)} />
            </div>
            <Button variant="purple" className="w-full py-4 text-lg" onClick={handleRepurpose} disabled={isGenerating || !content}>
              {isGenerating ? 'Repurposing...' : 'Repurpose Content'}
            </Button>
          </div>

          <div className="space-y-6">
            {results ? (
              <div className="space-y-6">
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-500"><Twitter className="w-3.5 h-3.5" /> Twitter Thread</span>
                    <button onClick={() => navigator.clipboard.writeText(results.twitter.join('\n'))} className="text-indigo-400 text-[10px] font-bold uppercase flex items-center gap-1"><Copy className="w-3 h-3" /> Copy All</button>
                  </div>
                  <div className="space-y-3 text-sm text-zinc-300">
                    {results.twitter.map((t, i) => <p key={i}>{t}</p>)}
                  </div>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-500"><Linkedin className="w-3.5 h-3.5" /> LinkedIn Post</span>
                    <button onClick={() => navigator.clipboard.writeText(results.linkedin)} className="text-indigo-400 text-[10px] font-bold uppercase flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{results.linkedin}</p>
                </div>
              </div>
            ) : (
              <div className="h-full border border-zinc-900 border-dashed rounded-3xl flex flex-col items-center justify-center text-zinc-700 gap-4 p-12">
                <RefreshCw className="w-12 h-12 opacity-10" />
                <p className="max-w-[200px] text-center text-sm">Results will appear here in multiple social formats.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- View: Headline Generator ---

const HeadlineGenerator = ({ onBack }) => {
  const [formData, setFormData] = useState({ topic: '', audience: '', type: 'Blog Post' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setResults([
        `10 Proven Secrets to Mastering ${formData.topic || 'Your Passion'}`,
        `Why ${formData.audience || 'Professionals'} are Failing at ${formData.topic || 'their goals'}`,
        `The Ultimate Guide to ${formData.topic || 'Success'} for ${formData.audience || 'Beginners'}`,
        `5 Myths About ${formData.topic || 'Productivity'} Debunked`
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to dashboard
      </button>
      <div className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-indigo-600/10 text-indigo-500 border border-indigo-500/20"><Type className="w-8 h-8" /></div>
          <div>
            <h1 className="text-3xl font-bold">Headline Generator</h1>
            <p className="text-zinc-500">Generate scroll-stopping headlines for any content.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-zinc-500">What's it about?</label>
              <textarea placeholder="e.g. How to grow my newsletter to 10k subscribers" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white h-24 focus:border-indigo-500" onChange={e => setFormData({...formData, topic: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-zinc-500">Target Audience (Optional)</label>
              <input type="text" placeholder="e.g. Indie Hackers, Founders" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500" onChange={e => setFormData({...formData, audience: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-zinc-500">Content Type</label>
              <div className="flex flex-wrap gap-2">
                {['Blog Post', 'Email Subject', 'Social Post', 'Ad Copy'].map(t => (
                  <button key={t} onClick={() => setFormData({...formData, type: t})} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${formData.type === t ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>{t}</button>
                ))}
              </div>
            </div>
            <Button variant="purple" className="w-full py-4" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Generate Headlines'}
            </Button>
          </div>
          <div className="space-y-4">
            {results.map((r, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl flex justify-between items-center group">
                <p className="text-sm font-medium">{r}</p>
                <button onClick={() => navigator.clipboard.writeText(r)} className="text-zinc-500 hover:text-white"><Copy className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            {results.length === 0 && (
              <div className="h-full border border-zinc-900 border-dashed rounded-2xl flex flex-col items-center justify-center text-zinc-700 gap-4 p-12">
                <Sparkles className="w-8 h-8 opacity-10" />
                <p className="text-sm">Headlines will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Shell ---

export default function App() {
  const [view, setView] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/40 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-white fill-current" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-xl tracking-tighter italic">AI_ToolSphere</span>
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">by buildbyalistar</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <User className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-bold text-zinc-400">Alistar Barretto</span>
            </div>
            <Button variant="secondary" className="text-[11px] h-8 px-3 font-bold uppercase tracking-wider">Sign out</Button>
          </div>
          <button className="md:hidden text-zinc-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
        </div>
      </nav>

      <main className="relative">
        {view === 'dashboard' && <Dashboard onSelectTool={(t) => setView(t.id)} />}
        {view === 'bio-writer' && <BioWriter onBack={() => setView('dashboard')} />}
        {view === 'content-repurposer' && <ContentRepurposer onBack={() => setView('dashboard')} />}
        {view === 'headline-gen' && <HeadlineGenerator onBack={() => setView('dashboard')} />}
      </main>

      <footer className="border-t border-zinc-900 py-16 mt-20 relative bg-zinc-950/20 text-center text-[10px] text-zinc-700 font-bold uppercase tracking-[0.3em]">
        © 2026 buildbyalistar.com • all tools powered by gemini
      </footer>
    </div>
  );
}
