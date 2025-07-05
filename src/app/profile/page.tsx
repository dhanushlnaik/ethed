"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Check, Link2, X, User, MapPin, Mail, Star, BookOpen, Trophy, Shield, Bell, Trash2, EyeOff, ArrowUpRight, BadgeCheck, Plus, Share2 } from "lucide-react";
import classNames from "classnames";
import Link from "next/link";

// --- Types ---
interface Skill {
  id: string;
  name: string;
  level: number; // 0 - 100
  endorsed: number;
}

interface Achievement {
  id: string;
  title: string;
  icon: React.ReactNode;
  desc: string;
  date: string;
}

interface SocialLink {
  id: string;
  type: string;
  url: string;
  icon: React.ReactNode;
}

interface PrivacySettings {
  profilePublic: boolean;
  showAchievements: boolean;
  showCourses: boolean;
  emailNotifications: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  skills: Skill[];
  achievements: Achievement[];
  socialLinks: SocialLink[];
  privacy: PrivacySettings;
  location: string;
  title: string;
  followers: number;
  following: number;
  reputation: number;
  profileCompletion: number;
  courses: {
    enrolled: { id: string; title: string; status: "in-progress" | "completed"; image: string }[];
    wishlist: { id: string; title: string; image: string }[];
  };
  activity: {
    id: string;
    type: "post" | "course" | "achievement";
    title: string;
    date: string;
    desc?: string;
    extra?: unknown;
  }[];
}

// --- Sample Data ---
const user: UserProfile = {
  id: "ayu",
  name: "Ayu Shetty",
  email: "ayu@ethed.com",
  bio: "Web3 Developer and Educator. Passionate about Ethereum, DeFi, and NFTs. Building the future of decentralized education.",
  avatar: "/images/profile.jpg",
  location: "Bangalore, India",
  title: "Lead Blockchain Instructor",
  followers: 321,
  following: 187,
  reputation: 1560,
  profileCompletion: 82,
  skills: [
    { id: "s1", name: "Solidity", level: 90, endorsed: 12 },
    { id: "s2", name: "DeFi", level: 80, endorsed: 10 },
    { id: "s3", name: "NFTs", level: 78, endorsed: 7 },
    { id: "s4", name: "Smart Contracts", level: 88, endorsed: 15 },
    { id: "s5", name: "Security", level: 65, endorsed: 4 },
  ],
  achievements: [
    { id: "a1", title: "Top Instructor", icon: <Trophy className="w-6 h-6 text-yellow-400"/>, desc: "Top 1% mentor", date: "2025-06-10" },
    { id: "a2", title: "NFT Guru", icon: <BadgeCheck className="w-6 h-6 text-cyan-400"/>, desc: "Completed all NFT courses", date: "2025-06-11" },
    { id: "a3", title: "DeFi Champ", icon: <Trophy className="w-6 h-6 text-purple-400"/>, desc: "Completed DeFi track", date: "2025-06-12" }
  ],
  socialLinks: [
    { id: "twitter", type: "Twitter", url: "https://twitter.com/ayu", icon: <Link2 className="w-5 h-5 text-cyan-400"/> },
    { id: "github", type: "GitHub", url: "https://github.com/ayu", icon: <Link2 className="w-5 h-5 text-purple-400"/> }
  ],
  privacy: {
    profilePublic: true,
    showAchievements: true,
    showCourses: true,
    emailNotifications: true
  },
  courses: {
    enrolled: [
      { id: "c1", title: "Ethereum Fundamentals", status: "completed", image: "/images/courses/eth-fundamentals.jpg" },
      { id: "c2", title: "DeFi Protocol Design", status: "in-progress", image: "/images/courses/defi-protocol-design.jpg" },
      { id: "c3", title: "NFT Marketplace Creation", status: "completed", image: "/images/courses/nft-marketplace.jpg" }
    ],
    wishlist: [
      { id: "c4", title: "Web3 Security Auditing", image: "/images/courses/web3-security-audit.jpg" }
    ]
  },
  activity: [
    { id: "ac1", type: "post", title: "Answered: Solidity Contract Q&A", date: "2025-06-20", desc: "Helped a student with contract bugs." },
    { id: "ac2", type: "course", title: "Completed: Ethereum Fundamentals", date: "2025-06-18" },
    { id: "ac3", type: "achievement", title: "Unlocked: DeFi Champ", date: "2025-06-17" }
  ]
};

