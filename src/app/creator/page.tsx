"use client";
import React, { useState } from "react";
import { Pencil, Trash2, Plus, X, BookOpen, PlayCircle, FileText } from "lucide-react";
import classNames from "classnames";
import { motion } from "framer-motion"; // Add this import at the top

// --- Glass Components ---
function GlassButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={classNames(
        "backdrop-blur-md bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/20 text-black dark:text-white font-semibold rounded-lg px-4 py-2 shadow transition hover:bg-blue-400/20 hover:scale-105 active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
function GlassInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg px-4 py-2 bg-white/30 dark:bg-white/5 backdrop-blur-md text-black dark:text-white placeholder-black/40 dark:placeholder-white/50 border border-black/10 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    />
  );
}
function GlassTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-lg px-4 py-2 bg-white/30 dark:bg-white/5 backdrop-blur-md text-black dark:text-white placeholder-black/40 dark:placeholder-white/50 border border-black/10 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    />
  );
}

// --- Dropdown options ---
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const CATEGORIES = [
  "Blockchain", "DeFi", "NFTs", "Smart Contracts", "Security", "Development", "Other"
];

// Replace your GlassCard definition with this (or import from a shared location if possible)
function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={classNames(
        "rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-glass p-6",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// --- Modal ---
function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: React.ReactNode; title: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/40 backdrop-blur-sm">
      <GlassCard
        className="fixed top-28 left-1/2 -translate-x-1/2 w-full max-w-2xl p-0 animate-modal-in
        max-h-[80vh] overflow-y-auto flex flex-col bg-white/10 dark:bg-white/10 rounded-2xl shadow-xl border border-white/20"
      >
        <div className="relative p-6 md:p-8">
          <button
            className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">{title}</h3>
          {children}
        </div>
      </GlassCard>
    </div>
  );
}

// --- Types ---
type Lesson = {
  title: string;
  duration: string;
  type: "video" | "quiz" | "reading";
};
type Module = {
  title: string;
  lessons: Lesson[];
};
type Course = {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  cover: string;
  video: string;
  tags: string[];
  price: string;
  duration: string;
  level: string;
  category: string;
  instructor: {
    name: string;
    bio: string;
    avatar: string;
    credentials: string;
  };
  curriculum: Module[];
  learningOutcomes: string[];
  prerequisites: string[];
  status: "Pending" | "Approved" | "Rejected";
  feedback: string;
};

