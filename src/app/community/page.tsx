"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Bookmark, ArrowUp, ArrowDown, MessageCircle, Plus, Search, Star, Calendar, Tag, X } from "lucide-react";
import classNames from "classnames";

// --- Interfaces ---
interface User {
  id: string;
  name: string;
  avatar: string;
  reputation: number;
  badges: string[];
}
interface Reply {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  votes: number;
  replies?: Reply[];
}
interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: User;
  category: string;
  votes: number;
  replies: Reply[];
  tags: string[];
  createdAt: Date;
}

// --- Sample Data ---
const user: User = {
  id: "ayu",
  name: "Ayu Shetty",
  avatar: "/images/profile.jpg",
  reputation: 1560,
  badges: ["Top Mentor", "DeFi Champ", "NFT Guru"]
};

const categories = [
  { id: "general", label: "General Discussion", icon: <MessageCircle className="w-5 h-5 text-cyan-400" />, posts: 42, activity: "Active" },
  { id: "qna", label: "Course Q&A", icon: <Star className="w-5 h-5 text-yellow-400" />, posts: 33, activity: "Hot" },
  { id: "help", label: "Technical Help", icon: <User className="w-5 h-5 text-purple-400" />, posts: 21, activity: "Active" },
  { id: "showcase", label: "Project Showcase", icon: <Tag className="w-5 h-5 text-blue-400" />, posts: 19, activity: "New" },
  { id: "career", label: "Career Advice", icon: <Calendar className="w-5 h-5 text-green-400" />, posts: 9, activity: "New" },
  { id: "news", label: "News & Updates", icon: <Bell className="w-5 h-5 text-pink-400" />, posts: 12, activity: "Active" }
];

