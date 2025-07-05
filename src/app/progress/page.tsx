"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, BookOpen, Clock, Medal, Star, Calendar, TrendingUp, Award } from "lucide-react";
import { Line, Bar, Radar } from "react-chartjs-2";
import classNames from "classnames";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

// --- Interfaces ---
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  date: string;
  unlocked: boolean;
}
interface UserProgress {
  coursesCompleted: number;
  coursesEnrolled: number;
  totalHours: number;
  currentStreak: number;
  points: number;
  level: number;
  achievements: Achievement[];
}

// --- Sample Data ---
const user = {
  name: "Ayu",
};
const userProgress: UserProgress = {
  coursesCompleted: 8,
  coursesEnrolled: 12,
  totalHours: 88,
  currentStreak: 7,
  points: 4200,
  level: 5,
  achievements: [
    {
      id: "achv1",
      title: "Solidity Novice",
      description: "Completed first smart contract lesson",
      icon: <Award className="w-5 h-5 text-yellow-300" />,
      date: "2025-06-10",
      unlocked: true,
    },
    {
      id: "achv2",
      title: "DeFi Explorer",
      description: "Finished 3 DeFi modules",
      icon: <Trophy className="w-5 h-5 text-purple-400" />,
      date: "2025-06-16",
      unlocked: true,
    },
    {
      id: "achv3",
      title: "NFT Creator",
      description: "Minted first NFT",
      icon: <Star className="w-5 h-5 text-cyan-300" />,
      date: "2025-06-18",
      unlocked: true,
    },
    {
      id: "achv4",
      title: "Streak Master",
      description: "7-day learning streak",
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      date: "2025-06-22",
      unlocked: false,
    },
  ],
};

// Recent activity sample
const recentActivities = [
  {
    id: "r1",
    type: "lesson",
    icon: <BookOpen className="w-6 h-6 text-blue-400" />,
    title: "Completed: Solidity Functions",
    date: "2025-06-21",
    desc: "Lesson completed in Smart Contract Dev",
  },
  {
    id: "r2",
    type: "course",
    icon: <Trophy className="w-7 h-7 text-yellow-400 animate-bounce" />,
    title: "Course Completed: Ethereum Fundamentals",
    date: "2025-06-20",
    desc: "🎉 Congratulations! You finished the course.",
  },
  {
    id: "r3",
    type: "achievement",
    icon: <Award className="w-6 h-6 text-purple-400 animate-pulse" />,
    title: "Achievement Unlocked: DeFi Explorer",
    date: "2025-06-19",
    desc: "Unlocked for completing DeFi modules.",
  },
  {
    id: "r4",
    type: "community",
    icon: <Star className="w-6 h-6 text-cyan-400" />,
    title: "Commented: NFT Marketplace Q&A",
    date: "2025-06-18",
    desc: "You replied to a discussion thread.",
  },
];

// Sample analytics data
const weeklyLearningData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Hours Learned",
      data: [2, 1, 3, 2, 4, 1.5, 2.5],
      backgroundColor: "rgba(59, 130, 246, 0.4)",
      borderColor: "#3B82F6",
      tension: 0.5,
      fill: true,
      pointBorderWidth: 3,
      pointRadius: 5,
      pointBackgroundColor: "#8B5CF6",
    },
  ],
};
const completionTimelineData = {
  labels: ["Apr", "May", "Jun"],
  datasets: [
    {
      label: "Courses Completed",
      data: [2, 3, 8],
      backgroundColor: ["#0EA5E9", "#3B82F6", "#8B5CF6"],
      borderRadius: 5,
    },
  ],
};
const radarSkillData = {
  labels: ["Solidity", "DeFi", "NFTs", "Security", "dApps", "UX"],
  datasets: [
    {
      label: "Skill Progression",
      data: [80, 72, 65, 55, 60, 77],
      backgroundColor: "rgba(139, 92, 246, 0.3)",
      borderColor: "#8B5CF6",
      pointBackgroundColor: "#0EA5E9",
      pointBorderColor: "#fff",
      borderWidth: 2,
    },
  ],
};
const performanceTrendData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Performance (%)",
      data: [72, 78, 82, 90],
      borderColor: "#0EA5E9",
      backgroundColor: "rgba(14, 165, 233, 0.15)",
      fill: true,
      tension: 0.4,
      pointBorderWidth: 2,
      pointBackgroundColor: "#8B5CF6",
    },
  ],
};

