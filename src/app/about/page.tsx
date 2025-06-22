"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Users, BookOpen, Medal, Send, Briefcase, X, Linkedin, Twitter, Globe } from "lucide-react";
import classNames from "classnames";

// --- Types ---
interface SocialLink {
  type: "LinkedIn" | "Twitter" | "Website";
  url: string;
  icon?: React.ReactNode;
}
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  socialLinks: SocialLink[];
  expertise: string[];
}
interface CompanyMilestone {
  date: Date;
  title: string;
  description: string;
  image?: string;
}

// --- Sample Data ---
const stats = [
  { label: "Students", value: 8200, icon: <Users className="w-8 h-8 text-cyan-400" /> },
  { label: "Courses", value: 47, icon: <BookOpen className="w-8 h-8 text-purple-400" /> },
  { label: "NFT Certificates", value: 1700, icon: <Medal className="w-8 h-8 text-yellow-400" /> }
];

const milestones: CompanyMilestone[] = [
  {
    date: new Date("2022-01-01"),
    title: "Founded Eth.Ed",
    description: "Launched with a vision to democratize Ethereum education globally.",
    image: "/images/about/founders.jpg"
  },
  {
    date: new Date("2022-06-01"),
    title: "First 1000 Students",
    description: "Reached a major milestone, validating our mission and model.",
    image: "/images/about/first-1000.jpg"
  },
  {
    date: new Date("2023-03-01"),
    title: "Partnership with Polygon",
    description: "Teamed up with Polygon to expand DeFi and NFT learning.",
    image: "/images/about/polygon-partnership.jpg"
  },
  {
    date: new Date("2024-02-01"),
    title: "NFT Certificate Launch",
    description: "Became the first platform to offer on-chain NFT certificates for course completions.",
    image: "/images/about/nft-cert-launch.jpg"
  },
  {
    date: new Date("2025-03-01"),
    title: "8,000+ Students",
    description: "Our global community keeps growing with learners from 70+ countries.",
    image: "/images/about/global-students.jpg"
  }
];

const team: TeamMember[] = [
  {
    name: "Ayu Shetty",
    role: "Co-founder & CEO",
    bio: "Blockchain educator, developer, and vision-setter. Passionate about empowering the next generation of Ethereum builders.",
    image: "/images/team/ayu.jpg",
    socialLinks: [
      { type: "LinkedIn", url: "https://linkedin.com/in/ayu", icon: <Linkedin className="w-5 h-5"/> },
      { type: "Twitter", url: "https://twitter.com/ayu_eth", icon: <Twitter className="w-5 h-5"/> }
    ],
    expertise: ["Ethereum", "Strategy", "Community"]
  },
  {
    name: "Cynthia Wu",
    role: "Head of Education",
    bio: "DeFi specialist and curriculum architect. Making blockchain concepts accessible for all.",
    image: "/images/team/cynthia.jpg",
    socialLinks: [
      { type: "LinkedIn", url: "https://linkedin.com/in/cynthia-wu", icon: <Linkedin className="w-5 h-5"/> },
      { type: "Twitter", url: "https://twitter.com/cynthiawu", icon: <Twitter className="w-5 h-5"/> }
    ],
    expertise: ["DeFi", "Teaching", "Content"]
  },
  {
    name: "Bob Lee",
    role: "Lead Developer",
    bio: "Smart contracts and dApps engineer. Building secure, scalable web3 infrastructure for learners.",
    image: "/images/team/bob.jpg",
    socialLinks: [
      { type: "LinkedIn", url: "https://linkedin.com/in/boblee", icon: <Linkedin className="w-5 h-5"/> }
    ],
    expertise: ["Solidity", "Security", "UX"]
  },
  {
    name: "Priya Patel",
    role: "Community Lead",
    bio: "Connecting students, mentors, and partners to foster collaboration and inclusivity.",
    image: "/images/team/priya.jpg",
    socialLinks: [
      { type: "Twitter", url: "https://twitter.com/priyapatel", icon: <Twitter className="w-5 h-5"/> }
    ],
    expertise: ["Community", "Events", "Support"]
  }
];

