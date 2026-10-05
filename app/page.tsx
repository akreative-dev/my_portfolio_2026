"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from "react-dom";

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
  if (!ready || !inView) return;

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
function ScrollToTop({
  onBackToWheel,
}: {
  onBackToWheel: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const wheel = document.getElementById("wheel");

    if (!wheel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(wheel);

    return () => observer.disconnect();
  }, []);

  const handleBackToWheel = () => {
    onBackToWheel();

    setTimeout(() => {
      document.getElementById("wheel")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  };

  if (!isVisible) return null;

  return createPortal(
    <button
      onClick={handleBackToWheel}
      aria-label="Back to wheel"
      className="fixed bottom-10 right-2 sm:bottom-8 sm:right-4 lg:bottom-8 lg:right-6 z-[99999] flex items-center gap-1 sm:gap-1.5 lg:gap-2 px-1.5 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 lg:py-2 bg-black border-2 border-[#39ff14] text-[#39ff14] font-mono text-[7px] sm:text-[8px] lg:text-[10px] font-black uppercase tracking-[0.12em] sm:tracking-widest shadow-[2px_2px_0px_#39ff14] sm:shadow-[3px_3px_0px_#39ff14] lg:shadow-[4px_4px_0px_#39ff14] transition-all focus:outline-none active:translate-x-0 active:translate-y-0 active:shadow-none cursor-pointer whitespace-nowrap"
    >
      <svg
        className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 stroke-[2.5] shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="square"
          strokeLinejoin="miter"
          d="M15 18l-6-6 6-6"
        />
      </svg>

      <span>BACK TO WHEEL</span>
    </button>,
    document.body
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
    labelLines: ["HTML / CSS", "JS / PHP"],
    percentage: 30,
    project: "wearview",
    targetId: "wearview-card",
    color: "#7000ff",
    tagline: "CORE WEB STACK // 30%",
    desc: "Frontend and server-side development across interactive interfaces, validation, database-driven systems and web applications.",
    projects: [
      {
        id: "wearview",
        name: "WearView Academy",
        targetId: "wearview-card",
        color: "#00f0ff",
      },
      {
        id: "quiz",
        name: "Quiz App",
        targetId: "quiz-card",
        color: "#ff00ff",
      },
      {
        id: "catalogue",
        name: "Library Catalogue",
        targetId: "catalogue-card",
        color: "#00f0ff",
      },
    ],
  },
  {
    name: "PYTHON",
    labelLines: ["PYTHON"],
    percentage: 30,
    project: "freefrom",
    targetId: "freefrom-card",
    color: "#00f0ff",
    tagline: "BACKEND // DATA // AUTOMATION // 30%",
    desc: "Used across application development, data processing, NLP workflows and machine learning projects.",
    projects: [
      {
        id: "freefrom",
        name: "FreeFrom14",
        targetId: "freefrom-card",
        color: "#7000ff",
      },
      {
        id: "bank",
        name: "Bank Marketing",
        targetId: "bank-card",
        color: "#39ff14",
      },
      {
        id: "breast",
        name: "Breast Cancer",
        targetId: "breast-cancer-card",
        color: "#7000ff",
      },
    ],
  },
  {
    name: "MACHINE LEARNING",
    labelLines: ["MACHINE", "LEARNING"],
    percentage: 25,
    project: "cifar",
    targetId: "cifar-card",
    color: "#ff00ff",
    tagline: "MODELLING // CLASSIFICATION // 25%",
    desc: "Applied machine learning across neural networks, image classification, predictive modelling and model evaluation.",
    projects: [
      {
        id: "cifar",
        name: "CIFAR-10",
        targetId: "cifar-card",
        color: "#ff00ff",
      },
      {
        id: "breast",
        name: "Breast Cancer",
        targetId: "breast-cancer-card",
        color: "#7000ff",
      },
      {
        id: "bank",
        name: "Bank Marketing",
        targetId: "bank-card",
        color: "#39ff14",
      },
    ],
  },
  {
    name: "DATA & DATABASES",
    percentage: 15,
    project: "freefrom",
    targetId: "freefrom-card",
    color: "#39ff14",
    tagline: "R // POSTGRESQL // DATA SYSTEMS // 15%",
    desc: "Working with relational databases, structured datasets, data analysis and data-processing pipelines.",
    projects: [
      {
        id: "freefrom",
        name: "FreeFrom14",
        targetId: "freefrom-card",
        color: "#7000ff",
      },
      {
        id: "bank",
        name: "Bank Marketing",
        targetId: "bank-card",
        color: "#39ff14",
      },
    ],
  },
];

  const [activeSkill, setActiveSkill] = useState<typeof skills[number] | null>(null);
  const [selectedSkill, setSelectedSkill] =
    useState<typeof skills[number] | null>(null);
  const displaySkill = activeSkill ?? selectedSkill;

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted successfully.");
    setIsContactOpen(false);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSkillClick = (skill: typeof skills[number]) => {
    setSelectedSkill(skill);
    setActiveSkill(skill);

    setTimeout(() => {
      document
        .getElementById("skill-projects")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
    }, 50);
  };

  // Calculations for proportions and SVG shapes
  const totalPercentage = skills.reduce((acc, s) => acc + s.percentage, 0);
  let currentAccumulatedAngle = -90; // Start at 12 o'clock

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#fdfcf0] text-[#1a1a1b] font-mono selection:bg-[#ff00ff] selection:text-white flex flex-col">

      {/* ========================================== */}
      {/* TRADITIONAL BRUTALIST STICKY MENU       */}
      {/* ========================================== */}
      <nav className="sticky top-0 z-40 bg-[#fdfcf0] border-b-4 border-black px-4 sm:px-6 md:px-8 py-4 flex flex-col xl:flex-row justify-between items-center gap-3 xl:gap-4">

        {/* NAME */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-sans font-black text-[1.85rem] sm:text-3xl md:text-4xl xl:text-3xl tracking-tighter bg-gradient-to-r from-[#7000ff] via-fuchsia-500 to-[#ff00ff] bg-clip-text text-transparent transform hover:scale-[1.02] transition-transform duration-300 select-none cursor-pointer text-center xl:text-left"
        >
          ALEKSANDRA KOWALSKA
        </div>

        {/* MENU */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 w-full xl:w-auto">

          {/* PRIMARY NAV */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap">

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
              // TIMELINE
            </button>

          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap">

            <span className="text-zinc-300 hidden sm:inline">|</span>

            <a
              href="/AleksandraKowalskaTechCV.pdf"
              download="AleksandraKowalskaTechCV.pdf"
              className="bg-white text-black border-2 border-black px-3 py-1.5 font-mono text-xs font-black shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer inline-block"
            >
              CV.PDF
            </a>

            <button
              onClick={() => setIsContactOpen(true)}
              className="bg-[#39ff14] text-black border-2 border-black px-3 py-1.5 font-mono text-xs font-black shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
            >
              CONTACT
            </button>

          </div>

        </div>
      </nav>

      {/* ========================================== */}
      {/* ACT I: PROPORTIONAL RADIAL DIAL HUB     */}
      {/* ========================================== */}
      <main
        id="wheel"
        className="flex-1 flex flex-col items-center justify-start p-4 md:p-12 max-w-6xl mx-auto w-full relative"
      >

       <div className="relative w-full max-w-[720px] sm:max-w-[600px] md:max-w-[720px] aspect-square flex items-center justify-center mx-auto scale-[1.35] sm:scale-100 origin-center -translate-y-4 sm:translate-y-0 overflow-visible">

          <div
            className="absolute inset-2 rounded-full blur-3xl opacity-20 transition-all duration-700 pointer-events-none"
            style={{
              backgroundColor: displaySkill ? displaySkill.color : 'transparent',
              transform: displaySkill ? 'scale(1.15)' : 'scale(1)'
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
                const round = (value: number) => Number(value.toFixed(4));
                const segmentAngle = (skill.percentage / totalPercentage) * 360;
                const startAngle = currentAccumulatedAngle;
                const endAngle = startAngle + segmentAngle;
                const midAngle = startAngle + segmentAngle / 2;
                currentAccumulatedAngle = endAngle;

                const radiusInner = 140;
                const radiusOuter = 200;

                const rad = (deg: number) => (deg * Math.PI) / 180;

                const x1_in = round(
                  300 + radiusInner * Math.cos(rad(startAngle))
                );
                const y1_in = round(
                  300 + radiusInner * Math.sin(rad(startAngle))
                );
                const x2_in = round(
                  300 + radiusInner * Math.cos(rad(endAngle))
                );
                const y2_in = round(
                  300 + radiusInner * Math.sin(rad(endAngle))
                );

                const x1_out = round(
                  300 + radiusOuter * Math.cos(rad(startAngle))
                );
                const y1_out = round(
                  300 + radiusOuter * Math.sin(rad(startAngle))
                );
                const x2_out = round(
                  300 + radiusOuter * Math.cos(rad(endAngle))
                );
                const y2_out = round(
                  300 + radiusOuter * Math.sin(rad(endAngle))
                );

                // Anchor points for technical callout pointer lines
                const anchorArcX = round(
                  300 + radiusOuter * Math.cos(rad(midAngle))
                );
                const anchorArcY = round(
                  300 + radiusOuter * Math.sin(rad(midAngle))
                );

                const pointerLength = 40;

                const pointerEndX = round(
                  300 + (radiusOuter + pointerLength) * Math.cos(rad(midAngle))
                );

                const pointerEndY = round(
                  300 + (radiusOuter + pointerLength) * Math.sin(rad(midAngle))
                );

                // Label Box Positions
                const isRightSide = Math.cos(rad(midAngle)) >= 0;

                const labelX = round(
                  pointerEndX + (isRightSide ? 6 : -6)
                );

                const labelY = round(pointerEndY);

                const largeArcFlag = segmentAngle > 180 ? 1 : 0;
                const pathData = `
                  M ${x1_in} ${y1_in}
                  L ${x1_out} ${y1_out}
                  A ${radiusOuter} ${radiusOuter} 0 ${largeArcFlag} 1 ${x2_out} ${y2_out}
                  L ${x2_in} ${y2_in}
                  A ${radiusInner} ${radiusInner} 0 ${largeArcFlag} 0 ${x1_in} ${y1_in}
                  Z
                `;

               const isSelected = displaySkill?.name === skill.name;
               const labelLines = skill.labelLines ?? [skill.name];

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
                    <path
                      d={pathData}
                      fill={isSelected ? skill.color : "#f8f8f0"}
                      stroke={skill.color}
                      strokeWidth={isSelected ? "5.5" : "4"}
                      className="transition-all duration-300 hover:brightness-105"
                      style={{ pointerEvents: "all" }}
                    />

                    <line
                      x1={anchorArcX}
                      y1={anchorArcY}
                      x2={pointerEndX}
                      y2={pointerEndY}
                      stroke={isSelected ? skill.color : "#000000"}
                      strokeWidth={isSelected ? "3" : "1.5"}
                      strokeDasharray={isSelected ? "none" : "3,3"}
                      className="hidden sm:inline transition-all duration-300"
                    />

                    <rect
                      x={pointerEndX - 3}
                      y={pointerEndY - 3}
                      width="6"
                      height="6"
                      fill={skill.color}
                      stroke="#000000"
                      strokeWidth="1"
                      className="hidden sm:inline"
                    />

                    <g
                      transform={`translate(${labelX}, ${labelY})`}
                      className="hidden sm:inline"
                    >
                      {labelLines.map((line, index) => (
                        <text
                          key={line}
                          x="0"
                          y={index * 13}
                          textAnchor={isRightSide ? "start" : "end"}
                          dominantBaseline="central"
                          className="font-mono font-black text-[9px] sm:text-[10px] md:text-[12px] uppercase tracking-wider transition-colors duration-200"
                          fill={isSelected ? skill.color : "#000000"}
                        >
                          {line}
                        </text>
                      ))}

                      <text
                        x="0"
                        y={labelLines.length * 13 + 2}
                        textAnchor={isRightSide ? "start" : "end"}
                        dominantBaseline="central"
                        className="font-mono font-bold text-[8px] sm:text-[9px] md:text-[10px] tracking-widest fill-zinc-500"
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20">
  <div className="text-center w-[42%] aspect-square px-2 sm:px-4 flex flex-col justify-center items-center overflow-hidden">
              {isHoveringCore ? (
                <span className="font-mono text-xs md:text-sm font-black text-[#39ff14] tracking-widest block animate-pulse">
                  Discover the thinking behind the work ➔
                </span>
              ) : displaySkill ? (
                <div className="animate-fadeIn space-y-2">
                  <span className="font-mono text-[7px] sm:text-[9px] bg-black text-white px-1.5 sm:px-2 py-0.5 font-bold tracking-wider inline-block">
                    PORTFOLIO WEIGHT: {displaySkill.percentage}%
                  </span>
                  <h3
                    className="text-[11px] sm:text-base md:text-xl font-black uppercase font-sans tracking-tight leading-tight transition-all duration-300"
                    style={{ color: displaySkill.color }}
                  >
                    {displaySkill.name}
                  </h3>
                  <p className="font-mono text-[7px] sm:text-[9px] md:text-[10px] uppercase tracking-wider text-zinc-500 font-bold leading-tight">
                    {displaySkill.tagline}
                  </p>
                  <p className="hidden sm:block font-sans text-[11px] md:text-xs text-zinc-700 leading-normal">
                    {displaySkill.desc}
                  </p>
                  <p className="font-mono text-[9px] text-zinc-900 font-black pt-1">
                    {displaySkill.projects.length} RELATED PROJECTS ↓
                  </p>
                </div>
              ) : (
                <div className="font-mono w-full max-w-[150px] sm:max-w-[190px] md:max-w-[270px] text-xs sm:text-sm md:text-base font-bold text-purple-500 leading-relaxed flex flex-col items-center justify-center gap-2 -translate-y-1 sm:translate-y-0">
                  <Typewriter
                    text="Hi, I'm Aleks. I'm a creative developer & ethical systems engineer."
                    speed={35}
                  />

                  <div className="w-full mt-4 pt-2 border-t-1 border-[#39ff14]">
                    <span className="block text-black text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-widest text-center leading-tight">
                      TAP / CLICK A SEGMENT TO EXPLORE MY SKILLS
                      <span className="text-[#39ff14] ml-1">→</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedSkill && (
          <div
            id="skill-projects"
            className="w-full max-w-[720px] mt-6 px-4 sm:px-0 pointer-events-auto"
          >
            <div className="border-2 border-black bg-white p-4 sm:p-5 shadow-[6px_6px_0px_#000]">
              
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="font-mono text-[9px] sm:text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                    // RELATED PROJECTS
                  </p>

                  <h3
                    className="font-sans text-lg sm:text-xl font-black uppercase tracking-tight"
                    style={{ color: selectedSkill.color }}
                  >
                    {selectedSkill.name}
                  </h3>
                </div>

                <span className="font-mono text-[9px] sm:text-[10px] font-black whitespace-nowrap">
                  {selectedSkill.projects.length} PROJECTS
                </span>
              </div>
              <p
                className="font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-3"
                style={{ color: selectedSkill.color }}
              >
                CLICK A PROJECT TO VIEW →
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {selectedSkill.projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={(e) => {
                      e.stopPropagation();

                      setExpandedProject(project.id);
                      setActiveSkill(null);
                      setSelectedSkill(null);
                    }}
                    className="w-full border-2 border-black bg-[#fdfcf0] px-3 py-2.5 text-left flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-tight hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="text-zinc-500">
                      PROJECT
                    </span>

                   <span
                      aria-hidden="true"
                      style={{ color: project.color }}
                      className="font-black"
                    >
                      →
                    </span>

                    <span className="flex-1 truncate text-[11px] sm:text-xs">
                      {project.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <ScrollToTop
          onBackToWheel={() => {
            setExpandedProject(null);
            setActiveSkill(null);
            setSelectedSkill(null);
          }}
        />
      </main>


      {/* ========================================== */}
      {/* ACT II:  MAIN PROJECTS SECTION             */}
      {/* ========================================== */}
      <section id="artifacts" className="py-16 border-t-4 border-black px-6 md:px-16 bg-[#fdfcf0] scroll-mt-20">

        <div className="mb-12 max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#7000ff]">
              01 // ENGINEERING ARCHIVE
            </h2>

            <p className="mt-2 font-sans text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Selected Engineering Practice
            </p>

            <p className="mt-1 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              SOFTWARE ENGINEERING / MACHINE LEARNING / DATA
            </p>

            {activeSkill && (
              <p className="font-mono text-xs text-zinc-600 font-bold mt-3">
                FILTERED BY SKILL:{' '}
                <span style={{ color: activeSkill.color }}>
                  {activeSkill.name}
                </span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-8 items-start max-w-5xl mx-auto">

          {/* ARTEFACT A: FREEFROM14 CARD */}
          <div
            id="freefrom-card"
            onClick={() => setExpandedProject(expandedProject === 'freefrom' ? null : 'freefrom')}
            className={`group md:col-span-2 xl:col-span-6 border-2 border-black p-8 bg-white transition-all duration-300 relative cursor-pointer select-none shadow-[6px_6px_0px_#000] opacity-95 hover:opacity-100 hover:shadow-[12px_12px_0px_#7000ff] ${expandedProject === 'freefrom' ? 'ring-4 ring-[#7000ff]' : ''
              }`}
          >

            <div className="flex justify-between items-start mb-6">
              <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5 tracking-widest">
                MSc RESEARCH // FLAGSHIP
              </span>
              <span className="font-mono text-xs font-bold text-zinc-400">
                2026
              </span>
            </div>

            <h3 className="text-3xl font-black uppercase tracking-tight font-sans mb-4 group-hover:text-[#7000ff] transition-colors">
              FreeFrom14
            </h3>

            <p className="font-sans text-lg md:text-base leading-relaxed mb-6 text-zinc-700">
              Making allergen-aware recipe discovery easier to navigate.
            </p>
            <div className="relative w-full aspect-[4/3.5] overflow-hidden border-2 border-black mb-6">
              <Image
                src="/freefrom14/freefrom14-main.png"
                alt="FreeFrom14 recipe search interface showing allergen filters and recipe results"
                fill
                className="object-cover object-top object-left transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>

            
              <p className="font-sans text-sm leading-relaxed mb-6 opacity-90">
                An MSc research project exploring how NLP and faceted search could make
                allergen-aware recipe discovery easier to navigate. I built a full-stack
                prototype that combines structured allergen filtering with a hybrid NLP
                pipeline using rule-based matching, spaCy NER and Word2Vec semantic
                substitutions, while moving to a tiered approach to ethical data
                acquisition.
              </p>
          

            <div className="grid grid-cols-3 gap-3 mb-6 pt-4 border-t border-dashed border-zinc-300">
              <div>
                <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase">
                  AUDITED
                </p>
                <p className="text-2xl font-black">7,500</p>
                <p className="font-mono text-[9px] text-zinc-500">RECIPES</p>
              </div>

              <div>
                <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase">
                  CLEANED
                </p>
                <p className="text-2xl font-black">1,419</p>
                <p className="font-mono text-[9px] text-zinc-500">FALSE FLAGS</p>
              </div>

              <div>
                <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase">
                  SEARCH
                </p>
                <p className="text-2xl font-black">14</p>
                <p className="font-mono text-[9px] text-zinc-500">ALLERGEN GROUPS</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-dashed border-zinc-300">
              <a
                href="https://akreative.eu.pythonanywhere.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center bg-[#7000ff] text-[#39ff14] px-4 py-2 border-2 border-black font-mono text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_#000] hover:bg-black hover:shadow-[6px_6px_0px_#7000ff] transition-all"
              >
                LIVE DEMO ↗
              </a>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed border-zinc-300 font-mono text-[11px] font-bold text-zinc-600">
              <span className="bg-[#7000ff]/10 text-[#7000ff] px-2 py-1">#HTML/CSS/JS/PHP</span>
              <span className="bg-[#00f0ff]/10 text-[#00f0ff] px-2 py-1">#PYTHON</span>
              <span className="bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1">#MACHINE-LEARNING</span>
              <span className="bg-[#39ff14]/10 text-[#39ff14] px-2 py-1">#R/POSTGRESQL</span>
            </div>
          </div>
        
          
          {/* ARTEFACT B: CIFAR-10 IMAGE CLASSIFICATION CARD*/}
          <div
            id="cifar-card"
            onClick={() => setExpandedProject('cifar')}
            className="group md:col-span-1 xl:col-span-3 h-full border-2 border-black p-6 bg-white opacity-95 hover:opacity-100 transition-all duration-300 relative cursor-pointer select-none shadow-[6px_6px_0px_#000] hover:shadow-[12px_12px_0px_#ff00ff]"
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden border-2 border-black mb-5">
              <Image
                src="/cifar10/cifar10-results-graphic.png"
                alt="CIFAR-10 image classification project"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-[1.12]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] font-bold bg-black text-white px-2 py-0.5 tracking-widest">
                MACHINE LEARNING // FEATURED
              </span>

              <span className="font-mono text-xs font-bold text-zinc-400">
                2025
              </span>
            </div>

            <h3 className="text-2xl font-black uppercase tracking-tight font-sans mb-3 group-hover:text-[#ff00ff] transition-colors">
              CIFAR-10
            </h3>

            <p className="font-sans text-sm leading-relaxed mb-5 opacity-90">
              Explored CNN architecture, regularisation and transfer learning for image
              classification, comparing several model variations before testing MobileNetV2.
            </p>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed border-zinc-300 font-mono text-[10px] font-bold text-zinc-600">
              <span className="bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1">#PYTHON</span>
              <span className="bg-[#00f0ff]/10 text-[#00f0ff] px-2 py-1">#TENSORFLOW</span>
              <span className="bg-[#7000ff]/10 text-[#7000ff] px-2 py-1">#KERAS</span>
              <span className="bg-zinc-100 px-2 py-1">#CNN</span>
            </div>
          </div>
        
          {/* ARTEFACT C: BREAST CANCER CLASSIFICATION CARD*/}
          <div
            id="breast-cancer-card"
            onClick={() => {
              console.log("BREAST CLICKED");
              setExpandedProject(
                expandedProject === 'breast' ? null : 'breast'
              );
            }}
            className={`group md:col-span-1 xl:col-span-3 h-full border-2 border-2 border-black p-6 bg-white opacity-95 hover:opacity-100 transition-all duration-300 relative cursor-pointer select-none shadow-[6px_6px_0px_#000] hover:shadow-[12px_12px_0px_#7000ff] ${
              expandedProject === 'breast' ? 'ring-4 ring-[#7000ff]' : ''
            }`}
          >

            <div className="relative w-full aspect-[16/9] overflow-hidden border-2 border-black mb-5">
              <Image
                src="/breastCancer/BreastCancerModelComparison.png"
                alt="Breast cancer classification machine learning project"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-[1.12]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] font-bold bg-black text-white px-2 py-0.5 tracking-widest">
                MACHINE LEARNING // SUPPORTING
              </span>

              <span className="font-mono text-xs font-bold text-zinc-400">
                2025
              </span>
            </div>

            <h3 className="text-2xl font-black uppercase tracking-tight font-sans mb-3 group-hover:text-[#7000ff] transition-colors">
              Breast Cancer Classification
            </h3>

            <p className="font-sans text-sm leading-relaxed mb-5 opacity-90">
              Compared multiple supervised learning approaches, examining preprocessing,
              missing data and classification performance across several models.
            </p>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed border-zinc-300 font-mono text-[10px] font-bold text-zinc-600">
              <span className="bg-[#7000ff]/10 text-[#7000ff] px-2 py-1">#R</span>
              <span className="bg-[#00f0ff]/10 text-[#00f0ff] px-2 py-1">#KNN</span>
              <span className="bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1">#NAIVE-BAYES</span>
              <span className="bg-zinc-100 px-2 py-1">#NEURAL-NETWORK</span>
            </div>
          </div>

          {/* ARTEFACT D: WEARVIEW ACADEMY CARD */}
          <div
            id="wearview-card"
            onClick={() => setExpandedProject(expandedProject === 'wearview' ? null : 'wearview')}
            className={`group md:col-span-2 xl:col-span-6 xl:row-span-2 border-2 border-black p-8 bg-white transition-all duration-300 relative cursor-pointer select-none shadow-[6px_6px_0px_#000] opacity-95 hover:opacity-100 hover:shadow-[12px_12px_0px_#00f0ff] ${expandedProject === 'wearview' ? 'ring-4 ring-[#00f0ff]' : ''
              }`}
          >
            <div className="relative w-full aspect-[16/7] overflow-hidden border-2 border-black mb-6">
              <Image
                src="/wearview/completeJobs.png"
                alt="WearView Academy IT support management system"
                fill
                className="object-cover object-top transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 100vw"
              />
            </div>

            <div className="flex justify-between items-start mb-6">
              <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5 tracking-widest">
               SOFTWARE ENGINEERING // FEATURED
              </span>

              <span className="font-mono text-xs font-bold text-zinc-400">
                2025
              </span>
            </div>

            <h3 className="text-3xl font-black uppercase tracking-tight font-sans mb-4 group-hover:text-[#00f0ff] transition-colors">
              WearView Academy
            </h3>

            <p className="font-sans text-sm leading-relaxed mb-6 opacity-90">
              A web-based IT support management system for reporting, tracking and updating
              school IT issues, built with PHP, JavaScript and a relational database.
            </p>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed border-zinc-300 font-mono text-[11px] font-bold text-zinc-600">
              <span className="bg-[#00f0ff]/10 text-[#00f0ff] px-2 py-1">#PHP</span>
              <span className="bg-[#7000ff]/10 text-[#7000ff] px-2 py-1">#SQL</span>
              <span className="bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1">#JAVASCRIPT</span>
              <span className="bg-zinc-100 px-2 py-1">#SECURITY</span>
            </div>
          </div>
      
          {/* ARTEFACT E: BANK MARKETING ANN CARD */}
          <div
            id="bank-card"
            onClick={() =>
              setExpandedProject(
                expandedProject === 'bank' ? null : 'bank'
              )
            }
            className={`group md:col-span-2 xl:col-span-4 xl:row-span-2 border-2 border-black p-7 bg-white opacity-95 gap-8 h-full hover:opacity-100 transition-all duration-300 relative cursor-pointer select-none shadow-[6px_6px_0px_#000] hover:shadow-[12px_12px_0px_#39ff14] ${
              expandedProject === 'bank' ? 'ring-4 ring-[#39ff14]' : ''
            }`}
          >
            <div className="relative w-full aspect-[16/8] overflow-hidden border-2 border-black mb-6 bg-[#fdfcf0]">
              <Image
                src="/bankMarketing/BankMarketingMain.png"
                alt="Bank Marketing artificial neural network project"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-[1.3]"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>

            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5 tracking-widest">
                MACHINE LEARNING // SELECTED
              </span>

              <span className="font-mono text-xs font-bold text-zinc-400">
                2025
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-sans mb-2 group-hover:text-[#39ff14] transition-colors">
              Bank Marketing
            </h3>

            <p className="font-sans text-sm md:text-base leading-relaxed mb-6 text-zinc-700">
              Exploring artificial neural networks for binary classification, with a
              particular focus on class imbalance, oversampling and network architecture.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-dashed border-zinc-300">
              <div>
                <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase">
                  TASK
                </p>
                <p className="text-lg font-black uppercase">
                  BINARY
                </p>
                <p className="font-mono text-[9px] text-zinc-500">
                  CLASSIFICATION
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase">
                  FOCUS
                </p>
                <p className="text-lg font-black uppercase">
                  IMBALANCE
                </p>
                <p className="font-mono text-[9px] text-zinc-500">
                  DATA + MODELLING
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase">
                  ANN
                </p>
                <p className="text-lg font-black">
                  12
                </p>
                <p className="font-mono text-[9px] text-zinc-500">
                  HIDDEN NODES
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed border-zinc-300 font-mono text-[11px] font-bold text-zinc-600">
              <span className="bg-[#39ff14]/10 text-[#39ff14] px-2 py-1">#PYTHON</span>
              <span className="bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1">#ANN</span>
              <span className="bg-[#00f0ff]/10 text-[#00f0ff] px-2 py-1">#CLASSIFICATION</span>
              <span className="bg-zinc-100 px-2 py-1">#OVERSAMPLING</span>
            </div>
          </div>
        
          {/* ARTEFACT F: QUIZ CARD*/}
          <div
            id="quiz-card"
            onClick={() =>
              setExpandedProject(
                expandedProject === 'quiz' ? null : 'quiz'
              )
            }
            className={`group md:col-span-2 xl:col-span-2 xl:row-span-1 h-full gap-8 border-2 border-black p-5 bg-white transition-all duration-300 relative cursor-pointer select-none shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#ff00ff] ${
              expandedProject === 'quiz' ? 'ring-4 ring-[#ff00ff]' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[9px] font-bold bg-black text-white px-2 py-0.5 tracking-widest">
                PYTHON // MINI PROJECT
              </span>

              <span className="font-mono text-[9px] font-bold text-zinc-400">
                2025
              </span>
            </div>

            <h3 className="text-3xl font-black uppercase tracking-tight font-sans mb-2 group-hover:text-[#ff00ff] transition-colors">
              Quiz
            </h3>

            <p className="font-sans text-xs leading-relaxed mb-5 text-zinc-700">
              A command-line true-or-false quiz built in Python, using functions,
              dictionaries, input validation and score tracking for multiple players.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t border-dashed border-zinc-300">
              <div>
                <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase">
                  QUESTIONS
                </p>
                <p className="text-lg font-black">10</p>
              </div>

              <div>
                <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase">
                  INPUT
                </p>
                <p className="text-lg font-black">T / F</p>
              </div>

              <div>
                <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase">
                  PLAYERS
                </p>
                <p className="text-lg font-black">MULTI</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed border-zinc-300 font-mono text-[10px] font-bold text-zinc-600">
              <span className="bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1">#PYTHON</span>
              <span className="bg-zinc-100 px-2 py-1">#FUNCTIONS</span>
              <span className="bg-zinc-100 px-2 py-1">#VALIDATION</span>
            </div>
          </div>

          {/* ARTEFACT G: LIBRARY CATALOGUE CARD*/}
          <div
            id="catalogue-card"
            onClick={() =>
              setExpandedProject(
                expandedProject === 'catalogue' ? null : 'catalogue'
              )
            }
            className={`group md:col-span-2 xl:col-span-2 xl:row-span-1 h-full gap-8 border-2 border-black p-5 bg-white transition-all duration-300 relative cursor-pointer select-none shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#00f0ff] ${
              expandedProject === 'catalogue'
                ? "ring-4 ring-[#00b8ff]"
                : ""
            }`}
          >
            <div className="flex h-full flex-col justify-between">

              <div>
                <div className="flex items-start justify-between mb-4">
                  <span className="font-mono text-[9px] font-bold bg-black text-white px-2 py-0.5 tracking-widest">
                          PYTHON // PROJECT
                        </span>

                  <span className="font-mono text-xs font-bold">
                    2025
                  </span>
                </div>

                <h3 className="text-3xl font-black uppercase tracking-tight font-sans mb-2 group-hover:text-[#00f0ff] transition-colors">
                        Library Catalogue
                      </h3>

                <p className="mt-3 text-sm leading-relaxed">
                  A Python-based library management system exploring
                  object-oriented programming, catalogue operations and
                  book borrowing logic.
                </p>
              </div>

              <div className="mt-6">
                <div className="grid grid-cols-3 border-t-2 border-black pt-3 font-mono text-[10px] font-bold">
                  <div>
                    <p>LANGUAGE</p>
                    <p className="mt-1 text-sm">PYTHON</p>
                  </div>

                  <div>
                    <p>FOCUS</p>
                    <p className="mt-1 text-sm">OOP</p>
                  </div>

                  <div>
                    <p>SYSTEM</p>
                    <p className="mt-1 text-sm">LOANS</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed border-zinc-300 font-mono text-[11px] font-bold text-zinc-600">
                        <span className="bg-[#39ff14]/10 text-[#39ff14] px-2 py-1">#PYTHON</span>
                        <span className="bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1">#OOP</span>
                        <span className="bg-[#00f0ff]/10 text-[#00f0ff] px-2 py-1">#LIBRARY-SYSTEMS</span>
                        <span className="bg-zinc-100 px-2 py-1">#DATA_STRUCTURES</span>
                      </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* ACT III: VISUAL ARCHIVE                 */}
      {/* ========================================== */}

      <section
        id="visual-archive"
        className="py-16 md:py-20 px-6 md:px-16 bg-[#fdfcf0] border-t-4 border-black scroll-mt-20"
      >
        <div className="max-w-5xl mx-auto">

          {/* ARCHIVE HEADER */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#7000ff] mb-3">
                  02 // VISUAL ARCHIVE
                </p>

                <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
                  Earlier Creative Practice
                </h2>

                <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-700">
                  Selected work from an earlier design practice spanning graphic
                  design, editorial systems, photography and visual experimentation.
                </p>
              </div>

              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 md:text-right">
                GRAPHIC DESIGN<br />
                COLLEGE + BA
              </div>

            </div>
          </div>


          {/* ARCHIVE DIVIDER */}
          <div className="border-t-2 border-dashed border-zinc-300 mb-8 pt-3 flex justify-between items-center">
            <span className="font-mono text-[9px] font-black uppercase tracking-widest text-zinc-500">
              // SELECTED ARCHIVE MATERIAL
            </span>

            <span className="font-mono text-[9px] font-bold text-zinc-400">
              01 / —
            </span>
          </div>


          {/* ARCHIVE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* ========================================== */}
            {/* VISUAL ARCHIVE - ARTEFACT H: PORTRAITS 14 CARD */}

            <div
              onClick={() =>
                setExpandedProject(
                  expandedProject === 'portraits'
                    ? null
                    : 'portraits'
                )
              }
              className={`group md:col-span-3 border-4 border-black bg-white cursor-pointer select-none transition-all duration-300 relative overflow-hidden shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#ff00ff] ${
                expandedProject === 'portraits'
                  ? 'ring-4 ring-[#ff00ff]'
                  : ''
              }`}
            >

              <div className="grid grid-cols-1 md:grid-cols-[1fr_0.78fr]">

                {/* LEFT — PROJECT INFORMATION */}
                <div className="p-6 sm:p-8 flex flex-col justify-center">

                  <div className="flex justify-between items-start gap-4 mb-6">

                    <span className="font-mono text-[10px] font-bold bg-black text-[#ff00ff] px-2 py-0.5 tracking-widest">
                      BA GRAPHIC DESIGN // FEATURED
                    </span>

                    <span className="font-mono text-xs font-bold text-zinc-400">
                      2014
                    </span>

                  </div>


                  {/* WINNER BADGE */}
                  <div className="mb-5">
                    <span className="font-mono text-[9px] font-black bg-[#ff00ff] text-white px-2 py-1 tracking-widest">
                      COMPETITION WINNER
                    </span>
                  </div>


                  <h3 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none mb-5 group-hover:text-[#ff00ff] transition-colors">
                    Portraits 2014
                  </h3>


                  <p className="font-sans text-sm sm:text-base leading-relaxed text-zinc-700 max-w-xl">
                    An exhibition identity exploring stereotyping, judgement and
                    hidden identity through layered portraiture, colour and a
                    four-gallery visual system.
                  </p>


                  <div className="flex flex-wrap gap-2 pt-5 mt-7 border-t border-dashed border-zinc-300 font-mono text-[9px] font-bold text-zinc-600">

                    <span className="bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1">
                      #PORTRAITURE
                    </span>

                    <span className="bg-[#00f0ff]/10 text-[#00f0ff] px-2 py-1">
                      #VISUAL_IDENTITY
                    </span>

                    <span className="bg-[#7000ff]/10 text-[#7000ff] px-2 py-1">
                      #TYPOGRAPHY
                    </span>

                    <span className="bg-[#39ff14]/10 text-[#39ff14] px-2 py-1">
                      #EXHIBITION
                    </span>

                  </div>


                  <div className="mt-7 font-mono text-[9px] font-black uppercase tracking-widest text-zinc-400">
                    CLICK TO EXPLORE PROJECT →
                  </div>

                </div>


              {/* RIGHT — FULL PORTRAIT POSTER */}
              <div className="relative bg-[#f7f7f2] border-t-4 md:border-t-0 md:border-l-4 border-black p-4 sm:p-6">

                <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">

                  <Image
                    src="/Portraits2014/Portraits2014.jpg"
                    alt="Portraits 2014 poster"
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />

                </div>

                <div className="mt-3 flex justify-between items-center font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                  <span>PRIMARY ARTWORK</span>
                  <span>01 / 01</span>
                </div>

              </div>

            </div>
          </div>


            {/* ========================================== */}
            {/* VISUAL ARCHIVE - ARTEFACT H: TYPOGRAPHY SPECIMEN   */}

            <div
              onClick={() =>
                setExpandedProject(
                  expandedProject === 'typography'
                    ? null
                    : 'typography'
                )
              }
              className={`group border-4 border-black bg-white cursor-pointer select-none transition-all duration-300 relative overflow-hidden shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#00f0ff] ${
                expandedProject === 'typography'
                  ? 'ring-4 ring-[#00f0ff]'
                  : ''
              }`}
            >

              {/* MAIN IMAGE */}
              <div className="relative w-full aspect-[4/5] overflow-hidden border-b-4 border-black bg-white">

                <Image
                  src="/TypographySpecimenISTD/istd2.jpg"
                  alt="Typography specimen project"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                <div className="absolute top-3 left-3">
                  <span className="font-mono text-[9px] font-black bg-black text-[#00f0ff] px-2 py-1 tracking-widest">
                    TYPOGRAPHY STUDY
                  </span>
                </div>

              </div>


              {/* CARD CONTENT */}
              <div className="p-5">

                <div className="flex justify-between items-start gap-3 mb-4">

                  <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-0.5 tracking-widest">
                    BA GRAPHIC DESIGN
                  </span>

                  <span className="font-mono text-[10px] font-bold text-zinc-400">
                    2014
                  </span>

                </div>


                <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-3 group-hover:text-[#00f0ff] transition-colors">
                  Typography Specimen
                </h3>


                <p className="font-sans text-sm leading-relaxed text-zinc-700">
                  An experimental type specimen exploring hierarchy, scale,
                  spacing, glyphs and typographic composition through print
                  and digital presentation.
                </p>


                <div className="flex flex-wrap gap-2 pt-4 mt-5 border-t border-dashed border-zinc-300 font-mono text-[9px] font-bold text-zinc-600">

                  <span className="bg-[#00f0ff]/10 text-[#00f0ff] px-2 py-1">
                    #TYPE
                  </span>

                  <span className="bg-[#7000ff]/10 text-[#7000ff] px-2 py-1">
                    #EDITORIAL
                  </span>

                  <span className="bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1">
                    #LAYOUT
                  </span>

                  <span className="bg-[#39ff14]/10 text-[#39ff14] px-2 py-1">
                    #WEB
                  </span>

                </div>

              </div>

            </div>

            {/* ========================================== */}
            {/* VISUAL ARCHIVE: MANIFESTO CARD*/}
            <div
              onClick={() =>
                setExpandedProject(
                  expandedProject === 'manifesto' ? null : 'manifesto'
                )
              }
              className={`group h-full border-2 border-black bg-white transition-all duration-300 relative cursor-pointer select-none shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#ff00ff] ${
                expandedProject === 'manifesto' ? 'ring-4 ring-[#ff00ff]' : ''
              }`}
            >
              {/* IMAGE */}
              <div className="relative w-full aspect-[4/3] overflow-hidden border-b-2 border-black bg-[#f7f3e8]">
                <Image
                  src="/manifesto/manifesto6.jpg"
                  alt="Manifesto concertina books and printed outcomes"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* CARD CONTENT */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <span className="font-mono text-[10px] font-bold bg-black text-white px-2 py-0.5 tracking-widest">
                    BA GRAPHIC DESIGN // PERSONAL ETHOS
                  </span>

                  <span className="font-mono text-xs font-bold text-zinc-400 whitespace-nowrap">
                    2014
                  </span>
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tight font-sans mb-3 group-hover:text-[#ff00ff] transition-colors">
                  Manifesto
                </h3>

                <p className="font-sans text-sm leading-relaxed mb-5 opacity-90">
                  A print-led exploration of personal creative principles, using
                  experimentation, controlled mistakes, glitch processes and mixed
                  media to turn failure into visual material.
                </p>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed border-zinc-300 font-mono text-[10px] font-bold text-zinc-600">
                  <span className="bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1">
                    #GLITCH
                  </span>

                  <span className="bg-[#7000ff]/10 text-[#7000ff] px-2 py-1">
                    #LETTERPRESS
                  </span>

                  <span className="bg-[#00f0ff]/10 text-[#00f0ff] px-2 py-1">
                    #BOOK-DESIGN
                  </span>

                  <span className="bg-zinc-100 px-2 py-1">
                    #EXPERIMENTATION
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* VISUAL ARCHIVE CARD A: STUDENT HANDBOOK      */}
            
            <div
              onClick={() =>
                setExpandedProject(
                  expandedProject === 'student-handbook'
                    ? null
                    : 'student-handbook'
                )
              }
              className={`group md:col-span-1 border-4 border-black bg-white cursor-pointer select-none transition-all duration-300 relative overflow-hidden shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#7000ff] ${
                expandedProject === 'student-handbook'
                  ? 'ring-4 ring-[#7000ff]'
                  : ''
              }`}
            >

              {/* IMAGE */}
              <div className="relative w-full aspect-[4/5] overflow-hidden border-b-4 border-black bg-white">
                <Image
                  src="/FMP/CollegeFMP1.jpg"
                  alt="Student Handbook graphic design project"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* SMALL OVERLAY */}
                <div className="absolute top-3 left-3">
                  <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-1 tracking-widest">
                    DISTINCTION
                  </span>
                </div>

              </div>


              {/* CARD CONTENT */}
              <div className="p-5">

                <div className="flex justify-between items-start gap-3 mb-4">
                  <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-0.5 tracking-widest">
                    EARLY PRACTICE // PRINT
                  </span>

                  <span className="font-mono text-[10px] font-bold text-zinc-400 whitespace-nowrap">
                    COLLEGE
                  </span>
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tight mb-3 group-hover:text-[#7000ff] transition-colors">
                  Student Handbook
                </h3>

                <p className="font-sans text-sm leading-relaxed text-zinc-700">
                  Editorial handbook designed for international students,
                  combining information architecture, photography, typography
                  and layered print treatments.
                </p>

                <div className="flex flex-wrap gap-2 pt-4 mt-5 border-t border-dashed border-zinc-300 font-mono text-[9px] font-bold text-zinc-600">
                  <span className="bg-[#7000ff]/10 text-[#7000ff] px-2 py-1">
                    #EDITORIAL
                  </span>

                  <span className="bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1">
                    #TYPOGRAPHY
                  </span>

                  <span className="bg-[#00f0ff]/10 text-[#00f0ff] px-2 py-1">
                    #PHOTOGRAPHY
                  </span>

                  <span className="bg-[#39ff14]/10 text-[#39ff14] px-2 py-1">
                    #PRINT
                  </span>
                </div>

              </div>
            </div>

          </div>
 
        </div>
      </section>

      {/* ========================================== */}
      {/* 📜 ACT IV: MANIFESTO AREA                  */}
      {/* ========================================== */}
      <section id="manifesto" className="min-h-screen bg-white border-t-4 border-black p-8 md:p-16 flex flex-col items-center scroll-mt-20">
        <div className="max-w-5xl w-full flex flex-col lg:flex-row justify-between items-start gap-12 pt-12">

          <div className="flex-1 space-y-16 font-sans">

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#39ff14] bg-black px-2 py-0.5 inline-block mb-6 font-mono">
                // A LITTLE ABOUT HOW I THINK
              </p>

              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight font-sans">
                HOW I THINK, WORK &amp; BUILD
              </h2>
            </div>

            {/* DESIGN + CODE */}
            <div className="space-y-4">
              <div className="space-y-3 border-b border-zinc-200 pb-3">

                <span className="font-mono text-xs font-black text-[#ff00ff] block">
                  [ 01 // THE_FOUNDATION ]
                </span>

                <div className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tighter leading-none text-right whitespace-nowrap text-[#ff00ff]">
                  <Typewriter
                    text="_DESIGN + CODE"
                    speed={225}
                    onComplete={() => setIntroFinished(true)}
                  />
                </div>

              </div>

              <p className="text-base md:text-lg leading-relaxed text-zinc-800 text-justify">
                I have an <span className="font-black text-black">MSc in Computer Science (Distinction)</span> and a <span className="font-black text-black">BA in Graphic Design (2:1)</span>.
                For me, technology and design have always been closely connected. I like understanding how things work, figuring out why they don&apos;t, and finding ways to make them better.
                I care about building software that is useful, accessible and thoughtfully made.
              </p>
            </div>

            {/* UNDER PRESSURE */}
            <div className="space-y-4">
              <div className="space-y-3 border-b border-zinc-200 pb-3">

                <span className="font-mono text-xs font-black text-[#7000ff] block">
                  [ 02 // THE_EXPERIENCE ]
                </span>

                <div className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tighter leading-none text-right whitespace-nowrap text-[#7000ff]">
                  <Typewriter
                    text="_UNDER PRESSURE"
                    speed={225}
                    onComplete={() => setIntroFinished(true)}
                  />
                </div>

              </div>

              <p className="text-base md:text-lg leading-relaxed text-zinc-800 text-justify">
                A lot of my problem-solving mindset comes from working in an acute emergency general surgery environment.
                Before becoming a software engineer, I spent years working where things could change quickly and getting the details right mattered.
                Managing patient information, busy workflows and competing priorities taught me to stay organised, communicate clearly and think calmly when things don&apos;t go to plan.
              </p>
            </div>

            {/* SOLVE + ADAPT */}
            <div className="space-y-4">
              <div className="space-y-3 border-b border-zinc-200 pb-3">

                <span className="font-mono text-xs font-black text-[#7000ff] block">
                  [ 03 // THE_APPROACH ]
                </span>

                <div className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tighter leading-none text-right whitespace-nowrap bg-gradient-to-r from-[#ff00ff] via-fuchsia-500 to-[#7000ff] bg-clip-text text-transparent">
                  <Typewriter
                    text="_SOLVE + ADAPT"
                    speed={225}
                    onComplete={() => setIntroFinished(true)}
                  />
                </div>

              </div>

              <p className="text-base md:text-lg leading-relaxed text-zinc-800 text-justify">
                I don&apos;t panic easily. When something goes wrong, my first instinct is to understand the problem, work out what matters most and start fixing it.
                I&apos;m naturally diplomatic and I value clear communication, especially when people have different priorities or perspectives.
                I enjoy solving problems, working things through with others and finding practical solutions rather than making things more complicated than they need to be.
              </p>
            </div>

          </div>

          {/* Right Block: Portrait Photo */}
          <div className="shrink-0 w-full max-w-[220px] sm:max-w-[240px] md:max-w-[260px] lg:w-[320px] lg:max-w-none mx-auto lg:mx-0 lg:sticky lg:top-28 select-none">
  <div className="relative group/portrait p-3">

    {/* Star shadow */}
    <div
      className="absolute inset-3 bg-black translate-x-2 translate-y-2 transition-transform group-hover/portrait:translate-x-3 group-hover/portrait:translate-y-3 duration-200"
      style={{
        clipPath:
          'polygon(50% 0%, 61% 20%, 83% 10%, 75% 33%, 98% 35%, 80% 53%, 90% 75%, 68% 70%, 65% 95%, 48% 78%, 30% 92%, 32% 68%, 8% 70%, 21% 51%, 2% 31%, 25% 32%, 18% 9%, 40% 19%)'
      }}
    />

    {/* Star photo */}
    <div
      className="absolute inset-3 bg-zinc-200 border-2 border-black overflow-hidden transition-transform group-hover/portrait:-translate-x-1 group-hover/portrait:-translate-y-1 duration-200 z-10"
      style={{
        clipPath:
          'polygon(50% 0%, 61% 20%, 83% 10%, 75% 33%, 98% 35%, 80% 53%, 90% 75%, 68% 70%, 65% 95%, 48% 78%, 30% 92%, 32% 68%, 8% 70%, 21% 51%, 2% 31%, 25% 32%, 18% 9%, 40% 19%)'
      }}
    >
      <Image
        src="/my_portrait.png"
        alt="Aleksandra Kowalska Portrait"
        fill
        priority
        className="object-cover filter grayscale contrast-125 transition-all duration-300 group-hover/portrait:grayscale-0 group-hover/portrait:scale-105"
      />
    </div>

    {/* Keeps the wrapper at the correct height */}
    <div className="w-full aspect-square" />

  </div>
</div>

        </div>
      </section>


      {/* ========================================== */}
      {/* 📜 ACT V: TIMELINE & HISTORY             */}
      {/* ========================================== */}
      <section id="history" className="py-16 pb-24 bg-[#fdfcf0] px-6 md:px-16 scroll-mt-20 border-t-4 border-black">

        <div className="mb-12 max-w-5xl mx-auto">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#7000ff]">
            02 // REAL-WORLD OPERATIONAL HISTORY &amp; EDUCATION
          </h2>
        </div>

        <div className="w-full max-w-5xl mx-auto border-l-4 border-black pl-6 sm:pl-7 lg:pl-8 space-y-12 relative">

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
                Advanced core modules in Software Engineering, Data Structures &amp; Algorithms, Database Systems Normalisation, and Full-Stack Architecture Development.
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
              <li>Collected patient metrics to support expansion planning, contributing to the development of a custom Same Day Emergency Care pathway.</li>
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
      {/* ARTEFACT A: SLIDE-OUT PANEL (FREEFROM14) */}
      {/* ========================================== */}
      <div
        className={`fixed inset-0 z-50 flex justify-start transition-all duration-700 ease-in-out ${
          expandedProject === 'freefrom'
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* BACKDROP */}
        <div
          onClick={() => setExpandedProject(null)}
          className="absolute inset-0 bg-gradient-to-tr from-[#7000ff]/40 via-black/20 to-[#7000ff]/40 backdrop-blur-md"
        />
        {/* PANEL */}
        <div
        className={`absolute left-0 top-0 z-[100] h-full w-full max-w-3xl border-r-4 border-black bg-[#fdfcf0] flex flex-col transition-transform duration-700 ease-in-out transform shadow-[10px_0px_0px_#000] ${
          expandedProject === 'freefrom'
            ? 'translate-x-0'
            : '-translate-x-full'
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

          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-14 font-sans">

            {/* PROJECT INTRO */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#7000ff] font-bold mb-3">
                MSc Computer Science // Research Project // 2026
              </p>

              <h2 className="text-4xl sm:text-5xl font-bold text-[#7000ff] uppercase tracking-tight">
                FreeFrom14
              </h2>

              <p className="mt-4 text-base sm:text-lg font-bold leading-relaxed max-w-xl">
                Making allergen-aware recipe discovery easier to navigate.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
              <div className="border-2 border-black bg-black text-white p-3">
                <p className="font-mono text-[9px] uppercase text-[#39ff14]">
                  PROJECT
                </p>
                <p className="font-black text-sm mt-1">
                  MSc RESEARCH
                </p>
              </div>

              <div className="border-2 border-black bg-white p-3">
                <p className="font-mono text-[9px] uppercase text-[#7000ff]">
                  DATA
                </p>
                <p className="font-black text-sm mt-1">
                  7,500 RECIPES
                </p>
              </div>

              <div className="border-2 border-black bg-white p-3">
                <p className="font-mono text-[9px] uppercase text-[#7000ff]">
                  NLP
                </p>
                <p className="font-black text-sm mt-1">
                  HYBRID APPROACH
                </p>
              </div>

              <div className="border-2 border-black bg-white p-3">
                <p className="font-mono text-[9px] uppercase text-[#7000ff]">
                  EVALUATION
                </p>
                <p className="font-black text-sm mt-1">
                  16 PARTICIPANTS
                </p>
              </div>
            </div>

            {/* PROJECT LINKS */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://akreative.eu.pythonanywhere.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center bg-[#7000ff] text-[#39ff14] px-4 py-2 border-2 border-black font-mono text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_#000] hover:bg-black hover:shadow-[6px_6px_0px_#7000ff] transition-all"
              >
                LIVE DEMO ↗
              </a>

              <a
                href="https://github.com/akreative-dev/free_from_14"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center bg-white text-black px-4 py-2 border-2 border-black font-mono text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_#7000ff] hover:bg-black hover:text-white hover:shadow-[6px_6px_0px_#7000ff] transition-all"
              >
                VIEW CODE ↗
              </a>
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
            <section className="space-y-6 border-t-2 border-black pt-8">
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
            <section className="space-y-6 border-t-2 border-black pt-8">
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
            <section className="space-y-6 border-t-2 border-black pt-8">
              <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
                04 // The System
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                From fragmented data to structured search.
              </h3>
              
              <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                DATA → PROCESSING → INTELLIGENCE → DELIVERY
              </p>
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
                    <div className="border-2 border-black bg-white p-4 sm:p-5 flex gap-4 items-start shadow-[3px_3px_0px_#000]">
                      <span className="font-mono text-xs sm:text-sm font-black text-[#7000ff] min-w-7">
                        {number}
                      </span>

                      <div>
                        <h4 className="font-mono text-xs sm:text-sm font-black tracking-wide">
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
            <section className="space-y-6 border-t-2 border-black pt-8">
              <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
                05 // The Intelligence
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                Why one method wasn't enough.
              </h3>

              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                The first approach used strict keyword matching. It was fast and
                understandable, but recipe language is rarely that tidy. Different
                ingredients and ways of describing the same thing could leave gaps in
                what the system recognised.
              </p>

              {/* NLP PIPELINE */}
              <div className="space-y-2">
              
              <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                INCREASING SEMANTIC FLEXIBILITY
              </p>
                {/* REGEX */}
                <div className="border-2 border-black p-5 bg-[#fff3b0]">
                  <div className="flex gap-4 items-start">
                    <span className="font-mono text-xs font-black text-[#7000ff]">
                      01
                    </span>

                    <div className="flex-1">
                      <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase">
                        SYMBOLIC BASELINE
                      </p>

                      <h4 className="text-lg sm:text-xl font-black mt-1">
                        REGEX / RULE-BASED MATCHING
                      </h4>

                      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                        Deterministic rules for known patterns, structured terms and
                        explicit ingredient signals.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CONNECTOR */}
                <div className="h-5 border-l-2 border-black ml-7" />

                {/* SPACY */}
                <div className="border-2 border-black p-5 bg-white">
                  <div className="flex gap-4 items-start">
                    <span className="font-mono text-xs font-black text-[#7000ff]">
                      02
                    </span>

                    <div className="flex-1">
                      <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase">
                        ENTITY EXTRACTION
                      </p>

                      <h4 className="text-lg sm:text-xl font-black mt-1">
                        spaCy NER
                      </h4>

                      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                        Used to identify ingredient-related entities in less structured
                        recipe text.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CONNECTOR */}
                <div className="h-5 border-l-2 border-black ml-7" />

                {/* WORD2VEC */}
                <div className="border-2 border-black p-5 bg-[#e0f2fe]">
                  <div className="flex gap-4 items-start">
                    <span className="font-mono text-xs font-black text-[#7000ff]">
                      03
                    </span>

                    <div className="flex-1">
                      <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase">
                        SEMANTIC EXPLORATION
                      </p>

                      <h4 className="text-lg sm:text-xl font-black mt-1">
                        WORD2VEC
                      </h4>

                      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                        Used to explore semantic relationships between ingredients and
                        potential substitutions.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* WHY HYBRID */}
              <div className="border-2 border-black bg-black text-white p-5">
                <p className="font-mono text-[10px] font-bold text-[#39ff14] uppercase tracking-widest">
                  WHY HYBRID?
                </p>

                <p className="mt-3 text-sm sm:text-base leading-relaxed">
                  The project explored how deterministic rules and semantic NLP could
                  complement one another rather than treating one technique as a complete
                  replacement for the others.
                </p>
              </div>

              {/* SMALL TECHNICAL DETAIL */}
              <div className="border-l-4 border-[#7000ff] pl-4">
                <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase">
                  WORD2VEC CONFIGURATION
                </p>

                <p className="mt-1 text-sm text-zinc-700">
                  vector_size=200 · window=3 · min_count=2 · sg=1
                </p>
              </div>
            </section>

            {/* STACK / METHODS */}
            <section className="space-y-5 border-t-2 border-black pt-8">
              <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
                TOOLS, METHODS & INFRASTRUCTURE
              </p>

              <div className="border-2 border-black bg-black p-2 shadow-[5px_5px_0px_#000]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    "PYTHON",
                    "FLASK",
                    "POSTGRESQL",
                    "SUPABASE",
                    "SPACY",
                    "WORD2VEC",
                    "REGEX / RULES",
                    "JINJA2",
                    "HTML / CSS",
                    "JAVASCRIPT",
                    "PYTEST",
                    "OPEN DATA / APIS",
                  ].map((item) => (
                    <div
                      key={item}
                      className="border-2 border-black bg-white p-3 text-center"
                    >
                      <p className="font-mono text-[10px] sm:text-xs font-black tracking-wide">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed">
                Technologies and methods used across data acquisition, NLP, database
                design, application development and evaluation.
              </p>
            </section>

            {/* 06 — SEARCH EXPERIENCE */}
            <section className="space-y-6 border-t-2 border-black pt-8">
              <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
                06 // The Search Experience
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                Search should support exploration, not create more work.
              </h3>
              
              {/* SEARCH EXPERIENCE SCREENSHOT */}
              <div className="border-2 border-black bg-white p-3 shadow-[5px_5px_0px_#000]">
                <div className="border-2 border-black overflow-hidden">
                  <Image
                    src="/freefrom14/chickenSearch.png"
                    alt="FreeFrom14 search results showing chicken recipes with allergen filters"
                    width={1200}
                    height={900}
                    className="w-full h-auto"
                  />
                </div>

                <div className="mt-3 border-t-2 border-black pt-3 flex items-center justify-between gap-3">
                <p className="font-mono text-xs font-black uppercase tracking-widest text-[#7000ff]">
                  SEARCH / FILTER
                </p>

                <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 text-right">
                  Progressive recipe discovery
                </p>
              </div>
              </div>

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

              {/* SUBSTITUTION FEATURE */}
              <div className="border-2 border-black bg-[#7000ff] text-white p-5 sm:p-6 shadow-[5px_5px_0px_#000]">

                <p className="font-mono text-[10px] font-bold text-[#39ff14] uppercase tracking-widest">
                  // KEY DESIGN SHIFT
                </p>

                <h4 className="text-2xl sm:text-3xl font-black uppercase leading-tight mt-2">
                  From exclusion
                  <br />
                  to substitution.
                </h4>

                <p className="mt-4 text-sm sm:text-base leading-relaxed max-w-xl">
                  Instead of stopping at an allergen warning, the project explored how
                  semantic relationships could help users discover functional alternatives.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                  <div className="flex-1 border-2 border-white bg-black p-4">
                    <p className="font-mono text-[10px] text-[#39ff14] uppercase">
                      EXCLUDED
                    </p>

                    <p className="font-black text-lg mt-1">
                      HONEY
                    </p>
                  </div>

                  <div className="flex items-center justify-center font-mono text-2xl font-black">
                    →
                  </div>

                  <div className="flex-1 border-2 border-white bg-white text-black p-4">
                    <p className="font-mono text-[10px] text-[#7000ff] uppercase">
                      EXPLORE
                    </p>

                    <p className="font-black text-lg mt-1">
                      MOLASSES
                    </p>
                  </div>

                </div>

                <p className="font-mono text-[9px] uppercase text-zinc-200 mt-4">
                  Semantic relationship explored through Word2Vec
                </p>
                  {/* AI SAFETY SWAPS SCREENSHOT */}
                  <div className="border-2 border-black bg-white p-3 shadow-[5px_5px_0px_#000]">
                    <div className="border-2 border-black overflow-hidden">
                      <Image
                        src="/freefrom14/aiSwaps2.png"
                        alt="FreeFrom14 recipe detail showing pantry context, ingredients and AI Safety Swaps"
                        width={1165}
                        height={1315}
                        className="w-full h-auto"
                      />
                    </div>

                    <div className="mt-3 border-t-2 border-black pt-3 flex items-center justify-between gap-3">
                      <p className="font-mono text-xs font-black uppercase tracking-widest text-[#7000ff]">
                        SEMANTIC SUBSTITUTION
                      </p>

                      <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 text-right">
                        From exclusion to exploration
                      </p>
                    </div>
                  </div>

                  {/* RECIPE DETAIL SCREENSHOT */}
                  <div className="border-2 border-black bg-white p-3 shadow-[5px_5px_0px_#000]">
                    <div className="border-2 border-black overflow-hidden">
                      <Image
                        src="/freefrom14/recipeDetailPage.png"
                        alt="FreeFrom14 recipe detail page showing ingredients, method and allergen-aware safety information"
                        width={1200}
                        height={900}
                        className="w-full h-auto"
                      />
                    </div>

                    <div className="mt-3 border-t-2 border-black pt-3 flex items-center justify-between gap-3">
                      <p className="font-mono text-xs font-black uppercase tracking-widest text-[#7000ff]">
                        RECIPE DETAIL
                      </p>

                      <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 text-right">
                        Allergen-aware recipe view
                      </p>
                    </div>
                  </div>
              </div>
            
              
            
            </section>


            {/* 07 — RESULTS */}
            <section className="space-y-6 border-t-2 border-black pt-8">
              <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
                07 // Testing & Results
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                The system had to be tested — not just built.
              </h3>

              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                Evaluation combined technical testing with user feedback, allowing the
                project to look beyond whether the search worked and ask whether it was
                understandable, usable and useful.
              </p>

              <div className="grid grid-cols-2 gap-3">

                <div className="border-2 border-black p-4 bg-black text-white">
                  <p className="text-3xl sm:text-4xl font-black">
                    7,500
                  </p>
                  <p className="font-mono text-[10px] uppercase mt-2">
                    Recipes evaluated
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
                  <p className="text-3xl sm:text-4xl font-black text-[#7000ff]">
                    89.6
                  </p>
                  <p className="font-mono text-[10px] uppercase mt-2">
                    Composite usability / 100
                  </p>
                </div>

              </div>

              {/* PERFORMANCE HIGHLIGHTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div className="border-2 border-black p-4 bg-[#e0f2fe]">
                  <p className="text-3xl sm:text-4xl font-black">
                    &lt; 5 sec
                  </p>
                  <p className="font-mono text-[10px] uppercase mt-2">
                    Average allergen identification
                  </p>
                </div>

                <div className="border-2 border-black p-4 bg-[#ffb7ef]">
                  <p className="text-3xl sm:text-4xl font-black">
                    17.94%
                  </p>
                  <p className="font-mono text-[10px] uppercase mt-2">
                    Tree Nut false-positive reduction
                  </p>
                </div>

              </div>

              {/* TASK SUCCESS */}
              <div className="border-2 border-black bg-white p-5">

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase">
                      TASK 02
                    </p>

                    <h4 className="font-black text-xl mt-1">
                      Search & Filter
                    </h4>
                  </div>

                  <p className="text-3xl sm:text-4xl font-black text-[#39ff14]">
                    100%
                  </p>
                </div>

                <p className="text-sm text-zinc-700 leading-relaxed mt-3">
                  All participants successfully completed the search-and-filter task,
                  providing a useful indication that the core faceted interaction was
                  understandable in testing.
                </p>

              </div>

              <p className="text-xs text-zinc-500 leading-relaxed">
                Results are presented within the context of the MSc research prototype
                and its evaluation methodology.
              </p>

              {/* RESULTS INTERPRETATION */}
              <div className="border-2 border-black bg-[#7000ff] text-white p-5 sm:p-6 shadow-[5px_5px_0px_#000]">
                <p className="font-mono text-[10px] font-bold text-[#39ff14] uppercase tracking-widest">
                  // WHAT THE RESULTS SUGGEST
                </p>

                <p className="mt-3 text-base sm:text-lg font-bold leading-relaxed">
                  The results suggested that the hybrid approach reduced some false-positive
                  allergen flags, while user testing indicated that the core search-and-filter
                  interaction was understandable in practice.
                </p>
              </div>
            </section>

            {/* 08 — SECURITY & TRUST */}
            <section className="space-y-6 border-t-2 border-black pt-8">

              <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
                08 // Security & Trust
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                Building an allergen-aware system meant thinking about trust beyond the UI.
              </h3>

              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                Because the system processes user input and returns information that could influence
                dietary decisions, security and trust had to be considered throughout the application.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div className="border-2 border-black p-4 bg-white">
                  <h4 className="font-mono text-xs font-black tracking-widest">
                    DATABASE
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                    Supabase parameterisation was used to separate SQL commands from
                    user input and reduce SQL injection risk.
                  </p>
                </div>

                <div className="border-2 border-black p-4 bg-[#e0f2fe]">
                  <h4 className="font-mono text-xs font-black tracking-widest">
                    OUTPUT
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                    Jinja2 automatic escaping helped prevent injected HTML from being
                    interpreted as executable markup.
                  </p>
                </div>

                <div className="border-2 border-black p-4 bg-[#fff3b0]">
                  <h4 className="font-mono text-xs font-black tracking-widest">
                    INPUT
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                    User queries were sanitised using regex-based filtering before
                    processing.
                  </p>
                </div>

                <div className="border-2 border-black p-4 bg-[#39ff14]">
                  <h4 className="font-mono text-xs font-black tracking-widest">
                    LIMITS
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                    Search input was limited to 100 characters to constrain malformed
                    or excessive queries.
                  </p>
                </div>

              </div>

              <blockquote className="border-2 border-black bg-black text-white p-5 sm:p-6 font-bold text-lg leading-relaxed shadow-[5px_5px_0px_#7000ff]">
                In an allergen-aware system, technical trust and user trust are closely
                connected.
              </blockquote>

            </section>

            {/* 09 — REFLECTION */}
            <section className="space-y-6 border-t-2 border-black pt-8 pb-8">
              <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
                09 // Reflection
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                The project changed the way I think about building with data.
              </h3>

              <div className="space-y-4 text-sm sm:text-base text-zinc-700 leading-relaxed">
                <div>
                  <p className="font-mono text-[9px] font-bold text-[#7000ff] mb-1">
                    01
                  </p>
                  <h4 className="font-bold text-black">
                    Data quality shapes everything.
                  </h4>
                  <p>
                    The quality and provenance of input data affected every stage
                    of the system.
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[9px] font-bold text-[#7000ff] mb-1">
                    02
                  </p>
                  <h4 className="font-bold text-black">
                    One technique isn't always enough.
                  </h4>
                  <p>
                    Deterministic rules and semantic NLP approaches each had
                    strengths and limitations.
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[9px] font-bold text-[#7000ff] mb-1">
                    03
                  </p>
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
                  <p className="font-mono text-[9px] font-bold text-[#7000ff] mb-1">
                    04
                  </p>
                  <h4 className="font-bold text-black">
                    Research changes the build.
                  </h4>
                  <p>
                    One of the biggest lessons was learning to change direction
                    when evidence challenged the original plan.
                  </p>
                </div>
              </div>
              
              <p className="font-mono text-[9px] font-bold text-[#39ff14] uppercase tracking-widest mb-3">
                // FINAL REFLECTION
              </p>
              <blockquote className="border-2 border-black p-5 bg-[#7000ff] text-white font-bold text-lg leading-relaxed">
                The best outcome wasn't following my original idea perfectly.
                It was learning when — and why — to rethink it.
              </blockquote>
            </section>

          </div>
        </div>
      </div>


      {/* =========================================================== */}
      {/* 🔬 ARTEFACT B: SLIDE-OUT PANEL (CIFAR-10 MINI LAB NOTEBOOK) */}
      {/* =========================================================== */}
      <div
        className={`fixed inset-0 z-50 flex justify-start transition-all duration-700 ease-in-out ${
          expandedProject === 'cifar'
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* BACKDROP */}
        <div
          onClick={() => setExpandedProject(null)}
          className="absolute inset-0 bg-gradient-to-tr from-cyan-500/40 via-black/20 to-fuchsia-500/40 backdrop-blur-md"
        />

        {/* PANEL */}
        <div
          className={`absolute left-0 top-0 z-[100] h-full w-full max-w-3xl border-r-4 border-black bg-[#fdfcf0] flex flex-col transition-transform duration-700 ease-in-out transform shadow-[10px_0px_0px_#000] ${
            expandedProject === 'cifar'
              ? 'translate-x-0'
              : '-translate-x-full'
          }`}
        >
          {/* HEADER */}
          <div className="p-6 border-b-4 border-black flex justify-between items-center bg-white">
            <span className="font-mono text-xs font-bold bg-black text-[#39ff14] px-2 py-0.5">
              // MINI LAB NOTEBOOK
            </span>

            <button
              onClick={() => setExpandedProject(null)}
              className="border-2 border-black bg-white hover:bg-black hover:text-white px-2 py-1 font-mono text-xs font-bold transition-all cursor-pointer"
            >
              CLOSE_X
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-14 font-sans">

            {/* PROJECT INTRO */}
            <div className="space-y-5">

              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#ff00ff] font-bold mb-3">
                  MACHINE LEARNING // EXPERIMENT LOG
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-4xl sm:text-5xl text-[#ff00ff] font-black uppercase tracking-tight">
                    CIFAR-10
                  </h2>

                  <span className="font-mono text-[9px] font-black bg-black text-[#39ff14] px-2 py-1">
                    MINI LAB NOTEBOOK
                  </span>
                </div>

                <p className="mt-4 text-base sm:text-lg font-bold leading-relaxed max-w-xl">
                  Testing how different architectural and training choices affect
                  image classification performance.
                </p>
              </div>

              {/* QUESTION */}
              <div className="border-2 border-black bg-[#fff3b0] p-5 shadow-[5px_5px_0px_#000]">
                <p className="font-mono text-[10px] font-black text-[#ff00ff] uppercase tracking-widest">
                  // QUESTION
                </p>

                <p className="mt-3 text-xl sm:text-2xl font-black leading-tight">
                  Can iterative model changes improve a baseline CNN?
                </p>
              </div>

              {/* 01 — THE STARTING POINT */}
              <section className="space-y-6 border-t-2 border-black pt-8">
                <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest">
                  01 // The Starting Point
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Start simple. Then see what happens.
                </h3>

                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  The project began with a baseline convolutional neural network (CNN) for
                  CIFAR-10 image classification. From there, the experiment was to change
                  one part of the approach at a time and observe how performance responded.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="border-2 border-black bg-white p-4">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase">
                      DATASET
                    </p>
                    <p className="font-black text-lg mt-1">
                      CIFAR-10
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-4">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase">
                      TASK
                    </p>
                    <p className="font-black text-lg mt-1">
                      10-CLASS
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-4">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase">
                      BASELINE
                    </p>
                    <p className="font-black text-lg mt-1">
                      71%
                    </p>
                  </div>

                  <div className="border-2 border-black bg-[#fff3b0] p-4">
                    <p className="font-mono text-[9px] text-[#ff00ff] uppercase">
                      APPROACH
                    </p>
                    <p className="font-black text-lg mt-1">
                      ITERATIVE
                    </p>
                  </div>
                </div>

                <blockquote className="border-l-4 border-black pl-4 py-2 font-bold text-lg leading-relaxed">
                  The aim wasn't to find a perfect model immediately. It was to understand
                  what changed when the model changed.
                </blockquote>
              </section>

              {/* 02 — EXPERIMENT LOG */}
              <section className="space-y-6 border-t-2 border-black pt-8">
                <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest">
                  02 // Experiment Log
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Test. Change. Measure. Repeat.
                </h3>

                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  Each experiment changed a different part of the model so its effect could
                  be compared against the baseline. Some changes helped, while others made
                  performance worse.
                </p>

                {/* EXPERIMENT TRAIL */}
                <div className="relative space-y-3">

                  {/* BASELINE */}
                  <div className="border-2 border-black bg-white p-4 shadow-[3px_3px_0px_#000]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[9px] font-bold text-[#ff00ff] uppercase tracking-widest">
                          EXPERIMENT 00
                        </p>

                        <h4 className="font-black text-lg sm:text-xl mt-1">
                          BASELINE CNN
                        </h4>

                        <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                          Three convolutional layers, two pooling layers, Adam optimiser
                          and 10 training epochs.
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-black text-2xl sm:text-3xl">
                          71%
                        </p>

                        <p className="font-mono text-[9px] uppercase text-zinc-500">
                          accuracy
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* MODEL 1 */}
                  <div className="border-2 border-black bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[9px] font-bold text-[#ff00ff] uppercase tracking-widest">
                          EXPERIMENT 01
                        </p>

                        <h4 className="font-black text-lg sm:text-xl mt-1">
                          VGG-INSPIRED / 2 BLOCKS
                        </h4>

                        <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                          Increased network depth and added He kernel initialisation.
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-black text-2xl sm:text-3xl">
                          72%
                        </p>

                        <p className="font-mono text-[9px] uppercase text-zinc-500">
                          accuracy
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-dashed border-zinc-300 pt-3">
                      <p className="font-mono text-[9px] uppercase text-zinc-500">
                        +1% vs baseline
                      </p>
                    </div>
                  </div>

                  {/* MODEL 2 */}
                  <div className="border-2 border-black bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[9px] font-bold text-[#ff00ff] uppercase tracking-widest">
                          EXPERIMENT 02
                        </p>

                        <h4 className="font-black text-lg sm:text-xl mt-1">
                          VGG-INSPIRED / 3 BLOCKS
                        </h4>

                        <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                          Increased the architecture to three convolutional and pooling blocks.
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-black text-2xl sm:text-3xl">
                          73%
                        </p>

                        <p className="font-mono text-[9px] uppercase text-zinc-500">
                          accuracy
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-dashed border-zinc-300 pt-3">
                      <p className="font-mono text-[9px] uppercase text-zinc-500">
                        +2% vs baseline
                      </p>
                    </div>
                  </div>

                  {/* MODEL 3 */}
                  <div className="border-2 border-black bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[9px] font-bold text-[#ff00ff] uppercase tracking-widest">
                          EXPERIMENT 03
                        </p>

                        <h4 className="font-black text-lg sm:text-xl mt-1">
                          + 20% DROPOUT
                        </h4>

                        <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                          Added dropout after each pooling layer to improve regularisation.
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-black text-2xl sm:text-3xl">
                          75%
                        </p>

                        <p className="font-mono text-[9px] uppercase text-zinc-500">
                          accuracy
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-dashed border-zinc-300 pt-3">
                      <p className="font-mono text-[9px] uppercase text-[#ff00ff] ">
                        +4% vs baseline · lowest loss: 0.71
                      </p>
                    </div>
                  </div>

                  {/* MODEL 4 */}
                  <div className="border-2 border-black bg-[#fff3b0] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[9px] font-bold text-[#ff00ff] uppercase tracking-widest">
                          EXPERIMENT 04
                        </p>

                        <h4 className="font-black text-lg sm:text-xl mt-1">
                          + L2 REGULARISATION
                        </h4>

                        <p className="text-xs text-zinc-700 mt-2 leading-relaxed">
                          Applied an L2 kernel regulariser to the convolutional layers.
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-black text-2xl sm:text-3xl">
                          62%
                        </p>

                        <p className="font-mono text-[9px] uppercase text-zinc-500">
                          accuracy
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-dashed border-black/20 pt-3">
                      <p className="font-mono text-[9px] uppercase font-bold">
                        performance dropped
                      </p>
                    </div>
                  </div>

                  {/* MODEL 5 */}
                  <div className="border-2 border-black bg-[#ffb7ef] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[9px] font-bold text-[#ff00ff] uppercase tracking-widest">
                          EXPERIMENT 05
                        </p>

                        <h4 className="font-black text-lg sm:text-xl mt-1">
                          + DATA AUGMENTATION
                        </h4>

                        <p className="text-xs text-zinc-700 mt-2 leading-relaxed">
                          Tested minimal image augmentation using flips and random cropping.
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-black text-2xl sm:text-3xl">
                          55%
                        </p>

                        <p className="font-mono text-[9px] uppercase text-zinc-500">
                          accuracy
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-dashed border-black/20 pt-3">
                      <p className="font-mono text-[9px] uppercase font-bold">
                        unexpected result · initial run plateaued at 10%
                      </p>
                    </div>
                  </div>

                  {/* MODEL 6 */}
                  <div className="border-4 border-black bg-[#39ff14] p-5 shadow-[5px_5px_0px_#000]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[9px] font-black uppercase tracking-widest">
                          EXPERIMENT 06
                        </p>

                        <h4 className="font-black text-xl sm:text-2xl uppercase mt-1">
                          MOBILENETV2
                        </h4>

                        <p className="text-xs sm:text-sm mt-2 leading-relaxed">
                          Pre-trained transfer-learning model using features learned from
                          ImageNet, trained for 20 epochs.
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-black text-3xl sm:text-4xl">
                          76%
                        </p>

                        <p className="font-mono text-[9px] font-black uppercase">
                          accuracy
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 border-t-2 border-black/30 pt-3">
                      <p className="font-mono text-[9px] font-black uppercase tracking-widest">
                        ★ BEST RECORDED RESULT · LOSS 0.74
                      </p>
                    </div>
                  </div>

                </div>

                {/* LAB NOTE */}
                <div className="border-l-4 border-[#ff00ff] pl-4">
                  <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    LAB NOTE
                  </p>

                  <p className="mt-2 text-sm sm:text-base font-bold leading-relaxed">
                    Increasing complexity did not guarantee better performance. Dropout
                    produced a strong result, while L2 regularisation and augmentation
                    performed less well. MobileNetV2 ultimately produced the highest
                    accuracy in the experiment set.
                  </p>
                </div>
              </section>

              {/* 03 — WHAT CHANGED? */}
              <section className="space-y-6 border-t-2 border-black pt-8">
                <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest">
                  03 // What Changed?
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Each experiment asked a different question.
                </h3>

                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  The experiments were not simply attempts to increase accuracy. Each one
                  tested a different idea about architecture, regularisation, optimisation
                  or transfer learning.
                </p>

                {/* COMPARISON CARDS */}
                <div className="space-y-3">

                  {/* MODEL 1 */}
                  <div className="border-2 border-black bg-white p-4">
                    <div className="flex gap-4 items-start">
                      <span className="font-mono text-xs font-black text-[#ff00ff] min-w-7">
                        01
                      </span>

                      <div>
                        <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                          ARCHITECTURE + INITIALISATION
                        </p>

                        <h4 className="font-black text-lg mt-1">
                          VGG-inspired / 2 blocks + He initialisation
                        </h4>

                        <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed mt-2">
                          Increased network depth and introduced He kernel initialisation.
                          Accuracy increased from 71% to 72%.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* MODEL 2 */}
                  <div className="border-2 border-black bg-white p-4">
                    <div className="flex gap-4 items-start">
                      <span className="font-mono text-xs font-black text-[#ff00ff] min-w-7">
                        02
                      </span>

                      <div>
                        <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                          ARCHITECTURE DEPTH
                        </p>

                        <h4 className="font-black text-lg mt-1">
                          VGG-inspired / 3 blocks
                        </h4>

                        <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed mt-2">
                          Increased the network depth again, reaching three convolutional and
                          pooling blocks. Accuracy increased to 73%.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* MODEL 3 */}
                  <div className="border-2 border-black bg-[#e0f2fe] p-4">
                    <div className="flex gap-4 items-start">
                      <span className="font-mono text-xs font-black text-[#ff00ff] min-w-7">
                        03
                      </span>

                      <div>
                        <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                          REGULARISATION
                        </p>

                        <h4 className="font-black text-lg mt-1">
                          + 20% Dropout
                        </h4>

                        <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed mt-2">
                          Added dropout after each pooling layer to improve regularisation.
                          Accuracy reached 75% with the lowest recorded loss of 0.71.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* MODEL 4 */}
                  <div className="border-2 border-black bg-[#fff3b0] p-4">
                    <div className="flex gap-4 items-start">
                      <span className="font-mono text-xs font-black text-[#ff00ff] min-w-7">
                        04
                      </span>

                      <div>
                        <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                          REGULARISATION
                        </p>

                        <h4 className="font-black text-lg mt-1">
                          + L2 Kernel Regulariser
                        </h4>

                        <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed mt-2">
                          Applied L2 regularisation to the convolutional layers. Accuracy
                          dropped to 62% after 10 epochs, reaching 65% when trained for 30.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* MODEL 5 */}
                  <div className="border-2 border-black bg-[#ffb7ef] p-4">
                    <div className="flex gap-4 items-start">
                      <span className="font-mono text-xs font-black text-[#ff00ff] min-w-7">
                        05
                      </span>

                      <div>
                        <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                          DATA AUGMENTATION
                        </p>

                        <h4 className="font-black text-lg mt-1">
                          + Flips + Random Cropping
                        </h4>

                        <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed mt-2">
                          Tested minimal augmentation on the training data. The first run
                          plateaued at 10%, and simplifying the architecture eventually
                          improved the result to 55%.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* MODEL 6 */}
                  <div className="border-4 border-black bg-[#39ff14] p-5 shadow-[5px_5px_0px_#000]">
                    <div className="flex gap-4 items-start">
                      <span className="font-mono text-xs font-black min-w-7">
                        06
                      </span>

                      <div>
                        <p className="font-mono text-[9px] font-black uppercase tracking-widest">
                          TRANSFER LEARNING
                        </p>

                        <h4 className="font-black text-xl mt-1">
                          MobileNetV2
                        </h4>

                        <p className="text-xs sm:text-sm leading-relaxed mt-2">
                          Tested a lightweight pre-trained architecture using features learned
                          from ImageNet. This produced the highest accuracy at 76%.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* SIDE EXPERIMENT */}
                <div className="border-2 border-black bg-black text-white p-5">
                  <p className="font-mono text-[9px] font-bold text-[#39ff14] uppercase tracking-widest">
                    // SIDE EXPERIMENT — OPTIMISER CHOICE
                  </p>

                  <h4 className="font-black text-lg sm:text-xl mt-2">
                    Adam was retained as the baseline optimiser.
                  </h4>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-200">
                    Four optimisers were compared. SGD reached 65% accuracy, Adam 69%,
                    Adamax 69% and LAMB 71%. Changes to the default learning rate of 0.001
                    reduced validation accuracy, so the original rate was retained.
                  </p>
                </div>

                {/* SIDE OBSERVATION — EPOCH TUNING */}
                <div className="border-2 border-black bg-white p-3 shadow-[5px_5px_0px_#000]">

                  <div className="border-2 border-black overflow-hidden bg-black">
                    <Image
                      src="/cifar10/cifar10-epoch-tuning.png"
                      alt="CIFAR-10 training and validation accuracy across 40 epochs showing overfitting"
                      width={950}
                      height={710}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="mt-3 border-t-2 border-black pt-3">
                    <p className="font-mono text-xs font-black uppercase tracking-widest text-[#ff00ff]">
                      SIDE OBSERVATION // EPOCH TUNING
                    </p>

                    <p className="mt-2 text-sm sm:text-base font-bold leading-relaxed">
                      Training beyond 10 epochs did not improve validation accuracy.
                      The widening gap between training and validation performance indicated
                      overfitting, while loss increased to 2.45.
                    </p>
                  </div>

                </div>
              </section>

              {/* 04 — THE RESULT */}
              <section className="space-y-6 border-t-2 border-black pt-8">
                <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest">
                  04 // The Result
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  The best result came from changing the starting point.
                </h3>

                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  After testing deeper architectures, regularisation and data augmentation,
                  the strongest accuracy came from moving to a pre-trained MobileNetV2 model.
                </p>

                {/* HERO RESULT */}
                <div className="border-4 border-black bg-[#39ff14] p-5 sm:p-6 shadow-[6px_6px_0px_#000]">
                  <p className="font-mono text-[10px] font-black uppercase tracking-widest">
                    ★ BEST RECORDED RESULT
                  </p>

                  <div className="flex items-end justify-between gap-4 mt-3">
                    <div>
                      <p className="text-5xl sm:text-7xl font-black leading-none">
                        76%
                      </p>

                      <p className="font-mono text-[10px] sm:text-xs font-black uppercase tracking-widest mt-2">
                        MobileNetV2 accuracy
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl sm:text-4xl font-black leading-none">
                        0.74
                      </p>

                      <p className="font-mono text-[9px] uppercase tracking-widest mt-2">
                        loss
                      </p>
                    </div>
                  </div>
                </div>

                {/* RESULT COMPARISON */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <div className="border-2 border-black bg-white p-5">
                    <p className="font-mono text-[9px] font-bold text-[#ff00ff] uppercase tracking-widest">
                      HIGHEST ACCURACY
                    </p>

                    <p className="text-3xl font-black mt-2">
                      76%
                    </p>

                    <p className="text-sm font-bold mt-1">
                      MobileNetV2
                    </p>

                    <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                      The pre-trained model produced the strongest accuracy across the
                      experiment set.
                    </p>
                  </div>

                  <div className="border-2 border-black bg-[#e0f2fe] p-5">
                    <p className="font-mono text-[9px] font-bold text-[#ff00ff] uppercase tracking-widest">
                      LOWEST LOSS
                    </p>

                    <p className="text-3xl font-black mt-2">
                      0.71
                    </p>

                    <p className="text-sm font-bold mt-1">
                      Model 3 · 75% accuracy
                    </p>

                    <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                      The three-block network with 20% dropout produced the lowest recorded
                      loss in the experiment set.
                    </p>
                  </div>

                </div>

                {/* RESULT GRAPHIC */}
                <div className="border-2 border-black bg-white p-3 shadow-[5px_5px_0px_#000]">
                  <div className="relative w-full aspect-[16/9] overflow-hidden border-2 border-black bg-[#fdfcf0]">
                    <Image
                      src="/cifar10/cifar10-results-graphic.png"
                      alt="CIFAR-10 experiment results showing the progression of model accuracy"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                  </div>

                  <div className="mt-3 border-t-2 border-black pt-3 flex items-center justify-between gap-3">
                    <p className="font-mono text-xs font-black uppercase tracking-widest text-[#ff00ff]">
                      EXPERIMENT RESULTS
                    </p>

                    <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 text-right">
                      Model progression
                    </p>
                  </div>
                </div>

                {/* INTERPRETATION */}
                <div className="border-2 border-black bg-black text-white p-5 sm:p-6">
                  <p className="font-mono text-[10px] font-bold text-[#39ff14] uppercase tracking-widest">
                    // WHAT THE RESULT SHOWED
                  </p>

                  <p className="mt-3 text-base sm:text-lg font-bold leading-relaxed">
                    The experiments showed that more complexity did not automatically lead
                    to better performance. Dropout produced a strong result, while L2
                    regularisation and augmentation performed less well. Transfer learning
                    ultimately produced the highest accuracy.
                  </p>
                </div>
              </section>

              {/* DATA SOURCE */}
              <section className="space-y-4 border-t-2 border-black pt-8">
                <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest">
                  05 // Data Source
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Original dataset & provenance.
                </h3>

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                    ORIGINAL DATASET
                  </p>

                  <p className="mt-2 text-lg font-black">
                    CIFAR-10
                  </p>

                  <p className="mt-2 text-sm font-medium leading-relaxed">
                    A benchmark image-classification dataset created by Alex Krizhevsky,
                    containing 60,000 32×32 colour images across 10 classes.
                  </p>

                  <p className="mt-4 font-mono text-xs text-zinc-600">
                    Krizhevsky, A. (2009) · University of Toronto
                  </p>

                  <a
                    href="https://www.cs.toronto.edu/~kriz/cifar.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 border-2 border-black bg-[#ff00ff] text-white px-4 py-2 font-mono text-xs font-black uppercase hover:bg-black transition-colors"
                  >
                    VIEW DATASET ↗
                  </a>
                </div>
              </section>

              {/* 05 — LAB NOTES */}
              <section className="space-y-6 border-t-2 border-black pt-8 pb-8">
                <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest">
                  06 // Lab Notes
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  What the experiments actually taught me.
                </h3>

                <div className="space-y-4">

                  {/* NOTE 01 */}
                  <div className="border-2 border-black bg-white p-5">
                    <p className="font-mono text-[9px] font-black text-[#ff00ff] uppercase tracking-widest">
                      NOTE 01
                    </p>

                    <h4 className="font-black text-lg sm:text-xl mt-2">
                      More complexity did not guarantee improvement.
                    </h4>

                    <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                      Increasing network depth produced incremental gains, but the results
                      showed that adding more complexity alone was not enough to consistently
                      improve performance.
                    </p>
                  </div>

                  {/* NOTE 02 */}
                  <div className="border-2 border-black bg-[#e0f2fe] p-5">
                    <p className="font-mono text-[9px] font-black text-[#ff00ff] uppercase tracking-widest">
                      NOTE 02
                    </p>

                    <h4 className="font-black text-lg sm:text-xl mt-2">
                      Regularisation behaved differently depending on the approach.
                    </h4>

                    <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                      The 20% dropout experiment reached 75% accuracy and the lowest loss,
                      while L2 regularisation reduced performance in this experiment.
                    </p>
                  </div>

                  {/* NOTE 03 */}
                  <div className="border-2 border-black bg-[#ffb7ef] p-5">
                    <p className="font-mono text-[9px] font-black text-[#ff00ff] uppercase tracking-widest">
                      NOTE 03
                    </p>

                    <h4 className="font-black text-lg sm:text-xl mt-2">
                      An expected technique can still produce an unexpected result.
                    </h4>

                    <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                      Data augmentation initially caused the model to plateau at around 10%
                      accuracy. Simplifying the architecture improved the result, but it
                      still finished well below the other experiments.
                    </p>
                  </div>

                  {/* NOTE 04 */}
                  <div className="border-2 border-black bg-[#fff3b0] p-5">
                    <p className="font-mono text-[9px] font-black text-[#ff00ff] uppercase tracking-widest">
                      NOTE 04
                    </p>

                    <h4 className="font-black text-lg sm:text-xl mt-2">
                      Computational limits shaped the experiment.
                    </h4>

                    <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                      With CPU-only resources, the project had to balance experimentation,
                      training time and model complexity rather than testing every possible
                      architecture.
                    </p>
                  </div>

                </div>

                {/* FUTURE WORK */}
                <div className="border-2 border-black bg-black text-white p-5 sm:p-6">
                  <p className="font-mono text-[10px] font-bold text-[#39ff14] uppercase tracking-widest">
                    // NEXT EXPERIMENTS
                  </p>

                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-200">
                    A natural next step would be to explore longer MobileNetV2 training,
                    learning-rate scheduling, more refined augmentation and alternative
                    pre-trained architectures such as EfficientNet.
                  </p>
                </div>

                {/* FINAL REFLECTION */}
                <div className="border-4 border-black bg-[#ff00ff] text-white p-5 sm:p-6 shadow-[6px_6px_0px_#000]">
                  <p className="font-mono text-[9px] font-black text-[#39ff14] uppercase tracking-widest">
                    // FINAL LAB NOTE
                  </p>

                  <p className="mt-3 text-xl sm:text-2xl font-black leading-tight">
                    The interesting part wasn't finding the winning model.
                    It was finding out why the others behaved differently.
                  </p>
                </div>

              </section>

            </div>

          </div>
        </div>
        </div>
      
            {/* =========================================================== */}
            {/* 🧬 ARTEFACT C: SLIDE-OUT PANEL (BREAST CANCER MODEL LAB) */}
            {/* =========================================================== */}

            <div
              className={`fixed inset-0 z-50 flex justify-end transition-all duration-700 ease-in-out ${
                expandedProject === 'breast'
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* BACKDROP */}
              <div
                onClick={() => setExpandedProject(null)}
                className="absolute inset-0 bg-gradient-to-tr from-[#7000ff]/40 via-black/20 to-[#7000ff]/40 backdrop-blur-md"
              />

              {/* PANEL */}
              <div
                className={`absolute right-0 top-0 z-[100] h-full w-full max-w-3xl border-l-4 border-black bg-[#fdfcf0] flex flex-col transition-transform duration-700 ease-in-out transform shadow-[10px_0px_0px_#000] ${
                  expandedProject === 'breast'
                    ? 'translate-x-0'
                    : 'translate-x-full'
                }`}
              >

          {/* HEADER */}
          <div className="p-6 border-b-4 border-black flex justify-between items-center bg-white">
            <span className="font-mono text-xs font-bold bg-black text-[#39ff14] px-2 py-0.5">
              // MODEL COMPARISON
            </span>

            <button
              onClick={() => setExpandedProject(null)}
              className="border-2 border-black bg-white hover:bg-black hover:text-white px-2 py-1 font-mono text-xs font-bold transition-all cursor-pointer"
            >
              CLOSE_X
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-14 font-sans">

            {/* PROJECT INTRO */}
            <div className="space-y-5">

              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#7000ff] font-bold mb-3">
                  MACHINE LEARNING // MODEL COMPARISON
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-4xl sm:text-5xl text-[#7000ff] font-black uppercase tracking-tight">
                    BREAST CANCER
                  </h2>

                  <span className="font-mono text-[9px] font-black bg-black text-[#39ff14] px-2 py-1">
                    MODEL LAB
                  </span>
                </div>

                <p className="mt-4 text-base sm:text-lg font-bold leading-relaxed max-w-xl">
                  Comparing four classification approaches to see which model best fitted
                  the dataset.
                </p>
              </div>

            </div>

            {/* 01 — THE DATA */}
            <section className="space-y-6 border-t-2 border-black pt-8">

              <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
                01 // The Data
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                Start with the dataset. Understand what needs cleaning.
              </h3>

              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                The dataset contained 699 observations with 9 predictor features and a
                binary classification target. Before modelling, the missing values had to
                be handled so the models could be compared consistently.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

                <div className="border-2 border-black bg-white p-4">
                  <p className="font-mono text-[9px] text-zinc-500 uppercase">
                    OBSERVATIONS
                  </p>
                  <p className="font-black text-2xl mt-1">
                    699
                  </p>
                </div>

                <div className="border-2 border-black bg-white p-4">
                  <p className="font-mono text-[9px] text-zinc-500 uppercase">
                    FEATURES
                  </p>
                  <p className="font-black text-2xl mt-1">
                    9
                  </p>
                </div>

                <div className="border-2 border-black bg-white p-4">
                  <p className="font-mono text-[9px] text-zinc-500 uppercase">
                    CLASSES
                  </p>
                  <p className="font-black text-2xl mt-1">
                    2
                  </p>
                </div>

                <div className="border-2 border-black bg-[#e9ddff] p-4">
                  <p className="font-mono text-[9px] text-[#7000ff] uppercase">
                    MISSING VALUES
                  </p>
                  <p className="font-black text-2xl mt-1">
                    16
                  </p>
                </div>

                <div className="border-2 border-black bg-[#e9ddff] p-4">
                  <p className="font-mono text-[9px] text-[#7000ff] uppercase">
                    DATASET IMPACT
                  </p>
                  <p className="font-black text-2xl mt-1">
                    2.29%
                  </p>
                </div>

                <div className="border-2 border-black bg-[#fff3b0] p-4">
                  <p className="font-mono text-[9px] uppercase text-zinc-600">
                    MISSING FIELD
                  </p>
                  <p className="font-black text-lg mt-1">
                    Bare nuclei
                  </p>
                </div>

              </div>

              <div className="border-l-4 border-[#7000ff] pl-4">
                <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  DATA CLEANING
                </p>

                <p className="mt-2 text-sm sm:text-base font-bold leading-relaxed">
                  The 16 incomplete records were removed using complete-case analysis.
                </p>
              </div>

            </section>

            {/* 02 — THE APPROACH */}
            <section className="space-y-6 border-t-2 border-black pt-8">

              <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
                02 // The Approach
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                Four models. One dataset. A direct comparison.
              </h3>

              {/* PIPELINE */}
              <div className="border-2 border-black bg-black text-white p-4 overflow-x-auto">
                <div className="flex items-center justify-center gap-2 min-w-max">
                  <span className="font-mono text-xs font-black">DATA</span>
                  <span className="text-[#7000ff] font-black">→</span>
                  <span className="font-mono text-xs font-black">CLEAN</span>
                  <span className="text-[#7000ff] font-black">→</span>
                  <span className="font-mono text-xs font-black">SPLIT</span>
                  <span className="text-[#7000ff] font-black">→</span>
                  <span className="font-mono text-xs font-black">TRAIN</span>
                  <span className="text-[#7000ff] font-black">→</span>
                  <span className="font-mono text-xs font-black">COMPARE</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div className="border-2 border-black bg-[#e9ddff] p-5">
                  <p className="font-mono text-[9px] font-bold text-[#7000ff] uppercase tracking-widest">
                    MODEL 01
                  </p>

                  <h4 className="font-black text-xl mt-2">
                    KNN
                  </h4>

                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    A distance-based classifier used as a direct benchmark against the
                    other approaches.
                  </p>
                </div>

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-bold text-[#7000ff] uppercase tracking-widest">
                    MODEL 02
                  </p>

                  <h4 className="font-black text-xl mt-2">
                    DECISION TREE
                  </h4>

                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    A rule-based model that makes predictions by splitting the feature
                    space into decision paths.
                  </p>
                </div>

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-bold text-[#7000ff] uppercase tracking-widest">
                    MODEL 03
                  </p>

                  <h4 className="font-black text-xl mt-2">
                    NAIVE BAYES
                  </h4>

                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    A probabilistic classifier providing a different modelling assumption
                    from the distance- and tree-based approaches.
                  </p>
                </div>

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-bold text-[#7000ff] uppercase tracking-widest">
                    MODEL 04
                  </p>

                  <h4 className="font-black text-xl mt-2">
                    NEURAL NETWORK
                  </h4>

                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    A feed-forward neural model used to test a more flexible non-linear
                    approach.
                  </p>
                </div>

              </div>

            </section>

            {/* 03 — DATA PREPARATION */}
            <section className="space-y-6 border-t-2 border-black pt-8">

              <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
                03 // Data Preparation
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                Clean the data before comparing the models.
              </h3>

              <div className="space-y-3">

                <div className="border-2 border-black bg-white p-4">
                  <div className="flex gap-4 items-start">
                    <span className="font-mono text-xs font-black text-[#7000ff] min-w-7">
                      01
                    </span>
                    <div>
                      <h4 className="font-black text-lg">
                        16 missing values
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed mt-2">
                        Missing entries were identified in the Bare nuclei field.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-black bg-white p-4">
                  <div className="flex gap-4 items-start">
                    <span className="font-mono text-xs font-black text-[#7000ff] min-w-7">
                      02
                    </span>
                    <div>
                      <h4 className="font-black text-lg">
                        Complete-case analysis
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed mt-2">
                        Incomplete observations were removed before model training.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-black bg-white p-4">
                  <div className="flex gap-4 items-start">
                    <span className="font-mono text-xs font-black text-[#7000ff] min-w-7">
                      03
                    </span>
                    <div>
                      <h4 className="font-black text-lg">
                        Confusion matrix evaluation
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed mt-2">
                        Performance was assessed using accuracy, sensitivity and
                        specificity rather than accuracy alone.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </section>

            {/* 04 — MODEL COMPARISON */}
            <section className="space-y-6 border-t-2 border-black pt-8">

              <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
                04 // Model Comparison
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                The simplest model produced the strongest result.
              </h3>

              <div className="space-y-3">

                {/* KNN */}
                <div className="border-4 border-black bg-[#7000ff] text-white p-5 shadow-[5px_5px_0px_#000]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[9px] font-black uppercase tracking-widest text-[#39ff14]">
                        ★ BEST RESULT
                      </p>

                      <h4 className="font-black text-2xl sm:text-3xl mt-1">
                        KNN
                      </h4>

                      <p className="text-xs sm:text-sm mt-2 leading-relaxed">
                        The strongest overall classification result in the comparison.
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-black text-4xl sm:text-5xl">
                        98.25%
                      </p>

                      <p className="font-mono text-[9px] font-black uppercase tracking-widest mt-1">
                        accuracy
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">

                    <div className="border-2 border-white/40 p-3">
                      <p className="font-mono text-[9px] uppercase">
                        sensitivity
                      </p>
                      <p className="font-black text-xl mt-1">
                        1.00
                      </p>
                    </div>

                    <div className="border-2 border-white/40 p-3">
                      <p className="font-mono text-[9px] uppercase">
                        specificity
                      </p>
                      <p className="font-black text-xl mt-1">
                        0.95
                      </p>
                    </div>

                  </div>
                </div>

                {/* OTHER MODELS */}
                <div className="border-2 border-black bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                        DECISION TREE
                      </p>
                      <p className="font-black text-2xl mt-1">
                        91.20%
                      </p>
                      <p className="font-mono text-[9px] uppercase text-zinc-500">
                        accuracy
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="border-2 border-black p-3">
                      <p className="font-mono text-[9px] uppercase text-zinc-500">
                        sensitivity
                      </p>
                      <p className="font-black text-xl mt-1">
                        0.91
                      </p>
                    </div>

                    <div className="border-2 border-black p-3">
                      <p className="font-mono text-[9px] uppercase text-zinc-500">
                        specificity
                      </p>
                      <p className="font-black text-xl mt-1">
                        0.90
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-black bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                        NAIVE BAYES
                      </p>
                      <p className="font-black text-2xl mt-1">
                        97.07%
                      </p>
                      <p className="font-mono text-[9px] uppercase text-zinc-500">
                        accuracy
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="border-2 border-black p-3">
                      <p className="font-mono text-[9px] uppercase text-zinc-500">
                        sensitivity
                      </p>
                      <p className="font-black text-xl mt-1">
                        0.91
                      </p>
                    </div>

                    <div className="border-2 border-black p-3">
                      <p className="font-mono text-[9px] uppercase text-zinc-500">
                        specificity
                      </p>
                      <p className="font-black text-xl mt-1">
                        1.00
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-black bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                        NEURAL NETWORK
                      </p>
                      <p className="font-black text-2xl mt-1">
                        96.09%
                      </p>
                      <p className="font-mono text-[9px] uppercase text-zinc-500">
                        accuracy
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="border-2 border-black p-3">
                      <p className="font-mono text-[9px] uppercase text-zinc-500">
                        sensitivity
                      </p>
                      <p className="font-black text-xl mt-1">
                        0.90
                      </p>
                    </div>

                    <div className="border-2 border-black p-3">
                      <p className="font-mono text-[9px] uppercase text-zinc-500">
                        specificity
                      </p>
                      <p className="font-black text-xl mt-1">
                        1.00
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="border-2 border-black bg-black text-white p-5">
                <p className="font-mono text-[10px] font-bold text-[#39ff14] uppercase tracking-widest">
                  // WHAT THE COMPARISON SHOWED
                </p>

                <p className="text-sm sm:text-base leading-relaxed mt-5 max-w-2xl">
                  KNN achieved 98.25% accuracy, with 1.00 sensitivity and 0.95 specificity.
                  In the evaluated data, this meant the model correctly identified all malignant
                  cases while correctly classifying 95% of benign cases.
                </p>
              </div>

            </section>

            {/* WHY THESE METRICS MATTER     */}

            <section className="space-y-6 border-t-2 border-black pt-8">

              <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
                // Why these metrics matter
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                Accuracy tells only part of the story.
              </h3>

              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify max-w-2xl">
                In a medical classification problem, overall accuracy is useful, but it does
                not show what kinds of predictions the model gets wrong. Sensitivity and
                specificity provide additional context by showing how well the model
                identifies malignant and benign cases respectively.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-bold text-[#7000ff] uppercase tracking-widest">
                    ACCURACY
                  </p>

                  <h4 className="text-xl font-black uppercase mt-2">
                    Overall correctness
                  </h4>

                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    The proportion of predictions the model classified correctly overall.
                  </p>
                </div>

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-bold text-[#7000ff] uppercase tracking-widest">
                    SENSITIVITY
                  </p>

                  <h4 className="text-xl font-black uppercase mt-2">
                    Detecting malignant cases
                  </h4>

                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    Shows how effectively the model identifies cases that are actually
                    malignant. Higher sensitivity means fewer malignant cases are missed.
                  </p>
                </div>

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-bold text-[#7000ff] uppercase tracking-widest">
                    SPECIFICITY
                  </p>

                  <h4 className="text-xl font-black uppercase mt-2">
                    Identifying benign cases
                  </h4>

                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    Shows how effectively the model identifies cases that are actually
                    benign. Higher specificity means fewer benign cases are incorrectly
                    classified as malignant.
                  </p>
                </div>

              </div>

              <div className="border-2 border-black bg-[#e9ddff] p-5">
                <p className="font-mono text-[9px] font-bold text-[#7000ff] uppercase tracking-widest">
                  KEY TAKEAWAY
                </p>

                <p className="text-base sm:text-lg font-black leading-relaxed mt-2">
                  A high accuracy score alone does not guarantee a useful classifier.
                  Looking at sensitivity and specificity helps reveal how the model behaves
                  across both classes.
                </p>
              </div>

            </section>

            {/* DATA SOURCE */}
            <section className="space-y-4 border-t-2 border-black pt-8">
              <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
                05 // Data Source
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                Original dataset & provenance.
              </h3>

              <div className="border-2 border-black bg-white p-5">
                <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                  ORIGINAL DATASET
                </p>

                <p className="mt-2 text-lg font-black">
                  Breast Cancer Wisconsin (Original)
                </p>

                <p className="mt-2 text-sm font-medium leading-relaxed">
                  A structured classification dataset containing measurements of
                  cell characteristics used to distinguish benign and malignant cases.
                </p>

                <p className="mt-4 font-mono text-xs text-zinc-600">
                  Wolberg, W. (1990) · UCI Machine Learning Repository
                </p>

                <a
                  href="https://archive.ics.uci.edu/dataset/15/breast+cancer+wisconsin+original"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 border-2 border-black bg-[#7000ff] text-white px-4 py-2 font-mono text-xs font-black uppercase hover:bg-black transition-colors"
                >
                  VIEW DATASET ↗
                </a>
              </div>
            </section>

            {/* 05 — WHAT I LEARNED */}
            <section className="space-y-6 border-t-2 border-black pt-8 pb-8">

              <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest">
                06 // What I Learned
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                The model comparison was also a lesson in evaluation.
              </h3>

              <div className="space-y-4">

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-black text-[#7000ff] uppercase tracking-widest">
                    NOTE 01
                  </p>

                  <h4 className="font-black text-lg sm:text-xl mt-2">
                    Data preparation matters.
                  </h4>

                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    Cleaning the missing values was an essential step before making
                    meaningful model comparisons.
                  </p>
                </div>

                <div className="border-2 border-black bg-[#e9ddff] p-5">
                  <p className="font-mono text-[9px] font-black text-[#7000ff] uppercase tracking-widest">
                    NOTE 02
                  </p>

                  <h4 className="font-black text-lg sm:text-xl mt-2">
                    Simple can work.
                  </h4>

                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    The strongest result came from KNN rather than the more complex
                    neural network approach.
                  </p>
                </div>

                <div className="border-2 border-black bg-[#fff3b0] p-5">
                  <p className="font-mono text-[9px] font-black text-[#7000ff] uppercase tracking-widest">
                    NOTE 03
                  </p>

                  <h4 className="font-black text-lg sm:text-xl mt-2">
                    One metric is not enough.
                  </h4>

                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    Accuracy gave a useful headline result, but sensitivity and
                    specificity were important for understanding how the models
                    performed across malignant and benign cases.
                  </p>
                </div>

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-black text-[#7000ff] uppercase tracking-widest">
                    NOTE 04
                  </p>

                  <h4 className="font-black text-lg sm:text-xl mt-2">
                    Validation could go further.
                  </h4>

                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    Resampling, cross-validation and additional modelling approaches
                    would provide greater confidence in the result.
                  </p>
                </div>

              </div>

              {/* FINAL REFLECTION */}
              <div className="border-4 border-black bg-[#7000ff] text-white p-5 sm:p-6 shadow-[6px_6px_0px_#000]">
                <p className="font-mono text-[9px] font-black text-[#39ff14] uppercase tracking-widest">
                  // FINAL REFLECTION
                </p>

                <p className="mt-3 text-xl sm:text-2xl font-black leading-tight">
                  The strongest result wasn't necessarily the most complicated model.
                  It was the model that fitted this dataset best.
                </p>
              </div>

            </section>

          </div>
        </div>
      </div>
    
      {/* =========================================================== */}
      {/* 🛠️ ARTEFACT D: SLIDE-OUT PANEL (WEARVIEW ACADEMY)           */}
      {/* =========================================================== */}
      <div
        className={`fixed inset-0 z-50 flex justify-start transition-all duration-700 ease-in-out ${
          expandedProject === 'wearview'
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* CYAN BACKDROP */}
        <div
          onClick={() => setExpandedProject(null)}
          className="absolute inset-0 bg-gradient-to-tr from-[#00f0ff]/40 via-black/20 to-[#00f0ff]/30 backdrop-blur-md"
        />

        {/* PANEL */}
        <div
          className={`absolute left-0 top-0 z-[100] h-full w-full max-w-3xl border-r-4 border-black bg-[#fdfcf0] flex flex-col transition-transform duration-700 ease-in-out transform shadow-[10px_0px_0px_#000] ${
            expandedProject === 'wearview'
              ? 'translate-x-0'
              : '-translate-x-full'
          }`}
        >

          {/* HEADER */}
          <div className="p-6 border-b-4 border-black flex justify-between items-center bg-white">
            <span className="font-mono text-xs font-bold bg-black text-[#39ff14] px-2 py-0.5">
              // SOFTWARE ENGINEERING
            </span>

            <button
              onClick={() => setExpandedProject(null)}
              className="border-2 border-black bg-white hover:bg-black hover:text-white px-2 py-1 font-mono text-xs font-bold transition-all cursor-pointer"
            >
              CLOSE_X
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-14 font-sans">

            {/* PROJECT INTRO */}
            <div className="space-y-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#00a8b5] font-bold mb-3">
                  PHP // MYSQL // JAVASCRIPT // 2025
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-4xl sm:text-5xl font-black text-[#00f0ff] uppercase tracking-tight">
                    WearView Academy
                  </h2>

                  <span className="font-mono text-[9px] font-black bg-black text-[#39ff14] px-2 py-1">
                    IT SUPPORT SYSTEM
                  </span>
                </div>

                <p className="mt-4 text-base sm:text-lg font-bold leading-relaxed max-w-xl">
                  A PHP/MySQL support management system designed to handle staff IT requests from issue submission through technician resolution.
                </p>
              </div>
            </div>

            {/* SYSTEM SNAPSHOT */}
            <section className="space-y-6 border-t-2 border-black pt-8">
              <p className="font-mono text-[10px] font-bold text-[#00a8b5] uppercase tracking-widest">
                01 // The System
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                A simple workflow with a clear operational path.
              </h3>

              {/* LOGIN */}
              <div className="border-2 border-black bg-white p-3 shadow-[5px_5px_0px_#000]">
                <div className="border-2 border-black overflow-hidden">
                  <Image
                    src="/wearview/login.png"
                    alt="WearView Academy login screen"
                    width={1708}
                    height={1200}
                    className="w-full h-auto"
                  />
                </div>
                <div className="mt-3 border-t-2 border-black pt-3 flex items-center justify-between gap-3">
                  <p className="font-mono text-xs font-black uppercase tracking-widest text-[#00a8b5]">
                    AUTHENTICATED ACCESS
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 text-right">
                    Staff and technician entry point
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-stretch">
                <div className="border-2 border-black bg-white p-4 text-center">
                  <p className="font-mono text-[9px] font-black text-[#00a8b5] uppercase tracking-widest">01</p>
                  <p className="font-black text-sm uppercase mt-2">LOGIN</p>
                </div>
                <div className="hidden sm:flex items-center justify-center font-black text-[#00a8b5]">→</div>
                <div className="border-2 border-black bg-white p-4 text-center">
                  <p className="font-mono text-[9px] font-black text-[#00a8b5] uppercase tracking-widest">02</p>
                  <p className="font-black text-sm uppercase mt-2">REPORT</p>
                </div>
                <div className="hidden sm:flex items-center justify-center font-black text-[#00a8b5]">→</div>
                <div className="border-2 border-black bg-white p-4 text-center">
                  <p className="font-mono text-[9px] font-black text-[#00a8b5] uppercase tracking-widest">03</p>
                  <p className="font-black text-sm uppercase mt-2">TRACK</p>
                </div>
              </div>

              {/* STAFF WORKFLOW */}
              <div className="border-2 border-black bg-white p-3 shadow-[5px_5px_0px_#000]">
                <div className="border-2 border-black overflow-hidden">
                  <Image
                    src="/wearview/staffLogForm.png"
                    alt="WearView Academy IT support issue logging form"
                    width={1708}
                    height={1200}
                    className="w-full h-auto"
                  />
                </div>
                <div className="mt-3 border-t-2 border-black pt-3 flex items-center justify-between gap-3">
                  <p className="font-mono text-xs font-black uppercase tracking-widest text-[#00a8b5]">
                    STAFF ISSUE LOG
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 text-right">
                    Details + optional evidence
                  </p>
                </div>
              </div>

              {/* DASHBOARD */}
              <div className="border-4 border-black bg-white p-3 shadow-[6px_6px_0px_#000]">
                <div className="border-2 border-black overflow-hidden">
                  <Image
                    src="/wearview/dashboard.png"
                    alt="WearView Academy dashboard showing incomplete and complete jobs options"
                    width={1710}
                    height={1200}
                    className="w-full h-auto"
                  />
                </div>
                <div className="mt-3 border-t-2 border-black pt-3 flex items-center justify-between gap-3">
                  <p className="font-mono text-xs font-black uppercase tracking-widest text-[#00a8b5]">
                    TECHNICIAN DASHBOARD
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 text-right">
                    Separate active and completed work
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border-2 border-black bg-[#dffcff] p-5">
                  <p className="font-mono text-[9px] font-bold text-[#00a8b5] uppercase tracking-widest">
                    STAFF WORKFLOW
                  </p>
                  <p className="text-xl font-black uppercase mt-2">
                    Log an issue
                  </p>
                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    Staff enter their details, location, asset number and issue description,
                    with an optional file upload for supporting evidence.
                  </p>
                </div>

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-bold text-[#00a8b5] uppercase tracking-widest">
                    TECHNICIAN WORKFLOW
                  </p>
                  <p className="text-xl font-black uppercase mt-2">
                    Manage jobs
                  </p>
                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    Jobs are separated into incomplete and complete views, with status
                    updates written back to the database.
                  </p>
                </div>
              </div>
            </section>

            {/* BUILD */}
            <section className="space-y-6 border-t-2 border-black pt-8">
              <p className="font-mono text-[10px] font-bold text-[#00a8b5] uppercase tracking-widest">
                02 // Building It
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                A small full-stack workflow built around a relational database.
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-black text-[#00a8b5] uppercase tracking-widest">SERVER</p>
                  <h4 className="font-black text-xl uppercase mt-2">PHP</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    Handles form processing, authentication flow, validation and database operations.
                  </p>
                </div>

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-black text-[#00a8b5] uppercase tracking-widest">DATABASE</p>
                  <h4 className="font-black text-xl uppercase mt-2">MySQL + PDO</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    Stores submitted IT issues and supports retrieval and status updates through PDO.
                  </p>
                </div>

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-black text-[#00a8b5] uppercase tracking-widest">VALIDATION</p>
                  <h4 className="font-black text-xl uppercase mt-2">Client + Server</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    JavaScript provides immediate feedback while server-side validation remains the control layer for submitted data.
                  </p>
                </div>

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-black text-[#00a8b5] uppercase tracking-widest">INTERFACE</p>
                  <h4 className="font-black text-xl uppercase mt-2">Responsive CSS</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    Flexible layouts and mobile/tablet media queries were used to adapt the prototype to different screen sizes.
                  </p>
                </div>
              </div>
            </section>

            {/* SECURITY */}
            <section className="space-y-6 border-t-2 border-black pt-8">
              <p className="font-mono text-[10px] font-bold text-[#00a8b5] uppercase tracking-widest">
                03 // Security & Validation
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                Security and validation were important parts of the development process, 
                so the system was tested against invalid input and common web vulnerabilities.
              </h3>

              <div className="border-2 border-black bg-white p-3 shadow-[5px_5px_0px_#000]">
                <div className="border-2 border-black overflow-hidden">
                  <Image
                    src="/wearview/FormValidation.png"
                    alt="WearView Academy form validation error message"
                    width={1708}
                    height={1200}
                    className="w-full h-auto"
                  />
                </div>
                <div className="mt-3 border-t-2 border-black pt-3 flex items-center justify-between gap-3">
                  <p className="font-mono text-xs font-black uppercase tracking-widest text-[#00a8b5]">
                    VALIDATION IN ACTION
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 text-right">
                    Input rejected before submission
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-black text-[#00a8b5] uppercase tracking-widest">ACCESS</p>
                  <h4 className="font-black text-lg uppercase mt-2">Server-side login validation</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    The prototype restricted access to staff or technician accounts through server-side validation.
                  </p>
                </div>

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-black text-[#00a8b5] uppercase tracking-widest">INPUT</p>
                  <h4 className="font-black text-lg uppercase mt-2">Sanitisation + validation</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    Input was validated on the server and sanitised, with JavaScript used to improve feedback and user experience.
                  </p>
                </div>

                <div className="border-2 border-black bg-[#dffcff] p-5">
                  <p className="font-mono text-[9px] font-black text-[#00a8b5] uppercase tracking-widest">TEST RESULT</p>
                  <h4 className="font-black text-lg uppercase mt-2">No SQL injection found</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    Security testing identified no SQL injection vulnerability, while also exposing further session and header hardening opportunities.
                  </p>
                </div>
              </div>

              <div className="border-4 border-black bg-black text-white p-5 sm:p-6 shadow-[6px_6px_0px_#00f0ff]">
                <p className="font-mono text-[9px] font-black text-[#39ff14] uppercase tracking-widest">
                  // CRITICAL EVALUATION
                </p>
                <p className="mt-3 text-base sm:text-lg leading-relaxed text-zinc-100">
                  The prototype was not treated as production-ready. Testing highlighted remaining issues around the session cookie and missing security headers such as CSP and HSTS, giving a clear direction for future hardening.
                </p>
              </div>
            </section>

            {/* UX TESTING */}
            <section className="space-y-6 border-t-2 border-black pt-8">
              <p className="font-mono text-[10px] font-bold text-[#00a8b5] uppercase tracking-widest">
                04 // UX & Testing
              </p>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                Build it. Test it. Find the gaps.
              </h3>

              {/* INCOMPLETE JOBS */}
              <div className="border-2 border-black bg-white p-3 shadow-[5px_5px_0px_#000]">
                <div className="border-2 border-black overflow-hidden">
                  <Image
                    src="/wearview/incompleteJobs.png"
                    alt="WearView Academy incomplete jobs list"
                    width={1708}
                    height={1200}
                    className="w-full h-auto"
                  />
                </div>
                <div className="mt-3 border-t-2 border-black pt-3 flex items-center justify-between gap-3">
                  <p className="font-mono text-xs font-black uppercase tracking-widest text-[#00a8b5]">
                    ACTIVE JOB QUEUE
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 text-right">
                    Technician-facing workflow
                  </p>
                </div>
              </div>

              {/* UPDATE JOB */}
              <div className="border-2 border-black bg-white p-3 shadow-[5px_5px_0px_#000]">
                <div className="border-2 border-black overflow-hidden">
                  <Image
                    src="/wearview/UpdateJob.png"
                    alt="WearView Academy update job status screen"
                    width={1708}
                    height={1200}
                    className="w-full h-auto"
                  />
                </div>
                <div className="mt-3 border-t-2 border-black pt-3 flex items-center justify-between gap-3">
                  <p className="font-mono text-xs font-black uppercase tracking-widest text-[#00a8b5]">
                    STATUS UPDATE
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 text-right">
                    Complete the workflow
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="border-2 border-black bg-black text-white p-4">
                  <p className="text-3xl sm:text-4xl font-black">3</p>
                  <p className="font-mono text-[9px] uppercase mt-2">Users observed</p>
                </div>
                <div className="border-2 border-black bg-white p-4">
                  <p className="text-3xl sm:text-4xl font-black">UX</p>
                  <p className="font-mono text-[9px] uppercase mt-2">Flow tested</p>
                </div>
                <div className="border-2 border-black bg-white p-4">
                  <p className="text-3xl sm:text-4xl font-black">RWD</p>
                  <p className="font-mono text-[9px] uppercase mt-2">Responsive test</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-black text-[#00a8b5] uppercase tracking-widest">WHAT WORKED</p>
                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    Users found the flow logical and easy to follow, while login and issue submission worked correctly during observation.
                  </p>
                </div>

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-black text-[#00a8b5] uppercase tracking-widest">WHAT NEEDED WORK</p>
                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    Testing highlighted contrast, navigation and smaller-screen job-list improvements as areas for further development.
                  </p>
                </div>
              </div>
            </section>

            {/* WHAT I LEARNED */}
            <section className="space-y-6 border-t-2 border-black pt-8">
              <p className="font-mono text-[10px] font-bold text-[#00a8b5] uppercase tracking-widest">
                05 // What I Learned
              </p>

              <div className="space-y-3">
                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-black text-[#00a8b5] uppercase tracking-widest">01</p>
                  <h4 className="font-black text-xl uppercase mt-2">Validation has layers.</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    Client-side checks can improve the experience, but they should not replace server-side validation.
                  </p>
                </div>

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] font-black text-[#00a8b5] uppercase tracking-widest">02</p>
                  <h4 className="font-black text-xl uppercase mt-2">Testing changes the build.</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    User observation and security testing exposed issues that would not be obvious from the happy path alone.
                  </p>
                </div>

                <div className="border-2 border-black bg-[#dffcff] p-5">
                  <p className="font-mono text-[9px] font-black text-[#00a8b5] uppercase tracking-widest">03</p>
                  <h4 className="font-black text-xl uppercase mt-2">Prototype ≠ production.</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                    A working prototype can still reveal clear next steps for stronger authentication, session security and accessibility.
                  </p>
                </div>
              </div>

              {/* FINAL REFLECTION */}
              <div className="border-4 border-black bg-[#00f0ff] text-black p-5 sm:p-6 shadow-[6px_6px_0px_#000]">
                <p className="font-mono text-[9px] font-black uppercase tracking-widest">
                  // FINAL ENGINEERING NOTE
                </p>

                <p className="mt-3 text-xl sm:text-2xl font-black leading-tight">
                  The most useful part of the build was discovering where a working system still needed to become a better one.
                </p>
              </div>

            </section>

          </div>
        </div>
      </div>

        {/* =========================================================== */}
        {/* 🏦 ARTEFACT E: SLIDE-OUT PANEL (BANK MARKETING ANN)        */}
        {/* =========================================================== */}

        <div
          className={`fixed inset-0 z-50 flex justify-start transition-all duration-700 ease-in-out ${
            expandedProject === 'bank'
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* BACKDROP */}
          <div
            onClick={() => setExpandedProject(null)}
            className="absolute inset-0 bg-gradient-to-tr from-[#39ff14]/35 via-black/20 to-[#39ff14]/20 backdrop-blur-md"
          />

          {/* PANEL */}
          <div
            className={`absolute left-0 top-0 z-[100] h-full w-full max-w-3xl border-r-4 border-black bg-[#fdfcf0] flex flex-col transition-transform duration-700 ease-in-out transform shadow-[10px_0px_0px_#000] ${
              expandedProject === 'bank'
                ? 'translate-x-0'
                : '-translate-x-full'
            }`}
          >

            {/* HEADER */}
            <div className="p-6 border-b-4 border-black flex justify-between items-center bg-white">
              <div>
                <span className="font-mono text-xs font-bold bg-black text-[#39ff14] px-2 py-0.5">
                  // ARTIFICIAL NEURAL NETWORK
                </span>
              </div>

              <button
                onClick={() => setExpandedProject(null)}
                className="border-2 border-black bg-white hover:bg-black hover:text-white px-2 py-1 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                CLOSE_X
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-14 font-sans">

              {/* PROJECT INTRO */}
              <section className="space-y-5">

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#39ff14] font-bold mb-3">
                    MACHINE LEARNING // BINARY CLASSIFICATION // 2025
                  </p>

                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="text-4xl sm:text-5xl text-[#39ff14] font-black uppercase tracking-tight">
                      BANK MARKETING
                    </h2>

                    <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-1">
                      ANN LAB
                    </span>

                  </div>

                  <p className="mt-4 text-base sm:text-lg font-bold leading-relaxed max-w-xl">
                    Exploring how class imbalance, oversampling and neural network
                    architecture influence binary classification performance.
                  </p>
                </div>

              </section>


              {/* 01 — THE PROBLEM */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <p className="font-mono text-[10px] font-bold text-[#39ff14] uppercase tracking-widest">
                  01 // The Problem
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Start with the data imbalance.
                </h3>

                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  The project used the Bank Marketing dataset as a binary classification
                  problem. A key focus was understanding how class imbalance could affect
                  model behaviour and how oversampling could be used to address it.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

                  <div className="border-2 border-black bg-white p-4">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                      TASK
                    </p>

                    <p className="text-xl font-black mt-1 uppercase">
                      BINARY
                    </p>

                    <p className="font-mono text-[9px] text-zinc-500 mt-1">
                      CLASSIFICATION
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-4">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                      CHALLENGE
                    </p>

                    <p className="text-xl font-black mt-1 uppercase">
                      IMBALANCE
                    </p>

                    <p className="font-mono text-[9px] text-zinc-500 mt-1">
                      CLASS DISTRIBUTION
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-4">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                      MODEL
                    </p>

                    <p className="text-xl font-black mt-1">
                      ANN
                    </p>

                    <p className="font-mono text-[9px] text-zinc-500 mt-1">
                      NEURAL NETWORK
                    </p>
                  </div>

                </div>

                <div className="border-2 border-black bg-white p-3 shadow-[5px_5px_0px_#000]">
                  <div className="border-2 border-black overflow-hidden bg-black">
                    <Image
                      src="/bankMarketing/bank-baseline-confusion.png"
                      alt="Baseline confusion matrix showing the model predicted only the negative class"
                      width={1500}
                      height={900}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="mt-3 border-t-2 border-black pt-3">
                    <p className="font-mono text-xs font-black uppercase tracking-widest text-[#39ff14]">
                      BASELINE // CLASS IMBALANCE
                    </p>

                    <p className="mt-2 text-sm font-bold leading-relaxed">
                      The initial model predicted only the negative class, exposing the
                      impact of the 77:23 class imbalance.
                    </p>
                  </div>
                </div>
              </section>


              {/* 02 — THE APPROACH */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <p className="font-mono text-[10px] font-bold text-[#39ff14] uppercase tracking-widest">
                  02 // The Approach
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Experiment with the data before changing the model.
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">

                  <div className="border-2 border-black bg-white p-4">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                      STEP 01
                    </p>

                    <h4 className="text-lg font-black uppercase mt-2">
                      Inspect
                    </h4>

                    <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                      Examine the structure of the classification problem and the
                      distribution of the target classes.
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-4">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                      STEP 02
                    </p>

                    <h4 className="text-lg font-black uppercase mt-2">
                      Prepare
                    </h4>

                    <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                      Prepare the dataset for neural network modelling and account
                      for the imbalance problem.
                    </p>
                  </div>

                  <div className="border-2 border-black bg-[#39ff14] p-4">
                    <p className="font-mono text-[9px] font-black uppercase tracking-widest">
                      STEP 03
                    </p>

                    <h4 className="text-lg font-black uppercase mt-2">
                      Oversample
                    </h4>

                    <p className="text-xs text-black leading-relaxed mt-2">
                      Explore oversampling as a way of giving the minority class
                      greater representation during training.
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-4">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                      STEP 04
                    </p>

                    <h4 className="text-lg font-black uppercase mt-2">
                      Compare
                    </h4>

                    <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                      Compare network configurations and examine how architecture
                      changes affect the classifier.
                    </p>
                  </div>

                </div>

                <div className="border-2 border-black bg-black p-3 shadow-[5px_5px_0px_#000]">
                  <div className="border-2 border-zinc-700 overflow-hidden">
                    <Image
                      src="/bankMarketing/oversampler-code.png"
                      alt="Python code applying RandomOverSampler to balance the Bank Marketing training data"
                      width={1800}
                      height={900}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="mt-3 border-t border-zinc-700 pt-3">
                    <p className="font-mono text-xs font-black uppercase tracking-widest text-[#39ff14]">
                      OVERSAMPLING // TRAINING DATA
                    </p>

                    <p className="mt-2 text-sm text-zinc-200 leading-relaxed">
                      RandomOverSampler was used to rebalance the minority class without
                      discarding existing observations.
                    </p>
                  </div>
                </div>

              </section>


              {/* 03 — NETWORK ARCHITECTURE */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <p className="font-mono text-[10px] font-bold text-[#39ff14] uppercase tracking-widest">
                  03 // Network Architecture
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  A deliberately compact neural network.
                </h3>

                <div className="grid gap-3">

                  <div className="border-2 border-black bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-xs font-black text-[#39ff14]">
                        01
                      </span>
                      <span className="font-mono text-[9px] font-bold text-zinc-500">
                        BASELINE
                      </span>
                    </div>

                    <h4 className="font-black text-lg mt-2">
                      One hidden layer · 6 nodes
                    </h4>

                    <p className="font-mono text-xs text-zinc-600 mt-2">
                      TEST ACCURACY // 77%
                    </p>
                  </div>


                  <div className="border-4 border-black bg-[#39ff14] p-4 shadow-[5px_5px_0px_#000]">
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-xs font-black">
                        02
                      </span>
                      <span className="font-mono text-[9px] font-black bg-black text-[#39ff14] px-2 py-1">
                        BEST MODEL
                      </span>
                    </div>

                    <h4 className="font-black text-xl mt-2">
                      One hidden layer · 12 nodes
                    </h4>

                    <p className="font-mono text-xs font-black mt-2">
                      TEST ACCURACY // 98%
                    </p>
                  </div>


                  <div className="border-2 border-black bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-xs font-black text-[#39ff14]">
                        03
                      </span>
                      <span className="font-mono text-[9px] font-bold text-zinc-500">
                        COMPLEXITY TEST
                      </span>
                    </div>

                    <h4 className="font-black text-lg mt-2">
                      One hidden layer · 24 nodes
                    </h4>

                    <p className="font-mono text-xs text-zinc-600 mt-2">
                      TEST ACCURACY // 93%
                    </p>
                  </div>


                  <div className="border-2 border-black bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-xs font-black text-[#39ff14]">
                        04
                      </span>
                      <span className="font-mono text-[9px] font-bold text-zinc-500">
                        DEPTH TEST
                      </span>
                    </div>

                    <h4 className="font-black text-lg mt-2">
                      Two hidden layers · 6 nodes each
                    </h4>

                    <p className="font-mono text-xs text-zinc-600 mt-2">
                      TRAINING ACCURACY // 90%
                    </p>
                  </div>

                </div>

                {/* WINNING MODEL */}
                <div className="border-4 border-black bg-[#39ff14] p-5 sm:p-6 shadow-[6px_6px_0px_#000]">

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] font-black bg-black text-[#39ff14] px-2 py-1 tracking-widest">
                      WINNER
                    </span>

                    <p className="font-mono text-[9px] font-black uppercase tracking-widest">
                      12 HIDDEN NODES
                    </p>
                  </div>

                  <p className="mt-3 text-base sm:text-lg font-black leading-relaxed">
                    Increasing the hidden layer from 6 to 12 nodes produced the strongest
                    configuration, reaching 98% test accuracy.
                  </p>

                </div>

                <div className="border-4 border-black bg-black text-white p-5 sm:p-6">

                  <p className="font-mono text-[9px] text-[#39ff14] uppercase tracking-widest">
                    ARCHITECTURE SNAPSHOT
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-5">

                    <div className="border-2 border-white/40 p-4">
                      <p className="font-mono text-[9px] text-zinc-400 uppercase">
                        MODEL
                      </p>

                      <p className="text-2xl font-black mt-1">
                        ANN
                      </p>
                    </div>

                    <div className="border-2 border-white/40 p-4">
                      <p className="font-mono text-[9px] text-zinc-400 uppercase">
                        HIDDEN NODES
                      </p>

                      <p className="text-2xl font-black mt-1">
                        12
                      </p>
                    </div>

                    <div className="border-2 border-[#39ff14] p-4">
                      <p className="font-mono text-[9px] text-[#39ff14] uppercase">
                        FOCUS
                      </p>

                      <p className="text-2xl font-black mt-1">
                        BINARY
                      </p>
                    </div>

                  </div>

                </div>

                <div className="border-4 border-black bg-[#39ff14] p-3 shadow-[7px_7px_0px_#000]">
                  <div className="border-2 border-black overflow-hidden bg-white">
                    <Image
                      src="/bankMarketing/12-node-results.png"
                      alt="Bank Marketing 12-node neural network confusion matrix and performance results"
                      width={1200}
                      height={1500}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="border-2 border-black overflow-hidden bg-white">
                    <Image
                      src="/bankMarketing/precision-recall.png"
                      alt="Bank Marketing 12-node neural network confusion matrix and performance results"
                      width={1200}
                      height={1500}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="mt-4 border-t-2 border-black pt-4">
                    <p className="font-mono text-xs font-black uppercase tracking-widest text-[#39ff14]">
                      HOW TO READ THE MATRIX
                    </p>

                    <p className="mt-2 text-sm leading-relaxed font-bold">
                      Each cell shows how the model's predictions compared with the actual
                      class. The diagonal shows correct predictions; the off-diagonal cells
                      show errors.
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-4 font-mono text-[10px] font-bold">
                      <div className="border-2 border-black bg-zinc-100 p-3">
                        <span className="text-[#39ff14]">912</span>
                        <br />
                        TRUE NEGATIVES
                      </div>

                      <div className="border-2 border-black bg-zinc-100 p-3">
                        <span className="text-[#ff00ff]">3</span>
                        <br />
                        FALSE POSITIVES
                      </div>

                      <div className="border-2 border-black bg-zinc-100 p-3">
                        <span className="text-[#ff00ff]">30</span>
                        <br />
                        FALSE NEGATIVES
                      </div>

                      <div className="border-2 border-black bg-zinc-100 p-3">
                        <span className="text-[#39ff14]">856</span>
                        <br />
                        TRUE POSITIVES
                      </div>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                      For this model, 912 class-0 cases and 856 class-1 cases were correctly
                      classified, while 3 class-0 cases were predicted as class 1 and 30
                      class-1 cases were predicted as class 0.
                    </p>
                  </div>

                </div>

              </section>


              {/* 04 — WHAT THE EXPERIMENT SHOWED */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <p className="font-mono text-[10px] font-bold text-[#39ff14] uppercase tracking-widest">
                  04 // What the Experiment Showed
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  The model was only one part of the problem.
                </h3>

                <div className="space-y-3">

                  <div className="border-2 border-black bg-white p-5">
                    <p className="font-mono text-[9px] font-bold text-[#39ff14] uppercase tracking-widest">
                      DATA
                    </p>

                    <h4 className="text-lg font-black uppercase mt-2">
                      Class distribution matters.
                    </h4>

                    <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                      An imbalanced dataset can make overall performance look better
                      than the model&apos;s behaviour on the minority class.
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-5">
                    <p className="font-mono text-[9px] font-bold text-[#39ff14] uppercase tracking-widest">
                      RESAMPLING
                    </p>

                    <h4 className="text-lg font-black uppercase mt-2">
                      Oversampling changes what the network sees.
                    </h4>

                    <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                      Rebalancing the training data can change how effectively the
                      classifier learns the minority class.
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-5">
                    <p className="font-mono text-[9px] font-bold text-[#39ff14] uppercase tracking-widest">
                      ARCHITECTURE
                    </p>

                    <h4 className="text-lg font-black uppercase mt-2">
                      More complexity is not automatically better.
                    </h4>

                    <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                      Network structure, hidden-layer size and data preparation all
                      influence model behaviour, so the architecture has to fit the
                      problem rather than simply become larger.
                    </p>
                  </div>

                </div>

              </section>


              {/* DATA SOURCE */}
              <section className="space-y-4 border-t-2 border-black pt-8">
                <p className="font-mono text-[10px] font-bold text-[#39ff14] uppercase tracking-widest">
                  06 // Data Source
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Original dataset & provenance.
                </h3>

                <div className="border-2 border-black bg-white p-5">
                  <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                    ORIGINAL DATASET
                  </p>

                  <p className="mt-2 text-lg font-black">
                    Bank Marketing
                  </p>

                  <p className="mt-2 text-sm font-medium leading-relaxed">
                    Originally published through the UCI Machine Learning Repository,
                    the dataset contains data from direct telephone marketing campaigns
                    conducted by a Portuguese banking institution.
                  </p>

                  <p className="mt-4 font-mono text-xs text-zinc-600">
                    Moro, S., Rita, P. & Cortez, P. (2014)
                  </p>

                  <a
                    href="https://archive.ics.uci.edu/dataset/222/bank"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 border-2 border-black bg-[#39ff14] px-4 py-2 font-mono text-xs font-black uppercase hover:bg-black hover:text-[#39ff14] transition-colors"
                  >
                    VIEW DATASET ↗
                  </a>
                </div>
              </section>

              {/* 06 — WHAT I LEARNED */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <p className="font-mono text-[10px] font-bold text-[#39ff14] uppercase tracking-widest">
                  07 // What I Learned
                </p>

                <div className="space-y-4">

                  <div className="border-2 border-black bg-white p-5">
                    <p className="font-mono text-[10px] font-bold text-[#39ff14] uppercase tracking-widest">
                      01
                    </p>

                    <h4 className="text-xl font-black uppercase mt-2">
                      Data preparation is part of modelling.
                    </h4>

                    <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                      The classifier cannot be evaluated separately from the data it
                      was trained on.
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-5">
                    <p className="font-mono text-[10px] font-bold text-[#39ff14] uppercase tracking-widest">
                      02
                    </p>

                    <h4 className="text-xl font-black uppercase mt-2">
                      Imbalance needs attention.
                    </h4>

                    <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                      Looking beyond overall accuracy is important when one class is
                      represented differently from the other.
                    </p>
                  </div>

                  <div className="border-4 border-black bg-black text-white p-5 sm:p-6 shadow-[6px_6px_0px_#39ff14]">

                    <p className="font-mono text-[9px] font-black text-[#39ff14] uppercase tracking-widest">
                      // FINAL LAB NOTE
                    </p>

                    <p className="mt-3 text-xl sm:text-2xl font-black leading-tight">
                      The interesting part wasn't just building the neural network.
                      It was understanding how the data shaped what the network learned.
                    </p>

                  </div>

                </div>

              </section>

            </div>
          </div>
        </div>

        {/* =========================================================== */}
        {/* ARTEFACT F: SLIDE-OUT PANEL (QUIZ)                         */}
        {/* =========================================================== */}

        <div
          className={`fixed inset-0 z-50 flex justify-end transition-all duration-700 ease-in-out ${
            expandedProject === 'quiz'
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* BACKDROP */}
          <div
            onClick={() => setExpandedProject(null)}
            className="absolute inset-0 bg-gradient-to-bl from-[#ff00ff]/35 via-black/20 to-[#ff00ff]/20 backdrop-blur-md"
          />

          {/* PANEL */}
          <div
            className={`absolute right-0 top-0 z-[100] h-full w-full max-w-3xl border-l-4 border-black bg-[#fdfcf0] flex flex-col transition-transform duration-700 ease-in-out transform shadow-[-10px_0px_0px_#000] ${
              expandedProject === 'quiz'
                ? 'translate-x-0'
                : 'translate-x-full'
            }`}
          >

            {/* HEADER */}
            <div className="p-6 border-b-4 border-black flex justify-between items-center bg-white">
              <div>
                <span className="font-mono text-xs font-bold bg-black text-[#ff00ff] px-2 py-0.5">
                  // PYTHON QUIZ
                </span>
              </div>

              <button
                onClick={() => setExpandedProject(null)}
                className="border-2 border-black bg-white hover:bg-black hover:text-white px-2 py-1 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                CLOSE_X
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-14 font-sans">

              {/* PROJECT INTRO */}
              <section className="space-y-5">

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#ff00ff] font-bold mb-3">
                    PYTHON // MINI PROJECT // 2025
                  </p>

                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="text-4xl sm:text-5xl text-[#ff00ff] font-black uppercase tracking-tight">
                      QUIZ
                    </h2>

                    <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-1">
                      T / F
                    </span>

                  </div>

                  <p className="mt-4 text-base sm:text-lg font-bold leading-relaxed max-w-xl">
                    A command-line true-or-false quiz exploring Python
                    dictionaries, functions, input validation and score tracking.
                  </p>
                </div>

              </section>


              {/* 01 — THE IDEA */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest">
                  01 // The Idea
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Keep the interaction simple.
                </h3>

                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  The project is a 10-question true-or-false quiz. Players enter
                  their name, answer each question and receive a final score and
                  percentage.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

                  <div className="border-2 border-black bg-white p-4">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                      QUESTIONS
                    </p>

                    <p className="text-xl font-black mt-1">
                      10
                    </p>

                    <p className="font-mono text-[9px] text-zinc-500 mt-1">
                      TRUE / FALSE
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-4">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                      INPUT
                    </p>

                    <p className="text-xl font-black mt-1">
                      T / F
                    </p>

                    <p className="font-mono text-[9px] text-zinc-500 mt-1">
                      VALIDATED
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-4">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                      PLAYERS
                    </p>

                    <p className="text-xl font-black mt-1">
                      MULTI
                    </p>

                    <p className="font-mono text-[9px] text-zinc-500 mt-1">
                      SCORE TRACKING
                    </p>
                  </div>

                </div>

              </section>


              {/* 02 — THE STRUCTURE */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest">
                  02 // The Structure
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Separate the data from the quiz logic.
                </h3>

                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  The questions are stored in a separate Python dictionary,
                  allowing the main quiz program to import and work with the
                  question data independently.
                </p>

                <div className="border-2 border-black bg-black p-4">

                  <p className="mb-3 font-mono text-xs font-black uppercase tracking-widest text-[#ff00ff]">
                    QUESTION DATA // PYTHON DICTIONARY
                  </p>

                  <div className="overflow-x-auto font-mono text-xs leading-relaxed text-white">
                    <p>quiz = {"{"}</p>
                    <p className="pl-4">
                      1 : {"{"}"question" : "An octopus has three hearts...",
                    </p>
                    <p className="pl-8">
                      "answer" : "t"
                    </p>
                    <p className="pl-4">{"}"},</p>

                    <p className="pl-4">
                      2 : {"{"}"question" : "Goldfish have a two second memory...",
                    </p>
                    <p className="pl-8">
                      "answer" : "f"
                    </p>
                    <p className="pl-4">{"}"}</p>

                    <p>{"}"}</p>
                  </div>

                </div>

              </section>


              {/* 03 — INPUT VALIDATION */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest">
                  03 // Input Validation
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Make user input predictable.
                </h3>

                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  The answer-checking function validates the player's response
                  and accepts both uppercase and lowercase T/F input.
                </p>

                <div className="border-2 border-black bg-white p-3 shadow-[5px_5px_0px_#000]">

                  <div className="border-2 border-black bg-black p-4">
                    <p className="mb-3 font-mono text-xs font-black uppercase tracking-widest text-[#ff00ff]">
                      INPUT VALIDATION // USER RESPONSE
                    </p>

                    <div className="overflow-x-auto font-mono text-xs leading-relaxed text-white">
                      <p>answers = ['t', 'f', 'T', 'F']</p>

                      <p className="mt-2">
                        while user_answer not in answers:
                      </p>

                      <p className="pl-4">
                        user_answer = input(...)
                      </p>

                      <p className="mt-2">
                        if quiz[question]['answer'].lower()
                      </p>

                      <p className="pl-4">
                        == user_answer.lower():
                      </p>
                    </div>

                  </div>

                </div>

              </section>


              {/* 04 — SCORE SYSTEM */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest">
                  04 // Score System
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Turn correct answers into a result.
                </h3>

                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  Each correct answer increments the score, which is then
                  converted into a percentage based on the total number of
                  questions.
                </p>

                <div className="border-4 border-black bg-[#ff00ff] p-5 sm:p-6 shadow-[6px_6px_0px_#000]">

                  <p className="font-mono text-[9px] font-black uppercase tracking-widest">
                    SCORING // PERCENTAGE CALCULATION
                  </p>

                  <div className="mt-3 border-2 border-black bg-black p-4 overflow-x-auto font-mono text-xs leading-relaxed text-white">
                    <p>nr_quiz_questions = 10</p>
                    <p className="mt-2">
                      def percentage_score(score, nr_quiz_questions):
                    </p>
                    <p className="pl-4">
                      percent = (score / nr_quiz_questions) * 100
                    </p>
                    <p className="pl-4">
                      return percent
                    </p>
                  </div>

                </div>

              </section>


              {/* 05 — WHAT I LEARNED */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest">
                  05 // What I Learned
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Small project, useful fundamentals.
                </h3>

                <div className="space-y-3">

                  <div className="border-2 border-black bg-white p-5">
                    <p className="font-mono text-[9px] font-bold text-[#ff00ff] uppercase tracking-widest">
                      FUNCTIONS
                    </p>

                    <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                      Practised breaking the quiz into reusable pieces of logic.
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-5">
                    <p className="font-mono text-[9px] font-bold text-[#ff00ff] uppercase tracking-widest">
                      VALIDATION
                    </p>

                    <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                      Built predictable handling for user input and
                      case-sensitive responses.
                    </p>
                  </div>

                  <div className="border-4 border-black bg-black text-white p-5 sm:p-6 shadow-[6px_6px_0px_#ff00ff]">

                    <p className="font-mono text-[9px] font-black text-[#ff00ff] uppercase tracking-widest">
                      // FINAL PROJECT NOTE
                    </p>

                    <p className="mt-3 text-xl sm:text-2xl font-black leading-tight">
                      The project helped turn basic Python syntax into a complete
                      interactive program with a clear beginning, middle and end.
                    </p>

                  </div>

                </div>

              </section>

            </div>
          </div>
        </div>


        {/* =========================================================== */}
        {/*  ARTEFACT G: SLIDE-OUT PANEL (LIBRARY CATALOGUE)            */}
        {/* =========================================================== */}

        <div
          className={`fixed inset-0 z-50 flex justify-end transition-all duration-700 ease-in-out ${
            expandedProject === 'catalogue'
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* BACKDROP */}
          <div
            onClick={() => setExpandedProject(null)}
            className="absolute inset-0 bg-gradient-to-bl from-[#00f0ff]/35 via-black/20 to-[#00f0ff]/20 backdrop-blur-md"
          />

          {/* PANEL */}
          <div
            className={`absolute right-0 top-0 z-[100] h-full w-full max-w-3xl border-l-4 border-black bg-[#fdfcf0] flex flex-col transition-transform duration-700 ease-in-out transform shadow-[-10px_0px_0px_#000] ${
              expandedProject === 'catalogue'
                ? 'translate-x-0'
                : 'translate-x-full'
            }`}
          >

            {/* HEADER */}
            <div className="p-6 border-b-4 border-black flex justify-between items-center bg-white">
              <div>
                <span className="font-mono text-xs font-bold bg-black text-[#00f0ff] px-2 py-0.5">
                  // OBJECT-ORIENTED PYTHON
                </span>
              </div>

              <button
                onClick={() => setExpandedProject(null)}
                className="border-2 border-black bg-white hover:bg-black hover:text-white px-2 py-1 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                CLOSE_X
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-14 font-sans">

              {/* PROJECT INTRO */}
              <section className="space-y-5">

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#00f0ff] font-bold mb-3">
                    PYTHON // SOFTWARE PROJECT // 2025
                  </p>

                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="text-4xl sm:text-5xl text-[#00f0ff] font-black uppercase tracking-tight">
                      LIBRARY CATALOGUE
                    </h2>

                    <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-1">
                      OOP LAB
                    </span>

                  </div>

                  <p className="mt-4 text-base sm:text-lg font-bold leading-relaxed max-w-xl">
                    A Python-based library management system exploring object
                    oriented programming, catalogue operations and book loans.
                  </p>
                </div>

              </section>


              {/* 01 — THE MODEL */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <p className="font-mono text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest">
                  01 // The Model
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Represent books as objects.
                </h3>

                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  The system uses Python classes to represent the main parts of
                  the library. Each Book object stores attributes such as title,
                  author, publisher, year and number of copies.
                </p>

                <div className="border-2 border-black bg-black p-3 shadow-[5px_5px_0px_#000]">

                  <div className="border-2 border-zinc-700 overflow-hidden bg-black p-4">

                    <p className="font-mono text-xs font-black uppercase tracking-widest text-[#00f0ff] mb-3">
                      OBJECT MODEL // BOOK CLASS
                    </p>

                    <div className="overflow-x-auto font-mono text-xs leading-relaxed text-white">
                      <p>class Book():</p>

                      <p className="pl-4">
                        def __init__(self, ID, title, author,
                      </p>

                      <p className="pl-8">
                        publisher, year, no_copies,
                      </p>

                      <p className="pl-8">
                        publication_year):
                      </p>

                      <p className="pl-8">
                        self.ID = uuid.uuid4()
                      </p>

                      <p className="pl-8">
                        self.title = title
                      </p>

                      <p className="pl-8">
                        self.author = author
                      </p>

                      <p className="pl-8">
                        self.no_copies = int(no_copies)
                      </p>
                    </div>

                  </div>

                </div>

              </section>


              {/* 02 — CATALOGUE OPERATIONS */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <p className="font-mono text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest">
                  02 // Catalogue Operations
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Search and manage the catalogue.
                </h3>

                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  Books can be added, removed and searched by title, author,
                  publisher and publication year.
                </p>

                <div className="border-2 border-black bg-white p-3 shadow-[5px_5px_0px_#000]">

                  <div className="border-2 border-black bg-black p-4">

                    <p className="font-mono text-xs font-black uppercase tracking-widest text-[#00f0ff] mb-3">
                      SEARCH // TITLE LOOKUP
                    </p>

                    <div className="overflow-x-auto font-mono text-xs leading-relaxed text-white">
                      <p>
                        {"user_search = input('Please enter book title to search: ')"}
                      </p>

                      <p className="mt-2">
                        {"book_search = [book for book in self.book_list"}
                      </p>

                      <p className="pl-4">
                        {"if book.title.lower() == user_search.lower()]"}
                      </p>
                    </div>

                  </div>

                </div>

              </section>


              {/* 03 — LOANS */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <p className="font-mono text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest">
                  03 // Loans
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Track borrowed books and due dates.
                </h3>

                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  The Loans class manages borrowed books, available books and
                  due dates, storing each borrowing transaction against a user
                  account.
                </p>

                <div className="border-4 border-black bg-[#00f0ff] p-5 sm:p-6 shadow-[6px_6px_0px_#000]">

                  <p className="font-mono text-xs font-black uppercase tracking-widest">
                    BORROWING // USER ACCOUNT
                  </p>

                  <div className="mt-3 border-2 border-black bg-black p-4 overflow-x-auto font-mono text-xs leading-relaxed text-white">

                    <p>
                      {"self.due_date = datetime.now() + timedelta(days=30)"}
                    </p>

                    <p className="mt-2">
                      {"self.available_books = Book_list.available_books"}
                    </p>

                    <p className="mt-2">
                      {"borrowed_book = [{self.user_name:"}
                    </p>

                    <p className="pl-4">
                      {"[self.book_title, self.due_date]}]"}
                    </p>

                    <p className="mt-2">
                      {"self.user_account.extend(borrowed_book)"}
                    </p>

                  </div>

                </div>

              </section>


              {/* 04 — WHAT I LEARNED */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <p className="font-mono text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest">
                  04 // What I Learned
                </p>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Learning to model a real-world system.
                </h3>

                <div className="space-y-3">

                  <div className="border-2 border-black bg-white p-5">

                    <p className="font-mono text-[9px] font-bold text-[#00f0ff] uppercase tracking-widest">
                      OBJECT-ORIENTED DESIGN
                    </p>

                    <h4 className="text-lg font-black uppercase mt-2">
                      Separate responsibilities.
                    </h4>

                    <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                      Classes provided a way to represent books, users and loans
                      as distinct parts of the system.
                    </p>

                  </div>

                  <div className="border-2 border-black bg-white p-5">

                    <p className="font-mono text-[9px] font-bold text-[#00f0ff] uppercase tracking-widest">
                      STATE MANAGEMENT
                    </p>

                    <h4 className="text-lg font-black uppercase mt-2">
                      Keep track of changing data.
                    </h4>

                    <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                      Borrowing and returning books required the system to keep
                      track of availability and user loan information.
                    </p>

                  </div>

                  <div className="border-4 border-black bg-black text-white p-5 sm:p-6 shadow-[6px_6px_0px_#00f0ff]">

                    <p className="font-mono text-[9px] font-black text-[#00f0ff] uppercase tracking-widest">
                      // FINAL PROJECT NOTE
                    </p>

                    <p className="mt-3 text-xl sm:text-2xl font-black leading-tight">
                      A small Python system that introduced me to modelling
                      real-world relationships through code.
                    </p>

                  </div>

                </div>

              </section>


            </div>
          </div>
        </div>


        {/* ========================================== */}
        {/* VISUAL ARCHIVE ARTEFACT A - (PORTRAITS 2014 DRAWER) */}
        {/* ========================================== */}

        <div
          className={`fixed inset-0 z-50 flex justify-end transition-all duration-700 ease-in-out ${
            expandedProject === 'portraits'
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* BACKDROP */}
          <div
            onClick={() => setExpandedProject(null)}
            className="absolute inset-0 bg-gradient-to-bl from-[#ff00ff]/35 via-black/20 to-[#7000ff]/20 backdrop-blur-md"
          />


          {/* LEFT DRAWER */}
          <div
            className={`absolute left-0 top-0 z-[100] h-full w-full max-w-3xl border-r-4 border-black bg-[#fdfcf0] flex flex-col transition-transform duration-700 ease-in-out transform shadow-[10px_0px_0px_#000] ${
              expandedProject === 'portraits'
                ? 'translate-x-0'
                : '-translate-x-full'
            }`}
          >

            {/* HEADER */}
            <div className="p-6 border-b-4 border-black bg-white">

              <div className="flex justify-between items-start gap-6">

                <div>
                  <span className="font-mono text-xs font-bold bg-black text-[#ff00ff] px-2 py-0.5">
                    VISUAL ARCHIVE // FEATURED BA PROJECT
                  </span>
                </div>

                <button
                  onClick={() => setExpandedProject(null)}
                  className="border-2 border-black bg-white hover:bg-black hover:text-white px-2 py-1 font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  CLOSE_X
                </button>

              </div>

              {/* EXTRA BLACK BORDER */}
              <div className="border-b-4 border-black mt-6" />

            </div>


            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-14 font-sans">


              {/* INTRO */}
              <section className="space-y-5">

                <div>

                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#ff00ff] font-bold mb-3">
                    BA GRAPHIC DESIGN // 2014
                  </p>

                  <h2 className="text-4xl sm:text-5xl text-[#ff00ff] font-black uppercase tracking-tight leading-none">
                    Portraits 2014
                  </h2>


                  <div className="flex flex-wrap gap-2 mt-4">

                    <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-1">
                      COMPETITION WINNER
                    </span>

                    <span className="font-mono text-[9px] font-black bg-[#ff00ff] text-white px-2 py-1">
                      FEATURED PROJECT
                    </span>

                    <span className="font-mono text-[9px] font-black bg-white border-2 border-black px-2 py-1">
                      VISUAL IDENTITY
                    </span>

                  </div>


                  <p className="mt-5 text-base sm:text-lg font-bold leading-relaxed max-w-2xl">
                    An exhibition identity exploring stereotyping, judgement and
                    hidden identity through portraiture, colour, typography and
                    a four-gallery visual system.
                  </p>

                </div>

              </section>


              {/* 01 — CONCEPT */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <div>

                  <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest mb-2">
                    01 // CONCEPT
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    Identity, masks and the problem of judgement.
                  </h3>

                </div>


                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  The project challenged ideas around stereotyping and judging.
                  The mask became the central visual concept, representing the
                  idea of an object that can hide a person's true identity.
                </p>


                {/* CONCEPT HIGHLIGHT */}
                <div className="bg-[#ff00ff] text-white border-2 border-black p-5 shadow-[6px_6px_0px_#000]">

                  <p className="font-mono text-[9px] font-black uppercase tracking-widest mb-2 text-white/80">
                    CORE IDEA
                  </p>

                  <p className="text-lg font-black leading-relaxed">
                    What we see is not necessarily what we understand.
                  </p>

                </div>

              </section>


              {/* 02 — VISUAL SYSTEM */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <div>

                  <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest mb-2">
                    02 // VISUAL SYSTEM
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    One identity. Four gallery environments.
                  </h3>

                </div>


                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  The visual system was developed for four neighbouring galleries,
                  with each gallery presenting a different portrait theme. Colour
                  was used to distinguish the venues while keeping the overall
                  identity connected.
                </p>


                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                  <div className="border-2 border-black bg-white p-3">
                    <div className="h-8 bg-[#00f0ff] border border-black mb-2" />
                    <p className="font-mono text-[8px] font-black uppercase">
                      GALLERY 01
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-3">
                    <div className="h-8 bg-[#ff00ff] border border-black mb-2" />
                    <p className="font-mono text-[8px] font-black uppercase">
                      GALLERY 02
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-3">
                    <div className="h-8 bg-[#39ff14] border border-black mb-2" />
                    <p className="font-mono text-[8px] font-black uppercase">
                      GALLERY 03
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-3">
                    <div className="h-8 bg-[#7000ff] border border-black mb-2" />
                    <p className="font-mono text-[8px] font-black uppercase">
                      GALLERY 04
                    </p>
                  </div>

                </div>

              </section>


              {/* 03 — PRIMARY ARTWORK */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <div>

                  <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest mb-2">
                    03 // PRIMARY ARTWORK
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    Layered portraiture.
                  </h3>

                </div>


                <div className="border-2 border-black bg-white shadow-[6px_6px_0px_#000]">

                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">
                    <Image
                      src="/Portraits2014/Portraits2014.jpg"
                      alt="Portraits 2014 primary artwork"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 900px"
                    />
                  </div>

                  <div className="border-t-2 border-black px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest">
                    PRIMARY POSTER // PORTRAITS 2014
                  </div>

                </div>

              </section>


              {/* 04 — PHYSICAL OUTCOME */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <div>

                  <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest mb-2">
                    04 // PHYSICAL OUTCOME
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    From visual identity to printed object.
                  </h3>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* PHYSICAL SHOT 01 */}
                  <div className="border-2 border-black bg-white">

                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                      <Image
                        src="/Portraits2014/Portraits1.jpg"
                        alt="Portraits 2014 printed materials"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                  </div>


                  {/* PHYSICAL SHOT 02 */}
                  <div className="border-2 border-black bg-white">

                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                      <Image
                        src="/Portraits2014/Portraits2.jpg"
                        alt="Portraits 2014 printed booklet"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                  </div>

                </div>

              </section>


              {/* 05 — SELECTED MATERIAL */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <div>

                  <p className="font-mono text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest mb-2">
                    05 // SELECTED MATERIAL
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    A closer look at the visual language.
                  </h3>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <div className="border-2 border-black bg-white">
                    <div className="relative w-full aspect-[3/4] overflow-hidden">
                      <Image
                        src="/Portraits2014/Portraits4.jpg"
                        alt="Portraits 2014 poster"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>


                  <div className="border-2 border-black bg-white">
                    <div className="relative w-full aspect-[3/4] overflow-hidden">
                      <Image
                        src="/Portraits2014/Portraits5.jpg"
                        alt="Portraits 2014 poster"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>

                </div>

              </section>


              {/* ARCHIVE NOTE */}
              <section className="border-t-2 border-black pt-8 pb-6">

                <div className="bg-black text-white border-2 border-black p-5 shadow-[6px_6px_0px_#ff00ff]">

                  <p className="font-mono text-[9px] font-black uppercase tracking-widest mb-2 text-[#ff00ff]">
                    ARCHIVE NOTE
                  </p>

                  <p className="text-base font-bold leading-relaxed">
                    An important early project in my visual practice, combining
                    conceptual thinking, information structure, typography and
                    physical production.
                  </p>

                </div>

              </section>

            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* VISUAL ARCHIVE ARTEFACT B: TYPOGRAPHY SPECIMEN DRAWER              */}
        {/* ========================================== */}

        <div
          className={`fixed inset-0 z-50 flex justify-end transition-all duration-700 ease-in-out ${
            expandedProject === 'typography'
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >

          {/* BACKDROP */}
          <div
            onClick={() => setExpandedProject(null)}
            className="absolute inset-0 bg-gradient-to-bl from-[#00f0ff]/30 via-black/20 to-[#7000ff]/20 backdrop-blur-md"
          />


          {/* RIGHT DRAWER */}
          <div
            className={`absolute left-0 top-0 z-[100] h-full w-full max-w-3xl border-r-4 border-black bg-[#fdfcf0] flex flex-col transition-transform duration-700 ease-in-out transform shadow-[10px_0px_0px_#000] ${
              expandedProject === 'typography'
                ? 'translate-x-0'
                : '-translate-x-full'
            }`}
          >

            {/* HEADER */}
            <div className="p-6 border-b-4 border-black bg-white">

              <div className="flex justify-between items-start gap-6">

                <div>
                  <span className="font-mono text-xs font-bold bg-black text-[#00f0ff] px-2 py-0.5">
                    VISUAL ARCHIVE // BA GRAPHIC DESIGN
                  </span>
                </div>

                <button
                  onClick={() => setExpandedProject(null)}
                  className="border-2 border-black bg-white hover:bg-black hover:text-white px-2 py-1 font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  CLOSE_X
                </button>

              </div>

            </div>


            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-14 font-sans">


              {/* INTRO                                  */}

              <section className="space-y-5">

                <div>

                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#00f0ff] font-bold mb-3">
                    BA GRAPHIC DESIGN // 2014
                  </p>

                  <h2 className="text-4xl sm:text-5xl text-[#00f0ff] font-black uppercase tracking-tight leading-none">
                    Typography Specimen
                  </h2>


                  <div className="flex flex-wrap gap-2 mt-4">

                    <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-1">
                      TYPE STUDY
                    </span>

                    <span className="font-mono text-[9px] font-black bg-[#00f0ff] text-black px-2 py-1">
                      EDITORIAL
                    </span>

                    <span className="font-mono text-[9px] font-black bg-white border-2 border-black px-2 py-1">
                      DIGITAL + PRINT
                    </span>

                  </div>


                  <p className="mt-5 text-base sm:text-lg font-bold leading-relaxed max-w-2xl">
                    An experimental typography project investigating how type
                    changes through scale, spacing, weight, structure and
                    composition across physical and digital formats.
                  </p>

                </div>

                <div className="bg-[#00f0ff] text-black border-2 border-black p-5 shadow-[6px_6px_0px_#000]">
              <p className="font-mono text-[9px] font-black uppercase tracking-widest mb-2">
                HISTORICAL REFERENCE
              </p>

              <p className="text-base font-bold leading-relaxed">
                The specimen format was inspired by early manuscript and book
                design, translating the visual language of handwritten manuscripts
                and early printed books into a contemporary typographic object.
              </p>
            </div>

              </section>


              {/* 01 — TYPE SYSTEM   */}

              <section className="space-y-6 border-t-2 border-black pt-8">

                <div>

                  <p className="font-mono text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest mb-2">
                    01 // TYPE SYSTEM
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    Typography as a visual system.
                  </h3>

                </div>


                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  The specimen explores different weights, scales and
                  typographic relationships, using large letterforms alongside
                  detailed character and glyph studies.
                </p>


                {/* FEATURE IMAGE */}
                <div className="border-2 border-black bg-white shadow-[6px_6px_0px_#000]">

                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">

                    <Image
                      src="/TypographySpecimenISTD/istd13.jpg"
                      alt="Typography specimen layout"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 900px"
                    />

                  </div>

                  <div className="border-t-2 border-black px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest">
                    SPECIMEN // PRIMARY PAGE
                  </div>

                </div>

              </section>

              {/* 02 — SCALE & SPACING                   */}

              <section className="space-y-6 border-t-2 border-black pt-8">

                <div>

                  <p className="font-mono text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest mb-2">
                    02 // SCALE / SPACING
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    Exploring the behaviour of type.
                  </h3>

                </div>


                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  Size, spacing and tracking become part of the composition,
                  allowing typography to move between information, image and
                  graphic form.
                </p>


                <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_#000]">

                  <div className="space-y-6">

                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[8px] text-zinc-400 w-16">
                        SIZE
                      </span>
                      <div className="h-px flex-1 bg-black" />
                      <span className="font-serif text-4xl font-black">
                        Aa
                      </span>
                    </div>


                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[8px] text-zinc-400 w-16">
                        SPACING
                      </span>
                      <div className="h-px flex-1 bg-black" />
                      <span className="font-serif text-2xl tracking-[0.35em]">
                        TYPE
                      </span>
                    </div>


                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[8px] text-zinc-400 w-16">
                        WEIGHT
                      </span>
                      <div className="h-px flex-1 bg-black" />
                      <span className="font-serif text-2xl font-black">
                        GLYPH
                      </span>
                    </div>

                  </div>

                </div>

              </section>

              {/* 03 — GLYPH STUDIES                     */}

              <section className="space-y-6 border-t-2 border-black pt-8">

                <div>

                  <p className="font-mono text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest mb-2">
                    03 // GLYPH STUDIES
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    Detail at character level.
                  </h3>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* GLYPH IMAGE 01 */}
                  <div className="border-2 border-black bg-white">

                    <div className="relative w-full aspect-[4/3] overflow-hidden">

                      <Image
                        src="/TypographySpecimenISTD/istd1.jpg"
                        alt="Typography glyph study"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />

                    </div>

                  </div>


                  {/* GLYPH IMAGE 02 */}
                  <div className="border-2 border-black bg-white">

                    <div className="relative w-full aspect-[4/3] overflow-hidden">

                      <Image
                        src="/TypographySpecimenISTD/istd2.jpg"
                        alt="Typography detail study"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />

                    </div>

                  </div>

                </div>

              </section>

              {/* 04 — PHYSICAL SPECIMEN                 */}

              <section className="space-y-6 border-t-2 border-black pt-8">

                <div>

                  <p className="font-mono text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest mb-2">
                    04 // PHYSICAL SPECIMEN
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    From printed page to physical object.
                  </h3>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* PHYSICAL IMAGE 01 */}
                  <div className="border-2 border-black bg-white shadow-[4px_4px_0px_#000]">

                    <div className="relative w-full aspect-[4/3] overflow-hidden">

                      <Image
                        src="/TypographySpecimenISTD/istd12.jpg"
                        alt="Typography specimen physical presentation"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />

                    </div>

                  </div>


                  {/* PHYSICAL IMAGE 02 */}
                  <div className="border-2 border-black bg-white shadow-[4px_4px_0px_#000]">

                    <div className="relative w-full aspect-[4/3] overflow-hidden">

                      <Image
                        src="/TypographySpecimenISTD/istd10.jpg"
                        alt="Typography specimen printed work"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />

                    </div>

                  </div>


                  {/* PHYSICAL IMAGE 03 */}
                  <div className="border-2 border-black bg-white sm:col-span-2">

                    <div className="relative w-full aspect-[16/9] overflow-hidden">

                      <Image
                        src="/TypographySpecimenISTD/istd19.jpg"
                        alt="Typography specimen printed composition"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 900px"
                      />

                    </div>

                  </div>
                </div>

                {/* UNFOLDED SPECIMENS — FOUR COLUMN STRIP */}
                <div className="grid grid-cols-4 gap-3 sm:gap-4 pt-3">

                  {/* SPECIMEN 01 */}
                  <div className="border-2 border-black bg-[#f7f3e8] shadow-[4px_4px_0px_#000]">

                    <div className="relative w-full h-[190px] sm:h-[230px] overflow-hidden">

                      <Image
                        src="/TypographySpecimenISTD/istd4.jpg"
                        alt="Unfolded typography specimen 01"
                        fill
                        className="object-contain"
                        sizes="25vw"
                      />

                    </div>

                  </div>


                  {/* SPECIMEN 02 */}
                  <div className="border-2 border-black bg-[#f7f3e8] shadow-[4px_4px_0px_#000]">

                    <div className="relative w-full h-[190px] sm:h-[230px] overflow-hidden">

                      <Image
                        src="/TypographySpecimenISTD/istd2.jpg"
                        alt="Unfolded typography specimen 02"
                        fill
                        className="object-contain"
                        sizes="25vw"
                      />

                    </div>

                  </div>


                  {/* SPECIMEN 03 */}
                  <div className="border-2 border-black bg-[#f7f3e8] shadow-[4px_4px_0px_#000]">

                    <div className="relative w-full h-[190px] sm:h-[230px] overflow-hidden">

                      <Image
                        src="/TypographySpecimenISTD/istd13Cropped.jpg"
                        alt="Unfolded typography specimen 03"
                        fill
                        className="object-contain"
                        sizes="25vw"
                      />

                    </div>

                  </div>


                  {/* SPECIMEN 04 */}
                  <div className="border-2 border-black bg-[#f7f3e8] shadow-[4px_4px_0px_#000]">

                    <div className="relative w-full h-[190px] sm:h-[230px] overflow-hidden">

                      <Image
                        src="/TypographySpecimenISTD/istd14.jpg"
                        alt="Unfolded typography specimen 04"
                        fill
                        className="object-contain"
                        sizes="25vw"
                      />

                    </div>

                  </div>

                </div>


              </section>

              {/* 05 — DIGITAL SPECIMEN   */}

              <section className="space-y-6 border-t-2 border-black pt-8">

                <div>

                  <p className="font-mono text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest mb-2">
                    05 // DIGITAL SPECIMEN
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    Extending the specimen onto the web.
                  </h3>

                </div>


                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  The project was also explored through a web-based specimen,
                  translating the typographic system into a digital presentation
                  rather than treating the printed work as a static outcome.
                </p>


                {/* WEBSITE SCREENSHOT 01 */}
                <div className="border-2 border-black bg-white shadow-[6px_6px_0px_#000]">

                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">

                    <Image
                      src="/TypographySpecimenISTD/GaramondWebsite1.jpg"
                      alt="Typography specimen website"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 900px"
                    />

                  </div>

                  <div className="border-t-2 border-black px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest">
                    DIGITAL SPECIMEN // SCREEN 01
                  </div>

                </div>


                {/* WEBSITE SCREENSHOT 02 */}
                <div className="border-2 border-black bg-white">

                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">

                    <Image
                      src="/TypographySpecimenISTD/GaramondWebsite2.jpg"
                      alt="Typography specimen website second screen"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 900px"
                    />

                  </div>

                  <div className="border-t-2 border-black px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest">
                    DIGITAL SPECIMEN // SCREEN 02
                  </div>

                </div>

                {/* WEBSITE SCREENSHOT 03 */}
                <div className="border-2 border-black bg-white">

                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">

                    <Image
                      src="/TypographySpecimenISTD/EgyptianWebsite1.jpg"
                      alt="Typography specimen website third screen"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 900px"
                    />

                  </div>

                  <div className="border-t-2 border-black px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest">
                    DIGITAL SPECIMEN // SCREEN 02
                  </div>
                </div>

                  {/* WEBSITE SCREENSHOT 04 */}
                <div className="border-2 border-black bg-white">

                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">

                    <Image
                      src="/TypographySpecimenISTD/EgyptianWebsite2.jpg"
                      alt="Typography specimen website fourth screen"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 900px"
                    />

                  </div>

                  <div className="border-t-2 border-black px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest">
                    DIGITAL SPECIMEN // SCREEN 04
                  </div>
                </div>
                

              </section>


              {/* ARCHIVE NOTE                            */}
              <section className="border-t-2 border-black pt-8 pb-6">

                <div className="bg-[#00f0ff] text-black border-2 border-black p-5 shadow-[6px_6px_0px_#000]">

                  <p className="font-mono text-[9px] font-black uppercase tracking-widest mb-2">
                    ARCHIVE NOTE
                  </p>

                  <p className="text-base font-bold leading-relaxed">
                    An exploration of typography as both information and visual
                    material — moving between structured specimen pages,
                    physical print and digital presentation.
                  </p>

                </div>

              </section>

            </div>

          </div>

        </div>

        {/* ========================================== */}
        {/* VISUAL ARCHIVE ARTEFACT C MANIFESTO DRAWER       */}
        {/* ========================================== */}
        <div
          className={`fixed inset-0 z-50 flex justify-start transition-all duration-700 ease-in-out ${
            expandedProject === 'manifesto'
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* BACKDROP */}
          <div
            onClick={() => setExpandedProject(null)}
            className="absolute inset-0 bg-gradient-to-tr from-[#ff00ff]/35 via-black/20 to-[#7000ff]/20 backdrop-blur-md"
          />

          {/* DRAWER */}
          <div
            className={`relative h-full w-full max-w-3xl border-r-4 border-black bg-[#fdfcf0] flex flex-col transition-transform duration-700 ease-in-out transform shadow-[10px_0px_0px_#ff00ff] ${
              expandedProject === 'manifesto'
                ? 'translate-x-0'
                : '-translate-x-full'
            }`}
          >
            {/* HEADER */}
            <div className="bg-white">
              <div className="p-6 flex justify-between items-center">
                <span className="font-mono text-xs font-bold bg-black text-[#ff00ff] px-2 py-0.5 tracking-widest">
                  VISUAL ARCHIVE // PERSONAL ETHOS
                </span>

                <button
                  onClick={() => setExpandedProject(null)}
                  className="border-2 border-black bg-white hover:bg-black hover:text-white px-2 py-1 font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  CLOSE_X
                </button>
              </div>

              {/* EXTRA BLACK DIVIDER */}
              <div className="border-t-4 border-black" />
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 font-sans">

              {/* PROJECT INTRO */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="font-mono text-[9px] font-black bg-[#ff00ff] text-black px-2 py-1">
                    2014
                  </span>

                  <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-1">
                    BA GRAPHIC DESIGN
                  </span>

                  <span className="font-mono text-[9px] font-black bg-[#f7f3e8] border border-black px-2 py-1">
                    PERSONAL ETHOS
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                  Manifesto
                </h2>

                <p className="font-mono text-xs text-[#ff00ff] font-bold mt-2">
                  PERSONAL ETHOS // PRINT + EXPERIMENTATION
                </p>
              </div>

              {/* 01 // THE BRIEF */}
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase border-b-2 border-black pb-1">
                  01 // THE BRIEF
                </h3>

                <p className="text-sm text-zinc-700 leading-relaxed text-justify">
                  The brief was to design an outcome that communicated personal
                  beliefs and work ethic. The project became a visual exploration
                  of the principles that informed my approach to design.
                </p>

                <div className="bg-white border-2 border-black p-5 shadow-[5px_5px_0px_#000]">
                  <p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#ff00ff] mb-3">
                    CORE ETHOS
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="border-2 border-black p-3 font-black uppercase">
                      TAKE RISKS
                    </div>

                    <div className="border-2 border-black p-3 font-black uppercase">
                      EXPERIMENT
                    </div>

                    <div className="border-2 border-black p-3 font-black uppercase">
                      MAKE MISTAKES
                    </div>

                    <div className="border-2 border-black p-3 font-black uppercase">
                      UTILISE MISTAKES
                    </div>
                  </div>
                </div>
              </div>

              {/* 02 // THE ETHOS */}
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase border-b-2 border-black pb-1">
                  02 // THE ETHOS
                </h3>

                <p className="text-sm text-zinc-700 leading-relaxed text-justify">
                  The concept challenged the idea that mistakes should simply be
                  corrected or hidden. Instead, mistakes became part of the visual
                  language of the work, allowing experimentation and controlled
                  failure to generate new forms.
                </p>
              </div>

              {/* 03 // GLITCH PROCESS */}
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase border-b-2 border-black pb-1">
                  03 // THE GLITCH PROCESS
                </h3>

                <p className="text-sm text-zinc-700 leading-relaxed text-justify">
                  The imagery was deliberately corrupted using a controlled glitch
                  process. JPEG script characters were replaced with the word
                  “mistake”, creating a visual progression in which increasing
                  levels of corruption altered the original image.
                </p>

                {/* WIDE GLITCH STRIP */}
                <div className="border-2 border-black bg-white shadow-[5px_5px_0px_#000] overflow-hidden">
                  <Image
                    src="/manifesto/MakeMistakes.jpg"
                    alt="Manifesto glitch process"
                    width={2048}
                    height={460}
                    className="w-full h-auto"
                  />
                </div>

                <div className="border-2 border-black bg-white shadow-[5px_5px_0px_#000] overflow-hidden">
                  <Image
                    src="/manifesto/UtiliseMistakes.jpg"
                    alt="Utilise mistakes glitch process"
                    width={2048}
                    height={460}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* 04 // THE CONCERTINA BOOK */}
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase border-b-2 border-black pb-1">
                  04 // THE CONCERTINA BOOK
                </h3>

                <p className="text-sm text-zinc-700 leading-relaxed text-justify">
                  The final outcomes were assembled into a series of concertina
                  books. The format allowed the viewer to see the transition from
                  the original image through increasingly damaged and corrupted
                  versions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="border-2 border-black bg-white shadow-[5px_5px_0px_#000]">
                    <Image
                      src="/manifesto/Manifesto1.jpg"
                      alt="Manifesto concertina book"
                      width={2048}
                      height={1365}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="border-2 border-black bg-white shadow-[5px_5px_0px_#000]">
                    <Image
                      src="/manifesto/Manifesto2.jpg"
                      alt="Manifesto books and concertina outcome"
                      width={1772}
                      height={1299}
                      className="w-full h-auto"
                    />
                  </div>

                </div>

                <div className="border-2 border-black bg-white shadow-[5px_5px_0px_#000]">
                  <Image
                    src="/manifesto/Manifesto7.jpg"
                    alt="Manifesto concertina book opened"
                    width={1772}
                    height={1181}
                    className="w-full h-auto"
                  />
                </div>

                <div className="border-2 border-black bg-white shadow-[5px_5px_0px_#000]">
                  <Image
                    src="/manifesto/Manifesto9.jpg"
                    alt="Manifesto printed books and pages"
                    width={1772}
                    height={1181}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* 05 // SELECTED OUTCOMES */}
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase border-b-2 border-black pb-1">
                  05 // SELECTED OUTCOMES
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="border-2 border-black bg-white">
                    <Image
                      src="/manifesto/Manifesto3.jpg"
                      alt="Manifesto book covers"
                      width={1772}
                      height={1181}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="border-2 border-black bg-white">
                    <Image
                      src="/manifesto/Manifesto4.jpg"
                      alt="Manifesto typography detail"
                      width={1772}
                      height={1181}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="border-2 border-black bg-white">
                    <Image
                      src="/manifesto/Manifesto12.jpg"
                      alt="Manifesto printed concertina outcome"
                      width={1772}
                      height={1181}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="border-2 border-black bg-white">
                    <Image
                      src="/manifesto/Manifesto13.jpg"
                      alt="Manifesto printed outcome detail"
                      width={1772}
                      height={1181}
                      className="w-full h-auto"
                    />
                  </div>

                </div>

                <div className="border-2 border-black bg-white">
                  <Image
                    src="/manifesto/Manifesto14.jpg"
                    alt="Manifesto concertina book viewed from above"
                    width={1772}
                    height={1181}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* 06 // LETTERPRESS + MATERIAL */}
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase border-b-2 border-black pb-1">
                  06 // LETTERPRESS + MATERIAL
                </h3>

                <p className="text-sm text-zinc-700 leading-relaxed text-justify">
                  Letterpress printing, laser printing, digital image manipulation
                  and book binding were combined to create the final physical
                  outcomes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="border-2 border-black bg-white shadow-[5px_5px_0px_#000]">
                    <Image
                      src="/manifesto/letterpress14.jpg"
                      alt="Manifesto letterpress printed page"
                      width={1772}
                      height={1181}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="border-2 border-black bg-white shadow-[5px_5px_0px_#000]">
                    <Image
                      src="/manifesto/letterpress1.jpg"
                      alt="Manifesto letterpress process"
                      width={1772}
                      height={1181}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="border-2 border-black bg-white shadow-[5px_5px_0px_#000]">
                    <Image
                      src="/manifesto/letterpress11.jpg"
                      alt="Manifesto letterpress printed spread"
                      width={1772}
                      height={1181}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="border-2 border-black bg-white shadow-[5px_5px_0px_#000]">
                    <Image
                      src="/manifesto/letterpress12.jpg"
                      alt="Manifesto experimental printed spread"
                      width={1772}
                      height={1181}
                      className="w-full h-auto"
                    />
                  </div>

                </div>
              </div>

              {/* PROCESS SUMMARY */}
              <div className="bg-black text-white p-5 border-2 border-black shadow-[6px_6px_0px_#ff00ff]">
                <p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#ff00ff] mb-3">
                  PROCESS // MATERIAL // OUTPUT
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 font-mono text-[10px] font-bold">
                  <span>PHOTOSHOP</span>
                  <span>INDESIGN</span>
                  <span>LETTERPRESS</span>
                  <span>LASER PRINTING</span>
                  <span>GLITCH TECHNIQUE</span>
                  <span>BOOK BINDING</span>
                </div>
              </div>

              {/* ARCHIVE NOTE */}
              <div className="pt-6 border-t-2 border-dashed border-zinc-300">
                <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                  Archive note // Earlier creative practice, BA Graphic Design,
                  2014. Preserved as part of the visual archive to show the
                  development of experimentation, print practice and visual
                  thinking that continues into later digital work.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* VISUAL ARCHIVE ARTEFACT D (STUDENT HANDBOOK DRAWER)  */}
        {/* ========================================== */}

        <div
          className={`fixed inset-0 z-50 flex justify-end transition-all duration-700 ease-in-out ${
            expandedProject === 'student-handbook'
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* BACKDROP */}
          <div
            onClick={() => setExpandedProject(null)}
            className="absolute inset-0 bg-gradient-to-bl from-[#7000ff]/35 via-black/20 to-[#7000ff]/20 backdrop-blur-md"
          />

          {/* DRAWER */}
          <div
            className={`absolute right-0 top-0 z-[100] h-full w-full max-w-3xl border-l-4 border-black bg-[#fdfcf0] flex flex-col transition-transform duration-700 ease-in-out transform shadow-[-10px_0px_0px_#000] ${
              expandedProject === 'student-handbook'
                ? 'translate-x-0'
                : 'translate-x-full'
            }`}
          >

            {/* HEADER */}
            <div className="p-6 border-b-4 border-black bg-white">

              <div className="flex justify-between items-start gap-6">

                <div>
                  <span className="font-mono text-xs font-bold bg-black text-[#7000ff] px-2 py-0.5">
                    VISUAL ARCHIVE // EARLY PRACTICE
                  </span>
                </div>

                <button
                  onClick={() => setExpandedProject(null)}
                  className="border-2 border-black bg-white hover:bg-black hover:text-white px-2 py-1 font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  CLOSE_X
                </button>

              </div>

              {/* EXTRA BLACK BORDER UNDER CLOSE AREA */}
              <div className="border-b-4 border-black mt-6" />

            </div>


            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-14 font-sans">

              {/* INTRO */}
              <section className="space-y-5">

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#7000ff] font-bold mb-3">
                    COLLEGE // FINAL MAJOR PROJECT
                  </p>

                  <h2 className="text-4xl sm:text-5xl text-[#7000ff] font-black uppercase tracking-tight leading-none">
                    Student Handbook
                  </h2>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-1">
                      DISTINCTION
                    </span>

                    <span className="font-mono text-[9px] font-black bg-[#7000ff] text-white px-2 py-1">
                      GRAPHIC DESIGN
                    </span>

                    <span className="font-mono text-[9px] font-black bg-white border-2 border-black px-2 py-1">
                      EDITORIAL SYSTEM
                    </span>
                  </div>

                  <p className="mt-5 text-base sm:text-lg font-bold leading-relaxed max-w-2xl">
                    A student handbook designed for international students,
                    combining editorial structure, photography, typography and
                    layered visual treatments into a cohesive information system.
                  </p>
                </div>

              </section>


              {/* 01 — VISUAL LANGUAGE */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <div>
                  <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest mb-2">
                    01 // VISUAL LANGUAGE
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    Information through image, type and colour.
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed text-justify">
                  The handbook combines photography, large-scale typography,
                  translucent colour blocks and repeated graphic structures to
                  organise a substantial amount of information without relying on
                  a conventional page hierarchy.
                </p>

                {/* FEATURE IMAGE */}
                <div className="border-2 border-black bg-white shadow-[6px_6px_0px_#000]">
                  <div className="relative w-full aspect-[16/10] overflow-hidden">
                    <Image
                      src="/FMP/CollegeFMP13.jpg"
                      alt="Student Handbook editorial spread"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 900px"
                    />
                  </div>

                  <div className="border-t-2 border-black px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest">
                    EDITORIAL SPREAD // INFORMATION SYSTEM
                  </div>
                </div>

              </section>


              {/* 02 — EDITORIAL SYSTEM */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <div>
                  <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest mb-2">
                    02 // EDITORIAL SYSTEM
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    Structured content without losing visual rhythm.
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <div className="border-2 border-black bg-white p-4">
                    <p className="font-mono text-[9px] font-black text-[#7000ff] uppercase tracking-widest mb-2">
                      INFORMATION
                    </p>

                    <p className="text-sm leading-relaxed text-zinc-700">
                      Content was organised into navigable sections using repeated
                      numbering, consistent typography and strong visual anchors.
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-4">
                    <p className="font-mono text-[9px] font-black text-[#7000ff] uppercase tracking-widest mb-2">
                      IMAGE
                    </p>

                    <p className="text-sm leading-relaxed text-zinc-700">
                      Photography was treated as part of the information structure,
                      rather than simply as supporting decoration.
                    </p>
                  </div>

                </div>

              </section>


              {/* 03 — SELECTED PAGES */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <div>
                  <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest mb-2">
                    03 // SELECTED PAGES
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    A small selection from the handbook.
                  </h3>
                </div>


                {/* COVERS / DETAILS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* COVER */}
                  <div className="border-2 border-black bg-white shadow-[4px_4px_0px_#000]">
                    <div className="relative w-full aspect-[4/5] overflow-hidden">
                      <Image
                        src="/FMP/CollegeFMP2.jpg"
                        alt="Student Handbook cover"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    <div className="border-t-2 border-black px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest">
                      COVER // FRONT
                    </div>
                  </div>


                  {/* COVER DETAIL */}
                  <div className="border-2 border-black bg-white shadow-[4px_4px_0px_#000]">
                    <div className="relative w-full aspect-[4/5] overflow-hidden">
                      <Image
                        src="/FMP/CollegeFMP9.jpg"
                        alt="Student Handbook cover detail"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    <div className="border-t-2 border-black px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest">
                      COVER // BACK
                    </div>
                  </div>

                </div>


                {/* FULL DOUBLE-PAGE SPREADS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* SPREAD 01 */}
                  <div className="border-2 border-black bg-white shadow-[4px_4px_0px_#000]">

                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#f5f2df]">
                      <Image
                        src="/FMP/CollegeFMP4.jpg"
                        alt="Student Handbook double-page spread"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    <div className="border-t-2 border-black px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest">
                      INTERIOR // SPREAD 01
                    </div>

                  </div>


                  {/* SPREAD 02 */}
                  <div className="border-2 border-black bg-white shadow-[4px_4px_0px_#000]">

                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#f5f2df]">
                      <Image
                        src="/FMP/CollegeFMP8.jpg"
                        alt="Student Handbook double-page spread"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    <div className="border-t-2 border-black px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest">
                      INTERIOR // SPREAD 02
                    </div>

                  </div>

                </div>


                {/* FINAL / BACK DOUBLE-PAGE SPREAD */}
                <div className="border-2 border-black bg-white shadow-[6px_6px_0px_#000]">

                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#f5f2df]">
                    <Image
                      src="/FMP/CollegeFMP6.jpg"
                      alt="Student Handbook back double-page spread"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 900px"
                    />
                  </div>

                  <div className="border-t-2 border-black px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest">
                    FINAL DOUBLE-PAGE SPREAD
                  </div>

                </div>

              </section>


              {/* 04 — TOOLS */}
              <section className="space-y-6 border-t-2 border-black pt-8">

                <div>
                  <p className="font-mono text-[10px] font-bold text-[#7000ff] uppercase tracking-widest mb-2">
                    04 // PROCESS &amp; TOOLS
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                    Physical and digital production.
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">

                  <span className="border-2 border-black bg-white px-3 py-2 font-mono text-[10px] font-black">
                    PHOTOSHOP
                  </span>

                  <span className="border-2 border-black bg-white px-3 py-2 font-mono text-[10px] font-black">
                    INDESIGN
                  </span>

                  <span className="border-2 border-black bg-white px-3 py-2 font-mono text-[10px] font-black">
                    TYPOGRAPHY
                  </span>

                  <span className="border-2 border-black bg-white px-3 py-2 font-mono text-[10px] font-black">
                    PHOTOGRAPHY
                  </span>

                  <span className="border-2 border-black bg-white px-3 py-2 font-mono text-[10px] font-black">
                    PRINT
                  </span>

                  <span className="border-2 border-black bg-white px-3 py-2 font-mono text-[10px] font-black">
                    EDITORIAL
                  </span>

                </div>

              </section>


              {/* ARCHIVE NOTE */}
              <section className="border-t-2 border-black pt-8 pb-6">

                <div className="bg-[#7000ff] text-white border-2 border-black p-5 shadow-[6px_6px_0px_#000]">

                  <p className="font-mono text-[9px] font-black uppercase tracking-widest mb-2 text-white/80">
                    ARCHIVE NOTE
                  </p>

                  <p className="text-base font-bold leading-relaxed">
                    An early example of the visual systems thinking that later became
                    part of my work across interface design, information architecture
                    and software development.
                  </p>

                </div>

              </section>

            </div>
          </div>
        </div>


      {/* ========================================== */}
      {/* 📬 SECURE CONTACT DRAWER                   */}
      {/* ========================================== */}
      <div
        className={`fixed inset-0 z-50 flex justify-end transition-all duration-700 ease-in-out ${isContactOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div
          onClick={() => setIsContactOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        <form
          onSubmit={handleContactSubmit}
          className={`relative h-full w-full max-w-md border-l-4 border-black bg-[#fdfcf0] p-8 flex flex-col justify-between transition-transform duration-700 ease-in-out transform shadow-[-10px_0px_0px_#000] ${isContactOpen ? 'translate-x-0' : 'translate-x-full'
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
            MESSAGE ➔
          </button>
        </form>
      </div>

    </div>
    
  );
}