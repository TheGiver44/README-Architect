import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Sparkles, 
  Copy, 
  Check, 
  Github, 
  Cpu, 
  Zap, 
  Layout, 
  RefreshCw,
  Eye,
  Code2,
  Download
} from 'lucide-react';
import Markdown from 'react-markdown';
import { generateReadme } from './services/geminiService';
import { cn } from './lib/utils';

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [error, setError] = useState<string | null>(null);
  
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateReadme(input);
      setOutput(result);
    } catch (err) {
      setError('Failed to generate. Please check your API key and connection.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col scanline relative overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-neon/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-purple/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="border-b border-cyber-neon/10 bg-cyber-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyber-neon/10 border border-cyber-neon/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyber-neon" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
                README <span className="text-cyber-neon">ARCHITECT</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">
                AI-Powered Profile Optimization
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-cyber-neon transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyber-neon">
              <Terminal className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider">Source Data</span>
            </div>
          </div>
          
          <div className="relative flex-1 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-neon/20 to-cyber-blue/20 rounded-xl blur opacity-30 group-focus-within:opacity-100 transition duration-500" />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your raw bio, project links, tech stack, and any half-baked README content here..."
              className="relative w-full h-full min-h-[400px] lg:min-h-0 bg-cyber-black border border-cyber-neon/20 rounded-xl p-6 font-mono text-sm text-gray-300 focus:outline-none focus:border-cyber-neon/50 transition-all resize-none placeholder:text-gray-600"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !input.trim()}
            className={cn(
              "w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all relative overflow-hidden group",
              isGenerating || !input.trim() 
                ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                : "bg-cyber-neon text-cyber-black hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] active:scale-[0.98]"
            )}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Architecting...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                Generate God-Tier README
              </>
            )}
          </button>
        </section>

        {/* Output Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setViewMode('preview')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all",
                  viewMode === 'preview' ? "bg-cyber-neon/10 text-cyber-neon border border-cyber-neon/20" : "text-gray-500 hover:text-gray-300"
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
              <button 
                onClick={() => setViewMode('raw')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all",
                  viewMode === 'raw' ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20" : "text-gray-500 hover:text-gray-300"
                )}
              >
                <Code2 className="w-3.5 h-3.5" />
                Raw Markdown
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={!output}
                className="p-2 text-gray-500 hover:text-cyber-neon disabled:opacity-30 transition-colors"
                title="Download README.md"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="p-2 text-gray-500 hover:text-cyber-neon disabled:opacity-30 transition-colors"
                title="Copy to Clipboard"
              >
                {copied ? <Check className="w-5 h-5 text-cyber-neon" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="relative flex-1 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-purple/20 to-cyber-blue/20 rounded-xl blur opacity-30 transition duration-500" />
            <div 
              ref={outputRef}
              className="relative w-full h-full min-h-[400px] lg:min-h-0 bg-cyber-black border border-white/5 rounded-xl overflow-hidden flex flex-col"
            >
              {isGenerating && (
                <div className="absolute inset-0 z-10 bg-cyber-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 border-4 border-cyber-neon/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-cyber-neon border-t-transparent rounded-full animate-spin" />
                    <Cpu className="absolute inset-0 m-auto w-6 h-6 text-cyber-neon animate-pulse" />
                  </div>
                  <p className="text-cyber-neon font-mono text-xs animate-pulse">OPTIMIZING NEURAL LAYERS...</p>
                </div>
              )}

              {!output && !isGenerating && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-12 text-center">
                  <Layout className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-mono uppercase tracking-widest">Awaiting Input Data</p>
                  <p className="text-xs mt-2 max-w-[200px]">Your optimized README will manifest here once generation is triggered.</p>
                </div>
              )}

              {output && (
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  {viewMode === 'preview' ? (
                    <div className="markdown-body">
                      <Markdown>{output}</Markdown>
                    </div>
                  ) : (
                    <pre className="text-xs text-cyber-blue font-mono whitespace-pre-wrap break-all bg-transparent border-none p-0 m-0">
                      {output}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-neon/5 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            <span>Status: <span className="text-cyber-neon">Operational</span></span>
            <span className="hidden md:inline">|</span>
            <span>Version: <span className="text-white">v1.0.4-beta</span></span>
          </div>
          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            &copy; 2026 README ARCHITECT // BUILT FOR THE NEXT GENERATION
          </p>
        </div>
      </footer>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-3 rounded-full backdrop-blur-md text-xs font-mono uppercase tracking-widest z-[100]"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
