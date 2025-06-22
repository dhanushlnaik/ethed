"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { LucideStar, LucideSearch, LucideHeart, LucideChevronLeft, LucideChevronRight } from "lucide-react";
import Image from "next/image";
import classNames from "classnames";
import { useRouter } from "next/navigation";

const categoryFilters = ["Beginner", "Intermediate", "Advanced", "DeFi", "NFTs", "Smart Contracts"];
const sortOptions = [
  { label: "Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Price", value: "price" },
  { label: "Rating", value: "rating" },
];

export interface Course {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  duration: number; // hours
  price: number; // 0 = Free
  category: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string;
  description: string;
}

const sampleCourses: Course[] = [
  {
    id: "eth-fundamentals",
    title: "Ethereum Fundamentals",
    instructor: "Alice Smith",
    rating: 4.7,
    duration: 4,
    price: 0,
    category: ["Beginner", "Ethereum"],
    level: "Beginner",
    thumbnail: "/images/courses/eth-fundamentals.jpg",
    description: "Learn the basics of Ethereum, wallets, transactions, and smart contracts.",
  },
  {
    id: "smart-contract-dev",
    title: "Smart Contract Development",
    instructor: "Bob Lee",
    rating: 4.8,
    duration: 12,
    price: 99,
    category: ["Intermediate", "Smart Contracts"],
    level: "Intermediate",
    thumbnail: "/images/courses/smart-contract-dev.jpg",
    description: "Build, test, and deploy secure smart contracts on Ethereum using Solidity.",
  },
  {
    id: "defi-protocol-design",
    title: "DeFi Protocol Design",
    instructor: "Cynthia Wu",
    rating: 4.9,
    duration: 20,
    price: 199,
    category: ["Advanced", "DeFi"],
    level: "Advanced",
    thumbnail: "/images/courses/defi-protocol-design.jpg",
    description: "Master DeFi: liquidity pools, lending, staking, yield farming, and protocol design.",
  },
  {
    id: "nft-marketplace",
    title: "NFT Marketplace Creation",
    instructor: "David Kim",
    rating: 4.6,
    duration: 16,
    price: 149,
    category: ["Intermediate", "NFTs"],
    level: "Intermediate",
    thumbnail: "/images/courses/nft-marketplace.jpg",
    description: "Create and launch your own NFT marketplace with ERC721/ERC1155 contracts.",
  },
  {
    id: "web3-security-audit",
    title: "Web3 Security Auditing",
    instructor: "Elena Parker",
    rating: 4.9,
    duration: 24,
    price: 299,
    category: ["Advanced", "Security"],
    level: "Advanced",
    thumbnail: "/images/courses/web3-security-audit.jpg",
    description: "Audit smart contracts, find vulnerabilities, and secure Web3 protocols.",
  },
];

// Helper for Stars
function Stars({ rating }: { rating: number }) {
  const stars = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <LucideStar key={i} size={16} className={classNames(i < stars ? "text-yellow-400" : "text-gray-400", "fill-current")} />
      ))}
      <span className="ml-1 text-xs text-white/70">{rating.toFixed(1)}</span>
    </div>
  );
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={classNames(
        "backdrop-blur-md bg-white/10 text-xs px-2 py-0.5 rounded-full font-semibold",
        className
      )}
    >
      {children}
    </span>
  );
}

function LevelIndicator({ level }: { level: Course["level"] }) {
  const color =
    level === "Beginner"
      ? "bg-cyan-400 text-cyan-900"
      : level === "Intermediate"
      ? "bg-purple-400 text-purple-950"
      : "bg-blue-400 text-blue-950";
  return (
    <span className={classNames("rounded px-2 py-0.5 text-xs font-bold", color)}>
      {level}
    </span>
  );
}

function GlassButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={classNames(
        "backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all text-white font-semibold rounded-lg px-4 py-2 shadow-glass hover:scale-105 active:scale-95",
        className
      )}
    >
      {children}
    </button>
  );
}

function GlassInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    />
  );
}