// Sample goals data
const goals = [
  { id: "g1", label: "Finish DeFi Protocol Design", due: "2025-06-25" },
  { id: "g2", label: "7-day Streak", due: "2025-06-24" },
  { id: "g3", label: "Pass NFT Certification", due: "2025-07-01" },
];

// --- Glass Card Component ---
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

// --- Progress Ring Chart ---
function ProgressRing({ percent }: { percent: number }) {
  const angle = (percent / 100) * 283;
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg width="128" height="128">
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="#1e293b"
          strokeWidth="18"
          fill="none"
        />
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="url(#gradientProgress)"
          strokeWidth="18"
          fill="none"
          strokeDasharray="283"
          strokeDashoffset={283 - angle}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.7s" }}
        />
        <defs>
          <linearGradient id="gradientProgress" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-2xl text-white">{Math.round(percent)}%</span>
        <span className="text-xs text-white/70 mt-1">Overall</span>
      </span>
    </div>
  );
}

// --- Animated Counter ---
function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  React.useEffect(() => {
    let frame: number;
    let count = 0;
    function animate() {
      if (count < value) {
        count += Math.ceil((value - count) / 12);
        setDisplay(Math.min(count, value));
        frame = requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <span>{display}</span>;
}

// --- Dashboard Page ---
export default function ProgressDashboardPage() {
  const overallPercent = (userProgress.coursesCompleted / userProgress.coursesEnrolled) * 100;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black pb-20 overflow-x-hidden pt-20">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-7 items-center">
          <GlassCard className="flex flex-col items-center md:items-start justify-center md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Welcome back, <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">{user.name}</span>!
            </h2>
            <span className="text-white/80 mb-4">Here’s your learning progress at a glance.</span>
            <div className="flex flex-row md:flex-col gap-5 md:gap-2 items-center">
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm text-cyan-300 border border-cyan-400/30 font-bold shadow-glass">
                <Trophy className="w-5 h-5" /> Level {userProgress.level}
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm text-purple-300 border border-purple-400/30 font-bold shadow-glass">
                <Star className="w-5 h-5" /> <AnimatedCounter value={userProgress.points} /> XP
              </span>
            </div>
          </GlassCard>
          <GlassCard className="flex flex-col items-center justify-center">
            <ProgressRing percent={overallPercent} />
          </GlassCard>
          <GlassCard className="flex flex-col items-center gap-3 justify-center">
            <span className="text-white/80">Current Streak</span>
            <div className="flex flex-col items-center justify-center">
              <Flame className="w-10 h-10 text-orange-400 animate-pulse" />
              <span className="text-3xl font-extrabold text-white">
                <AnimatedCounter value={userProgress.currentStreak} />d
              </span>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Statistics Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-7">
          <GlassCard>
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-7 h-7 text-cyan-400" />
              <span className="font-semibold text-white text-lg">Courses</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              <AnimatedCounter value={userProgress.coursesCompleted} /> /
              <span className="text-cyan-400">{userProgress.coursesEnrolled}</span>
            </div>
            <div className="text-xs text-white/60">Completed / Enrolled</div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-7 h-7 text-blue-400" />
              <span className="font-semibold text-white text-lg">Learning Hours</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              <AnimatedCounter value={userProgress.totalHours} />
              <span className="text-blue-400 text-xl">h</span>
            </div>
            <div className="relative w-full h-2 mt-2 rounded-full bg-white/15 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(userProgress.totalHours / 100) * 100}%` }}
                transition={{ duration: 0.8, type: "spring" }}
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 rounded-full"
              />
            </div>
            <div className="text-xs text-white/60 mt-1">This year</div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-7 h-7 text-purple-400" />
              <span className="font-semibold text-white text-lg">Skill Progress</span>
            </div>
            <div className="w-full flex flex-col gap-2">
              <div>
                <span className="text-xs text-white/70">Solidity</span>
                <div className="w-full h-2 bg-white/15 rounded-full">
                  <div className="h-full bg-cyan-400/80 rounded-full transition-all duration-700" style={{ width: "80%" }} />
                </div>
              </div>
              <div>
                <span className="text-xs text-white/70">DeFi</span>
                <div className="w-full h-2 bg-white/15 rounded-full">
                  <div className="h-full bg-purple-400/80 rounded-full transition-all duration-700" style={{ width: "70%" }} />
                </div>
              </div>
              <div>
                <span className="text-xs text-white/70">NFTs</span>
                <div className="w-full h-2 bg-white/15 rounded-full">
                  <div className="h-full bg-blue-400/80 rounded-full transition-all duration-700" style={{ width: "65%" }} />
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3 mb-3">
              <Medal className="w-7 h-7 text-yellow-400" />
              <span className="font-semibold text-white text-lg">Achievements</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {userProgress.achievements
                .filter((a) => a.unlocked)
                .map((a) => (
                  <span key={a.id} className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs text-purple-200 border border-purple-400/30 font-bold shadow-glass animate-bounce">
                    {a.icon}
                    {a.title}
                  </span>
                ))}
            </div>
            <div className="text-xs text-white/60 mt-2">{userProgress.achievements.filter((a) => a.unlocked).length} unlocked</div>
          </GlassCard>
        </div>
      </section>

      {/* Recent Activity Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-7">
        <GlassCard>
          <h3 className="text-xl font-bold text-white mb-5">Recent Activity</h3>
          <ul className="space-y-4">
            {recentActivities.map((a) => (
              <li key={a.id} className="flex items-center gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                <div className="rounded-full bg-white/10 p-3 flex items-center justify-center shadow-glass">{a.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-white">{a.title}</div>
                  <div className="text-xs text-white/60">{a.desc}</div>
                </div>
                <span className="text-xs text-white/40">{a.date}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </section>

      {/* Analytics Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-7">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          <GlassCard>
            <h4 className="text-md font-bold text-white mb-3">Weekly Learning Time</h4>
            <div style={{ height: 180 }}>
              <Bar
                data={weeklyLearningData}
                options={{
                  plugins: { legend: { display: false } },
                  scales: { y: { ticks: { color: "#fff" } }, x: { ticks: { color: "#fff" } } },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </GlassCard>
          <GlassCard>
            <h4 className="text-md font-bold text-white mb-3">Completion Timeline</h4>
            <div style={{ height: 180 }}>
              <Line
                data={completionTimelineData}
                options={{
                  plugins: { legend: { display: false } },
                  scales: { y: { ticks: { color: "#fff" } }, x: { ticks: { color: "#fff" } } },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                height={130}
              />
            </div>
          </GlassCard>
          <GlassCard>
            <h4 className="text-md font-bold text-white mb-3">Skill Radar</h4>
            <div style={{ height: 180 }}>
              <Radar
                data={radarSkillData}
                options={{
                  plugins: { legend: { display: false } },
                  scales: { r: { angleLines: { color: "#3B82F6" }, pointLabels: { color: "#fff" }, ticks: { color: "#fff" } } },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </GlassCard>
          <GlassCard>
            <h4 className="text-md font-bold text-white mb-3">Performance Trend</h4>
            <div style={{ height: 180 }}>
              <Line
                data={performanceTrendData}
                options={{
                  plugins: { legend: { display: false } },
                  scales: { y: { ticks: { color: "#fff" } }, x: { ticks: { color: "#fff" } } },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Upcoming Deadlines/Goals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-7">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {goals.map((g) => (
            <GlassCard key={g.id} className="flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-white">{g.label}</div>
                <div className="flex items-center gap-1 text-xs text-white/60 mt-1">
                  <Calendar className="w-4 h-4" /> Due {g.due}
                </div>
              </div>
              <button className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 text-white font-semibold px-4 py-2 rounded-xl shadow-glass transition hover:scale-105 border-none">
                Set Reminder
              </button>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}