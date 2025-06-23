"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle, PlayCircle, BookOpen, Clock, User, Bookmark, Share2, X } from "lucide-react";
import classNames from "classnames";
import Link from "next/link";

// --- DATA STRUCTURES ---

type TabName = "Overview" | "Curriculum" | "Instructor" | "Reviews";

interface Instructor {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  credentials: string[];
  otherCourses: { id: string; title: string }[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "quiz" | "reading";
  completed?: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Review {
  id: string;
  user: { name: string; avatar: string };
  rating: number;
  date: string;
  content: string;
}

interface RelatedInstructor {
  name: string;
}

interface RelatedCourse {
  id: string;
  title: string;
  instructor: RelatedInstructor;
  rating: number;
  banner: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  duration: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: Instructor;
  price: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  reviewCount: number;
  curriculum: Module[];
  prerequisites: string[];
  learningOutcomes: string[];
  banner: string;
  videoPreview: string;
  reviews: Review[];
  related: RelatedCourse[];
}

// --- SAMPLE DATA ---

const sampleCourse: Course = {
  id: "eth-fundamentals",
  title: "Ethereum Fundamentals",
  description: "Master the basics of Ethereum, wallets, transactions, and smart contracts in this comprehensive beginner course.",
  instructor: {
    id: "alice-smith",
    name: "Alice Smith",
    bio: "Blockchain educator and Ethereum developer with 8+ years of experience. Alice has taught 10,000+ students worldwide and contributed to multiple open-source projects.",
    avatar: "/images/instructors/alice.jpg",
    credentials: ["PhD in Computer Science", "Certified Ethereum Developer", "Author: 'Intro to Smart Contracts'"],
    otherCourses: [
      { id: "smart-contract-dev", title: "Smart Contract Development" },
      { id: "web3-security-audit", title: "Web3 Security Auditing" },
    ],
  },
  price: 0,
  duration: "4h",
  level: "Beginner",
  rating: 4.7,
  reviewCount: 124,
  curriculum: [
    {
      id: "module1",
      title: "Introduction to Ethereum",
      lessons: [
        { id: "l1", title: "Welcome & Course Overview", duration: "5m", type: "video", completed: true },
        { id: "l2", title: "Ethereum Basics", duration: "15m", type: "video", completed: true },
        { id: "l3", title: "Wallets and Addresses", duration: "18m", type: "reading", completed: false },
      ],
    },
    {
      id: "module2",
      title: "Smart Contracts",
      lessons: [
        { id: "l4", title: "What is a Smart Contract?", duration: "12m", type: "video", completed: false },
        { id: "l5", title: "Writing Your First Smart Contract", duration: "30m", type: "video", completed: false },
        { id: "l6", title: "Smart Contract Security", duration: "10m", type: "quiz", completed: false },
      ],
    },
  ],
  prerequisites: ["Basic programming knowledge", "Interest in blockchain"],
  learningOutcomes: [
    "Understand Ethereum's architecture",
    "Create and manage wallets",
    "Deploy simple smart contracts",
    "Recognize key security concepts"
  ],
  banner: "/images/courses/eth-fundamentals.jpg",
  videoPreview: "https://www.youtube.com/embed/TDGq4aeevgY",
  reviews: [
    {
      id: "r1",
      user: { name: "John Doe", avatar: "/images/users/user1.jpg" },
      rating: 5,
      date: "2025-05-10",
      content: "Fantastic introduction to Ethereum! The hands-on examples made it easy to follow.",
    },
    {
      id: "r2",
      user: { name: "Priya Patel", avatar: "/images/users/user2.jpg" },
      rating: 4,
      date: "2025-06-01",
      content: "Great teacher and clear explanations. Loved the real-world projects.",
    },
  ],
  related: [
    {
      id: "smart-contract-dev",
      title: "Smart Contract Development",
      instructor: { name: "Bob Lee" },
      rating: 4.8,
      banner: "/images/courses/smart-contract-dev.jpg",
      level: "Intermediate",
      price: 99,
      duration: "12h",
    },
    {
      id: "defi-protocol-design",
      title: "DeFi Protocol Design",
      instructor: { name: "Cynthia Wu" },
      rating: 4.9,
      banner: "/images/courses/defi-protocol-design.jpg",
      level: "Advanced",
      price: 199,
      duration: "20h",
    },
    {
      id: "nft-marketplace",
      title: "NFT Marketplace Creation",
      instructor: { name: "David Kim" },
      rating: 4.6,
      banner: "/images/courses/nft-marketplace.jpg",
      level: "Intermediate",
      price: 149,
      duration: "16h",
    },
  ],
};

// --- UI COMPONENTS ---

function GlassButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={classNames(
        "backdrop-blur-md bg-white/10 border border-white/20 text-white font-semibold rounded-lg px-6 py-3 shadow-glass transition hover:bg-blue-400/20 hover:scale-105 active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function LevelBadge({ level }: { level: Course["level"] }) {
  const color =
    level === "Beginner"
      ? "bg-cyan-400/40 text-cyan-200"
      : level === "Intermediate"
      ? "bg-purple-400/40 text-purple-200"
      : "bg-blue-400/40 text-blue-200";
  return (
    <span className={classNames("rounded px-2 py-0.5 text-xs font-bold", color)}>
      {level}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  const stars = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < stars ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}
        />
      ))}
      <span className="ml-1 text-xs text-white/70">{rating.toFixed(1)}</span>
    </div>
  );
}