function GlassChip({ active, label, onClick }: { active: boolean; label: string; onClick?: () => void }) {
  return (
    <button
      className={classNames(
        "px-3 py-1 rounded-full mr-2 mb-2 text-sm font-medium transition border",
        "backdrop-blur-md bg-white/10 border-white/20 hover:bg-blue-400/20 hover:text-blue-300",
        active ? "bg-blue-400/20 text-blue-300 border-blue-400" : "text-white/80 border-transparent"
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function useResponsiveSidebar() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}

function CoursePreviewModal({
  course,
  onClose,
  onWishlist,
  wished,
}: {
  course: Course | null;
  onClose: () => void;
  onWishlist: () => void;
  wished: boolean;
}) {
  if (!course) return null;
  return (
    <motion.div
      key={course.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
    >
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-lg w-full relative shadow-glass border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 px-2 py-1 text-white/70 hover:text-white rounded"
        >
          ✕
        </button>
        <div className="flex flex-col items-center">
          <Image
            src={course.thumbnail}
            alt={course.title}
            width={320}
            height={180}
            className="rounded-lg object-cover aspect-video mb-4"
          />
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent text-center">
            {course.title}
          </h2>
          <div className="flex gap-2 mt-2 items-center">
            <Badge>{course.price === 0 ? "Free" : `$${course.price}`}</Badge>
            <LevelIndicator level={course.level} />
            <Badge>{course.duration}h</Badge>
          </div>
          <div className="mt-2 mb-3">
            <Stars rating={course.rating} />
          </div>
          <p className="text-white/80 text-center mb-4">{course.description}</p>
          <div className="flex gap-3 justify-center">
            <GlassButton>Enroll Now</GlassButton>
            <button
              onClick={onWishlist}
              className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-pink-400/30 transition-all text-white font-semibold rounded-lg px-4 py-2 shadow-glass flex items-center gap-2"
            >
              <LucideHeart
                size={18}
                className={wished ? "fill-pink-400 text-pink-400" : "text-white/70"}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              />
              Wishlist
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CoursesCatalogPage() {
  const router = useRouter();
  // Filters state
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [duration, setDuration] = useState<[number, number]>([0, 24]);
  const [price, setPrice] = useState<[number, number]>([0, 299]);
  const [levels, setLevels] = useState<string[]>([]);
  const [wished, setWished] = useState<string[]>([]);
  const [preview, setPreview] = useState<Course | null>(null);

  // Responsive sidebar
  const { open, setOpen } = useResponsiveSidebar();

  // Filtering
  const filteredCourses = useMemo(() => {
    return sampleCourses
      .filter((c) =>
        (!search ||
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase())) &&
        (selectedCategories.length === 0 ||
          selectedCategories.some((cat) => c.category.includes(cat) || c.level === cat)) &&
        c.duration >= duration[0] &&
        c.duration <= duration[1] &&
        c.price >= price[0] &&
        c.price <= price[1] &&
        (levels.length === 0 || levels.includes(c.level))
      )
      .sort((a, b) => {
        if (sort === "popular") return b.rating - a.rating;
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "price") return a.price - b.price;
        if (sort === "newest") return b.duration - a.duration; // Placeholder for "newest"
        return 0;
      });
  }, [search, selectedCategories, duration, price, levels, sort]);

  // Pagination
  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filteredCourses.length / PAGE_SIZE);
  const pagedCourses = filteredCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Animation for dynamic title
  const heroWords = ["Ethereum", "DeFi", "NFT", "Smart Contract"];
  const [heroWordIdx, setHeroWordIdx] = useState(0);
  React.useEffect(() => {
    const i = setInterval(() => setHeroWordIdx((x) => (x + 1) % heroWords.length), 1700);
    return () => clearInterval(i);
  }, []);

  // Sidebar filters
  function updateLevel(level: string) {
    setLevels((prev) => prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]);
  }

  // Wishlist logic
  function toggleWishlist(id: string) {
    setWished((prev) => prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]);
  }

  // Render
  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-charcoal via-blue-950 to-black overflow-x-hidden pb-16">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-24 pb-14 px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mx-auto rounded-3xl shadow-glass border border-white/15 bg-white/10 backdrop-blur-md px-6 py-10 flex flex-col items-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent text-center">
            Explore <motion.span
              key={heroWordIdx}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.5 }}
            >
              {heroWords[heroWordIdx]}
            </motion.span> Courses
          </h1>
          <p className="text-white/80 mb-6 text-lg text-center">
            Interactive blockchain education for all skill levels.
          </p>
          <div className="flex flex-col sm:flex-row w-full gap-3 items-center">
            <div className="flex-1 w-full relative">
              <GlassInput
                placeholder="Search courses"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
              <LucideSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={20} />
            </div>
            <div className="flex flex-wrap gap-1 mt-2 sm:mt-0">
              {categoryFilters.map((cat) => (
                <GlassChip
                  key={cat}
                  label={cat}
                  active={selectedCategories.includes(cat)}
                  onClick={() =>
                    setSelectedCategories((prev) =>
                      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                    )
                  }
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Layout: Sidebar + Grid */}
      <div className="flex gap-6 max-w-7xl mx-auto px-3 sm:px-8">
        {/* Sidebar */}
        <aside
          className={classNames(
            "min-w-[220px] max-w-xs w-full hidden lg:block pt-2",
            "sticky top-28 h-fit"
          )}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-6 shadow-glass"
          >
            <h3 className="text-lg font-bold text-white mb-4">Advanced Filters</h3>
            {/* Duration Slider */}
            <div className="mb-4">
              <label className="block text-white/80 text-sm mb-1">Duration (hrs)</label>
              <input
                type="range"
                min={0}
                max={24}
                value={duration[1]}
                onChange={(e) => setDuration([0, Number(e.target.value)])}
                className="w-full accent-blue-400 bg-transparent"
              />
              <div className="text-xs text-white/60 mt-1 flex justify-between">
                <span>0</span>
                <span>{duration[1]}</span>
                <span>24+</span>
              </div>
            </div>
            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-white/80 text-sm mb-1">Price ($)</label>
              <input
                type="range"
                min={0}
                max={299}
                value={price[1]}
                onChange={(e) => setPrice([0, Number(e.target.value)])}
                className="w-full accent-purple-400 bg-transparent"
              />
              <div className="text-xs text-white/60 mt-1 flex justify-between">
                <span>Free</span>
                <span>${price[1]}</span>
                <span>299+</span>
              </div>
            </div>
            {/* Skill Levels */}
            <div className="mb-4">
              <label className="block text-white/80 text-sm mb-1">Skill Level</label>
              <div className="flex flex-wrap gap-2">
                {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                  <label key={lvl} className="flex items-center gap-1 text-white/70 text-sm">
                    <input
                      type="checkbox"
                      checked={levels.includes(lvl)}
                      onChange={() => updateLevel(lvl)}
                      className="accent-blue-400"
                    />
                    {lvl}
                  </label>
                ))}
              </div>
            </div>
            {/* Topic Tags */}
            <div className="mb-4">
              <label className="block text-white/80 text-sm mb-1">Topics</label>
              <div className="flex flex-wrap gap-1">
                {categoryFilters.map((tag) => (
                  <GlassChip
                    key={tag}
                    label={tag}
                    active={selectedCategories.includes(tag)}
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(tag) ? prev.filter((c) => c !== tag) : [...prev, tag]
                      )
                    }
                  />
                ))}
              </div>
            </div>
            <GlassButton className="w-full mt-2" onClick={() => {
              setSearch(""); setSelectedCategories([]); setDuration([0, 24]);
              setPrice([0, 299]); setLevels([]); setPage(1);
            }}>Clear Filters</GlassButton>
          </motion.div>
        </aside>

        {/* Grid + Filters */}
        <main className="flex-1">
          {/* Sort Options (above grid) */}
          <div className="flex justify-between items-center mb-4">
            <div className="lg:hidden">
              <GlassButton onClick={() => setOpen((v) => !v)}>
                {open ? "Hide Filters" : "Show Filters"}
              </GlassButton>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-6 shadow-glass mt-3 w-full max-w-xs"
                >
                  {/* Same as sidebar */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Advanced Filters</h3>
                    {/* Duration Slider */}
                    <div className="mb-4">
                      <label className="block text-white/80 text-sm mb-1">Duration (hrs)</label>
                      <input
                        type="range"
                        min={0}
                        max={24}
                        value={duration[1]}
                        onChange={(e) => setDuration([0, Number(e.target.value)])}
                        className="w-full accent-blue-400 bg-transparent"
                      />
                      <div className="text-xs text-white/60 mt-1 flex justify-between">
                        <span>0</span>
                        <span>{duration[1]}</span>
                        <span>24+</span>
                      </div>
                    </div>
                    {/* Price Range */}
                    <div className="mb-4">
                      <label className="block text-white/80 text-sm mb-1">Price ($)</label>
                      <input
                        type="range"
                        min={0}
                        max={299}
                        value={price[1]}
                        onChange={(e) => setPrice([0, Number(e.target.value)])}
                        className="w-full accent-purple-400 bg-transparent"
                      />
                      <div className="text-xs text-white/60 mt-1 flex justify-between">
                        <span>Free</span>
                        <span>${price[1]}</span>
                        <span>299+</span>
                      </div>
                    </div>
                    {/* Skill Levels */}
                    <div className="mb-4">
                      <label className="block text-white/80 text-sm mb-1">Skill Level</label>
                      <div className="flex flex-wrap gap-2">
                        {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                          <label key={lvl} className="flex items-center gap-1 text-white/70 text-sm">
                            <input
                              type="checkbox"
                              checked={levels.includes(lvl)}
                              onChange={() => updateLevel(lvl)}
                              className="accent-blue-400"
                            />
                            {lvl}
                          </label>
                        ))}
                      </div>
                    </div>
                    {/* Topic Tags */}
                    <div className="mb-4">
                      <label className="block text-white/80 text-sm mb-1">Topics</label>
                      <div className="flex flex-wrap gap-1">
                        {categoryFilters.map((tag) => (
                          <GlassChip
                            key={tag}
                            label={tag}
                            active={selectedCategories.includes(tag)}
                            onClick={() =>
                              setSelectedCategories((prev) =>
                                prev.includes(tag) ? prev.filter((c) => c !== tag) : [...prev, tag]
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <GlassButton className="w-full mt-2" onClick={() => {
                      setSearch(""); setSelectedCategories([]); setDuration([0, 24]);
                      setPrice([0, 299]); setLevels([]); setPage(1);
                    }}>Clear Filters</GlassButton>
                  </div>
                </motion.div>
              )}
            </div>
            <div>
              <label className="text-white/70 text-sm mr-2">Sort by:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-md px-3 py-1 bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
            {pagedCourses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ scale: 1.04 }}
                className="group rounded-2xl bg-white/10 backdrop-blur-md shadow-glass border border-white/15 flex flex-col cursor-pointer transition-all relative overflow-hidden"
                onClick={() => router.push(`/courses/${course.id}`)} // <-- Navigate to dynamic route
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    className="absolute top-3 right-3 z-10 p-2 bg-white/20 rounded-full hover:bg-pink-400/30 transition-all"
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(course.id); }}
                  >
                    <LucideHeart
                      size={18}
                      className={wished.includes(course.id) ? "fill-pink-400 text-pink-400" : "text-white/70"}
                      aria-label={wished.includes(course.id) ? "Remove from wishlist" : "Add to wishlist"}
                    />
                  </button>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-white mb-1 line-clamp-2">{course.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
                    <span>by {course.instructor}</span>
                  </div>
                  <Stars rating={course.rating} />
                  <div className="flex gap-2 mt-2 mb-4 flex-wrap">
                    <Badge>{course.price === 0 ? "Free" : `$${course.price}`}</Badge>
                    <Badge>{course.duration}h</Badge>
                    <LevelIndicator level={course.level} />
                  </div>
                  <GlassButton
                    className="mt-auto w-full"
                    onClick={(e) => { e.stopPropagation(); /* handle enroll */ }}
                  >Enroll Now</GlassButton>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              <GlassButton disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <LucideChevronLeft size={18} /> Prev
              </GlassButton>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <GlassButton
                    key={i}
                    className={classNames(
                      "px-3 py-1 mx-0.5",
                      page === i + 1 ? "bg-blue-400/30 ring-2 ring-blue-400" : ""
                    )}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </GlassButton>
                ))}
              </div>
              <GlassButton disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                Next <LucideChevronRight size={18} />
              </GlassButton>
            </div>
          )}
        </main>
      </div>
      {/* Preview Modal */}
      {preview && (
        <CoursePreviewModal
          course={preview}
          onClose={() => setPreview(null)}
          onWishlist={() => toggleWishlist(preview.id)}
          wished={wished.includes(preview.id)}
        />
      )}
    </div>
  );
}