const values = [
  {
    title: "Open Knowledge",
    desc: "We believe blockchain education should be accessible and transparent.",
    icon: <BookOpen className="w-7 h-7 text-cyan-400" />
  },
  {
    title: "Innovation",
    desc: "We push boundaries, pioneering NFT certification and web3 learning.",
    icon: <Medal className="w-7 h-7 text-purple-400" />
  },
  {
    title: "Community First",
    desc: "Our learners and educators are at the heart of all we build.",
    icon: <Users className="w-7 h-7 text-blue-400" />
  },
  {
    title: "Diversity & Inclusion",
    desc: "We welcome and support learners from all backgrounds.",
    icon: <Star className="w-7 h-7 text-yellow-400" />
  }
];

const testimonials = [
  {
    name: "Elena P.",
    quote: "Eth.Ed made blockchain finally click. The NFT certificate is a badge I proudly display!",
    image: "/images/users/user1.jpg",
    role: "Smart Contract Developer"
  },
  {
    name: "Polygon Labs",
    quote: "Our partnership with Eth.Ed is accelerating web3 education for everyone.",
    image: "/images/about/polygon-logo.png",
    role: "Official Partner"
  }
];

const locations = [
  {
    city: "Bangalore, India",
    address: "MG Road, Bangalore 560001",
    image: "/images/about/blr-office.jpg"
  },
  {
    city: "Singapore",
    address: "Raffles Place, Singapore 048616",
    image: "/images/about/sgp-office.jpg"
  }
];

const jobs = [
  {
    title: "Senior Solidity Instructor",
    location: "Remote",
    desc: "Lead masterclasses and develop advanced curriculum for aspiring smart contract devs.",
    link: "#"
  },
  {
    title: "Community Manager",
    location: "Singapore",
    desc: "Grow and support our vibrant global learner community.",
    link: "#"
  }
];

// --- Glass Components ---
function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: "spring" }}
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
        "backdrop-blur-md bg-white/10 border border-white/20 text-white font-semibold rounded-lg px-5 py-3 shadow transition hover:bg-blue-400/20 hover:scale-105 active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// --- Animated Counter ---