// --- Glass Components ---
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
function GlassInput({ value, onChange, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      value={value}
      onChange={onChange}
      {...props}
      className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    />
  );
}
function GlassTextarea({ value, onChange, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      {...props}
      className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    />
  );
}

// --- Profile Header ---
function ProfileHeader({ user, setUser }: { user: UserProfile; setUser: (u: UserProfile) => void }) {
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [uploadImg, setUploadImg] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState({ name: user.name, title: user.title, location: user.location });
  const [editingLinks, setEditingLinks] = useState(false);
  const [socialLinks, setSocialLinks] = useState(user.socialLinks);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function handleImgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = ev => setUploadImg(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
      setEditingAvatar(true);
    }
  }

  function saveProfile() {
    setUser({ ...user, ...editValues, avatar: uploadImg || user.avatar });
    setEditing(false);
    setEditingAvatar(false);
  }

  function cancelAvatarEdit() {
    setUploadImg(null);
    setEditingAvatar(false);
  }

  function saveLinks() {
    setUser({ ...user, socialLinks });
    setEditingLinks(false);
  }

  function cancelLinks() {
    setSocialLinks(user.socialLinks);
    setEditingLinks(false);
  }

  return (
    <GlassCard className="flex flex-col md:flex-row md:items-end items-center gap-8 mb-8">
      {/* Avatar + Upload */}
      <div className="relative group">
        <img
          src={uploadImg || user.avatar}
          alt="Profile"
          className={classNames(
            "w-40 h-40 rounded-2xl object-cover border-4 border-blue-400 transition",
            editingAvatar && "opacity-70"
          )}
        />
        {/* Overlay on hover */}
        {!editingAvatar && (
          <button
            type="button"
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer z-10"
            onClick={() => fileInputRef.current?.click()}
          >
            <Pencil className="w-7 h-7 text-white mb-1" />
            <span className="text-white font-semibold">Change Photo</span>
          </button>
        )}
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImgUpload}
        />
        {/* Save/Cancel overlay after selecting */}
        {editingAvatar && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-2xl z-20">
            <div className="mb-3 text-white font-semibold">Preview</div>
            <div className="flex gap-2">
              <GlassButton onClick={saveProfile}><Check className="w-4 h-4" /> Save</GlassButton>
              <GlassButton onClick={cancelAvatarEdit}><X className="w-4 h-4" /> Cancel</GlassButton>
            </div>
          </div>
        )}
      </div>
      {/* User Info */}
      <div className="flex-1 flex flex-col gap-3 w-full">
        {editing ? (
          <>
            <GlassInput value={editValues.name} onChange={e => setEditValues(v => ({ ...v, name: e.target.value }))} placeholder="Name"/>
            <GlassInput value={editValues.title} onChange={e => setEditValues(v => ({ ...v, title: e.target.value }))} placeholder="Title"/>
            <GlassInput value={editValues.location} onChange={e => setEditValues(v => ({ ...v, location: e.target.value }))} placeholder="Location"/>
            <div className="flex gap-2 mt-2">
              <GlassButton onClick={saveProfile}><Check className="w-4 h-4" /> Save</GlassButton>
              <GlassButton onClick={() => setEditing(false)}><X className="w-4 h-4" /> Cancel</GlassButton>
            </div>
          </>
        ) : (
          <>
            <div className="text-3xl font-extrabold text-white">{user.name}</div>
            <div className="flex gap-4">
              <span className="bg-white/10 text-cyan-200 px-3 py-1 rounded-lg border border-cyan-400/30 font-bold shadow-glass">{user.title}</span>
              <span className="bg-white/10 text-purple-200 px-3 py-1 rounded-lg border border-purple-400/30 font-bold shadow-glass flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {user.location}
              </span>
            </div>
            <div className="flex gap-2 mt-2 items-center">
              {editingLinks ? (
                <>
                  {socialLinks.map((link, idx) => (
                    <div key={link.id} className="flex items-center gap-1">
                      {link.icon}
                      <GlassInput
                        value={link.url}
                        onChange={e => {
                          const updated = [...socialLinks];
                          updated[idx] = { ...updated[idx], url: e.target.value };
                          setSocialLinks(updated);
                        }}
                        placeholder={`${link.type} URL`}
                        style={{ width: 180 }}
                      />
                    </div>
                  ))}
                  <GlassButton onClick={saveLinks}><Check className="w-4 h-4" /> Save</GlassButton>
                  <GlassButton onClick={cancelLinks}><X className="w-4 h-4" /> Cancel</GlassButton>
                </>
              ) : (
                <>
                  {user.socialLinks.map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full border border-white/20 hover:bg-blue-400/20 shadow-glass">
                      {link.icon}
                    </a>
                  ))}
                  <GlassButton onClick={() => setEditingLinks(true)} className="px-2 py-1"><Pencil className="w-4 h-4" /></GlassButton>
                </>
              )}
              <span className="bg-white/10 text-white/80 px-3 py-1 rounded-lg border border-white/20 flex items-center gap-1"><Mail className="w-4 h-4"/>{user.email}</span>
            </div>
            <div className="flex gap-2 mt-3">
              <GlassButton onClick={() => setEditing(true)}><Pencil className="w-4 h-4"/> Edit</GlassButton>
              <GlassButton className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 text-white"><Share2 className="w-4 h-4"/> Share</GlassButton>
            </div>
          </>
        )}
        {/* Profile Completion */}
        <div className="mt-5">
          <div className="flex justify-between items-center text-xs text-white/80 mb-1">
            <span>Profile Completion</span>
            <span>{user.profileCompletion}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/15 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${user.profileCompletion}%` }}
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 rounded-full shadow-glass"
              transition={{ duration: 0.7 }}
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// --- Main Tabs ---
const tabs = ["Overview", "Courses", "Achievements", "Activity", "Settings"] as const;
type TabType = typeof tabs[number];

// --- Main Profile Page ---
export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(user);
  const [tab, setTab] = useState<TabType>("Overview");
  // Move editingBio and bio state up here to avoid React hook errors
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(profile.bio);

  // --- Tab content renderers ---
  function renderOverview() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <GlassCard>
          <div className="flex items-center gap-3 mb-2">
            <User className="w-7 h-7 text-cyan-400" />
            <span className="font-semibold text-white text-lg">Bio</span>
          </div>
          {editingBio ? (
            <>
              <GlassTextarea value={bio} onChange={e => setBio(e.target.value)} rows={4}/>
              <div className="flex gap-2 mt-2">
                <GlassButton onClick={() => { setProfile(p => ({ ...p, bio })); setEditingBio(false); }}><Check/> Save</GlassButton>
                <GlassButton onClick={() => setEditingBio(false)}><X /> Cancel</GlassButton>
              </div>
            </>
          ) : (
            <div>
              <div className="text-white/80 mb-2">{profile.bio}</div>
              <GlassButton onClick={() => setEditingBio(true)}><Pencil className="w-4 h-4"/> Edit</GlassButton>
            </div>
          )}
        </GlassCard>
        {/* Skills */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-7 h-7 text-purple-400" />
            <span className="font-semibold text-white text-lg">Skills & Expertise</span>
          </div>
          <div className="flex flex-col gap-3">
            {profile.skills.map(skill => (
              <div key={skill.id}>
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">{skill.name}</span>
                  <span className="text-xs text-cyan-200">{skill.level}%</span>
                </div>
                <div className="w-full h-2 bg-white/15 rounded-full mb-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 rounded-full"
                    transition={{ duration: 0.7 }}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70 mt-1">
                  <span>Endorsed: {skill.endorsed}</span>
                  <GlassButton className="px-2 py-1 text-xs"><Plus className="w-4 h-4"/> Endorse</GlassButton>
                  <GlassButton className="px-2 py-1 text-xs bg-purple-500/20 border-purple-400/30">Skill Test <ArrowUpRight className="w-4 h-4"/></GlassButton>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        {/* Interests */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-7 h-7 text-blue-400" />
            <span className="font-semibold text-white text-lg">Interests</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white/10 text-cyan-200 px-3 py-1 rounded-lg border border-cyan-400/30 font-bold shadow-glass">Ethereum</span>
            <span className="bg-white/10 text-purple-200 px-3 py-1 rounded-lg border border-purple-400/30 font-bold shadow-glass">DeFi</span>
            <span className="bg-white/10 text-blue-200 px-3 py-1 rounded-lg border border-blue-400/30 font-bold shadow-glass">NFTs</span>
          </div>
        </GlassCard>
        {/* Learning Path */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-7 h-7 text-yellow-400" />
            <span className="font-semibold text-white text-lg">Learning Path</span>
          </div>
          <div className="text-white/80 mb-2">Recommended: <span className="text-cyan-200">Complete NFT Security Auditing</span></div>
          <GlassButton>Start Now</GlassButton>
        </GlassCard>
      </div>
    );
  }

  function renderCourses() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        <GlassCard>
          <h4 className="font-bold text-white mb-3">Enrolled Courses</h4>
          <div className="flex flex-col gap-4">
            {profile.courses.enrolled.map(c => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl bg-white/10 p-3 border border-white/15">
                <img src={c.image} alt={c.title} className="w-14 h-14 rounded-xl object-cover"/>
                <div>
                  <div className="font-semibold text-white">{c.title}</div>
                  <div className="text-xs text-white/80">{c.status === "completed" ? "Completed" : "In Progress"}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h4 className="font-bold text-white mb-3">Wishlist</h4>
          <div className="flex flex-col gap-4">
            {profile.courses.wishlist.map(c => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl bg-white/10 p-3 border border-white/15">
                <img src={c.image} alt={c.title} className="w-14 h-14 rounded-xl object-cover"/>
                <div>
                  <div className="font-semibold text-white">{c.title}</div>
                  <div className="text-xs text-white/80">Wishlist</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h4 className="font-bold text-white mb-3">Completed Courses</h4>
          <div className="flex flex-col gap-4">
            {profile.courses.enrolled.filter(c => c.status === "completed").map(c => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl bg-white/10 p-3 border border-white/15">
                <img src={c.image} alt={c.title} className="w-14 h-14 rounded-xl object-cover"/>
                <div>
                  <div className="font-semibold text-white">{c.title}</div>
                  <div className="text-xs text-green-400">Completed</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    );
  }

  function renderAchievements() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <GlassCard>
          <h4 className="font-bold text-white mb-3">Badges</h4>
          <div className="flex flex-wrap gap-5">
            {profile.achievements.map(a => (
              <div key={a.id} className="flex flex-col items-center gap-1 bg-white/10 rounded-2xl border border-white/15 p-4 shadow-glass">
                {a.icon}
                <span className="font-bold text-white">{a.title}</span>
                <span className="text-xs text-white/80 mb-1">{a.desc}</span>
                <span className="text-xs text-white/50">{a.date}</span>
                <GlassButton className="mt-1 text-xs px-3 py-1">Share</GlassButton>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h4 className="font-bold text-white mb-3">Leaderboard</h4>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Trophy className="w-7 h-7 text-yellow-400"/>
              <span className="font-bold text-white text-lg">Global Rank: <span className="text-cyan-300">#12</span></span>
            </div>
            <div className="text-xs text-white/70 mt-2">Keep learning to reach the top!</div>
          </div>
        </GlassCard>
      </div>
    );
  }

  function renderActivity() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <GlassCard>
          <h4 className="font-bold text-white mb-3">Recent Activity</h4>
          <div className="flex flex-col gap-3">
            {profile.activity.map(a => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl bg-white/10 p-3 border border-white/15">
                <span>
                  {a.type === "post" && <BookOpen className="w-6 h-6 text-blue-400"/>}
                  {a.type === "course" && <Star className="w-6 h-6 text-cyan-400"/>}
                  {a.type === "achievement" && <Trophy className="w-6 h-6 text-purple-400"/>}
                </span>
                <div>
                  <div className="font-semibold text-white">{a.title}</div>
                  <div className="text-xs text-white/80">{a.date}</div>
                  {a.desc && <div className="text-xs text-white/60">{a.desc}</div>}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h4 className="font-bold text-white mb-3">Social</h4>
          <div className="flex gap-4 mb-3">
            <div className="flex flex-col items-center">
              <span className="bg-white/10 text-cyan-200 px-4 py-1 rounded-lg border border-cyan-400/30 font-bold shadow-glass text-lg">{profile.followers}</span>
              <span className="text-xs text-white/70">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="bg-white/10 text-purple-200 px-4 py-1 rounded-lg border border-purple-400/30 font-bold shadow-glass text-lg">{profile.following}</span>
              <span className="text-xs text-white/70">Following</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="bg-white/10 text-yellow-300 px-4 py-1 rounded-lg border border-yellow-400/30 font-bold shadow-glass text-lg">{profile.reputation}</span>
              <span className="text-xs text-white/70">Reputation</span>
            </div>
          </div>
          <GlassButton className="w-full mb-2">Follow</GlassButton>
          <GlassButton className="w-full bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 text-white">Share Profile</GlassButton>
        </GlassCard>
      </div>
    );
  }

  // SettingsTab moved out as a React component to allow hooks usage
  function SettingsTab({ privacy: initialPrivacy }: { privacy: PrivacySettings }) {
    const [privacy, setPrivacy] = useState(initialPrivacy);
    const [showDelete, setShowDelete] = useState(false);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <GlassCard>
          <h4 className="font-bold text-white mb-3">Privacy</h4>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-white/80">
              <input type="checkbox" checked={privacy.profilePublic} onChange={e => setPrivacy(p => ({ ...p, profilePublic: e.target.checked }))} className="accent-blue-400"/>
              Profile Public
            </label>
            <label className="flex items-center gap-2 text-white/80">
              <input type="checkbox" checked={privacy.showAchievements} onChange={e => setPrivacy(p => ({ ...p, showAchievements: e.target.checked }))} className="accent-purple-400"/>
              Show Achievements
            </label>
            <label className="flex items-center gap-2 text-white/80">
              <input type="checkbox" checked={privacy.showCourses} onChange={e => setPrivacy(p => ({ ...p, showCourses: e.target.checked }))} className="accent-cyan-400"/>
              Show Courses
            </label>
          </div>
        </GlassCard>
        <GlassCard>
          <h4 className="font-bold text-white mb-3">Notifications & Account</h4>
          <div className="flex flex-col gap-2 mb-3">
            <label className="flex items-center gap-2 text-white/80">
              <input type="checkbox" checked={privacy.emailNotifications} onChange={e => setPrivacy(p => ({ ...p, emailNotifications: e.target.checked }))} className="accent-blue-400"/>
              Email Notifications
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <GlassButton className="flex gap-2 items-center"><Shield className="w-4 h-4"/> Change Password</GlassButton>
            <GlassButton className="flex gap-2 items-center"><Bell className="w-4 h-4"/> Notification Settings</GlassButton>
          </div>
          <div className="mt-5">
            <GlassButton className="bg-red-500/40 border-red-400/20 text-white w-full flex gap-2 items-center" onClick={() => setShowDelete(true)}>
              <Trash2 className="w-4 h-4"/> Delete Account
            </GlassButton>
            <AnimatePresence>
              {showDelete && (
                <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} className="mt-3 p-4 bg-white/10 rounded-lg border border-red-400/20 text-white">
                  <div className="mb-2"><EyeOff className="w-5 h-5 inline mr-2"/>Are you sure you want to delete your account? This cannot be undone.</div>
                  <div className="flex gap-2">
                    <GlassButton className="bg-red-500/60 border-red-400/20" onClick={() => alert("Account deleted (mock)!")}>Yes, Delete</GlassButton>
                    <GlassButton onClick={() => setShowDelete(false)}>Cancel</GlassButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black pb-20 overflow-x-hidden pt-20">
      <section className="max-w-5xl mx-auto px-4 sm:px-8 pt-12">
        <div className="flex justify-between items-center mb-8">
          <ProfileHeader user={profile} setUser={setProfile} />
          <Link href="/creator">
            <GlassButton className="flex items-center gap-2">
              <Plus className="w-5 h-5" /> Create Course
            </GlassButton>
          </Link>
        </div>
        {/* Tab Nav */}
        <div className="flex gap-3 mb-7 mt-1">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={classNames(
                "px-5 py-2 rounded-xl font-bold transition-all",
                tab === t
                  ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 text-white shadow-glass"
                  : "bg-white/10 text-white/80 border border-white/10 backdrop-blur-md"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div>
          {tab === "Overview" && renderOverview()}
          {tab === "Courses" && renderCourses()}
          {tab === "Achievements" && renderAchievements()}
          {tab === "Activity" && renderActivity()}
          {tab === "Settings" && <SettingsTab privacy={profile.privacy} />}
        </div>
      </section>
    </div>
  );
}