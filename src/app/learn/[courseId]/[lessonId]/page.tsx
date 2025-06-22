"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames";
import { Play, ChevronLeft, ChevronRight, CheckCircle, Bookmark, FileText, Download, ExternalLink, Maximize2, Minimize2, BookOpen, Zap, Star } from "lucide-react";
import Editor from "@monaco-editor/react";

// --- Interfaces ---
interface LessonContent {
  type: 'video' | 'code' | 'quiz' | 'reading';
  content:
    | { url: string; title: string } // for video
    | { code: string; language: string; instructions: string } // for code
    | Quiz // for quiz
    | { html: string }; // for reading
  duration?: number;
  completed: boolean;
}

interface Quiz {
  questions: Question[];
  passingScore: number;
  attempts: number;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  answer: number;
  explanation?: string;
}

// --- Sample Data (replace with real fetch) ---
const sampleLessons: LessonContent[] = [
  {
    type: "video",
    content: {
      url: "https://www.youtube.com/embed/TDGq4aeevgY",
      title: "Ethereum: The Basics"
    },
    duration: 600,
    completed: false
  },
  {
    type: "code",
    content: {
      code: `// Solidity Example\npragma solidity ^0.8.0;\n\ncontract HelloWorld {\n    string public greet = "Hello Ethereum!";\n}`,
      language: "solidity",
      instructions: "Edit the contract and see output below."
    },
    duration: 900,
    completed: false
  },
  {
    type: "quiz",
    content: {
      questions: [
        {
          id: "q1",
          text: "What is the native cryptocurrency of Ethereum?",
          options: ["Bitcoin", "Ether", "Sol", "Doge"],
          answer: 1,
          explanation: "Ether (ETH) is the native asset of Ethereum."
        },
        {
          id: "q2",
          text: "What language is most commonly used for Ethereum smart contracts?",
          options: ["Rust", "Go", "Solidity", "Python"],
          answer: 2
        }
      ],
      passingScore: 2,
      attempts: 0
    },
    completed: false
  },
  {
    type: "reading",
    content: {
      html: `<h2>What is Ethereum?</h2><p>Ethereum is a decentralized platform...</p>`
    },
    duration: 600,
    completed: false
  }
];

const sidebarLessons = [
  { id: "1", title: "Ethereum: The Basics", type: "video", completed: false },
  { id: "2", title: "Hello World in Solidity", type: "code", completed: false },
  { id: "3", title: "Ethereum Quiz", type: "quiz", completed: false },
  { id: "4", title: "Introduction to Ethereum", type: "reading", completed: false }
];

const resources = [
  { label: "Official Docs", url: "https://ethereum.org/en/developers/docs/", icon: ExternalLink },
  { label: "Solidity Cheatsheet", url: "https://docs.soliditylang.org/en/v0.8.21/cheatsheet.html", icon: FileText },
  { label: "Download Slides", url: "#", icon: Download }
];

