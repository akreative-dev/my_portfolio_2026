"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// 1. TYPEWRITER COMPONENT
interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  ready?: boolean;
  showCursor?: boolean;
}

function Typewriter({ 
  text, 
  speed = 280,
  delay = 0, 
  onComplete, 
  ready = true,
  showCursor = true
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [inView, setInView] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
          setStarted(false);
          setDisplayedText('');
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!ready || !inView) {
      setStarted(false);
      setDisplayedText('');
      return;
    }
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay, inView, ready]);

  useEffect(() => {
    if (!started) return;

    let currentIndex = 0;
    const glyphs = ["X", "#", "$", "&", "%", "1", "0", "@", "?"];
    let glyphTimeout: NodeJS.Timeout;

    const mainInterval = setInterval(() => {
      if (currentIndex < text.length) {
        const randomGlyph = glyphs[Math.floor(Math.random() * glyphs.length)];
        setDisplayedText(text.slice(0, currentIndex) + randomGlyph);

        glyphTimeout = setTimeout(() => {
          currentIndex++;
          setDisplayedText(text.slice(0, currentIndex));
        }, 60);
      } else {
        clearInterval(mainInterval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      clearInterval(mainInterval);
      clearTimeout(glyphTimeout);
    };
  }, [text, speed, started, onComplete]);

  return (
    <span ref={elementRef} className="inline-flex items-center font-mono">
      {displayedText}
      {showCursor && (
        <span className="inline-block w-[3px] h-[0.9em] bg-emerald-400 ml-1.5 animate-pulse shadow-[0_0_8px_#34d399]" />
      )}
    </span>
  );
}

// 2. BRUTALIST BACK TO TOP COMPONENT
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 p-3 bg-black border-2 border-emerald-400 text-emerald-400 font-mono shadow-[4px_4px_0px_#34d399] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#34d399] transition-all focus:outline-none active:translate-x-[0px] active:translate-y-[0px] active:shadow-none cursor-pointer"
    >
      <svg
        className="w-5 h-5 stroke-[2.5]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="square"
          strokeLinejoin="miter"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}

// 3. MAIN PAGE COMPONENT
export default function Page() {
  // State Declarations
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [expandedProject, setExpandedProject] = useState<number | string | null>(null);
  const [, setIntroFinished] = useState<boolean>(false);
  const [isHoveringCore, setIsHoveringCore] = useState<boolean>(false);

  // Skill definitions
  const skills = [
    { 
      name: "HTML / CSS / JS / PHP", 
      percentage: 35,
      project: "freefrom", 
      color: "#7000ff", // Neon Violet
      tagline: "CORE WEB STACK // 35%",
      desc: "Full-stack web architecture, interactive DOM engineering, custom PHP backends, and modular layout systems."
    },
    { 
      name: "PYTHON", 
      percentage: 25,
      project: "freefrom", 
      color: "#00f0ff", // Electric Cyan
      tagline: "SCRIPTING & BACKEND // 25%",
      desc: "Automated data pipelines, backend APIs, algorithmic processing, and system task automation."
    },
    { 
      name: "MACHINE LEARNING", 
      percentage: 22,
      project: "freefrom", 
      color: "#ff00ff", // Hot Pink
      tagline: "AI & MODELING // 22%",
      desc: "Predictive analytics, neural network architectures, pattern classification, and ethical AI model optimization."
    },
    { 
      name: "R & POSTGRESQL", 
      percentage: 18,
      project: "freefrom", 
      color: "#39ff14", // Lime Green
      tagline: "STATISTICS & DATA // 18%",
      desc: "Statistical computing, exploratory data analysis, and relational query optimization."
    },
  ];

  const [activeSkill, setActiveSkill] = useState<typeof skills[number] | null>(null);

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted successfully.");
    setIsContactOpen(false);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSkillClick = (skill: typeof skills[number]) => {
    setActiveSkill(skill);
    setExpandedProject(skill.project);
    
    setTimeout(() => {
      document.getElementById('artifacts')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Calculations for proportions and SVG shapes
  const totalPercentage = skills.reduce((acc, s) => acc + s.percentage, 0);
  let currentAccumulatedAngle = -90; // Start at 12 o'clock

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-[#1a1a1b] font-mono selection:bg-[#ff00ff] selection:text-white flex flex-col">
      
      {/* ========================================== */}
      {/* 📌 TRADITIONAL BRUTALIST STICKY MENU       */}
      {/* ========================================== */}
      <nav className="sticky top-0 z-40 bg-[#fdfcf0] border-b-4 border-black px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-sans font-black text-2xl md:text-3xl tracking-tighter bg-gradient-to-r from-[#7000ff] via-fuchsia-500 to-[#ff00ff] bg-clip-text text-transparent transform hover:scale-[1.02] transition-transform duration-300 select-none cursor-pointer"
        >
          ALEKSANDRA KOWALSKA
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button 
            onClick={() => scrollToSection('manifesto')}
            className="hover:text-[#7000ff] text-xs font-black tracking-wider uppercase px-2 py-1 transition-colors cursor-pointer"
          >
            // MANIFESTO
          </button>
          <button 
            onClick={() => scrollToSection('artifacts')}
            className="hover:text-[#ff00ff] text-xs font-black tracking-wider uppercase px-2 py-1 transition-colors cursor-pointer"
          >
            // PROJECTS
          </button>
          <button 
            onClick={() => scrollToSection('history')}
            className="hover:text-[#39ff14] text-xs font-black tracking-wider uppercase px-2 py-1 transition-colors cursor-pointer"
          >
            // CV_SECTION
          </button>
          
          <span className="text-zinc-300 hidden sm:inline">|</span>

          <button className="bg-white text-black border-2 border-black px-3 py-1.5 font-mono text-xs font-black shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer">
            CV.PDF
          </button>
          <button 
            onClick={() => setIsContactOpen(true)}
            className="bg-[#39ff14] text-black border-2 border-black px-3 py-1.5 font-mono text-xs font-black shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
          >
            CONTACT
          </button>
        </div>
      </nav>

      {/* ========================================== */}
      {/* 🎯 ACT I: PROPORTIONAL RADIAL DIAL HUB     */}
      {/* ========================================== */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 max-w-6xl mx-auto w-full min-h-[calc(100vh-100px)] relative">
        
        <div className="relative w-full max-w-[720px] aspect-square flex items-center justify-center my-auto">
          
          <div 
            className="absolute inset-2 rounded-full blur-3xl opacity-20 transition-all duration-700 pointer-events-none"
            style={{ 
              backgroundColor: activeSkill ? activeSkill.color : 'transparent',
              transform: activeSkill ? 'scale(1.15)' : 'scale(1)'
            }} 
          />

          <svg viewBox="0 0 600 600" className="w-full h-full overflow-visible relative z-10 select-none">
            {/* Base Circle Outer Boundary */}
            <circle
              cx="300"
              cy="300"
              r="200"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="4"
            />

            {/* Arcs & Pointer Lines */}
            <g>
              {skills.map((skill) => {
                const segmentAngle = (skill.percentage / totalPercentage) * 360;
                const startAngle = currentAccumulatedAngle;
                const endAngle = startAngle + segmentAngle;
                const midAngle = startAngle + segmentAngle / 2;
                currentAccumulatedAngle = endAngle;
                
                const radiusInner = 140;
                const radiusOuter = 200;
                
                const rad = (deg: number) => (deg * Math.PI) / 180;
                
                const x1_in = 300 + radiusInner * Math.cos(rad(startAngle));
                const y1_in = 300 + radiusInner * Math.sin(rad(startAngle));
                const x2_in = 300 + radiusInner * Math.cos(rad(endAngle));
                const y2_in = 300 + radiusInner * Math.sin(rad(endAngle));
                
                const x1_out = 300 + radiusOuter * Math.cos(rad(startAngle));
                const y1_out = 300 + radiusOuter * Math.sin(rad(startAngle));
                const x2_out = 300 + radiusOuter * Math.cos(rad(endAngle));
                const y2_out = 300 + radiusOuter * Math.sin(rad(endAngle));

                // Anchor points for technical callout pointer lines
                const anchorArcX = 300 + radiusOuter * Math.cos(rad(midAngle));
                const anchorArcY = 300 + radiusOuter * Math.sin(rad(midAngle));
                
                const pointerLength = 40;
                const pointerEndX = 300 + (radiusOuter + pointerLength) * Math.cos(rad(midAngle));
                const pointerEndY = 300 + (radiusOuter + pointerLength) * Math.sin(rad(midAngle));

                // Label Box Positions
                const isRightSide = Math.cos(rad(midAngle)) >= 0;
                const labelX = pointerEndX + (isRightSide ? 12 : -12);
                const labelY = pointerEndY;

                const largeArcFlag = segmentAngle > 180 ? 1 : 0;
                const pathData = `
                  M ${x1_in} ${y1_in}
                  L ${x1_out} ${y1_out}
                  A ${radiusOuter} ${radiusOuter} 0 ${largeArcFlag} 1 ${x2_out} ${y2_out}
                  L ${x2_in} ${y2_in}
                  A ${radiusInner} ${radiusInner} 0 ${largeArcFlag} 0 ${x1_in} ${y1_in}
                  Z
                `;

                const isSelected = activeSkill?.name === skill.name;

                return (
                  <g 
                    key={skill.name} 
                    className="group cursor-pointer"
                    onMouseEnter={() => setActiveSkill(skill)}
                    onMouseLeave={() => setActiveSkill(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSkillClick(skill);
                    }}
                  >
                    {/* Arc Path Segment */}
                    <path
                      d={pathData}
                      fill={isSelected ? skill.color : '#f8f8f0'}
                      stroke={skill.color}
                      strokeWidth={isSelected ? "5" : "3"}
                      className="transition-all duration-300 hover:brightness-105"
                      style={{ pointerEvents: 'all' }}
                    />

                    {/* Technical Pointer Line & Endpoint Dot */}
                    <line
                      x1={anchorArcX}
                      y1={anchorArcY}
                      x2={pointerEndX}
                      y2={pointerEndY}
                      stroke={isSelected ? skill.color : '#000000'}
                      strokeWidth={isSelected ? "3" : "1.5"}
                      strokeDasharray={isSelected ? "none" : "3,3"}
                      className="transition-all duration-300"
                    />
                    <rect
                      x={pointerEndX - 3}
                      y={pointerEndY - 3}
                      width="6"
                      height="6"
                      fill={skill.color}
                      stroke="#000000"
                      strokeWidth="1"
                    />

                    {/* External Skill Label */}
                    <g transform={`translate(${labelX}, ${labelY})`}>
                      <text
                        textAnchor={isRightSide ? "start" : "end"}
                        dominantBaseline="central"
                        className="font-mono font-black text-[11px] md:text-[12px] uppercase tracking-wider transition-colors duration-200"
                        fill={isSelected ? skill.color : "#000000"}
                      >
                        {skill.name}
                      </text>
                      <text
                        y="15"
                        textAnchor={isRightSide ? "start" : "end"}
                        dominantBaseline="central"
                        className="font-mono font-bold text-[9px] md:text-[10px] tracking-widest fill-zinc-500"
                      >
                        // WEIGHT: {skill.percentage}%
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* Central Core Circle */}
            <circle 
              cx="300" 
              cy="300" 
              r="135" 
              fill="#fdfcf0" 
              stroke="#000000" 
              strokeWidth="4" 
              className="cursor-pointer transition-colors duration-300 hover:fill-black group"
              style={{ pointerEvents: 'all' }}
              onMouseEnter={() => setIsHoveringCore(true)}
              onMouseLeave={() => setIsHoveringCore(false)}
              onClick={(e) => {
                e.stopPropagation();
                scrollToSection('manifesto');
              }}
            />
          </svg>

          {/* INNER CORE DYNAMIC VIEWPORT */}
          <div className="absolute inset-0 flex items-center justify-center p-16 pointer-events-none select-none z-20">
            <div className="text-center w-full px-4 flex flex-col justify-center items-center max-w-[240px] md:max-w-[270px]">
              {isHoveringCore ? (
                <span className="font-mono text-xs md:text-sm font-black text-[#39ff14] tracking-widest block animate-pulse">
                  EXPLORE MANIFESTO ➔
                </span>
              ) : activeSkill ? (
                <div className="animate-fadeIn space-y-2">
                  <span className="font-mono text-[9px] bg-black text-white px-2 py-0.5 font-bold tracking-wider inline-block">
                    PROPORTION: {activeSkill.percentage}%
                  </span>
                  <h3 
                    className="text-base md:text-xl font-black uppercase font-sans tracking-tight leading-tight transition-all duration-300"
                    style={{ color: activeSkill.color }}
                  >
                    {activeSkill.name}
                  </h3>
                  <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                    {activeSkill.tagline}
                  </p>
                  <p className="font-sans text-[11px] md:text-xs text-zinc-700 leading-normal">
                    {activeSkill.desc}
                  </p>
                  <p className="font-mono text-[9px] text-zinc-900 font-black animate-pulse pt-1">
                    [ CLICK SEGMENT TO LAUNCH ]
                  </p>
                </div>
              ) : (
                <div className="font-mono text-[14px] md:text-s font-bold leading-relaxed text-zinc-800">
                  <Typewriter 
                    text="Hi, I'm Aleks. I'm a creative developer & ethical systems engineer. Hover or tap any external skill pointer to inspect capabilities." 
                    speed={35} 
                    onComplete={() => setIntroFinished(true)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <ScrollToTop />
      </main>
          

      {/* ========================================== */}
      {/* 📜 ACT II: MANIFESTO AREA                  */}
      {/* ========================================== */}
      <section id="manifesto" className="min-h-screen bg-white border-t-4 border-black p-8 md:p-16 flex flex-col items-center scroll-mt-20">
        <div className="max-w-5xl w-full flex flex-col lg:flex-row justify-between items-start gap-12 pt-12">
          
          <div className="flex-1 space-y-16 font-sans">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#39ff14] bg-black px-2 py-0.5 inline-block mb-6 font-mono">
                // CORE_DATA // THE_EVOLUTION_TRILOGY.TXT
              </p>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight font-sans">
                MANIFESTO: SYSTEM STATE &amp; CRITICAL COUPLING
              </h2>
            </div>

            {/* HYBRID */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                <span className="font-mono text-xs font-black text-[#7000ff]">[ ACT_01 // THE_MINDSET ]</span>
                <div className="font-mono text-7xl font-sans font-black tracking-tighter bg-gradient-to-r from-[#7000ff] via-fuchsia-500 to-[#ff00ff] bg-clip-text text-transparent">
                  <Typewriter
                    text='_HYBRID'
                    speed={225} 
                    onComplete={() => setIntroFinished(true)}
                  /></div>
              </div>
              <p className="text-base md:text-lg leading-relaxed text-zinc-800 text-justify">
                I hold an <span className="font-black text-black">MSc in Computer Science (Distinction)</span> and a <span className="font-black text-black">BA in Graphic Design (2:1)</span>. I live permanently at the sharp intersection of strict typographic grid mathematics and rigid algorithmic execution. As an ethical software craftsman, I build resilient, accessible, and user-focused architectures designed to uphold high data integrity standards.
              </p>
            </div>

            {/* CHAOS */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                <span className="font-mono text-xs font-black text-[#ff00ff]">[ ACT_02 // SYSTEMIC_PRESSURE ]</span>
                <div className="font-mono text-7xl font-sans font-black text-[#ff00ff]">
                  <Typewriter
                    text='_CHAOS'
                    speed={225} 
                    onComplete={() => setIntroFinished(true)}
                  /></div>
              </div>
              <p className="text-base md:text-lg leading-relaxed text-zinc-800 text-justify">
                My engineering foundational drive was forged on the floor of an acute emergency surgery ward. I watched life-critical operations struggle under archaic software architectures. Managing bed flows and clinical pathways amidst chronic staff shortages taught me how to govern unpredictable logistics under absolute pressure.
              </p>
            </div>

            {/* SUTURE */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                <span className="font-mono text-xs font-black text-[#7000ff]">[ ACT_03 // OPERATIONAL_STABILITY ]</span>
                <div className="font-mono text-7xl font-sans font-black text-[#7000ff]">
                  <Typewriter
                    text='_SUTURE'
                    speed={225} 
                    onComplete={() => setIntroFinished(true)}
                  /></div>
              </div>
              <p className="text-base md:text-lg leading-relaxed text-zinc-800 text-justify">
                In high-stakes environments, panic is a systemic liability. I pride myself on extreme professionalism, ethical accountability, and diplomatic capability. If your pipeline is broken or a production deployment goes sideways, I don&apos;t panic. I step in, communicate clearly, and restore order.
              </p>
            </div>
          </div>

          {/* Right Block: Portrait Photo */}
          <div className="sticky top-28 shrink-0 w-full md:w-80 lg:w-96 select-none">
            <div className="relative group/portrait">
              <div 
                className="absolute inset-0 bg-black translate-x-3 translate-y-3 transition-transform group-hover/portrait:translate-x-4 group-hover/portrait:translate-y-4 duration-200"
                style={{ clipPath: 'polygon(50% 0%, 61% 20%, 83% 10%, 75% 33%, 98% 35%, 80% 53%, 90% 75%, 68% 70%, 65% 95%, 48% 78%, 30% 92%, 32% 68%, 8% 70%, 21% 51%, 2% 31%, 25% 32%, 18% 9%, 40% 19%)' }}
              />
              
              <div 
                className="absolute inset-0 bg-zinc-200 border-2 border-black overflow-hidden transition-transform group-hover/portrait:-translate-x-1 group-hover/portrait:-translate-y-1 duration-200 z-10 aspect-square"
                style={{ clipPath: 'polygon(50% 0%, 61% 20%, 83% 10%, 75% 33%, 98% 35%, 80% 53%, 90% 75%, 68% 70%, 65% 95%, 48% 78%, 30% 92%, 32% 68%, 8% 70%, 21% 51%, 2% 31%, 25% 32%, 18% 9%, 40% 19%)' }}
              >
                <Image 
                  src="/my_portrait.png" 
                  alt="Aleksandra Kowalska Portrait"
                  fill
                  priority
                  className="object-cover filter grayscale contrast-125 transition-all duration-300 group-hover/portrait:grayscale-0 group-hover/portrait:scale-105"
                />
              </div>
              <div className="w-full aspect-square" />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* 🛠️ ACT III: SELECTED PROJECTS              */}
      {/* ========================================== */}
      <section id="artifacts" className="py-16 border-t-4 border-black px-6 md:px-16 bg-[#fdfcf0] scroll-mt-20">
        
        <div className="mb-12 max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#7000ff]">
              01 // SELECTED ENGINEERING &amp; DESIGN ARTIFACTS
            </h2>
            {activeSkill && (
              <p className="font-mono text-xs text-zinc-600 font-bold mt-1">
                FILTERED BY SKILL: <span style={{ color: activeSkill.color }}>{activeSkill.name}</span>
              </p>
            )}
          </div>

          {activeSkill && (
            <button 
              onClick={() => setActiveSkill(null)}
              className="font-mono text-[10px] bg-black text-white px-2 py-1 font-bold uppercase tracking-wider hover:bg-[#ff00ff] transition-colors"
            >
              RESET_FILTER ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
          
          {/* ARTIFACT A: FREEFROM14 CARD */}
          <div 
            onClick={() => setExpandedProject(expandedProject === 'freefrom' ? null : 'freefrom')}
            className={`group border-4 border-black p-8 bg-white transition-all duration-300 relative cursor-pointer select-none shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#7000ff] ${
              expandedProject === 'freefrom' ? 'ring-4 ring-[#7000ff]' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5 tracking-widest">
                MSc PROJECT // FULL-STACK
              </span>
              <span className="font-mono text-xs font-bold text-zinc-400">
                2026
              </span>
            </div>
            
            <h3 className="text-3xl font-black uppercase tracking-tight font-sans mb-4 group-hover:text-[#7000ff] transition-colors">
              FreeFrom14
            </h3>
            
            <p className="font-sans text-sm leading-relaxed mb-6 opacity-90 text-justify">
              Engineered an accessibility-first recipe and food discovery engine designed to dynamically parse and screen out the 14 major EU-regulated allergens. Built to solve data rendering issues involving deeply nested ingredients arrays.
            </p>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed border-zinc-300 font-mono text-[11px] font-bold text-zinc-600">
              <span className="bg-[#7000ff]/10 text-[#7000ff] px-2 py-1">#HTML/CSS/JS/PHP</span>
              <span className="bg-[#00f0ff]/10 text-[#00f0ff] px-2 py-1">#PYTHON</span>
              <span className="bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1">#MACHINE-LEARNING</span>
              <span className="bg-[#39ff14]/10 text-[#39ff14] px-2 py-1">#R/POSTGRESQL</span>
            </div>
          </div>

          {/* ARTIFACT B: PORTRAITS 14 CARD */}
          <div 
            onClick={() => setExpandedProject(expandedProject === 'portraits' ? null : 'portraits')}
            className={`group border-4 border-black p-8 bg-white transition-all duration-300 relative cursor-pointer select-none shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#ff00ff] ${
              expandedProject === 'portraits' ? 'md:col-span-2 !bg-[#fdfcf0]' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5 tracking-widest">
                BA AWARD WINNER // UI SYSTEM
              </span>
              <span className="font-mono text-xs font-bold text-zinc-400">
                {expandedProject === 'portraits' ? '[ CLICK TO CLOSE ✕ ]' : '2014'}
              </span>
            </div>
            
            <h3 className="text-3xl font-black uppercase tracking-tight font-sans mb-4 group-hover:text-[#ff00ff] transition-colors">
              Portraits 14
            </h3>
            
            <p className="font-sans text-sm leading-relaxed mb-6 opacity-90 text-justify">
              Developed a rhythmic typographic and structural visual system for a 4-gallery portrait exhibition. This identity won the University Live Project Competition by balancing dense informational layouts with architectural whitespace.
            </p>

            {expandedProject === 'portraits' && (
              <div className="mt-6 pt-6 border-t-4 border-double border-black font-sans text-sm space-y-4 animate-fadeIn">
                <p className="font-mono text-xs font-black text-[#ff00ff] uppercase tracking-wider">// DESIGN PHILOSOPHY &amp; TYPOGRAPHIC RULES</p>
                <p>
                  <strong>The Creative Objective:</strong> Standard visual showcases suffered from over-crowding, where long-form subject history cards detracted from the portrait artwork focal balances.
                </p>
                <p>
                  <strong>The Spatial Blueprint:</strong> Engineered a variable baseline grid rhythm that scaled typography weights directly proportional to view bounding fields.
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed border-zinc-300 font-mono text-[11px] font-bold text-zinc-600">
              <span className="bg-zinc-100 px-2 py-1">#GRID-SYSTEMS</span>
              <span className="bg-zinc-100 px-2 py-1">#INFORMATION-ARCH</span>
              <span className="bg-zinc-100 px-2 py-1">#TYPOGRAPHY</span>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================== */}
      {/* 📜 ACT IV: TIMELINE & HISTORY             */}
      {/* ========================================== */}
      <section id="history" className="py-16 pb-24 bg-[#fdfcf0] px-6 md:px-16 scroll-mt-20 border-t-4 border-black">
        
        <div className="mb-12 max-w-5xl mx-auto">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#7000ff]">
            02 // REAL-WORLD OPERATIONAL HISTORY &amp; EDUCATION
          </h2>
        </div>

        <div className="max-w-4xl border-l-4 border-black pl-6 ml-2 md:ml-6 space-y-12 relative mx-auto">
          
          {/* ACADEMIC MILESTONE 1 */}
          <div className="relative group reveal-item">
            <div className="absolute -left-[34px] top-1.5 h-4 w-4 bg-[#ff00ff] border-4 border-[#fdfcf0] rounded-full group-hover:bg-[#39ff14] transition-colors"></div>
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-2">
              <h3 className="text-xl font-black uppercase font-sans tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#7000ff] to-[#ff00ff]">
                MSc in Computer Science
              </h3>
              <span className="font-mono text-xs font-bold text-zinc-500 md:text-right whitespace-nowrap">GRADUATED // 2026</span>
            </div>
            <p className="font-sans text-xs font-bold text-black uppercase tracking-wider mb-4">University of Sunderland</p>
            <div className="font-sans text-sm opacity-90 border-l-2 border-black pl-3 space-y-1 bg-white p-3 border shadow-[3px_3px_0px_#000]">
              <div className="font-bold text-[#7000ff]">// CLASSIFICATION: DISTINCTION RECIPIENT ★</div>
              <p className="text-xs text-zinc-600 mt-1">
                Advanced core modules in Software Engineering, Data Structures &amp; Algorithms, Database Systems Normalization, and Full-Stack Architecture Development.
              </p>
            </div>
          </div>

          {/* ROLE 1 */}
          <div className="relative group reveal-item">
            <div className="absolute -left-[34px] top-1.5 h-4 w-4 bg-[#7000ff] border-4 border-[#fdfcf0] rounded-full group-hover:bg-[#ff00ff] transition-colors"></div>
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-2">
              <h3 className="text-xl font-black uppercase font-sans tracking-tight">Ward Clerk — Acute Emergency General Surgery</h3>
              <span className="font-mono text-xs font-bold text-zinc-500 md:text-right whitespace-nowrap">AUG 2018 – PRESENT</span>
            </div>
            <p className="font-sans text-xs font-bold text-[#7000ff] uppercase tracking-wider mb-4">Southampton General Hospital</p>
            <ul className="font-sans text-sm space-y-2 opacity-90 list-disc list-inside text-justify">
              <li>Keep things moving smoothly on a fast-paced ward, managing patient records and tracking live queues under pressure.</li>
              <li>Collected patient metrics to justify expansion parameters, culminating in a custom Same Day Emergency Care architecture.</li>
            </ul>
          </div>

          {/* ROLE 2 */}
          <div className="relative group reveal-item">
            <div className="absolute -left-[34px] top-1.5 h-4 w-4 bg-black border-4 border-[#fdfcf0] rounded-full group-hover:bg-[#7000ff] transition-colors"></div>
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-2">
              <h3 className="text-xl font-black uppercase font-sans tracking-tight">Housekeeper &amp; Hostess</h3>
              <span className="font-mono text-xs font-bold text-zinc-500 md:text-right whitespace-nowrap">SEP 2014 – AUG 2018</span>
            </div>
            <p className="font-sans text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Southampton General Hospital</p>
            <p className="font-sans text-sm leading-relaxed opacity-90 text-justify">Maintained meticulous cleanliness, safety layout routines, and logistical flows to satisfy strict healthcare clinical parameters.</p>
          </div>

          {/* ACADEMIC MILESTONE 2 */}
          <div className="relative group reveal-item">
            <div className="absolute -left-[34px] top-1.5 h-4 w-4 bg-[#ff00ff] border-4 border-[#fdfcf0] rounded-full group-hover:bg-[#39ff14] transition-colors"></div>
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-2">
              <h3 className="text-xl font-black uppercase font-sans tracking-tight">BA (Hons) in Graphic Design</h3>
              <span className="font-mono text-xs font-bold text-zinc-500 md:text-right whitespace-nowrap">GRADUATED // 2014</span>
            </div>
            <p className="font-sans text-xs font-bold text-black uppercase tracking-wider mb-3">University of Southampton</p>
            <p className="font-sans text-sm leading-relaxed opacity-90 text-justify">
              Focused on Swiss typographic layout design systems, complex information mapping frameworks, advanced editorial layout geometry, and brand identity architecture.
            </p>
          </div>
          
          {/* ACADEMIC MILESTONE 3 */}
          <div className="relative group reveal-item">
            <div className="absolute -left-[34px] top-1.5 h-4 w-4 bg-[#ff00ff] border-4 border-[#fdfcf0] rounded-full group-hover:bg-[#39ff14] transition-colors"></div>
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-2">
              <h3 className="text-xl font-black uppercase font-sans tracking-tight">BTEC National Diploma in Art &amp; Design (Graphic Design)</h3>
              <span className="font-mono text-xs font-bold text-zinc-500 md:text-right whitespace-nowrap">GRADUATED // 2011</span>
            </div>
            <p className="font-sans text-xs font-bold text-black uppercase tracking-wider mb-3">Northampton College</p>
            <p className="font-sans text-sm leading-relaxed opacity-90 text-justify">
              A multidisciplinary creative foundation spanning graphic design, motion graphics, photography, and illustration.
            </p>
          </div>

          {/* ROLE 3 */}
          <div className="relative group reveal-item">
            <div className="absolute -left-[34px] top-1.5 h-4 w-4 bg-black border-4 border-[#fdfcf0] rounded-full group-hover:bg-[#7000ff] transition-colors"></div>
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-2">
              <h3 className="text-xl font-black uppercase font-sans tracking-tight">Industrial Printer / Screen Technician</h3>
              <span className="font-mono text-xs font-bold text-zinc-500 md:text-right whitespace-nowrap">SEPT 2007 – AUG 2009</span>
            </div>
            <p className="font-sans text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Ritter UK — Innovations in Plastics, Wrexham</p>
            <p className="font-sans text-sm leading-relaxed opacity-90 text-justify">Calibrated, adjusted, and managed heavy mechanical silk-screen hardware configurations safely under tight production schedules.</p>
          </div>

        </div>

        <div className="max-w-5xl mx-auto mt-20 pt-8 border-t-2 border-dashed border-zinc-300 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
          <span>© 2026 ALEKSANDRA KOWALSKA</span>
          <span>CURATED INDUSTRIAL REVOLUTION // NEXT.JS + TAILWIND v4</span>
        </div>
      </section>

      {/* ========================================== */}
      {/* 🚀 ARTIFACT A: SLIDE-OUT PANEL (FREEFROM14) */}
      {/* ========================================== */}
      <div 
        className={`fixed inset-0 z-50 flex justify-start transition-all duration-700 ease-in-out ${
          expandedProject === 'freefrom' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          onClick={() => setExpandedProject(null)} 
          className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/40 via-black/20 to-cyan-500/40 backdrop-blur-md"
        />

        <div 
          className={`relative h-full w-full max-w-2xl border-r-4 border-black bg-[#fdfcf0] flex flex-col transition-transform duration-700 ease-in-out transform shadow-[10px_0px_0px_#000] ${
            expandedProject === 'freefrom' ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 border-b-4 border-black flex justify-between items-center bg-white">
            <span className="font-mono text-xs font-bold bg-black text-[#39ff14] px-2 py-0.5">// Project overview</span>
            <button 
              onClick={() => setExpandedProject(null)}
              className="border-2 border-black bg-white hover:bg-black hover:text-white px-2 py-1 font-mono text-xs font-bold transition-all cursor-pointer"
            >
              CLOSE_X
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-10 font-sans">

  {/* PROJECT INTRO */}
  <div>
    <p className="font-mono text-[10px] uppercase tracking-widest text-[#7000ff] font-bold mb-3">
      MSc Computer Science // Research Project // 2026
    </p>

    <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
      FreeFrom14
    </h2>

    <p className="mt-4 text-base sm:text-lg font-bold leading-relaxed max-w-xl">
      Making allergen-aware recipe discovery easier to navigate.
    </p>
  </div>


  {/* 01 — THE PROBLEM */}
  <section className="space-y-4">
    <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
      01 // The Problem
    </p>

    <h3 className="text-2xl sm:text-3xl font-black leading-tight">
      The problem wasn't finding recipes.
      <br />
      It was trusting them.
    </h3>

    <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
      For people managing food allergies, finding something to cook can
      involve far more than typing a recipe into a search bar. Recipe
      information can be inconsistent and unstructured, requiring users
      to manually inspect ingredients and repeatedly make decisions about
      what to avoid.
    </p>

    <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
      FreeFrom14 explored how structured data, faceted search and
      natural language processing could help make allergen-aware recipe
      discovery easier to inspect and navigate.
    </p>
  </section>


  {/* 02 — THE QUESTION */}
  <section className="space-y-5 border-t-2 border-black pt-8">
    <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
      02 // The Question
    </p>

    <h3 className="text-2xl sm:text-3xl font-black leading-tight">
      Can intelligent search make allergen-aware recipe discovery easier?
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[
        ["DATA", "How can recipe information be responsibly acquired, audited and structured?"],
        ["SEARCH", "Can faceted filtering help users navigate complex restrictions?"],
        ["NLP", "Can semantic techniques improve ingredient understanding beyond exact keyword matching?"],
        ["RESPONSIBILITY", "How can transparency and data integrity be prioritised in an allergen-aware context?"],
      ].map(([title, text]) => (
        <div
          key={title}
          className="border-2 border-black p-4 bg-white"
        >
          <h4 className="font-mono text-xs font-bold mb-2">
            {title}
          </h4>
          <p className="text-xs sm:text-sm leading-relaxed text-zinc-700">
            {text}
          </p>
        </div>
      ))}
    </div>
  </section>


  {/* 03 — THE PIVOT */}
  <section className="space-y-5 border-t-2 border-black pt-8">
    <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
      03 // The Pivot
    </p>

    <h3 className="text-2xl sm:text-3xl font-black leading-tight">
      When the research changed the build.
    </h3>

    <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
      The original project explored web scraping as a method of acquiring
      recipe data. As the research progressed, questions around permissions,
      provenance, reliability and ethical data acquisition became increasingly
      important.
    </p>

    <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
      Rather than forcing the original approach, I reassessed the data
      pipeline and explored more controlled sources, including authorised
      APIs and open datasets.
    </p>

    <blockquote className="border-l-4 border-black pl-4 py-2 font-bold text-lg leading-relaxed">
      The goal wasn't simply to collect more data. It was to build a
      pipeline I could better understand, justify and audit.
    </blockquote>
  </section>


  {/* 04 — THE SYSTEM */}
  <section className="space-y-5 border-t-2 border-black pt-8">
    <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
      04 // The System
    </p>

    <h3 className="text-2xl sm:text-3xl font-black leading-tight">
      From fragmented data to structured search.
    </h3>

    <div className="space-y-2">
      {[
        ["01", "DATA SOURCES", "Authorised APIs + open datasets"],
        ["02", "INGESTION", "Python processing pipeline"],
        ["03", "TRANSFORMATION", "Clean + normalise recipe data"],
        ["04", "ALLERGEN ENRICHMENT", "Structure information around 14 allergen groups"],
        ["05", "NLP", "Regex + spaCy NER + Word2Vec"],
        ["06", "DATABASE", "PostgreSQL via Supabase"],
        ["07", "APPLICATION", "Flask + responsive interface"],
      ].map(([number, title, text], index) => (
        <div key={title}>
          <div className="border-2 border-black bg-white p-4 flex gap-4">
            <span className="font-mono text-xs font-bold text-[#7000ff]">
              {number}
            </span>

            <div>
              <h4 className="font-bold text-sm">
                {title}
              </h4>

              <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                {text}
              </p>
            </div>
          </div>

          {index < 6 && (
            <div className="h-5 border-l-2 border-black ml-6" />
          )}
        </div>
      ))}
    </div>
  </section>


  {/* 05 — THE INTELLIGENCE */}
  <section className="space-y-5 border-t-2 border-black pt-8">
    <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
      05 // The Intelligence
    </p>

    <h3 className="text-2xl sm:text-3xl font-black leading-tight">
      Why one method wasn't enough.
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="border-2 border-black p-4 bg-[#fff3b0]">
        <h4 className="font-mono text-xs font-bold">
          REGEX
        </h4>
        <p className="mt-3 text-xs leading-relaxed">
          Deterministic rules for known patterns and structured terms.
        </p>
      </div>

      <div className="border-2 border-black p-4 bg-white">
        <h4 className="font-mono text-xs font-bold">
          spaCy NER
        </h4>
        <p className="mt-3 text-xs leading-relaxed">
          Explored for identifying ingredient-related entities in less
          structured text.
        </p>
      </div>

      <div className="border-2 border-black p-4 bg-[#e0f2fe]">
        <h4 className="font-mono text-xs font-bold">
          WORD2VEC
        </h4>
        <p className="mt-3 text-xs leading-relaxed">
          Used to explore semantic relationships between ingredients and
          potential substitutions.
        </p>
      </div>
    </div>

    <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
      Rather than treating NLP as a replacement for rules, the project
      explored how deterministic and semantic approaches could complement
      one another.
    </p>
  </section>


  {/* 06 — SEARCH EXPERIENCE */}
  <section className="space-y-5 border-t-2 border-black pt-8">
    <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
      06 // The Search Experience
    </p>

    <h3 className="text-2xl sm:text-3xl font-black leading-tight">
      Search should support exploration, not create more work.
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[
        ["14 ALLERGEN GROUPS", "Structured around the major allergen categories recognised by UK/EU legislation."],
        ["MULTIPLE FILTERS", "Supporting more complex combinations of exclusions."],
        ["EXPLORATORY SEARCH", "Allowing users to progressively refine results."],
        ["SUBSTITUTION EXPLORATION", "Moving beyond a simple include-or-exclude response."],
      ].map(([title, text]) => (
        <div
          key={title}
          className="border-2 border-black p-4 bg-white"
        >
          <h4 className="font-mono text-xs font-bold">
            {title}
          </h4>
          <p className="mt-2 text-xs sm:text-sm text-zinc-700 leading-relaxed">
            {text}
          </p>
        </div>
      ))}
    </div>

    <blockquote className="border-l-4 border-black pl-4 py-2 font-bold leading-relaxed">
      The aim wasn't to make dietary decisions for the user. It was to
      make complex recipe information easier to inspect and navigate.
    </blockquote>
  </section>


  {/* 07 — RESULTS */}
  <section className="space-y-5 border-t-2 border-black pt-8">
    <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
      07 // Testing & Results
    </p>

    <h3 className="text-2xl sm:text-3xl font-black leading-tight">
      The system had to be tested — not just built.
    </h3>

    <div className="grid grid-cols-2 gap-3">
      <div className="border-2 border-black p-4 bg-black text-white">
        <p className="text-3xl sm:text-4xl font-black">
          7,500
        </p>
        <p className="font-mono text-[10px] uppercase mt-2">
          Recipes audited
        </p>
      </div>

      <div className="border-2 border-black p-4 bg-[#39ff14]">
        <p className="text-3xl sm:text-4xl font-black">
          1,419
        </p>
        <p className="font-mono text-[10px] uppercase mt-2">
          Erroneous flags removed
        </p>
      </div>

      <div className="border-2 border-black p-4 bg-[#fff3b0]">
        <p className="text-3xl sm:text-4xl font-black">
          16
        </p>
        <p className="font-mono text-[10px] uppercase mt-2">
          User test participants
        </p>
      </div>

      <div className="border-2 border-black p-4 bg-white">
        <p className="text-3xl sm:text-4xl font-black">
          100%
        </p>
        <p className="font-mono text-[10px] uppercase mt-2">
          Search & Filter task success
        </p>
      </div>
    </div>

    <p className="text-xs text-zinc-500 leading-relaxed">
      Evaluation metrics are presented within the context of the MSc
      research project and prototype evaluation.
    </p>
  </section>


  {/* 08 — REFLECTION */}
  <section className="space-y-5 border-t-2 border-black pt-8 pb-8">
    <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
      08 // Reflection
    </p>

    <h3 className="text-2xl sm:text-3xl font-black leading-tight">
      The project changed the way I think about building with data.
    </h3>

    <div className="space-y-4 text-sm sm:text-base text-zinc-700 leading-relaxed">
      <div>
        <h4 className="font-bold text-black">
          Data quality shapes everything.
        </h4>
        <p>
          The quality and provenance of input data affected every stage
          of the system.
        </p>
      </div>

      <div>
        <h4 className="font-bold text-black">
          One technique isn't always enough.
        </h4>
        <p>
          Deterministic rules and semantic NLP approaches each had
          strengths and limitations.
        </p>
      </div>

      <div>
        <h4 className="font-bold text-black">
          Safety requires transparency.
        </h4>
        <p>
          In an allergen-aware context, uncertainty matters. A system
          should help users inspect information rather than create false
          confidence.
        </p>
      </div>

      <div>
        <h4 className="font-bold text-black">
          Research changes the build.
        </h4>
        <p>
          One of the biggest lessons was learning to change direction
          when evidence challenged the original plan.
        </p>
      </div>
    </div>

    <blockquote className="border-2 border-black p-5 bg-[#7000ff] text-white font-bold text-lg leading-relaxed">
      The best outcome wasn't following my original idea perfectly.
      It was learning when — and why — to rethink it.
    </blockquote>
  </section>

</div>
        </div>
      </div>
      

      {/* ========================================== */}
      {/* 📬 SECURE CONTACT DRAWER                   */}
      {/* ========================================== */}
      <div 
        className={`fixed inset-0 z-50 flex justify-end transition-all duration-700 ease-in-out ${
          isContactOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          onClick={() => setIsContactOpen(false)} 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        <form 
          onSubmit={handleContactSubmit}
          className={`relative h-full w-full max-w-md border-l-4 border-black bg-[#fdfcf0] p-8 flex flex-col justify-between transition-transform duration-700 ease-in-out transform shadow-[-10px_0px_0px_#000] ${
            isContactOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b-2 border-black pb-4">
              <h3 className="font-mono text-lg font-black tracking-wider uppercase">// CONTACT//SECURE</h3>
              <button 
                type="button" 
                onClick={() => setIsContactOpen(false)}
                className="font-mono text-xs border border-black px-2 py-1 hover:bg-black hover:text-white transition-all cursor-pointer"
              >
                ESC
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] font-bold text-zinc-500 uppercase">sender_identifier</label>
                <input 
                  required
                  type="text" 
                  placeholder="Your Name" 
                  className="bg-white border-2 border-black p-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#7000ff]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] font-bold text-zinc-500 uppercase">return_endpoint_email</label>
                <input 
                  required
                  type="email" 
                  placeholder="name@domain.com" 
                  className="bg-white border-2 border-black p-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#7000ff]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] font-bold text-zinc-500 uppercase">Message</label>
                <textarea 
                  required
                  rows={6}
                  placeholder="Write your system parameters or project inquiries here..." 
                  className="bg-white border-2 border-black p-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#7000ff]"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#39ff14] text-black border-2 border-black p-3 font-mono text-sm font-black tracking-widest uppercase shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer mt-4"
          >
            TRANSMIT//MESSAGE ➔
          </button>
        </form>
      </div>

    </div>
  );
}