const forumPosts: ForumPost[] = [
  {
    id: "p1",
    title: "How to deploy a smart contract on testnet?",
    content: "I'm new to Ethereum and would like some help with deploying my first contract. Any good guides or tips?",
    author: user,
    category: "Technical Help",
    votes: 8,
    replies: [
      {
        id: "r1",
        content: "Hi! You can use [Remix IDE](https://remix.ethereum.org/) or Hardhat. Here's a sample Hardhat script:\n```js\nawait contract.deploy();\n```",
        author: { ...user, id: "bob", name: "Bob Lee", avatar: "/images/users/user2.jpg", reputation: 320, badges: ["Helper"] },
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
        votes: 4,
        replies: [
          {
            id: "r1-1",
            content: "@BobLee Thanks! Does this work for Polygon testnet too?",
            author: { ...user, id: "ayu", name: "Ayu Shetty", avatar: "/images/profile.jpg", reputation: 1560, badges: ["Top Mentor"] },
            createdAt: new Date(Date.now() - 30 * 60 * 1000),
            votes: 1,
            replies: []
          }
        ]
      }
    ],
    tags: ["solidity", "deployment"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "p2",
    title: "Showcase: My DeFi Yield Aggregator 🦄",
    content: "Excited to launch my first DeFi project! Feedback welcome. [Demo](https://defi-demo.app)",
    author: { ...user, id: "cynthia", name: "Cynthia Wu", avatar: "/images/users/user3.jpg", reputation: 800, badges: ["DeFi Star"] },
    category: "Project Showcase",
    votes: 12,
    replies: [],
    tags: ["project", "defi"],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  }
];

// --- Utility: Markdown/Code Highlight (simple) ---
function renderMarkdown(content: string) {
  // Simple code block -> <pre><code>
  const codeBlock = /```(\w*)\n([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = codeBlock.exec(content))) {
    if (match.index > lastIndex) {
      parts.push(<span key={lastIndex}>{content.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <pre key={match.index} className="bg-slate-900/80 rounded-xl p-3 text-xs text-green-200 my-2 overflow-x-auto">
        <code>{match[2]}</code>
      </pre>
    );
    lastIndex = codeBlock.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push(<span key={lastIndex + 9000}>{content.slice(lastIndex)}</span>);
  }
  // Links
  return parts.map(part =>
    typeof part === "string"
      ? part.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, (m, text, url) => `<a href="${url}" target="_blank" class="text-cyan-400 underline">${text}</a>`)
      : part
  ).map((part, i) =>
    typeof part === "string" ? <span key={i} dangerouslySetInnerHTML={{ __html: part }} /> : part
  );
}

// --- Glass Components ---
function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
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
function GlassTag({ label }: { label: string }) {
  return (
    <span className="bg-white/10 px-3 py-1 rounded-full text-xs text-cyan-200 border border-cyan-400/30 font-medium mr-1 mb-1 shadow-glass">{label}</span>
  );
}

// --- Discussion Category Sidebar ---
function ForumSidebar({ selected, setSelected }: { selected: string; setSelected: (id: string)=>void }) {
  return (
    <GlassCard className="w-full md:w-60 mb-8 md:mb-0">
      <h3 className="text-lg font-bold text-white mb-4">Forum Categories</h3>
      <ul className="flex flex-col gap-2">
        {categories.map(c => (
          <li key={c.id}>
            <button
              className={classNames(
                "flex items-center gap-2 w-full px-3 py-2 rounded-lg border transition shadow-glass",
                selected === c.id
                  ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 text-white border-blue-400"
                  : "bg-white/10 text-white/80 border-transparent hover:bg-blue-400/20"
              )}
              onClick={() => setSelected(c.id)}
            >
              {c.icon}
              <span className="flex-1">{c.label}</span>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full border border-cyan-400/20 text-cyan-200">{c.posts}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col gap-3">
        <GlassButton className="w-full flex gap-2 items-center"><Plus className="w-5 h-5"/> New Post</GlassButton>
        <div className="bg-white/10 rounded-xl p-3 flex flex-col gap-2 items-center mt-3">
          <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-blue-400" alt="avatar"/>
          <span className="text-sm text-white font-semibold">{user.name}</span>
          <span className="text-xs text-white/70">Reputation: <span className="text-cyan-300 font-bold">{user.reputation}</span></span>
          <div className="flex gap-1 flex-wrap mt-1">
            {user.badges.map(b => (
              <span key={b} className="bg-purple-400/30 text-purple-100 text-xs px-2 py-1 rounded">{b}</span>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// --- Forum Post Card ---
function ForumPostCard({ post, onReply }: { post: ForumPost; onReply: (post: ForumPost) => void }) {
  const [vote, setVote] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);

  return (
    <GlassCard className="mb-7">
      <div className="flex items-center gap-3 mb-2">
        <img src={post.author.avatar} className="w-10 h-10 rounded-full border-2 border-blue-400" alt={post.author.name} />
        <span className="font-semibold text-white">{post.author.name}</span>
        <span className="text-xs text-white/70">{post.category}</span>
        <span className="ml-auto text-xs text-white/50">{post.createdAt.toLocaleString()}</span>
      </div>
      <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">{post.title}</h2>
      <div className="text-white/90 text-base mb-3">{renderMarkdown(post.content)}</div>
      <div className="flex gap-2 flex-wrap mb-2">
        {post.tags.map(t => <GlassTag key={t} label={t} />)}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center mr-3">
          <button onClick={() => setVote(v => v === 1 ? 0 : 1)} className={classNames("rounded-full p-1 border", vote === 1 ? "bg-blue-400/40 border-blue-400" : "bg-white/10 border-white/20 hover:bg-blue-400/20")}>
            <ArrowUp className="w-5 h-5 text-cyan-300" />
          </button>
          <span className="text-white">{post.votes + vote}</span>
          <button onClick={() => setVote(v => v === -1 ? 0 : -1)} className={classNames("rounded-full p-1 border", vote === -1 ? "bg-purple-400/40 border-purple-400" : "bg-white/10 border-white/20 hover:bg-purple-400/20")}>
            <ArrowDown className="w-5 h-5 text-purple-300" />
          </button>
        </div>
        <GlassButton className={classNames("flex gap-2 items-center", bookmarked && "bg-purple-600/30")} onClick={() => setBookmarked(b => !b)}>
          <Bookmark className="w-4 h-4"/>{bookmarked ? "Bookmarked" : "Bookmark"}
        </GlassButton>
        <GlassButton className={classNames("flex gap-2 items-center", following && "bg-cyan-600/20")} onClick={() => setFollowing(f => !f)}>
          <Bell className="w-4 h-4"/>{following ? "Following" : "Follow"}
        </GlassButton>
        <GlassButton className="flex gap-2 items-center" onClick={() => onReply(post)}>
          <MessageCircle className="w-4 h-4"/> Reply
        </GlassButton>
      </div>
      <div className="mt-5">
        {post.replies.length > 0 && (
          <ReplyThread replies={post.replies} depth={0} />
        )}
      </div>
    </GlassCard>
  );
}

// --- Reply Thread (recursive) ---
function ReplyThread({ replies, depth }: { replies: Reply[]; depth: number }) {
  return (
    <div className={classNames("pl-3 border-l-4", depth > 0 ? "border-blue-400/30" : "border-none")}>
      {replies.map(reply => (
        <GlassCard key={reply.id} className="mb-3 bg-white/5">
          <div className="flex items-center gap-2 mb-1">
            <img src={reply.author.avatar} className="w-7 h-7 rounded-full border-2 border-purple-400" alt={reply.author.name}/>
            <span className="font-semibold text-white">{reply.author.name}</span>
            <span className="ml-auto text-xs text-white/50">{reply.createdAt.toLocaleString()}</span>
            <span className="text-xs text-cyan-300">{reply.votes} votes</span>
          </div>
          <div className="text-white/90 mb-2">{renderMarkdown(reply.content)}</div>
          {reply.replies && reply.replies.length > 0 && (
            <ReplyThread replies={reply.replies} depth={depth + 1} />
          )}
        </GlassCard>
      ))}
    </div>
  );
}

// --- Post Creation Modal ---
function PostModal({ open, onClose }: { open: boolean; onClose: ()=>void }) {
  const [step, setStep] = useState<"form" | "preview">("form");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState(categories[0].label);

  function addTag() {
    if (tagInput && !tags.includes(tagInput)) setTags(t => [...t, tagInput]);
    setTagInput("");
  }

  if (!open) return null;
  return (
    <motion.div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <GlassCard className="w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-white/60 hover:text-white"><X className="w-7 h-7"/></button>
        <h2 className="text-2xl font-bold text-white mb-4">Create New Post</h2>
        <div className="mb-3">
          <GlassInput placeholder="Title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}/>
        </div>
        <div className="mb-3">
          <GlassTextarea rows={6} placeholder="Write your post (Markdown supported)" value={content} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}/>
        </div>
        <div className="mb-3 flex flex-wrap gap-1">
          {tags.map(t => <GlassTag key={t} label={t} />)}
          <input
            className="bg-white/10 px-2 py-1 rounded text-cyan-200 w-32 mr-2"
            value={tagInput}
            onChange={e=>setTagInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter" && addTag()}
            placeholder="Add tag"
          />
          <GlassButton className="px-2 py-1 text-xs" onClick={addTag}>Add</GlassButton>
        </div>
        <div className="mb-4">
          <select className="rounded px-3 py-2 bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-400" value={category} onChange={e=>setCategory(e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
          </select>
        </div>
        <div className="flex gap-2 mt-2">
          <GlassButton onClick={()=>setStep(s=>s==="form"?"preview":"form")}>{step==="form"?"Preview":"Edit"}</GlassButton>
          <GlassButton className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 text-white">Post</GlassButton>
        </div>
        {step==="preview" && (
          <div className="mt-6 bg-white/10 rounded-xl p-4 border border-white/15">
            <h3 className="font-bold text-white mb-2">{title}</h3>
            <div className="mb-2">{tags.map(t=><GlassTag key={t} label={t}/>)}</div>
            <div className="text-white/90">{renderMarkdown(content)}</div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
function GlassInput({ ...props }) {
  return (
    <input
      {...props}
      className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    />
  );
}
function GlassTextarea({ ...props }) {
  return (
    <textarea
      {...props}
      className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    />
  );
}

// --- Main Page ---
export default function CommunityForumPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  // Filtered posts
  const posts = forumPosts.filter(
    p =>
      (!selectedCategory || categories.find(c => c.id === selectedCategory)?.label === p.category) &&
      (p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black pb-20 overflow-x-hidden pt-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <ForumSidebar selected={selectedCategory} setSelected={setSelectedCategory} />
          </div>
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-7">
              <div className="flex-1">
                <div className="relative">
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search discussions..."
                    className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  <Search className="absolute right-3 top-2.5 text-cyan-400 w-5 h-5" />
                </div>
              </div>
              <GlassButton className="flex gap-2 items-center" onClick={() => setOpenModal(true)}>
                <Plus className="w-5 h-5"/> New Post
              </GlassButton>
            </div>
            {/* Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {categories.map(c => (
                <GlassCard key={c.id} className="flex flex-col items-center gap-2 cursor-pointer border-2 border-transparent hover:border-blue-400 transition">
                  <div>{c.icon}</div>
                  <span className="font-bold text-white">{c.label}</span>
                  <span className="text-xs text-white/70">{c.posts} posts</span>
                  <span className={classNames("text-xs font-bold px-3 py-1 rounded-full", c.activity === "Hot" ? "bg-yellow-400/30 text-yellow-300" : "bg-cyan-400/20 text-cyan-300")}>{c.activity}</span>
                </GlassCard>
              ))}
            </div>
            {/* Posts */}
            <div>
              {posts.length === 0 && (
                <GlassCard>
                  <span className="text-white/70">No posts found for this category/search.</span>
                </GlassCard>
              )}
              {posts.map(post => (
                <ForumPostCard key={post.id} post={post} onReply={() => setOpenModal(true)} />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Post Create Modal */}
      <PostModal open={openModal} onClose={()=>setOpenModal(false)}/>
    </div>
  );
}