// --- Glass Button ---
function GlassButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={classNames(
        "backdrop-blur-md bg-white/10 border border-white/20 text-white font-semibold rounded-lg px-4 py-2 shadow transition hover:bg-blue-400/20 hover:scale-105 active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// --- Main Learning UI ---
export default function LearningPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [quizState, setQuizState] = useState<{ [q: string]: number | null }>({});
  const [quizResult, setQuizResult] = useState<null | { correct: number; total: number }>(null);
  const [notes, setNotes] = useState("");
  const [bookmark, setBookmark] = useState(false);
  const [codeValue, setCodeValue] = useState<string>(
    sampleLessons[1]?.type === "code" && typeof sampleLessons[1].content === "object" && "code" in sampleLessons[1].content
      ? sampleLessons[1].content.code
      : ""
  );
  const [codeOutput, setCodeOutput] = useState<string>("");

  // Video progress (persist to localStorage)
  const videoRef = useRef<HTMLIFrameElement | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") setLessonIdx((idx) => Math.max(0, idx - 1));
      if (e.key === "ArrowRight") setLessonIdx((idx) => Math.min(sampleLessons.length - 1, idx + 1));
      if (e.key === "f") setFullscreen(f => !f);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // --- Mark as Complete Handler ---
  function handleMarkComplete() {
    // Update the completed state for the current lesson
    sampleLessons[lessonIdx].completed = !sampleLessons[lessonIdx].completed;
    // Sync sidebar lesson completion
    if (sidebarLessons[lessonIdx]) {
      sidebarLessons[lessonIdx].completed = sampleLessons[lessonIdx].completed;
    }
    // Force re-render
    setLessonIdx(idx => idx);
  }

  // --- Render Lesson Content ---
  function renderContent(lesson: LessonContent) {
    switch (lesson.type) {
      case "video":
        return (
          <div className="relative w-full h-80 sm:h-[400px] rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-blue-900/40 to-purple-900/40">
            {"url" in lesson.content && "title" in lesson.content ? (
              <iframe
                ref={videoRef}
                src={lesson.content.url}
                title={lesson.content.title}
                className="w-full h-full"
                allowFullScreen
              />
            ) : null}
            <div className="absolute bottom-4 left-4 flex gap-3 items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl shadow">
              <GlassButton onClick={() => videoRef.current?.contentWindow?.postMessage('play', "*")}>
                <Play className="w-5 h-5" /> Play
              </GlassButton>
              <div className="text-xs text-white/80">Progress saved automatically</div>
            </div>
          </div>
        );
      case "code":
        return (
          <div className="flex flex-col gap-4 mb-6">
            <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/15 shadow-glass p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 font-semibold">Code Editor</span>
                <span className="text-xs text-cyan-400 font-mono">Solidity</span>
              </div>
              <Editor
                height="250px"
                defaultLanguage="solidity"
                value={codeValue}
                theme="vs-dark"
                onChange={v => setCodeValue(v || "")}
                options={{
                  fontSize: 16,
                  minimap: { enabled: false },
                  fontFamily: "Fira Mono, monospace",
                  formatOnType: true,
                  formatOnPaste: true,
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  lineNumbers: "on"
                }}
              />
              <div className="flex mt-3 gap-2">
                <GlassButton onClick={() => setCodeOutput("/* Output (mock): Contract compiled successfully! */")}>
                  <Zap className="w-4 h-4 mr-1" /> Run Code
                </GlassButton>
                <GlassButton onClick={() => setCodeValue(
                  sampleLessons[1]?.type === "code" && typeof sampleLessons[1].content === "object" && "code" in sampleLessons[1].content
                    ? sampleLessons[1].content.code
                    : ""
                )} className="ml-2">
                  Reset
                </GlassButton>
              </div>
              <div className="bg-white/10 rounded-xl mt-3 p-3 text-green-400 font-mono min-h-[32px]">
                {codeOutput}
              </div>
            </div>
          </div>
        );
      case "quiz":
        const quiz: Quiz = lesson.content as Quiz;
        const correct = quiz.questions.filter(q => quizState[q.id] === q.answer).length;
        return (
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-glass p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Quiz</h3>
            {quizResult ? (
              <div>
                <div className="text-lg text-white mb-2">
                  <Star className="inline text-yellow-400" /> You scored {correct}/{quiz.questions.length}
                </div>
                <div className={correct >= quiz.passingScore ? "text-green-400" : "text-red-400"}>
                  {correct >= quiz.passingScore ? "Passed! 🎉" : "Try again to pass."}
                </div>
                <GlassButton className="mt-4" onClick={() => { setQuizState({}); setQuizResult(null); }}>
                  Retry Quiz
                </GlassButton>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setQuizResult({ correct, total: quiz.questions.length });
                }}
              >
                {quiz.questions.map((q, idx) => (
                  <div key={q.id} className="mb-4">
                    <div className="text-white font-semibold mb-2">{idx + 1}. {q.text}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((o, i) => (
                        <GlassButton
                          key={i}
                          type="button"
                          className={classNames(
                            "block w-full text-left",
                            quizState[q.id] === i && "bg-blue-400/30 border-blue-400 text-white"
                          )}
                          onClick={() => setQuizState(s => ({ ...s, [q.id]: i }))}
                        >
                          {o}
                        </GlassButton>
                      ))}
                    </div>
                    {quizResult && quizState[q.id] !== q.answer && quizState[q.id] !== undefined && (
                      <div className="text-xs text-red-400 mt-1">Incorrect. {q.explanation}</div>
                    )}
                  </div>
                ))}
                <GlassButton className="mt-2" type="submit">Submit Quiz</GlassButton>
              </form>
            )}
          </div>
        );
      case "reading":
        return (
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-glass p-6 mb-6 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: (lesson.content as { html: string }).html }}
          />
        );
      default:
        return null;
    }
  }

  // --- Sidebar ---
  function renderSidebar() {
    return (
      <motion.aside
        initial={{ x: 0 }}
        animate={{ x: sidebarOpen ? 0 : 350 }}
        transition={{ type: "tween", duration: 0.4 }}
        className={classNames(
          "relative w-full max-w-xs min-w-[260px] bg-white/10 backdrop-blur-xl border-r border-white/10 h-full flex flex-col transition-all duration-300",
          !sidebarOpen && "hidden sm:block"
        )}
      >
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-md font-bold text-white mb-2">Progress</h3>
            <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${((lessonIdx + 1) / sampleLessons.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full shadow-glass"
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex text-xs text-cyan-200 mt-1 justify-between">
              <span>Lesson {lessonIdx + 1}</span>
              <span>{Math.round(((lessonIdx + 1) / sampleLessons.length) * 100)}%</span>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-md font-bold text-white mb-2">Lessons</h3>
            <ul className="flex flex-col gap-2">
              {sidebarLessons.map((l, idx) => (
                <li key={l.id}>
                  <GlassButton
                    className={classNames(
                      "w-full flex justify-between items-center",
                      idx === lessonIdx && "bg-blue-400/30 border-blue-400"
                    )}
                    onClick={() => setLessonIdx(idx)}
                  >
                    <span className="flex items-center gap-2">
                      {l.type === "video" && <Play className="w-4 h-4 text-cyan-400" />}
                      {l.type === "code" && <BookOpen className="w-4 h-4 text-purple-400" />}
                      {l.type === "quiz" && <Star className="w-4 h-4 text-yellow-400" />}
                      {l.type === "reading" && <FileText className="w-4 h-4 text-blue-300" />}
                      {l.title}
                    </span>
                    {l.completed && <CheckCircle className="w-4 h-4 text-green-400" />}
                  </GlassButton>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="text-md font-bold text-white mb-2">Notes</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full h-24 rounded-xl bg-white/10 border border-white/15 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Take notes here..."
            />
            <div className="text-xs text-white/60 mt-1">Notes saved locally.</div>
          </div>
          <div>
            <h3 className="text-md font-bold text-white mb-2">Resources</h3>
            <ul className="flex flex-col gap-1">
              {resources.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-blue-400/20 border border-white/10 text-white transition"
                  >
                    <r.icon className="w-4 h-4" /> {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          className="absolute top-2 -right-3 bg-blue-400/80 text-white rounded-full shadow-glass w-8 h-8 flex items-center justify-center z-10 ring-2 ring-white/40"
          onClick={() => setSidebarOpen((s) => !s)}
        >
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </motion.aside>
    );
  }

  // --- Bottom Action Bar ---
  function renderActionBar() {
    return (
      <div className="fixed bottom-0 left-0 w-full z-40 px-0 sm:px-8 pb-4 pointer-events-none">
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          className="mx-auto max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-glass border border-white/20 px-4 py-3 flex items-center justify-between gap-3 pointer-events-auto"
        >
          <div className="flex gap-2">
            <GlassButton
              disabled={lessonIdx === 0}
              onClick={() => setLessonIdx(idx => Math.max(0, idx - 1))}
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </GlassButton>
            <GlassButton
              disabled={lessonIdx === sampleLessons.length - 1}
              onClick={() => setLessonIdx(idx => Math.min(sampleLessons.length - 1, idx + 1))}
            >
              Next <ChevronRight className="w-5 h-5" />
            </GlassButton>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1 text-white/80 cursor-pointer">
              <input
                type="checkbox"
                className="accent-blue-400"
                checked={sampleLessons[lessonIdx].completed}
                onChange={handleMarkComplete}
              />
              Mark as complete
            </label>
            <GlassButton onClick={() => setBookmark(b => !b)} className={bookmark ? "bg-purple-500/40" : ""}>
              <Bookmark className="w-5 h-5" />
            </GlassButton>
            <GlassButton>
              <span className="hidden sm:inline">1x</span>
            </GlassButton>
            <GlassButton>
              <span className="hidden sm:inline">HD</span>
            </GlassButton>
            <GlassButton onClick={() => setFullscreen(f => !f)}>
              {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </GlassButton>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div
      className={classNames(
        "flex min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-950 to-black pt-20", // <-- Added pt-20 here
        fullscreen && "fixed inset-0 z-50"
      )}
    >
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="hidden sm:block h-full sticky top-0 min-h-screen">
          {renderSidebar()}
        </div>
      )}
      {/* Main Content */}
      <main
        className={classNames(
          "flex-1 flex flex-col items-center min-h-screen transition-all duration-300",
          sidebarOpen ? "sm:ml-0" : ""
        )}
      >
        <div className="max-w-3xl w-full px-2 sm:px-8 py-8">
          {renderContent(sampleLessons[lessonIdx])}
        </div>
      </main>
      {/* Sidebar Drawer for Mobile */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            className="fixed top-20 left-2 z-50 bg-blue-400/80 text-white rounded-full shadow w-10 h-10 flex items-center justify-center"
            onClick={() => setSidebarOpen(true)}
          >
            <ChevronRight />
          </motion.button>
        )}
      </AnimatePresence>
      {/* Bottom Action Bar */}
      {renderActionBar()}
    </div>
  );
}