// --- MAIN PAGE ---

export default function CoursePage() {
  const [tab, setTab] = useState<TabName>("Overview");
  const [curriculumOpen, setCurriculumOpen] = useState<string[]>([sampleCourse.curriculum[0].id]);
  const [showVideo, setShowVideo] = useState(false);
  const [showEnroll, setShowEnroll] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  function toggleModule(moduleId: string) {
    setCurriculumOpen((prev) =>
      prev.includes(moduleId) ? prev.filter((m) => m !== moduleId) : [...prev, moduleId]
    );
  }

  // Progress tracking: mock as completed if lesson.completed === true
  function isLessonCompleted(lesson: Lesson) {
    return !!lesson.completed;
  }

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative pb-16 pt-20">
      {/* Banner + Hero */}
      <section className="relative">
        <div className="relative w-full h-72 sm:h-96">
          <Image
            src={sampleCourse.banner}
            alt={sampleCourse.title}
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-blue-900/40 to-purple-900/40" />
          {/* Glass overlay */}
          <div className="absolute inset-x-0 bottom-0 px-4 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto mt-[-4rem] sm:mt-[-6rem] p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-glass flex flex-col sm:flex-row gap-8 items-center"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    src={sampleCourse.instructor.avatar}
                    alt={sampleCourse.instructor.name}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-blue-400"
                  />
                  <span className="text-sm text-white/80">by {sampleCourse.instructor.name}</span>
                  <StarRating rating={sampleCourse.rating} />
                  <span className="text-xs text-white/60">({sampleCourse.reviewCount} reviews)</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {sampleCourse.title}
                </h1>
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span className="backdrop-blur-md bg-white/10 text-sm px-2 py-1 rounded font-semibold border border-white/20">
                    {sampleCourse.price === 0 ? "Free" : `$${sampleCourse.price}`}
                  </span>
                  <span className="backdrop-blur-md bg-white/10 text-sm px-2 py-1 rounded font-semibold border border-white/20">
                    <Clock className="inline w-4 h-4 mr-1 -mt-1" /> {sampleCourse.duration}
                  </span>
                  <LevelBadge level={sampleCourse.level} />
                </div>
                <div className="flex gap-2 mt-2">
                  <GlassButton onClick={() => setShowEnroll(true)} className="text-lg px-8 py-3">
                    Enroll Now
                  </GlassButton>
                  <GlassButton
                    type="button"
                    aria-label="Preview course video"
                    className="flex items-center gap-2"
                    onClick={() => setShowVideo(true)}
                  >
                    <PlayCircle className="w-5 h-5" /> Preview
                  </GlassButton>
                  <GlassButton
                    type="button"
                    aria-label="Bookmark course"
                    className={bookmarked ? "bg-purple-500/40" : ""}
                    onClick={() => setBookmarked((b) => !b)}
                  >
                    <Bookmark className="w-5 h-5" />
                  </GlassButton>
                  <GlassButton type="button">
                    <Share2 className="w-5 h-5" />
                  </GlassButton>
                </div>
              </div>
              {/* Desktop Curriculum Sidebar */}
              <div className="hidden lg:block w-80">
                <motion.div
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-glass p-5"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">Curriculum</h3>
                  <ul className="divide-y divide-white/10">
                    {sampleCourse.curriculum.map((mod) => (
                      <li key={mod.id} className="py-2">
                        <button
                          className="flex items-center justify-between w-full text-left text-white/90 font-medium hover:text-blue-400 transition"
                          onClick={() => toggleModule(mod.id)}
                        >
                          <span>
                            {mod.title}
                            <span className="ml-2 text-xs text-white/50">({mod.lessons.length} lessons)</span>
                          </span>
                          <span>
                            {curriculumOpen.includes(mod.id) ? "–" : "+"}
                          </span>
                        </button>
                        <AnimatePresence>
                          {curriculumOpen.includes(mod.id) && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pl-3 mt-2"
                            >
                              {mod.lessons.map((lesson) => (
                                <Link
                                  key={lesson.id}
                                  href={`/learn/${sampleCourse.id}/${lesson.id}`}
                                  className="flex items-center gap-2 py-1 group hover:bg-blue-400/10 rounded transition"
                                >
                                  {lesson.type === "video" && <PlayCircle className="w-4 h-4 text-cyan-400" />}
                                  {lesson.type === "quiz" && <BookOpen className="w-4 h-4 text-purple-400" />}
                                  {lesson.type === "reading" && <User className="w-4 h-4 text-blue-400" />}
                                  <span className="text-white/80 text-sm flex-1">{lesson.title}</span>
                                  <span className="text-xs text-white/50">{lesson.duration}</span>
                                  {isLessonCompleted(lesson) && <CheckCircle className="w-4 h-4 text-green-400" />}
                                </Link>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content: Tabs & Curriculum Accordion (mobile/tablet) */}
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10">
        {/* Mobile/Tablet Curriculum Accordion */}
        <div className="lg:hidden mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-glass p-5">
            <h3 className="text-lg font-semibold text-white mb-3">Curriculum</h3>
            <ul className="divide-y divide-white/10">
              {sampleCourse.curriculum.map((mod) => (
                <li key={mod.id} className="py-2">
                  <button
                    className="flex items-center justify-between w-full text-left text-white/90 font-medium hover:text-blue-400 transition"
                    onClick={() => toggleModule(mod.id)}
                  >
                    <span>
                      {mod.title}
                      <span className="ml-2 text-xs text-white/50">({mod.lessons.length} lessons)</span>
                    </span>
                    <span>
                      {curriculumOpen.includes(mod.id) ? "–" : "+"}
                    </span>
                  </button>
                  <AnimatePresence>
                    {curriculumOpen.includes(mod.id) && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-3 mt-2"
                      >
                        {mod.lessons.map((lesson) => (
                          <Link
                            key={lesson.id}
                            href={`/learn/${sampleCourse.id}/${lesson.id}`}
                            className="flex items-center gap-2 py-1 group hover:bg-blue-400/10 rounded transition"
                          >
                            {lesson.type === "video" && <PlayCircle className="w-4 h-4 text-cyan-400" />}
                            {lesson.type === "quiz" && <BookOpen className="w-4 h-4 text-purple-400" />}
                            {lesson.type === "reading" && <User className="w-4 h-4 text-blue-400" />}
                            <span className="text-white/80 text-sm flex-1">{lesson.title}</span>
                            <span className="text-xs text-white/50">{lesson.duration}</span>
                            {isLessonCompleted(lesson) && <CheckCircle className="w-4 h-4 text-green-400" />}
                          </Link>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Tabs Panel */}
        <div className="flex-1 min-w-0">
          {/* Glass Tabs */}
          <div className="flex gap-3 mb-7">
            {(["Overview", "Curriculum", "Instructor", "Reviews"] as TabName[]).map((tabName) => (
              <button
                key={tabName}
                onClick={() => setTab(tabName)}
                className={classNames(
                  "px-5 py-2 rounded-xl font-bold transition-all",
                  tab === tabName
                    ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 text-white shadow-glass"
                    : "bg-white/10 text-white/80 border border-white/10 backdrop-blur-md"
                )}
              >
                {tabName}
              </button>
            ))}
          </div>
          {/* Tab Panels */}
          <div>
            {tab === "Overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-white/90 text-lg mb-5">{sampleCourse.description}</p>
                <h4 className="text-md text-cyan-300 font-semibold mb-2">What you will learn</h4>
                <ul className="mb-5 pl-5 list-disc text-white/80">
                  {sampleCourse.learningOutcomes.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <h4 className="text-md text-purple-300 font-semibold mb-2">Prerequisites</h4>
                <ul className="pl-5 list-disc text-white/80">
                  {sampleCourse.prerequisites.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            )}
            {tab === "Curriculum" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {sampleCourse.curriculum.map((mod) => (
                  <div key={mod.id} className="mb-6">
                    <h5 className="text-white/90 font-semibold mb-2">{mod.title}</h5>
                    <ul className="divide-y divide-white/10 rounded-lg bg-white/5">
                      {mod.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/learn/${sampleCourse.id}/${lesson.id}`}
                          className="flex items-center gap-2 py-2 px-3 group hover:bg-blue-400/10 rounded transition"
                        >
                          {lesson.type === "video" && <PlayCircle className="w-4 h-4 text-cyan-400" />}
                          {lesson.type === "quiz" && <BookOpen className="w-4 h-4 text-purple-400" />}
                          {lesson.type === "reading" && <User className="w-4 h-4 text-blue-400" />}
                          <span className="text-white/80 text-sm flex-1">{lesson.title}</span>
                          <span className="text-xs text-white/50">{lesson.duration}</span>
                          {isLessonCompleted(lesson) && <CheckCircle className="w-4 h-4 text-green-400" />}
                        </Link>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            )}
            {tab === "Instructor" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-start gap-5 mb-3">
                  <Image
                    src={sampleCourse.instructor.avatar}
                    alt={sampleCourse.instructor.name}
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-blue-400"
                  />
                  <div>
                    <h4 className="text-white text-xl font-bold mb-1">{sampleCourse.instructor.name}</h4>
                    <div className="text-white/80 mb-2">{sampleCourse.instructor.bio}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {sampleCourse.instructor.credentials.map((c, idx) => (
                        <span key={idx} className="bg-purple-400/30 text-purple-100 text-xs px-2 py-1 rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                    <div>
                      <span className="text-white/70 text-sm">Other courses: </span>
                      {sampleCourse.instructor.otherCourses.map((oc, idx) => (
                        <span key={oc.id} className="text-cyan-300 text-sm ml-1">
                          {oc.title}
                          {idx < sampleCourse.instructor.otherCourses.length - 1 && ","}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {tab === "Reviews" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-5">
                  <h4 className="text-white font-semibold mb-3">Student Reviews</h4>
                  <div className="flex flex-col gap-4">
                    {sampleCourse.reviews.map((r) => (
                      <div
                        key={r.id}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start"
                      >
                        <Image
                          src={r.user.avatar}
                          alt={r.user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white/90">{r.user.name}</span>
                            <StarRating rating={r.rating} />
                            <span className="text-xs text-white/60">{r.date}</span>
                          </div>
                          <div className="text-white/80">{r.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Review submission (mocked) */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 mt-8">
                  <h5 className="text-white/80 font-semibold mb-2">Submit your review</h5>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Review submitted! (Mock)");
                    }}
                    className="flex flex-col gap-2"
                  >
                    <label className="text-white/60 text-sm">Rating</label>
                    <select className="rounded-md px-3 py-1 bg-white/10 text-white border border-white/20 w-28">
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>{r} Stars</option>
                      ))}
                    </select>
                    <textarea
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 mt-2"
                      rows={3}
                      placeholder="Write your review..."
                    />
                    <GlassButton className="mt-2 self-end">Submit</GlassButton>
                  </form>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Related Courses */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-white mb-6">Students also viewed</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleCourse.related.map((rc) => (
            <motion.div
              key={rc.id}
              whileHover={{ scale: 1.04 }}
              className="rounded-2xl bg-white/10 backdrop-blur-md shadow-glass border border-white/15 flex flex-col cursor-pointer transition-all relative overflow-hidden"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={rc.banner}
                  alt={rc.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h4 className="font-bold text-lg text-white mb-1 line-clamp-2">{rc.title}</h4>
                <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
                  <span>by {rc.instructor.name}</span>
                </div>
                <StarRating rating={rc.rating} />
                <div className="flex gap-2 mt-2 mb-4 flex-wrap">
                  <span className="backdrop-blur-md bg-white/10 text-xs px-2 py-0.5 rounded-full font-semibold">
                    {rc.price === 0 ? "Free" : `$${rc.price}`}
                  </span>
                  <span className="backdrop-blur-md bg-white/10 text-xs px-2 py-0.5 rounded-full font-semibold">
                    {rc.duration}
                  </span>
                  <LevelBadge level={rc.level} />
                </div>
                <GlassButton className="mt-auto w-full">View Course</GlassButton>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- VIDEO PREVIEW MODAL --- */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          >
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-2xl shadow-glass border border-white/20">
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-2 right-2 px-2 py-1 text-white/70 hover:text-white rounded"
              >
                <X className="w-7 h-7" />
              </button>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={sampleCourse.videoPreview}
                  title="Course Preview"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ENROLL MODAL --- */}
      <AnimatePresence>
        {showEnroll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          >
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-7 w-full max-w-lg shadow-glass border border-white/20">
              <button
                onClick={() => setShowEnroll(false)}
                className="absolute top-2 right-2 px-2 py-1 text-white/70 hover:text-white rounded"
              >
                <X className="w-7 h-7" />
              </button>
              <h3 className="text-2xl font-bold text-white mb-4">
                Enroll in {sampleCourse.title}
              </h3>
              <div className="mb-4">
                <span className="backdrop-blur-md bg-white/10 text-sm px-2 py-1 rounded font-semibold border border-white/20">
                  {sampleCourse.price === 0 ? "Free" : `$${sampleCourse.price}`}
                </span>
                <span className="ml-2 text-white/80">• Lifetime access</span>
                <span className="ml-2 text-white/80">• Certificate on completion</span>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowEnroll(false);
                  alert("Enrolled! (Mock)");
                }}
                className="flex flex-col gap-4"
              >
                {sampleCourse.price !== 0 && (
                  <>
                    <label className="text-white/80 font-semibold">Payment Method</label>
                    <select className="rounded-md px-3 py-2 bg-white/10 text-white border border-white/20">
                      <option>Credit Card</option>
                      <option>MetaMask / Crypto</option>
                      <option>PayPal</option>
                    </select>
                  </>
                )}
                <GlassButton className="mt-2 w-full">
                  {sampleCourse.price === 0 ? "Get Free Access" : "Enroll & Pay"}
                </GlassButton>
                <div className="text-xs text-white/60 mt-2">
                  By enrolling, you agree to our Terms and Privacy Policy.
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}