const initialCourses: Course[] = [
  {
    id: "1",
    title: "Ethereum for Beginners",
    shortDesc: "A gentle intro to Ethereum.",
    longDesc: "Learn the basics of Ethereum, wallets, and transactions.",
    cover: "/images/courses/eth-fundamentals.jpg",
    video: "https://youtube.com/embed/TDGq4aeevgY",
    tags: ["Beginner", "Ethereum"],
    price: "0",
    duration: "4h",
    level: "Beginner",
    category: "Blockchain",
    instructor: {
      name: "Ayu Shetty",
      bio: "Web3 Educator",
      avatar: "/images/profile.jpg",
      credentials: "PhD, Blockchain",
    },
    curriculum: [
      {
        title: "Introduction",
        lessons: [
          { title: "What is Ethereum?", duration: "10m", type: "video" },
          { title: "Wallet Setup", duration: "15m", type: "reading" },
        ],
      },
    ],
    learningOutcomes: ["Understand Ethereum basics", "Set up a wallet"],
    prerequisites: ["Basic computer skills"],
    status: "Pending",
    feedback: "",
  },
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function CreatorDashboard() {
  // --- State ---
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // --- Form State ---
  const [form, setForm] = useState({
    title: "",
    shortDesc: "",
    longDesc: "",
    cover: "",
    video: "",
    tags: "",
    price: "",
    duration: "",
    level: "Beginner",
    category: "",
    instructor: {
      name: "",
      bio: "",
      avatar: "",
      credentials: "",
    },
    curriculum: [] as Module[],
    learningOutcomes: [] as string[],
    prerequisites: [] as string[],
    coverFile: null as File | null,
    instructorAvatarFile: null as File | null,
  });
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [instructorAvatarPreview, setInstructorAvatarPreview] = useState<string>("");

  // --- Curriculum Builder State ---
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [lessonType, setLessonType] = useState<"video" | "quiz" | "reading">("video");
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  // --- Outcomes/Prerequisites State ---
  const [outcomeInput, setOutcomeInput] = useState("");
  const [prereqInput, setPrereqInput] = useState("");

  // --- Handlers ---
  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name.startsWith("instructor.")) {
      setForm(f => ({
        ...f,
        instructor: { ...f.instructor, [name.split(".")[1]]: value },
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }
  function handleTagInput(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, tags: e.target.value }));
  }
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files[0]) {
      setForm(f => ({ ...f, coverFile: files[0] }));
      setCoverPreview(URL.createObjectURL(files[0]));
    }
  }
  function handleInstructorAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files[0]) {
      setForm(f => ({ ...f, instructorAvatarFile: files[0] }));
      setInstructorAvatarPreview(URL.createObjectURL(files[0]));
    }
  }
  function handleModalOpen() {
    setForm({
      title: "",
      shortDesc: "",
      longDesc: "",
      cover: "",
      video: "",
      tags: "",
      price: "",
      duration: "",
      level: "Beginner",
      category: "",
      instructor: {
        name: "",
        bio: "",
        avatar: "",
        credentials: "",
      },
      curriculum: [],
      learningOutcomes: [],
      prerequisites: [],
      coverFile: null,
      instructorAvatarFile: null,
    });
    setCoverPreview("");
    setInstructorAvatarPreview("");
    setEditIndex(null);
    setModalOpen(true);
  }
  function handleEdit(index: number) {
    const course = courses[index];
    setForm({
      ...course,
      tags: course.tags.join(", "),
      coverFile: null,
      instructorAvatarFile: null,
    });
    setCoverPreview(course.cover);
    setInstructorAvatarPreview(course.instructor.avatar);
    setEditIndex(index);
    setModalOpen(true);
  }
  function handleDelete(index: number) {
    setCourses(courses.filter((_, i) => i !== index));
  }
  function handleAddModule() {
    if (!moduleTitle.trim()) return;
    setForm(f => ({
      ...f,
      curriculum: [...f.curriculum, { title: moduleTitle, lessons: [] }],
    }));
    setModuleTitle("");
  }
  function handleAddLesson() {
    if (selectedModule === null || !lessonTitle.trim() || !lessonDuration.trim()) return;
    setForm(f => ({
      ...f,
      curriculum: f.curriculum.map((mod, idx) =>
        idx === selectedModule
          ? {
              ...mod,
              lessons: [
                ...mod.lessons,
                { title: lessonTitle, duration: lessonDuration, type: lessonType },
              ],
            }
          : mod
      ),
    }));
    setLessonTitle("");
    setLessonDuration("");
    setLessonType("video");
  }
  function handleRemoveModule(idx: number) {
    setForm(f => ({
      ...f,
      curriculum: f.curriculum.filter((_, i) => i !== idx),
    }));
    setSelectedModule(null);
  }
  function handleRemoveLesson(modIdx: number, lessonIdx: number) {
    setForm(f => ({
      ...f,
      curriculum: f.curriculum.map((mod, i) =>
        i === modIdx
          ? { ...mod, lessons: mod.lessons.filter((_, li) => li !== lessonIdx) }
          : mod
      ),
    }));
  }
  function handleAddOutcome() {
    if (!outcomeInput.trim()) return;
    setForm(f => ({
      ...f,
      learningOutcomes: [...f.learningOutcomes, outcomeInput],
    }));
    setOutcomeInput("");
  }
  function handleRemoveOutcome(idx: number) {
    setForm(f => ({
      ...f,
      learningOutcomes: f.learningOutcomes.filter((_, i) => i !== idx),
    }));
  }
  function handleAddPrereq() {
    if (!prereqInput.trim()) return;
    setForm(f => ({
      ...f,
      prerequisites: [...f.prerequisites, prereqInput],
    }));
    setPrereqInput("");
  }
  function handleRemovePrereq(idx: number) {
    setForm(f => ({
      ...f,
      prerequisites: f.prerequisites.filter((_, i) => i !== idx),
    }));
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newCourse: Course = {
      id: editIndex !== null ? courses[editIndex].id : (courses.length + 1).toString(),
      title: form.title,
      shortDesc: form.shortDesc,
      longDesc: form.longDesc,
      cover: coverPreview || "/images/courses/default.jpg",
      video: form.video,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      price: form.price,
      duration: form.duration,
      level: form.level,
      category: form.category,
      instructor: {
        name: form.instructor.name,
        bio: form.instructor.bio,
        avatar: instructorAvatarPreview || "/images/profile.jpg",
        credentials: form.instructor.credentials,
      },
      curriculum: form.curriculum,
      learningOutcomes: form.learningOutcomes,
      prerequisites: form.prerequisites,
      status: "Pending",
      feedback: "",
    };
    if (editIndex !== null) {
      setCourses(courses.map((c, i) => (i === editIndex ? newCourse : c)));
    } else {
      setCourses([newCourse, ...courses]);
    }
    setModalOpen(false);
    setEditIndex(null);
  }

  // --- UI ---
  return (
    <div className="relative z-10 min-h-screen pb-20 overflow-x-hidden pt-24">
      <section className="max-w-7xl mx-auto px-2 sm:px-8 pt-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white text-center">Creator Dashboard</h1>
          <GlassButton onClick={handleModalOpen} className="flex items-center gap-2">
            <Plus className="w-5 h-5" /> Create Course
          </GlassButton>
        </div>
        {/* Modal for Create/Edit Course */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editIndex !== null ? "Edit Course" : "Create New Course"}>
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* --- Basic Info --- */}
            <GlassCard className="bg-white/95 dark:bg-zinc-900/95 p-8 rounded-2xl shadow-xl space-y-8">
              <h4 className="font-bold text-lg mb-2 text-black dark:text-white border-b border-black/10 dark:border-white/10 pb-2">
                Basic Info
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">Course Title</label>
                  <GlassInput
                    name="title"
                    value={form.title}
                    onChange={handleInput}
                    placeholder="Course Title"
                    required
                    className="rounded-md shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">Short Description</label>
                  <GlassInput
                    name="shortDesc"
                    value={form.shortDesc}
                    onChange={handleInput}
                    placeholder="Short Description"
                    required
                    className="rounded-md shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">Price</label>
                  <GlassInput
                    name="price"
                    value={form.price}
                    onChange={handleInput}
                    placeholder="Price (0 for Free)"
                    required
                    className="rounded-md shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">Duration</label>
                  <GlassInput
                    name="duration"
                    value={form.duration}
                    onChange={handleInput}
                    placeholder="Duration (e.g. 4h)"
                    required
                    className="rounded-md shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">Level</label>
                  <div className="relative">
                    <select
                      name="level"
                      value={form.level}
                      onChange={handleInput}
                      className="w-full rounded-md shadow-sm px-4 py-2 bg-white/70 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                    >
                      {LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</span>
                  </div>
                </div>
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">Category</label>
                  <div className="relative">
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleInput}
                      className="w-full rounded-md shadow-sm px-4 py-2 bg-white/70 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                    >
                      <option value="">Select Category</option>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</span>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">Tags</label>
                  <GlassInput
                    name="tags"
                    value={form.tags}
                    onChange={handleTagInput}
                    placeholder="Tags (comma separated)"
                    className="rounded-md shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">Video Preview URL</label>
                  <GlassInput
                    name="video"
                    value={form.video}
                    onChange={handleInput}
                    placeholder="Video Preview URL"
                    className="rounded-md shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black dark:text-white mb-1">Full Description</label>
                <GlassTextarea
                  name="longDesc"
                  value={form.longDesc}
                  onChange={handleInput}
                  placeholder="Describe your course in detail. What will students learn? Who is this for? Use paragraphs or bullet points."
                  rows={10}
                  required
                  className="mt-2 min-h-[120px] rounded-md shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                />
                <div className="text-xs text-black/60 dark:text-white/60 mt-2 mb-2">
                  <strong>Tip:</strong> Use paragraphs, bullet points, and clear sections.<br />
                  Example:
                  <ul className="list-disc pl-5">
                    <li>Understand Ethereum basics</li>
                    <li>Set up and use a wallet</li>
                    <li>Send and receive transactions</li>
                  </ul>
                </div>
              </div>
              {/* Cover Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black dark:text-white mb-1">Banner/Cover Image</label>
                <GlassCard className="p-0 border-2 border-dashed border-blue-400 bg-blue-50/30 dark:bg-blue-900/10 hover:border-blue-600 transition rounded-md shadow-sm">
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer"
                    tabIndex={0}
                    onClick={() => document.getElementById('cover-upload')?.click()}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") document.getElementById('cover-upload')?.click(); }}
                    role="button"
                    aria-label="Upload Cover Image"
                  >
                    <button
                      type="button"
                      tabIndex={-1}
                      className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {coverPreview ? "Change Image" : "Upload Image"}
                    </button>
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {coverPreview && (
                      <img src={coverPreview} alt="Preview" className="w-28 h-20 object-cover rounded border border-black/10 dark:border-white/20" />
                    )}
                    {!coverPreview && (
                      <span className="text-black/60 dark:text-white/60 text-sm">No image selected</span>
                    )}
                  </div>
                </GlassCard>
              </div>
            </GlassCard>

            {/* --- Instructor Info --- */}
            <GlassCard className="bg-white/95 dark:bg-zinc-900/95 p-8 rounded-2xl shadow-xl space-y-8">
              <h4 className="font-bold text-lg mb-2 text-black dark:text-white border-b border-black/10 dark:border-white/10 pb-2">
                Instructor Info
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">Instructor Name</label>
                  <GlassInput
                    name="instructor.name"
                    value={form.instructor.name}
                    onChange={handleInput}
                    placeholder="Instructor Name"
                    required
                    className="rounded-md shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">Credentials</label>
                  <GlassInput
                    name="instructor.credentials"
                    value={form.instructor.credentials}
                    onChange={handleInput}
                    placeholder="Credentials"
                    className="rounded-md shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black dark:text-white mb-1">Instructor Bio</label>
                <GlassTextarea
                  name="instructor.bio"
                  value={form.instructor.bio}
                  onChange={handleInput}
                  placeholder="Tell students about yourself. Include your background, experience, and why you're passionate about this topic."
                  rows={8}
                  required
                  className="mt-2 min-h-[120px] rounded-md shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                />
                <div className="text-xs text-black/60 dark:text-white/60 mt-2 mb-2">
                  <strong>Tip:</strong> Share your teaching experience, relevant credentials, and what excites you about this subject.
                </div>
              </div>
              {/* Instructor Avatar Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black dark:text-white mb-1">Instructor Avatar</label>
                <GlassCard className="p-0 border-2 border-dashed border-blue-400 bg-blue-50/30 dark:bg-blue-900/10 hover:border-blue-600 transition rounded-md shadow-sm">
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") document.getElementById('avatar-upload')?.click(); }}
                    role="button"
                    aria-label="Upload Instructor Avatar"
                  >
                    <button
                      type="button"
                      tabIndex={-1}
                      className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {instructorAvatarPreview ? "Change Avatar" : "Upload Avatar"}
                    </button>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleInstructorAvatarChange}
                      className="hidden"
                    />
                    {instructorAvatarPreview && (
                      <img src={instructorAvatarPreview} alt="Instructor Preview" className="w-20 h-20 object-cover rounded-full border border-black/10 dark:border-white/20" />
                    )}
                    {!instructorAvatarPreview && (
                      <span className="text-black/60 dark:text-white/60 text-sm">No avatar selected</span>
                    )}
                  </div>
                </GlassCard>
              </div>
            </GlassCard>

            {/* --- Curriculum Builder --- */}
            <GlassCard className="bg-white/95 dark:bg-zinc-900/95 p-8 rounded-2xl shadow-xl space-y-8">
              <h4 className="font-bold text-lg mb-2 text-black dark:text-white border-b border-black/10 dark:border-white/10 pb-2">
                Curriculum
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4 flex gap-2">
                  <GlassInput
                    value={moduleTitle}
                    onChange={e => setModuleTitle(e.target.value)}
                    placeholder="Module Title"
                    className="rounded-md shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                  />
                  <GlassButton type="button" onClick={handleAddModule}>Add Module</GlassButton>
                </div>
                {form.curriculum.length > 0 && (
                  <div className="mb-4 col-span-2">
                    {form.curriculum.map((mod, modIdx) => (
                      <GlassCard key={modIdx} className="mb-4 p-4 bg-white/80 dark:bg-white/10 border border-black/10 dark:border-white/20 rounded-md shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-black dark:text-white">{mod.title}</span>
                          <div className="flex gap-2">
                            <GlassButton type="button" className="px-2 py-1" onClick={() => setSelectedModule(modIdx)}>
                              <BookOpen className="w-4 h-4" /> Add Lesson
                            </GlassButton>
                            <GlassButton type="button" className="px-2 py-1 bg-red-500/40 border-red-400/20" onClick={() => handleRemoveModule(modIdx)}>
                              <Trash2 className="w-4 h-4" />
                            </GlassButton>
                          </div>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {mod.lessons.map((lesson, lessonIdx) => (
                            <li key={lessonIdx} className="flex items-center gap-2 text-black dark:text-white/90">
                              {lesson.type === "video" && <PlayCircle className="w-4 h-4 text-cyan-400" />}
                              {lesson.type === "quiz" && <BookOpen className="w-4 h-4 text-purple-400" />}
                              {lesson.type === "reading" && <FileText className="w-4 h-4 text-blue-400" />}
                              <span className="flex-1">{lesson.title} <span className="text-xs text-black/50 dark:text-white/50 ml-2">{lesson.duration}</span></span>
                              <GlassButton type="button" className="px-2 py-1 bg-red-500/40 border-red-400/20" onClick={() => handleRemoveLesson(modIdx, lessonIdx)}>
                                <Trash2 className="w-4 h-4" />
                              </GlassButton>
                            </li>
                          ))}
                        </ul>
                        {selectedModule === modIdx && (
                          <form className="flex flex-col md:flex-row gap-2 mt-2" onSubmit={e => { e.preventDefault(); handleAddLesson(); }}>
                            <GlassInput value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} placeholder="Lesson Title" required />
                            <GlassInput value={lessonDuration} onChange={e => setLessonDuration(e.target.value)} placeholder="Duration" required />
                            <select value={lessonType} onChange={e => setLessonType(e.target.value as "video" | "quiz" | "reading")} className="rounded-md shadow-sm px-2 py-1 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/20 text-black dark:text-white focus:ring-2 focus:ring-indigo-500">
                              <option value="video">Video</option>
                              <option value="quiz">Quiz</option>
                              <option value="reading">Reading</option>
                            </select>
                            <GlassButton type="submit">Add</GlassButton>
                            <GlassButton type="button" className="bg-red-500/40 border-red-400/20" onClick={() => setSelectedModule(null)}>
                              <X className="w-4 h-4" />
                            </GlassButton>
                          </form>
                        )}
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>

            {/* --- Outcomes & Prerequisites --- */}
            <GlassCard className="bg-white/95 dark:bg-zinc-900/95 p-8 rounded-2xl shadow-xl space-y-8">
              <h4 className="font-bold text-lg mb-2 text-black dark:text-white border-b border-black/10 dark:border-white/10 pb-2">
                Learning Outcomes & Prerequisites
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">Learning Outcomes</label>
                  <div className="flex gap-2 mb-2">
                    <GlassInput value={outcomeInput} onChange={e => setOutcomeInput(e.target.value)} placeholder="Add Learning Outcome" />
                    <GlassButton type="button" onClick={handleAddOutcome}>Add</GlassButton>
                  </div>
                  <ul className="list-disc pl-5">
                    {form.learningOutcomes.map((o, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span>{o}</span>
                        <GlassButton type="button" className="px-2 py-1 bg-red-500/40 border-red-400/20" onClick={() => handleRemoveOutcome(idx)}>
                          <X className="w-4 h-4" />
                        </GlassButton>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">Prerequisites</label>
                  <div className="flex gap-2 mb-2">
                    <GlassInput value={prereqInput} onChange={e => setPrereqInput(e.target.value)} placeholder="Add Prerequisite" />
                    <GlassButton type="button" onClick={handleAddPrereq}>Add</GlassButton>
                  </div>
                  <ul className="list-disc pl-5">
                    {form.prerequisites.map((p, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span>{p}</span>
                        <GlassButton type="button" className="px-2 py-1 bg-red-500/40 border-red-400/20" onClick={() => handleRemovePrereq(idx)}>
                          <X className="w-4 h-4" />
                        </GlassButton>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>
            <div className="flex justify-end">
              <GlassButton type="submit" className="px-6 py-2 text-lg">{editIndex !== null ? "Save Changes" : "Create Course"}</GlassButton>
            </div>
          </form>
        </Modal>

        {/* List of Submitted Courses */}
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          {courses.map((course, idx) => (
            <GlassCard key={course.id} className="flex flex-col gap-2">
              <img
                src={course.cover}
                alt={course.title}
                className="w-full h-36 object-cover rounded border border-black/10 dark:border-white/20"
              />
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="font-bold text-lg text-black dark:text-white">{course.title}</span>
                <span className={classNames("px-2 py-0.5 rounded-full text-xs font-semibold", statusColors[course.status])}>{course.status}</span>
                <span className="bg-black/10 dark:bg-white/10 text-xs px-2 py-0.5 rounded text-black dark:text-white">{course.level}</span>
                <span className="bg-black/10 dark:bg-white/10 text-xs px-2 py-0.5 rounded text-black dark:text-white">{course.duration}</span>
                <span className="bg-black/10 dark:bg-white/10 text-xs px-2 py-0.5 rounded text-black dark:text-white">{course.price === "0" ? "Free" : `$${course.price}`}</span>
              </div>
              <div className="text-sm text-black/80 dark:text-white/80 mb-1">{course.shortDesc}</div>
              <div className="flex flex-wrap gap-2 mb-1">
                {course.tags.map((tag: string) => (
                  <span key={tag} className="bg-black/10 dark:bg-white/10 text-xs px-2 py-0.5 rounded text-black dark:text-white">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <img src={course.instructor.avatar} alt={course.instructor.name} className="w-8 h-8 rounded-full border border-black/10 dark:border-white/20" />
                <span className="text-xs text-black dark:text-white">{course.instructor.name}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <GlassButton className="px-3 py-2" onClick={() => handleEdit(idx)}>
                  <Pencil className="w-4 h-4" />
                </GlassButton>
                <GlassButton className="px-3 py-2 bg-red-500/40 border-red-400/20" onClick={() => handleDelete(idx)}>
                  <Trash2 className="w-4 h-4" />
                </GlassButton>
              </div>
              {course.status === "Rejected" && (
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Admin Feedback: {course.feedback}
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}