function AnimatedCounter({ value, duration = 1.2 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  React.useEffect(() => {
    let frame: number;
    let startTime: number | null = null;
    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / (duration * 1000), 1);
      setDisplay(Math.floor(value * progress));
      if (progress < 1) frame = requestAnimationFrame(animate);
      else setDisplay(value);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return <span>{display.toLocaleString()}</span>;
}

// --- Modal for Team Member Profile ---
function TeamModal({ member, onClose }: { member: TeamMember | null; onClose: () => void }) {
  if (!member) return null;
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <GlassCard className="relative max-w-md w-full p-8">
        <button onClick={onClose} className="absolute top-3 right-4 text-white/60 hover:text-white"><X className="w-7 h-7"/></button>
        <div className="flex flex-col items-center gap-3">
          <img src={member.image} alt={member.name} className="w-28 h-28 rounded-full border-4 border-blue-400 mb-3"/>
          <div className="text-2xl font-bold text-white">{member.name}</div>
          <div className="bg-white/10 text-cyan-200 px-3 py-1 rounded-lg border border-cyan-400/30 font-bold shadow-glass mb-1">{member.role}</div>
          <div className="text-white/80 text-center mb-2">{member.bio}</div>
          <div className="flex gap-2 mb-2">
            {member.socialLinks.map(link => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full border border-white/20 hover:bg-blue-400/20 shadow-glass">
                {link.icon}
              </a>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {member.expertise.map(e => (
              <span key={e} className="bg-blue-400/30 text-blue-200 px-3 py-1 rounded-full text-xs font-medium">{e}</span>
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// --- Main About Page ---
export default function AboutPage() {
  const [teamFilter, setTeamFilter] = useState<"All" | "Founders" | "Educators" | "Developers">("All");
  const [teamModal, setTeamModal] = useState<TeamMember | null>(null);

  // Filtering logic (expand as team grows)
  const filteredTeam = team.filter(m =>
    teamFilter === "All" ||
    (teamFilter === "Founders" && m.role.toLowerCase().includes("founder")) ||
    (teamFilter === "Educators" && m.role.toLowerCase().includes("education")) ||
    (teamFilter === "Developers" && m.role.toLowerCase().includes("developer"))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center pt-20 pb-12">
        {/* Ethereum animation background */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: "radial-gradient(circle at 70% 30%, #0ea5e955, transparent 60%), radial-gradient(circle at 30% 70%, #8b5cf655, transparent 60%)"
          }}
        />
        <GlassCard className="relative z-10 max-w-3xl mx-auto text-center p-10">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-5"
          >
            Empowering the Next Generation of Ethereum Innovators
          </motion.h1>
          <p className="text-lg text-white/80 mb-8">
            Our mission: Deliver world-class blockchain education—accessible, practical, and future-proof.
          </p>
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            <GlassButton>Explore Courses</GlassButton>
            <GlassButton className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 text-white border-none">Join Community</GlassButton>
          </div>
          {/* Animated stats */}
          <div className="flex justify-center gap-10 mt-4 flex-wrap">
            {stats.map(stat => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-3xl font-extrabold text-white flex gap-2 items-center">
                  <AnimatedCounter value={stat.value} />
                  {stat.icon}
                </span>
                <span className="text-sm text-cyan-200">{stat.label}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* Our Story Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-14">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Story</h2>
        <div className="relative ml-5 border-l-2 border-cyan-400/20 pl-8">
          {milestones.map((m, idx) => (
            <motion.div
              key={m.title}
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.14 }}
              className="mb-12 last:mb-0 group"
            >
              <GlassCard className="relative group-hover:scale-[1.03] transition-transform duration-300 cursor-pointer">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  {m.image && (
                    <img src={m.image} className="w-32 h-32 object-cover rounded-xl border-4 border-blue-400" alt={m.title}/>
                  )}
                  <div>
                    <div className="text-sm text-cyan-200 font-semibold">{m.date.getFullYear()} / {m.date.toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-xl font-bold text-white mb-2">{m.title}</div>
                    <div className="text-white/80">{m.description}</div>
                    <motion.div className="mt-2 text-xs text-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {idx === 2 && "Polygon Partnership: Joint hackathons and scholarships"}
                      {idx === 3 && "NFT Certs: First 500 minted within 1 month"}
                      {idx === 4 && "Global: Students from 70+ countries"}
                    </motion.div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission & Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Mission & Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-7 mb-8">
          {values.map(v => (
            <GlassCard key={v.title} className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
              {v.icon}
              <div className="font-bold text-white mt-2">{v.title}</div>
              <div className="text-white/80 mt-1">{v.desc}</div>
            </GlassCard>
          ))}
        </div>
        {/* Impact & Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-8">
          <GlassCard className="flex flex-col items-center">
            <span className="text-4xl font-extrabold text-cyan-300 mb-1">
              <AnimatedCounter value={8200} />
            </span>
            <span className="text-white/80 mb-2">Students Impacted</span>
            <p className="text-white/70 text-center">From Africa to Asia, Eth.Ed learners are building the next wave of decentralized apps, DeFi protocols, and NFT projects.</p>
          </GlassCard>
          <GlassCard>
            <h4 className="text-lg font-bold text-white mb-2">Testimonials</h4>
            <div className="flex flex-col gap-5">
              {testimonials.map(t => (
                <div key={t.name} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover"/>
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-xs text-cyan-200 mb-1">{t.role}</div>
                    <div className="text-white/80">{t.quote}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Team Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Meet the Team</h2>
        {/* Role filter */}
        <div className="flex gap-3 justify-center mb-8">
          {(["All", "Founders", "Educators", "Developers"] as Array<"All" | "Founders" | "Educators" | "Developers">).map(role => (
            <GlassButton
              key={role}
              className={teamFilter === role ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 text-white border-none" : ""}
              onClick={() => setTeamFilter(role)}
            >
              {role}
            </GlassButton>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9">
          {filteredTeam.map(m => (
            <motion.div
              key={m.name}
              whileHover={{ scale: 1.05 }}
              className="relative"
              onClick={() => setTeamModal(m)}
              tabIndex={0}
            >
              <GlassCard className="flex flex-col items-center cursor-pointer group transition">
                <img src={m.image} alt={m.name} className="w-24 h-24 rounded-full border-4 border-blue-400 mb-3 group-hover:scale-105 transition"/>
                <div className="text-lg font-bold text-white">{m.name}</div>
                <div className="bg-white/10 text-cyan-200 px-3 py-1 rounded-lg border border-cyan-400/30 font-bold shadow-glass mb-1">{m.role}</div>
                <motion.div className="text-xs text-purple-200 mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {m.bio}
                  <div className="flex gap-2 mt-2 justify-center">
                    {m.socialLinks.map(link => (
                      <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full border border-white/20 hover:bg-blue-400/20 shadow-glass inline-block">
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </motion.div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        {/* Team Modal */}
        <AnimatePresence>
          {teamModal && <TeamModal member={teamModal} onClose={() => setTeamModal(null)} />}
        </AnimatePresence>
      </section>

      {/* Contact & Careers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Contact & Careers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <GlassCard>
            <h4 className="text-xl font-bold text-white mb-3">Get in Touch</h4>
            <form
              onSubmit={e => {
                e.preventDefault();
                alert("Message sent! (mock)");
              }}
              className="flex flex-col gap-3"
            >
              <input
                required
                className="rounded-lg px-4 py-2 bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="text"
                placeholder="Your Name"
              />
              <input
                required
                className="rounded-lg px-4 py-2 bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="email"
                placeholder="Your Email"
              />
              <textarea
                required
                className="rounded-lg px-4 py-2 bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                rows={3}
                placeholder="How can we help you?"
              />
              <GlassButton type="submit" className="mt-2 flex items-center gap-2 text-lg"><Send className="w-5 h-5"/>Send</GlassButton>
            </form>
          </GlassCard>
          {/* Office Locations + Jobs */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {locations.map(loc => (
                <GlassCard key={loc.city} className="flex flex-col items-center gap-2">
                  <img src={loc.image} alt={loc.city} className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-400"/>
                  <div className="font-bold text-white">{loc.city}</div>
                  <div className="text-xs text-white/80 text-center">{loc.address}</div>
                </GlassCard>
              ))}
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-2">We are hiring!</h4>
              <div className="flex flex-col gap-3">
                {jobs.map(job => (
                  <GlassCard key={job.title} className="flex flex-col gap-1">
                    <div className="font-bold text-white">{job.title}</div>
                    <div className="text-xs text-cyan-200">{job.location}</div>
                    <div className="text-white/80 mb-2">{job.desc}</div>
                    <a href={job.link} target="_blank" className="flex items-center gap-2 text-sm text-blue-300 hover:underline">Apply <Briefcase className="w-4 h-4"/></a>
                  </GlassCard>
                ))}
              </div>
            </div>
            {/* Social links */}
            <div className="mt-4 flex gap-2">
              <a href="https://twitter.com/ethed" target="_blank" className="bg-white/10 p-2 rounded-full border border-white/20 hover:bg-blue-400/20 shadow-glass"><Twitter className="w-5 h-5 text-cyan-300"/></a>
              <a href="https://linkedin.com/company/ethed" target="_blank" className="bg-white/10 p-2 rounded-full border border-white/20 hover:bg-blue-400/20 shadow-glass"><Linkedin className="w-5 h-5 text-blue-300"/></a>
              <a href="https://ethed.xyz" target="_blank" className="bg-white/10 p-2 rounded-full border border-white/20 hover:bg-blue-400/20 shadow-glass"><Globe className="w-5 h-5 text-purple-300"/></a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}